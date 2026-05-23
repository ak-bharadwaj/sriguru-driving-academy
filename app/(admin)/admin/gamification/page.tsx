"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Zap, Trophy, ShieldCheck, Flame, Star, Search, Filter } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck, Award, Star, Trophy
}

export default function GamificationHQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/gamification')
        if (res.ok) {
          setData(await res.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const GLOBAL_LEADERBOARD = data?.leaderboard || []
  const BADGE_DISTRIBUTION = data?.badgeDistribution || []
  const GLOBAL_XP = data?.globalXP || '0'

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body min-h-screen flex flex-col gap-8">
      
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-primary uppercase">System Oversight</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 tracking-tight font-display mt-1 flex items-center gap-3">
            <Zap className="w-8 h-8 text-accent fill-accent/20" /> Gamification HQ
          </h1>
          <p className="text-sm text-text-2 mt-2">Global monitoring of Student XP distributions, badge unlocks, and level progressions.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-void/60 border border-border px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-sm font-bold text-accent font-mono">{GLOBAL_XP}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Leaderboard & Search */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-3xl p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-1 font-display">Active Student Rankings</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-text-3 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search Student..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-void border border-border rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none transition-colors w-48"
                  />
                </div>
                <button className="p-2 bg-void border border-border rounded-xl text-text-3 hover:text-text-1 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-xs font-mono text-text-3 uppercase tracking-wider">
                    <th className="pb-3 pl-4 font-normal">Rank</th>
                    <th className="pb-3 font-normal">Student Name</th>
                    <th className="pb-3 font-normal text-right">Total XP</th>
                    <th className="pb-3 font-normal text-center">Level</th>
                    <th className="pb-3 font-normal text-center">Badges</th>
                    <th className="pb-3 pr-4 font-normal text-center">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {GLOBAL_LEADERBOARD.filter((c: any) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((student: any, idx: number) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/20 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 pl-4">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                          student.rank === 1 ? 'bg-accent/20 text-accent border border-accent/40' : 
                          student.rank === 2 ? 'bg-text-3/20 text-text-2 border border-text-3/40' : 
                          student.rank === 3 ? 'bg-primary/20 text-primary border border-primary/40' : 'text-text-3'
                        }`}>
                          {student.rank}
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-text-1">{student.name}</td>
                      <td className="py-4 text-sm font-mono font-bold text-accent text-right">{student.xp.toLocaleString()}</td>
                      <td className="py-4 text-center">
                        <span className="px-2 py-1 bg-void border border-border rounded text-xs font-bold font-mono text-text-2">
                          Lv.{student.level}
                        </span>
                      </td>
                      <td className="py-4 text-center text-sm font-bold text-text-2">{student.badges}</td>
                      <td className="py-4 pr-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs font-bold font-mono text-accent">
                          <Flame className="w-3 h-3 fill-accent/40" /> {student.streak}d
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {GLOBAL_LEADERBOARD.filter((c: any) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-text-3">
                          <Trophy className="w-10 h-10 mb-3 opacity-20" />
                          <span className="text-sm font-mono uppercase tracking-wider">No Student Rankings Found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right Column: Global Stats */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-surface border border-border rounded-3xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-3 mb-6">Badge Distribution</h3>
            <div className="flex flex-col gap-5">
              {BADGE_DISTRIBUTION.map((badge: any, idx: number) => {
                const IconComponent = ICON_MAP[badge.icon] || Award
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-void border border-border flex items-center justify-center ${badge.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-text-1">{badge.name}</span>
                        <span className="text-xs font-mono text-text-3">{badge.count} earned</span>
                      </div>
                      {/* Visual Bar */}
                      <div className="w-full h-1.5 bg-void rounded-full overflow-hidden border border-border/40">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(badge.count / Math.max(1, BADGE_DISTRIBUTION[0]?.count || 1)) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-text-1 font-display">Modify Global Multipliers</h4>
            <p className="text-xs text-text-2 mt-2 mb-6">Activate double XP weekends or adjust progression scaling for all active Students.</p>
            <button className="w-full py-3 bg-void border border-border hover:border-primary/50 text-xs font-bold text-text-1 rounded-xl transition-colors">
              Access Configuration
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

