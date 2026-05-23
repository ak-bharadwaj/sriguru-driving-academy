import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'



export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || (session.user as any).role !== 'STUDENT') {
    redirect('/unauthorized')
  }

  const userId = (session.user as any).id

  let student = await db.student.findUnique({
    where: { userId },
    include: {
      user: true,
      instructor: {
        include: {
          user: true
        }
      }
    }
  })

  if (!student) {
    if (userId && userId !== 'mock-student-id-123') {
      // Auto-create student profile if missing
      student = await db.student.create({
        data: {
          userId,
          xp: 0,
          level: 1,
          streakDays: 0,
        },
        include: {
          user: true,
          instructor: {
            include: { user: true }
          }
        }
      })
    } else {
      redirect('/unauthorized')
    }
  }

  // 1. Fetch upcoming session
  const nextSession = await db.session.findFirst({
    where: {
      studentId: student.id,
      scheduledAt: { gte: new Date() },
      status: 'SCHEDULED'
    },
    orderBy: { scheduledAt: 'asc' },
    include: {
      instructor: {
        include: { user: true }
      }
    }
  })

  // 1.5. Fetch upcoming Driving Test / RTO Exam
  const nextTest = await db.drivingTest.findFirst({
    where: {
      studentId: student.id,
      result: 'SCHEDULED'
    },
    orderBy: { testDate: 'asc' }
  })

  // 2. Fetch Roadmap Progress
  const allCards = await db.learningCard.findMany({
    select: { id: true, phase: true }
  })
  const completedProgress = await db.learningProgress.findMany({
    where: { studentId: student.id, completed: true },
    select: { cardId: true }
  })
  const completedCardIds = new Set(completedProgress.map(p => p.cardId))

  const phases = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'RTO']
  const roadmapProgress = phases.map(phase => {
    const phaseCards = allCards.filter(c => c.phase === phase)
    const total = phaseCards.length
    const completed = phaseCards.filter(c => completedCardIds.has(c.id)).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return {
      phase,
      total,
      completed,
      percent
    }
  })

  // 3. Quick Stats
  const totalAttended = await db.attendance.count({
    where: { studentId: student.id, status: 'PRESENT' }
  })
  const totalMarked = await db.attendance.count({
    where: { studentId: student.id }
  })
  const attendanceRate = totalMarked > 0 ? Math.round((totalAttended / totalMarked) * 100) : 100

  const totalAttempts = await db.quizAttempt.count({
    where: { studentId: student.id }
  })
  const correctAttempts = await db.quizAttempt.count({
    where: { studentId: student.id, correct: true }
  })
  const quizAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

  // 4. Recent Badges
  const recentBadges = await db.studentBadge.findMany({
    where: { studentId: student.id },
    orderBy: { earnedAt: 'desc' },
    take: 3,
    include: { badge: true }
  })

  // 5. Active Announcements
  const announcements = await db.announcement.findMany({
    where: {
      expiryDate: { gte: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  })

  const dbData = {
    student: {
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      avatarUrl: student.user.avatarUrl,
      xp: student.xp,
      level: student.level,
      streakDays: student.streakDays,
      instructorName: student.instructor?.user.name || 'Unassigned',
    },
    nextSession: nextSession ? {
      id: nextSession.id,
      scheduledAt: nextSession.scheduledAt.toISOString(),
      lessonType: nextSession.lessonType,
      instructorName: nextSession.instructor.user.name,
    } : null,
    nextTest: nextTest ? {
      id: nextTest.id,
      testDate: nextTest.testDate.toISOString(),
      testCenter: nextTest.testCenter || 'RTO Center',
    } : null,
    roadmapProgress,
    quickStats: {
      totalAttended,
      attendanceRate,
      quizAccuracy,
      cardsCompleted: completedCardIds.size
    },
    recentBadges: recentBadges.map(sb => ({
      id: sb.badge.id,
      name: sb.badge.name,
      description: sb.badge.description,
      icon: sb.badge.icon,
      earnedAt: sb.earnedAt.toISOString(),
    })),
    announcements: announcements.map(a => ({
      id: a.id,
      title: a.title,
      message: a.message,
      createdAt: a.createdAt.toISOString()
    }))
  }

  return <DashboardClient initialDbData={dbData} />
}
