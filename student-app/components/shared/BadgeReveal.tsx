"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Check, X } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { useXPStore } from '@/lib/stores/xp-store'
import { useSettingsStore } from '@/store/settingsStore'
import { BadgeVisual } from '@/components/shared/BadgeVisual'

export const BadgeReveal: React.FC = () => {
  const { pendingBadgeReveal, setPendingBadgeReveal } = useXPStore()
  const { academyName, logoUrl } = useSettingsStore()
  const { data: session } = useSession()
  
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto reset copied state
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  if (!pendingBadgeReveal) return null

  const currentStudentName = session?.user?.name || 'Active Cadet'

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${academyName}: I unlocked my verified digital credential "${pendingBadgeReveal.name}"! 🚀 check out srigurudriving.com`
      )
      setCopied(true)
    } catch (e) {
      console.error(e)
    }
  }

  // Create array of 30 mock confetti particle offsets
  const confettiArray = Array.from({ length: 30 })

  const activeAcademyName = mounted ? academyName : 'Sri Guru Driving School'
  const activeLogoUrl = mounted ? logoUrl : null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPendingBadgeReveal(null)}
          className="absolute inset-0 bg-void/96 backdrop-blur-md cursor-pointer"
        />

        {/* 30-Element Zero-Dependency Custom CSS Confetti Burst */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {confettiArray.map((_, i) => {
            const angle = Math.random() * 360
            const distance = 80 + Math.random() * 180
            const x = distance * Math.cos((angle * Math.PI) / 180)
            const y = distance * Math.sin((angle * Math.PI) / 180) - 100
            const size = 5 + Math.random() * 8
            const delay = Math.random() * 0.4
            
            // Harmonious HSL colors matching color tokens (Blue, Amber, Yellow)
            const colors = ['#2563EB', '#F59E0B', '#10B981', '#10B981', '#FFD700']
            const color = colors[i % colors.length]

            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0.1, x: 0, y: 0 }}
                animate={{ 
                  opacity: [1, 1, 0],
                  scale: [0.1, 1, 0.4],
                  x, 
                  y 
                }}
                transition={{ 
                  duration: 2.2, 
                  delay,
                  ease: 'easeOut'
                }}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: color,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            )
          })}
        </div>

        {/* Modal Reveal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -40 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="relative max-w-2xl w-full z-20"
        >
          {/* Top-right close button */}
          <button
            onClick={() => setPendingBadgeReveal(null)}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-all duration-200 z-50 shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Render the full-size Credential Badge Certificate Card */}
          <BadgeVisual
            type={pendingBadgeReveal.type || pendingBadgeReveal.name.toUpperCase().replace(/ /g, '_')}
            rarity={pendingBadgeReveal.rarity || 'Common'}
            isEarned={true}
            logoUrl={activeLogoUrl}
            academyName={activeAcademyName}
            studentName={currentStudentName}
            unlockedAt={pendingBadgeReveal.unlockedAt || new Date().toISOString()}
            size="lg"
            className="shadow-[0_24px_60px_rgba(251,191,36,0.18)]"
          />

          {/* Actions - floated below the certificate card */}
          <div className="flex gap-3 w-full mt-4 bg-surface/90 border border-border/60 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setPendingBadgeReveal(null)}
              className="flex-1 py-3 bg-void border border-border/60 hover:bg-white/[0.02] text-text-2 hover:text-text-1 font-bold text-xs rounded-xl transition-all duration-300"
            >
              Dismiss
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-1.5 transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Share Medal
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
