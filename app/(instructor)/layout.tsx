"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Award, Users, Calendar, MessageSquare, TrendingUp, Zap, Bell } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useNotifications } from '@/hooks/useNotifications'
import { motion, AnimatePresence } from 'framer-motion'

type NavTab = {
  label: string
  labelHI: string
  labelTE: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  isCenter?: boolean
}

const INSTRUCTOR_NAV: NavTab[] = [
  { label: 'Console',   labelHI: 'कंसोल',        labelTE: 'కన్సోల్',       path: '/instructor/dashboard',       icon: Award },
  { label: 'Roster',    labelHI: 'रोस्टर',       labelTE: 'రోస్టర్',       path: '/instructor/students',        icon: Users },
  { label: 'Schedule',  labelHI: 'शेड्यूल',      labelTE: 'షెడ్యూల్',      path: '/instructor/schedule',        icon: Zap, isCenter: true },
  { label: 'Notes',     labelHI: 'नोट्स',        labelTE: 'నోట్స్',        path: '/instructor/coaching-notes',  icon: MessageSquare },
  { label: 'Analytics', labelHI: 'विश्लेषिकी',   labelTE: 'విశ్లేషణలు',   path: '/instructor/analytics',       icon: TrendingUp },
]

export default function InstructorConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { language } = useLanguageStore()
  const lang = language.toUpperCase()

  const [mounted, setMounted] = React.useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = React.useState(false)
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getLabel = (tab: NavTab) => {
    if (!mounted) return tab.label // Safe fallback for hydration matching
    if (lang === 'HI') return tab.labelHI
    if (lang === 'TE') return tab.labelTE
    return tab.label
  }

  const isTabActive = (tab: NavTab) => {
    if (tab.path === '/instructor/dashboard') return pathname === tab.path
    return pathname === tab.path || pathname.startsWith(tab.path + '/')
  }

  const handleNotifClick = () => {
    setNotifDropdownOpen(!notifDropdownOpen)
    if (!notifDropdownOpen) {
      markAllAsRead()
    }
  }

  return (
    <div className="w-full flex flex-col bg-[rgb(var(--color-void))] relative font-body text-[rgb(var(--color-text-1))] transition-colors duration-300">

      {/* Main Content */}
      <div className="flex-1 relative z-10 pb-24 pt-4 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Top bar: Language, Theme & Notifications toggle */}
          <div className="flex justify-end items-center gap-2 mb-4 relative z-50">
            <ThemeToggle />
            <LanguageToggle />
            
            <button 
              onClick={handleNotifClick}
              className="relative p-2 bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-border))]/50 border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-2))] shadow-sm transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-[rgb(var(--color-text-2))]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {notifDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 w-72 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-xl overflow-hidden z-50 text-left"
                >
                  <div className="px-4 py-3 border-b border-[rgb(var(--color-border))] font-semibold text-sm">Notifications</div>
                  <div className="flex flex-col max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-[rgb(var(--color-text-3))] text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-[rgb(var(--color-surface))]/50 flex flex-col gap-1 transition-colors">
                          <p className="text-xs font-bold text-[rgb(var(--color-text-1))]">{n.title}</p>
                          <p className="text-xs text-[rgb(var(--color-text-2))]">{n.message}</p>
                          <span className="text-[10px] text-slate-400">{new Date(n.time).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {children}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-[500] bg-[rgb(var(--color-surface))] border-t border-[rgb(var(--color-border))]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav
          aria-label="Instructor navigation"
          className="flex items-end justify-around px-2 h-[72px] max-w-lg mx-auto relative"
        >
          {INSTRUCTOR_NAV.map((tab) => {
            const active = isTabActive(tab)
            const Icon = tab.icon
            const label = getLabel(tab)

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  aria-label={label}
                  className="relative -top-5 flex flex-col items-center gap-1 group"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow transition-all duration-300 group-hover:scale-105 active:scale-95 border-4 border-[rgb(var(--color-void))] ${
                    active ? 'bg-accent shadow-accent/20' : 'bg-[rgb(var(--color-primary))] shadow-primary/20'
                  }`}>
                    <Icon className="w-6 h-6 text-white stroke-[2.5]" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    active ? 'text-accent' : 'text-[rgb(var(--color-text-3))]'
                  }`}>{label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={tab.path}
                href={tab.path}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center w-16 h-full gap-1 pt-2 relative transition-colors duration-200"
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-[rgb(var(--color-primary))]" />
                )}
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  active ? 'text-[rgb(var(--color-primary))] stroke-[2.5]' : 'text-[rgb(var(--color-text-3))] stroke-2'
                }`} />
                <span className={`text-[12px] font-semibold transition-colors ${
                  active ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-3))]'
                }`}>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
