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
  const instructor = await db.instructor.findUnique({ where: { userId } })
  if (!instructor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [students, allSessions, sessionsThisMonth, feedback, drivingTests] = await Promise.all([
    db.student.findMany({
      where: { instructorId: instructor.id },
      include: {
        user: { select: { name: true } },
        sessions: { where: { instructorId: instructor.id }, select: { id: true, scheduledAt: true, status: true, skillsCovered: true } },
        attendance: { select: { status: true } }
      }
    }),
    db.session.findMany({
      where: { instructorId: instructor.id },
      select: { id: true, scheduledAt: true, status: true, skillsCovered: true, lessonType: true }
    }),
    db.session.count({
      where: { instructorId: instructor.id, scheduledAt: { gte: startOfMonth } }
    }),
    db.feedback.findMany({
      where: { instructorId: instructor.id },
      include: { student: { include: { user: { select: { name: true } } } } },
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

  // Skill frequency
  const skillFreq: Record<string, number> = {}
  allSessions.forEach(s => {
    if (Array.isArray(s.skillsCovered)) {
      s.skillsCovered.forEach((sk: string) => {
        skillFreq[sk] = (skillFreq[sk] || 0) + 1
      })
    }
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

  // Per-student data
  const studentStats = students.map(s => {
    const completed = s.sessions.filter(ses => ses.status === 'COMPLETED').length
    const present = s.attendance.filter(a => a.status === 'PRESENT').length
    const total = s.attendance.length
    const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0
    const lastSession = s.sessions.filter(ses => ses.scheduledAt <= now).sort((a, b) =>
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

  return NextResponse.json({
    totalStudents: students.length,
    sessionsThisMonth,
    totalSessions: allSessions.length,
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
}
