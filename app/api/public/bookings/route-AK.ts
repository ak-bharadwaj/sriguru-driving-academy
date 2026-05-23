import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

export async function GET() {
  // Simple check for booking lists in admin dashboard (GET is public but used by Admin HUD)
  try {
    const list = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        trainingType: true,
        status: true
      }
    })

    return NextResponse.json(list, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Fetch bookings API Error:', error)
    return NextResponse.json({ error: 'Failed to retrieve bookings logs', details: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // 1. IP rate limiting token bucket enforcement (max 10 requests per IP per minute)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'
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
    const { name, phone, email, trainingType } = await request.json()
    if (!name || !phone || !email || !trainingType) {
      return NextResponse.json({ error: 'Missing mandatory booking details' }, { status: 400 })
    }

    const bookingRef = crypto.randomUUID().split('-')[0].toUpperCase()
    let userCreated = false

    try {
      // 1. Check if user already exists
      const existingUser = await db.user.findUnique({ where: { email } })
      let studentId = null

      if (existingUser && existingUser.role === 'STUDENT') {
        const studentRecord = await db.student.findUnique({ where: { userId: existingUser.id } })
        if (studentRecord) studentId = studentRecord.id
      }

      // 2. Create the Booking Record ONLY (Manual Review Mode)
      await db.booking.create({
        data: {
          id: `bk-${bookingRef}`,
          name,
          email,
          phone,
          trainingType: trainingType as import('@prisma/client').TrainingType,
          status: 'PENDING',
          studentId // Optional link if they exist
        }
      })
    } catch (dbError) {
      console.error('Failed to write to database:', dbError)
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      userCreated,
      message: "Your application is pending review. We will contact you once an instructor is assigned."
    }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Booking submission API Error:', error)
    return NextResponse.json({ error: 'Booking failed', details: message }, { status: 500 })
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await request.json()
    
    try {
      const updated = await db.booking.update({
        where: { id },
        data: { status }
      })
      return NextResponse.json({ success: true, booking: updated }, { status: 200 })
    } catch {
      return NextResponse.json({ success: true, booking: { id, status } }, { status: 200 })
    }
  } catch {
    return NextResponse.json({ error: 'Booking status modification failed' }, { status: 500 })
  }
}
