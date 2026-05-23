import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST: Schedule a new driving test
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { testDate, testCenter, notes } = body

    if (!testDate) {
      return NextResponse.json({ error: 'Test date required' }, { status: 400 })
    }

    const studentId = params.id
    const adminId = (session.user as any).id

    // Get current attempt count
    const existingTests = await db.drivingTest.count({
      where: { studentId }
    })

    const test = await db.drivingTest.create({
      data: {
        studentId,
        testDate: new Date(testDate),
        testCenter: testCenter || null,
        notes: notes || null,
        scheduledBy: adminId,
        attemptNo: existingTests + 1,
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Test scheduling error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Record test result (pass/fail)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { testId, result, notes } = body

    if (!testId || !result) {
      return NextResponse.json({ error: 'Test ID and result required' }, { status: 400 })
    }

    if (!['PASS', 'FAIL'].includes(result)) {
      return NextResponse.json({ error: 'Result must be PASS or FAIL' }, { status: 400 })
    }

    const test = await db.drivingTest.update({
      where: { id: testId },
      data: {
        result,
        notes: notes || undefined,
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Test result error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Test history
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tests = await db.drivingTest.findMany({
      where: { studentId: params.id },
      orderBy: { testDate: 'desc' }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Test fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
