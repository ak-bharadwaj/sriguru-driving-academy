// prisma/seed.ts
import { PrismaClient, Role, TrainingType, BadgeType, RoadmapPhase, NodeStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const hash = (p: string) => bcrypt.hashSync(p, 10)

  console.log('Cleaning up existing database records...')
  await prisma.inquiry.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.courseFeedback.deleteMany()
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

  // Students
  console.log('Seeding Students...')
  const studentNames = ['Arjun Reddy']
  
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
            trainingType: TrainingType.BEGINNER,
            xp: 500,
            level: 3,
            streakDays: 5,
          }
        }
      },
      include: { student: true }
    })
    createdStudents.push(user.student)
  }

  // Load JSON Data files
  const dataDir = path.join(__dirname, 'data')
  const badges = JSON.parse(fs.readFileSync(path.join(dataDir, 'badges.json'), 'utf8'))
  const cards = JSON.parse(fs.readFileSync(path.join(dataDir, 'learning-cards.json'), 'utf8'))
  const roadmapNodes = JSON.parse(fs.readFileSync(path.join(dataDir, 'roadmap-nodes.json'), 'utf8'))
  const rtoQuestions = JSON.parse(fs.readFileSync(path.join(dataDir, 'rto-questions.json'), 'utf8'))

  // Badges
  console.log('Seeding Badges from JSON...')
  await prisma.badge.createMany({ data: badges })

  // Learning Cards
  console.log('Seeding Learning Cards from JSON...')
  const cardsData = cards.map((card: any) => ({
    slug: card.slug,
    title: card.title,
    category: card.category,
    phase: card.phase as RoadmapPhase,
    xpReward: card.xpReward,
    steps: card.steps,
    commonMistakes: card.commonMistakes,
    instructorTips: card.instructorTips,
    safetyWarnings: card.safetyWarnings,
    quizQuestion: card.quizQuestion,
    quizOptions: card.quizOptions,
    quizAnswer: card.quizAnswer,
    orderIndex: card.orderIndex
  }))
  await prisma.learningCard.createMany({ data: cardsData })

  // Roadmap Nodes
  console.log('Seeding Roadmap Nodes from JSON...')
  const nodesData = roadmapNodes.map((node: any) => ({
    title: node.title,
    description: node.description,
    phase: node.phase as RoadmapPhase,
    orderIndex: node.orderIndex,
    icon: node.icon,
    requiredCardSlugs: node.requiredCardSlugs,
    unlockThreshold: node.unlockThreshold
  }))
  await prisma.roadmapNode.createMany({ data: nodesData })
  const seededNodes = await prisma.roadmapNode.findMany()

  // Bind initial nodes to students
  console.log('Seeding student roadmap nodes...')
  const studentRoadmapData = []
  for (const student of createdStudents) {
    for (const node of seededNodes) {
      studentRoadmapData.push({
        studentId: student.id,
        nodeId: node.id,
        status: node.orderIndex === 1 ? NodeStatus.AVAILABLE : NodeStatus.LOCKED
      })
    }
  }
  await prisma.studentRoadmapNode.createMany({ data: studentRoadmapData })

  // RTO Questions
  console.log('Seeding RTO Questions from JSON...')
  const rtoData = rtoQuestions.map((rtoQ: any) => {
    const answerVal = rtoQ.answer || (rtoQ.options && rtoQ.options[rtoQ.correctIndex]) || '';
    const categoryVal = rtoQ.category || rtoQ.topic || 'general';
    return {
      question: rtoQ.question,
      options: rtoQ.options,
      answer: answerVal,
      category: categoryVal,
      difficulty: rtoQ.difficulty || 'medium',
      explanation: rtoQ.explanation
    };
  });
  await prisma.rTOQuestion.createMany({ data: rtoData })

  console.log('Database Seeding Completed Successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding process failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
