import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  console.log("--- Users in DB ---");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  for (const u of users) {
    console.log(`User ID: ${u.id} | Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
  }

  console.log("\n--- Students in DB ---");
  const students = await prisma.student.findMany({
    include: { user: true },
    orderBy: { enrolledAt: 'desc' },
    take: 10
  });
  for (const s of students) {
    console.log(`Student ID: ${s.id} | RegNo: ${s.regNo} | Name: ${s.user.name} | hasOnboarded: ${s.hasOnboarded}`);
  }

  console.log("\n--- Bookings in DB ---");
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  for (const b of bookings) {
    console.log(`Booking ID: ${b.id} | Name: ${b.name} | Email: ${b.email} | Status: ${b.status} | StudentId: ${b.studentId} | SlotId: ${b.slotId}`);
  }

  process.exit(0);
}
check();
