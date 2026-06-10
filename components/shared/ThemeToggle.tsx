"use client"

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial
    const root = document.documentElement
    if (root.classList.contains('dark')) {
      setIsDark(true)
    } else {
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    if (isDark) {
      root.classList.remove('dark')
      setIsDark(false)
    } else {
      root.classList.add('dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 md:p-3 rounded-full bg-surface border border-border shadow-sm hover:border-primary transition-colors duration-300 flex items-center justify-center text-text-2 hover:text-text-1 group shrink-0"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
        ) : (
          <Sun className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        )}
      </motion.div>
    </button>
  )
}
