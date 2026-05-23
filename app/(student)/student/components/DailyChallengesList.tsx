"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Target, Check } from 'lucide-react'

export interface DailyChallengeTask {
  id: string
  title: string
  completed: boolean
  xp: number
}

export function DailyChallengesList({ challenges, totalReward = 25 }: { challenges: DailyChallengeTask[], totalReward?: number }) {
  const allDone = challenges.every(c => c.completed) && challenges.length > 0

  return (
    <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
      {allDone && (
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-[rgb(var(--color-text-1))] flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-500" /> 
          Daily Quests
        </h3>
        <span className="text-xs font-mono font-bold bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] px-2 py-0.5 rounded-md">
          {challenges.filter(c => c.completed).length} / {challenges.length}
        </span>
      </div>

      {challenges.length === 0 ? (
        <div className="text-xs text-[rgb(var(--color-text-3))] italic py-4 text-center border border-dashed border-[rgb(var(--color-border))]/50 rounded-xl">
          No quests active today.
        </div>
      ) : (
        <div className="flex flex-col gap-2 relative z-10">
          {challenges.map(c => (
            <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${c.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[rgb(var(--color-void))] border-[rgb(var(--color-border))]/50'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${c.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]'}`}>
                {c.completed && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-xs flex-1 ${c.completed ? 'text-emerald-500/80 line-through' : 'text-[rgb(var(--color-text-2))]'}`}>
                {c.title}
              </span>
              {!c.completed && (
                <span className="text-[10px] font-bold text-amber-500/80 font-mono">+{c.xp} XP</span>
              )}
            </div>
          ))}
        </div>
      )}

      {allDone && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-1 text-xs font-bold text-emerald-500"
        >
          All quests complete! +{totalReward} Bonus XP
        </motion.div>
      )}
    </div>
  )
}
