import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import InstructorDashboardClient from './InstructorDashboardClient'



export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || (session.user as any).role !== 'INSTRUCTOR') {
    redirect('/unauthorized')
  }

  const userId = (session.user as any).id

  let instructor = null
  let students: any[] = []
  let isDbOffline = false

  try {
    // Parallel lookup: instructor profile + assigned students at the same time
    const [instructorResult, studentsResult] = await Promise.all([
      db.instructor.findUnique({
        where: { userId },
        select: { id: true, user: { select: { name: true } } }
      }),
      // We don't know instructorId yet, so we join via userId for students in one round-trip
      db.student.findMany({
        where: { instructor: { userId } },
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
          progress: {
            select: {
              completed: true,
              card: { select: { category: true } }
            }
          },
          // Only today's SCHEDULED sessions — pushed to DB
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
          _count: { select: { sessions: true } },
          drivingTests: {
            select: {
              id: true,
              type: true,
              testDate: true,
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
            take: 5
          }
        }
      })
    ])

    instructor = instructorResult
    students = studentsResult
  } catch (err) {
    console.error("Failed to fetch instructor dashboard data from DB:", err)
    isDbOffline = true
  }


  // Fallback to mock data if DB offline or instructor profile is missing
  if (!instructor) {
    if (isDbOffline || userId === 'mock-instructor-id-123') {
      instructor = {
        id: 'mock-instructor-id-123',
        user: {
          name: session.user.name || 'Rajesh Kumar (Mock)'
        }
      } as any
    } else {
      redirect('/unauthorized')
    }
  }

  let formattedStudents: any[] = []

  if (students.length > 0) {
    formattedStudents = students.map(s => {
      const completedCount = s.progress.filter((p: any) => p.completed).length
      const completionPercent = Math.min(100, Math.max(15, Math.round((completedCount / 18) * 100)))

      // Simulated daily logs placeholder
      const dailyLog = [
        { date: new Date().toISOString().split('T')[0], note: '' }
      ]

      // Map progress card details to skills
      const skills = [
        { name: 'Basics', score: Math.min(10, s.progress.filter((p: any) => p.card.category === 'basics' && p.completed).length * 3 + 4) },
        { name: 'Control', score: Math.min(10, s.progress.filter((p: any) => p.card.category === 'control' && p.completed).length * 2 + 5) },
        { name: 'Safety', score: Math.min(10, s.progress.filter((p: any) => p.card.category === 'safety' && p.completed).length * 2 + 6) },
        { name: 'Parking', score: Math.min(10, s.progress.filter((p: any) => p.card.category === 'parking' && p.completed).length * 3 + 3) },
        { name: 'Road Rules', score: Math.min(10, s.progress.filter((p: any) => p.card.category === 'road-rules' && p.completed).length * 3 + 4) }
      ]

      // sessions is already filtered to today's SCHEDULED, take the first one
      const todaySession = s.sessions[0] ?? null

      return {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        license: s.trainingType === 'RTO_FAST_TRACK' ? 'RTO' : s.trainingType,
        enrollmentDate: s.enrolledAt.toISOString().split('T')[0],
        totalSessions: s._count.sessions, // Use count — no need to fetch all sessions
        completionPercent,
        skills,
        dailyLog,
        feeStatus: s.feeStatus,
        drivingTests: s.drivingTests.map((dt: any) => ({
          id: dt.id,
          type: dt.type,
          testDate: dt.testDate.toISOString().split('T')[0],
          testCenter: dt.testCenter || 'N/A',
          result: dt.result
        })),
        todaySession: todaySession ? {
          id: todaySession.id,
          studentId: s.id,
          dateTime: todaySession.scheduledAt.toISOString(),
          durationHours: todaySession.duration,
          topic: todaySession.lessonType,
          status: todaySession.status as any
        } : null
      }
    })
  } else {
    // High-fidelity mock students fallback
    formattedStudents = [
      {
        id: 'mock-student-1',
        name: 'Vikram Singh (Mock)',
        email: 'vikram.singh@demo.com',
        license: 'CAR',
        enrollmentDate: '2026-05-01',
        totalSessions: 8,
        completionPercent: 45,
        skills: [
          { name: 'Basics', score: 8 },
          { name: 'Control', score: 7 },
          { name: 'Safety', score: 9 },
          { name: 'Parking', score: 5 },
          { name: 'Road Rules', score: 8 }
        ],
        dailyLog: [{ date: new Date().toISOString().split('T')[0], note: 'Good clutch control, needs practice on parallel parking.' }],
        feeStatus: 'PAID',
        drivingTests: [],
        todaySession: null
      },
      {
        id: 'mock-student-2',
        name: 'Ananya Rao (Mock)',
        email: 'ananya.rao@demo.com',
        license: 'RTO',
        enrollmentDate: '2026-05-10',
        totalSessions: 12,
        completionPercent: 70,
        skills: [
          { name: 'Basics', score: 9 },
          { name: 'Control', score: 8 },
          { name: 'Safety', score: 8 },
          { name: 'Parking', score: 7 },
          { name: 'Road Rules', score: 9 }
        ],
        dailyLog: [{ date: new Date().toISOString().split('T')[0], note: 'Excellent lane discipline during highway run.' }],
        feeStatus: 'PAID',
        drivingTests: [
          {
            id: 'mock-test-id-1',
            type: 'PRACTICAL',
            testDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            testCenter: 'Secunderabad RTO Track',
            result: 'SCHEDULED'
          }
        ],
        todaySession: {
          id: 'mock-session-id-1',
          studentId: 'mock-student-2',
          dateTime: new Date(Date.now() + 3600000 * 2).toISOString(),
          durationHours: 1.5,
          topic: 'Highway Driving',
          status: 'SCHEDULED'
        }
      }
    ]
  }

  return (
    <InstructorDashboardClient 
      instructor={{ id: instructor.id, name: instructor.user.name }}
      initialStudents={formattedStudents}
    />
  )
}
