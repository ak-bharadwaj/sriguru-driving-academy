import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'



export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
    }

    // 1. Weekly Revenue Array (Aggregated by day for the past 7 days)
    const recentPayments = await db.payment.findMany({
      where: {
        receivedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    // UI expects [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    const revenueByDay = [0, 0, 0, 0, 0, 0, 0]
    let totalWeeklyRevenue = 0
    recentPayments.forEach(p => {
      let dayIndex = new Date(p.receivedAt).getDay() - 1 // Convert to Mon=0, Sun=6
      if (dayIndex < 0) dayIndex = 6
      revenueByDay[dayIndex] += p.amount / 1000
      totalWeeklyRevenue += p.amount
    })

    const activeStudentsCount = await db.student.count({ where: { status: 'ACTIVE' } })

    // 2. Real RTO Pass Rate & Avg Completion
    const tests = await db.drivingTest.findMany({
      include: { student: true }
    })
    
    let passedCount = 0
    let completedTestsCount = 0
    let totalCompletionDays = 0
    let studentsWithCompletion = 0

    tests.forEach(test => {
      if (test.result === 'PASS' || test.result === 'FAIL') {
        completedTestsCount++
        if (test.result === 'PASS') passedCount++
      }
      
      if (test.result === 'PASS' && test.student?.enrolledAt) {
        const daysToComplete = (test.date.getTime() - test.student.enrolledAt.getTime()) / (1000 * 3600 * 24)
        if (daysToComplete > 0) {
          totalCompletionDays += daysToComplete
          studentsWithCompletion++
        }
      }
    })

    const passRate = completedTestsCount > 0 ? ((passedCount / completedTestsCount) * 100).toFixed(1) : 0
    const avgCompletion = studentsWithCompletion > 0 ? Math.round(totalCompletionDays / studentsWithCompletion) : 0

    // Top Programs aggregation
    const students = await db.student.findMany()
    const beginnerCount = students.filter(s => s.trainingType === 'BEGINNER').length
    const advCount = students.filter(s => s.trainingType === 'ADVANCED').length
    const rtoCount = students.filter(s => s.trainingType === 'RTO_FAST_TRACK').length
    const totalStudents = students.length || 1

    const topPrograms = [
      { name: 'The Foundation', pct: Math.round((beginnerCount / totalStudents) * 100), color: 'bg-primary' },
      { name: 'RTO Fast-Track', pct: Math.round((rtoCount / totalStudents) * 100), color: 'bg-accent' },
      { name: 'Advanced Defensive', pct: Math.round((advCount / totalStudents) * 100), color: 'bg-text-3' }
    ]

    return NextResponse.json({
      revenueData: revenueByDay.length > 0 && totalWeeklyRevenue > 0 ? revenueByDay : [0, 0, 0, 0, 0, 0, 0],
      topStats: {
        activeStudents: activeStudentsCount.toString(),
        weeklyRevenue: `₹${(totalWeeklyRevenue / 100000).toFixed(1)}L`,
        avgCompletion: `${avgCompletion} Days`,
        rtoPassRate: `${passRate}%`
      },
      topPrograms
    }, { status: 200 })

  } catch (error) {
    console.error('Analytics Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
