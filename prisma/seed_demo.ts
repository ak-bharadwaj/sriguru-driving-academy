// prisma/seed_demo.ts
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed_demo.ts
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log("Seeding demo data to make charts and feeds look real...")

  // Fetch an instructor
  const instructor = await db.instructor.findFirst()
  if (!instructor) {
    console.log("No instructor found. Run normal seed first.")
    return
  }

  // Fetch or create a student
  let student = await db.student.findFirst({ include: { user: true } })
  if (!student) {
    console.log("No student found. Run normal seed first.")
    return
  }

  // 1. Seed Bookings
  console.log("Seeding Bookings...")
  await db.booking.createMany({
    data: [
      {
        name: 'Anita Desai',
        email: 'anita@example.com',
        phone: '9876543210',
        trainingType: 'BEGINNER',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan@example.com',
        phone: '9988776655',
        trainingType: 'RTO_FAST_TRACK',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ]
  })

  // 2. Seed Sessions & Attendance for the engagement graph
  console.log("Seeding Sessions & Attendance...")
  const days = [0, 1, 2, 3, 4, 5, 6] // last 7 days
  for (const daysAgo of days) {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(10, 0, 0, 0)

    const session = await db.session.create({
      data: {
        studentId: student.id,
        instructorId: instructor.id,
        scheduledAt: date,
        duration: 60,
        status: 'COMPLETED',
        lessonType: 'Practical Driving',
        completedAt: new Date(date.getTime() + 1000 * 60 * 60), // +1 hour
        skillsCovered: ['steering-control', 'clutch-control']
      }
    })

    await db.attendance.create({
      data: {
        sessionId: session.id,
        studentId: student.id,
        status: 'PRESENT',
        markedBy: instructor.id
      }
    })

    // 3. Seed XP events for engagement graph
    await db.xPEvent.create({
      data: {
        studentId: student.id,
        amount: 50,
        reason: 'Completed Session',
        createdAt: new Date(date.getTime() + 1000 * 60 * 60)
      }
    })
  }

  // 4. Seed Badges
  console.log("Seeding Student Badges...")
  const badge = await db.badge.findFirst()
  if (badge) {
    // Only create if it doesn't exist
    const existing = await db.studentBadge.findFirst({
      where: { studentId: student.id, badgeId: badge.id }
    })
    if (!existing) {
      await db.studentBadge.create({
        data: {
          studentId: student.id,
          badgeId: badge.id,
          earnedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
        }
      })
    }
  }

  // 5. Seed Driving Tests (Timeline feature)
  console.log("Seeding Driving Tests...")
  await db.drivingTest.createMany({
    data: [
      {
        studentId: student.id,
        testDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days in future
        testCenter: 'RTO East Bangalore',
        result: 'SCHEDULED',
        attemptNo: 1,
        scheduledBy: 'admin-seed'
      },
      {
        studentId: student.id,
        testDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
        testCenter: 'Mock Testing Grounds',
        result: 'PASS',
        attemptNo: 1,
        notes: 'Cleared perfectly with no deductions.',
        scheduledBy: 'admin-seed'
      }
    ]
  })

  console.log("Demo data successfully seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
