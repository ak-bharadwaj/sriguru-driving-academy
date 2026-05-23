import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
    
    return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}
