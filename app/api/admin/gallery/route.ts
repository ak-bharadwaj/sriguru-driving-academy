export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const defaultImages = [
    {
      imageKey: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
      caption: 'Advanced Simulators',
    },
    {
      imageKey: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop',
      caption: 'One-on-One Coaching',
    },
    {
      imageKey: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop',
      caption: 'Late-Model Fleet',
    }
  ]

  // Ensure default images exist individually in the DB
  for (const img of defaultImages) {
    const existing = await db.galleryImage.findFirst({
      where: { imageKey: img.imageKey }
    })
    if (!existing) {
      await db.galleryImage.create({
        data: img
      })
    }
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
