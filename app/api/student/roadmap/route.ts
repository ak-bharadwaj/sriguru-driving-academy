export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TrainingType } from '@prisma/client'

function getStartOfWeek() {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
  const start = new Date(now.setDate(diff))
  start.setHours(0, 0, 0, 0)
  return start
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student enrolled course plan
    const student = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true, trainingType: true }
    })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const trainingType = student.trainingType || TrainingType.BEGINNER

    // Get all syllabus days for the course plan
    const days = await db.syllabusDay.findMany({
      where: { trainingType },
      orderBy: { dayNumber: 'asc' }
    })

    // Get student progress for the current week
    const startOfWeek = getStartOfWeek()
    const progress = await db.studentSyllabusProgress.findMany({
      where: {
        studentId: student.id,
        completedAt: { gte: startOfWeek }
      },
      select: { syllabusDayId: true }
    })

    const completedDayIds = new Set(progress.map(p => p.syllabusDayId))

    // Map to roadmap structure
    const nodes = days.map(day => {
      // Determine phase dynamically
      let phase = 'BEGINNER'
      if (trainingType === 'BEGINNER') {
        if (day.dayNumber <= 7) phase = 'BEGINNER'
        else if (day.dayNumber <= 14) phase = 'INTERMEDIATE'
        else phase = 'ADVANCED'
      } else if (trainingType === 'ADVANCED') {
        if (day.dayNumber <= 7) phase = 'ADVANCED'
        else phase = 'MASTERY'
      } else {
        phase = 'RTO'
      }

      // Determine icon
      let icon = 'Compass'
      const t = day.title.toLowerCase()
      if (t.includes('steer')) icon = 'CircleDashed'
      else if (t.includes('clutch') || t.includes('friction') || t.includes('gear')) icon = 'Zap'
      else if (t.includes('brake') || t.includes('stop')) icon = 'AlertTriangle'
      else if (t.includes('park')) icon = 'ParkingSquare'
      else if (t.includes('night')) icon = 'Moon'
      else if (t.includes('rain')) icon = 'CloudRain'
      else if (t.includes('highway') || t.includes('speed')) icon = 'Route'
      else if (t.includes('test') || t.includes('exam')) icon = 'Award'
      else if (t.includes('sign') || t.includes('rule')) icon = 'FileText'
      else {
        const icons = ['Compass', 'Key', 'RotateCw', 'AlignLeft', 'GitMerge']
        icon = icons[day.dayNumber % icons.length]
      }

      return {
        id: day.id,
        title: day.title,
        description: day.description,
        phase,
        orderIndex: day.dayNumber,
        icon,
        completed: completedDayIds.has(day.id)
      }
    })

    return NextResponse.json(nodes, { status: 200 })
  } catch (error) {
    console.error('Student Roadmap GET Error:', error)
    return NextResponse.json({ error: 'Failed to load roadmap nodes' }, { status: 500 })
  }
}
