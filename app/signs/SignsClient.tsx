"use client"

import React, { useState } from 'react'
import { Search, Info, TriangleAlert, Ban, Route } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlobalTopNav } from '@/components/shared/GlobalTopNav'

interface SignsClientProps {
  files: string[]
}

export default function SignsClient({ files }: SignsClientProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  // Organize signs based on filenames (rudimentary categorization)
  const signs = files.map(f => {
    const name = f.replace(/\.svg$/i, '').replace(/[-_]/g, ' ')
    let category = 'INFORMATORY'
    if (name.toLowerCase().includes('warning') || name.toLowerCase().includes('ahead') || name.toLowerCase().includes('curve') || name.toLowerCase().includes('narrow') || name.toLowerCase().includes('cross')) {
      category = 'WARNING'
    } else if (name.toLowerCase().includes('no') || name.toLowerCase().includes('stop') || name.toLowerCase().includes('prohibited') || name.toLowerCase().includes('limit') || name.toLowerCase().includes('mandatory')) {
      category = 'MANDATORY'
    }
    
    return { file: f, name, category }
  })

  const filtered = signs.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'ALL' || s.category === filter
    return matchesSearch && matchesFilter
  })

  const toggleFlip = (file: string) => {
    setFlipped(prev => ({ ...prev, [file]: !prev[file] }))
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))]">
      <GlobalTopNav />

      <main className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono text-[rgb(var(--color-primary))] uppercase font-bold tracking-widest border border-[rgb(var(--color-primary))]/30 bg-[rgb(var(--color-primary))]/10 px-3 py-1 rounded-full">Road Safety</span>
          <h1 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight mt-6">
            Interactive Sign Cards
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-2))] mt-4 max-w-2xl mx-auto">
            Click on any flashcard to flip it and test your knowledge of essential RTO road signs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-3))]" />
            <input 
              type="text" 
              placeholder="Search signs (e.g., Speed Limit)..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))] outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {['ALL', 'MANDATORY', 'WARNING', 'INFORMATORY'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))] text-white shadow-md shadow-[rgb(var(--color-primary))]/20'
                    : 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[rgb(var(--color-text-3))] font-mono text-xs uppercase">No signs found for this query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 perspective-1000">
            <AnimatePresence>
              {filtered.map(sign => (
                <motion.div
                  key={sign.file}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative h-64 w-full cursor-pointer group"
                  onClick={() => toggleFlip(sign.file)}
                >
                  <motion.div
                    className="w-full h-full relative preserve-3d transition-transform duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-[rgb(var(--color-primary))]/10 rounded-[32px]"
                    animate={{ rotateY: flipped[sign.file] ? 180 : 0 }}
                  >
                    {/* FRONT OF CARD */}
                    <div className="absolute inset-0 backface-hidden bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[32px] p-6 flex items-center justify-center">
                      <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                        <img 
                          src={`/signs/${sign.file}`} 
                          alt="Road Sign" 
                          className="max-h-24 object-contain filter drop-shadow-md" 
                        />
                        <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))] uppercase tracking-widest absolute bottom-0 font-bold group-hover:text-[rgb(var(--color-primary))] transition-colors">Click to Flip</span>
                      </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div className="absolute inset-0 backface-hidden bg-[rgb(var(--color-primary))] text-white rounded-[32px] p-6 flex flex-col items-center justify-center text-center shadow-lg rotate-y-180 border border-white/10">
                      
                      {sign.category === 'WARNING' && <TriangleAlert className="w-6 h-6 mb-3 text-amber-300" />}
                      {sign.category === 'MANDATORY' && <Ban className="w-6 h-6 mb-3 text-red-300" />}
                      {sign.category === 'INFORMATORY' && <Info className="w-6 h-6 mb-3 text-blue-200" />}
                      
                      <h3 className="text-lg font-bold font-display uppercase leading-tight">{sign.name}</h3>
                      <span className="mt-3 px-2.5 py-1 bg-white/20 rounded-md text-[9px] font-mono font-bold tracking-widest uppercase">{sign.category} SIGN</span>
                    </div>

                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </main>
    </div>
  )
}
