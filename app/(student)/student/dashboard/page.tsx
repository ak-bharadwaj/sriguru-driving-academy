import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import DashboardClient from './DashboardClient'

// Global Cached Queries (Eliminates redundant DB hits for shared data)
const getGlobalCards = unstable_cache(
  async () => db.learningCard.findMany({ select: { id: true, phase: true } }),
  ['global-learning-cards'],
  { revalidate: 86400 } // Cache for 24 hours
)

const getGlobalAnnouncements = unstable_cache(
  async () => db.announcement.findMany({
    select: { id: true, title: true, message: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5 // Limit payload size to further reduce compute
  }),
  ['global-announcements'],
  { revalidate: 3600 } // Cache for 1 hour
)

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

  // Force onboarding if incomplete
  if (!student.hasOnboarded) {
    redirect('/student/onboarding')
  }
  // -------------------------------------------------------------
  // HIGH-PERFORMANCE DB FETCHING (Multiplexed via Promise.all)
  // -------------------------------------------------------------
  const [
    nextSession,
    drivingTests,
    completedProgress,
    totalAttended,
    totalMarked,
    totalAttempts,
    correctAttempts,
    recentBadges,
    allCards,
    announcements
  ] = await Promise.all([
    // 1. Fetch upcoming session
    db.session.findFirst({
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
    }),
    
    // 1.5. Fetch upcoming Driving Tests
    db.drivingTest.findMany({
      where: {
        studentId: student.id,
        result: 'SCHEDULED'
      },
      orderBy: { testDate: 'asc' }
    }),

    // 2. Fetch Roadmap Progress
    db.learningProgress.findMany({
      where: { studentId: student.id, completed: true },
      select: { cardId: true }
    }),

    // 3. Quick Stats
    db.attendance.count({
      where: { studentId: student.id, status: 'PRESENT' }
    }),
    db.attendance.count({
      where: { studentId: student.id }
    }),
    db.quizAttempt.count({
      where: { studentId: student.id }
    }),
    db.quizAttempt.count({
      where: { studentId: student.id, correct: true }
    }),

    // 4. Recent Badges
    db.studentBadge.findMany({
      where: { studentId: student.id },
      orderBy: { earnedAt: 'desc' },
      take: 3,
      include: { badge: true }
    }),

    // 5. Fetch Global Cached Data (0ms DB Time)
    getGlobalCards(),
    getGlobalAnnouncements()
  ])

  // Process Progress
  const completedCardIds = new Set(completedProgress.map(p => p.cardId))
  const phases = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'RTO']
  const roadmapProgress = phases.map(phase => {
    const phaseCards = allCards.filter(c => c.phase === phase)
    const total = phaseCards.length
    const completed = phaseCards.filter(c => completedCardIds.has(c.id)).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { phase, total, completed, percent }
  })

  // Process Stats
  const attendanceRate = totalMarked > 0 ? Math.round((totalAttended / totalMarked) * 100) : 100
  const quizAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

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
      status: (student as any).status || 'ACTIVE',
      hasProvidedFeedback: !!(student as any).CourseFeedback
    },
    nextSession: nextSession ? {
      id: nextSession.id,
      scheduledAt: nextSession.scheduledAt.toISOString(),
      lessonType: nextSession.lessonType,
      instructorName: nextSession.instructor.user.name,
    } : null,
    drivingTests: drivingTests.map(t => ({
      id: t.id,
      testDate: t.testDate.toISOString(),
      type: (t as any).type || 'PRACTICAL', // Fallback for safety
      testCenter: t.testCenter || 'Not specified'
    })),
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
