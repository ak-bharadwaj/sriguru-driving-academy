"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trophy } from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

export const LevelUpOverlay: React.FC = () => {
  const { pendingLevelUp, setPendingLevelUp, level } = useXPStore()

  // Auto dismiss after 3 seconds
  useEffect(() => {
    if (!pendingLevelUp) return
    const timer = setTimeout(() => {
      setPendingLevelUp(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [pendingLevelUp, setPendingLevelUp])

  return (
    <AnimatePresence>
      {pendingLevelUp && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          
          {/* Background backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPendingLevelUp(false)}
            className="absolute inset-0 bg-void/95 backdrop-blur-md cursor-pointer"
          />

          {/* Road Burst Radial SVG Background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <svg className="w-[800px] h-[800px] animate-[spin_40s_linear_infinite]" viewBox="0 0 200 200">
              {/* Radiating highway dashboard speed lines */}
              {Array.from({ length: 16 }).map((_, idx) => {
                const angle = (idx * 360) / 16
                return (
                  <line
                    key={idx}
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="10"
                    transform={`rotate(${angle} 100 100)`}
                    stroke="rgba(37, 99, 235, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4,8"
                  />
                )
              })}
              {/* Concentric speed circles */}
              <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(245, 158, 11, 0.05)" strokeWidth="1.5" strokeDasharray="6,6" />
            </svg>
          </div>

          {/* Center Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={() => setPendingLevelUp(false)}
            className="relative bg-surface border border-border rounded-[40px] p-8 md:p-12 text-center max-w-sm w-full shadow-[0_24px_60px_rgba(37,99,235,0.2)] cursor-pointer select-none overflow-hidden"
          >
            {/* Corner glowing blur dots */}
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-[40px]" />
            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-accent/20 rounded-full blur-[40px]" />

            {/* Glowing gold medallion */}
            <div className="relative flex justify-center mb-6">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
              <div className="w-[84px] h-[84px] rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center text-accent relative z-10 animate-bounce">
                <Trophy className="w-10 h-10 text-accent fill-accent/10" />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">CADET RANK ACQUIRED</span>
              <h1 className="text-5xl font-extrabold text-text-1 font-display tracking-tighter mt-2 uppercase">
                LEVEL {level}
              </h1>
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest mt-1 block font-bold">
                SRI GURU MASTER DRIVER
              </span>
            </div>

            <div className="border-t border-border mt-8 pt-6 flex flex-col gap-1.5 text-xs text-text-2 leading-relaxed">
              <p>Your on-road velocity controls and checkpoint accuracy registers have leveled up.</p>
              <span className="text-[10px] font-mono text-text-3 mt-4 block">TAP TO DISMISS CONSOLE</span>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}
