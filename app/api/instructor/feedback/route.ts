import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // 0. Security Audit check: verify INSTRUCTOR role in active session
    const authSession = await getServerSession(authOptions)
    if (!authSession || (authSession.user as any)?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }

    const userId = (authSession.user as any).id
    const instructor = await db.instructor.findUnique({
      where: { userId }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Forbidden. Instructor profile not found.' }, { status: 403 })
    }

    const { studentId, comments, rating, tag } = await request.json()
    if (!studentId || !comments || typeof rating !== 'number') {
      return NextResponse.json({ error: 'Missing feedback parameters' }, { status: 400 })
    }

    // Security check: Verify that the student is assigned to this instructor
    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { instructorId: true }
    })

    if (!student || student.instructorId !== instructor.id) {
      return NextResponse.json({ error: 'Unauthorized. This student is not assigned to you.' }, { status: 403 })
    }

    // Create feedback record directly linked to student and instructor
    const feedback = await db.feedback.create({
      data: {
        studentId,
        instructorId: instructor.id,
        tag: tag || 'General Feedback',
        content: comments,
        skillScores: { rating }
      }
    })

    return NextResponse.json({ success: true, feedback }, { status: 200 })
  } catch (error: any) {
    console.error('Submit feedback API Error:', error)
    return NextResponse.json({ error: 'Failed to record feedback', details: error.message }, { status: 500 })
  }
}
