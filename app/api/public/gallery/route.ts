export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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

  const [images, vehicles] = await Promise.all([
    db.galleryImage.findMany({
      orderBy: { uploadedAt: 'desc' }
    }),
    db.vehicle.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return NextResponse.json({ images, vehicles })
}
