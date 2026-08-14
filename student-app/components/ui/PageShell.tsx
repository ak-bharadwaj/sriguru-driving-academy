'use client'

import React from 'react'

interface PageShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function PageShell({ children, title, subtitle, actions, className = '' }: PageShellProps) {
  return (
    <div
      className="min-h-screen bg-[var(--color-void)] text-[var(--color-text-1)] flex flex-col relative overflow-x-hidden"
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      {/* Abstract geometric top grid line pattern overlay to feel premium */}
      <div className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.07),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent pointer-events-none" />

      <main className={`flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 ${className}`}>
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-12">
          <div className="flex flex-col gap-2">
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-1)]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-[var(--color-text-2)] leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 self-start md:self-center">
              {actions}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
