"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  Flame, 
  Star, 
  Search, 
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Map
} from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { toast } from 'react-hot-toast'

const PAGE_DICT = {
  EN: {
    systemOversight: 'System Oversight',
    gamificationHq: 'Gamification HQ',
    desc: 'Global monitoring of Student XP distributions, badge unlocks, and level progressions.',
    activeRankings: 'Active Student Rankings',
    searchPlaceholder: 'Search Student...',
    rank: 'Rank',
    studentName: 'Student Name',
    totalXp: 'Total XP',
    level: 'Level',
    badges: 'Badges',
    streak: 'Streak',
    lv: 'Lv.',
    daysShort: 'd',
    noRankings: 'No Student Rankings Found',
    badgeDistribution: 'Badge Distribution',
    earned: 'earned',
    modifyMultipliers: 'Modify Global Multipliers',
    multiplierDesc: 'Activate double XP weekends or adjust progression scaling for all active Students.',
    accessConfig: 'Access Configuration'
  },
  HI: {
    systemOversight: 'सिस्टम निगरानी',
    gamificationHq: 'गेमिफ़िकेशन मुख्यालय',
    desc: 'छात्र एक्सपी (XP) वितरण, बैज अनलॉक और स्तर की प्रगति की वैश्विक निगरानी।',
    activeRankings: 'सक्रिय छात्र रैंकिंग',
    searchPlaceholder: 'छात्र खोजें...',
    rank: 'रैंक',
    studentName: 'छात्र का नाम',
    totalXp: 'कुल एक्सपी (XP)',
    level: 'स्तर',
    badges: 'बैज',
    streak: 'लगातार दिन',
    lv: 'स्तर.',
    daysShort: 'दिन',
    noRankings: 'कोई छात्र रैंकिंग नहीं मिली',
    badgeDistribution: 'बैज वितरण',
    earned: 'अर्जित',
    modifyMultipliers: 'वैश्विक मल्टीप्लायर संशोधित करें',
    multiplierDesc: 'सभी सक्रिय छात्रों के लिए डबल XP सप्ताहांत सक्रिय करें या प्रगति स्केलिंग समायोजित करें।',
    accessConfig: 'कॉन्फ़िगरेशन एक्सेस करें'
  },
  TE: {
    systemOversight: 'సిస్టమ్ పర్యవేక్షణ',
    gamificationHq: 'గామిఫికేషన్ హెచ్‌క్యూ (HQ)',
    desc: 'విద్యార్థి ఎక్స్‌పీ (XP) పంపిణీలు, బ్యాడ్జ్ అన్‌లాక్‌లు మరియు స్థాయి పురోగతుల గ్లోబల్ పర్యవేక్షణ.',
    activeRankings: 'యాక్టివ్ విద్యార్థి ర్యాంకింగ్‌లు',
    searchPlaceholder: 'విద్యార్థిని వెతకండి...',
    rank: 'ర్యాంక్',
    studentName: 'విద్యార్థి పేరు',
    totalXp: 'మొత్తం XP',
    level: 'స్థాయి',
    badges: 'బ్యాడ్జ్‌లు',
    streak: 'వరుస రోజులు',
    lv: 'స్థాయి.',
    daysShort: 'రో',
    noRankings: 'ఎలాంటి విద్యార్థి ర్యాంకింగ్‌లు కనుగొనబడలేదు',
    badgeDistribution: 'బ్యాడ్జ్ పంపిణీ',
    earned: 'సంపాదించారు',
    modifyMultipliers: 'గ్లోబల్ మల్టిప్లైయర్‌లను సవరించండి',
    multiplierDesc: 'యాక్టివ్ విద్యార్థులందరి కోసం డబుల్ XP వారాంతాలను యాక్టివేట్ చేయండి లేదా ప్రోగ్రెషన్ స్కేలింగ్‌ని సర్దుబాటు చేయండి.',
    accessConfig: 'కాన్ఫిగరేషన్‌ను యాక్సెస్ చేయండి'
  }
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck, Award, Star, Trophy
}

const AVAILABLE_ICONS = [
  'Key', 'CircleDashed', 'Zap', 'RotateCw', 'ParkingSquare', 
  'AlignLeft', 'GitMerge', 'Route', 'Moon', 'AlertTriangle', 
  'FileText', 'Award', 'Compass'
]

const AVAILABLE_PHASES = [
  'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'RTO', 'MASTERY'
]

export default function GamificationHQPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'roadmap'>('leaderboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Roadmap States
  const [roadmapNodes, setRoadmapNodes] = useState<any[]>([])
  const [loadingRoadmap, setLoadingRoadmap] = useState(false)
  const [editingNode, setEditingNode] = useState<any | null>(null)
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [selectedCoursePlan, setSelectedCoursePlan] = useState<'BEGINNER' | 'ADVANCED' | 'RTO_FAST_TRACK'>('BEGINNER')

  // Form State
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPhase, setFormPhase] = useState('BEGINNER')
  const [formOrderIndex, setFormOrderIndex] = useState('1')
  const [formIcon, setFormIcon] = useState('Compass')
  const [formRequiredCardSlugs, setFormRequiredCardSlugs] = useState('')
  const [formUnlockThreshold, setFormUnlockThreshold] = useState('0.8')

  // Fetch leaderboard data
  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gamification')
      if (res.ok) {
        setData(await res.json())
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load gamification data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch roadmap data
  const fetchRoadmap = async (type: string) => {
    setLoadingRoadmap(true)
    try {
      const res = await fetch(`/api/admin/roadmap?trainingType=${type}`)
      if (res.ok) {
        setRoadmapNodes(await res.json())
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load roadmap nodes')
    } finally {
      setLoadingRoadmap(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'roadmap') {
      fetchRoadmap(selectedCoursePlan)
    }
  }, [activeTab, selectedCoursePlan])

  const handleOpenAdd = () => {
    setEditingNode(null)
    setFormTitle('')
    setFormDescription('')
    setFormPhase('BEGINNER')
    setFormOrderIndex(String(roadmapNodes.length + 1))
    setFormIcon('Compass')
    setFormRequiredCardSlugs('')
    setFormUnlockThreshold('0.8')
    setShowNodeModal(true)
  }

  const handleOpenEdit = (node: any) => {
    setEditingNode(node)
    setFormTitle(node.title)
    setFormDescription(node.description)
    setFormPhase(node.phase)
    setFormOrderIndex(String(node.orderIndex))
    setFormIcon(node.icon)
    setFormRequiredCardSlugs(
      Array.isArray(node.requiredCardSlugs) 
         ? node.requiredCardSlugs.join(', ') 
         : typeof node.requiredCardSlugs === 'string'
           ? JSON.parse(node.requiredCardSlugs).join(', ')
           : ''
    )
    setFormUnlockThreshold(String(node.unlockThreshold))
    setShowNodeModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const slugsArray = formRequiredCardSlugs
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    const payload = {
      id: editingNode?.id,
      title: formTitle,
      description: formDescription,
      phase: formPhase,
      orderIndex: parseInt(formOrderIndex) || 1,
      icon: formIcon,
      requiredCardSlugs: slugsArray,
      unlockThreshold: parseFloat(formUnlockThreshold) || 0.8,
      trainingType: selectedCoursePlan
    }

    try {
      const method = editingNode ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/roadmap', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingNode ? 'Roadmap node updated successfully' : 'Roadmap node created successfully')
        setShowNodeModal(false)
        fetchRoadmap(selectedCoursePlan)
      } else {
        const errData = await res.json()
        toast.error(errData.error || 'Failed to save node')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error saving node')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this roadmap node?')) return
    try {
      const res = await fetch(`/api/admin/roadmap?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Roadmap node deleted')
        fetchRoadmap(selectedCoursePlan)
      } else {
        toast.error('Failed to delete node')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error deleting node')
    }
  }

  const GLOBAL_LEADERBOARD = data?.leaderboard || []
  const BADGE_DISTRIBUTION = data?.badgeDistribution || []
  const GLOBAL_XP = data?.globalXP || '0'

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body min-h-screen flex flex-col gap-8">
      
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-primary uppercase">{t.systemOversight}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 tracking-tight font-display mt-1 flex items-center gap-3">
            <Zap className="w-8 h-8 text-accent fill-accent/20" /> {t.gamificationHq}
          </h1>
          <p className="text-sm text-text-2 mt-2">{t.desc}</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-void/60 border border-border px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-sm font-bold text-accent font-mono">{GLOBAL_XP} XP distributed</span>
          </div>
        </div>
      </header>

      {/* Tab Selectors */}
      <div className="flex gap-6 border-b border-border pb-1">
        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 text-sm font-bold tracking-tight transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'leaderboard' ? 'text-primary' : 'text-text-3 hover:text-text-1'
          }`}
        >
          <Trophy className="w-4 h-4" /> Leaderboard & Stats
          {activeTab === 'leaderboard' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 text-sm font-bold tracking-tight transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'roadmap' ? 'text-primary' : 'text-text-3 hover:text-text-1'
          }`}
        >
          <Map className="w-4 h-4" /> Roadmap Curriculum Manager
          {activeTab === 'roadmap' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' ? (
          <motion.div 
            key="leaderboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Leaderboard & Search */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-3xl p-6">
                
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-text-1 font-display">{t.activeRankings}</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-text-3 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
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
                        <th className="pb-3 pl-4 font-normal">{t.rank}</th>
                        <th className="pb-3 font-normal">{t.studentName}</th>
                        <th className="pb-3 font-normal text-right">{t.totalXp}</th>
                        <th className="pb-3 font-normal text-center">{t.level}</th>
                        <th className="pb-3 font-normal text-center">{t.badges}</th>
                        <th className="pb-3 pr-4 font-normal text-center">{t.streak}</th>
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
                              {t.lv}{student.level}
                            </span>
                          </td>
                          <td className="py-4 text-center text-sm font-bold text-text-2">{student.badges}</td>
                          <td className="py-4 pr-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-xs font-bold font-mono text-accent">
                              <Flame className="w-3 h-3 fill-accent/40" /> {student.streak}{t.daysShort}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      
                      {GLOBAL_LEADERBOARD.filter((c: any) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-text-3">
                              <Trophy className="w-10 h-10 mb-3 opacity-20" />
                              <span className="text-sm font-mono uppercase tracking-wider">{t.noRankings}</span>
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
                <h3 className="text-xs font-mono uppercase tracking-widest text-text-3 mb-6">{t.badgeDistribution}</h3>
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
                            <span className="text-xs font-mono text-text-3">{badge.count} {t.earned}</span>
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
                <h4 className="text-lg font-bold text-text-1 font-display">{t.modifyMultipliers}</h4>
                <p className="text-xs text-text-2 mt-2 mb-6">{t.multiplierDesc}</p>
                <button className="w-full py-3 bg-void border border-border hover:border-primary/50 text-xs font-bold text-text-1 rounded-xl transition-colors">
                  {t.accessConfig}
                </button>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-4 mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-text-1 font-display">Student Curriculum Roadmap Nodes</h3>
                  <p className="text-xs text-text-3 mt-1 font-mono">Configure winding road modules and phase dependencies</p>
                </div>
                
                {/* Course Selector */}
                <div className="flex bg-void border border-border rounded-xl p-1 shrink-0">
                  {(['BEGINNER', 'ADVANCED', 'RTO_FAST_TRACK'] as const).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedCoursePlan(plan)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedCoursePlan === plan 
                          ? 'bg-primary text-void shadow-md' 
                          : 'text-text-3 hover:text-text-1'
                      }`}
                    >
                      {plan === 'RTO_FAST_TRACK' ? 'RTO Fast-Track' : plan}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Roadmap Node
                </button>
              </div>

              {loadingRoadmap ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-xs font-mono text-text-3 uppercase tracking-wider">
                        <th className="pb-3 pl-4 font-normal">Order</th>
                        <th className="pb-3 font-normal">Title</th>
                        <th className="pb-3 font-normal">Phase</th>
                        <th className="pb-3 font-normal">Icon</th>
                        <th className="pb-3 font-normal">Required Cards</th>
                        <th className="pb-3 pr-4 font-normal text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roadmapNodes.map((node, idx) => (
                        <tr key={node.id || idx} className="border-b border-border/20 hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 pl-4 font-mono font-bold text-accent">{node.orderIndex}</td>
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-text-1">{node.title}</span>
                              <span className="text-[11px] text-text-3 max-w-xs truncate">{node.description}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              node.phase === 'BEGINNER' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              node.phase === 'INTERMEDIATE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              node.phase === 'ADVANCED' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              node.phase === 'RTO' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {node.phase}
                            </span>
                          </td>
                          <td className="py-4 font-mono text-xs text-text-2">{node.icon}</td>
                          <td className="py-4 text-xs font-mono text-text-3 max-w-[150px] truncate">
                            {Array.isArray(node.requiredCardSlugs) 
                              ? node.requiredCardSlugs.join(', ') 
                              : String(node.requiredCardSlugs || '')}
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEdit(node)}
                                className="p-1.5 bg-void hover:bg-white/[0.04] border border-border rounded-lg text-text-2 hover:text-text-1 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(node.id)}
                                className="p-1.5 bg-void hover:bg-red-500/10 border border-border hover:border-red-500/30 rounded-lg text-text-3 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {roadmapNodes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-text-3 font-mono text-xs">
                            No roadmap nodes loaded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showNodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNodeModal(false)}
              className="absolute inset-0 bg-void/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface border border-border p-6 rounded-3xl z-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-4 mb-4">
                <h3 className="text-lg font-bold text-text-1 font-display">
                  {editingNode ? 'Edit Roadmap Node' : 'Add Roadmap Node'}
                </h3>
                <button 
                  onClick={() => setShowNodeModal(false)}
                  className="p-1 hover:bg-white/[0.04] rounded-lg text-text-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-text-3">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="bg-void border border-border rounded-xl px-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                    placeholder="e.g. Steering Control"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-text-3">Description</label>
                  <textarea 
                    required 
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    className="bg-void border border-border rounded-xl px-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none h-20 resize-none"
                    placeholder="Provide a short instruction summary..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-text-3">Phase</label>
                    <select
                      value={formPhase}
                      onChange={e => setFormPhase(e.target.value)}
                      className="bg-void border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                    >
                      {AVAILABLE_PHASES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-text-3">Order Index</label>
                    <input 
                      type="number" 
                      required 
                      value={formOrderIndex}
                      onChange={e => setFormOrderIndex(e.target.value)}
                      className="bg-void border border-border rounded-xl px-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                      placeholder="e.g. 1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-text-3">Lucide Icon</label>
                    <select
                      value={formIcon}
                      onChange={e => setFormIcon(e.target.value)}
                      className="bg-void border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                    >
                      {AVAILABLE_ICONS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-text-3">Unlock Threshold</label>
                    <input 
                      type="number" 
                      step="0.05"
                      min="0"
                      max="1"
                      required 
                      value={formUnlockThreshold}
                      onChange={e => setFormUnlockThreshold(e.target.value)}
                      className="bg-void border border-border rounded-xl px-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                      placeholder="e.g. 0.8"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-text-3">Required Card Slugs (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={formRequiredCardSlugs}
                    onChange={e => setFormRequiredCardSlugs(e.target.value)}
                    className="bg-void border border-border rounded-xl px-4 py-2 text-xs font-mono text-text-1 focus:border-primary outline-none"
                    placeholder="e.g. vehicle-startup, steering-control"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowNodeModal(false)}
                    className="flex-1 py-3 bg-void hover:bg-white/[0.02] border border-border text-text-2 font-bold text-xs rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-all duration-200"
                  >
                    <Save className="w-4 h-4" /> Save Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
