export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const student = await db.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const tests = await db.drivingTest.findMany({
      where: { studentId: student.id },
      orderBy: { testDate: 'asc' }
    })

    return NextResponse.json(tests, { status: 200 })

  } catch (error) {
    console.error("Timeline GET error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const student = await db.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const { testId, newDate } = await req.json()

    // Verify the test belongs to the student
    const test = await db.drivingTest.findFirst({
      where: { id: testId, studentId: student.id }
    })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Ensure they are only rescheduling a SCHEDULED test
    if (test.result !== 'SCHEDULED') {
      return NextResponse.json({ error: "Cannot reschedule a completed test" }, { status: 400 })
    }

    const updatedTest = await db.drivingTest.update({
      where: { id: testId },
      data: { testDate: new Date(newDate) }
    })

    return NextResponse.json({ success: true, test: updatedTest }, { status: 200 })

  } catch (error) {
    console.error("Timeline PUT error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
