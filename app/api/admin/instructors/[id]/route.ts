import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { name, email, phone, experienceYears, avatarUrl, specialization, bio } = await request.json()

    // Find the instructor by id
    const instructor = await db.instructor.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found.' }, { status: 444 })
    }

    // Update the User details safely
    await db.user.update({
      where: { id: instructor.userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone === undefined ? undefined : (phone || null),
        avatarUrl: avatarUrl === undefined ? undefined : (avatarUrl || null),
      }
    })

    // Update the Instructor details
    const updated = await db.instructor.update({
      where: { id: params.id },
      data: {
        yearsExp: (experienceYears !== undefined && experienceYears !== null) ? parseInt(experienceYears.toString()) : undefined,
        specialization: specialization === undefined ? undefined : (specialization || null),
        bio: bio === undefined ? undefined : (bio || null),
      },
      include: { user: true }
    })

    return NextResponse.json({ success: true, instructor: updated })
  } catch (error: any) {
    console.error('Failed to update instructor:', error)
    return NextResponse.json({ error: error.message || 'Failed to update instructor.' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    // Find the instructor to get the associated userId
    const instructor = await db.instructor.findUnique({
      where: { id: params.id }
    })

    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found.' }, { status: 444 })
    }

    // Set instructorId to null for all students assigned to this instructor
    await db.student.updateMany({
      where: { instructorId: params.id },
      data: { instructorId: null }
    })

    // Delete associated slots
    await db.slot.deleteMany({
      where: { instructorId: params.id }
    })

    // Delete associated logs/coaching notes/sessions etc.
    await db.session.deleteMany({
      where: { instructorId: params.id }
    })
    
    await db.coachingNote.deleteMany({
      where: { instructorId: params.id }
    })

    await db.instructorLog.deleteMany({
      where: { instructorId: params.id }
    })

    // Delete instructor record
    await db.instructor.delete({
      where: { id: params.id }
    })

    // Delete associated user record
    await db.user.delete({
      where: { id: instructor.userId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete instructor:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete instructor.' }, { status: 500 })
  }
}
