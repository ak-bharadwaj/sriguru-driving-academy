import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { bookingId, instructorId } = await request.json()
    if (!bookingId) return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })

    const booking = await db.booking.findUnique({ where: { id: bookingId } })
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    if (booking.status === 'APPROVED') {
      return NextResponse.json({ error: 'Booking is already approved.' }, { status: 400 })
    }

    // 1. Create the User/Student record from booking data
    // (If the user already applied with this email and has a user record, we'll try to find it first)
    let studentId = booking.studentId

    if (!studentId) {
      let existingUser = await db.user.findUnique({ where: { email: booking.email } })
      
      if (!existingUser) {
        // Create new user & student
        const passwordHash = await bcrypt.hash('default', 10)
        
        let courseFee = 0
        if (booking.trainingType === 'BEGINNER') courseFee = 8999
        if (booking.trainingType === 'ADVANCED') courseFee = 6500
        if (booking.trainingType === 'RTO_FAST_TRACK') courseFee = 4999

        const newUser = await db.user.create({
          data: {
            email: booking.email,
            phone: booking.phone,
            name: booking.name,
            role: 'STUDENT',
            passwordHash,
            student: {
              create: {
                trainingType: booking.trainingType,
                status: 'ACTIVE',
                courseFee,
                instructorId: instructorId || null
              }
            }
          },
          include: { student: true }
        })
        studentId = newUser.student?.id || null
      } else if (existingUser.role === 'STUDENT') {
        const studentRecord = await db.student.findUnique({ where: { userId: existingUser.id } })
        if (studentRecord) {
          studentId = studentRecord.id
          if (instructorId) {
            await db.student.update({ where: { id: studentId }, data: { instructorId } })
          }
        }
      }
    } else if (instructorId) {
       // If student already exists, just update their instructor
       await db.student.update({ where: { id: studentId }, data: { instructorId } })
    }

    // 2. Mark booking as APPROVED
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: 'APPROVED',
        studentId // Link it to the newly created/found student
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Booking approval error:', error)
    return NextResponse.json({ error: 'Failed to approve booking' }, { status: 500 })
  }
}
