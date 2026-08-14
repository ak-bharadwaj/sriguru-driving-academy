"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'हिंदी' },
  { code: 'TE', name: 'తెలుగు' }
] as const

export function LanguageToggle({ dropdownDirection = 'up' }: { dropdownDirection?: 'up' | 'down' }) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguageStore()
  
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 md:px-3 md:py-2 rounded-full bg-surface border border-border shadow-sm hover:border-primary transition-colors duration-300 flex items-center justify-center text-text-2 hover:text-text-1 gap-1.5 md:gap-2 group"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-primary group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all" />
        <span className="text-xs font-bold font-display hidden md:inline">{currentLang.code}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownDirection === 'down' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownDirection === 'down' ? 10 : -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute right-0 p-2 w-32 bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col gap-1 z-[1100] ${
              dropdownDirection === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'
            }`}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentLang.code === lang.code 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-2 hover:bg-void hover:text-text-1'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
