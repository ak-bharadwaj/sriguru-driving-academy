import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Live feed records simulated with relative timings
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Fetch recent Bookings
  const recentBookings = await db.booking.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { student: { include: { user: true } } }
  })

  // Fetch recent Sessions
  const recentSessions = await db.session.findMany({
    where: { completedAt: { gte: thirtyDaysAgo }, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    take: 5,
    include: { student: { include: { user: true } } }
  })

  // Fetch recent Badges
  const recentBadges = await db.studentBadge.findMany({
    where: { earnedAt: { gte: thirtyDaysAgo } },
    orderBy: { earnedAt: 'desc' },
    take: 5,
    include: { student: { include: { user: true } }, badge: true }
  })

  const alerts = []
  
  for (const b of recentBookings) {
    alerts.push({
      id: `booking-${b.id}`,
      type: 'BOOKING',
      message: `New admission slot filed by ${b.name} (${b.trainingType})`,
      time: b.createdAt,
      pulse: b.status === 'PENDING'
    })
  }

  for (const s of recentSessions) {
    alerts.push({
      id: `session-${s.id}`,
      type: 'SESSION',
      message: `${s.lessonType} marked completed for ${s.student?.user.name || 'Unknown'}`,
      time: s.completedAt || s.createdAt,
      pulse: false
    })
  }

  for (const b of recentBadges) {
    alerts.push({
      id: `badge-${b.id}`,
      type: 'BADGE',
      message: `Student ${b.student.user.name} awarded the "${b.badge.name}" badge`,
      time: b.earnedAt,
      pulse: false
    })
  }

  // Sort all events by time descending
  alerts.sort((a, b) => b.time.getTime() - a.time.getTime())

  // Format relative time
  const now = new Date().getTime()
  const formattedAlerts = alerts.slice(0, 10).map(alert => {
    const mins = Math.floor((now - alert.time.getTime()) / 60000)
    let relativeTime = `${mins} mins ago`
    if (mins < 1) relativeTime = 'Just now'
    else if (mins > 60 && mins < 1440) relativeTime = `${Math.floor(mins / 60)} hours ago`
    else if (mins >= 1440) relativeTime = `${Math.floor(mins / 1440)} days ago`
    
    return {
      ...alert,
      relativeTime
    }
  })

  return NextResponse.json(formattedAlerts, { status: 200 })
}

