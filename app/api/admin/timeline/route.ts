import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all tests for all students
    const tests = await db.drivingTest.findMany({
      orderBy: { testDate: 'asc' },
      include: {
        student: { include: { user: true } }
      }
    })

    return NextResponse.json(tests, { status: 200 })

  } catch (error) {
    console.error("Admin Timeline GET error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, testDate, testCenter, attemptNo, notes } = await req.json()

    if (!studentId || !testDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const test = await db.drivingTest.create({
      data: {
        studentId,
        testDate: new Date(testDate),
        testCenter,
        attemptNo: attemptNo || 1,
        notes,
        scheduledBy: (session.user as any).id
      }
    })

    return NextResponse.json({ success: true, test }, { status: 200 })

  } catch (error) {
    console.error("Admin Timeline POST error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { testId, testDate, testCenter, result, attemptNo, notes } = await req.json()

    const test = await db.drivingTest.update({
      where: { id: testId },
      data: {
        testDate: testDate ? new Date(testDate) : undefined,
        testCenter,
        result,
        attemptNo,
        notes
      }
    })

    return NextResponse.json({ success: true, test }, { status: 200 })

  } catch (error) {
    console.error("Admin Timeline PUT error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
