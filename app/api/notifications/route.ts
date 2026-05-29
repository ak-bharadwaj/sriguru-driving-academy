export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationType } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Fetch from database
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: [
        { isRead: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    // Map to expected format for frontend if needed, but UI uses id, type, message, isRead, createdAt
    const formatted = notifications.map(n => ({
      id: n.id,
      type: n.type,
      message: n.message,
      title: n.title,
      time: n.createdAt,
      read: n.isRead
    }))

    return NextResponse.json(formatted, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (action === 'read-all') {
      // Mark all read for this user
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 })
    }

    if (id) {
      // Mark single notification read
      await db.notification.update({
        where: { id, userId }, // Ensure user owns it
        data: { isRead: true }
      })
      return NextResponse.json({ success: true, id }, { status: 200 })
    }

    return NextResponse.json({ error: 'Missing mandatory action or id parameters' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}

