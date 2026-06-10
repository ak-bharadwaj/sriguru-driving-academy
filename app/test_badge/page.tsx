import React from 'react'
import { BadgeVisual } from '../../components/shared/BadgeVisual'

export default function TestBadge() {
  return (
    <div className="bg-slate-900 min-h-screen p-8 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
        <BadgeVisual type="PARKING_EXPERT" rarity="Common" isEarned={true} />
        <BadgeVisual type="SIGNAL_MASTER" rarity="Rare" isEarned={true} />
        <BadgeVisual type="ELITE_DRIVER" rarity="Legendary" isEarned={true} />
        <BadgeVisual type="PERFECT_ATTENDANCE" rarity="Common" isEarned={true} />
        <BadgeVisual type="ROAD_PRO" rarity="Rare" isEarned={true} />
        <BadgeVisual type="CONSISTENT_LEARNER" rarity="Legendary" isEarned={true} />
        <BadgeVisual type="SAFETY_CHAMPION" rarity="Common" isEarned={true} />
        <BadgeVisual type="QUIZ_MASTER" rarity="Rare" isEarned={true} />
        <BadgeVisual type="COURSE_GRADUATE" rarity="Legendary" isEarned={true} />
      </div>
    </div>
  )
}
