'use client'

import React from 'react'

interface StatBlockProps {
  value: string | number
  label: string
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function StatBlock({ value, label, trend, className = '' }: StatBlockProps) {
  return (
    <div
      className={`p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] flex flex-col justify-between ${className}`}
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider">
          {label}
        </span>
        {trend && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold font-mono flex items-center gap-1 ${
              trend.isPositive
                ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div
        className="text-4xl font-extrabold text-[var(--color-text-1)] tracking-tight font-mono"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {value}
      </div>
    </div>
  )
}
