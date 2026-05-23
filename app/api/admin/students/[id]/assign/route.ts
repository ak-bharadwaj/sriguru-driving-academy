import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// PUT: Assign or change instructor for a student
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
    const { instructorId } = body

    if (!instructorId) {
      return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
    }

    const student = await db.student.update({
      where: { id: params.id },
      data: { instructorId },
      include: {
        instructor: {
          include: { user: { select: { name: true } } }
        }
      }
    })

    return NextResponse.json({
      instructorId: student.instructorId,
      instructorName: student.instructor?.user.name
    })
  } catch (error) {
    console.error('Instructor assignment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
