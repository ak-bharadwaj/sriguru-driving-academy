import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const students = await db.student.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        instructor: {
          include: { user: { select: { name: true } } }
        },
        payments: { orderBy: { receivedAt: 'desc' } },
        drivingTests: { orderBy: { testDate: 'desc' } },
        sessions: { select: { id: true } },
      },
      orderBy: { enrolledAt: 'desc' }
    })

    const allInstructors = await db.instructor.findMany({
      include: { user: { select: { id: true, name: true } } }
    })

    const formatted = students.map(s => {
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0)
      const nextTest = s.drivingTests.find(t => t.result === 'SCHEDULED')
      const lastTest = s.drivingTests.find(t => t.result !== 'SCHEDULED')

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        phone: s.user.phone,
        trainingType: s.trainingType,
        enrolledAt: s.enrolledAt,
        courseFee: s.courseFee,
        feeStatus: s.feeStatus,
        totalPaid,
        balance: (s.courseFee || 0) - totalPaid,
        instructorId: s.instructorId,
        instructorName: s.instructor?.user.name || null,
        totalSessions: s.sessions.length,
        payments: s.payments.map(p => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          note: p.note,
          receivedAt: p.receivedAt,
        })),
        nextTest: nextTest ? {
          id: nextTest.id,
          testDate: nextTest.testDate,
          testCenter: nextTest.testCenter,
          attemptNo: nextTest.attemptNo,
        } : null,
        lastTestResult: lastTest ? {
          id: lastTest.id,
          testDate: lastTest.testDate,
          result: lastTest.result,
          attemptNo: lastTest.attemptNo,
        } : null,
        drivingTests: s.drivingTests.map(t => ({
          id: t.id,
          testDate: t.testDate,
          testCenter: t.testCenter,
          result: t.result,
          attemptNo: t.attemptNo,
          notes: t.notes,
        })),
      }
    })

    return NextResponse.json({
      students: formatted,
      instructors: allInstructors.map(i => ({
        id: i.id,
        name: i.user.name,
      })),
    })
  } catch (error) {
    console.error('Admin students fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, name, email, phone, trainingType, instructorId } = await request.json()

    if (!bookingId || !name || !email || !instructorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map string type to enum
    let typeEnum: any = 'BEGINNER'
    if (trainingType.includes('ADVANCED') || trainingType.includes('Advanced')) typeEnum = 'ADVANCED'
    else if (trainingType.includes('RTO') || trainingType.includes('Fast')) typeEnum = 'RTO_FAST_TRACK'

    // Use a transaction to ensure all inserts happen together
    const result = await db.$transaction(async (prisma) => {
      // 1. Update Booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'APPROVED', reviewedAt: new Date() }
      })

      // 2. Create User (Using plaintext 'student123' as per auth fallback, or a simple hash in production)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          role: 'STUDENT',
          passwordHash: 'student123' 
        }
      })

      // 3. Create Student
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          instructorId,
          trainingType: typeEnum,
          courseFee: typeEnum === 'BEGINNER' ? 4999 : typeEnum === 'ADVANCED' ? 6999 : 2999
        }
      })

      return { user, student }
    })

    return NextResponse.json({ success: true, student: result.student })

  } catch (error) {
    console.error('Admin student onboarding error:', error)
    return NextResponse.json({ error: 'Failed to onboard student' }, { status: 500 })
  }
}
