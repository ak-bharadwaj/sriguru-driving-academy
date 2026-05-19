'use client'

import React from 'react'

interface SkillBarProps {
  skill: string
  score: number
  max?: number
  className?: string
}

export function SkillBar({ skill, score, max = 10, className = '' }: SkillBarProps) {
  const percent = Math.min(100, Math.max(0, (score / max) * 100))

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-[var(--color-text-2)] tracking-wide uppercase">{skill}</span>
        <span className="text-[var(--color-text-1)] font-mono">
          {score} <span className="text-[var(--color-text-3)] font-normal">/ {max}</span>
        </span>
      </div>
      
      {/* Skill Track */}
      <div className="w-full h-2 bg-[rgba(255,255,255,0.03)] border border-[var(--color-border)] rounded-full overflow-hidden">
        {/* Dynamic score fill bar */}
        <div
          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[rgba(37,99,235,0.6)] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
