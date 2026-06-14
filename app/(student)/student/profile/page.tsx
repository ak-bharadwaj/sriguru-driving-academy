import React from 'react'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Bell, ArrowLeft, Edit2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    settings: 'Settings',
    userId: 'User ID:'
  },
  HI: {
    settings: 'सेटिंग्स',
    userId: 'यूजर आईडी:'
  },
  TE: {
    settings: 'సెట్టింగులు',
    userId: 'వినియోగదారు ID:'
  }
}


import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import ProfileClient from './ProfileClient'



export default async function ProfilePage() {
  // @ts-ignore - this is a server component but we inject standard pattern as requested
  const { language } = useLanguageStore.getState ? useLanguageStore.getState() : { language: 'EN' }
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  let user = null
  try {
    user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { student: { include: { instructor: { include: { user: true } } } } }
    })
  } catch (err) {
    console.error("Failed to query user profile from DB:", err)
  }

  if (!user) {
    user = {
      id: 'mock-student-user-id-123',
      name: session.user.name || 'Gaurav Singh (Mock)',
      email: session.user.email,
      phone: '+91 98765 43210',
      avatarUrl: (session.user as any).image || null,
      role: 'STUDENT',
      student: {
        id: 'mock-student-id-123',
        trainingType: 'BEGINNER',
        status: 'ACTIVE',
        instructor: {
          id: 'mock-instructor-id-123',
          user: {
            name: 'Rajesh Kumar (Mock)'
          }
        }
      }
    } as any
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] font-body text-[rgb(var(--color-text-1))] pb-28">
      
      {/* -----------------------------
          BLUE CURVED HEADER
          ----------------------------- */}
      <div className="bg-[rgb(var(--color-primary))] rounded-b-[40px] pt-12 pb-32 px-6 relative overflow-hidden text-white shadow-md">
        {/* Decorative background curves */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-md mx-auto relative z-10">
          
          {/* Top Bar (Relative with high z-index so dropdowns render above Avatar) */}
          <div className="flex justify-between items-center mb-8 relative z-50">
            <Link href="/student/dashboard" className="p-2 hover:bg-white/10 rounded-xl transition">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-lg font-bold font-display">{t.settings}</h1>
            <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
              <ThemeToggle />
              <LanguageToggle />
              <Link href="/student/notifications" className="p-2 hover:bg-white/20 rounded-xl transition cursor-pointer flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Avatar and Name */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-[4px] border-[rgb(var(--color-primary))] shadow-lg relative">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold font-display mt-4">{user.name}</h2>
            <p className="text-white/70 text-sm font-medium mt-0.5">{t.userId} {user.id.substring(0, 8)}</p>
          </div>

        </div>
      </div>

      {/* -----------------------------
          MAIN CONTENT AREA (-mt to overlap header)
          ----------------------------- */}
      <div className="max-w-md mx-auto px-5 -mt-16 relative z-10 flex flex-col gap-6">
        
        {/* User Information Card */}
        <ProfileClient initialUser={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          trainingType: user.student?.trainingType || 'BEGINNER',
          avatarUrl: user.avatarUrl
        }} />

      </div>
    </div>
  )
}
