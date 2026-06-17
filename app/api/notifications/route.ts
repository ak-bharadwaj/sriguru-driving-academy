export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // select only the fields the frontend reads — no extra columns
    const notifications = await db.notification.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true
      },
      orderBy: [
        { isRead: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    const formatted = notifications.map(n => ({
      id: n.id,
      type: n.type,
      message: n.message,
      title: n.title,
      time: n.createdAt,
      read: n.isRead
    }))

    const response = NextResponse.json(formatted, { status: 200 })
    // Short cache — notifications should feel close to real-time
    response.headers.set('Cache-Control', 'private, max-age=5, stale-while-revalidate=15')
    return response
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
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 })
    }

    if (id) {
      await db.notification.update({
        where: { id, userId },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true, id }, { status: 200 })
    }

    return NextResponse.json({ error: 'Missing mandatory action or id parameters' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}
