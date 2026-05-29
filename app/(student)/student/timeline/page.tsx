"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Edit3, X, CheckCircle, Clock, FileWarning } from 'lucide-react'

interface DrivingTest {
  id: string
  testDate: string
  testCenter: string | null
  result: 'SCHEDULED' | 'PASS' | 'FAIL'
  attemptNo: number
  notes: string | null
}

export default function StudentTimelinePage() {
  const [tests, setTests] = useState<DrivingTest[]>([])
  const [loading, setLoading] = useState(true)
  
  const [editTest, setEditTest] = useState<DrivingTest | null>(null)
  const [newDate, setNewDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/student/timeline')
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

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTest || !newDate) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/student/timeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: editTest.id, newDate })
      })
      if (res.ok) {
        await fetchTests()
        setEditTest(null)
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to reschedule')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <span className="text-xs font-mono tracking-widest uppercase text-accent">Exam Tracking</span>
          <h1 className="text-4xl font-display font-bold mt-2 mb-4 text-white">Your Test Timeline</h1>
          <p className="text-text-2 text-sm max-w-lg">Track your upcoming driving tests, theoretical exams, and previous attempts. You can reschedule upcoming tests if needed.</p>
        </header>

        {loading ? (
          <div className="text-center text-text-3 py-20">Loading timeline...</div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 border border-border border-dashed rounded-2xl bg-surface/50">
            <Calendar className="w-10 h-10 text-text-3 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold">No Tests Scheduled</h3>
            <p className="text-sm text-text-3 mt-2">You don't have any RTO or Driving tests scheduled yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-border/60 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
            {tests.map((test, idx) => {
              const isPast = new Date(test.testDate) < new Date() && test.result !== 'SCHEDULED'
              const dateObj = new Date(test.testDate)
              
              return (
                <motion.div 
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[35px] md:-left-[51px] w-6 h-6 rounded-full border-4 border-void flex items-center justify-center ${
                    test.result === 'PASS' ? 'bg-success' : 
                    test.result === 'FAIL' ? 'bg-danger' : 
                    'bg-primary'
                  }`}>
                    {test.result === 'PASS' && <CheckCircle className="w-3 h-3 text-white" />}
                    {test.result === 'FAIL' && <FileWarning className="w-3 h-3 text-white" />}
                    {test.result === 'SCHEDULED' && <Clock className="w-3 h-3 text-white" />}
                  </div>

                  <div className={`bg-surface border ${
                    test.result === 'SCHEDULED' ? 'border-primary/50' : 'border-border'
                  } rounded-2xl p-6 shadow-lg`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            test.result === 'PASS' ? 'bg-success/20 text-success' :
                            test.result === 'FAIL' ? 'bg-danger/20 text-danger' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {test.result}
                          </span>
                          <span className="text-xs text-text-3 font-mono">Attempt #{test.attemptNo}</span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-white">Driving Test Exam</h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-accent">{dateObj.toLocaleDateString()}</div>
                        <div className="text-sm text-text-3">{dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-2 mb-4 bg-void/50 p-3 rounded-lg border border-border/50">
                      <MapPin className="w-4 h-4 text-text-3" />
                      <span>{test.testCenter || 'RTO Center Not Assigned'}</span>
                    </div>

                    {test.notes && (
                      <p className="text-sm text-text-3 mb-4 italic">"{test.notes}"</p>
                    )}

                    {test.result === 'SCHEDULED' && (
                      <button 
                        onClick={() => {
                          setEditTest(test)
                          setNewDate(new Date(test.testDate).toISOString().slice(0, 16))
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Reschedule Test
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {editTest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-[24px] p-8 max-w-md w-full relative"
            >
              <button 
                onClick={() => setEditTest(null)}
                className="absolute top-4 right-4 text-text-3 hover:text-text-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold font-display mb-2">Reschedule Exam</h2>
              <p className="text-sm text-text-2 mb-6">Select a new date and time for your driving test.</p>

              <form onSubmit={handleReschedule} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-text-3">New Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-void border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    style={{ colorScheme: 'dark' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
