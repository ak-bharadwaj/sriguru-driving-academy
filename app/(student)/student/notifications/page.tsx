import React from 'react'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Bell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'



export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await db.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return null

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  // Mark all as read when visited
  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true }
  })

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] font-body text-[rgb(var(--color-text-1))] pb-28 relative overflow-hidden">
      
      {/* -----------------------------
          YELLOW DECORATIVE ACCENTS
          ----------------------------- */}
      {/* Large circle left side */}
      <div className="absolute top-[30%] -left-[150px] w-[300px] h-[300px] bg-app-yellow/80 rounded-full -z-10" />
      
      {/* Small circle top right */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-app-yellow/80 rounded-full -z-10" />

      {/* -----------------------------
          HEADER BAR
          ----------------------------- */}
      <div className="pt-12 pb-6 px-6 relative z-10 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/student/dashboard" className="p-2 hover:bg-[rgb(var(--color-border))] rounded-xl transition">
            <ArrowLeft className="w-6 h-6 text-[rgb(var(--color-text-1))]" />
          </Link>
          <h1 className="text-lg font-bold font-display">Notification</h1>
          <div className="p-2 bg-[rgb(var(--color-primary))] rounded-full">
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>

        <h2 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] px-1">All notification</h2>
      </div>

      {/* -----------------------------
          NOTIFICATIONS LIST
          ----------------------------- */}
      <div className="max-w-md mx-auto px-5 relative z-10 flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-[rgb(var(--color-text-3))] italic">You have no notifications yet.</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="bg-[rgb(var(--color-surface))] rounded-[24px] shadow-app p-5 border border-[rgb(var(--color-border))] relative overflow-hidden flex flex-col gap-2">
              {/* Optional blue accent bar for unread */}
              {!notif.isRead && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[rgb(var(--color-primary))]" />
              )}
              
              <h3 className="font-bold text-[rgb(var(--color-text-1))] text-sm">{notif.title}</h3>
              <p className="text-xs text-[rgb(var(--color-text-2))] leading-relaxed">
                {notif.message}
              </p>
              
              <span className="text-[10px] text-[rgb(var(--color-text-3))] font-medium mt-1">
                {new Date(notif.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
