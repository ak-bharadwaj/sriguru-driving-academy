export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
    }

    // Fetch the 5 most recent real activity logs or system notifications from the DB
    const notifications = await db.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    const alerts = notifications.map((n, idx) => {
      const diffMs = Date.now() - n.createdAt.getTime()
      const diffMins = Math.round(diffMs / 60000)
      
      let relativeTime = 'Just now'
      if (diffMins > 0) {
        if (diffMins < 60) {
          relativeTime = `${diffMins} mins ago`
        } else {
          const diffHours = Math.round(diffMins / 60)
          if (diffHours < 24) {
            relativeTime = `${diffHours} hours ago`
          } else {
            relativeTime = `${Math.round(diffHours / 24)} days ago`
          }
        }
      }

      return {
        id: n.id,
        type: n.type || 'SYSTEM',
        message: n.message,
        relativeTime,
        pulse: idx === 0
      }
    })

    return NextResponse.json(alerts, { status: 200 })
  } catch (error) {
    console.error('Live Feed Fetch Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
