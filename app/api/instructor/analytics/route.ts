export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const instructor = await db.instructor.findUnique({ 
    where: { userId },
    select: { id: true }
  })
  if (!instructor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Run all queries in parallel — previously they were sequential
  const [students, sessionsThisMonth, totalSessionsCount, feedback, drivingTests] = await Promise.all([
    db.student.findMany({
      where: { instructorId: instructor.id },
      select: {
        id: true,
        user: { select: { name: true } },
        // Only fetch completed sessions with skills covered — not all sessions
        sessions: {
          where: { status: 'COMPLETED' },
          select: { id: true, scheduledAt: true, skillsCovered: true }
        },
        attendance: { select: { status: true } }
      }
    }),
    db.session.count({
      where: { instructorId: instructor.id, scheduledAt: { gte: startOfMonth } }
    }),
    db.session.count({
      where: { instructorId: instructor.id }
    }),
    db.feedback.findMany({
      where: { instructorId: instructor.id },
      select: {
        id: true,
        content: true,
        tag: true,
        createdAt: true,
        skillScores: true,
        student: { select: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    db.drivingTest.findMany({
      where: {
        student: { instructorId: instructor.id },
        result: { in: ['PASS', 'FAIL'] }
      },
      select: { result: true }
    })
  ])

  // Skill frequency aggregation from completed sessions
  const skillFreq: Record<string, number> = {}
  students.forEach(s => {
    s.sessions.forEach(sess => {
      if (Array.isArray(sess.skillsCovered)) {
        sess.skillsCovered.forEach((sk: string) => {
          skillFreq[sk] = (skillFreq[sk] || 0) + 1
        })
      }
    })
  })
  const topSkills = Object.entries(skillFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }))

  // Pass rate
  const passCount = drivingTests.filter(t => t.result === 'PASS').length
  const totalTests = drivingTests.length
  const passRate = totalTests > 0 ? Math.round((passCount / totalTests) * 100) : 0

  // Avg rating from feedback skillScores
  let ratingSum = 0, ratingCount = 0
  feedback.forEach(f => {
    if (f.skillScores && typeof f.skillScores === 'object') {
      const scores = Object.values(f.skillScores as Record<string, number>)
      scores.forEach(v => { ratingSum += v; ratingCount++ })
    }
  })
  const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : null

  // Per-student stats — now just using completed sessions (already filtered)
  const studentStats = students.map(s => {
    const completed = s.sessions.length // All already filtered to COMPLETED
    const present = s.attendance.filter(a => a.status === 'PRESENT').length
    const total = s.attendance.length
    const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0
    const lastSession = s.sessions.sort((a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    )[0]
    return {
      id: s.id,
      name: s.user.name,
      sessionCount: completed,
      attendancePct,
      lastSession: lastSession?.scheduledAt || null
    }
  })

  const response = NextResponse.json({
    totalStudents: students.length,
    sessionsThisMonth,
    totalSessions: totalSessionsCount,
    passRate,
    avgRating,
    topSkills,
    studentStats,
    recentFeedback: feedback.map(f => ({
      id: f.id,
      content: f.content,
      tag: f.tag,
      createdAt: f.createdAt,
      studentName: f.student.user.name
    }))
  })

  // Cache analytics for 30 seconds (stale is fine for dashboards)
  response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=120')
  return response
}
