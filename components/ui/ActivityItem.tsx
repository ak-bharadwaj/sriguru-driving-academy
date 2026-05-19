'use client'

import React from 'react'

interface ActivityItemProps {
  icon: React.ReactNode
  text: string
  timestamp: string
  isLast?: boolean
  className?: string
}

export function ActivityItem({ icon, text, timestamp, isLast = false, className = '' }: ActivityItemProps) {
  return (
    <div className={`flex gap-4 items-start ${className}`} style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Visual Timeline connector column */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-2)] hover:text-[var(--color-primary)] transition-colors duration-200">
          {icon}
        </div>
        {!isLast && (
          <div className="w-[1px] h-12 bg-[var(--color-border)] my-1" />
        )}
      </div>
      
      {/* Text and timestamp column */}
      <div className="flex-1 pt-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
        <p className="text-sm font-medium text-[var(--color-text-1)] leading-relaxed">
          {text}
        </p>
        <span className="text-xs text-[var(--color-text-3)] font-mono whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </div>
  )
}
