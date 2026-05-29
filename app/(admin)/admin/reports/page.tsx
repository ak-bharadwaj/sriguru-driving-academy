"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileDown, Users, IndianRupee, Calendar, Award, RefreshCw } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Reports & Exports',
    pageDesc: 'Download data and view operational reports.',
    refresh: 'Refresh Data',
    failedLoad: 'Failed to load report summary.',
    studentReport: 'Student Report',
    total: 'Total',
    exportCsv: 'Export CSV',
    revReport: 'Revenue Report',
    lifetime: 'Lifetime',
    thisMonth: 'This Month:',
    sessionReport: 'Session Report',
    testReport: 'Test Results Report',
    passRate: 'Pass Rate',
    passed: 'Passed',
    failed: 'Failed',
    scheduled: 'Scheduled'
  },
  HI: {
    pageTitle: 'रिपोर्ट और निर्यात',
    pageDesc: 'डेटा डाउनलोड करें और परिचालन रिपोर्ट देखें।',
    refresh: 'डेटा रीफ्रेश करें',
    failedLoad: 'रिपोर्ट सारांश लोड करने में विफल।',
    studentReport: 'छात्र रिपोर्ट',
    total: 'कुल',
    exportCsv: 'CSV निर्यात करें',
    revReport: 'राजस्व रिपोर्ट',
    lifetime: 'आजीवन',
    thisMonth: 'इस महीने:',
    sessionReport: 'सत्र रिपोर्ट',
    testReport: 'परीक्षण परिणाम रिपोर्ट',
    passRate: 'उत्तीर्ण दर',
    passed: 'उत्तीर्ण',
    failed: 'अनुत्तीर्ण',
    scheduled: 'निर्धारित'
  },
  TE: {
    pageTitle: 'నివేదికలు & ఎగుమతి',
    pageDesc: 'డేటాను డౌన్‌లోడ్ చేయండి మరియు కార్యాచరణ నివేదికలను వీక్షించండి.',
    refresh: 'డేటాను రిఫ్రెష్ చేయండి',
    failedLoad: 'నివేదికల సారాంశాన్ని లోడ్ చేయడం విఫలమైంది.',
    studentReport: 'విద్యార్థుల నివేదిక',
    total: 'మొత్తం',
    exportCsv: 'CSVని ఎగుమతి చేయండి',
    revReport: 'ఆదాయ నివేదిక',
    lifetime: 'జీవితకాలం',
    thisMonth: 'ఈ నెల:',
    sessionReport: 'సెషన్ నివేదిక',
    testReport: 'పరీక్ష ఫలితాల నివేదిక',
    passRate: 'ఉత్తీర్ణత రేటు',
    passed: 'ఉత్తీర్ణులయ్యారు',
    failed: 'విఫలమయ్యారు',
    scheduled: 'షెడ్యూల్ చేయబడింది'
  }
}


interface SummaryStats {
  students: { total: number, byType: { type: string, count: number }[] }
  revenue: { total: number, thisMonth: number, byMethod: { method: string, count: number, total: number }[] }
  sessions: { byStatus: { status: string, count: number }[] }
  tests: { pass: number, fail: number, scheduled: number, passRate: number }
}

export default function AdminReportsPage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/reports/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = (type: string) => {
    window.location.href = `/api/admin/reports/${type}?format=csv`
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[rgb(var(--color-text-1))]">{t.pageTitle}</h1>
            <p className="text-[rgb(var(--color-text-3))] text-sm mt-1">{t.pageDesc}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-sm font-bold shadow-sm hover:bg-[rgb(var(--color-surface))] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> {t.refresh}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-blue-600">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        ) : !stats ? (
          <div className="py-20 text-center text-[rgb(var(--color-text-3))]">{t.failedLoad}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* {t.studentReport} */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[rgb(var(--color-border))] pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">{t.studentReport}</h2>
              </div>
              <div className="flex-1 flex flex-col gap-4 mb-6">
                <div className="text-3xl font-bold">{stats.students.total} <span className="text-sm font-medium text-[rgb(var(--color-text-3))]">{t.total}</span></div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stats.students.byType.map(t => (
                    <span key={t.type} className="px-3 py-1 bg-[rgb(var(--color-border))] rounded-lg text-xs font-bold">{t.type}: {t.count}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDownload('students')} className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <FileDown className="w-4 h-4" /> {t.exportCsv}
              </button>
            </motion.div>

            {/* {t.revReport} */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[rgb(var(--color-border))] pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">{t.revReport}</h2>
              </div>
              <div className="flex-1 flex flex-col gap-4 mb-6">
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold text-emerald-600">₹{stats.revenue.total.toLocaleString()}</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text-3))] mb-1">{t.lifetime}</div>
                </div>
                <div className="text-sm font-bold text-[rgb(var(--color-text-2))]">{t.thisMonth} ₹{stats.revenue.thisMonth.toLocaleString()}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stats.revenue.byMethod.map(m => (
                    <span key={m.method} className="px-3 py-1 bg-[rgb(var(--color-border))] rounded-lg text-xs font-bold">{m.method}: ₹{m.total.toLocaleString()}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDownload('revenue')} className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                <FileDown className="w-4 h-4" /> {t.exportCsv}
              </button>
            </motion.div>

            {/* Sessions Report */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[rgb(var(--color-border))] pb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">{t.sessionReport}</h2>
              </div>
              <div className="flex-1 flex flex-col gap-4 mb-6">
                <div className="text-3xl font-bold">{stats.sessions.byStatus.reduce((a, b) => a + b.count, 0)} <span className="text-sm font-medium text-[rgb(var(--color-text-3))]">{t.total}</span></div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stats.sessions.byStatus.map(s => (
                    <div key={s.status} className="flex justify-between px-3 py-2 bg-[rgb(var(--color-void))] rounded-lg text-xs font-bold">
                      <span className="text-[rgb(var(--color-text-3))]">{s.status}</span>
                      <span>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDownload('sessions')} className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-bold rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors">
                <FileDown className="w-4 h-4" /> {t.exportCsv}
              </button>
            </motion.div>

            {/* Tests Report */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-[rgb(var(--color-border))] pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">{t.testReport}</h2>
              </div>
              <div className="flex-1 flex flex-col gap-4 mb-6">
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold">{stats.tests.passRate}%</div>
                  <div className="text-sm font-medium text-[rgb(var(--color-text-3))] mb-1">{t.passRate}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex flex-col items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <span className="text-lg font-bold text-emerald-600">{stats.tests.pass}</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{t.passed}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <span className="text-lg font-bold text-red-600">{stats.tests.fail}</span>
                    <span className="text-[10px] font-bold text-red-700 uppercase">{t.failed}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <span className="text-lg font-bold text-amber-600">{stats.tests.scheduled}</span>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">{t.scheduled}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDownload('tests')} className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                <FileDown className="w-4 h-4" /> {t.exportCsv}
              </button>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  )
}
