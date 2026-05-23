import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// PUT: Set course fee for a student
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseFee, trainingType } = body

    if (courseFee === undefined || courseFee === null) {
      return NextResponse.json({ error: 'Course fee required' }, { status: 400 })
    }

    const updateData: any = { courseFee: parseFloat(courseFee) }
    if (trainingType) {
      updateData.trainingType = trainingType
    }

    // Recalculate fee status based on payments
    const payments = await db.payment.findMany({
      where: { studentId: params.id }
    })
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

    if (totalPaid >= parseFloat(courseFee)) {
      updateData.feeStatus = 'PAID'
    } else if (totalPaid > 0) {
      updateData.feeStatus = 'PARTIAL'
    } else {
      updateData.feeStatus = 'PENDING'
    }

    const student = await db.student.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      courseFee: student.courseFee,
      feeStatus: student.feeStatus,
      trainingType: student.trainingType,
    })
  } catch (error) {
    console.error('Fee update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
