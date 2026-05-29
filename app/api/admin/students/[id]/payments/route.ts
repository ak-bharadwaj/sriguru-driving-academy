export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST: Record a new payment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, method, note } = body

    if (!amount || !method) {
      return NextResponse.json({ error: 'Amount and method required' }, { status: 400 })
    }

    const studentId = params.id
    const adminId = (session.user as any).id

    // Create payment record
    const payment = await db.payment.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        method,
        note: note || null,
        recordedBy: adminId,
      }
    })

    // Calculate new total paid and update fee status
    const allPayments = await db.payment.findMany({
      where: { studentId }
    })
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0)

    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { courseFee: true }
    })

    let newFeeStatus: 'PENDING' | 'PARTIAL' | 'PAID' = 'PENDING'
    if (student?.courseFee) {
      if (totalPaid >= student.courseFee) {
        newFeeStatus = 'PAID'
      } else if (totalPaid > 0) {
        newFeeStatus = 'PARTIAL'
      }
    } else if (totalPaid > 0) {
      newFeeStatus = 'PARTIAL'
    }

    await db.student.update({
      where: { id: studentId },
      data: { feeStatus: newFeeStatus }
    })

    return NextResponse.json({ payment, feeStatus: newFeeStatus })
  } catch (error) {
    console.error('Payment recording error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Payment history for a student
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await db.payment.findMany({
      where: { studentId: params.id },
      orderBy: { receivedAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
