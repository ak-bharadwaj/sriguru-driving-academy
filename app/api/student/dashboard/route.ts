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
      include: {
        user: true,
        instructor: {
          include: {
            user: true
          }
        },
        payments: {
          orderBy: { receivedAt: 'desc' }
        },
        drivingTests: {
          orderBy: { testDate: 'asc' }
        },
        sessions: {
          orderBy: { scheduledAt: 'desc' },
          take: 5
        },
        bookings: {
          where: { status: 'APPROVED' },
          include: {
            slot: true
          },
          take: 1
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    const totalAttended = await db.attendance.count({
      where: { studentId: student.id, status: 'PRESENT' }
    })

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
    }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch student dashboard data', details: message }, { status: 500 })
  }
}
