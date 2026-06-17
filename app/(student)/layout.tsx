"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart2, User, Zap, Gamepad2 } from 'lucide-react'

// Gamification Overlays
import { XPToast } from '@/components/shared/XPToast'
import { LevelUpOverlay } from '@/components/shared/LevelUpOverlay'
import { BadgeReveal } from '@/components/shared/BadgeReveal'
import { StreakReminder } from '@/components/shared/StreakReminder'
import { useLanguageStore } from '@/store/languageStore'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { GuidedTour } from '@/components/shared/GuidedTour'

import { useNotifications } from '@/hooks/useNotifications'

type NavTab = {
  label: string
  labelHI: string
  labelTE: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  isCenter?: boolean
}

const BOTTOM_NAV: NavTab[] = [
  { label: 'Home',     labelHI: 'होम',        labelTE: 'హోమ్',       path: '/student/dashboard',    icon: Home },
  { label: 'Learn',    labelHI: 'सीखें',      labelTE: 'నేర్చుకో',   path: '/student/learn',        icon: BookOpen },
  { label: 'Practice', labelHI: 'अभ्यास',     labelTE: 'సాధన',       path: '/student/simulator',    icon: Gamepad2, isCenter: true },
  { label: 'Analysis', labelHI: 'विश्लेषण',   labelTE: 'విశ్లేషణ',   path: '/student/leaderboard',  icon: BarChart2 },
  { label: 'Profile',  labelHI: 'प्रोफ़ाइल', labelTE: 'ప్రొఫైల్',   path: '/student/profile',      icon: User },
]

const HIDDEN_NAV_PATHS = ['/student/onboarding', '/student/simulator']

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { language } = useLanguageStore()
  const lang = language.toUpperCase()
  
  // Call useNotifications to register native browser notifications and poll in the background
  useNotifications()

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
      <div className={`flex-1 relative z-10 ${hideNav ? '' : 'pb-24'}`}>
        {children}
      </div>

      {!hideNav && (
        <>
          {/* Language & Theme toggles — standard solid pill bottom-right (hidden on mobile, shown on desktop) */}
          <div className="hidden md:block fixed bottom-[96px] right-4 z-[500] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1.5 p-1.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-full shadow-lg">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

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

                if (tab.isCenter) {
                  return (
                    <Link
                      key={tab.path}
                      id={`nav-${tab.label.toLowerCase()}`}
                      href={tab.path}
                      aria-label={label}
                      className="relative -top-6 flex flex-col items-center justify-center gap-1.5 group w-16"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 active:scale-95 border-4 border-[rgb(var(--color-void))] ${
                        active
                          ? 'bg-accent shadow-accent/30'
                          : 'bg-[rgb(var(--color-primary))] shadow-primary/30'
                      }`}>
                        <Icon className="w-6 h-6 text-white stroke-[2.5]" />
                      </div>
                      <span className={`text-[12px] font-bold uppercase tracking-wider transition-colors ${
                        active ? 'text-accent' : 'text-[rgb(var(--color-text-3))]'
                      }`}>
                        {label}
                      </span>
                    </Link>
                  )
                }

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
      {pathname !== '/student/simulator' && (
        <>
          <XPToast />
          <LevelUpOverlay />
          <BadgeReveal />
          <StreakReminder />
          <GuidedTour />
        </>
      )}
    </div>
  )
}
