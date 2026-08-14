export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DEFAULT_SYLLABUS } from '@/lib/data/syllabusData'

function getStartOfWeek() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(now.getFullYear(), now.getMonth(), diff)
  start.setHours(0, 0, 0, 0)
  return start
}

// Student fetches their own syllabus progress (current week only)
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

    let [syllabusDays, progress] = await Promise.all([
      db.syllabusDay.findMany({
        where: { trainingType: student.trainingType },
        orderBy: { dayNumber: 'asc' }
      }),
      db.studentSyllabusProgress.findMany({
        where: {
          studentId: student.id,
          completedAt: { gte: getStartOfWeek() }
        },
        select: { syllabusDayId: true, completedAt: true }
      })
    ])

    // Auto-seed defaults if empty
    if (syllabusDays.length === 0) {
      const defaults = DEFAULT_SYLLABUS[student.trainingType]
      if (defaults) {
        await db.syllabusDay.createMany({
          data: defaults.map(d => ({ trainingType: student.trainingType, ...d })),
          skipDuplicates: true
        })
        syllabusDays = await db.syllabusDay.findMany({
          where: { trainingType: student.trainingType },
          orderBy: { dayNumber: 'asc' }
        })
      }
    }

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
    }, {
      headers: { 'Cache-Control': 'private, max-age=20, stale-while-revalidate=60' }
    })
  } catch (error) {
    console.error('Student syllabus-progress GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
