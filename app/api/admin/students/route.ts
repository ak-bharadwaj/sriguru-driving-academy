export const dynamic = 'force-dynamic';
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
        payments: {
          orderBy: { receivedAt: 'desc' },
          select: { id: true, amount: true, method: true, note: true, receivedAt: true }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })

    const formatted = students.map(s => {
      const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0)

      return {
        id: s.id,
        userId: s.userId,
        regNo: s.regNo,
        name: s.user.name,
        email: s.user.email,
        phone: s.user.phone,
        trainingType: s.trainingType,
        enrolledAt: s.enrolledAt,
        courseFee: s.courseFee,
        feeStatus: s.feeStatus,
        totalPaid,
        balance: (s.courseFee || 0) - totalPaid,
        payments: s.payments.map(p => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          note: p.note,
          receivedAt: p.receivedAt,
        }))
      }
    })

    const academyStudents = formatted.filter(s => !s.regNo?.startsWith('RTO-LEAD-'))
    const rtoLeads = formatted.filter(s => s.regNo?.startsWith('RTO-LEAD-'))

    return NextResponse.json({
      students: academyStudents,
      rtoLeads: rtoLeads,
      instructors: []
    }, {
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=60' }
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

    const { bookingId, name, email, phone, trainingType } = await request.json()

    if (!bookingId || !name || !email) {
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
