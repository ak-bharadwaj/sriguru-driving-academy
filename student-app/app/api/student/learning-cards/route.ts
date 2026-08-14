export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Default learning cards to seed if DB is empty
const DEFAULT_CARDS = [
  {
    slug: 'vehicle-startup',
    title: 'Vehicle Startup Process',
    category: 'basics',
    phase: 'BEGINNER' as const,
    xpReward: 10,
    orderIndex: 1,
    steps: ['Adjust seat and mirrors', 'Fasten seatbelt', 'Check gear is neutral', 'Press clutch', 'Turn ignition', 'Release handbrake'],
    commonMistakes: ['Forgetting neutral gear', 'Not pressing clutch'],
    instructorTips: ['Always do mirror check before starting'],
    safetyWarnings: ['Never start in gear'],
    quizQuestion: 'What gear should the vehicle be in before starting?',
    quizOptions: ['First gear', 'Neutral', 'Reverse', 'Second gear'],
    quizAnswer: 'Neutral'
  },
  {
    slug: 'steering-control',
    title: 'Steering Control Mastery',
    category: 'control',
    phase: 'BEGINNER' as const,
    xpReward: 15,
    orderIndex: 2,
    steps: ['Hold at 9 and 3 position', 'Keep firm but relaxed grip', 'Push-pull method for turns', 'Return wheel smoothly'],
    commonMistakes: ['Crossing hands', 'Gripping too tight'],
    instructorTips: ['Imagine the wheel as a clock face'],
    safetyWarnings: ['Never take both hands off wheel while moving'],
    quizQuestion: 'What is the correct hand position on the steering wheel?',
    quizOptions: ['12 and 6', '10 and 2', '9 and 3', '8 and 4'],
    quizAnswer: '9 and 3'
  },
  {
    slug: 'clutch-control',
    title: 'Clutch Friction Point Control',
    category: 'control',
    phase: 'BEGINNER' as const,
    xpReward: 20,
    orderIndex: 3,
    steps: ['Press fully before gear change', 'Find biting point slowly', 'Release smoothly while giving gas', 'Coordinate with accelerator'],
    commonMistakes: ['Releasing clutch too fast', 'Riding the clutch'],
    instructorTips: ['Listen for the engine sound change at biting point'],
    safetyWarnings: ['Never coast with clutch pressed on downhill'],
    quizQuestion: 'What is "riding the clutch"?',
    quizOptions: ['Pressing clutch halfway down constantly', 'Pressing clutch fully', 'Releasing clutch completely', 'Using the clutch to brake'],
    quizAnswer: 'Pressing clutch halfway down constantly'
  },
  {
    slug: 'parallel-parking',
    title: 'Parallel Parking Alignment',
    category: 'parking',
    phase: 'INTERMEDIATE' as const,
    xpReward: 30,
    orderIndex: 4,
    steps: ['Position parallel next to lead vehicle', 'Turn wheel completely left', 'Reverse until 45 degree angle', 'Straighten and adjust distance'],
    commonMistakes: ['Reversing too fast', 'Improper starting distance'],
    instructorTips: ['Use your side passenger mirror as a guide indicator'],
    safetyWarnings: ['Always check blind spots for pedestrian movements'],
    quizQuestion: 'At what angle should you reverse when starting to park parallel?',
    quizOptions: ['30 degrees', '45 degrees', '60 degrees', '90 degrees'],
    quizAnswer: '45 degrees'
  },
  {
    slug: 'highway-merging',
    title: 'Highway Lane Merging',
    category: 'highway',
    phase: 'ADVANCED' as const,
    xpReward: 40,
    orderIndex: 5,
    steps: ['Accelerate to match freeway flow speed', 'Activate appropriate side turn indicator', 'Perform shoulder check alignment', 'Merge smoothly into lane space'],
    commonMistakes: ['Merging too slow', 'Not checking direct shoulder blind spots'],
    instructorTips: ['The merging ramp is for speed coordination, use it fully'],
    safetyWarnings: ['Never stop on the acceleration merge ramp lane'],
    quizQuestion: 'What should you do on the highway merging ramp lane?',
    quizOptions: ['Match freeway speed flow', 'Stop and wait for slot', 'Sound horn continuously', 'Drive at minimum speed'],
    quizAnswer: 'Match freeway speed flow'
  },
  {
    slug: 'reverse-parking',
    title: 'Reverse Bay Parking',
    category: 'parking',
    phase: 'INTERMEDIATE' as const,
    xpReward: 25,
    orderIndex: 6,
    steps: [
      'Position car 1 meter from bay edge',
      'Identify reference point for turn',
      'Full lock reverse into bay',
      'Straighten when car is aligned',
      'Reverse slowly to complete'
    ],
    commonMistakes: ['Turning too early', 'Not checking surroundings'],
    instructorTips: ['Use bay lines as reference in mirrors'],
    safetyWarnings: ['Someone must guide if visibility is limited'],
    quizQuestion: 'What is the key reference to begin reversing into a bay?',
    quizOptions: [
      'When side mirror aligns with bay line',
      'When rear wheels pass bay line',
      'When front wheels pass bay line'
    ],
    quizAnswer: 'When side mirror aligns with bay line'
  },
  {
    slug: 'three-point-turn',
    title: 'Three-Point Turn',
    category: 'advanced',
    phase: 'ADVANCED' as const,
    xpReward: 35,
    orderIndex: 7,
    steps: ['Check mirrors and blind spots', 'Steer fully right and move forward', 'Steer fully left and reverse', 'Steer right and proceed forward'],
    commonMistakes: ['Not checking traffic before each move', 'Hitting the curb'],
    instructorTips: ['Take your time and use full steering lock'],
    safetyWarnings: ['Never attempt on a busy road or near a curve'],
    quizQuestion: 'What is the most important step before starting a three-point turn?',
    quizOptions: ['Signaling', 'Checking traffic in all directions', 'Honking the horn', 'Accelerating quickly'],
    quizAnswer: 'Checking traffic in all directions'
  },
  {
    slug: 'emergency-braking',
    title: 'Emergency Braking',
    category: 'emergencies',
    phase: 'ADVANCED' as const,
    xpReward: 40,
    orderIndex: 8,
    steps: ['React quickly to the hazard', 'Apply firm and steady pressure to brake', 'Keep both hands on the steering wheel', 'Come to a complete stop'],
    commonMistakes: ['Pumping ABS brakes', 'Swerving while braking hard'],
    instructorTips: ['Trust the ABS system to prevent wheel lockup'],
    safetyWarnings: ['Only practice in designated safe areas'],
    quizQuestion: 'How should you apply the brakes in a vehicle with ABS during an emergency?',
    quizOptions: ['Pump them rapidly', 'Press softly', 'Apply firm and steady pressure', 'Use the handbrake'],
    quizAnswer: 'Apply firm and steady pressure'
  },
  {
    slug: 'roundabout',
    title: 'Roundabout Navigation',
    category: 'advanced',
    phase: 'INTERMEDIATE' as const,
    xpReward: 25,
    orderIndex: 9,
    steps: ['Yield to traffic already in the roundabout', 'Enter when safe', 'Stay in your lane', 'Signal before exiting'],
    commonMistakes: ['Stopping inside the roundabout', 'Not yielding upon entry'],
    instructorTips: ['Look right before entering'],
    safetyWarnings: ['Always use your turn signals'],
    quizQuestion: 'Who has the right of way at a roundabout?',
    quizOptions: ['Vehicles entering', 'Vehicles already in the roundabout', 'The largest vehicle', 'No one'],
    quizAnswer: 'Vehicles already in the roundabout'
  },
  {
    slug: 'night-driving',
    title: 'Night Driving',
    category: 'advanced',
    phase: 'ADVANCED' as const,
    xpReward: 45,
    orderIndex: 10,
    steps: ['Turn on headlights', 'Dim dashboard lights', 'Keep eyes moving to avoid glare', 'Increase following distance'],
    commonMistakes: ['Staring directly at oncoming headlights', 'Overdriving your headlights'],
    instructorTips: ['Look towards the right edge of the road if blinded'],
    safetyWarnings: ['Never drive with parking lights only'],
    quizQuestion: 'What should you do if an oncoming vehicle has high beams on?',
    quizOptions: ['Flash your high beams', 'Stare at their lights', 'Look toward the right edge of your lane', 'Speed up'],
    quizAnswer: 'Look toward the right edge of your lane'
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let cards = await db.learningCard.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        phase: true,
        xpReward: true,
        steps: true,
        commonMistakes: true,
        instructorTips: true,
        safetyWarnings: true,
        quizQuestion: true,
        quizOptions: true,
        quizAnswer: true,
        orderIndex: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    })

    // Sync missing cards if the DB doesn't have all 10
    if (cards.length < DEFAULT_CARDS.length) {
      const existingSlugs = new Set(cards.map(c => c.slug))
      const missingCards = DEFAULT_CARDS.filter(c => !existingSlugs.has(c.slug))
      
      if (missingCards.length > 0) {
        await db.learningCard.createMany({
          data: missingCards
        })
        
        cards = await db.learningCard.findMany({
          select: {
            id: true, slug: true, title: true, category: true, phase: true, xpReward: true,
            steps: true, commonMistakes: true, instructorTips: true, safetyWarnings: true,
            quizQuestion: true, quizOptions: true, quizAnswer: true, orderIndex: true
          },
          orderBy: { orderIndex: 'asc' }
        })
      }
    }

    return NextResponse.json(cards, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Learning cards API Error:', message)
    return NextResponse.json({ error: 'Failed to load learning cards' }, { status: 500 })
  }
}
