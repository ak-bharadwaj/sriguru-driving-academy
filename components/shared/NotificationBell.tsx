"use client"

import React, { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Clock, 
  Calendar, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  MailCheck
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Notification {
  id: string
  type: 'SESSION_REMINDER' | 'BADGE_EARNED' | 'FEEDBACK_RECEIVED' | 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'STREAK_AT_RISK'
  message: string
  time: string
  read: boolean
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Real-time polling with SWR every 60s (free tier constraint)
  const { data: notifications = [], mutate } = useSWR<Notification[]>(
    '/api/notifications',
    fetcher,
    { refreshInterval: 60000 }
  )

  const unreadCount = notifications.filter(n => !n.read).length

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mark single as read
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic UI update
    mutate(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
      false
    )

    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      // Trigger full api fetch in the background to ensure sync
      mutate()
    } catch (err) {
      console.error(err)
    }
  }

  // Mark all read
  const handleMarkAllRead = async () => {
    // Optimistic UI update
    mutate(
      notifications.map(n => ({ ...n, read: true })),
      false
    )

    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' })
      // Trigger background sync
      mutate()
    } catch (err) {
      console.error(err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SESSION_REMINDER':
        return <Calendar className="w-4 h-4 text-primary" />
      case 'BADGE_EARNED':
        return <Award className="w-4 h-4 text-accent" />
      case 'FEEDBACK_RECEIVED':
        return <MessageSquare className="w-4 h-4 text-success" />
      case 'BOOKING_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-success" />
      case 'BOOKING_REJECTED':
        return <XCircle className="w-4 h-4 text-danger" />
      case 'STREAK_AT_RISK':
        return <AlertTriangle className="w-4 h-4 text-accent animate-pulse" />
      default:
        return <Bell className="w-4 h-4 text-text-3" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Trigger Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-surface border border-border text-text-2 hover:text-text-1 transition-all duration-200 outline-none select-none"
      >
        <Bell className="w-4 h-4" />
        
        {/* Animated pulsing unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border border-surface shadow-md shadow-accent/20 animate-pulse"
            />
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-[320px] bg-surface border border-border rounded-2xl shadow-2xl z-50 text-left overflow-hidden"
          >
            
            <header className="px-4 py-3 border-b border-border/80 flex justify-between items-center bg-void/40">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-text-1 uppercase">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-accent/15 border border-accent/25 text-accent text-[8.5px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                    {unreadCount} NEW
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[8px] font-mono text-primary hover:underline uppercase font-bold flex items-center gap-1"
                >
                  <MailCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </header>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto scrollbar-none divide-y divide-border/40">
              {notifications.length === 0 ? (
                <div className="px-4 py-12 text-center text-text-3 text-[10px] font-mono flex flex-col items-center gap-2">
                  <Bell className="w-6 h-6 text-border" />
                  <span>NO NEW ALERTS REGISTERED.</span>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex gap-3 items-start transition-all duration-200 ${
                      notif.read ? 'opacity-60 bg-void/5 hover:opacity-100' : 'bg-primary/[0.02]'
                    }`}
                  >
                    
                    {/* Icon container */}
                    <div className="w-8 h-8 rounded-xl bg-void/60 border border-border/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                      <p className="text-[11px] text-text-1 font-body leading-normal">
                        {notif.message}
                      </p>
                      
                      <div className="flex justify-between items-center text-[8px] font-mono text-text-3 uppercase mt-1">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {notif.time}
                        </span>
                        
                        {!notif.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="text-primary hover:underline font-bold"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
