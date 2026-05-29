"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Calendar, Edit3, MapPin, X, CheckCircle, FileWarning, Clock } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: '{t.pageTitle}',
    pageDesc: '{t.pageDesc}',
    searchPh: 'Search student...',
    loading: '{t.loading}',
    dateTime: '{t.dateTime}',
    center: 'Center',
    notAssigned: 'Not Assigned',
    status: 'Status',
    attempt: 'Attempt',
    edit: 'Edit',
    noTests: '{t.noTests}',
    editExam: 'Edit Exam',
    scheduleExam: 'Schedule Exam',
    student: 'Student:',
    result: 'Result',
    scheduled: 'Scheduled',
    passStr: 'Pass',
    failStr: 'Fail',
    notes: 'Notes',
    phCenter: 'e.g. RTO North',
    phNotes: 'Optional notes about the test...',
    saving: 'Saving...',
    saveExam: 'Save Exam',
    failSave: 'Failed to save'
  },
  HI: {
    pageTitle: 'परीक्षा टाइमलाइन',
    pageDesc: 'सभी आगामी और पिछली ड्राइविंग परीक्षाओं का प्रबंधन करें।',
    searchPh: 'छात्र खोजें...',
    loading: 'टाइमलाइन डेटा लोड हो रहा है...',
    dateTime: 'दिनांक और समय',
    center: 'केंद्र',
    notAssigned: 'सौंपा नहीं गया',
    status: 'स्थिति',
    attempt: 'प्रयास',
    edit: 'संपादित करें',
    noTests: 'आपकी खोज से कोई परीक्षा मेल नहीं खाती।',
    editExam: 'परीक्षा संपादित करें',
    scheduleExam: 'परीक्षा निर्धारित करें',
    student: 'छात्र:',
    result: 'परिणाम',
    scheduled: 'निर्धारित',
    passStr: 'उत्तीर्ण',
    failStr: 'अनुत्तीर्ण',
    notes: 'नोट्स',
    phCenter: 'उदा. आरटीओ उत्तर',
    phNotes: 'परीक्षा के बारे में वैकल्पिक नोट्स...',
    saving: 'सहेजा जा रहा है...',
    saveExam: 'परीक्षा सहेजें',
    failSave: 'सहेजने में विफल'
  },
  TE: {
    pageTitle: 'పరీక్షల టైమ్‌లైన్',
    pageDesc: 'రాబోయే మరియు గత డ్రైవింగ్ పరీక్షలన్నింటినీ నిర్వహించండి.',
    searchPh: 'విద్యార్థిని వెతకండి...',
    loading: 'టైమ్‌లైన్ డేటాను లోడ్ చేస్తోంది...',
    dateTime: 'తేదీ & సమయం',
    center: 'కేంద్రం',
    notAssigned: 'కేటాయించబడలేదు',
    status: 'స్థితి',
    attempt: 'ప్రయత్నం',
    edit: 'సవరించు',
    noTests: 'మీ శోధనకు ఏ పరీక్షలు సరిపోలలేదు.',
    editExam: 'పరీక్షను సవరించండి',
    scheduleExam: 'పరీక్షను షెడ్యూల్ చేయండి',
    student: 'విద్యార్థి:',
    result: 'ఫలితం',
    scheduled: 'షెడ్యూల్ చేయబడింది',
    passStr: 'పాస్',
    failStr: 'ఫెయిల్',
    notes: 'గమనికలు',
    phCenter: 'ఉదా. ఆర్టీఓ నార్త్',
    phNotes: 'పరీక్ష గురించి ఐచ్ఛిక గమనికలు...',
    saving: 'సేవ్ చేయబడుతోంది...',
    saveExam: 'పరీక్షను సేవ్ చేయండి',
    failSave: 'సేవ్ చేయడం విఫలమైంది'
  }
}


interface DrivingTest {
  id: string
  studentId: string
  testDate: string
  testCenter: string | null
  result: 'SCHEDULED' | 'PASS' | 'FAIL'
  attemptNo: number
  notes: string | null
  student: {
    user: {
      name: string
      email: string
    }
  }
}

export default function AdminTimelinePage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [tests, setTests] = useState<DrivingTest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTest, setEditTest] = useState<Partial<DrivingTest>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/admin/timeline')
      if (res.ok) {
        const data = await res.json()
        setTests(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const isNew = !editTest.id
      const method = isNew ? 'POST' : 'PUT'
      const payload = isNew 
        ? {
            studentId: editTest.studentId, // Would normally select from a dropdown in a full form
            testDate: editTest.testDate,
            testCenter: editTest.testCenter,
            notes: editTest.notes
          }
        : {
            testId: editTest.id,
            testDate: editTest.testDate,
            testCenter: editTest.testCenter,
            result: editTest.result,
            notes: editTest.notes
          }
          
      const res = await fetch('/api/admin/timeline', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        await fetchTests()
        setIsEditModalOpen(false)
      } else {
        const err = await res.json()
        alert(err.error || t.failSave)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTests = tests.filter(t => 
    t.student?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">{t.pageTitle}</h1>
            <p className="text-text-2">{t.pageDesc}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
              <input 
                type="text" 
                placeholder={t.searchPh} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-white"
              />
            </div>
            {/* Note: Full implementation would have a robust student selector for new tests */}
            {/* <button 
              onClick={() => { setEditTest({}); setIsEditModalOpen(true); }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Schedule New
            </button> */}
          </div>
        </header>

        {loading ? (
          <div className="text-center text-text-3 py-20">{t.loading}</div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const dateObj = new Date(test.testDate)
              return (
                <motion.div 
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                      test.result === 'PASS' ? 'bg-success/10 border-success/30 text-success' : 
                      test.result === 'FAIL' ? 'bg-danger/10 border-danger/30 text-danger' : 
                      'bg-primary/10 border-primary/30 text-primary'
                    }`}>
                      {test.result === 'PASS' ? <CheckCircle className="w-6 h-6" /> :
                       test.result === 'FAIL' ? <FileWarning className="w-6 h-6" /> :
                       <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{test.student?.user?.name}</h3>
                      <div className="text-sm text-text-3 font-mono">{test.student?.user?.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-text-3 font-bold uppercase mb-1">{t.dateTime}</span>
                      <span className="font-semibold text-text-1">{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-3 font-bold uppercase mb-1">{t.center}</span>
                      <span className="text-sm text-text-1 truncate max-w-[150px]">{test.testCenter || t.notAssigned}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-3 font-bold uppercase mb-1">{t.status}</span>
                      <span className={`text-sm font-bold ${
                        test.result === 'PASS' ? 'text-success' :
                        test.result === 'FAIL' ? 'text-danger' :
                        'text-primary'
                      }`}>{test.result}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-3 font-bold uppercase mb-1">{t.attempt}</span>
                      <span className="text-sm text-text-1">#{test.attemptNo}</span>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        setEditTest({
                          ...test,
                          testDate: new Date(test.testDate).toISOString().slice(0, 16)
                        })
                        setIsEditModalOpen(true)
                      }}
                      className="w-full md:w-auto px-4 py-2 bg-void border border-border text-text-2 rounded-lg text-sm font-bold hover:bg-border transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              )
            })}

            {filteredTests.length === 0 && (
              <div className="text-center py-20 text-text-3 border border-dashed border-border rounded-2xl">
                {t.noTests}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-[24px] p-8 max-w-lg w-full relative"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-text-3 hover:text-text-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold font-display mb-6">{editTest.id ? t.editExam : t.scheduleExam}</h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                
                {/* ID visible only on edit for context */}
                {editTest.id && (
                  <div className="text-sm text-text-3 mb-2 font-mono">
                    {t.student} <span className="text-white">{editTest.student?.user?.name}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-xs font-bold uppercase text-text-3">{t.dateTime}</label>
                    <input 
                      type="datetime-local" 
                      value={editTest.testDate || ''}
                      onChange={(e) => setEditTest({...editTest, testDate: e.target.value})}
                      className="bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-text-3">{t.center}</label>
                    <input 
                      type="text" 
                      value={editTest.testCenter || ''}
                      onChange={(e) => setEditTest({...editTest, testCenter: e.target.value})}
                      placeholder={t.phCenter}
                      className="bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-text-3">{t.result}</label>
                    <select
                      value={editTest.result || 'SCHEDULED'}
                      onChange={(e) => setEditTest({...editTest, result: e.target.value as any})}
                      className="bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="SCHEDULED">{t.scheduled}</option>
                      <option value="PASS">{t.passStr}</option>
                      <option value="FAIL">{t.failStr}</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-text-3">{t.notes}</label>
                  <textarea 
                    value={editTest.notes || ''}
                    onChange={(e) => setEditTest({...editTest, notes: e.target.value})}
                    placeholder={t.phNotes}
                    className="bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary min-h-[80px]"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full mt-2 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? t.saving : t.saveExam}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
