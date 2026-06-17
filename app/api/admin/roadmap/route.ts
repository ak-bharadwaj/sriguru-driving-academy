export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Seed default nodes if none exist in the database yet
    let nodes = await db.roadmapNode.findMany({
      orderBy: { orderIndex: 'asc' }
    })

    if (nodes.length === 0) {
      const { RoadmapPhase } = require('@prisma/client')
      const DEFAULT_NODES = [
        { orderIndex: 1, title: 'Cockpit Drill', phase: RoadmapPhase.BEGINNER, description: 'Mastering seat, mirrors, and controls.', icon: 'Key', requiredCardSlugs: [] },
        { orderIndex: 2, title: 'Steering Control', phase: RoadmapPhase.BEGINNER, description: 'Figure-8 precision loops.', icon: 'CircleDashed', requiredCardSlugs: ['vehicle-startup', 'steering-control'] },
        { orderIndex: 3, title: 'Friction Point', phase: RoadmapPhase.BEGINNER, description: 'Perfect clutch control and incline starts.', icon: 'Zap', requiredCardSlugs: ['clutch-control'] },
        { orderIndex: 4, title: 'Basic Maneuvers', phase: RoadmapPhase.INTERMEDIATE, description: 'U-turns, 3-point turns, and reversing.', icon: 'RotateCw', requiredCardSlugs: [] },
        { orderIndex: 5, title: 'Bay Parking', phase: RoadmapPhase.INTERMEDIATE, description: 'Reverse parking into 90-degree bays.', icon: 'ParkingSquare', requiredCardSlugs: ['reverse-parking'] },
        { orderIndex: 6, title: 'Parallel Parking', phase: RoadmapPhase.INTERMEDIATE, description: 'Mastering the curb alignment.', icon: 'AlignLeft', requiredCardSlugs: ['parallel-parking'] },
        { orderIndex: 7, title: 'Traffic Integration', phase: RoadmapPhase.ADVANCED, description: 'Merging, lane discipline, and junctions.', icon: 'GitMerge', requiredCardSlugs: [] },
        { orderIndex: 8, title: 'Highway Driving', phase: RoadmapPhase.ADVANCED, description: 'High-speed control and overtaking.', icon: 'Route', requiredCardSlugs: ['highway-merging'] },
        { orderIndex: 9, title: 'Night Driving', phase: RoadmapPhase.ADVANCED, description: 'Visibility, glare handling, and rules.', icon: 'Moon', requiredCardSlugs: [] },
        { orderIndex: 10, title: 'Hazard Perception', phase: RoadmapPhase.RTO, description: 'Defensive driving and risk management.', icon: 'AlertTriangle', requiredCardSlugs: [] },
        { orderIndex: 11, title: 'Signs Theory', phase: RoadmapPhase.RTO, description: 'Mandatory, cautionary, and informatory signs.', icon: 'FileText', requiredCardSlugs: [] },
        { orderIndex: 12, title: 'Mock Examination', phase: RoadmapPhase.RTO, description: 'Complete timed dashboard theoretical mock tests.', icon: 'Award', requiredCardSlugs: [] },
      ]
      
      await db.roadmapNode.createMany({
        data: DEFAULT_NODES
      })
      nodes = await db.roadmapNode.findMany({
        orderBy: { orderIndex: 'asc' }
      })
    }

    return NextResponse.json(nodes, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
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
    const { title, description, phase, orderIndex, icon, requiredCardSlugs, unlockThreshold } = body

    const newNode = await db.roadmapNode.create({
      data: {
        title,
        description,
        phase,
        orderIndex: parseInt(orderIndex),
        icon: icon || 'Compass',
        requiredCardSlugs: requiredCardSlugs || [],
        unlockThreshold: parseFloat(unlockThreshold) || 0.8
      }
    })
    return NextResponse.json(newNode, { status: 201 })
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
    const { id, title, description, phase, orderIndex, icon, requiredCardSlugs, unlockThreshold } = body

    const updatedNode = await db.roadmapNode.update({
      where: { id },
      data: {
        title,
        description,
        phase,
        orderIndex: parseInt(orderIndex),
        icon: icon || 'Compass',
        requiredCardSlugs: requiredCardSlugs || [],
        unlockThreshold: parseFloat(unlockThreshold) || 0.8
      }
    })
    return NextResponse.json(updatedNode, { status: 200 })
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

    // First delete any StudentRoadmapNode dependencies if there are any cascade issues
    await db.studentRoadmapNode.deleteMany({
      where: { nodeId: id }
    })

    const deletedNode = await db.roadmapNode.delete({
      where: { id }
    })
    return NextResponse.json(deletedNode, { status: 200 })
  } catch (error) {
    console.error('Admin Roadmap DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete roadmap node' }, { status: 500 })
  }
}
