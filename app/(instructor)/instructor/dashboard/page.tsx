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

  const instructor = await db.instructor.findUnique({
    where: { userId },
    include: { user: true }
  })

  if (!instructor) {
    redirect('/unauthorized')
  }

  // Fetch assigned students
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
        }
      }
    }
  })

  const formattedStudents = students.map(s => {
    const completedCount = s.progress.filter(p => p.completed).length
    const completionPercent = Math.min(100, Math.max(15, Math.round((completedCount / 18) * 100)))

    // Simulated daily logs placeholder
    const dailyLog = [
      { date: new Date().toISOString().split('T')[0], note: '' }
    ]

    // Map progress card details to skills
    const skills = [
      { name: 'Basics', score: Math.min(10, s.progress.filter(p => p.card.category === 'basics' && p.completed).length * 3 + 4) },
      { name: 'Control', score: Math.min(10, s.progress.filter(p => p.card.category === 'control' && p.completed).length * 2 + 5) },
      { name: 'Safety', score: Math.min(10, s.progress.filter(p => p.card.category === 'safety' && p.completed).length * 2 + 6) },
      { name: 'Parking', score: Math.min(10, s.progress.filter(p => p.card.category === 'parking' && p.completed).length * 3 + 3) },
      { name: 'Road Rules', score: Math.min(10, s.progress.filter(p => p.card.category === 'road-rules' && p.completed).length * 3 + 4) }
    ]

    const todaySession = s.sessions.find(sess => {
      const sDate = new Date(sess.scheduledAt).toDateString()
      const tDate = new Date().toDateString()
      return sDate === tDate && sess.status === 'SCHEDULED'
    })

    return {
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      license: s.trainingType === 'RTO_FAST_TRACK' ? 'RTO' : s.trainingType,
      enrollmentDate: s.enrolledAt.toISOString().split('T')[0],
      totalSessions: s.sessions.length,
      completionPercent,
      skills,
      dailyLog,
      feeStatus: s.feeStatus,
      drivingTests: s.drivingTests.map(dt => ({
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

  return (
    <InstructorDashboardClient 
      instructor={{ id: instructor.id, name: instructor.user.name }}
      initialStudents={formattedStudents}
    />
  )
}
