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
  const userName = session.user.name || 'Gaurav Singh (Mock)'
  const userEmail = session.user.email || 'student@demo.com'

  let student = null
  let dbData = null

  // 1. Fetch or create student profile
  try {
    student = await db.student.findUnique({
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
      }
    }
  } catch (err) {
    console.error("Error fetching student profile:", err)
  }

  // 2. Redirect if not onboarded (done outside try/catch to avoid intercepting Next.js redirect exceptions)
  if (student && !student.hasOnboarded) {
    redirect('/student/onboarding')
  }

  // 3. Fetch all other dashboard metrics if student exists
  if (student) {
    try {
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
        announcements,
        pendingBooking
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
        getGlobalAnnouncements(),

        // 6. Fetch pending trial booking
        db.booking.findFirst({
          where: {
            studentId: student.id,
            status: 'PENDING'
          },
          include: {
            slot: true
          }
        })
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

      dbData = {
        isMock: false,
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
        pendingBooking: pendingBooking ? {
          id: pendingBooking.id,
          status: pendingBooking.status,
          trainingType: pendingBooking.trainingType,
          slot: pendingBooking.slot ? {
            dayOfWeek: pendingBooking.slot.dayOfWeek,
            time: pendingBooking.slot.time
          } : null
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
    } catch (err) {
      console.error("Error fetching live student dashboard data, using mock fallbacks:", err)
    }
  }

  // Fallback to high-fidelity mock data if database was offline or student profile is missing
  if (!dbData) {
    const isDemoUser = userEmail === 'student@demo.com'
    dbData = {
      isMock: true,
      student: {
        id: 'mock-student-id-123',
        name: userName,
        email: userEmail,
        avatarUrl: null,
        xp: isDemoUser ? 340 : 0,
        level: isDemoUser ? 3 : 1,
        streakDays: isDemoUser ? 5 : 0,
        instructorName: isDemoUser ? 'Rajesh Kumar (Mock)' : 'Unassigned (Mock)',
        status: 'ACTIVE',
        hasProvidedFeedback: false
      },
      nextSession: isDemoUser ? {
        id: 'mock-session-1',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        lessonType: 'PRACTICAL',
        instructorName: 'Rajesh Kumar (Mock)'
      } : null,
      pendingBooking: null, // client will load from localStorage if mock
      drivingTests: isDemoUser ? [
        {
          id: 'mock-test-1',
          testDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days later
          type: 'PRACTICAL',
          testCenter: 'Secunderabad RTO Track'
        }
      ] : [],
      roadmapProgress: [
        { phase: 'BEGINNER', total: 6, completed: isDemoUser ? 6 : 0, percent: isDemoUser ? 100 : 0 },
        { phase: 'INTERMEDIATE', total: 5, completed: isDemoUser ? 3 : 0, percent: isDemoUser ? 60 : 0 },
        { phase: 'ADVANCED', total: 4, completed: 0, percent: 0 },
        { phase: 'RTO', total: 3, completed: 0, percent: 0 }
      ],
      quickStats: {
        totalAttended: isDemoUser ? 9 : 0,
        attendanceRate: isDemoUser ? 90 : 0,
        quizAccuracy: isDemoUser ? 85 : 0,
        cardsCompleted: isDemoUser ? 9 : 0
      },
      recentBadges: isDemoUser ? [
        {
          id: 'badge-1',
          name: 'First Perfect Parallel Park',
          description: 'Achieved a perfect score in parallel parking execution.',
          icon: 'ParkingCircle',
          earnedAt: new Date().toISOString()
        },
        {
          id: 'badge-2',
          name: 'Road Sign Guru',
          description: 'Answered all traffic sign questions correctly in a single run.',
          icon: 'Signpost',
          earnedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ] : [],
      announcements: [
        {
          id: 'ann-1',
          title: 'Monsoon Driving Guidelines',
          message: 'Please review the rain safety rules before your next practical session on highway tracks.',
          createdAt: new Date().toISOString()
        }
      ]
    }
  }

  return <DashboardClient initialDbData={dbData} />
}
