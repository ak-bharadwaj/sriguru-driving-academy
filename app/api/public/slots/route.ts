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
    // Under the unified single calendar system, query 'BEGINNER' slots with selective projection (no hashed passwords)
    const slots = await db.slot.findMany({
      where: { trainingType: 'BEGINNER' },
      select: {
        id: true,
        dayOfWeek: true,
        time: true,
        trainingType: true,
        maxCapacity: true,
        currentCount: true,
        status: true,
        instructorId: true,
        instructor: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
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

    const body = await request.json()
    
    // Handle Batch Creation Mode
    if (body.isBatch) {
      const { startDate, endDate, weekdays, times, maxCapacity, instructorId, status } = body
      
      let assignedInstructorId = instructorId
      if (!assignedInstructorId) {
        const firstInstructor = await db.instructor.findFirst({ select: { id: true } })
        if (firstInstructor) {
          assignedInstructorId = firstInstructor.id
        } else {
          return NextResponse.json({ error: 'No instructor found to assign slots.' }, { status: 400 })
        }
      }

      if (!startDate || !endDate || !Array.isArray(weekdays) || !Array.isArray(times) || times.length === 0) {
        return NextResponse.json({ error: 'Invalid batch configuration.' }, { status: 400 })
      }

      const checkDays = weekdays.map((d: string) => d.trim().toUpperCase())
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return NextResponse.json({ error: 'Invalid date range.' }, { status: 400 })
      }

      const createdSlots = []
      const current = new Date(start)
      current.setHours(12, 0, 0, 0)
      
      const safeEnd = new Date(end)
      safeEnd.setHours(12, 0, 0, 0)

      while (current <= safeEnd) {
        const dayOfWeekName = current.toLocaleDateString('en-US', { weekday: 'long' })
        const dayOfWeekShort = current.toLocaleDateString('en-US', { weekday: 'short' })
        
        const isMatched = checkDays.includes(dayOfWeekName.toUpperCase()) || 
                          checkDays.includes(dayOfWeekShort.toUpperCase()) ||
                          checkDays.some((d: string) => dayOfWeekName.toUpperCase().startsWith(d))

        if (isMatched) {
          const y = current.getFullYear()
          const m = String(current.getMonth() + 1).padStart(2, '0')
          const dy = String(current.getDate()).padStart(2, '0')
          const dateStr = `${y}-${m}-${dy}`

          for (const timeStr of times) {
            const existing = await db.slot.findFirst({
              where: {
                dayOfWeek: dateStr,
                time: timeStr,
                trainingType: 'BEGINNER',
                instructorId: assignedInstructorId
              },
              select: { id: true }
            })

            if (!existing) {
              const newSlot = await db.slot.create({
                data: {
                  dayOfWeek: dateStr,
                  time: timeStr,
                  trainingType: 'BEGINNER',
                  maxCapacity: maxCapacity || 5,
                  currentCount: 0,
                  status: status || 'ACTIVE',
                  instructorId: assignedInstructorId
                }
              })
              createdSlots.push(newSlot)
            }
          }
        }
        current.setDate(current.getDate() + 1)
      }

      return NextResponse.json({ success: true, count: createdSlots.length }, { status: 200 })
    }

    // Handle Single Creation Mode
    const { dayOfWeek, time, maxCapacity, currentBooked, instructorId, status } = body
    
    let assignedInstructorId = instructorId
    if (!assignedInstructorId) {
      const firstInstructor = await db.instructor.findFirst({ select: { id: true } })
      if (firstInstructor) {
        assignedInstructorId = firstInstructor.id
      } else {
        return NextResponse.json({ error: 'No instructor found to assign slot.' }, { status: 400 })
      }
    }

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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const dayOfWeek = searchParams.get('dayOfWeek')

    if (id) {
      const slot = await db.slot.findUnique({
        where: { id },
        select: {
          id: true,
          currentCount: true,
          bookings: {
            where: { status: { in: ['PENDING', 'APPROVED'] } },
            select: { id: true }
          }
        }
      })

      if (!slot) {
        return NextResponse.json({ error: 'Slot not found.' }, { status: 404 })
      }

      if (slot.bookings.length > 0 || slot.currentCount > 0) {
        return NextResponse.json({ error: 'Cannot delete a slot with active bookings.' }, { status: 400 })
      }

      await db.slot.delete({ where: { id } })
      return NextResponse.json({ success: true, message: 'Slot deleted successfully.' }, { status: 200 })
    }

    if (dayOfWeek) {
      const slotsForDay = await db.slot.findMany({
        where: { dayOfWeek, trainingType: 'BEGINNER' },
        select: {
          id: true,
          currentCount: true,
          bookings: {
            where: { status: { in: ['PENDING', 'APPROVED'] } },
            select: { id: true }
          }
        }
      })

      const hasBookings = slotsForDay.some(s => s.bookings.length > 0 || s.currentCount > 0)
      if (hasBookings) {
        return NextResponse.json({ error: 'Cannot purge date. Some slots contain active bookings.' }, { status: 400 })
      }

      await db.slot.deleteMany({
        where: { dayOfWeek, trainingType: 'BEGINNER' }
      })

      return NextResponse.json({ success: true, message: 'Slots for day purged successfully.' }, { status: 200 })
    }

    return NextResponse.json({ error: 'Missing parameters. Provide id or dayOfWeek.' }, { status: 400 })
  } catch (error) {
    console.error("Slots DELETE error:", error)
    return NextResponse.json({ error: 'Deletion failed.' }, { status: 500 })
  }
}
