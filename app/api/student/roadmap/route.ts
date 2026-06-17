export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RoadmapPhase } from '@prisma/client'

// Default roadmap nodes to seed if DB is empty
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let nodes = await db.roadmapNode.findMany({
      orderBy: { orderIndex: 'asc' }
    })

    if (nodes.length === 0) {
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
    console.error('Roadmap API Error:', error)
    return NextResponse.json({ error: 'Failed to load roadmap nodes' }, { status: 500 })
  }
}
