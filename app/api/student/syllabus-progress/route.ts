export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Student fetches their own syllabus progress
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const student = await db.student.findUnique({
      where: { userId: user.id },
      select: { id: true, trainingType: true }
    })
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    // Get syllabus days for their course type
    const syllabusDays = await db.syllabusDay.findMany({
      where: { trainingType: student.trainingType },
      orderBy: { dayNumber: 'asc' }
    })

    // Get this student's completed days
    const progress = await db.studentSyllabusProgress.findMany({
      where: { studentId: student.id },
      select: { syllabusDayId: true, completedAt: true }
    })

    const completedIds = new Set(progress.map(p => p.syllabusDayId))

    const result = syllabusDays.map(day => ({
      ...day,
      completed: completedIds.has(day.id),
      completedAt: progress.find(p => p.syllabusDayId === day.id)?.completedAt || null
    }))

    return NextResponse.json({
      trainingType: student.trainingType,
      days: result,
      completedCount: progress.length,
      totalCount: syllabusDays.length
    })
  } catch (error) {
    console.error('Student syllabus-progress GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
