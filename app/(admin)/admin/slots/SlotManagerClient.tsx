"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Clock, Shield, AlertCircle, Trash2, Plus, Sparkles, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    title: ' Sri Guru Scheduler',
    desc: 'Set dates and times for student classes',
    createBtn: '+ Add Class Slot',
    loading: 'LOADING CALENDAR...',
    time: 'Time Range',
    dateLabel: 'Date',
    instructor: 'Instructor / Coach',
    capacity: 'Max Students',
    status: 'Status',
    booked: 'Booked',
    avail: 'Available',
    active: 'Open (Students can book online)',
    closed: 'Closed (No online bookings)',
    cancel: 'Cancel',
    saveConfig: 'Save and Add Slots',
    saving: 'Adding...',
    enrolled: 'Enrolled Students (Click for details)',
    noWebStudents: 'No students have booked this slot yet.',
    slotActiveToast: 'Time slot published successfully!',
    slotUpdatedToast: 'Time slot updated successfully!',
    failedSave: 'Failed to save time slot',
    error: 'An error occurred',
    deleteBtn: 'Delete Slot',
    deleteSuccess: 'Slot deleted successfully!',
    noSlots: 'No time slots set up yet. Click the button above to add your first time slot!',
    loadingStudents: 'Loading student list...'
  },
  HI: {
    title: 'श्री गुरु कस्टम शेड्यूलर',
    desc: 'छात्र कक्षाओं के लिए तिथियां और समय सेट करें',
    createBtn: '+ समय स्लॉट बनाएं',
    loading: 'कैलेंडर लोड हो रहा है...',
    time: 'समय सीमा',
    dateLabel: 'तिथि',
    instructor: 'प्रशिक्षक / कोच',
    capacity: 'क्षमता (अधिकतम छात्र)',
    status: 'स्थिति',
    booked: 'बुक किया गया',
    avail: 'उपलब्ध',
    active: 'सक्रिय (छात्र ऑनलाइन बुक कर सकते हैं)',
    closed: 'बंद (कोई ऑनलाइन बुकिंग नहीं)',
    cancel: 'रद्द करें',
    saveConfig: 'समय स्लॉट प्रकाशित करें',
    saving: 'प्रकाशित किया जा रहा है...',
    enrolled: 'बुक किए गए छात्र (विवरण के लिए क्लिक करें)',
    noWebStudents: 'इस स्लॉट के लिए अभी तक कोई बुकिंग नहीं हुई है।',
    slotActiveToast: 'समय स्लॉट सफलतापूर्वक प्रकाशित हुआ!',
    slotUpdatedToast: 'समय स्लॉट अपडेट हो गया!',
    failedSave: 'स्लॉट सहेजने में विफल',
    error: 'एक त्रुटि हुई',
    deleteBtn: 'स्लॉट हटाएं',
    deleteSuccess: 'स्लॉट सफलतापूर्वक हटा दिया गया!',
    noSlots: 'अभी तक कोई समय स्लॉट सेट नहीं किया गया है। अपना पहला समय स्लॉट जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें!',
    loadingStudents: 'छात्र सूची लोड हो रही है...'
  },
  TE: {
    title: 'శ్రీ గురు కస్టమ్ షెడ్యూలర్',
    desc: 'విద్యార్థి తరగతుల కోసం తేదీలు మరియు సమయాలను సెట్ చేయండి',
    createBtn: '+ టైమ్ స్లాట్ సృష్టించండి',
    loading: 'క్యాలెండర్ లోడ్ అవుతోంది...',
    time: 'సమయ శ్రేణి',
    dateLabel: 'తేదీ',
    instructor: 'ఇన్‌స్ట్రక్టర్ / కోచ్',
    capacity: 'సామర్థ్యం (గరిష్ట విద్యార్థులు)',
    status: 'స్థితి',
    booked: 'బుక్ చేయబడింది',
    avail: 'అందుబాటులో ఉంది',
    active: 'యాక్టివ్ (విద్యార్థులు ఆన్‌లైన్‌లో బుక్ చేసుకోవచ్చు)',
    closed: 'మూసివేయబడింది (ఆన్‌లైన్ బుకింగ్‌లు లేవు)',
    cancel: 'రద్దు చేయి',
    saveConfig: 'టైమ్ స్లాట్‌ను ప్రచురించు',
    saving: 'ప్రచురిస్తోంది...',
    enrolled: 'బుక్ అయిన విద్యార్థులు (వివరాల కోసం క్లిక్ చేయండి)',
    noWebStudents: 'ఈ స్లాట్ కోసం ఇంకా బుకింగ్‌లు లేవు.',
    slotActiveToast: 'టైమ్ స్లాట్ విజయవంతంగా ప్రచురించబడింది!',
    slotUpdatedToast: 'టైమ్ స్లాట్ నవీకరించబడింది!',
    failedSave: 'స్లాట్‌ను సేవ్ చేయడం విఫలమైంది',
    error: 'ఒక లోపం ఏర్పడింది',
    deleteBtn: 'స్లాట్‌ను తొలగించు',
    deleteSuccess: 'స్లాట్ విజయవంతంగా తొలగించబడింది!',
    noSlots: 'ఇంకా టైమ్ స్లాట్‌లు సెట్ చేయబడలేదు. మొదటి టైమ్ స్లాట్‌ను జోడించడానికి పైన ఉన్న బటన్‌ను క్లిక్ చేయండి!',
    loadingStudents: 'విద్యార్థుల జాబితా లోడ్ అవుతోంది...'
  }
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface Slot {
  id: string
  dayOfWeek: string
  time: string
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

  // Monthly Calendar States
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  
  const monthIndex = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1))
  }
  
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

  // Google dev style batch states
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [batchForm, setBatchForm] = useState({
    startDate: '',
    endDate: '',
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    times: ['08:00 AM - 09:30 AM', '04:00 PM - 05:30 PM'],
    maxCapacity: 5,
    instructorId: '',
    status: 'ACTIVE'
  })

  const [customTimeInput, setCustomTimeInput] = useState({ start: '', end: '' })

  const [showManualRegister, setShowManualRegister] = useState(false)
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    phone: '',
    trainingType: 'course-beginner',
    password: 'sriguru123'
  })
  const [manualSubmitting, setManualSubmitting] = useState(false)

  const handleOpenCreateModal = (dateInput?: any) => {
    const targetDate = typeof dateInput === 'string' && dateInput ? dateInput : selectedDateStr
    setCreateForm(prev => ({
      ...prev,
      date: targetDate
    }))
    setBatchForm(prev => ({
      ...prev,
      startDate: targetDate,
      endDate: (() => {
        try {
          const d = new Date(targetDate)
          d.setDate(d.getDate() + 7)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        } catch {
          return targetDate
        }
      })()
    }))
    setIsCreateModalOpen(true)
  }

  const handlePurgeDay = async (dateStr: string) => {
    if (!confirm(`Are you sure you want to delete all empty slots on ${formatFriendlyDate(dateStr)}?`)) {
      return
    }
    try {
      const res = await fetch(`/api/public/slots?dayOfWeek=${dateStr}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Slots for day purged successfully!')
        fetchSlots()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to purge slots.')
      }
    } catch {
      toast.error('An error occurred while purging slots.')
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this specific custom slot? This will fail if there are active student bookings.')) {
      return
    }
    try {
      const res = await fetch(`/api/public/slots?id=${slotId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Slot deleted successfully!')
        fetchSlots()
        setIsInspectModalOpen(false)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to delete slot.')
      }
    } catch {
      toast.error('An error occurred while deleting the slot.')
    }
  }

  const handleManualRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSlot) return
    if (!manualForm.name || !manualForm.email || !manualForm.phone) {
      toast.error('All student details are mandatory')
      return
    }
    setManualSubmitting(true)
    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualForm.name,
          phone: manualForm.phone,
          email: manualForm.email,
          trainingType: manualForm.trainingType,
          slotId: editingSlot.id,
          password: manualForm.password
        })
      })

      if (res.ok) {
        toast.success('Walk-in student enrolled successfully!')
        setManualForm({
          name: '',
          email: '',
          phone: '',
          trainingType: 'course-beginner',
          password: 'sriguru123'
        })
        setShowManualRegister(false)
        fetchSlots()
        
        // Re-inspect the slot with updated details
        handleInspectSlot({
          ...editingSlot,
          currentBooked: editingSlot.currentBooked + 1
        })
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to enroll student.')
      }
    } catch {
      toast.error('An error occurred during enrollment.')
    } finally {
      setManualSubmitting(false)
    }
  }

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
          setBatchForm(prev => ({ ...prev, instructorId: data[0].id }))
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
    
    if (isBatchMode) {
      if (!batchForm.startDate || !batchForm.endDate || batchForm.weekdays.length === 0 || batchForm.times.length === 0) {
        toast.error('Please configure Date Range, Weekdays, and Time Slot(s) for the batch.')
        return
      }
      setIsSaving(true)
      try {
        const res = await fetch('/api/public/slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isBatch: true,
            startDate: batchForm.startDate,
            endDate: batchForm.endDate,
            weekdays: batchForm.weekdays,
            times: batchForm.times,
            maxCapacity: batchForm.maxCapacity,
            instructorId: batchForm.instructorId || createForm.instructorId,
            status: batchForm.status
          })
        })

        if (res.ok) {
          const data = await res.json()
          toast.success(`Successfully published ${data.count} custom batch slots!`)
          fetchSlots()
          setIsCreateModalOpen(false)
        } else {
          const errData = await res.json()
          toast.error(errData.error || t.failedSave)
        }
      } catch (e) {
        toast.error(t.error)
      } finally {
        setIsSaving(false)
      }
      return
    }

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[rgb(var(--color-surface))] p-6 rounded-3xl border border-[rgb(var(--color-border))] shadow-sm animate-fadeIn">
        <div className="text-left">
          <h2 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))] tracking-tight">{t.title}</h2>
          <p className="text-xs text-[rgb(var(--color-text-3))] font-mono mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
            {t.desc}
          </p>
        </div>
        
        <button
          onClick={() => handleOpenCreateModal(selectedDateStr)}
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MONTHLY CALENDAR GRID (Left Column - 2/3 width) */}
          <div className="lg:col-span-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl shadow-sm flex flex-col gap-6 animate-fadeIn">
            {/* Month selector header */}
            <div className="flex justify-between items-center bg-[rgb(var(--color-void))]/60 p-4 rounded-2xl border border-[rgb(var(--color-border))]/50">
              <button 
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-1))] rounded-lg transition font-mono font-bold"
              >
                &larr;
              </button>
              <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">
                {months[monthIndex]} {year}
              </h3>
              <button 
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-1))] rounded-lg transition font-mono font-bold"
              >
                &rarr;
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-col gap-2">
              {/* Day names row */}
              <div className="grid grid-cols-7 text-center font-mono text-[10px] font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider mb-2">
                {weekdays.map(d => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const safeFormatDate = (d: Date) => {
                    const y = d.getFullYear()
                    const m = String(d.getMonth() + 1).padStart(2, '0')
                    const dy = String(d.getDate()).padStart(2, '0')
                    return `${y}-${m}-${dy}`
                  }

                  const firstDay = new Date(year, monthIndex, 1).getDay()
                  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate()
                  const cells = []

                  const prevMonthDays = new Date(year, monthIndex, 0).getDate()
                  for (let i = firstDay - 1; i >= 0; i--) {
                    const dNum = prevMonthDays - i
                    const dObj = new Date(year, monthIndex - 1, dNum)
                    cells.push({
                      dayNum: dNum,
                      isCurrentMonth: false,
                      dateStr: safeFormatDate(dObj)
                    })
                  }

                  for (let i = 1; i <= totalDaysInMonth; i++) {
                    const dObj = new Date(year, monthIndex, i)
                    cells.push({
                      dayNum: i,
                      isCurrentMonth: true,
                      dateStr: safeFormatDate(dObj)
                    })
                  }

                  const totalCells = cells.length > 35 ? 42 : 35
                  const padding = totalCells - cells.length
                  for (let i = 1; i <= padding; i++) {
                    const dObj = new Date(year, monthIndex + 1, i)
                    cells.push({
                      dayNum: i,
                      isCurrentMonth: false,
                      dateStr: safeFormatDate(dObj)
                    })
                  }

                  return cells.map((cell, idx) => {
                    const cellSlots = slots.filter(s => s.dayOfWeek === cell.dateStr)
                    const isSelected = selectedDateStr === cell.dateStr
                    
                    const todayStr = safeFormatDate(new Date())
                    const isToday = todayStr === cell.dateStr

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDateStr(cell.dateStr)}
                        className={`min-h-[105px] p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-1 text-left relative ${
                          cell.isCurrentMonth 
                            ? 'bg-[rgb(var(--color-void))]/30 text-[rgb(var(--color-text-1))]' 
                            : 'bg-transparent text-[rgb(var(--color-text-3))]/45 border-transparent cursor-default'
                        } ${
                          isSelected 
                            ? 'border-[rgb(var(--color-primary))] ring-1 ring-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 shadow-[0_0_15px_rgba(var(--color-primary),0.08)] z-10' 
                            : 'border-[rgb(var(--color-border))]/60 hover:border-[rgb(var(--color-primary))]/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isToday 
                              ? 'bg-[rgb(var(--color-primary))] text-white shadow-sm font-black' 
                              : 'text-[rgb(var(--color-text-2))]'
                          }`}>
                            {cell.dayNum}
                          </span>
                          {cellSlots.length > 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>

                        {/* Visual Occupancy Load Progress Bar */}
                        {cellSlots.length > 0 && (
                          <div className="w-full flex flex-col gap-0.5 my-1">
                            <div className="flex justify-between items-center text-[7px] font-mono font-semibold tracking-wider text-[rgb(var(--color-text-3))] leading-none">
                              <span>LOAD</span>
                              <span>
                                {Math.round(
                                  (cellSlots.reduce((acc, s) => acc + s.currentBooked, 0) / 
                                   cellSlots.reduce((acc, s) => acc + s.maxCapacity, 0)) * 100
                                )}%
                              </span>
                            </div>
                            <div className="w-full h-1 bg-[rgb(var(--color-void))]/60 rounded-full overflow-hidden border border-[rgb(var(--color-border))]/35">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  cellSlots.every(s => s.status === 'CLOSED') 
                                    ? 'bg-rose-500' 
                                    : cellSlots.reduce((acc, s) => acc + s.currentBooked, 0) >= cellSlots.reduce((acc, s) => acc + s.maxCapacity, 0) 
                                      ? 'bg-amber-500 animate-pulse' 
                                      : 'bg-emerald-400'
                                }`}
                                style={{ 
                                  width: `${Math.min(100, (cellSlots.reduce((acc, s) => acc + s.currentBooked, 0) / cellSlots.reduce((acc, s) => acc + s.maxCapacity, 0)) * 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Slots micro list inside day cell */}
                        <div className="flex flex-col gap-1 overflow-hidden">
                          {cellSlots.slice(0, 2).map(slot => {
                            const isClosed = slot.status === 'CLOSED'
                            const isFull = slot.currentBooked >= slot.maxCapacity
                            
                            let pillStyle = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            if (isClosed) pillStyle = 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            else if (isFull) pillStyle = 'bg-amber-500/15 border-amber-500/30 text-amber-400'

                            return (
                              <div 
                                key={slot.id}
                                className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border truncate ${pillStyle}`}
                              >
                                {slot.time.split(' ')[0]} ({slot.currentBooked}/{slot.maxCapacity})
                              </div>
                            )
                          })}
                          {cellSlots.length > 2 && (
                            <span className="text-[7px] font-mono text-[rgb(var(--color-text-3))] uppercase tracking-wider pl-1 font-bold">
                              +{cellSlots.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>

          {/* DAY DETAILS SIDEBAR CONSOLE (Right Column - 1/3 width) */}
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-3xl shadow-sm flex flex-col gap-6 animate-fadeIn">
            <div className="border-b border-[rgb(var(--color-border))] pb-4 flex justify-between items-start">
              <div className="text-left">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-primary))]">Selected Day Schedule</span>
                <h3 className="text-sm font-bold text-[rgb(var(--color-text-1))] mt-1">
                  {(() => {
                    try {
                      const d = new Date(selectedDateStr)
                      if (isNaN(d.getTime())) return selectedDateStr
                      return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    } catch {
                      return selectedDateStr
                    }
                  })()}
                </h3>
              </div>
              {slots.filter(s => s.dayOfWeek === selectedDateStr).length > 0 && (
                <button
                  type="button"
                  onClick={() => handlePurgeDay(selectedDateStr)}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30 rounded-lg transition"
                >
                  Purge Day
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 scrollbar-thin flex flex-col gap-4">
              {(() => {
                const daySlots = slots.filter(s => s.dayOfWeek === selectedDateStr)
                if (daySlots.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 bg-[rgb(var(--color-void))]/40 border border-dashed border-[rgb(var(--color-border))] rounded-2xl text-center gap-3">
                      <Calendar className="w-8 h-8 opacity-45 text-[rgb(var(--color-text-3))]" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-[rgb(var(--color-text-3))]">No slots scheduled</span>
                        <p className="text-[11px] text-[rgb(var(--color-text-2))] px-2">No custom times have been set up for this date yet.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleOpenCreateModal(selectedDateStr)}
                        className="mt-2 px-4 py-2 bg-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-primary))] font-bold text-xs rounded-xl transition"
                      >
                        + Add Time Slot
                      </button>
                    </div>
                  )
                }

                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-[rgb(var(--color-border))]/50 pb-2">
                      <span className="text-[9px] font-mono uppercase text-[rgb(var(--color-text-3))]">{daySlots.length} Scheduled Slots</span>
                      <button 
                        type="button"
                        onClick={() => handleOpenCreateModal(selectedDateStr)}
                        className="px-2.5 py-1 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/90 text-white font-bold text-[9px] rounded-lg transition"
                      >
                        + Add Slot
                      </button>
                    </div>
                    {daySlots.map(slot => {
                      const isClosed = slot.status === 'CLOSED'
                      const isFull = slot.currentBooked >= slot.maxCapacity
                      
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
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex flex-col gap-3 ${cardStyle}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold font-mono text-[rgb(var(--color-text-1))]">{slot.time}</span>
                            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeStyle}`}>
                              {statusText}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center bg-[rgb(var(--color-void))]/60 p-2.5 rounded-lg border border-[rgb(var(--color-border))]/10 text-left">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase">Coach</span>
                              <span className="text-[10px] font-bold text-[rgb(var(--color-text-1))] truncate max-w-[100px] mt-0.5">
                                {slot.instructorName || 'Coach'}
                              </span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase">Bookings</span>
                              <span className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-1))] mt-0.5">
                                {slot.currentBooked} / {slot.maxCapacity}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM TIME SLOT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[28px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            
            <form onSubmit={handleCreateSlotSubmit}>
              <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">Add Class Slots</h3>
                  <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-0.5 uppercase tracking-wider">
                    Add single or multiple slots to calendar
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-[rgb(var(--color-text-3))]" />
              </div>

              {/* Mode Toggle Switch */}
              <div className="px-6 pt-5">
                <div className="flex bg-[rgb(var(--color-void))] p-1 rounded-xl border border-[rgb(var(--color-border))]/50">
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(false)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!isBatchMode ? 'bg-[rgb(var(--color-primary))] text-white shadow-sm' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))]'}`}
                  >
                    Single Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(true)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${isBatchMode ? 'bg-[rgb(var(--color-primary))] text-white shadow-sm' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))]'}`}
                  >
                    Multiple Slots (Batch)
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
                
                {/* 1. SINGLE SLOT MODE CONTROLS */}
                {!isBatchMode && (
                  <>
                    {/* Date Selection */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">{t.dateLabel}</label>
                      <input 
                        type="date"
                        required={!isBatchMode}
                        value={createForm.date}
                        onChange={(e) => setCreateForm({...createForm, date: e.target.value})}
                        style={{ colorScheme: 'dark' }}
                        className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                      />
                    </div>

                    {/* Custom Time inputs range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">Start Time</label>
                        <input 
                          type="time"
                          required={!isBatchMode}
                          value={createForm.startTime}
                          onChange={(e) => setCreateForm({...createForm, startTime: e.target.value})}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">End Time</label>
                        <input 
                          type="time"
                          required={!isBatchMode}
                          value={createForm.endTime}
                          onChange={(e) => setCreateForm({...createForm, endTime: e.target.value})}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 2. BATCH MODE CONTROLS */}
                {isBatchMode && (
                  <>
                    {/* Date Range Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">Start Date</label>
                        <input 
                          type="date"
                          required={isBatchMode}
                          value={batchForm.startDate}
                          onChange={(e) => setBatchForm({...batchForm, startDate: e.target.value})}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">End Date</label>
                        <input 
                          type="date"
                          required={isBatchMode}
                          value={batchForm.endDate}
                          onChange={(e) => setBatchForm({...batchForm, endDate: e.target.value})}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                        />
                      </div>
                    </div>

                    {/* Weekday Selection */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">Repeat on Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                          const isSelected = batchForm.weekdays.includes(day)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const nextWeekdays = isSelected
                                  ? batchForm.weekdays.filter(d => d !== day)
                                  : [...batchForm.weekdays, day]
                                setBatchForm({...batchForm, weekdays: nextWeekdays})
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition ${
                                isSelected 
                                  ? 'bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] shadow-sm' 
                                  : 'bg-[rgb(var(--color-void))] border-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-2))]'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setBatchForm({...batchForm, weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']})}
                          className="text-[9px] font-mono text-[rgb(var(--color-primary))] hover:underline"
                        >
                          Weekdays Only
                        </button>
                        <button
                          type="button"
                          onClick={() => setBatchForm({...batchForm, weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']})}
                          className="text-[9px] font-mono text-[rgb(var(--color-primary))] hover:underline"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setBatchForm({...batchForm, weekdays: []})}
                          className="text-[9px] font-mono text-rose-400 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Multiple Custom Time Selection */}
                    <div className="flex flex-col gap-2 text-left">
                      <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">Class Times</label>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Start</span>
                          <input 
                            type="time"
                            value={customTimeInput.start}
                            onChange={(e) => setCustomTimeInput({...customTimeInput, start: e.target.value})}
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">End</span>
                          <input 
                            type="time"
                            value={customTimeInput.end}
                            onChange={(e) => setCustomTimeInput({...customTimeInput, end: e.target.value})}
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!customTimeInput.start || !customTimeInput.end) {
                              toast.error('Enter both start and end time')
                              return
                            }
                            const timeRange = `${formatTime12h(customTimeInput.start)} - ${formatTime12h(customTimeInput.end)}`
                            if (batchForm.times.includes(timeRange)) {
                              toast.error('Time range already added')
                              return
                            }
                            setBatchForm({
                              ...batchForm,
                              times: [...batchForm.times, timeRange]
                            })
                            setCustomTimeInput({ start: '', end: '' })
                          }}
                          className="px-3 py-2 bg-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-primary))] font-bold text-xs rounded-lg transition"
                        >
                          Add Time
                        </button>
                      </div>

                      {/* Preset intervals */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase mr-1 self-center">Presets:</span>
                        {[
                          { label: 'Morning 8am', start: '08:00', end: '09:30' },
                          { label: 'Noon 12pm', start: '12:00', end: '13:30' },
                          { label: 'Evening 4pm', start: '16:00', end: '17:30' }
                        ].map(preset => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              const range = `${formatTime12h(preset.start)} - ${formatTime12h(preset.end)}`
                              if (!batchForm.times.includes(range)) {
                                setBatchForm({
                                  ...batchForm,
                                  times: [...batchForm.times, range]
                                })
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-[rgb(var(--color-void))] hover:bg-[rgb(var(--color-border))] border border-[rgb(var(--color-border))]/55 text-[8px] font-mono text-[rgb(var(--color-text-2))]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Currently Added Times list */}
                      {batchForm.times.length > 0 ? (
                        <div className="flex flex-col gap-1.5 mt-2 bg-[rgb(var(--color-void))]/40 p-2.5 rounded-xl border border-[rgb(var(--color-border))]/40">
                          <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase tracking-wider font-semibold">Selected Times ({batchForm.times.length}):</span>
                          <div className="flex flex-col gap-1">
                            {batchForm.times.map((tStr, index) => (
                              <div key={index} className="flex justify-between items-center bg-[rgb(var(--color-void))] px-2.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))]/50">
                                <span className="text-xs font-mono font-bold text-[rgb(var(--color-text-1))]">{tStr}</span>
                                <button
                                  type="button"
                                  onClick={() => setBatchForm({...batchForm, times: batchForm.times.filter((_, idx) => idx !== index)})}
                                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-400 mt-1">Please add at least 1 time slot to generate batch.</span>
                      )}
                    </div>
                  </>
                )}

                {/* 3. SHARED CONTROLS (Capacity, Instructor, Status) */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">{t.capacity}</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={isBatchMode ? batchForm.maxCapacity : createForm.maxCapacity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      if (isBatchMode) setBatchForm({...batchForm, maxCapacity: val})
                      else setCreateForm({...createForm, maxCapacity: val})
                    }}
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">{t.instructor}</label>
                  <select
                    value={isBatchMode ? batchForm.instructorId : createForm.instructorId}
                    onChange={(e) => {
                      const val = e.target.value
                      if (isBatchMode) setBatchForm({...batchForm, instructorId: val})
                      else setCreateForm({...createForm, instructorId: val})
                    }}
                    required
                    className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                  >
                    {instructors.length > 0 ? (
                      <>
                        <option value="" className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-3))]">
                          Select Instructor / Coach
                        </option>
                        {instructors.map(ins => (
                          <option key={ins.id} value={ins.id} className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-1))]">
                            {ins.name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="" className="bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-3))]">
                        No instructors active
                      </option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider font-bold">{t.status}</label>
                  <select
                    value={isBatchMode ? batchForm.status : createForm.status}
                    onChange={(e) => {
                      const val = e.target.value
                      if (isBatchMode) setBatchForm({...batchForm, status: val})
                      else setCreateForm({...createForm, status: val})
                    }}
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
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[28px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
              <div className="text-left">
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">Edit Class Slot</h3>
                <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-1 uppercase tracking-wider">
                  {formatFriendlyDate(editingSlot.dayOfWeek)} @ {editingSlot.time}
                </p>
              </div>
              <Shield className="w-5 h-5 text-[rgb(var(--color-text-3))]" />
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider">Max Students per Slot</label>
                <input 
                  type="number"
                  min="1"
                  value={modalForm.maxCapacity}
                  onChange={(e) => setModalForm({...modalForm, maxCapacity: parseInt(e.target.value) || 1})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase tracking-wider flex items-center gap-1">
                  Bookings made offline
                </label>
                <input 
                  type="number"
                  min="0"
                  value={modalForm.currentBooked}
                  onChange={(e) => setModalForm({...modalForm, currentBooked: parseInt(e.target.value) || 0})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
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

            <div className="p-5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/30 flex justify-between items-center">
              <button 
                type="button"
                onClick={() => handleDeleteSlot(editingSlot.id)}
                className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Slot
              </button>
              <div className="flex gap-2">
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
                  {isSaving ? t.saving : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Enrolled Students Card Section */}
            <div className="p-6 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[rgb(var(--color-text-1))] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                  {t.enrolled}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowManualRegister(!showManualRegister)}
                  className="px-2.5 py-1 bg-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] font-mono font-bold text-[9px] rounded-lg transition"
                >
                  {showManualRegister ? 'View Bookings' : '+ Add Student'}
                </button>
              </div>
              
              {/* Expandable Manual Walk-in Student Enrollment Form */}
              {showManualRegister ? (
                <form onSubmit={handleManualRegisterSubmit} className="flex flex-col gap-3 bg-[rgb(var(--color-void))]/60 p-4 rounded-xl border border-[rgb(var(--color-border))]/55 text-left animate-fadeIn">
                  <span className="text-[9px] font-mono text-[rgb(var(--color-primary))] font-bold uppercase tracking-wider">Add Walk-in Student</span>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Student Name</span>
                    <input 
                      type="text"
                      required
                      placeholder="Vikram Singh"
                      value={manualForm.name}
                      onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                      className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Email Address</span>
                      <input 
                        type="email"
                        required
                        placeholder="vikram@gmail.com"
                        value={manualForm.email}
                        onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                        className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Phone Number</span>
                      <input 
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={manualForm.phone}
                        onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                        className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Course Plan</span>
                      <select
                        value={manualForm.trainingType}
                        onChange={(e) => setManualForm({...manualForm, trainingType: e.target.value})}
                        className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/80 rounded-lg px-2 py-1.5 text-[11px] font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                      >
                        <option value="course-beginner">Foundation (21 Days)</option>
                        <option value="course-advanced">Advanced (14 Days)</option>
                        <option value="course-rto">RTO preparative (7 Days)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-[rgb(var(--color-text-3))] uppercase font-semibold">Login Password</span>
                      <input 
                        type="text"
                        required
                        value={manualForm.password}
                        onChange={(e) => setManualForm({...manualForm, password: e.target.value})}
                        className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/80 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={manualSubmitting}
                    className="w-full py-2 mt-2 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/90 transition"
                  >
                    {manualSubmitting ? 'Enrolling...' : 'Enroll Student'}
                  </button>
                </form>
              ) : loadingBookings ? (
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
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-sm rounded-[24px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col relative animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/60 flex justify-between items-center mt-1.5">
              <div className="text-left">
                <h3 className="text-md font-bold text-[rgb(var(--color-text-1))] font-display">Student Profile</h3>
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
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Selected Course</span>
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
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Student Status</span>
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
