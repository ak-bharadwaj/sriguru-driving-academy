"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Mountain, 
  BookOpen, 
  Moon, 
  CalendarCheck, 
  Car, 
  Route, 
  Zap, 
  Lock, 
  X, 
  ShieldCheck,
  Star
} from 'lucide-react'

// Import Zustand stores
import { useXPStore } from '@/lib/stores/xp-store'

const ICON_MAP: Record<string, React.ElementType> = {
  Award, Mountain, BookOpen, Moon, CalendarCheck, Car, Route, Zap, ShieldCheck, Star
}

export default function BadgesPage() {
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [lockedBadges, setLockedBadges] = useState<any[]>([])
  const [progress, setProgress] = useState({ xp: 0, nextBadgeXp: 1000 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch('/api/student/badges')
        if (res.ok) {
          const data = await res.json()
          setEarnedBadges(data.earnedBadges || [])
          setLockedBadges(data.lockedBadges || [])
          if (data.progress) setProgress(data.progress)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchBadges()
  }, [])

  const earnedBadgeIds = earnedBadges.map(b => b.id)
  
  const earnedCount = earnedBadges.length
  const totalCount = earnedBadges.length + lockedBadges.length
  
  const ALL_BADGES = [...earnedBadges, ...lockedBadges]

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-20 overflow-x-hidden font-body selection:bg-primary/30">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-32 md:pt-40">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent">Gamification Dashboard</span>
            <h1 className="text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1">
              Achievement Badges
            </h1>
            <p className="text-sm text-text-2 mt-2 max-w-xl font-body">
              Collect prestigious badges by mastering driving skills, acing theory exams, and maintaining perfect attendance.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 bg-surface border border-border p-5 rounded-2xl min-w-[280px]">
            <div className="flex justify-between w-full text-xs font-mono text-text-3">
              <span>Student Progress</span>
              <span className="text-accent font-bold">{earnedCount} / {totalCount} Earned</span>
            </div>
            <div className="w-full h-3 bg-void rounded-full overflow-hidden border border-border/80 mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent to-primary" 
              />
            </div>
            <div className="flex justify-between w-full text-[10px] text-text-2 mt-1">
              <span>Next Badge Progress</span>
              <span>{progress.xp} / {progress.nextBadgeXp} XP</span>
            </div>
          </div>
        </header>

        {/* Badges Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {ALL_BADGES.map((badge, idx) => {
            const isEarned = earnedBadgeIds.includes(badge.id)
            const Icon = ICON_MAP[badge.iconName] || Award

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-6 rounded-3xl border cursor-pointer group transition-all duration-300 flex flex-col items-center text-center ${
                  isEarned 
                    ? 'bg-surface border-border hover:border-accent hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]' 
                    : 'bg-void border-border/40 hover:border-border grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                }`}
              >
                {!isEarned && (
                  <div className="absolute top-4 right-4 bg-void/80 p-1.5 rounded-full border border-border">
                    <Lock className="w-3 h-3 text-text-3" />
                  </div>
                )}
                
                {isEarned && (
                  <div className="absolute top-0 right-0 w-full h-full bg-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}

                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center rotate-45 mb-6 shadow-xl overflow-hidden ${
                  isEarned ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/30' : 'bg-surface border border-border'
                }`}>
                  <div className="-rotate-45 w-full h-full flex items-center justify-center">
                    {badge.customImage ? (
                      <img src={badge.customImage} alt={badge.name} className="w-16 h-16 object-cover rounded-full" />
                    ) : (
                      <Icon className={`w-8 h-8 ${isEarned ? 'text-accent drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-text-3'}`} />
                    )}
                  </div>
                </div>

                <h3 className={`text-sm font-bold tracking-tight mb-1 ${isEarned ? 'text-text-1' : 'text-text-2'}`}>
                  {badge.name}
                </h3>
                
                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  badge.rarity === 'Legendary' ? 'text-primary' : badge.rarity === 'Rare' ? 'text-accent' : 'text-text-3'
                }`}>
                  {badge.rarity}
                </span>

                {isEarned && badge.unlockedAt && (
                  <div className="mt-4 text-[9px] text-text-3 font-mono bg-void border border-border px-2 py-1 rounded">
                    Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="absolute inset-0 bg-void/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-sm bg-surface border border-border rounded-3xl p-8 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center"
            >
              {earnedBadgeIds.includes(selectedBadge.id) && (
                <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 bg-void/50 hover:bg-white/[0.04] border border-border rounded-full text-text-3 hover:text-text-1 transition-all duration-200 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center rotate-45 mb-8 shadow-2xl relative z-10 overflow-hidden ${
                earnedBadgeIds.includes(selectedBadge.id) ? 'bg-gradient-to-br from-accent/30 to-primary/20 border-2 border-accent shadow-accent/20' : 'bg-void border-2 border-border'
              }`}>
                <div className="-rotate-45 w-full h-full flex items-center justify-center">
                  {selectedBadge.customImage ? (
                    <img src={selectedBadge.customImage} alt={selectedBadge.name} className="w-24 h-24 object-cover rounded-full" />
                  ) : (
                    React.createElement(ICON_MAP[selectedBadge.iconName] || Award, { 
                      className: `w-12 h-12 ${earnedBadgeIds.includes(selectedBadge.id) ? 'text-accent drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'text-text-3'}` 
                    })
                  )}
                </div>
              </div>

              <div className="relative z-10 w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className={`w-4 h-4 ${earnedBadgeIds.includes(selectedBadge.id) ? 'text-success' : 'text-text-3'}`} />
                  <span className="text-xs font-mono uppercase tracking-widest text-text-3">
                    {earnedBadgeIds.includes(selectedBadge.id) ? 'Achieved Status' : 'Locked Status'}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-text-1 font-display tracking-tight">
                  {selectedBadge.name}
                </h2>
                
                <p className="text-sm text-text-2 mt-3 mb-6 font-body leading-relaxed px-2">
                  {selectedBadge.description}
                </p>

                <div className="w-full bg-void border border-border rounded-xl p-4 flex justify-between items-center">
                  <span className="text-xs font-mono text-text-3 uppercase tracking-wider">Rarity Class</span>
                  <div className="flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${
                      selectedBadge.rarity === 'Legendary' ? 'text-primary fill-primary' : 
                      selectedBadge.rarity === 'Rare' ? 'text-accent fill-accent' : 'text-text-3'
                    }`} />
                    <span className="text-sm font-bold text-text-1">{selectedBadge.rarity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

