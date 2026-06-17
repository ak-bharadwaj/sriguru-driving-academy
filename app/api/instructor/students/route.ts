export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }

    const userId = user?.id

    const instructor = await db.instructor.findUnique({
      where: { userId },
      select: { id: true }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
    }

    // Fetch ONLY the fields needed for the student list UI — avoid fetching sessions/progress/feedback for every student
    const students = await db.student.findMany({
      where: { instructorId: instructor.id },
      select: {
        id: true,
        enrolledAt: true,
        trainingType: true,
        feeStatus: true,
        xp: true,
        level: true,
        user: {
          select: { name: true, email: true }
        },
        // Limit progress to only category and completion — no full card details
        progress: {
          select: {
            completed: true,
            card: {
              select: { category: true }
            }
          }
        },
        // Only fetch today's session to avoid pulling the entire history
        sessions: {
          where: {
            scheduledAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999))
            },
            status: 'SCHEDULED'
          },
          select: {
            id: true,
            lessonType: true,
            scheduledAt: true,
            status: true,
            duration: true
          },
          take: 1
        },
        // Count all sessions without fetching their data
        _count: {
          select: { sessions: true }
        },
        drivingTests: {
          select: {
            id: true,
            testDate: true,
            type: true,
            testCenter: true,
            result: true
          }
        },
        feedback: {
          select: {
            id: true,
            tag: true,
            content: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5 // Only latest 5
        }
      }
    })

    const formattedStudents = students.map(s => {
      const completedCount = s.progress.filter(p => p.completed).length
      const completionPercent = Math.min(100, Math.max(15, Math.round((completedCount / 18) * 100)))

      const feedbackTimeline = s.feedback.map(fb => ({
        id: fb.id,
        topic: fb.tag,
        date: fb.createdAt.toISOString().split('T')[0],
        rating: 5,
        comments: fb.content,
        tag: 'Feedback'
      }))

      const dailyLog = [
        { date: '2026-05-19', note: 'Demonstrated solid mirror checks. Parking angles need slight trim alignment.' },
        { date: '2026-05-18', note: 'Coordination on manual shift is steady. Smooth downslope hold established.' }
      ]

      const skills = [
        { name: 'Basics', score: Math.min(10, s.progress.filter(p => p.card.category === 'basics' && p.completed).length * 3 + 4) },
        { name: 'Control', score: Math.min(10, s.progress.filter(p => p.card.category === 'control' && p.completed).length * 2 + 5) },
        { name: 'Safety', score: Math.min(10, s.progress.filter(p => p.card.category === 'safety' && p.completed).length * 2 + 6) },
        { name: 'Parking', score: Math.min(10, s.progress.filter(p => p.card.category === 'parking' && p.completed).length * 3 + 3) },
        { name: 'Road Rules', score: Math.min(10, s.progress.filter(p => p.card.category === 'road-rules' && p.completed).length * 3 + 4) }
      ]

      return {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        license: s.trainingType === 'RTO_FAST_TRACK' ? 'RTO' : s.trainingType,
        enrollmentDate: s.enrolledAt.toISOString().split('T')[0],
        totalSessions: s._count.sessions, // Use count instead of loading all sessions
        xp: s.xp,
        level: s.level,
        completionPercent,
        skills,
        feedbackTimeline,
        dailyLog,
        feeStatus: s.feeStatus,
        drivingTests: s.drivingTests,
        todaySession: s.sessions[0] || null
      }
    })

    const response = NextResponse.json(formattedStudents, { status: 200 })
    response.headers.set('Cache-Control', 'private, max-age=15, stale-while-revalidate=60')
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Instructor students query Error:', error)
    return NextResponse.json({ error: 'Roster compilation failed', details: message }, { status: 500 })
  }
}
