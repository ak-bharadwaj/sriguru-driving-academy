"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Award, Users, Calendar, MessageSquare, TrendingUp, Power } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

const INSTRUCTOR_BOTTOM_NAV_T = {
  EN: [
    { label: 'Console', path: '/instructor/dashboard', icon: Award },
    { label: 'Roster', path: '/instructor/students', icon: Users },
    { label: 'Live', path: '/instructor/schedule', icon: Power, isCenter: true },
    { label: 'Notes', path: '/instructor/coaching-notes', icon: MessageSquare },
    { label: 'Analytics', path: '/instructor/analytics', icon: TrendingUp }
  ]
}

export default function InstructorConsoleLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { language } = useLanguageStore()
  const tabs = INSTRUCTOR_BOTTOM_NAV_T.EN // Fallback to EN for now

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--color-void))] relative overflow-hidden font-body text-[rgb(var(--color-text-1))] transition-colors duration-300">
      
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar pb-24 pt-4 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <Breadcrumbs />
          {children}
        </div>
      </div>

      {/* ----------------------------------------------------
          MOBILE BOTTOM NAVIGATION BAR (Figma App Style)
          ---------------------------------------------------- */}
      <div className="absolute bottom-0 inset-x-0 z-[999] w-full bg-[rgb(var(--color-surface))] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-[rgb(var(--color-border))] pb-safe transition-colors duration-300">
        <nav className="flex items-center justify-around px-4 h-20 max-w-md mx-auto relative">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (pathname.startsWith(tab.path) && tab.path !== '/instructor/dashboard')
            const Icon = tab.icon

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.label}
                  href={tab.path}
                  className="relative -top-6 flex flex-col items-center justify-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-app-hover text-white transition-transform duration-300 group-hover:scale-105 active:scale-95 border-4 border-[rgb(var(--color-void))]">
                    <Icon className="w-8 h-8 stroke-[2.5]" />
                  </div>
                </Link>
              )
            }

            return (
              <Link
                key={tab.label}
                href={tab.path}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200 ${
                  isActive ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))]'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

    </div>
  )
}
