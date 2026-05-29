const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = (p) => bcrypt.hashSync(p, 10);

  console.log('Cleaning up all existing database records...');
  
  // High-level dependent child tables first
  await prisma.sessionNote.deleteMany().catch(() => {});
  await prisma.coachingNote.deleteMany().catch(() => {});
  await prisma.studentDailyChallenge.deleteMany().catch(() => {});
  await prisma.dailyChallenge.deleteMany().catch(() => {});
  await prisma.activityLog.deleteMany().catch(() => {});
  await prisma.announcement.deleteMany().catch(() => {});
  await prisma.drivingTest.deleteMany().catch(() => {});
  await prisma.payment.deleteMany().catch(() => {});
  await prisma.inquiry.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.booking.deleteMany().catch(() => {});
  await prisma.slot.deleteMany().catch(() => {});
  await prisma.studentBadge.deleteMany().catch(() => {});
  await prisma.badge.deleteMany().catch(() => {});
  await prisma.xPEvent.deleteMany().catch(() => {});
  await prisma.quizAttempt.deleteMany().catch(() => {});
  await prisma.rTOQuestion.deleteMany().catch(() => {});
  await prisma.studentRoadmapNode.deleteMany().catch(() => {});
  await prisma.roadmapNode.deleteMany().catch(() => {});
  await prisma.learningProgress.deleteMany().catch(() => {});
  await prisma.learningCard.deleteMany().catch(() => {});
  await prisma.instructorLog.deleteMany().catch(() => {});
  await prisma.feedback.deleteMany().catch(() => {});
  await prisma.attendance.deleteMany().catch(() => {});
  await prisma.session.deleteMany().catch(() => {});
  await prisma.admin.deleteMany().catch(() => {});
  await prisma.instructor.deleteMany().catch(() => {});
  await prisma.student.deleteMany().catch(() => {});
  await prisma.vehicle.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  console.log('Database cleaned completely.');

  // Create exactly 1 Admin
  console.log('Seeding exactly 1 Admin...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@sriguru.in',
      name: 'System Administrator',
      passwordHash: hash('admin123'),
      role: 'ADMIN',
      admin: {
        create: {}
      }
    }
  });
  console.log('Admin created: admin@sriguru.in (password: admin123)');

  // Create exactly 1 Instructor
  console.log('Seeding exactly 1 Instructor...');
  const instructorUser = await prisma.user.create({
    data: {
      email: 'instructor@sriguru.in',
      name: 'Senior Coach',
      passwordHash: hash('instructor123'),
      role: 'INSTRUCTOR',
      instructor: {
        create: {
          bio: 'Specialist in defensive driving and advanced vehicle maneuvers.',
          specialization: 'Defensive Driving',
          yearsExp: 10
        }
      }
    }
  });
  console.log('Instructor created: instructor@sriguru.in (password: instructor123)');

  console.log('Cleanup and minimalist seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
