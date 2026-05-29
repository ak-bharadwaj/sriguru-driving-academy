export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const slotId = searchParams.get('slotId')

    if (!slotId) {
      return NextResponse.json({ error: 'Missing slotId' }, { status: 400 })
    }

    // Attempt DB fetch
    try {
      const bookings = await db.booking.findMany({
        where: { slotId, status: { in: ['PENDING', 'APPROVED'] } },
        include: { student: { include: { user: true } } }
      })
      return NextResponse.json(bookings, { status: 200 })
    } catch {
      // DB offline fallback
      return NextResponse.json([], { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve slot bookings' }, { status: 500 })
  }
}
