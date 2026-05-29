export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET() {
  try {
    // 0. Security Audit check: verify INSTRUCTOR role in active session
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!session || user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden. Instructor credentials required.' }, { status: 403 })
    }
 
    const userId = user?.id

    // 1. Locate the authenticated instructor from the session
    const instructor = await db.instructor.findUnique({
      where: { userId },
      include: { user: true }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
    }

    // 2. Fetch assigned students with their relational records
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
          select: {
            name: true,
            email: true
          }
        },
        progress: {
          select: {
            completed: true,
            quizPassed: true,
            card: {
              select: {
                title: true,
                category: true
              }
            }
          }
        },
        sessions: {
          select: {
            id: true,
            lessonType: true,
            scheduledAt: true,
            status: true,
            duration: true
          }
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
          }
        }
      }
    })

    // 4. Return structured response mapping progress ring completion and details
    const formattedStudents = students.map(s => {
      const completedCount = s.progress.filter(p => p.completed).length
      // 18 skills total
      const completionPercent = Math.min(100, Math.max(15, Math.round((completedCount / 18) * 100)))

      // Parse feedback logs
      const feedbackTimeline = s.feedback.map(fb => ({
        id: fb.id,
        topic: fb.tag,
        date: fb.createdAt.toISOString().split('T')[0],
        rating: 5,
        comments: fb.content,
        tag: 'Feedback'
      }))

      // Simulated daily logs
      const dailyLog = [
        { date: '2026-05-19', note: 'Demonstrated solid mirror checks. Parking angles need slight trim alignment.' },
        { date: '2026-05-18', note: 'Coordination on manual shift is steady. Smooth downslope hold established.' }
      ]

      // Map progress card details to skills
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
        totalSessions: s.sessions.length,
        xp: s.xp,
        level: s.level,
        completionPercent,
        skills,
        feedbackTimeline,
        dailyLog,
        feeStatus: s.feeStatus,
        drivingTests: s.drivingTests,
        todaySession: s.sessions.find(sess => {
          const sDate = new Date(sess.scheduledAt).toDateString()
          const tDate = new Date().toDateString()
          return sDate === tDate && sess.status === 'SCHEDULED'
        }) || null
      }
    })

    return NextResponse.json(formattedStudents, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Instructor students query Error:', error)
    return NextResponse.json({ error: 'Roster compilation failed', details: message }, { status: 500 })
  }
}
