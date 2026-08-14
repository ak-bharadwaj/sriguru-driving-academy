'use client'

import React from 'react'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string // e.g. "var(--color-primary)", "var(--color-success)", "var(--color-accent)"
  className?: string
}

export function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 6,
  color = 'var(--color-primary)',
  className = ''
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Foreground Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Inner Label for Percent if size >= 60 */}
      {size >= 60 && (
        <span
          className="absolute text-xs font-bold text-[var(--color-text-1)] font-mono"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {Math.round(percent)}%
        </span>
      )}
    </div>
  )
}
