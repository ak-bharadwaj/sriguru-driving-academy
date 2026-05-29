export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface Slot {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
  instructorId: string
  createdAt?: string
}

// Resilient in-memory slot grid fallback in case DATABASE_URL is missing
let localSlotsMemory: Slot[] = []

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

function getClientIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}

function generateInitialSlots(trainingType: string) {
  const list: Slot[] = []
  
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

    // Find in-memory slots for this training type
    const existing = localSlotsMemory.filter(s => s.trainingType === type)
    let results = existing


    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to retrieve slots', details: message }, { status: 500 })
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
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create slot', details: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

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
  } catch {
    return NextResponse.json({ error: 'Slot modification failed' }, { status: 500 })
  }
}
