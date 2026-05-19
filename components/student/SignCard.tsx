"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, HelpCircle } from 'lucide-react'

// Import road sign SVGs
import * as RoadSigns from '@/lib/icons/road-signs'

interface SignCardProps {
  signKey: keyof typeof RoadSigns
  name: string
  category: string
  meaning: string
  rule: string
  limit?: number
  lightState?: 'red' | 'amber' | 'green'
  onStartQuiz?: () => void
}

export const SignCard: React.FC<SignCardProps> = ({
  signKey,
  name,
  category,
  meaning,
  rule,
  limit = 50,
  lightState = 'red',
  onStartQuiz
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Retrieve the custom SVG component
  const SVGIcon = RoadSigns[signKey] as any

  if (!SVGIcon) return null

  return (
    <>
      {/* 160x160px Fixed Sign Card */}
      <motion.div
        whileHover={{ 
          scale: 1.03,
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 20px rgba(37,99,235,0.15)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="w-[160px] h-[160px] bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-between relative cursor-pointer select-none group transition-colors duration-300"
      >
        {/* Top-Right XP Reward Badge */}
        <div className="absolute top-2 right-2 bg-accent/20 border border-accent/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none">
          <Award className="w-2.5 h-2.5 text-accent fill-accent" />
          <span className="text-[9px] font-bold text-accent font-mono">+5 XP</span>
        </div>

        {/* SVG Icon centered at 72px */}
        <div className="w-[72px] h-[72px] flex items-center justify-center mt-3">
          {signKey === 'SPEED_LIMIT' ? (
            <SVGIcon size={72} limit={limit} />
          ) : signKey === 'TRAFFIC_LIGHT' ? (
            <SVGIcon size={72} state={lightState} />
          ) : (
            <SVGIcon size={72} />
          )}
        </div>

        {/* Sign Name */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-2 group-hover:text-text-1 text-center w-full truncate transition-colors duration-200 mt-2">
          {name}
        </span>
      </motion.div>

      {/* Expanded Explanation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-void/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 md:p-8 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Decorative accent glow */}
              <div className="absolute -right-24 -top-24 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-void/50 hover:bg-white/[0.04] border border-border rounded-full text-text-3 hover:text-text-1 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal content */}
              <div className="flex flex-col items-center text-center gap-6 mt-4">
                {/* SVG Icon centered large */}
                <div className="w-[120px] h-[120px] flex items-center justify-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                  {signKey === 'SPEED_LIMIT' ? (
                    <SVGIcon size={120} limit={limit} glow />
                  ) : signKey === 'TRAFFIC_LIGHT' ? (
                    <SVGIcon size={120} state={lightState} glow />
                  ) : (
                    <SVGIcon size={120} glow />
                  )}
                </div>

                <div className="w-full">
                  <span className="text-xs font-mono uppercase tracking-widest text-primary">{category} Signboard</span>
                  <h3 className="text-2xl font-extrabold text-text-1 font-display tracking-tight mt-1">
                    {name}
                  </h3>
                </div>

                {/* Explanation text */}
                <div className="w-full flex flex-col gap-4 text-left border-t border-border pt-6">
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-text-3">Official Meaning</h5>
                    <p className="text-sm text-text-2 mt-1 font-body leading-relaxed">{meaning}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-text-3">RTO Driving Rule</h5>
                    <p className="text-sm text-text-2 mt-1 font-body leading-relaxed border-l-2 border-l-accent pl-3 italic bg-accent/5 py-2 rounded-r-lg">
                      {rule}
                    </p>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex gap-4 w-full mt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 bg-void/60 hover:bg-white/[0.03] border border-border text-text-2 hover:text-text-1 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    Got It, Cadet
                  </button>
                  {onStartQuiz && (
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        onStartQuiz()
                      }}
                      className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Practice Sign Quiz
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
