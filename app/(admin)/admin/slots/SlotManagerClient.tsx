"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Clock, Shield, AlertCircle, Trash2, Plus, Sparkles, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    title: ' Sri Guru Custom Scheduler',
    desc: 'Configure custom calendar dates and time ranges for your student roster',
    createBtn: '+ Create Custom Time Slot',
    loading: 'LOADING MASTER OPERATIONS CALENDAR...',
    time: 'Time Range',
    dateLabel: 'Roster Date',
    instructor: 'Instructor',
    capacity: 'Roster Capacity',
    status: 'Roster Status',
    booked: 'Booked',
    avail: 'Avail',
    active: 'ACTIVE (Accepting Web Bookings)',
    closed: 'CLOSED (Hidden / Legacy Only)',
    cancel: 'Cancel',
    saveConfig: 'Publish Time Slot',
    saving: 'Publishing...',
    enrolled: 'Enrolled Students (Click to reveal profile)',
    noWebStudents: 'No web students assigned to this slot yet.',
    slotActiveToast: 'Time slot published successfully!',
    slotUpdatedToast: 'Time slot configuration updated!',
    failedSave: 'Failed to save time slot',
    error: 'An error occurred',
    deleteBtn: 'Delete Slot',
    deleteSuccess: 'Slot deleted successfully!',
    noSlots: 'No custom slots configured. Click the button above to publish your first time slot!'
  },
  HI: {
    title: 'श्री गुरु कस्टम शेड्यूलर',
    desc: 'अपने छात्र रोस्टर के लिए कस्टम कैलेंडर तिथियां और समय सीमाएं कॉन्फ़िगर करें',
    createBtn: '+ कस्टम समय स्लॉट बनाएं',
    loading: 'मास्टर ऑपरेशंस कैलेंडर लोड हो रहा है...',
    time: 'समय सीमा',
    dateLabel: 'रोस्टर तिथि',
    instructor: 'प्रशिक्षक',
    capacity: 'रोस्टर क्षमता',
    status: 'रोस्टर स्थिति',
    booked: 'बुक किया गया',
    avail: 'उपलब्ध',
    active: 'सक्रिय (वेब बुकिंग स्वीकार कर रहा है)',
    closed: 'बंद (छिपा हुआ / केवल लीगेसी)',
    cancel: 'रद्द करें',
    saveConfig: 'समय स्लॉट प्रकाशित करें',
    saving: 'प्रकाशित किया जा रहा है...',
    enrolled: 'नामांकित छात्र (विवरण के लिए क्लिक करें)',
    noWebStudents: 'इस स्लॉट के लिए अभी तक कोई वेब छात्र असाइन नहीं हुआ है।',
    slotActiveToast: 'समय स्लॉट सफलतापूर्वक प्रकाशित हुआ!',
    slotUpdatedToast: 'समय स्लॉट कॉन्फ़िगरेशन अपडेट हो गया!',
    failedSave: 'स्लॉट सहेजने में विफल',
    error: 'एक त्रुटि हुई',
    deleteBtn: 'स्लॉट हटाएं',
    deleteSuccess: 'स्लॉट सफलतापूर्वक हटा दिया गया!',
    noSlots: 'कोई कस्टम स्लॉट कॉन्फ़िगर नहीं किया गया है। अपना पहला समय स्लॉट प्रकाशित करने के लिए ऊपर दिए गए बटन पर क्लिक करें!'
  },
  TE: {
    title: 'శ్రీ గురు కస్టమ్ షెడ్యూలర్',
    desc: 'మీ విద్యార్థి రోస్టర్ కోసం అనుకూల క్యాలెండర్ తేదీలు మరియు సమయ శ్రేణులను కాన్ఫిగర్ చేయండి',
    createBtn: '+ కస్టమ్ టైమ్ స్లాట్ సృష్టించండి',
    loading: 'మాస్టర్ ఆపరేషన్స్ క్యాలెండర్ లోడ్ అవుతోంది...',
    time: 'సమయ శ్రేణి',
    dateLabel: 'రోస్టర్ తేదీ',
    instructor: 'ఇన్‌స్ట్రక్టర్',
    capacity: 'రోస్టర్ సామర్థ్యం',
    status: 'రోస్టర్ స్థితి',
    booked: 'బుక్ చేయబడింది',
    avail: 'అందుబాటులో',
    active: 'యాక్టివ్ (వెబ్ బుకింగ్‌లను అంగీకరిస్తుంది)',
    closed: 'మూసివేయబడింది (దాచబడింది / లెగసీ మాత్రమే)',
    cancel: 'రద్దు చేయి',
    saveConfig: 'టైమ్ స్లాట్‌ను ప్రచురించు',
    saving: 'ప్రచురిస్తోంది...',
    enrolled: 'నమోదైన విద్యార్థులు (వివరాల కోసం క్లిక్ చేయండి)',
    noWebStudents: 'ఈ స్లాట్ కోసం ఇంకా వెబ్ విద్యార్థులు కేటాయించబడలేదు.',
    slotActiveToast: 'టైమ్ స్లాట్ విజయవంతంగా ప్రచురించబడింది!',
    slotUpdatedToast: 'టైమ్ స్లాట్ కాన్ఫిగరేషన్ నవీకరించబడింది!',
    failedSave: 'స్లాట్‌ను సేవ్ చేయడం విఫలమైంది',
    error: 'ఒక లోపం ఏర్పడింది',
    deleteBtn: 'స్లాట్‌ను తొలగించు',
    deleteSuccess: 'స్లాట్ విజయవంతంగా తొలగించబడింది!',
    noSlots: 'అనుకూల స్లాట్‌లు ఏవీ కాన్ఫిగర్ చేయబడలేదు. మీ మొదటి టైమ్ స్లాట్‌ను ప్రచురించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి!'
  }
}

interface Slot {
  id: string
  dayOfWeek: string // Storing YYYY-MM-DD custom date
  time: string      // Storing custom time range (e.g. "09:30 AM - 11:00 AM")
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
  instructorId: string
  instructorName?: string
}

interface BookingUser {
  id: string
  name: string
  phone: string
  email: string
  regNo?: string
  trainingType?: string
  status?: string
  enrolledAt?: string
  confidenceScore?: number | string
  feeStatus?: string
}

export default function SlotManagerClient() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([])
  
  // Custom Slot Creation Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: 5,
    instructorId: '',
    status: 'ACTIVE'
  })

  // Config / Inspection Modal State
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false)
  const [slotBookings, setSlotBookings] = useState<BookingUser[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<BookingUser | null>(null)

  const [modalForm, setModalForm] = useState({
    maxCapacity: 5,
    currentBooked: 0,
    status: 'ACTIVE'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Slots
  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/public/slots`)
      if (res.ok) {
        const data = await res.json()
        setSlots(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Instructors list
  const fetchInstructors = async () => {
    try {
      const res = await fetch('/api/admin/instructors')
      if (res.ok) {
        const data = await res.json()
        setInstructors(data)
        if (data.length > 0) {
          setCreateForm(prev => ({ ...prev, instructorId: data[0].id }))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchSlots()
    fetchInstructors()
  }, [])

  // Handle open config/inspect modal
  const handleInspectSlot = async (slot: Slot) => {
    setEditingSlot(slot)
    setSlotBookings([])
    setModalForm({
      maxCapacity: slot.maxCapacity,
      currentBooked: slot.currentBooked,
      status: slot.status
    })
    setIsInspectModalOpen(true)
    
    // Fetch enrolled students
    setLoadingBookings(true)
    try {
      const res = await fetch(`/api/admin/slots/bookings?slotId=${slot.id}`)
      if (res.ok) {
        const data = await res.json()
        setSlotBookings(data.map((b: any) => ({
          id: b.id,
          name: b.name,
          phone: b.phone,
          email: b.email,
          regNo: b.student?.regNo || 'N/A',
          trainingType: b.student?.trainingType || b.trainingType || 'N/A',
          status: b.student?.status || 'N/A',
          enrolledAt: b.student?.enrolledAt ? new Date(b.student.enrolledAt).toLocaleDateString() : 'N/A',
          confidenceScore: b.student?.confidenceScore !== undefined ? b.student.confidenceScore : 'N/A',
          feeStatus: b.student?.feeStatus || 'N/A'
        })))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBookings(false)
    }
  }

  // Handle save updated configuration
  const handleUpdateConfig = async () => {
    if (!editingSlot) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/public/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSlot.id,
          maxCapacity: modalForm.maxCapacity,
          currentBooked: modalForm.currentBooked,
          status: modalForm.status
        })
      })

      if (res.ok) {
        toast.success(t.slotUpdatedToast)
        fetchSlots()
        setIsInspectModalOpen(false)
      } else {
        toast.error(t.failedSave)
      }
    } catch (e) {
      toast.error(t.error)
    } finally {
      setIsSaving(false)
    }
  }

  // Format date nicely
  const formatFriendlyDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // Format 24h string to 12h nicely
  const formatTime12h = (time24: string) => {
    if (!time24) return ''
    const [hoursStr, minutesStr] = time24.split(':')
    let hours = parseInt(hoursStr)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return `${hours}:${minutesStr} ${ampm}`
  }

  // Handle submit create custom slot
  const handleCreateSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.date || !createForm.startTime || !createForm.endTime) {
      toast.error('Please fill in Date, Start Time and End Time')
      return
    }

    const timeRange = `${formatTime12h(createForm.startTime)} - ${formatTime12h(createForm.endTime)}`
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/public/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: createForm.date, // Store date here
          time: timeRange,            // Store custom time range here
          maxCapacity: createForm.maxCapacity,
          instructorId: createForm.instructorId,
          status: createForm.status,
          currentBooked: 0
        })
      })

      if (res.ok) {
        toast.success(t.slotActiveToast)
        fetchSlots()
        setIsCreateModalOpen(false)
        setCreateForm(prev => ({
          ...prev,
          date: '',
          startTime: '',
          endTime: '',
          maxCapacity: 5
        }))
      } else {
        const errData = await res.json()
        toast.error(errData.error || t.failedSave)
      }
    } catch (e) {
      toast.error(t.error)
    } finally {
      setIsSaving(false)
    }
  }

  // Group slots by date string YYYY-MM-DD
  const groupSlotsByDate = () => {
    const map: Record<string, Slot[]> = {}
    slots.forEach(s => {
      if (!map[s.dayOfWeek]) map[s.dayOfWeek] = []
      map[s.dayOfWeek].push(s)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }

  const groupedSlots = groupSlotsByDate()

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Action Roster HUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[rgb(var(--color-surface))] p-6 rounded-3xl border border-[rgb(var(--color-border))] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))] tracking-tight">{t.title}</h2>
          <p className="text-xs text-[rgb(var(--color-text-3))] font-mono mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
            {t.desc}
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.createBtn}
        </button>
      </div>

      {/* Calendar Slots timeline workspace */}
      {loading ? (
        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl flex flex-col items-center justify-center py-24 gap-3">
          <Clock className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin" />
          <span className="text-xs font-mono text-[rgb(var(--color-text-3))] uppercase tracking-widest">{t.loading}</span>
        </div>
      ) : groupedSlots.length === 0 ? (
        <div className="bg-[rgb(var(--color-surface))] border border-dashed border-[rgb(var(--color-border))] rounded-3xl flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
          <Calendar className="w-12 h-12 text-[rgb(var(--color-text-3))]/50" />
          <div className="max-w-sm flex flex-col gap-1.5">
            <span className="text-xs font-mono text-[rgb(var(--color-text-3))] uppercase tracking-wide">No active roster scheduled</span>
            <p className="text-sm text-[rgb(var(--color-text-2))]">{t.noSlots}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groupedSlots.map(([dateKey, dateSlots]) => (
            <div key={dateKey} className="flex flex-col gap-4">
              {/* Date Header Badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase bg-[rgb(var(--color-void))]/60 text-[rgb(var(--color-text-2))] border border-[rgb(var(--color-border))] px-4 py-2 rounded-xl shadow-sm">
                  {formatFriendlyDate(dateKey)}
                </span>
                <div className="flex-1 h-px bg-[rgb(var(--color-border))]/50" />
              </div>

              {/* Time Slots Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dateSlots.map(slot => {
                  const isClosed = slot.status === 'CLOSED'
                  const isFull = slot.currentBooked >= slot.maxCapacity
                  
                  // Stylings in vibrant colors
                  let cardStyle = 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500 text-emerald-400'
                  let badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  let statusText = 'ACTIVE'

                  if (isClosed) {
                    cardStyle = 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500 text-rose-400'
                    badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    statusText = 'CLOSED'
                  } else if (isFull) {
                    cardStyle = 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500 text-amber-400'
                    badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    statusText = 'FULL'
                  }

                  return (
                    <div 
                      key={slot.id}
                      onClick={() => handleInspectSlot(slot)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col gap-4 ${cardStyle}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono uppercase opacity-75 tracking-wider">Scheduled hours</span>
                          <h3 className="text-sm font-bold tracking-tight">{slot.time}</h3>
                        </div>
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeStyle}`}>
                          {statusText}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-[rgb(var(--color-void))]/60 border border-[rgb(var(--color-border))]/20 p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-mono uppercase text-[rgb(var(--color-text-3))]">Roster Coach</span>
                          <span className="text-xs font-bold text-[rgb(var(--color-text-1))] mt-0.5 truncate max-w-[120px]">
                            {slot.instructorName || 'Roster Instructor'}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-mono uppercase text-[rgb(var(--color-text-3))]">Occupancy</span>
                          <span className="text-xs font-bold font-mono text-[rgb(var(--color-text-1))] mt-0.5">
                            {slot.currentBooked} / {slot.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CUSTOM TIME SLOT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[28px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col">
            
            <form onSubmit={handleCreateSlotSubmit}>
              <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">Create Custom Time Slot</h3>
                  <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-0.5 uppercase tracking-wider">
                    Google Calendar Type custom scheduling
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-[rgb(var(--color-text-3))]" />
              </div>

              <div className="p-6 flex flex-col gap-4">
                
                {/* Date Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">{t.dateLabel}</label>
                  <input 
                    type="date"
                    required
                    value={createForm.date}
                    onChange={(e) => setCreateForm({...createForm, date: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  />
                </div>

                {/* Custom Time inputs range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">Start Time</label>
                    <input 
                      type="time"
                      required
                      value={createForm.startTime}
                      onChange={(e) => setCreateForm({...createForm, startTime: e.target.value})}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">End Time</label>
                    <input 
                      type="time"
                      required
                      value={createForm.endTime}
                      onChange={(e) => setCreateForm({...createForm, endTime: e.target.value})}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">{t.capacity}</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={createForm.maxCapacity}
                    onChange={(e) => setCreateForm({...createForm, maxCapacity: parseInt(e.target.value) || 1})}
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  />
                </div>

                {/* Instructor dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">{t.instructor}</label>
                  <select
                    value={createForm.instructorId}
                    onChange={(e) => setCreateForm({...createForm, instructorId: e.target.value})}
                    required
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  >
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.id}>{ins.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">{t.status}</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  >
                    <option value="ACTIVE">{t.active}</option>
                    <option value="CLOSED">{t.closed}</option>
                  </select>
                </div>

              </div>

              <div className="p-5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] transition"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50"
                >
                  {isSaving ? t.saving : t.saveConfig}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* INSPECT & RE-CONFIGURE TIME SLOT MODAL */}
      {isInspectModalOpen && editingSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[28px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">Configure Operational Slot</h3>
                <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-1 uppercase tracking-wider">
                  {formatFriendlyDate(editingSlot.dayOfWeek)} @ {editingSlot.time}
                </p>
              </div>
              <Shield className="w-5 h-5 text-[rgb(var(--color-text-3))]" />
            </div>

            <div className="p-6 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">Total Max Capacity</label>
                <input 
                  type="number"
                  min="1"
                  value={modalForm.maxCapacity}
                  onChange={(e) => setModalForm({...modalForm, maxCapacity: parseInt(e.target.value) || 1})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider flex items-center gap-1">
                  Offline Booked Blocking
                </label>
                <input 
                  type="number"
                  min="0"
                  value={modalForm.currentBooked}
                  onChange={(e) => setModalForm({...modalForm, currentBooked: parseInt(e.target.value) || 0})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">{t.status}</label>
                <select
                  value={modalForm.status}
                  onChange={(e) => setModalForm({...modalForm, status: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                >
                  <option value="ACTIVE">{t.active}</option>
                  <option value="CLOSED">{t.closed}</option>
                </select>
              </div>

            </div>

            <div className="p-5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/30 flex justify-end gap-3">
              <button 
                onClick={() => setIsInspectModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] transition"
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleUpdateConfig}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50"
              >
                {isSaving ? t.saving : 'Save Configuration'}
              </button>
            </div>

            {/* Enrolled Students Card Section */}
            <div className="p-6 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
              <h4 className="text-sm font-bold text-[rgb(var(--color-text-1))] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                {t.enrolled}
              </h4>
              
              {loadingBookings ? (
                <div className="text-xs font-mono text-[rgb(var(--color-text-3))]">{t.loadingStudents}</div>
              ) : slotBookings.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin">
                  {slotBookings.map(student => (
                    <div 
                      key={student.id} 
                      onClick={() => setSelectedStudentDetails(student)}
                      className="flex justify-between items-center bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] p-3 rounded-xl cursor-pointer hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-void))]/80 transition-all group animate-fadeIn"
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[rgb(var(--color-text-1))] group-hover:text-[rgb(var(--color-primary))]">{student.name}</span>
                          <span className="text-[9px] font-mono font-bold bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] px-1.5 py-0.5 rounded border border-[rgb(var(--color-primary))]/30">
                            {student.regNo || 'NO REG'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono mt-0.5">{student.email}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[rgb(var(--color-text-2))] bg-[rgb(var(--color-surface))] px-2 py-1 rounded-md border border-[rgb(var(--color-border))] group-hover:border-[rgb(var(--color-primary))]/20">
                        {student.phone}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] font-mono text-[rgb(var(--color-text-3))] bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] p-4 rounded-xl text-center">
                  {t.noWebStudents}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* STUDENT PROFILE POPUP MODAL */}
      {selectedStudentDetails && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-sm rounded-[24px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/60 flex justify-between items-center mt-1.5">
              <div>
                <h3 className="text-md font-bold text-[rgb(var(--color-text-1))] font-display">Student Roster Profile</h3>
                <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-0.5 uppercase tracking-wider">
                  Registration details
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] px-2 py-1 rounded-md border border-[rgb(var(--color-primary))]/30">
                {selectedStudentDetails.regNo || 'NO REG'}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4 text-left">
              <div className="flex flex-col bg-[rgb(var(--color-void))] p-4 rounded-2xl border border-[rgb(var(--color-border))] gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Student Name</span>
                  <span className="text-sm font-bold text-[rgb(var(--color-text-1))] mt-0.5">{selectedStudentDetails.name}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Email Address</span>
                  <span className="text-xs font-mono text-[rgb(var(--color-text-2))] mt-0.5">{selectedStudentDetails.email}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Contact Number</span>
                  <span className="text-xs font-mono text-[rgb(var(--color-text-2))] mt-0.5">{selectedStudentDetails.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[rgb(var(--color-void))] p-3.5 rounded-xl border border-[rgb(var(--color-border))] flex flex-col">
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Course Plan</span>
                  <span className="text-[11px] font-bold text-[rgb(var(--color-primary))] uppercase mt-1">
                    {String(selectedStudentDetails.trainingType).replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-[rgb(var(--color-void))] p-3.5 rounded-xl border border-[rgb(var(--color-border))] flex flex-col">
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Fee Status</span>
                  <span className={`text-[10px] font-mono font-bold uppercase mt-1 ${
                    selectedStudentDetails.feeStatus === 'PAID' ? 'text-emerald-400' : 'text-[rgb(var(--color-accent))]'
                  }`}>
                    {selectedStudentDetails.feeStatus || 'PENDING'}
                  </span>
                </div>

                <div className="bg-[rgb(var(--color-void))] p-3.5 rounded-xl border border-[rgb(var(--color-border))] flex flex-col">
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Enrollment</span>
                  <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-text-2))] mt-1">
                    {selectedStudentDetails.enrolledAt || 'N/A'}
                  </span>
                </div>

                <div className="bg-[rgb(var(--color-void))] p-3.5 rounded-xl border border-[rgb(var(--color-border))] flex flex-col">
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Status Roster</span>
                  <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-text-2))] mt-1 uppercase flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedStudentDetails.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/30 flex justify-end">
              <button 
                onClick={() => setSelectedStudentDetails(null)}
                className="w-full px-5 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/90 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
