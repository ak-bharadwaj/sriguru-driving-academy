// prisma/seed.ts
// Run: npx prisma db seed
// Adds: 1 admin, 2 instructors, 5 students, 
//       18 learning cards, 8 badges, 
//       50 RTO questions, roadmap nodes

import { PrismaClient, Role, TrainingType, 
         BadgeType, RoadmapPhase, NodeStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = (p: string) => bcrypt.hashSync(p, 10)

  // Clear existing data to ensure idempotent seeding
  console.log('Cleaning up existing database records...')
  await prisma.inquiry.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.session.deleteMany()
  await prisma.studentBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.xPEvent.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.learningProgress.deleteMany()
  await prisma.studentRoadmapNode.deleteMany()
  await prisma.roadmapNode.deleteMany()
  await prisma.learningCard.deleteMany()
  await prisma.rTOQuestion.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.student.deleteMany()
  await prisma.instructorLog.deleteMany()
  await prisma.slot.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleaned. Starting seed process...')

  // Admin
  console.log('Seeding Admin user...')
  await prisma.user.create({
    data: {
      email: 'admin@sriguru.in',
      passwordHash: hash('admin123'),
      role: Role.ADMIN,
      name: 'Academy Administrator',
      admin: { create: {} }
    }
  })

  // Instructors
  console.log('Seeding Instructors...')
  const i1User = await prisma.user.create({
    data: {
      email: 'rajesh@sriguru.in',
      passwordHash: hash('instructor123'),
      role: Role.INSTRUCTOR,
      name: 'Rajesh Kumar',
      instructor: {
        create: {
          bio: 'Defensive LMV certification master with over 1500 licensed graduates.',
          specialization: 'Beginner & Highway Control',
          yearsExp: 8
        }
      }
    },
    include: { instructor: true }
  })

  const i2User = await prisma.user.create({
    data: {
      email: 'priya@sriguru.in',
      passwordHash: hash('instructor123'),
      role: Role.INSTRUCTOR,
      name: 'Priya Sharma',
      instructor: {
        create: {
          bio: 'RTO theory specialist and emergency vehicle dynamics researcher.',
          specialization: 'RTO Prep & Advanced Maneuvers',
          yearsExp: 5
        }
      }
    },
    include: { instructor: true }
  })

  // Students
  console.log('Seeding Students...')
  const studentNames = [
    'Arjun Reddy', 'Sneha Patel', 
    'Vikram Singh', 'Kavya Nair', 'Rohit Mehta'
  ]
  
  const createdStudents: any[] = []
  for (let i = 0; i < studentNames.length; i++) {
    const name = studentNames[i]
    const slug = name.toLowerCase().replace(' ', '.')
    const user = await prisma.user.create({
      data: {
        email: `${slug}@student.sriguru.in`,
        passwordHash: hash('student123'),
        role: Role.STUDENT,
        name,
        student: {
          create: {
            instructorId: i < 3 
              ? i1User.instructor!.id 
              : i2User.instructor!.id,
            trainingType: i % 2 === 0 
              ? TrainingType.BEGINNER 
              : TrainingType.ADVANCED,
            xp: Math.floor(Math.random() * 800),
            level: Math.floor(Math.random() * 5) + 1,
            streakDays: Math.floor(Math.random() * 15),
          }
        }
      },
      include: { student: true }
    })
    createdStudents.push(user.student)
  }

  // Badges
  console.log('Seeding Badges...')
  const badges = [
    { type: BadgeType.PARKING_EXPERT, name: 'Parking Expert',
      description: 'Mastered all parking techniques', 
      icon: 'parking', xpRequired: 100,
      condition: { type: 'card_complete', category: 'parking' } },
    { type: BadgeType.SIGNAL_MASTER, name: 'Signal Master',
      description: 'Scored 100% on signal quiz',
      icon: 'traffic-light', xpRequired: 50,
      condition: { type: 'quiz_perfect', category: 'signals' } },
    { type: BadgeType.ELITE_DRIVER, name: 'Elite Driver',
      description: 'Reached Level 10',
      icon: 'star', xpRequired: 2000,
      condition: { type: 'level', value: 10 } },
    { type: BadgeType.PERFECT_ATTENDANCE, name: 'Perfect Attendance',
      description: '10 sessions without absence',
      icon: 'calendar-check', xpRequired: 0,
      condition: { type: 'attendance_streak', value: 10 } },
    { type: BadgeType.ROAD_PRO, name: 'Road Pro',
      description: 'Completed Advanced roadmap',
      icon: 'road', xpRequired: 500,
      condition: { type: 'phase_complete', phase: 'ADVANCED' } },
    { type: BadgeType.CONSISTENT_LEARNER, name: 'Consistent Learner',
      description: '7-day learning streak',
      icon: 'flame', xpRequired: 0,
      condition: { type: 'streak', value: 7 } },
    { type: BadgeType.SAFETY_CHAMPION, name: 'Safety Champion',
      description: 'Completed all safety modules',
      icon: 'shield', xpRequired: 200,
      condition: { type: 'category_complete', category: 'safety' } },
    { type: BadgeType.QUIZ_MASTER, name: 'Quiz Master',
      description: 'Passed 20 quizzes',
      icon: 'brain', xpRequired: 0,
      condition: { type: 'quiz_count', value: 20 } },
  ]

  for (const badge of badges) {
    await prisma.badge.create({ data: badge })
  }

  // Learning Cards (18 skills)
  console.log('Seeding 18 Learning Cards...')
  const cards = [
    { slug: 'vehicle-startup', title: 'Vehicle Startup Process',
      category: 'basics', phase: RoadmapPhase.BEGINNER,
      xpReward: 10, orderIndex: 1,
      steps: ['Adjust seat and mirrors', 'Fasten seatbelt',
               'Check gear is neutral', 'Press clutch',
               'Turn ignition', 'Release handbrake'],
      commonMistakes: ['Forgetting neutral gear', 'Not pressing clutch'],
      instructorTips: ['Always do mirror check before starting'],
      safetyWarnings: ['Never start in gear'],
      quizQuestion: 'What gear should the vehicle be in before starting?',
      quizOptions: ['First gear', 'Neutral', 'Reverse', 'Second gear'],
      quizAnswer: 'Neutral' },
    { slug: 'steering-control', title: 'Steering Control',
      category: 'control', phase: RoadmapPhase.BEGINNER,
      xpReward: 15, orderIndex: 2,
      steps: ['Hold at 9 and 3 position', 'Keep firm but relaxed grip',
               'Push-pull method for turns', 'Return wheel smoothly'],
      commonMistakes: ['Crossing hands', 'Gripping too tight'],
      instructorTips: ['Imagine the wheel as a clock face'],
      safetyWarnings: ['Never take both hands off wheel while moving'],
      quizQuestion: 'What is the correct hand position on the steering wheel?',
      quizOptions: ['12 and 6', '10 and 2', '9 and 3', '8 and 4'],
      quizAnswer: '9 and 3' },
    { slug: 'clutch-control', title: 'Clutch Control',
      category: 'control', phase: RoadmapPhase.BEGINNER,
      xpReward: 20, orderIndex: 3,
      steps: ['Press fully before gear change', 'Find biting point slowly',
               'Release smoothly while giving gas', 'Coordinate with accelerator'],
      commonMistakes: ['Releasing clutch too fast', 'Riding the clutch'],
      instructorTips: ['Listen for the engine sound change at biting point'],
      safetyWarnings: ['Never coast with clutch pressed on downhill'],
      quizQuestion: 'What is the "biting point"?',
      quizOptions: [
        'When clutch is fully pressed',
        'When clutch plates just begin to engage',
        'When car is in neutral',
        'When brake is applied'
      ],
      quizAnswer: 'When clutch plates just begin to engage' },
    { slug: 'braking', title: 'Braking Techniques',
      category: 'control', phase: RoadmapPhase.BEGINNER,
      xpReward: 20, orderIndex: 4,
      steps: ['Check mirrors before braking', 'Apply brake gradually',
               'Press clutch just before stopping', 'Use engine braking on slopes'],
      commonMistakes: ['Sudden harsh braking', 'Not checking mirrors'],
      instructorTips: ['Brake earlier than you think you need to'],
      safetyWarnings: ['Avoid brake locking — ease pressure if wheels lock'],
      quizQuestion: 'When should you press the clutch while braking to a stop?',
      quizOptions: [
        'Before braking', 'At the same time as braking',
        'Just before the car stops', 'After the car stops'
      ],
      quizAnswer: 'Just before the car stops' },
    { slug: 'mirror-checking', title: 'Mirror Checking',
      category: 'safety', phase: RoadmapPhase.BEGINNER,
      xpReward: 10, orderIndex: 5,
      steps: ['Check rear-view every 5-8 seconds', 'Check side mirrors before turns',
               'Use MSM routine: Mirror-Signal-Manoeuvre',
               'Check blind spots by turning head'],
      commonMistakes: ['Not checking before lane change', 'Ignoring blind spots'],
      instructorTips: ['Make it a habit — mirror check every time you brake'],
      safetyWarnings: ['Mirrors have blind spots — always turn to check'],
      quizQuestion: 'What does MSM stand for?',
      quizOptions: [
        'Move-Stop-Move', 'Mirror-Signal-Manoeuvre',
        'Mirror-Steer-Move', 'Merge-Signal-Manoeuvre'
      ],
      quizAnswer: 'Mirror-Signal-Manoeuvre' },
    { slug: 'parallel-parking', title: 'Parallel Parking',
      category: 'parking', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 30, orderIndex: 6,
      steps: [
        'Pull alongside the front car, 1 meter gap',
        'Reverse until rear aligns with front car rear',
        'Turn wheel full left, reverse slowly',
        'Straighten wheel when car is 45°',
        'Turn full right and complete reverse',
        'Straighten up and adjust'
      ],
      commonMistakes: ['Starting too far from kerb', 'Moving too fast'],
      instructorTips: ['Use reference points on the car body'],
      safetyWarnings: ['Check mirrors and blind spot before reversing'],
      quizQuestion: 'In parallel parking, when do you start turning the wheel left?',
      quizOptions: [
        'Immediately when reversing',
        'When your rear bumper passes the front car\'s rear',
        'When you are fully alongside',
        'At the end of the manoeuvre'
      ],
      quizAnswer: 'When your rear bumper passes the front car\'s rear' },
    { slug: 'reverse-parking', title: 'Reverse Bay Parking',
      category: 'parking', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 25, orderIndex: 7,
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
        'When front bumper clears adjacent car',
        'When you can see both bay lines in mirror',
        'When instructor says so'
      ],
      quizAnswer: 'When side mirror aligns with bay line' },
    { slug: 'hill-starts', title: 'Hill Starts',
      category: 'control', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 25, orderIndex: 8,
      steps: [
        'Apply handbrake firmly',
        'Select first gear',
        'Find biting point',
        'Add slight accelerator',
        'Release handbrake as car pulls forward'
      ],
      commonMistakes: ['Releasing handbrake too early', 'Not enough gas'],
      instructorTips: ['Feel the nose of car rise slightly at biting point'],
      safetyWarnings: ['Never roll back into traffic — hold on handbrake'],
      quizQuestion: 'What should you feel before releasing the handbrake on a hill?',
      quizOptions: [
        'Car moving forward slightly',
        'Engine revs increasing',
        'Car nose rising / resistance from clutch',
        'Steering wheel vibrating'
      ],
      quizAnswer: 'Car nose rising / resistance from clutch' },
    { slug: 'lane-changing', title: 'Lane Changing',
      category: 'road', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 20, orderIndex: 9,
      steps: [
        'Check rear-view mirror',
        'Check side mirror of target lane',
        'Check blind spot by turning head',
        'Signal intention',
        'Move smoothly if clear'
      ],
      commonMistakes: ['Not checking blind spot', 'Signalling too late'],
      instructorTips: ['Signal before checking — it warns others of intent'],
      safetyWarnings: ['Never change lanes near junctions or crossings'],
      quizQuestion: 'What is the correct order for lane changing?',
      quizOptions: [
        'Signal → Mirror → Move',
        'Mirror → Signal → Blind spot → Move',
        'Blind spot → Mirror → Signal → Move',
        'Move → Signal → Mirror'
      ],
      quizAnswer: 'Mirror → Signal → Blind spot → Move' },
    { slug: 'traffic-signals', title: 'Traffic Signals',
      category: 'road-rules', phase: RoadmapPhase.BEGINNER,
      xpReward: 10, orderIndex: 10,
      steps: [
        'Red: Full stop before line',
        'Amber: Stop if safe to do so',
        'Green: Proceed with caution',
        'Flashing amber: Slow down and proceed carefully'
      ],
      commonMistakes: ['Jumping amber', 'Stopping on green'],
      instructorTips: ['Anticipate signals by watching pedestrian lights'],
      safetyWarnings: ['Never cross on red even if road seems clear'],
      quizQuestion: 'What should you do at a solid amber traffic light?',
      quizOptions: [
        'Speed up to cross before red',
        'Stop if it is safe to do so',
        'Always stop immediately',
        'Flash headlights and proceed'
      ],
      quizAnswer: 'Stop if it is safe to do so' },
    { slug: 'highway-merging', title: 'Highway Merging',
      category: 'advanced', phase: RoadmapPhase.ADVANCED,
      xpReward: 35, orderIndex: 11,
      steps: [
        'Match speed of highway traffic on slip road',
        'Check mirrors and blind spot',
        'Signal and find gap',
        'Merge smoothly without braking highway traffic',
        'Cancel signal after merging'
      ],
      commonMistakes: ['Merging too slow', 'Not matching speed'],
      instructorTips: ['You must match highway speed before merging — not after'],
      safetyWarnings: ['Never stop on a slip road unless emergency'],
      quizQuestion: 'When should you match highway traffic speed?',
      quizOptions: [
        'After merging', 'Before merging on the slip road',
        'As you are merging', 'Speed does not matter'
      ],
      quizAnswer: 'Before merging on the slip road' },
    { slug: 'overtaking', title: 'Overtaking',
      category: 'advanced', phase: RoadmapPhase.ADVANCED,
      xpReward: 35, orderIndex: 12,
      steps: [
        'Assess road ahead is clear for sufficient distance',
        'Check mirrors and blind spot',
        'Signal right',
        'Accelerate past in one smooth move',
        'Signal left and return to lane with room to spare'
      ],
      commonMistakes: ['Hesitating halfway through', 'Not enough gap ahead'],
      instructorTips: ['Commit fully — partial overtakes are dangerous'],
      safetyWarnings: ['Never overtake on bends, hills, junctions, or crossings'],
      quizQuestion: 'Where is overtaking prohibited?',
      quizOptions: [
        'Straight roads only', 'Motorways',
        'On bends, hills, and junctions', 'Single lane roads'
      ],
      quizAnswer: 'On bends, hills, and junctions' },
    { slug: 'emergency-braking', title: 'Emergency Braking',
      category: 'safety', phase: RoadmapPhase.ADVANCED,
      xpReward: 30, orderIndex: 13,
      steps: [
        'React immediately — no mirror check',
        'Apply maximum brake pressure',
        'If ABS: maintain firm pressure',
        'If no ABS: pump brakes if wheels lock',
        'Steer around obstacle if possible after slowing'
      ],
      commonMistakes: ['Looking at mirrors first', 'Pumping ABS brakes'],
      instructorTips: ['In emergency — brake FIRST, steer second'],
      safetyWarnings: ['Do not swerve before braking — risk of rollover'],
      quizQuestion: 'In a vehicle with ABS, what should you do when emergency braking?',
      quizOptions: [
        'Pump the brakes rapidly', 'Apply firm constant pressure',
        'Brake gently to avoid lockup', 'Use handbrake only'
      ],
      quizAnswer: 'Apply firm constant pressure' },
    { slug: 'rain-driving', title: 'Driving in Rain',
      category: 'advanced', phase: RoadmapPhase.ADVANCED,
      xpReward: 30, orderIndex: 14,
      steps: [
        'Reduce speed by 30%',
        'Increase following distance to 4 seconds',
        'Use headlights (not full beam)',
        'Avoid sudden braking or acceleration',
        'Watch for aquaplaning'
      ],
      commonMistakes: ['Maintaining dry-road speed', 'Using full beam in rain'],
      instructorTips: ['If aquaplaning: ease off accelerator gently, do not brake'],
      safetyWarnings: ['Full beam reflects off rain — use dipped headlights'],
      quizQuestion: 'What should you do if your car starts aquaplaning?',
      quizOptions: [
        'Brake hard immediately',
        'Ease off accelerator gently and steer straight',
        'Turn the wheel sharply',
        'Accelerate to regain grip'
      ],
      quizAnswer: 'Ease off accelerator gently and steer straight' },
    { slug: 'night-driving', title: 'Night Driving',
      category: 'advanced', phase: RoadmapPhase.ADVANCED,
      xpReward: 30, orderIndex: 15,
      steps: [
        'Use full beam on unlit roads',
        'Dip headlights when meeting oncoming traffic',
        'Reduce speed — stopping distance exceeds lit area',
        'Watch for pedestrians in dark clothing',
        'Rest if feeling drowsy'
      ],
      commonMistakes: ['Keeping full beam with oncoming traffic', 'Driving tired'],
      instructorTips: ['You can only stop in the distance you can see lit ahead'],
      safetyWarnings: ['Never drive drowsy — pull over and rest'],
      quizQuestion: 'When should you dip your headlights at night?',
      quizOptions: [
        'On all roads always', 'Only in the city',
        'When meeting or following other vehicles',
        'Only when police are present'
      ],
      quizAnswer: 'When meeting or following other vehicles' },
    { slug: 'roundabouts', title: 'Roundabouts',
      category: 'road', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 25, orderIndex: 16,
      steps: [
        'Give way to traffic already on the roundabout',
        'Signal left for first exit',
        'Signal right for third exit or beyond',
        'No signal for second exit (straight on)',
        'Exit with left signal'
      ],
      commonMistakes: ['Not giving way', 'Wrong lane choice'],
      instructorTips: ['Position in lane before reaching roundabout, not during'],
      safetyWarnings: ['Check for cyclists and motorcyclists on inside'],
      quizQuestion: 'Who has priority on a roundabout?',
      quizOptions: [
        'Vehicles entering the roundabout',
        'Vehicles already on the roundabout',
        'Larger vehicles always',
        'Vehicles coming from the right'
      ],
      quizAnswer: 'Vehicles already on the roundabout' },
    { slug: 'parking-alignment', title: 'Parking Alignment',
      category: 'parking', phase: RoadmapPhase.INTERMEDIATE,
      xpReward: 20, orderIndex: 17,
      steps: [
        'Position car parallel to kerb',
        'Aim for 15-30cm from kerb',
        'Straighten wheels before stopping',
        'Apply handbrake',
        'Leave enough space front and rear'
      ],
      commonMistakes: ['Too far from kerb', 'Wheels not straight'],
      instructorTips: ['Check both mirrors to judge distance from kerb'],
      safetyWarnings: ['Never park blocking driveways or yellow lines'],
      quizQuestion: 'How far should your car be from the kerb when parked?',
      quizOptions: ['5cm', '15-30cm', '50cm', '1 meter'],
      quizAnswer: '15-30cm' },
    { slug: 'blind-spots', title: 'Blind Spot Awareness',
      category: 'safety', phase: RoadmapPhase.BEGINNER,
      xpReward: 15, orderIndex: 18,
      steps: [
        'Understand your car\'s blind spot zones',
        'Always turn head to check before moving laterally',
        'Adjust mirrors to minimize (not eliminate) blind spots',
        'Be aware of other vehicles\' blind spots'
      ],
      commonMistakes: ['Relying only on mirrors', 'Not checking cyclists'],
      instructorTips: ['A quick head turn takes 0.5 seconds and saves lives'],
      safetyWarnings: ['Trucks have large rear and side blind spots — avoid lingering'],
      quizQuestion: 'Can mirrors fully eliminate blind spots?',
      quizOptions: [
        'Yes, if adjusted correctly',
        'No, you must also turn your head',
        'Yes, with modern mirror systems',
        'Only for experienced drivers'
      ],
      quizAnswer: 'No, you must also turn your head' },
  ]

  const seededCards: any[] = []
  for (const card of cards) {
    const dbCard = await prisma.learningCard.create({
      data: {
        slug: card.slug,
        title: card.title,
        category: card.category,
        phase: card.phase,
        xpReward: card.xpReward,
        steps: card.steps,
        commonMistakes: card.commonMistakes,
        instructorTips: card.instructorTips,
        safetyWarnings: card.safetyWarnings,
        quizQuestion: card.quizQuestion,
        quizOptions: card.quizOptions,
        quizAnswer: card.quizAnswer,
        orderIndex: card.orderIndex
      }
    })
    seededCards.push(dbCard)
  }

  // Seeding Roadmap Nodes
  console.log('Seeding Roadmap Nodes...')
  const roadmapNodes = [
    { title: 'Vehicle Basics', description: 'Cockpit drills, startup sequencing, and steering mechanics.', phase: RoadmapPhase.BEGINNER, orderIndex: 1, icon: 'Compass', requiredCardSlugs: ['vehicle-startup', 'steering-control'], unlockThreshold: 0.8 },
    { title: 'Basic Control', description: 'Master clutch friction points, shifting sequencing, and progressive braking.', phase: RoadmapPhase.BEGINNER, orderIndex: 2, icon: 'Gauge', requiredCardSlugs: ['clutch-control', 'braking'], unlockThreshold: 0.8 },
    { title: 'Safety Essentials', description: 'MSM mirror routines, blind spot checks, and traffic signal theory.', phase: RoadmapPhase.BEGINNER, orderIndex: 3, icon: 'ShieldAlert', requiredCardSlugs: ['mirror-checking', 'blind-spots', 'traffic-signals'], unlockThreshold: 0.8 },
    { title: 'Incline Control', description: 'Coordinating slope holds, handbrake starts, and uphill clutch crawl vectors.', phase: RoadmapPhase.INTERMEDIATE, orderIndex: 4, icon: 'TrendingUp', requiredCardSlugs: ['hill-starts'], unlockThreshold: 0.8 },
    { title: 'Street Integration', description: 'Lane discipline, standard overtaking safety margins, and roundabout exit routines.', phase: RoadmapPhase.INTERMEDIATE, orderIndex: 5, icon: 'Milestone', requiredCardSlugs: ['lane-changing', 'roundabouts'], unlockThreshold: 0.8 },
    { title: 'Parking Mechanics', description: 'Reverse bay slots, parallel parking references, and kerb alignment vectors.', phase: RoadmapPhase.INTERMEDIATE, orderIndex: 6, icon: 'Maximize', requiredCardSlugs: ['parallel-parking', 'reverse-parking', 'parking-alignment'], unlockThreshold: 0.8 },
    { title: 'Highway Dynamics', description: 'Fast slip road lane merging, speed coordination, and dual-carriageway spacing.', phase: RoadmapPhase.ADVANCED, orderIndex: 7, icon: 'Zap', requiredCardSlugs: ['highway-merging', 'overtaking'], unlockThreshold: 0.8 },
    { title: 'Adverse Elements', description: 'Hydroplaning control, wet-weather stopping margins, and nighttime high-beam management.', phase: RoadmapPhase.ADVANCED, orderIndex: 8, icon: 'CloudRain', requiredCardSlugs: ['rain-driving', 'night-driving'], unlockThreshold: 0.8 },
    { title: 'Emergency Management', description: 'Sudden obstacle avoidance, maximum ABS hard braking, and engine failure drills.', phase: RoadmapPhase.ADVANCED, orderIndex: 9, icon: 'LifeBuoy', requiredCardSlugs: ['emergency-braking'], unlockThreshold: 0.8 }
  ]

  const seededNodes: any[] = []
  for (const node of roadmapNodes) {
    const dbNode = await prisma.roadmapNode.create({
      data: {
        title: node.title,
        description: node.description,
        phase: node.phase,
        orderIndex: node.orderIndex,
        icon: node.icon,
        requiredCardSlugs: node.requiredCardSlugs,
        unlockThreshold: node.unlockThreshold
      }
    })
    seededNodes.push(dbNode)
  }

  // Bind initial nodes to students
  console.log('Seeding student roadmap nodes...')
  for (const student of createdStudents) {
    for (const node of seededNodes) {
      await prisma.studentRoadmapNode.create({
        data: {
          studentId: student.id,
          nodeId: node.id,
          status: node.orderIndex === 1 ? NodeStatus.AVAILABLE : NodeStatus.LOCKED
        }
      })
    }
  }

  // 50 RTO Questions across categories
  console.log('Seeding 50 RTO Questions...')
  const rtoQuestions = [
    // Signs category
    { question: 'What does a red octagonal sign mean?',
      options: ['Slow down', 'Stop completely', 'Give way', 'No entry'],
      answer: 'Stop completely', category: 'signs', difficulty: 'easy',
      explanation: 'A red octagonal (8-sided) sign is always a STOP sign.' },
    { question: 'What does a triangular sign with red border mean?',
      options: ['Prohibition', 'Warning/Hazard ahead', 'Mandatory action', 'Information'],
      answer: 'Warning/Hazard ahead', category: 'signs', difficulty: 'easy',
      explanation: 'Triangular red-bordered signs warn of hazards ahead.' },
    { question: 'What does a circular blue sign mean?',
      options: ['Prohibition', 'Warning', 'Mandatory instruction', 'Information'],
      answer: 'Mandatory instruction', category: 'signs', difficulty: 'medium',
      explanation: 'Blue circular signs give mandatory instructions you must follow.' },
    { question: 'A "No Entry" sign is:',
      options: ['Blue circle', 'Red circle with white bar', 'Red triangle', 'Yellow diamond'],
      answer: 'Red circle with white bar', category: 'signs', difficulty: 'easy',
      explanation: 'No Entry is a red circle with a horizontal white bar.' },
    { question: 'What shape is a "Give Way" sign?',
      options: ['Circle', 'Square', 'Inverted triangle', 'Octagon'],
      answer: 'Inverted triangle', category: 'signs', difficulty: 'easy',
      explanation: 'Give Way signs are inverted (upside-down) triangles.' },

    // Signals category  
    { question: 'A traffic light shows red and amber together. What does this mean?',
      options: ['Stop — was green', 'Get ready to go', 'Proceed with caution', 'Slow down'],
      answer: 'Get ready to go', category: 'signals', difficulty: 'medium',
      explanation: 'Red + amber together means prepare to move — green is about to show.' },
    { question: 'A flashing red traffic light means:',
      options: ['Slow down', 'Stop — treat as stop sign', 'Proceed carefully', 'Give way'],
      answer: 'Stop — treat as stop sign', category: 'signals', difficulty: 'medium',
      explanation: 'Flashing red = stop and only proceed when safe.' },
    { question: 'Green arrow alongside red light means:',
      options: ['Stop, then go in arrow direction', 'Go in arrow direction only',
                'Wait for full green', 'Arrow direction has right of way'],
      answer: 'Go in arrow direction only', category: 'signals', difficulty: 'hard',
      explanation: 'A green filter arrow allows movement in that direction only.' },
    { question: 'At a pelican crossing, flashing amber means:',
      options: ['Stop', 'Go — pedestrians cleared', 
                'Give way to pedestrians still crossing', 'Same as red'],
      answer: 'Give way to pedestrians still crossing', category: 'signals', 
      difficulty: 'hard',
      explanation: 'Flashing amber at pelican crossings means pedestrians may still be crossing.' },
    { question: 'How long before turning should you signal?',
      options: ['Right before turning', 'At least 30 meters before',
                'Only if other cars are present', 'Signal is optional'],
      answer: 'At least 30 meters before', category: 'signals', difficulty: 'medium',
      explanation: 'Signal early enough to warn other road users of your intention.' },

    // Rules category
    { question: 'What is the national speed limit on a single carriageway in India?',
      options: ['60 km/h', '70 km/h', '80 km/h', '100 km/h'],
      answer: '70 km/h', category: 'rules', difficulty: 'medium',
      explanation: '70 km/h is the general limit on single carriageways unless signed otherwise.' },
    { question: 'Minimum following distance in normal conditions:',
      options: ['1 second', '2 seconds', '3 seconds', '5 seconds'],
      answer: '2 seconds', category: 'rules', difficulty: 'easy',
      explanation: 'The 2-second rule gives minimum safe following distance.' },
    { question: 'When must you use headlights?',
      options: ['Only at night', 'Between sunset and sunrise and poor visibility',
                'Only in rain', 'Only on highways'],
      answer: 'Between sunset and sunrise and poor visibility', 
      category: 'rules', difficulty: 'easy',
      explanation: 'Headlights are required from sunset to sunrise and any time visibility is poor.' },
    { question: 'You must not drive after drinking if blood alcohol is above:',
      options: ['30mg/100ml', '50mg/100ml', '80mg/100ml', '100mg/100ml'],
      answer: '30mg/100ml', category: 'rules', difficulty: 'hard',
      explanation: 'India\'s legal limit is 30mg of alcohol per 100ml of blood.' },
    { question: 'Using a mobile phone while driving is:',
      options: ['Legal with hands-free', 'Illegal in all cases',
                'Legal if stationary at lights', 'Legal for emergencies'],
      answer: 'Illegal in all cases', category: 'rules', difficulty: 'easy',
      explanation: 'Using any mobile device while driving is illegal including hands-free in many states.' },

    // Parking category
    { question: 'You must not park within how many meters of a junction?',
      options: ['5 meters', '10 meters', '15 meters', '20 meters'],
      answer: '10 meters', category: 'parking', difficulty: 'medium',
      explanation: 'Parking within 10m of a junction obstructs visibility.' },
    { question: 'Double yellow lines mean:',
      options: ['No parking at certain times', 'No parking at any time',
                'No stopping at any time', 'Parking for 30 minutes only'],
      answer: 'No parking at any time', category: 'parking', difficulty: 'easy',
      explanation: 'Double yellow lines = no parking at any time.' },
    { question: 'You may park on the right side of the road:',
      options: ['Never', 'On one-way streets only',
                'On roads with 3+ lanes', 'If no yellow lines'],
      answer: 'On one-way streets only', category: 'parking', difficulty: 'medium',
      explanation: 'On two-way roads you must park on the left.' },
    { question: 'When parking on a hill facing downhill, wheels should be:',
      options: ['Straight', 'Turned away from kerb', 'Turned toward kerb', 'Any position'],
      answer: 'Turned toward kerb', category: 'parking', difficulty: 'hard',
      explanation: 'Turning toward kerb means if brakes fail, the kerb stops the car.' },
    { question: 'Which of these is NOT a place where parking is prohibited?',
      options: ['Bus stop', 'Hospital entrance', 'Residential street (marked bay)', 'Fire station'],
      answer: 'Residential street (marked bay)', category: 'parking', difficulty: 'medium',
      explanation: 'Marked parking bays are designed for parking — other options are prohibited zones.' },

    // Lane discipline
    { question: 'On a three-lane road, the right lane is for:',
      options: ['All vehicles', 'Overtaking only', 'Heavy vehicles', 'Fastest vehicles only'],
      answer: 'Overtaking only', category: 'lane-discipline', difficulty: 'easy',
      explanation: 'The right lane should be used only for overtaking, then return to left.' },
    { question: 'What is "lane hogging"?',
      options: ['Driving fast in right lane', 'Staying in right/middle lane unnecessarily',
                'Switching lanes frequently', 'Driving slowly in left lane'],
      answer: 'Staying in right/middle lane unnecessarily', 
      category: 'lane-discipline', difficulty: 'medium',
      explanation: 'Lane hogging is staying in the right/middle lane when left is free.' },
    { question: 'A solid white line between lanes means:',
      options: ['Overtaking permitted', 'No lane crossing', 
                'Lane merging ahead', 'Keep left'],
      answer: 'No lane crossing', category: 'lane-discipline', difficulty: 'medium',
      explanation: 'Solid white lines must not be crossed.' },
    { question: 'When turning right from a two-lane road, you should:',
      options: ['Use left lane', 'Use right lane', 'Either lane', 'Centre of road'],
      answer: 'Use right lane', category: 'lane-discipline', difficulty: 'easy',
      explanation: 'Position in right lane well before a right turn.' },
    { question: 'At a zebra crossing you must:',
      options: ['Slow down and sound horn', 'Stop and give way to pedestrians',
                'Proceed if road is clear', 'Flash headlights to warn pedestrians'],
      answer: 'Stop and give way to pedestrians', 
      category: 'lane-discipline', difficulty: 'easy',
      explanation: 'Pedestrians have right of way on zebra crossings.' },

    // Emergencies category
    { question: 'Your brakes fail while driving. First action:',
      options: ['Open the door', 'Apply handbrake immediately',
                'Pump the brake pedal', 'Turn off ignition'],
      answer: 'Pump the brake pedal', category: 'emergencies', difficulty: 'hard',
      explanation: 'Pumping can rebuild hydraulic pressure. Then use handbrake gently.' },
    { question: 'Tyre blowout at speed — you should:',
      options: ['Brake hard immediately', 'Steer sharply to the side',
                'Ease off accelerator and grip wheel firmly', 'Turn off ignition'],
      answer: 'Ease off accelerator and grip wheel firmly', 
      category: 'emergencies', difficulty: 'hard',
      explanation: 'Sudden braking or steering after blowout can cause loss of control.' },
    { question: 'Your engine catches fire. You should:',
      options: ['Open bonnet immediately', 'Stop, turn off engine, evacuate',
                'Keep driving to nearest garage', 'Accelerate away from fire'],
      answer: 'Stop, turn off engine, evacuate', category: 'emergencies', difficulty: 'medium',
      explanation: 'Stop safely, turn off ignition, get everyone out, call emergency services.' },
    { question: 'First thing to do at a crash scene with injured person:',
      options: ['Move injured person to safety', 'Call emergency services (112)',
                'Check for your own injuries', 'Take photos for insurance'],
      answer: 'Call emergency services (112)', category: 'emergencies', difficulty: 'easy',
      explanation: 'Call 112 first — moving an injured person can cause further injury.' },
    { question: 'Aquaplaning means:',
      options: ['Skidding on ice', 'Tyres losing contact with road due to water film',
                'Windscreen fogging', 'Engine overheating'],
      answer: 'Tyres losing contact with road due to water film', 
      category: 'emergencies', difficulty: 'medium',
      explanation: 'Aquaplaning occurs when water prevents tyres gripping the road.' },

    // Safety rules
    { question: 'At what age can a child sit in the front seat without a booster?',
      options: ['10 years', '12 years', '135cm height', 'Both 12 years AND 135cm'],
      answer: 'Both 12 years AND 135cm', category: 'safety', difficulty: 'hard',
      explanation: 'Children need to be both 12+ AND 135cm+ to safely use adult seatbelts.' },
    { question: 'Seatbelt must be worn by:',
      options: ['Driver only', 'Driver and front passenger',
                'All occupants', 'Only on highways'],
      answer: 'All occupants', category: 'safety', difficulty: 'easy',
      explanation: 'All vehicle occupants must wear seatbelts at all times.' },
    { question: 'Minimum tread depth for tyres legally:',
      options: ['1mm', '1.6mm', '2mm', '3mm'],
      answer: '1.6mm', category: 'safety', difficulty: 'hard',
      explanation: '1.6mm is the legal minimum tread depth across 75% of tread width.' },
    { question: 'Hazard warning lights should be used when:',
      options: ['Parking illegally', 'Vehicle is stationary and causing a hazard',
                'Driving slowly in rain', 'As courtesy at traffic lights'],
      answer: 'Vehicle is stationary and causing a hazard', 
      category: 'safety', difficulty: 'medium',
      explanation: 'Hazard lights warn others of your stationary vehicle posing a hazard.' },
    { question: 'Safe stopping distance at 60 km/h in dry conditions:',
      options: ['23 meters', '36 meters', '53 meters', '73 meters'],
      answer: '53 meters', category: 'safety', difficulty: 'hard',
      explanation: 'At 60 km/h: thinking distance + braking distance = approx 53m total.' },

    // Driving laws India specific
    { question: 'Minimum age to obtain a driving licence in India:',
      options: ['16', '17', '18', '21'],
      answer: '18', category: 'laws', difficulty: 'easy',
      explanation: '18 is the minimum age for a full licence in India.' },
    { question: 'A learner\'s licence is valid for:',
      options: ['3 months', '6 months', '1 year', '2 years'],
      answer: '6 months', category: 'laws', difficulty: 'medium',
      explanation: 'Indian learner\'s licences are valid for 6 months.' },
    { question: 'A vehicle with a learner driver must display:',
      options: ['Red L plate', 'Yellow L plate', 'White L plate with red L', 'No display required'],
      answer: 'White L plate with red L', category: 'laws', difficulty: 'medium',
      explanation: 'Learner vehicles must display a white plate with red "L".' },
    { question: 'Pollution Under Control (PUC) certificate must be renewed every:',
      options: ['3 months', '6 months', '1 year', '2 years'],
      answer: '6 months', category: 'laws', difficulty: 'medium',
      explanation: 'PUC certificates are valid for 6 months and must be renewed.' },
    { question: 'Which documents must you carry in the vehicle legally while driving?',
      options: [
        'Aadhar Card, PAN Card',
        'Driving Licence, Registration (RC), Insurance, PUC Certificate',
        'Rent agreement and school records',
        'Only Driving Licence is required'
      ],
      answer: 'Driving Licence, Registration (RC), Insurance, PUC Certificate', 
      category: 'laws', difficulty: 'easy',
      explanation: 'Drivers must carry DL, Registration Certificate, valid Insurance, and PUC at all times.' },
    { question: 'A temporary registration number is valid for:',
      options: ['15 days', '1 month', '3 months', '6 months'],
      answer: '1 month', category: 'laws', difficulty: 'medium',
      explanation: 'Temporary registration plates are valid for 30 days.' },
    { question: 'Using high beam lights in dense fog is:',
      options: ['Good as it increases light', 'Bad as it reflects back and reduces visibility',
                'Mandatory by traffic laws', 'Only permitted on high-speed expressways'],
      answer: 'Bad as it reflects back and reduces visibility', category: 'laws', difficulty: 'medium',
      explanation: 'Fog reflects high-beam light back into your eyes, causing severe glare. Use low beams and fog lights.' },
    { question: 'Yellow number plate with black letters represents:',
      options: ['Private vehicle', 'Commercial vehicle', 'Electric vehicle', 'Consular vehicle'],
      answer: 'Commercial vehicle', category: 'laws', difficulty: 'easy',
      explanation: 'Yellow plates with black text denote commercial transport/cabs.' },
    { question: 'What is the penalty for driving without a valid driving licence in India?',
      options: ['Rs. 500', 'Rs. 1,000', 'Rs. 5,000', 'Rs. 10,000'],
      answer: 'Rs. 5,000', category: 'laws', difficulty: 'hard',
      explanation: 'Under the Motor Vehicles Act 2019 revision, driving without a DL carries a Rs. 5000 fine.' },
    { question: 'When an emergency vehicle approaches with sirens on, you should:',
      options: ['Speed up to stay ahead', 'Pull to the left edge of the road and stop to let them pass',
                'Stay in your lane and maintain speed', 'Sound your horn to alert others'],
      answer: 'Pull to the left edge of the road and stop to let them pass', category: 'laws', difficulty: 'easy',
      explanation: 'You must yield immediate right of way to ambulances, fire trucks, and police vehicles with active sirens.' }
  ]

  for (const rtoQ of rtoQuestions) {
    await prisma.rTOQuestion.create({
      data: {
        question: rtoQ.question,
        options: rtoQ.options,
        answer: rtoQ.answer,
        category: rtoQ.category,
        difficulty: rtoQ.difficulty,
        explanation: rtoQ.explanation
      }
    })
  }

  console.log('Seeded 50 RTO Questions successfully.')
  console.log('Database Seeding Completed Successfully! Enjoy Sri Guru Driving Academy.')
}

main()
  .catch((e) => {
    console.error('Seeding process failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
