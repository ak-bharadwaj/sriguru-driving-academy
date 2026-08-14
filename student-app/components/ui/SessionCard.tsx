'use client'

import React from 'react'
import { Badge } from './Badge'

interface SessionCardProps {
  time: string
  instructor: string
  lessonType: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  className?: string
}

export function SessionCard({ time, instructor, lessonType, status, className = '' }: SessionCardProps) {
  const statusConfig = {
    SCHEDULED: { variant: 'primary' as const, label: 'Scheduled', borderColor: 'var(--color-primary)' },
    IN_PROGRESS: { variant: 'warning' as const, label: 'In Progress', borderColor: 'var(--color-accent)' },
    COMPLETED: { variant: 'success' as const, label: 'Completed', borderColor: 'var(--color-success)' },
    CANCELLED: { variant: 'danger' as const, label: 'Cancelled', borderColor: 'var(--color-danger)' }
  }

  const activeStatus = statusConfig[status] || statusConfig.SCHEDULED

  return (
    <div
      className={`p-5 bg-[var(--color-surface)] border-l-4 border-y border-r border-y-[var(--color-border)] border-r-[var(--color-border)] rounded-r-xl transition-all duration-300 hover:border-y-[rgba(255,255,255,0.12)] hover:border-r-[rgba(255,255,255,0.12)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
      style={{
        borderLeftColor: activeStatus.borderColor,
        fontFamily: 'var(--font-dm-sans)'
      }}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className="text-lg font-bold text-[var(--color-text-1)] leading-snug tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {lessonType}
        </span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-2)] font-mono">
          <span className="flex items-center gap-1.5">
            🕒 {time}
          </span>
          <span className="text-[var(--color-text-3)]">•</span>
          <span className="flex items-center gap-1.5">
            👤 Coach: <span className="font-semibold text-[var(--color-text-1)]">{instructor}</span>
          </span>
        </div>
      </div>
      
      <div>
        <Badge variant={activeStatus.variant}>
          {activeStatus.label}
        </Badge>
      </div>
    </div>
  )
}
