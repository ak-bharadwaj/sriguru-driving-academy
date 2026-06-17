export const dynamic = 'force-dynamic';
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

  const students = await db.student.findMany({
    select: {
      id: true,
      trainingType: true,
      feeStatus: true,
      courseFee: true,
      enrolledAt: true,
      status: true,
      user: { select: { name: true, email: true, phone: true } }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  if (format === 'csv') {
    const headers = ['Name', 'Email', 'Phone', 'TrainingType', 'FeeStatus', 'TotalPaid', 'EnrolledAt', 'Status']
    const rows = students.map(s => [
      `"${s.user.name}"`,
      `"${s.user.email}"`,
      `"${s.user.phone || ''}"`,
      s.trainingType,
      s.feeStatus,
      s.courseFee || 0,
      new Date(s.enrolledAt).toISOString().split('T')[0],
      s.status
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="students_report.csv"',
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=300'
      }
    })
  }

  return NextResponse.json(students, {
    headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' }
  })
}
