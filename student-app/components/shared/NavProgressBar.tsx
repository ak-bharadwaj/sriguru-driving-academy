'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Thin top progress bar that fires on every navigation.
 * Completely CSS-only — zero dependencies.
 */
export function NavProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const barRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Animate in to 85% instantly, then complete to 100% and fade
    bar.style.transition = 'none'
    bar.style.width = '0%'
    bar.style.opacity = '1'

    rafRef.current = requestAnimationFrame(() => {
      bar.style.transition = 'width 300ms cubic-bezier(0.1, 0.05, 0, 1)'
      bar.style.width = '85%'

      timerRef.current = setTimeout(() => {
        bar.style.transition = 'width 200ms ease, opacity 300ms ease 150ms'
        bar.style.width = '100%'
        bar.style.opacity = '0'
      }, 250)
    })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pathname, searchParams])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2.5px',
        width: '0%',
        opacity: 0,
        background: 'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-accent, var(--color-primary))))',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 0 8px rgb(var(--color-primary) / 0.6)',
        borderRadius: '0 2px 2px 0',
      }}
    />
  )
}
