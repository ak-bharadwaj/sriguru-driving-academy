import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const images = await db.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' }
  })
  return NextResponse.json(images)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { imageKey, caption } = await req.json()
  if (!imageKey) {
    return NextResponse.json({ error: 'imageKey is required' }, { status: 400 })
  }

  const image = await db.galleryImage.create({
    data: { imageKey, caption }
  })
  return NextResponse.json(image)
}
