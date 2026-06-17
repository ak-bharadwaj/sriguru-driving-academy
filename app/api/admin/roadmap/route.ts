export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const url = new URL(request.url)
    const trainingType = url.searchParams.get('trainingType') || 'BEGINNER'
    
    // Seed default nodes if none exist in the database for this trainingType yet
    let nodes = await db.roadmapNode.findMany({
      where: { trainingType: trainingType as any },
      orderBy: { orderIndex: 'asc' }
    })

    if (nodes.length === 0) {
      const { RoadmapPhase, TrainingType } = require('@prisma/client')
      const DEFAULT_NODES_BY_TYPE = {
        BEGINNER: [
          { orderIndex: 1, title: 'Vehicle Basics', phase: RoadmapPhase.BEGINNER, description: 'Cockpit drills, startup sequencing, and steering mechanics.', icon: 'Compass', requiredCardSlugs: ['vehicle-startup', 'steering-control'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 2, title: 'Basic Control', phase: RoadmapPhase.BEGINNER, description: 'Master clutch friction points, shifting sequencing, and progressive braking.', icon: 'Gauge', requiredCardSlugs: ['clutch-control', 'braking'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 3, title: 'Safety Essentials', phase: RoadmapPhase.BEGINNER, description: 'MSM mirror routines, blind spot checks, and traffic signal theory.', icon: 'ShieldAlert', requiredCardSlugs: ['mirror-checking', 'blind-spots', 'traffic-signals'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 4, title: 'Incline Control', phase: RoadmapPhase.INTERMEDIATE, description: 'Coordinating slope holds, handbrake starts, and uphill clutch crawl vectors.', icon: 'TrendingUp', requiredCardSlugs: ['hill-starts'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 5, title: 'Street Integration', phase: RoadmapPhase.INTERMEDIATE, description: 'Lane discipline, standard overtaking safety margins, and roundabout exit routines.', icon: 'Milestone', requiredCardSlugs: ['lane-changing', 'roundabouts'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 6, title: 'Parking Mechanics', phase: RoadmapPhase.INTERMEDIATE, description: 'Reverse bay slots, parallel parking references, and kerb alignment vectors.', icon: 'Maximize', requiredCardSlugs: ['parallel-parking', 'reverse-parking', 'parking-alignment'], trainingType: TrainingType.BEGINNER },
          { orderIndex: 7, title: 'Highway Dynamics', phase: RoadmapPhase.ADVANCED, description: 'Fast slip road lane merging, speed coordination, and dual-carriageway spacing.', icon: 'Zap', requiredCardSlugs: ['highway-merging', 'overtaking'], trainingType: TrainingType.BEGINNER }
        ],
        ADVANCED: [
          { orderIndex: 1, title: 'Advanced Control', phase: RoadmapPhase.ADVANCED, description: 'High-speed handling, clutchless control, and rev-matching concepts.', icon: 'Gauge', requiredCardSlugs: ['clutch-control', 'braking'], trainingType: TrainingType.ADVANCED },
          { orderIndex: 2, title: 'Street & Highway', phase: RoadmapPhase.ADVANCED, description: 'Highway lane merging, high-speed overtaking, and defensive positioning.', icon: 'Milestone', requiredCardSlugs: ['lane-changing', 'highway-merging', 'overtaking'], trainingType: TrainingType.ADVANCED },
          { orderIndex: 3, title: 'Adverse Elements', phase: RoadmapPhase.ADVANCED, description: 'Hydroplaning control, wet-weather stopping margins, and nighttime glare management.', icon: 'CloudRain', requiredCardSlugs: ['rain-driving', 'night-driving'], trainingType: TrainingType.ADVANCED },
          { orderIndex: 4, title: 'Emergency Management', phase: RoadmapPhase.MASTERY, description: 'Sudden obstacle avoidance, maximum ABS hard braking, and engine failure drills.', icon: 'LifeBuoy', requiredCardSlugs: ['emergency-braking'], trainingType: TrainingType.ADVANCED }
        ],
        RTO_FAST_TRACK: [
          { orderIndex: 1, title: 'RTO Signs Theory', phase: RoadmapPhase.RTO, description: 'Mandatory, cautionary, and informatory road signs overview.', icon: 'FileText', requiredCardSlugs: ['traffic-signals'], trainingType: TrainingType.RTO_FAST_TRACK },
          { orderIndex: 2, title: 'Safety & Hazards', phase: RoadmapPhase.RTO, description: 'Blind spots check routines, hazard perception, and defensive driving theory.', icon: 'ShieldAlert', requiredCardSlugs: ['blind-spots'], trainingType: TrainingType.RTO_FAST_TRACK },
          { orderIndex: 3, title: 'Mock Test Series', phase: RoadmapPhase.RTO, description: 'Complete timed RTO exam mock tests.', icon: 'Award', requiredCardSlugs: [], trainingType: TrainingType.RTO_FAST_TRACK }
        ]
      }
      
      const defaultToSeed = DEFAULT_NODES_BY_TYPE[trainingType as keyof typeof DEFAULT_NODES_BY_TYPE] || DEFAULT_NODES_BY_TYPE.BEGINNER
      
      await db.roadmapNode.createMany({
        data: defaultToSeed
      })
      nodes = await db.roadmapNode.findMany({
        where: { trainingType: trainingType as any },
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
    const { title, description, phase, orderIndex, icon, requiredCardSlugs, unlockThreshold, trainingType } = body

    const newNode = await db.roadmapNode.create({
      data: {
        title,
        description,
        phase,
        orderIndex: parseInt(orderIndex),
        icon: icon || 'Compass',
        requiredCardSlugs: requiredCardSlugs || [],
        unlockThreshold: parseFloat(unlockThreshold) || 0.8,
        trainingType: trainingType || 'BEGINNER'
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
    const { id, title, description, phase, orderIndex, icon, requiredCardSlugs, unlockThreshold, trainingType } = body

    const updatedNode = await db.roadmapNode.update({
      where: { id },
      data: {
        title,
        description,
        phase,
        orderIndex: parseInt(orderIndex),
        icon: icon || 'Compass',
        requiredCardSlugs: requiredCardSlugs || [],
        unlockThreshold: parseFloat(unlockThreshold) || 0.8,
        trainingType: trainingType || 'BEGINNER'
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
