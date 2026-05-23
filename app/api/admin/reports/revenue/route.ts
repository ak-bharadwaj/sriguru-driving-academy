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

  const payments = await db.payment.findMany({
    include: { student: { include: { user: { select: { name: true } } } } },
    orderBy: { receivedAt: 'desc' }
  })

  if (format === 'csv') {
    const headers = ['StudentName', 'Amount', 'Method', 'Note', 'ReceivedAt']
    const rows = payments.map(p => [
      `"${p.student.user.name}"`,
      p.amount,
      p.method,
      `"${p.note || ''}"`,
      new Date(p.receivedAt).toISOString().split('T')[0]
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="revenue_report.csv"'
      }
    })
  }

  return NextResponse.json(payments)
}
