export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DEFAULT_SYLLABUS } from '@/lib/data/syllabusData'

function getStartOfWeek() {
  const now = new Date()
  const day = now.getDay() // 0=Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday
  const start = new Date(now.getFullYear(), now.getMonth(), diff)
  start.setHours(0, 0, 0, 0)
  return start
}

// GET: instructor fetches a student's syllabus progress (current week only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const studentId = url.searchParams.get('studentId')
    if (!studentId) return NextResponse.json({ error: 'studentId required' }, { status: 400 })

    const student = await db.student.findUnique({
      where: { id: studentId },
      select: { trainingType: true }
    })
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    let syllabusDays = await db.syllabusDay.findMany({
      where: { trainingType: student.trainingType },
      orderBy: { dayNumber: 'asc' }
    })

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

    // Only return progress from current week
    const startOfWeek = getStartOfWeek()
    const progress = await db.studentSyllabusProgress.findMany({
      where: { studentId, completedAt: { gte: startOfWeek } },
      select: { syllabusDayId: true, completedAt: true, notes: true }
    })

    const completedIds = new Set(progress.map(p => p.syllabusDayId))

    const result = syllabusDays.map(day => ({
      ...day,
      completed: completedIds.has(day.id),
      completedAt: progress.find(p => p.syllabusDayId === day.id)?.completedAt || null,
      notes: progress.find(p => p.syllabusDayId === day.id)?.notes || null,
    }))

    return NextResponse.json({
      trainingType: student.trainingType,
      days: result,
      completedCount: progress.length,
      totalCount: syllabusDays.length
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=5' }
    })
  } catch (error) {
    console.error('Instructor syllabus-progress GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// POST: mark a day as complete and award 50 XP if not already earned this week
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instructor = await db.instructor.findFirst({
      where: { userId: user.id },
      select: { id: true }
    })

    const body = await request.json()
    const { studentId, syllabusDayId, notes } = body
    if (!studentId || !syllabusDayId) {
      return NextResponse.json({ error: 'studentId and syllabusDayId required' }, { status: 400 })
    }

    const startOfWeek = getStartOfWeek()

    // Check if already completed this week
    const existing = await db.studentSyllabusProgress.findFirst({
      where: {
        studentId,
        syllabusDayId,
        completedAt: { gte: startOfWeek }
      }
    })

    const record = await db.studentSyllabusProgress.upsert({
      where: { studentId_syllabusDayId: { studentId, syllabusDayId } },
      create: {
        studentId,
        syllabusDayId,
        instructorId: instructor?.id || null,
        notes: notes || null
      },
      update: {
        notes: notes || null,
        completedAt: new Date()
      }
    })

    // Award 50 XP if not already awarded this week for this day
    let xpAwarded = false
    if (!existing) {
      await db.$transaction([
        db.student.update({
          where: { id: studentId },
          data: { xp: { increment: 50 } }
        }),
        db.xPEvent.create({
          data: {
            studentId,
            amount: 50,
            reason: `Syllabus day completed`
          }
        })
      ])
      xpAwarded = true
    }

    return NextResponse.json({ success: true, record, xpAwarded })
  } catch (error) {
    console.error('Instructor syllabus-progress POST error:', error)
    return NextResponse.json({ error: 'Failed to mark complete' }, { status: 500 })
  }
}

// DELETE: unmark a day as complete
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, syllabusDayId } = body
    if (!studentId || !syllabusDayId) {
      return NextResponse.json({ error: 'studentId and syllabusDayId required' }, { status: 400 })
    }

    await db.studentSyllabusProgress.deleteMany({
      where: { studentId, syllabusDayId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Instructor syllabus-progress DELETE error:', error)
    return NextResponse.json({ error: 'Failed to unmark' }, { status: 500 })
  }
}
