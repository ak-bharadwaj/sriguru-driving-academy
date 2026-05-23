"use client"
import React from 'react'
import { CheckCircle2, Award, BookOpen, Clock, Activity } from 'lucide-react'

export interface TimelineEvent {
  id: string
  title: string
  timeAgo: string
  type: 'LESSON' | 'BADGE' | 'TEST' | 'SYSTEM'
}

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'LESSON': return <BookOpen className="w-3.5 h-3.5 text-blue-500" />
      case 'BADGE': return <Award className="w-3.5 h-3.5 text-amber-500" />
      case 'TEST': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      default: return <Activity className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
    }
  }

  return (
    <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50 rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-[rgb(var(--color-text-1))]">Timeline</h3>
      
      <div className="flex flex-col relative pl-4 border-l-2 border-[rgb(var(--color-border))]/50">
        {events.length === 0 ? (
          <div className="text-xs text-[rgb(var(--color-text-3))] italic py-2">No recent activity.</div>
        ) : (
          events.map((evt, i) => (
            <div key={evt.id} className={`flex flex-col gap-1 pb-4 relative ${i === events.length - 1 ? 'pb-0' : ''}`}>
              <div className="absolute -left-[23px] top-0 w-6 h-6 rounded-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] flex items-center justify-center shadow-sm">
                {getIcon(evt.type)}
              </div>
              <span className="text-xs font-medium text-[rgb(var(--color-text-1))] leading-tight">{evt.title}</span>
              <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {evt.timeAgo}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
