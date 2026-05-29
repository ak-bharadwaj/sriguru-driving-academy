export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

;

export async function GET(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || 'srigurusecretkey1234567890' 
  });

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = token.id as string;

  const stream = new ReadableStream({
    async start(controller) {
      let lastChecked = new Date();

      const pushNewNotifications = async () => {
        try {
          const newNotifs = await db.notification.findMany({
            where: {
              userId,
              createdAt: { gt: lastChecked }
            },
            orderBy: { createdAt: 'desc' }
          });

          if (newNotifs.length > 0) {
            lastChecked = new Date();
            const data = JSON.stringify(newNotifs);
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
        } catch (error) {
          console.error("SSE Error:", error);
        }
      };

      // Poll every 10 seconds in the background for this stream
      const interval = setInterval(pushNewNotifications, 10000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
