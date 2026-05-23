import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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
