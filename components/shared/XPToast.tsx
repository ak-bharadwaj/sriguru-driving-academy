"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Zap, Award as BadgeIcon } from 'lucide-react'
import { useXPStore } from '@/lib/stores/xp-store'

export const XPToast: React.FC = () => {
  const { pendingToasts, dismissToast, reconcileXP } = useXPStore()

  // Process toasts: reconcile XP in backend db and auto-dismiss after 2.5s
  useEffect(() => {
    if (pendingToasts.length === 0) return

    const activeToast = pendingToasts[pendingToasts.length - 1]
    
    // Auto-reconcile XP with database
    if (activeToast.type === 'xp' && activeToast.xpAmount) {
      reconcileXP(activeToast.xpAmount)
    }

    const timer = setTimeout(() => {
      dismissToast(activeToast.id)
    }, 2500)

    return () => clearTimeout(timer)
  }, [pendingToasts, dismissToast, reconcileXP])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {pendingToasts.map((toast) => {
          const isXP = toast.type === 'xp'
          const isLevel = toast.type === 'level'

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(2px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`p-4 rounded-2xl border backdrop-blur-md flex items-center gap-3.5 shadow-2xl relative overflow-hidden pointer-events-auto ${
                isLevel 
                  ? 'bg-success/90 border-success/40 text-white shadow-success/15'
                  : isXP
                    ? 'bg-surface/90 border-accent/30 text-accent shadow-accent/15'
                    : 'bg-surface/90 border-primary/30 text-primary shadow-primary/15'
              }`}
            >
              {/* Glow accent */}
              <div className="absolute -left-10 -top-10 w-24 h-24 bg-current opacity-10 rounded-full blur-xl pointer-events-none" />

              {/* Indicator icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isLevel 
                  ? 'bg-white/10 text-white' 
                  : isXP 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-primary/10 text-primary'
              }`}>
                {isLevel ? (
                  <Zap className="w-4 h-4 fill-current text-success-foreground" />
                ) : isXP ? (
                  <Award className="w-4 h-4 fill-current" />
                ) : (
                  <BadgeIcon className="w-4 h-4 fill-current" />
                )}
              </div>

              {/* Content description */}
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 font-semibold leading-none">
                  {isLevel ? 'ACADEMY RANK UP' : isXP ? 'CADET REWARD' : 'CRITERION MET'}
                </span>
                <h4 className="text-sm font-bold mt-1 leading-snug truncate font-display text-text-1">
                  {toast.title}
                </h4>
                <p className="text-xs text-text-2 font-mono mt-0.5 leading-none">
                  {toast.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
