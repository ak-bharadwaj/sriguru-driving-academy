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

    // 1. Weekly Revenue Array (Mock logic: just splitting the sum across 7 days for the chart, in real life we would group by day)
    const recentPayments = await db.payment.findMany({
      where: {
        receivedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    // Aggregate by day (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // The UI expects [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    const revenueByDay = [0, 0, 0, 0, 0, 0, 0]
    let totalWeeklyRevenue = 0
    recentPayments.forEach(p => {
      let dayIndex = new Date(p.receivedAt).getDay() - 1 // Convert to Mon=0, Sun=6
      if (dayIndex < 0) dayIndex = 6
      revenueByDay[dayIndex] += p.amount / 1000 // UI expects values scaled down for chart, but wait, UI multiplies by 1000 in tooltip. So we return raw divided by 1000
      totalWeeklyRevenue += p.amount
    })

    const activeStudents = await db.student.count()

    // 2. Mock RTO Pass Rate & Avg Completion (Since we don't have enough DB history to calculate averages accurately yet)
    // In a full implementation, you would aggregate `Session` durations and `DrivingTest` results.
    const passRate = 94.2
    const avgCompletion = 28

    return NextResponse.json({
      revenueData: revenueByDay.length > 0 && totalWeeklyRevenue > 0 ? revenueByDay : [0, 0, 0, 0, 0, 0, 0],
      topStats: {
        activeStudents: activeStudents.toString(),
        weeklyRevenue: `₹${(totalWeeklyRevenue / 100000).toFixed(1)}L`,
        avgCompletion: `${avgCompletion} Days`,
        rtoPassRate: `${passRate}%`
      },
      topPrograms: [
        { name: 'The Foundation', pct: 64, color: 'bg-primary' },
        { name: 'RTO Fast-Track', pct: 24, color: 'bg-accent' },
        { name: 'Advanced Defensive', pct: 12, color: 'bg-text-3' }
      ]
    }, { status: 200 })

  } catch (error) {
    console.error('Analytics Fetch Error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
