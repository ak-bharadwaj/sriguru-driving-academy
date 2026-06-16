import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function test() {
  const userId = 'cmqgk0llb000x13t3vtglakqi';
  try {
    const student = await db.student.findUnique({
      where: { userId },
      include: {
        user: true,
        instructor: {
          include: {
            user: true
          }
        }
      }
    });

    console.log("Student found:", student ? "Yes" : "No");

    if (student) {
      const [
        nextSession,
        drivingTests,
        completedProgress,
        totalAttended,
        totalMarked,
        totalAttempts,
        correctAttempts,
        recentBadges,
        allCards,
        announcements,
        pendingBooking
      ] = await Promise.all([
        // 1. Fetch upcoming session
        db.session.findFirst({
          where: {
            studentId: student.id,
            scheduledAt: { gte: new Date() },
            status: 'SCHEDULED'
          },
          orderBy: { scheduledAt: 'asc' },
          include: {
            instructor: {
              include: { user: true }
            }
          }
        }),
        
        // 1.5. Fetch upcoming Driving Tests
        db.drivingTest.findMany({
          where: {
            studentId: student.id,
            result: 'SCHEDULED'
          },
          orderBy: { testDate: 'asc' }
        }),

        // 2. Fetch Roadmap Progress
        db.learningProgress.findMany({
          where: { studentId: student.id, completed: true },
          select: { cardId: true }
        }),

        // 3. Quick Stats
        db.attendance.count({
          where: { studentId: student.id, status: 'PRESENT' }
        }),
        db.attendance.count({
          where: { studentId: student.id }
        }),
        db.quizAttempt.count({
          where: { studentId: student.id }
        }),
        db.quizAttempt.count({
          where: { studentId: student.id, correct: true }
        }),

        // 4. Recent Badges
        db.studentBadge.findMany({
          where: { studentId: student.id },
          orderBy: { earnedAt: 'desc' },
          take: 3,
          include: { badge: true }
        }),

        // 5. Fetch Global Cached Data
        db.learningCard.findMany({ select: { id: true, phase: true } }),
        db.announcement.findMany({
          select: { id: true, title: true, message: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),

        // 6. Fetch pending trial booking
        db.booking.findFirst({
          where: {
            studentId: student.id,
            status: 'PENDING'
          },
          include: {
            slot: true
          }
        })
      ]);

      console.log("Database queries executed successfully!");
      console.log("pendingBooking:", pendingBooking);
    }
  } catch (err) {
    console.error("CRITICAL EXCEPTION:", err);
  }
  process.exit(0);
}
test();
