export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden. Student credentials required.' }, { status: 403 })
    }

    const userId = (session.user as any).id

    const student = await db.student.findUnique({
      where: { userId },
      select: {
        id: true,
        enrolledAt: true,
        courseFee: true,
        feeStatus: true,
        trainingType: true,
        xp: true,
        level: true,
        streakDays: true,
        user: { select: { name: true, email: true } },
        instructor: {
          select: { user: { select: { name: true, email: true } } }
        },
        payments: {
          select: { id: true, amount: true, method: true, note: true, receivedAt: true },
          orderBy: { receivedAt: 'desc' }
        },
        drivingTests: {
          select: { id: true, testDate: true, testCenter: true, result: true, attemptNo: true, type: true },
          orderBy: { testDate: 'asc' }
        },
        sessions: {
          select: { id: true, scheduledAt: true, status: true, lessonType: true, duration: true },
          orderBy: { scheduledAt: 'desc' },
          take: 5
        },
        bookings: {
          where: { status: 'APPROVED' },
          select: {
            id: true, trainingType: true, status: true, preferredTime: true,
            slot: { select: { id: true, dayOfWeek: true, time: true } }
          },
          take: 1
        },
        _count: { select: { attendance: { where: { status: 'PRESENT' } } } }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    const totalAttended = student._count.attendance

    return NextResponse.json({
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      enrolledAt: student.enrolledAt,
      courseFee: student.courseFee,
      feeStatus: student.feeStatus,
      payments: student.payments,
      drivingTests: student.drivingTests,
      instructor: student.instructor ? {
        name: student.instructor.user.name,
        email: student.instructor.user.email,
      } : null,
      trainingType: student.trainingType,
      xp: student.xp,
      level: student.level,
      streakDays: student.streakDays,
      totalAttended,
      bookings: student.bookings.map(b => ({
        id: b.id,
        trainingType: b.trainingType,
        status: b.status,
        preferredTime: b.preferredTime,
        slot: b.slot ? {
          id: b.slot.id,
          dayOfWeek: b.slot.dayOfWeek,
          time: b.slot.time,
        } : null
      }))
    }, {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=10, stale-while-revalidate=30' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch student dashboard data', details: message }, { status: 500 })
  }
}
