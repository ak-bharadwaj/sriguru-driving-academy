import React from 'react'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Bell, ArrowLeft, Trophy, CalendarClock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

// Mock Data for demonstration purposes if DB is empty
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Upcoming Session Alert',
    message: 'Your driving session with Capt. Vikram starts in 30 minutes. Please report to Zone A.',
    type: 'SCHEDULE',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Smooth Operator" badge for perfect clutch control.',
    type: 'GAMIFICATION',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '3',
    title: 'RTO Mock Exam Passed',
    message: 'Congratulations! You scored 95% on your theoretical mock exam.',
    type: 'ACADEMIC',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '4',
    title: 'Course Fee Received',
    message: 'We have received your payment of $250.00. Receipt #48291.',
    type: 'SYSTEM',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
]

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  let notifications: any[] = []

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (user) {
      notifications = await db.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      // Mark all as read when visited
      await db.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true }
      })
    }
  }

  // Use mock data if database is empty for demonstration purposes
  if (notifications.length === 0) {
    notifications = MOCK_NOTIFICATIONS
  }

  return (
    <div className="min-h-screen bg-void font-body text-text-1 pb-28 relative overflow-x-hidden pt-12">
      
      {/* -----------------------------
          BACKGROUND EFFECTS
          ----------------------------- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* -----------------------------
          HEADER BAR
          ----------------------------- */}
      <div className="max-w-2xl mx-auto px-6 relative z-10 mb-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/student/dashboard" className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-border/50 border border-border rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </Link>
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Bell className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold font-display text-white tracking-tight">Notifications</h1>
        <p className="text-text-3 text-sm mt-1">Stay updated on your learning journey.</p>
      </div>

      {/* -----------------------------
          NOTIFICATIONS LIST
          ----------------------------- */}
      <div className="max-w-2xl mx-auto px-6 relative z-10 flex flex-col gap-4">
        {notifications.map(notif => {
          let Icon = Bell
          let iconColor = 'text-primary'
          let bgColor = 'bg-primary/10 border-primary/20'

          if (notif.type === 'SCHEDULE') {
            Icon = CalendarClock
            iconColor = 'text-emerald-500'
            bgColor = 'bg-emerald-500/10 border-emerald-500/20'
          } else if (notif.type === 'GAMIFICATION') {
            Icon = Trophy
            iconColor = 'text-amber-500'
            bgColor = 'bg-amber-500/10 border-amber-500/20'
          } else if (notif.type === 'ACADEMIC') {
            Icon = ShieldCheck
            iconColor = 'text-accent'
            bgColor = 'bg-accent/10 border-accent/20'
          } else if (notif.type === 'SYSTEM') {
            Icon = CheckCircle2
            iconColor = 'text-text-3'
            bgColor = 'bg-surface border-border'
          }

          return (
            <div 
              key={notif.id} 
              className={`relative p-5 rounded-2xl border flex gap-4 transition-all hover:bg-surface/80 ${
                notif.isRead ? 'bg-void border-border opacity-70' : 'bg-surface border-border shadow-lg shadow-black/20'
              }`}
            >
              {/* Unread indicator */}
              {!notif.isRead && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${bgColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-bold text-sm md:text-base ${notif.isRead ? 'text-text-2' : 'text-white'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-text-3 font-mono shrink-0 pt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-xs md:text-sm mt-1 leading-relaxed ${notif.isRead ? 'text-text-3' : 'text-text-2'}`}>
                  {notif.message}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
