export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function getClientIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}

export async function GET(request: Request) {
  try {
    const list = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        trainingType: true,
        status: true,
        reference: true,
        createdAt: true,
        student: {
          select: {
            regNo: true
          }
        }
      }
    })

    return NextResponse.json(list, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=5, stale-while-revalidate=5'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Fetch bookings API Error:', error)
    return NextResponse.json({ error: 'Failed to retrieve bookings', details: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const clientIp = getClientIP(request)
  const limitCheck = rateLimit(clientIp)

  if (!limitCheck.success) {
    return NextResponse.json(
      { error: 'Too many booking requests. Please wait before retrying.' },
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limitCheck.retryAfterSeconds)
        } 
      }
    )
  }

  try {
    const { name, phone, email, trainingType, slotId, password } = await request.json()
    if (!name || !phone || !email || !trainingType) {
      return NextResponse.json({ error: 'Missing mandatory booking details' }, { status: 400 })
    }

    // Map course ID to schema's TrainingType enum
    let mappedTrainingType: import('@prisma/client').TrainingType = 'BEGINNER'
    if (trainingType === 'course-beginner' || trainingType === 'BEGINNER') {
      mappedTrainingType = 'BEGINNER'
    } else if (trainingType === 'course-advanced' || trainingType === 'ADVANCED') {
      mappedTrainingType = 'ADVANCED'
    } else if (trainingType === 'course-rto' || trainingType === 'RTO_FAST_TRACK') {
      mappedTrainingType = 'RTO_FAST_TRACK'
    }

    const bookingRef = Math.random().toString(36).substring(2, 10).toUpperCase()
    let regNo = 'N/A'
    
    // 1. Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } })
    let studentId = null

    if (!existingUser) {
      // Calculate the registration number (YYYY_NN)
      const currentYear = new Date().getFullYear()
      const startOfYear = new Date(currentYear, 0, 1)
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)
      const countThisYear = await db.student.count({
        where: {
          enrolledAt: { gte: startOfYear, lte: endOfYear }
        }
      })
      regNo = `${currentYear}_${String(countThisYear + 1).padStart(2, '0')}`

      // Create new user & student with custom or default password sriguru123
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash(password || 'sriguru123', 10)
      
      let courseFee = 4999
      if (mappedTrainingType === 'ADVANCED') courseFee = 6999
      if (mappedTrainingType === 'RTO_FAST_TRACK') courseFee = 2999

      const newUser = await db.user.create({
        data: {
          email,
          phone,
          name,
          role: 'STUDENT',
          passwordHash,
          student: {
            create: {
              regNo,
              trainingType: mappedTrainingType,
              status: 'ACTIVE',
              courseFee
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
        regNo = studentRecord.regNo || 'N/A'
      }
    }

    // 2. Create the booking entry and link it to the student & slot
    const newBooking = await db.booking.create({
      data: {
        id: `bk-${bookingRef}`,
        name,
        email,
        phone,
        trainingType: mappedTrainingType,
        status: 'PENDING',
        studentId,
        slotId
      }
    })

    // 3. Increment the matching slot's booked counter
    if (slotId) {
      await db.slot.update({
        where: { id: slotId },
        data: { currentCount: { increment: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      regNo,
      message: "Registration successful! You now have instant access to your student portal using password: sriguru123"
    }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Booking submission API Error:', error)
    return NextResponse.json({ error: 'Booking failed', details: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await request.json()
    
    const updated = await db.booking.update({
      where: { id },
      data: { status }
    })
    return NextResponse.json({ success: true, booking: updated }, { status: 200 })
  } catch (error) {
    console.error("Booking PUT error:", error)
    return NextResponse.json({ error: 'Booking status modification failed' }, { status: 500 })
  }
}
