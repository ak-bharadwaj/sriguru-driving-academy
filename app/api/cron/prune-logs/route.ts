export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    // Vercel Cron sends a Bearer token matching CRON_SECRET
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

    // 1. Delete Activity Logs older than 30 days
    const deletedLogs = await db.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    })

    // 2. Delete XP Events older than 90 days to keep history lean
    const deletedXPEvents = await db.xPEvent.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo
        }
      }
    })

    // 3. Delete notifications older than 30 days if read, or older than 90 days if unread
    const deletedNotifications = await db.notification.deleteMany({
      where: {
        OR: [
          { isRead: true, createdAt: { lt: thirtyDaysAgo } },
          { isRead: false, createdAt: { lt: ninetyDaysAgo } }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      deletedLogsCount: deletedLogs.count,
      deletedXPEventsCount: deletedXPEvents.count,
      deletedNotificationsCount: deletedNotifications.count
    }, { status: 200 })
  } catch (error: any) {
    console.error('Prune logs cron error:', error)
    return NextResponse.json({ error: 'Failed to prune database logs' }, { status: 500 })
  }
}
