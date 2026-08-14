"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export function ConfidenceMeter({ score = 0 }: { score: number }) {
  const color = score > 80 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-rose-500'
  const bgglow = score > 80 ? 'shadow-emerald-500/20' : score > 50 ? 'shadow-amber-500/20' : 'shadow-rose-500/20'
  const fill = score > 80 ? 'bg-emerald-500' : score > 50 ? 'bg-amber-500' : 'bg-rose-500'
  
  return (
    <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider flex items-center gap-1.5">
          <Shield className={`w-3.5 h-3.5 ${color}`} />
          Confidence Meter
        </span>
        <span className={`text-lg font-bold font-mono ${color}`}>{Math.round(score)}%</span>
      </div>
      
      <div className="h-2 w-full bg-[rgb(var(--color-surface))] rounded-full overflow-hidden border border-[rgb(var(--color-border))]/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${fill} ${bgglow} shadow-lg`}
        />
      </div>
      <p className="text-[10px] text-[rgb(var(--color-text-3))] leading-tight">
        Based on instructor evaluations of steering, braking, and road sense.
      </p>
    </div>
  )
}
