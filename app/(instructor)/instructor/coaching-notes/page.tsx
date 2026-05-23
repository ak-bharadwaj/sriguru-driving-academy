"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Search, Calendar, User, Clock, X } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Coaching Notes',
    pageSubtitle: 'Per-session notes for your students.',
    addNoteBtn: 'Add Note',
    searchPlaceholder: 'Search notes or students...',
    noNotesTitle: 'No Notes Found',
    noNotesDesc: "You haven't recorded any coaching notes yet.",
    modalTitle: 'Add Coaching Note',
    selectSessionLabel: 'Select Session (Optional)',
    latestSessionOpt: '-- Latest Session --',
    noteContentLabel: 'Note Content',
    notePlaceholder: 'E.g., Needs more practice with parallel parking...',
    savingBtn: 'Saving...',
    saveBtn: 'Save Note',
  },
  HI: {
    pageTitle: 'कोचिंग नोट्स',
    pageSubtitle: 'आपके छात्रों के लिए प्रति-सत्र नोट्स।',
    addNoteBtn: 'नोट जोड़ें',
    searchPlaceholder: 'नोट्स या छात्र खोजें...',
    noNotesTitle: 'कोई नोट्स नहीं मिले',
    noNotesDesc: "आपने अभी तक कोई कोचिंग नोट दर्ज नहीं किया है।",
    modalTitle: 'कोचिंग नोट जोड़ें',
    selectSessionLabel: 'सत्र चुनें (वैकल्पिक)',
    latestSessionOpt: '-- नवीनतम सत्र --',
    noteContentLabel: 'नोट सामग्री',
    notePlaceholder: 'उदाहरण: समानांतर पार्किंग के साथ अधिक अभ्यास की आवश्यकता है...',
    savingBtn: 'सहेजा जा रहा है...',
    saveBtn: 'नोट सहेजें',
  },
  TE: {
    pageTitle: 'కోచింగ్ నోట్స్',
    pageSubtitle: 'మీ విద్యార్థుల కోసం ప్రతి సెషన్ నోట్స్.',
    addNoteBtn: 'గమనికను జోడించండి',
    searchPlaceholder: 'గమనికలు లేదా విద్యార్థులను శోధించండి...',
    noNotesTitle: 'గమనికలు కనుగొనబడలేదు',
    noNotesDesc: "మీరు ఇంకా ఎలాంటి కోచింగ్ నోట్స్‌ను నమోదు చేయలేదు.",
    modalTitle: 'కోచింగ్ నోట్‌ను జోడించండి',
    selectSessionLabel: 'సెషన్‌ని ఎంచుకోండి (ఐచ్ఛికం)',
    latestSessionOpt: '-- తాజా సెషన్ --',
    noteContentLabel: 'గమనిక కంటెంట్',
    notePlaceholder: 'ఉదాహరణకు: పారలల్ పార్కింగ్‌తో మరింత సాధన అవసరం...',
    savingBtn: 'సేవ్ చేయబడుతోంది...',
    saveBtn: 'గమనికను సేవ్ చేయండి',
  }
}


interface CoachingNote {
  id: string
  note: string
  createdAt: string
  sessionId: string
  session: {
    scheduledAt: string
    lessonType: string
  }
  student: {
    name: string
  }
}

interface RecentSession {
  id: string
  lessonType: string
  scheduledAt: string
  studentName: string
}

export default function CoachingNotesPage() {
  const [notes, setNotes] = useState<CoachingNote[]>([])
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newNote, setNewNote] = useState({ sessionId: '', note: '' })
  const [submitting, setSubmitting] = useState(false)

  const { language } = useLanguageStore()
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN


  const fetchData = async () => {
    try {
      const [notesRes, sessionsRes] = await Promise.all([
        fetch('/api/instructor/coaching-notes'),
        fetch('/api/instructor/sessions/recent')
      ])
      if (notesRes.ok) {
        const data = await notesRes.json()
        setNotes(data.notes || [])
      }
      if (sessionsRes.ok) {
        const data = await sessionsRes.json()
        setRecentSessions(data || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/instructor/coaching-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      })
      if (res.ok) {
        await fetchData()
        setIsModalOpen(false)
        setNewNote({ sessionId: '', note: '' })
      }
    } catch (e) {
      console.error(e)
    }
    setSubmitting(false)
  }

  const filteredNotes = notes.filter(n => 
    n.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-4 sm:p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2">{t.pageTitle}</h1>
            <p className="text-sm sm:text-base text-text-2">{t.pageSubtitle}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> {t.addNoteBtn}
          </button>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white placeholder-text-3"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-text-3">
            <Clock className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-20 text-center border border-border border-dashed rounded-2xl bg-surface/50">
            <MessageSquare className="w-12 h-12 text-text-3 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-text-1 mb-2">{t.noNotesTitle}</h3>
            <p className="text-text-3">{t.noNotesDesc}</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 pl-6 md:pl-8 flex flex-col gap-8">
            {filteredNotes.map((note, idx) => (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="absolute -left-[35px] md:-left-[43px] top-5 w-4 h-4 rounded-full bg-primary ring-4 ring-void border-2 border-primary/30 group-hover:scale-125 transition-transform" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-void border border-border flex items-center justify-center font-display font-bold text-primary text-xl">
                      {note.student.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white block text-lg">{note.student.name}</span>
                      <span className="text-sm text-text-2 font-data-mono flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" /> {new Date(note.session.scheduledAt).toLocaleDateString()} • {note.session.lessonType}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-text-2 font-medium">{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                
                <p className="text-text-2 leading-relaxed whitespace-pre-wrap">{note.note}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-5 border-b border-border flex justify-between items-center bg-void/50">
                <h3 className="font-bold text-lg text-white">{t.modalTitle}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-3 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-2 uppercase tracking-wider">{t.selectSessionLabel}</label>
                  <select 
                    className="bg-void border border-border rounded-xl px-4 py-3 text-base font-medium focus:border-primary outline-none text-white w-full"
                    value={newNote.sessionId} 
                    onChange={e => setNewNote({...newNote, sessionId: e.target.value})}
                  >
                    <option value="">{t.latestSessionOpt}</option>
                    {recentSessions.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.studentName} - {new Date(s.scheduledAt).toLocaleDateString()} ({s.lessonType})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-2 uppercase tracking-wider">{t.noteContentLabel}</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder={t.notePlaceholder}
                    className="bg-void border border-border rounded-xl px-4 py-3 text-base focus:border-primary outline-none text-white w-full resize-none"
                    value={newNote.note} 
                    onChange={e => setNewNote({...newNote, note: e.target.value})}
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? t.savingBtn : t.saveBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
