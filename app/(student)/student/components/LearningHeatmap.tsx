"use client"
import React from 'react'

export interface HeatmapActivity {
  date: string // YYYY-MM-DD
  count: number
}

export function LearningHeatmap({ data }: { data: HeatmapActivity[] }) {
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().split('T')[0]
    const activity = data.find(x => x.date === dateStr)
    return {
      date: dateStr,
      count: activity?.count || 0
    }
  })

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]/30'
    if (count < 2) return 'bg-[rgb(var(--color-primary))]/30 border-[rgb(var(--color-primary))]/20'
    if (count < 4) return 'bg-[rgb(var(--color-primary))]/60 border-[rgb(var(--color-primary))]/50'
    return 'bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary-hover))] shadow-[0_0_10px_rgba(var(--color-primary),0.3)]'
  }

  return (
    <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">
          Learning Activity
        </span>
        <span className="text-[10px] text-[rgb(var(--color-primary))] font-bold font-mono">30 Days</span>
      </div>

      <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1.5 md:gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            title={`${day.count} actions on ${day.date}`}
            className={`aspect-square rounded-[4px] border ${getColor(day.count)} transition-all hover:scale-110 cursor-pointer`}
          />
        ))}
      </div>
    </div>
  )
}
