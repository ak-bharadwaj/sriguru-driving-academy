"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Edit2, Check, Clock, Shield, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    title: 'Sri Guru Unified Roster',
    desc: 'Manage and activate slots for all training courses in a single master calendar schedule',
    loading: 'LOADING SCHEDULE GRID...',
    time: 'TIME',
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
    avail: 'Avail',
    activate: '+ Activate',
    configSlot: 'Configure Slot',
    maxCap: 'Total Max Capacity',
    maxCapDesc: 'Maximum number of cars/instructors available for this hour.',
    offlineCount: 'Offline Students Count',
    offlineDesc: 'Use this to block seats for legacy students who registered offline.',
    status: 'Slot Status',
    active: 'ACTIVE (Accepting web bookings)',
    closed: 'CLOSED (Hidden / Unavailable)',
    cancel: 'Cancel',
    saveConfig: 'Save Configuration',
    saving: 'Saving...',
    enrolled: 'Enrolled Students (Click to reveal details)',
    loadingStudents: 'Loading students...',
    noWebStudents: 'No web students booked for this slot yet.',
    slotActiveToast: 'Slot activated!',
    slotUpdatedToast: 'Slot updated!',
    failedSave: 'Failed to save slot',
    error: 'An error occurred'
  },
  HI: {
    title: 'श्री गुरु एकीकृत रोस्टर',
    desc: 'एकल मास्टर कैलेंडर अनुसूची में सभी प्रशिक्षण पाठ्यक्रमों के लिए स्लॉट प्रबंधित और सक्रिय करें',
    loading: 'अनुसूची ग्रिड लोड हो रहा है...',
    time: 'समय',
    mon: 'सोमवार', tue: 'मंगलवार', wed: 'बुधवार', thu: 'गुरुवार', fri: 'शुक्रवार', sat: 'शनिवार', sun: 'रविवार',
    avail: 'उपलब्ध',
    activate: '+ सक्रिय करें',
    configSlot: 'स्लॉट कॉन्फ़िगर करें',
    maxCap: 'कुल अधिकतम क्षमता',
    maxCapDesc: 'इस घंटे के लिए उपलब्ध कारों/प्रशिक्षकों की अधिकतम संख्या।',
    offlineCount: 'ऑफ़लाइन छात्रों की संख्या',
    offlineDesc: 'ऑफ़लाइन पंजीकरण करने वाले पुराने छात्रों के लिए सीटें ब्लॉक करने के लिए इसका उपयोग करें।',
    status: 'स्लॉट स्थिति',
    active: 'सक्रिय (वेब बुकिंग स्वीकार कर रहा है)',
    closed: 'बंद (छिपा हुआ / अनुपलब्ध)',
    cancel: 'रद्द करें',
    saveConfig: 'कॉन्फ़िगरेशन सहेजें',
    saving: 'सहेजा जा रहा है...',
    enrolled: 'नामांकित छात्र (विवरण के लिए क्लिक करें)',
    loadingStudents: 'छात्रों को लोड किया जा रहा है...',
    noWebStudents: 'अभी तक इस स्लॉट के लिए कोई वेब छात्र बुक नहीं हुआ है।',
    slotActiveToast: 'स्लॉट सक्रिय हो गया!',
    slotUpdatedToast: 'स्लॉट अपडेट हो गया!',
    failedSave: 'स्लॉट सहेजने में विफल',
    error: 'एक त्रुटि हुई'
  },
  TE: {
    title: 'శ్రీ గురు యూనిఫైడ్ రోస్టర్',
    desc: 'సింగిల్ మాస్టర్ క్యాలెండర్ షెడ్యూల్‌లో అన్ని శిక్షణా కోర్సుల కోసం స్లాట్‌లను నిర్వహించండి మరియు యాక్టివేట్ చేయండి',
    loading: 'షెడ్యూల్ గ్రిడ్ లోడ్ అవుతోంది...',
    time: 'సమయం',
    mon: 'సోమవారం', tue: 'మంగళవారం', wed: 'బుధవారం', thu: 'గురువారం', fri: 'శుక్రవారం', sat: 'శనివారం', sun: 'ఆదివారం',
    avail: 'అందుబాటులో',
    activate: '+ యాక్టివేట్ చేయండి',
    configSlot: 'స్లాట్‌ను కాన్ఫిగర్ చేయండి',
    maxCap: 'మొత్తం గరిష్ట సామర్థ్యం',
    maxCapDesc: 'ఈ గంటకు అందుబాటులో ఉన్న కార్లు/బోధకుల గరిష్ట సంఖ్య.',
    offlineCount: 'ఆఫ్‌లైన్ విద్యార్థుల సంఖ్య',
    offlineDesc: 'ఆఫ్‌లైన్‌లో నమోదు చేసుకున్న పాత విద్యార్థుల కోసం సీట్లను బ్లాక్ చేయడానికి దీనిని ఉపయోగించండి.',
    status: 'స్లాట్ स्थिति',
    active: 'క్రియాశీల (వెబ్ బుకింగ్‌లను అంగీకరిస్తుంది)',
    closed: 'మూసివేయబడింది (దాచబడింది / అందుబాటులో లేదు)',
    cancel: 'రద్దు చేయండి',
    saveConfig: 'కాన్ఫిగరేషన్ సేవ్ చేయండి',
    saving: 'సేవ్ చేయబడుతోంది...',
    enrolled: 'నమోదైన విద్యార్థులు (వివరాల కోసం క్లిక్ చేయండి)',
    loadingStudents: 'విద్యార్థులను లోడ్ చేస్తోంది...',
    noWebStudents: 'ఈ స్లాట్ కోసం ఇంకా వెబ్ విద్యార్థులు బుక్ కాలేదు.',
    slotActiveToast: 'スロット activated!',
    slotUpdatedToast: 'స్లాట్ నవీకరించబడింది!',
    failedSave: 'స్లాట్‌ను సేవ్ చేయడం విఫలమైంది',
    error: 'ఒక లోపం ఏర్పడింది'
  }
}

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM']

interface Slot {
  id: string
  dayOfWeek: string
  time: string
  trainingType: string
  maxCapacity: number
  currentBooked: number
  status: string
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
  
  // Modal State
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [slotBookings, setSlotBookings] = useState<BookingUser[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<BookingUser | null>(null)

  const [modalForm, setModalForm] = useState({
    maxCapacity: 5,
    currentBooked: 0,
    status: 'ACTIVE'
  })
  const [isSaving, setIsSaving] = useState(false)

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

  useEffect(() => {
    fetchSlots()
  }, [])

  const openSlotModal = async (day: string, hour: string) => {
    setSlotBookings([])
    
    const existing = slots.find(s => s.dayOfWeek === day && s.time === hour)
    if (existing) {
      setEditingSlot(existing)
      setModalForm({
        maxCapacity: existing.maxCapacity,
        currentBooked: existing.currentBooked,
        status: existing.status
      })
      
      // Fetch bookings for this slot
      setLoadingBookings(true)
      try {
        const res = await fetch(`/api/admin/slots/bookings?slotId=${existing.id}`)
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
        console.error("Failed to fetch bookings")
      } finally {
        setLoadingBookings(false)
      }
      
    } else {
      setEditingSlot({
        id: 'new',
        dayOfWeek: day,
        time: hour,
        trainingType: 'BEGINNER',
        maxCapacity: 5,
        currentBooked: 0,
        status: 'ACTIVE'
      })
      setModalForm({
        maxCapacity: 5,
        currentBooked: 0,
        status: 'ACTIVE'
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveSlot = async () => {
    if (!editingSlot) return
    setIsSaving(true)
    try {
      const isNew = editingSlot.id === 'new'
      const endpoint = '/api/public/slots'
      const method = isNew ? 'POST' : 'PUT'
      
      const payload = isNew ? {
        dayOfWeek: editingSlot.dayOfWeek,
        time: editingSlot.time,
        trainingType: 'BEGINNER',
        maxCapacity: modalForm.maxCapacity,
        currentBooked: modalForm.currentBooked,
        status: modalForm.status
      } : {
        id: editingSlot.id,
        maxCapacity: modalForm.maxCapacity,
        currentBooked: modalForm.currentBooked,
        status: modalForm.status
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(isNew ? t.slotActiveToast : t.slotUpdatedToast)
        fetchSlots()
        setIsModalOpen(false)
      } else {
        toast.error(t.failedSave)
      }
    } catch (e) {
      toast.error(t.error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[rgb(var(--color-surface))] p-5 rounded-2xl border border-[rgb(var(--color-border))]">
        <div>
          <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.title}</h2>
          <p className="text-xs text-[rgb(var(--color-text-3))] font-mono mt-1">{t.desc}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] px-3 py-1.5 rounded-full border border-[rgb(var(--color-primary))]/30 uppercase tracking-widest shadow-sm">
            Master Calendar Active
          </span>
        </div>
      </div>

      <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl overflow-hidden shadow-app">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin" />
            <span className="text-[10px] font-mono text-[rgb(var(--color-text-3))]">{t.loading}</span>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none p-4">
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(7,1fr)] gap-3">
              {/* Header */}
              <div className="h-10 flex items-center justify-center text-[10px] font-bold font-mono text-[rgb(var(--color-text-3))]">{t.time}</div>
              {DAYS.map(day => {
                const dayLabel = DAYS.indexOf(day) === 0 ? 'Monday' : DAYS.indexOf(day) === 1 ? 'Tuesday' : DAYS.indexOf(day) === 2 ? 'Wednesday' : DAYS.indexOf(day) === 3 ? 'Thursday' : DAYS.indexOf(day) === 4 ? 'Friday' : DAYS.indexOf(day) === 5 ? 'Saturday' : 'Sunday'
                return (
                  <div key={day} className="h-10 flex items-center justify-center text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] border-b border-[rgb(var(--color-border))] uppercase tracking-wider">
                    {t[day as keyof typeof t] || dayLabel}
                  </div>
                )
              })}

              {/* Grid Rows */}
              {HOURS.map(hour => (
                <React.Fragment key={hour}>
                  <div className="h-16 flex items-center justify-center text-[10px] font-bold font-mono text-[rgb(var(--color-text-3))] bg-[rgb(var(--color-void))] rounded-xl border border-[rgb(var(--color-border))]">
                    {hour}
                  </div>
                  {DAYS.map(day => {
                    const dayLabel = DAYS.indexOf(day) === 0 ? 'Monday' : DAYS.indexOf(day) === 1 ? 'Tuesday' : DAYS.indexOf(day) === 2 ? 'Wednesday' : DAYS.indexOf(day) === 3 ? 'Thursday' : DAYS.indexOf(day) === 4 ? 'Friday' : DAYS.indexOf(day) === 5 ? 'Saturday' : 'Sunday'
                    const slot = slots.find(s => s.dayOfWeek === dayLabel && s.time === hour)
                    const isActive = !!slot
                    
                    let cellStyle = 'bg-[rgb(var(--color-void))]/50 border-dashed border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))]/50 text-[rgb(var(--color-text-3))]'
                    let labelColor = 'text-[rgb(var(--color-primary))]'
                    
                    if (isActive) {
                      if (slot.status === 'CLOSED') {
                        cellStyle = 'bg-[rgb(var(--color-danger))]/15 border-[rgb(var(--color-danger))]/40 hover:border-[rgb(var(--color-danger))] group text-[rgb(var(--color-danger))]'
                        labelColor = 'text-[rgb(var(--color-danger))]'
                      } else {
                        // Operational active slot: premium success emerald-green color palette!
                        cellStyle = 'bg-[rgb(var(--color-success))]/15 border-[rgb(var(--color-success))]/40 hover:border-[rgb(var(--color-success))] group text-[rgb(var(--color-success))]'
                        labelColor = 'text-[rgb(var(--color-success))]'
                      }
                    }

                    return (
                      <div 
                        key={day}
                        onClick={() => openSlotModal(dayLabel, hour)}
                        className={`h-16 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${cellStyle}`}
                      >
                        {isActive ? (
                          <>
                            <span className={`text-[10px] font-bold uppercase ${labelColor}`}>{slot.status}</span>
                            <span className="text-[9px] font-mono text-[rgb(var(--color-text-2))] mt-1 group-hover:text-[rgb(var(--color-text-1))]">
                              {slot.currentBooked} / {slot.maxCapacity} Booked
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono text-[rgb(var(--color-text-3))] uppercase tracking-wider opacity-50">{t.activate}</span>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && editingSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface))] w-full max-w-md rounded-[24px] border border-[rgb(var(--color-border))] shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))]/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))] font-display">{t.configSlot}</h3>
                <p className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-bold mt-1 uppercase tracking-wider">
                  {editingSlot.dayOfWeek} @ {editingSlot.time}
                </p>
              </div>
              <Shield className="w-6 h-6 text-[rgb(var(--color-text-3))]" />
            </div>

            <div className="p-6 flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase">{t.maxCap}</label>
                <input 
                  type="number"
                  min="1"
                  value={modalForm.maxCapacity}
                  onChange={(e) => setModalForm({...modalForm, maxCapacity: parseInt(e.target.value) || 1})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-primary))]"
                />
                <span className="text-[9px] text-[rgb(var(--color-text-3))]">{t.maxCapDesc}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase flex items-center gap-1">
                  {t.offlineCount} <AlertCircle className="w-3 h-3 text-[rgb(var(--color-accent))]" />
                </label>
                <input 
                  type="number"
                  min="0"
                  value={modalForm.currentBooked}
                  onChange={(e) => setModalForm({...modalForm, currentBooked: parseInt(e.target.value) || 0})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-bold text-[rgb(var(--color-text-1))] outline-none focus:border-[rgb(var(--color-accent))]"
                />
                <span className="text-[9px] text-[rgb(var(--color-accent))]">{t.offlineDesc}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold font-mono text-[rgb(var(--color-text-2))] uppercase">{t.status}</label>
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
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSlot}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg shadow-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? t.saving : t.saveConfig}
              </button>
            </div>

            {/* Bookings Section */}
            {editingSlot.id !== 'new' && (
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
                        className="flex justify-between items-center bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] p-3 rounded-xl cursor-pointer hover:border-[rgb(var(--color-primary))]/60 hover:bg-[rgb(var(--color-void))]/80 transition-all group"
                      >
                        <div className="flex flex-col">
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
                    No web students booked for this slot yet.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Student Details Popup Modal */}
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

            <div className="p-6 flex flex-col gap-4">
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
                    selectedStudentDetails.feeStatus === 'PAID' ? 'text-[rgb(var(--color-success))]' : 'text-[rgb(var(--color-accent))]'
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
                  <span className="text-[8px] font-mono font-bold text-[rgb(var(--color-text-3))] uppercase tracking-wider">Onboarding XP</span>
                  <span className="text-[10px] font-mono font-bold text-[rgb(var(--color-text-2))] mt-1">
                    Level {selectedStudentDetails.confidenceScore || 'Active'}
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
