'use client'

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary)] border-[rgba(37,99,235,0.2)]',
    success: 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] border-[rgba(16,185,129,0.2)]',
    warning: 'bg-[rgba(245,158,11,0.1)] text-[var(--color-accent)] border-[rgba(245,158,11,0.2)]',
    danger: 'bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)] border-[rgba(239,68,68,0.2)]',
    muted: 'bg-[rgba(255,255,255,0.03)] text-[var(--color-text-2)] border-[var(--color-border)]'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase font-mono leading-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
