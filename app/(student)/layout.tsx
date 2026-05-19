"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Compass, BookOpen, FileText, Award } from 'lucide-react'

// Import Gamification Overlays
import { XPToast } from '@/components/shared/XPToast'
import { LevelUpOverlay } from '@/components/shared/LevelUpOverlay'
import { BadgeReveal } from '@/components/shared/BadgeReveal'
import { StreakReminder } from '@/components/shared/StreakReminder'

const ORBITAL_TABS = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Learn', path: '/learn', icon: BookOpen },
  { label: 'RTO', path: '/rto', icon: FileText },
  { label: 'Roadmap', path: '/dashboard#roadmap', icon: Compass },
  { label: 'Badges', path: '/dashboard#badges', icon: Award }
]

export default function StudentPortalLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-void relative">
      
      {/* ----------------------------------------------------
          TOP ORBITAL NAVIGATION FLOATING PILL
          ---------------------------------------------------- */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] pointer-events-none w-full max-w-md px-4">
        <nav className="flex items-center justify-around gap-1 p-1.5 bg-surface/85 border border-border/80 backdrop-blur-md rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
          {ORBITAL_TABS.map((tab) => {
            const isActive = pathname === tab.path || (tab.path.startsWith('/dashboard#') && pathname === '/dashboard')
            const Icon = tab.icon

            return (
              <Link
                key={tab.label}
                href={tab.path}
                className="relative px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 group text-text-2 hover:text-text-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="orbital-active-pill"
                    className="absolute inset-0 bg-white/[0.04] border border-border/40 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'text-text-2'
                }`} />
                
                <span className={`hidden sm:inline ${isActive ? 'text-text-1 font-bold' : 'text-text-2'}`}>
                  {tab.label}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="orbital-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        {children}
      </div>

      {/* ----------------------------------------------------
          GLOBAL GAMIFICATION OVERLAYS
          ---------------------------------------------------- */}
      <XPToast />
      <LevelUpOverlay />
      <BadgeReveal />
      <StreakReminder />

    </div>
  )
}
