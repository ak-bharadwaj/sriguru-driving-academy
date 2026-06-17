import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const student = await prisma.student.findUnique({
    where: { id: 'cmqhl6kak0005g2jsrb9whwvz' },
    include: { user: true }
  });
  console.log('--- STUDENT DETAIL ---');
  console.log(`Name: ${student.user.name}`);
  console.log(`XP: ${student.xp}`);
  console.log(`Level: ${student.level}`);
  console.log(`Attendance OTP: ${student.attendanceOtp}`);
  process.exit(0);
}

run();
