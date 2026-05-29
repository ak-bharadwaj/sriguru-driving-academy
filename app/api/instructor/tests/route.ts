import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { studentId, testDate, type, testCenter, notes } = body

    if (!studentId || !testDate || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const instructor = await db.instructor.findUnique({
      where: { userId: session.user.id }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const test = await db.drivingTest.create({
      data: {
        studentId,
        testDate: new Date(testDate),
        type,
        testCenter,
        notes,
        scheduledBy: session.user.name || 'Instructor'
      }
    })

    return NextResponse.json({ success: true, test })
  } catch (error) {
    console.error('Error scheduling test:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
