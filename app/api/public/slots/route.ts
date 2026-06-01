export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function getClientIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}

export async function GET(request: Request) {
  const ip = getClientIP(request)
  const limitCheck = rateLimit(ip)
  if (!limitCheck.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429 }
    )
  }

  try {
    // Under the unified single calendar system, we always query 'BEGINNER' slots
    // so there is only 1 unified time schedule.
    const slots = await db.slot.findMany({
      where: { trainingType: 'BEGINNER' },
      include: { instructor: { include: { user: true } } },
      orderBy: { dayOfWeek: 'asc' }
    })
    
    const results = slots.map(slot => ({
      id: slot.id,
      dayOfWeek: slot.dayOfWeek,
      time: slot.time,
      trainingType: slot.trainingType,
      maxCapacity: slot.maxCapacity,
      currentBooked: slot.currentCount,
      status: slot.currentCount >= slot.maxCapacity ? 'FULL' : slot.status,
      instructorId: slot.instructorId,
      instructorName: slot.instructor?.user?.name || 'Assigned Instructor'
    }))

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    })
  } catch (error) {
    console.error("Slots GET error", error)
    return NextResponse.json({ error: 'Failed to retrieve slots' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { dayOfWeek, time, maxCapacity, currentBooked, instructorId, status } = await request.json()
    
    // Always default instructor to first instructor if not provided
    let assignedInstructorId = instructorId
    if (!assignedInstructorId) {
      const firstInstructor = await db.instructor.findFirst()
      if (firstInstructor) {
        assignedInstructorId = firstInstructor.id
      } else {
        return NextResponse.json({ error: 'No instructor found to assign slot.' }, { status: 400 })
      }
    }

    // Always create slot under 'BEGINNER' trainingType for the single master calendar
    const newSlot = await db.slot.create({
      data: {
        dayOfWeek,
        time,
        trainingType: 'BEGINNER',
        maxCapacity: maxCapacity || 5,
        currentCount: currentBooked || 0,
        status: status || 'ACTIVE',
        instructorId: assignedInstructorId
      }
    })

    return NextResponse.json(newSlot, { status: 200 })
  } catch (error) {
    console.error("Slots POST error", error)
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { id, maxCapacity, currentBooked, status } = await request.json()
    
    const updated = await db.slot.update({
      where: { id },
      data: {
        maxCapacity,
        currentCount: currentBooked,
        status
      }
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error("Slots PUT error", error)
    return NextResponse.json({ error: 'Slot modification failed' }, { status: 500 })
  }
}
