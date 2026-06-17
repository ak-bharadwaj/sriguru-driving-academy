export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TrainingType } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const url = new URL(request.url)
    const trainingType = (url.searchParams.get('trainingType') || 'BEGINNER') as TrainingType
    
    // Fetch directly from SyllabusDay table
    const days = await db.syllabusDay.findMany({
      where: { trainingType },
      orderBy: { dayNumber: 'asc' }
    })

    // Map to RoadmapNode structure for compatibility with client-side UI
    const nodes = days.map(day => {
      // Determine phase dynamically
      let phase = 'BEGINNER'
      if (trainingType === 'BEGINNER') {
        if (day.dayNumber <= 7) phase = 'BEGINNER'
        else if (day.dayNumber <= 14) phase = 'INTERMEDIATE'
        else phase = 'ADVANCED'
      } else if (trainingType === 'ADVANCED') {
        if (day.dayNumber <= 7) phase = 'ADVANCED'
        else phase = 'MASTERY'
      } else {
        phase = 'RTO'
      }

      // Determine icon
      let icon = 'Compass'
      const t = day.title.toLowerCase()
      if (t.includes('steer')) icon = 'CircleDashed'
      else if (t.includes('clutch') || t.includes('friction') || t.includes('gear')) icon = 'Zap'
      else if (t.includes('brake') || t.includes('stop')) icon = 'AlertTriangle'
      else if (t.includes('park')) icon = 'ParkingSquare'
      else if (t.includes('night')) icon = 'Moon'
      else if (t.includes('rain')) icon = 'CloudRain'
      else if (t.includes('highway') || t.includes('speed')) icon = 'Route'
      else if (t.includes('test') || t.includes('exam')) icon = 'Award'
      else if (t.includes('sign') || t.includes('rule')) icon = 'FileText'
      else {
        const icons = ['Compass', 'Key', 'RotateCw', 'AlignLeft', 'GitMerge']
        icon = icons[day.dayNumber % icons.length]
      }

      return {
        id: day.id,
        title: day.title,
        description: day.description,
        phase,
        orderIndex: day.dayNumber,
        icon,
        requiredCardSlugs: [],
        unlockThreshold: 0.8
      }
    })

    return NextResponse.json(nodes, { status: 200 })
  } catch (error) {
    console.error('Admin Roadmap GET Error:', error)
    return NextResponse.json({ error: 'Failed to load roadmap nodes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { title, description, orderIndex, trainingType } = body

    const newDay = await db.syllabusDay.create({
      data: {
        title,
        description,
        dayNumber: parseInt(orderIndex) || 1,
        trainingType: (trainingType || 'BEGINNER') as TrainingType
      }
    })

    // Return mapped object for compatibility
    return NextResponse.json({
      id: newDay.id,
      title: newDay.title,
      description: newDay.description,
      phase: 'BEGINNER',
      orderIndex: newDay.dayNumber,
      icon: 'Compass',
      requiredCardSlugs: [],
      unlockThreshold: 0.8
    }, { status: 201 })
  } catch (error) {
    console.error('Admin Roadmap POST Error:', error)
    return NextResponse.json({ error: 'Failed to create roadmap node' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { id, title, description, orderIndex, trainingType } = body

    const updatedDay = await db.syllabusDay.update({
      where: { id },
      data: {
        title,
        description,
        dayNumber: parseInt(orderIndex) || 1,
        trainingType: (trainingType || 'BEGINNER') as TrainingType
      }
    })

    return NextResponse.json({
      id: updatedDay.id,
      title: updatedDay.title,
      description: updatedDay.description,
      phase: 'BEGINNER',
      orderIndex: updatedDay.dayNumber,
      icon: 'Compass',
      requiredCardSlugs: [],
      unlockThreshold: 0.8
    }, { status: 200 })
  } catch (error) {
    console.error('Admin Roadmap PUT Error:', error)
    return NextResponse.json({ error: 'Failed to update roadmap node' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    // Clean any student syllabus progress records referencing this day
    await db.studentSyllabusProgress.deleteMany({
      where: { syllabusDayId: id }
    })

    const deletedDay = await db.syllabusDay.delete({
      where: { id }
    })
    return NextResponse.json(deletedDay, { status: 200 })
  } catch (error) {
    console.error('Admin Roadmap DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete roadmap node' }, { status: 500 })
  }
}
