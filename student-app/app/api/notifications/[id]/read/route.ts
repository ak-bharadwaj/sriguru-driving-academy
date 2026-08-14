import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const id = params.id

    await db.notification.update({
      where: { id, userId }, // Ensure user owns it
      data: { isRead: true }
    })
    
    return NextResponse.json({ success: true, id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}
