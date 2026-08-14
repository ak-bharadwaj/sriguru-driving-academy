"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, X, ArrowRight } from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

export const StreakReminder: React.FC = () => {
  const { streakDays } = useXPStore()
  const [showBanner, setShowBanner] = useState(false)
  const [hoursLeft, setHoursLeft] = useState(4)

  useEffect(() => {
    // Check local storage for simulated last activity timestamp
    const lastActivityStr = localStorage.getItem('streak_last_activity')
    const now = Date.now()

    if (!lastActivityStr) {
      // First visit: Seed last activity to exactly 21 hours ago to trigger streak at risk!
      const twentyOneHoursAgo = now - 21 * 60 * 60 * 1000
      localStorage.setItem('streak_last_activity', twentyOneHoursAgo.toString())
      setHoursLeft(3) // 24 - 21 = 3 hours remaining
      setShowBanner(true)
    } else {
      const lastActivity = parseInt(lastActivityStr)
      const diffMs = now - lastActivity
      const diffHours = diffMs / (1000 * 60 * 60)

      if (diffHours > 20 && diffHours < 24) {
        setHoursLeft(Math.max(1, Math.round(24 - diffHours)))
        setShowBanner(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    // Postpone reminder by resetting timestamp to now
    localStorage.setItem('streak_last_activity', Date.now().toString())
  }

  return (
    <AnimatePresence>
      {showBanner && streakDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-1/2 md:translate-x-1/2 z-[9999] max-w-lg w-full bg-accent border border-accent/20 text-void p-3.5 rounded-2xl shadow-[0_20px_40px_rgba(245,158,11,0.25)] flex items-center justify-between gap-4 font-body"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-void/10 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Flame className="w-5.5 h-5.5 text-void fill-current" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest opacity-60 leading-none font-bold">Streak At Risk</span>
              <h4 className="text-xs font-bold mt-1 text-void leading-tight">
                Your {streakDays}-day streak ends in {hoursLeft}h — complete a lesson to keep it!
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => window.location.href = '/learn'}
              className="px-3 py-1.5 bg-void hover:bg-void/90 text-accent font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all duration-200"
            >
              Learn
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-void/10 rounded-lg text-void transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
