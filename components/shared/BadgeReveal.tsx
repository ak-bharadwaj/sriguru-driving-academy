"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Share2, Check, X } from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

export const BadgeReveal: React.FC = () => {
  const { pendingBadgeReveal, setPendingBadgeReveal } = useXPStore()
  const [copied, setCopied] = useState(false)

  // Auto reset copied state
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  if (!pendingBadgeReveal) return null

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `Sri Guru Driving Academy: I unlocked the "${pendingBadgeReveal.name}" badge! 🚀 check out srigurudriving.com`
      )
      setCopied(true)
    } catch (e) {
      console.error(e)
    }
  }

  // Create array of 30 mock confetti particle offsets
  const confettiArray = Array.from({ length: 30 })

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
          className="relative bg-surface border border-border rounded-[36px] p-6 md:p-10 text-center max-w-sm w-full shadow-[0_24px_50px_rgba(245,158,11,0.15)] z-20 overflow-hidden"
        >
          {/* Top-right close button */}
          <button
            onClick={() => setPendingBadgeReveal(null)}
            className="absolute top-4 right-4 p-2 bg-void/50 hover:bg-white/[0.04] border border-border rounded-full text-text-3 hover:text-text-1 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Golden Badge Ring scaling from 0 to full with spring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
            className="relative flex justify-center mb-6 mt-4"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-[100px] h-[100px] rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center text-accent relative z-10">
              <Award className="w-12 h-12 text-accent fill-accent/10" />
            </div>
          </motion.div>

          {/* Badge name + description fading in after 400ms */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col gap-2"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">ACHIEVEMENT REGISTERED</span>
            <h3 className="text-2xl font-extrabold text-text-1 font-display tracking-tight leading-tight uppercase">
              {pendingBadgeReveal.name}
            </h3>
            <p className="text-xs text-text-2 font-body mt-2 leading-relaxed px-2">
              {pendingBadgeReveal.description}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="flex gap-3 w-full mt-8 border-t border-border pt-6"
          >
            <button
              onClick={() => setPendingBadgeReveal(null)}
              className="flex-1 py-3 bg-void border border-border hover:bg-white/[0.02] text-text-2 hover:text-text-1 font-bold text-xs rounded-xl transition-all duration-300"
            >
              Close
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
          </motion.div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
