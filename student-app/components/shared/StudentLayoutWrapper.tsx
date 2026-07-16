"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart2, User } from 'lucide-react'

// Gamification Overlays
import { XPToast } from '@/components/shared/XPToast'
import { LevelUpOverlay } from '@/components/shared/LevelUpOverlay'
import { BadgeReveal } from '@/components/shared/BadgeReveal'
import { StreakReminder } from '@/components/shared/StreakReminder'
import { useLanguageStore } from '@/store/languageStore'
import { GuidedTour } from '@/components/shared/GuidedTour'

type NavTab = {
  label: string
  labelHI: string
  labelTE: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const BOTTOM_NAV: NavTab[] = [
  { label: 'Home',     labelHI: 'होम',        labelTE: 'హోమ్',       path: '/dashboard',    icon: Home },
  { label: 'Learn',    labelHI: 'सीखें',      labelTE: 'నేర్చుకో',   path: '/learn',        icon: BookOpen },
  { label: 'Analysis', labelHI: 'विश्लेषण',   labelTE: 'విశ్లేషణ',   path: '/leaderboard',  icon: BarChart2 },
  { label: 'Profile',  labelHI: 'प्रोफ़ाइल', labelTE: 'ప్రొఫైల్',   path: '/profile',      icon: User },
]

const HIDDEN_NAV_PATHS = ['/onboarding', '/login', '/forgot-password', '/unauthorized']

export function StudentLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { language } = useLanguageStore()
  const lang = language.toUpperCase()

  const hideNav = HIDDEN_NAV_PATHS.includes(pathname)

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getLabel = (tab: NavTab) => {
    if (!mounted) return tab.label // Safe fallback for server-matching
    if (lang === 'HI') return tab.labelHI
    if (lang === 'TE') return tab.labelTE
    return tab.label
  }

  const isTabActive = (tab: NavTab) => pathname === tab.path || pathname.startsWith(tab.path + '/')

  return (
    <div className="w-full flex flex-col bg-[rgb(var(--color-void))] relative font-body text-[rgb(var(--color-text-1))] transition-colors duration-300">

      {/* Main Content — padded bottom to clear nav bar */}
      <div className={`flex-1 ${hideNav ? '' : 'pb-24'}`}>
        {children}
      </div>

      {!hideNav && (
        <>
          {/* Bottom Navigation Bar */}
          <div
            className="fixed bottom-0 inset-x-0 z-[400] bg-[rgb(var(--color-surface))] border-t border-[rgb(var(--color-border))]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <nav
              aria-label="Student navigation"
              className="flex items-center justify-around px-2 h-[72px] max-w-lg mx-auto relative"
            >
              {BOTTOM_NAV.map((tab) => {
                const active = isTabActive(tab)
                const Icon = tab.icon
                const label = getLabel(tab)

                return (
                  <Link
                    key={tab.path}
                    id={`nav-${tab.label.toLowerCase()}`}
                    href={tab.path}
                    aria-label={label}
                    aria-current={active ? 'page' : undefined}
                    className="flex flex-col items-center justify-center w-16 h-full gap-1 pt-2 relative transition-colors duration-200"
                  >
                    {/* Active indicator pill */}
                    {active && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-[rgb(var(--color-primary))]" />
                    )}
                    <Icon className={`w-5 h-5 transition-all duration-200 ${
                      active
                        ? 'text-[rgb(var(--color-primary))] stroke-[2.5]'
                        : 'text-[rgb(var(--color-text-3))] stroke-2'
                    }`} />
                    <span className={`text-[13px] font-bold transition-colors ${
                      active ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-3))]'
                    }`}>
                      {label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}

      {/* Gamification Overlays */}
      <XPToast />
      <LevelUpOverlay />
      <BadgeReveal />
      <StreakReminder />
      <GuidedTour />
    </div>
  )
}
