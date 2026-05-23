import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format')

  const tests = await db.drivingTest.findMany({
    include: {
      student: { include: { user: { select: { name: true } } } }
    },
    orderBy: { testDate: 'desc' }
  })

  if (format === 'csv') {
    const headers = ['StudentName', 'TestDate', 'TestCenter', 'Result', 'AttemptNo']
    const rows = tests.map(t => [
      `"${t.student.user.name}"`,
      new Date(t.testDate).toISOString().split('T')[0],
      `"${t.testCenter || ''}"`,
      t.result,
      t.attemptNo
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="tests_report.csv"'
      }
    })
  }

  return NextResponse.json(tests)
}
