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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'BEGINNER'

    const slots = await db.slot.findMany({
      where: { trainingType: type as any },
      include: { instructor: { include: { user: true } } }
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
      instructorName: slot.instructor.user.name
    }))

    return NextResponse.json(results, { status: 200 })
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

    const { dayOfWeek, time, trainingType, maxCapacity, currentBooked, instructorId, status } = await request.json()
    
    const newSlot = await db.slot.create({
      data: {
        dayOfWeek,
        time,
        trainingType: trainingType as any,
        maxCapacity: maxCapacity || 5,
        currentCount: currentBooked || 0,
        status: status || 'ACTIVE',
        instructorId: instructorId || (session.user as any).instructorId // Admin must provide instructorId
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
