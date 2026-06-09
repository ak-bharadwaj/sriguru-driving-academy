"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

import { useLanguageStore } from '@/store/languageStore'
import { useSettingsStore } from '@/store/settingsStore'
import { BadgeVisual } from '@/components/shared/BadgeVisual'

const PAGE_DICT = {
  EN: {
    dashboard: 'Gamification Dashboard',
    title: 'Achievement Badges',
    desc: 'Collect prestigious digital credentials by mastering driving skills, passing theory exams, and maintaining perfect attendance.',
    progress: 'Student Progress',
    earned: 'Earned',
    nextProgress: 'Next badge progress',
    xp: 'XP',
    locked: 'Locked',
    achieved: 'Achieved',
    rarity: 'Rarity Class',
    unlocked: 'Unlocked:'
  },
  HI: {
    dashboard: 'गेमिफिकेशन डैशबोर्ड',
    title: 'उपलब्धि बैज',
    desc: 'ड्राइविंग कौशल में महारत हासिल करके, थ्योरी परीक्षा पास करके और सही उपस्थिति बनाए रखकर प्रतिष्ठित डिजिटल क्रेडेंशियल एकत्र करें।',
    progress: 'छात्र की प्रगति',
    earned: 'अर्जित',
    nextProgress: 'अगले बैज की प्रगति',
    xp: 'एक्सपी',
    locked: 'लॉक',
    achieved: 'प्राप्त',
    rarity: 'दुर्लभता वर्ग',
    unlocked: 'अनलॉक किया गया:'
  },
  TE: {
    dashboard: 'గేమిఫికేషన్ డాష్‌బోర్డ్',
    title: 'సాధన బ్యాడ్జీలు',
    desc: 'డ్రైవింగ్ నైపుణ్యాలను సాధించడం ద్వారా, థియరీ పరీక్షలను ఉత్తీర్ణత సాధించడం ద్వారా మరియు సరైన హాజరును కొనసాగించడం ద్వారా ప్రతిష్టాత్మక డిజిటల్ ఆధారాలను సేకరించండి.',
    progress: 'విద్యార్థి పురోగతి',
    earned: 'సంపాదించారు',
    nextProgress: 'తదుపరి బ్యాడ్జ్ పురోగతి',
    xp: 'ఎక్స్‌పీ',
    locked: 'లాక్',
    achieved: 'సాధించారు',
    rarity: 'అరుదైన తరగతి',
    unlocked: 'అన్లాక్ చేయబడింది:'
  }
}

export default function BadgesPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const { academyName, logoUrl } = useSettingsStore()

  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [lockedBadges, setLockedBadges] = useState<any[]>([])
  const [studentName, setStudentName] = useState('Active Cadet')
  const [progress, setProgress] = useState({ xp: 0, nextBadgeXp: 1000 })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch('/api/student/badges')
        if (res.ok) {
          const data = await res.json()
          setEarnedBadges(data.earnedBadges || [])
          setLockedBadges(data.lockedBadges || [])
          if (data.progress) setProgress(data.progress)
          if (data.studentName) setStudentName(data.studentName)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchBadges()
  }, [])

  const earnedBadgeIds = earnedBadges.map(b => b.id)
  const earnedCount = earnedBadges.length
  const totalCount = earnedBadges.length + lockedBadges.length
  const ALL_BADGES = [...earnedBadges, ...lockedBadges]

  // Safe hydration defaults
  const activeAcademyName = mounted ? academyName : 'Sri Guru Driving Academy'
  const activeLogoUrl = mounted ? logoUrl : null

  return (
    <div className="min-h-screen bg-void text-text-1 relative pb-20 overflow-x-hidden font-body selection:bg-primary/30">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">{t.dashboard}</span>
            <h1 className="text-4xl font-extrabold text-text-1 font-display tracking-tight mt-1 uppercase">
              {t.title}
            </h1>
            <p className="text-sm text-text-2 mt-2 max-w-xl font-body leading-relaxed">
              {t.desc}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 bg-surface border border-border p-5 rounded-2xl min-w-[280px]">
            <div className="flex justify-between w-full text-xs font-mono text-text-3">
              <span>{t.progress}</span>
              <span className="text-accent font-bold">{earnedCount} / {totalCount} {t.earned}</span>
            </div>
            <div className="w-full h-3 bg-void rounded-full overflow-hidden border border-border/80 mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent to-primary"
              />
            </div>
            <div className="flex justify-between w-full text-[10px] text-text-2 mt-1">
              <span>{t.nextProgress}</span>
              <span>{progress.xp} / {progress.nextBadgeXp} {t.xp}</span>
            </div>
          </div>
        </header>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Badges Grid */
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {ALL_BADGES.map((badge, idx) => {
              const isEarned = earnedBadgeIds.includes(badge.id)
              const badgeType = badge.type || badge.name.toUpperCase().replace(/ /g, '_')

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="cursor-pointer group block"
                >
                  <BadgeVisual
                    type={badgeType}
                    rarity={badge.rarity}
                    isEarned={isEarned}
                    logoUrl={activeLogoUrl}
                    academyName={activeAcademyName}
                    studentName={studentName}
                    unlockedAt={badge.unlockedAt}
                    size="md"
                  />
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="absolute inset-0 bg-void/90 backdrop-blur-md"
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-sm overflow-hidden z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 bg-void/80 hover:bg-white/[0.06] border border-border/80 rounded-full text-text-3 hover:text-text-1 transition-all duration-200 z-50 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              <BadgeVisual
                type={selectedBadge.type || selectedBadge.name.toUpperCase().replace(/ /g, '_')}
                rarity={selectedBadge.rarity}
                isEarned={earnedBadgeIds.includes(selectedBadge.id)}
                logoUrl={activeLogoUrl}
                academyName={activeAcademyName}
                studentName={studentName}
                unlockedAt={selectedBadge.unlockedAt}
                size="lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
