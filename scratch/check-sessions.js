import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const sessions = await prisma.session.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { scheduledAt: 'desc' }
  });
  console.log('--- ALL SESSIONS IN DB ---');
  for (const s of sessions) {
    console.log(`ID: ${s.id} | Student: ${s.student?.user?.name} (${s.student?.user?.email}) | Date: ${s.scheduledAt.toISOString()} | Status: ${s.status} | Lesson: ${s.lessonType}`);
  }
  process.exit(0);
}

run();
