"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Users, TrendingUp, TrendingDown, Target, Zap, Clock, ShieldCheck } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    opsAnalytics: 'Ops Analytics',
    academyAnalytics: 'Academy Analytics',
    description: 'Realtime academy engagement, revenue vectors, and student progression metrics.',
    days7: '7 Days',
    days30: '30 Days',
    ytd: 'YTD',
    activeStudents: 'Active Students',
    weeklyRevenue: 'Weekly Revenue',
    avgCompletion: 'Avg. Completion',
    rtoPassRate: 'RTO Pass Rate',
    financials: 'Financials',
    enrollmentRevenue: 'Enrollment Revenue',
    vsLastWeek: '+12.4% vs last week',
    studentEngagement: 'Student Engagement',
    platformDauRatio: 'Platform DAU ratio',
    topPrograms: 'Top Programs',
    progFoundation: 'The Foundation',
    progRto: 'RTO Fast-Track',
    progAdvanced: 'Advanced Defensive',
    daysArr: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  HI: {
    opsAnalytics: 'ऑप्स एनालिटिक्स',
    academyAnalytics: 'अकादमी एनालिटिक्स',
    description: 'रीयलटाइम अकादमी एंगेजमेंट, रेवेन्यू वेक्टर्स और छात्र प्रगति मेट्रिक्स।',
    days7: '7 दिन',
    days30: '30 दिन',
    ytd: 'इस वर्ष अब तक',
    activeStudents: 'सक्रिय छात्र',
    weeklyRevenue: 'साप्ताहिक राजस्व',
    avgCompletion: 'औसत पूर्णता',
    rtoPassRate: 'आरटीओ पास दर',
    financials: 'वित्तीय',
    enrollmentRevenue: 'नामांकन राजस्व',
    vsLastWeek: 'पिछले सप्ताह की तुलना में +12.4%',
    studentEngagement: 'छात्र एंगेजमेंट',
    platformDauRatio: 'प्लेटफ़ॉर्म डीएयू अनुपात',
    topPrograms: 'शीर्ष कार्यक्रम',
    progFoundation: 'द फाउंडेशन',
    progRto: 'आरटीओ फास्ट-ट्रैक',
    progAdvanced: 'एडवांस्ड डिफेंसिव',
    daysArr: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि']
  },
  TE: {
    opsAnalytics: 'ఆపరేషన్స్ అనలిటిక్స్',
    academyAnalytics: 'అకాడమీ అనలిటిక్స్',
    description: 'రియల్‌టైమ్ అకాడమీ ఎంగేజ్‌మెంట్, రెవెన్యూ వెక్టర్స్ మరియు విద్యార్థి పురోగతి మెట్రిక్స్.',
    days7: '7 రోజులు',
    days30: '30 రోజులు',
    ytd: 'ఈ సంవత్సరం ఇప్పటివరకు',
    activeStudents: 'యాక్టివ్ విద్యార్థులు',
    weeklyRevenue: 'వారాంతపు ఆదాయం',
    avgCompletion: 'సగటు పూర్తి',
    rtoPassRate: 'RTO పాస్ రేటు',
    financials: 'ఫైనాన్షియల్స్',
    enrollmentRevenue: 'ఎన్రోల్‌మెంట్ ఆదాయం',
    vsLastWeek: 'గత వారం పోలిస్తే +12.4%',
    studentEngagement: 'విద్యార్థి ఎంగేజ్‌మెంట్',
    platformDauRatio: 'ప్లాట్‌ఫారమ్ DAU నిష్పత్తి',
    topPrograms: 'టాప్ ప్రోగ్రామ్‌లు',
    progFoundation: 'ది ఫౌండేషన్',
    progRto: 'RTO ఫాస్ట్-ట్రాక్',
    progAdvanced: 'అడ్వాన్స్‌డ్ డిఫెన్సివ్',
    daysArr: ['సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని', 'ఆది']
  }
}

export default function AnalyticsPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/analytics')
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

  const REVENUE_DATA = data?.revenueData || [0, 0, 0, 0, 0, 0, 0]
  const MAX_REV = Math.max(...REVENUE_DATA, 10)

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body min-h-screen">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-primary uppercase">{t.opsAnalytics}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 tracking-tight font-display mt-1">
            {t.academyAnalytics}
          </h1>
          <p className="text-sm text-text-2 mt-2">{t.description}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-void/50 border border-border p-2 rounded-xl">
          <button className="px-4 py-2 bg-surface text-text-1 text-xs font-bold rounded-lg shadow-md">{t.days7}</button>
          <button className="px-4 py-2 text-text-3 hover:text-text-1 text-xs font-bold transition-all">{t.days30}</button>
          <button className="px-4 py-2 text-text-3 hover:text-text-1 text-xs font-bold transition-all">{t.ytd}</button>
        </div>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: t.activeStudents, value: data?.topStats?.activeStudents || '0', change: '+12%', icon: Users, up: true, color: 'text-primary' },
          { label: t.weeklyRevenue, value: data?.topStats?.weeklyRevenue || '₹0', change: '+8.4%', icon: Activity, up: true, color: 'text-success' },
          { label: t.avgCompletion, value: data?.topStats?.avgCompletion || '0 Days', change: '-2 Days', icon: Clock, up: true, color: 'text-accent' },
          { label: t.rtoPassRate, value: data?.topStats?.rtoPassRate || '0%', change: '-1.1%', icon: ShieldCheck, up: false, color: 'text-danger' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute right-4 top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 scale-110 group-hover:scale-125">
              <stat.icon className="w-24 h-24 text-text-1" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-text-3">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-void border border-border ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-display font-extrabold text-text-1">{stat.value}</span>
              <span className={`flex items-center text-xs font-bold font-mono ${stat.up ? 'text-success' : 'text-danger'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 flex flex-col min-h-[400px]"
        >
          <div className="flex justify-between items-start mb-8 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-text-3">{t.financials}</span>
              <h3 className="text-lg font-bold text-text-1 font-display mt-1">{t.enrollmentRevenue}</h3>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-success font-mono">{t.vsLastWeek}</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-2 sm:gap-4 lg:gap-8 pt-8">
            {REVENUE_DATA.map((val: number, idx: number) => {
              const heightPct = (val / MAX_REV) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative flex items-end justify-center h-48 bg-void/30 rounded-t-xl overflow-hidden">
                    {/* Tooltip hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-text-1 text-void text-[10px] font-mono font-bold px-2 py-1 rounded">
                      ₹{(val * 1000).toLocaleString('en-IN')}
                    </div>
                    {/* The Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 1, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-md relative"
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-mono text-text-3 uppercase">{t.daysArr[idx]}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Right Side Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Engagement Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <span className="text-xs font-mono uppercase tracking-widest text-text-3">{t.studentEngagement}</span>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-display font-extrabold text-text-1">84%</h3>
                <span className="text-xs text-text-2 mt-1">{t.platformDauRatio}</span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-void border-t-accent flex items-center justify-center animate-[spin_4s_linear_infinite]">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* Top Courses Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface border border-border rounded-3xl p-6 flex-1"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-text-3">{t.topPrograms}</span>
            <div className="mt-6 flex flex-col gap-4">
              {(data?.topPrograms || [
                { name: t.progFoundation, pct: 45, color: 'bg-primary' },
                { name: t.progRto, pct: 30, color: 'bg-accent' },
                { name: t.progAdvanced, pct: 25, color: 'bg-text-3' }
              ]).map((prog: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-text-1 mb-2">
                    <span>{prog.name}</span>
                    <span className="font-mono text-text-2">{prog.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prog.pct}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`h-full ${prog.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

