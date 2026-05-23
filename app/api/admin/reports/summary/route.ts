import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user && (session.user as any).role === 'ADMIN'
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    studentsByType,
    totalRevenue,
    monthRevenue,
    paymentMethods,
    sessionStatuses,
    testResults,
    totalStudents
  ] = await Promise.all([
    db.student.groupBy({ by: ['trainingType'], _count: { id: true } }),
    db.payment.aggregate({ _sum: { amount: true } }),
    db.payment.aggregate({ where: { receivedAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    db.payment.groupBy({ by: ['method'], _count: { id: true }, _sum: { amount: true } }),
    db.session.groupBy({ by: ['status'], _count: { id: true } }),
    db.drivingTest.groupBy({ by: ['result'], _count: { id: true } }),
    db.student.count()
  ])

  const passCount = testResults.find(r => r.result === 'PASS')?._count.id || 0
  const failCount = testResults.find(r => r.result === 'FAIL')?._count.id || 0
  const scheduledCount = testResults.find(r => r.result === 'SCHEDULED')?._count.id || 0
  const totalTests = passCount + failCount + scheduledCount
  const passRate = totalTests > 0 ? Math.round((passCount / (passCount + failCount)) * 100) : 0

  return NextResponse.json({
    students: {
      total: totalStudents,
      byType: studentsByType.map(s => ({ type: s.trainingType, count: s._count.id }))
    },
    revenue: {
      total: totalRevenue._sum.amount || 0,
      thisMonth: monthRevenue._sum.amount || 0,
      byMethod: paymentMethods.map(m => ({ method: m.method, count: m._count.id, total: m._sum.amount || 0 }))
    },
    sessions: {
      byStatus: sessionStatuses.map(s => ({ status: s.status, count: s._count.id }))
    },
    tests: {
      pass: passCount,
      fail: failCount,
      scheduled: scheduledCount,
      passRate
    }
  })
}
