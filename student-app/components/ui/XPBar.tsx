'use client'

import React from 'react'

interface XPBarProps {
  xp: number
  level: number
  className?: string
}

export function XPBar({ xp, level, className = '' }: XPBarProps) {
  // Let's assume standard level curve of 1000 XP per level
  const neededXP = level * 1000
  const progressPercent = Math.min(100, Math.max(0, (xp / neededXP) * 100))

  return (
    <div
      className={`p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col gap-3 ${className}`}
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      <div className="flex justify-between items-end">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-[var(--color-text-2)] uppercase tracking-wider font-semibold">
            Rank
          </span>
          <span
            className="text-2xl font-extrabold text-[var(--color-accent)] font-mono"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Lvl {level}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[var(--color-text-2)] font-mono">
            {xp} <span className="text-[var(--color-text-3)]">/ {neededXP} XP</span>
          </span>
        </div>
      </div>
      
      {/* Outer progress track */}
      <div className="w-full h-3 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] relative">
        {/* Amber XP Fill */}
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        
        {/* Subtle Level tick markers */}
        <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
          <span className="h-full w-[1px] bg-[rgba(255,255,255,0.15)]" />
          <span className="h-full w-[1px] bg-[rgba(255,255,255,0.15)]" />
          <span className="h-full w-[1px] bg-[rgba(255,255,255,0.15)]" />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[10px] text-[var(--color-text-3)] font-mono">
        <span>0%</span>
        <span>NEXT LEVEL IN {neededXP - xp} XP</span>
        <span>100%</span>
      </div>
    </div>
  )
}
