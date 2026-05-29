import { db } from '@/lib/db'
import { getCourses, getBranding } from '@/lib/data/academyStore'
import LandingClient from './LandingClient'
import type { InstructorProp } from './LandingClient'

// Fully Statically Generated at Build Time to protect Neon DB Compute Limits

export default async function PublicAcademyLandingPage() {
  // 1. Fetch courses and branding from the local JSON store
  const courses = getCourses()
  const branding = getBranding()

  // 2. Fetch instructors from the database
  let dbInstructors: any[] = []
  try {
    dbInstructors = await db.instructor.findMany({
      include: {
        user: true
      }
    })
  } catch (error) {
    console.error("Failed to fetch instructors from DB:", error)
  }

  // 3. Map to the required prop format
  const instructors: InstructorProp[] = dbInstructors.map(ins => ({
    id: ins.id,
    name: ins.user.name,
    bio: ins.bio,
    specialization: ins.specialization,
    yearsExp: ins.yearsExp
  }))

  // 4. Provide premium fallbacks if the database is completely empty 
  // so the layout never breaks for the user
  const finalInstructors = instructors.length > 0 ? instructors : [
    { id: 'fb-1', name: "Harpreet Singh", yearsExp: 8, specialization: "Manual transmission and clutch control", bio: null },
    { id: 'fb-2', name: "Vikramjit Rathore", yearsExp: 12, specialization: "Highway driving and safety skills", bio: null },
    { id: 'fb-3', name: "Gurbaksh Dhillon", yearsExp: 6, specialization: "License test track and parking", bio: null }
  ]

  // Fetch gallery images from DB, dynamically seeding missing ones
  let gallery: any[] = []
  try {
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

    gallery = await db.galleryImage.findMany({
      orderBy: { uploadedAt: 'desc' }
    })
  } catch (error) {
    console.error("Failed to fetch/seed gallery from DB:", error)
  }

  return (
    <LandingClient 
      courses={courses} 
      instructors={finalInstructors}
      branding={branding}
      gallery={gallery}
    />
  )
}
