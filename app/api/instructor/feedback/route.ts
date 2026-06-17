import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // 0. Security Audit check: verify INSTRUCTOR role in active session
    const authSession = await getServerSession(authOptions)
    const user = authSession?.user as { id?: string; role?: string } | undefined
    if (!authSession || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }
 
    const userId = user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. User ID not found.' }, { status: 401 })
    }
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
      where: { id: studentId }
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

    // Award +150 XP to the student for completing the session
    const amount = 150
    const currentXP = student.xp + amount
    const neededXP = student.level * 1000

    if (currentXP >= neededXP) {
      await db.student.update({
        where: { id: student.id },
        data: {
          level: student.level + 1,
          xp: currentXP - neededXP
        }
      })
    } else {
      await db.student.update({
        where: { id: student.id },
        data: { xp: currentXP }
      })
    }

    // Log the XP transaction event
    await db.xPEvent.create({
      data: {
        studentId,
        amount,
        reason: 'SESSION_FEEDBACK_BONUS'
      }
    })

    return NextResponse.json({ success: true, feedback }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Submit feedback API Error:', error)
    return NextResponse.json({ error: 'Failed to record feedback', details: message }, { status: 500 })
  }
}
