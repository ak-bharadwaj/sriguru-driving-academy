import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// Resilient in-memory slot grid fallback in case DATABASE_URL is missing
let localSlotsMemory: any[] = []

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

function getClientIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}

function generateInitialSlots(trainingType: string) {
  const list: any[] = []
  
  DAYS.forEach(day => {
    HOURS.forEach((hour, idx) => {
      // Create interesting distribution of Active, Full, Closed, and Draft slots
      let status = 'ACTIVE'
      let currentBooked = 0
      
      if (idx === 1 || idx === 4) {
        status = 'FULL'
        currentBooked = 5
      } else if (idx === 3) {
        status = 'CLOSED'
      } else if (idx === 5) {
        status = 'DRAFT'
      }

      list.push({
        id: `slot-${day.toLowerCase()}-${hour}-${trainingType.toLowerCase().replace(/\s+/g, '')}`,
        dayOfWeek: day,
        time: hour,
        trainingType,
        maxCapacity: 5,
        currentBooked,
        status,
        instructorId: 'ins-1'
      })
    })
  })
  return list
}

export async function GET(request: Request) {
  // Rate Limit check
  const ip = getClientIP(request)
  const limitCheck = rateLimit(ip)
  if (!limitCheck.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Limit 10 requests per minute.' }),
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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'Beginner'

    // Find or generate in-memory slots for this training type
    const existing = localSlotsMemory.filter(s => s.trainingType === type)
    let results = existing
    if (existing.length === 0) {
      const seeded = generateInitialSlots(type)
      localSlotsMemory = [...localSlotsMemory, ...seeded]
      results = seeded
    }

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve slots', details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Rate Limit check
  const ip = getClientIP(request)
  const limitCheck = rateLimit(ip)
  if (!limitCheck.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Limit 10 requests per minute.' }),
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
    const { dayOfWeek, time, trainingType, maxCapacity, instructorId, status } = await request.json()
    
    const newSlot = {
      id: `slot-${Math.random().toString(36).substring(7)}`,
      dayOfWeek,
      time,
      trainingType,
      maxCapacity: maxCapacity || 5,
      currentBooked: 0,
      status: status || 'ACTIVE',
      instructorId: instructorId || 'ins-1',
      createdAt: new Date().toISOString()
    }

    // Save to memory
    localSlotsMemory.push(newSlot)
    return NextResponse.json(newSlot, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create slot', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, currentBooked } = await request.json()
    
    // Update locally
    localSlotsMemory = localSlotsMemory.map(s => {
      if (s.id === id) {
        return { ...s, status: status || s.status, currentBooked: currentBooked !== undefined ? currentBooked : s.currentBooked }
      }
      return s
    })
    const updated = localSlotsMemory.find(s => s.id === id)
    return NextResponse.json(updated, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Slot modification failed' }, { status: 500 })
  }
}
