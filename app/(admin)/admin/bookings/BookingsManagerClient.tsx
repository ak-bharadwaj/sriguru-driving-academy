"use client"

import React, { useState } from 'react'
import { Check, X, UserCheck, AlertTriangle, Clock, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    headerTitle: 'Booking Review (Manual Mode)',
    headerDesc: 'Review incoming student registrations. Assign an instructor and approve to officially create their account.',
    noBookings: 'No pending bookings.',
    course: 'Course:',
    slot: 'Slot:',
    dateApplied: 'Date Applied:',
    assignInstructor: 'Assign Instructor',
    noInstructor: 'No Instructor (Assign Later)',
    reject: 'Reject',
    approve: 'Approve',
    approving: 'Approving...',
    toastApproveSuccess: 'Booking Approved! Student account created.',
    toastApproveError: 'Failed to approve booking',
    toastRejectSuccess: 'Booking Rejected.',
    toastRejectError: 'Failed to reject booking',
    confirmReject: 'Are you sure you want to reject this booking?',
    at: 'at'
  },
  HI: {
    headerTitle: 'बुकिंग समीक्षा (मैनुअल मोड)',
    headerDesc: 'आने वाले छात्र पंजीकरणों की समीक्षा करें। एक प्रशिक्षक असाइन करें और आधिकारिक तौर पर उनका खाता बनाने के लिए स्वीकृति दें।',
    noBookings: 'कोई लंबित बुकिंग नहीं है।',
    course: 'कोर्स:',
    slot: 'स्लॉट:',
    dateApplied: 'आवेदन की तिथि:',
    assignInstructor: 'प्रशिक्षक असाइन करें',
    noInstructor: 'कोई प्रशिक्षक नहीं (बाद में असाइन करें)',
    reject: 'अस्वीकार करें',
    approve: 'स्वीकृत करें',
    approving: 'स्वीकृत किया जा रहा है...',
    toastApproveSuccess: 'बुकिंग स्वीकृत! छात्र खाता बन गया।',
    toastApproveError: 'बुकिंग स्वीकृत करने में विफल',
    toastRejectSuccess: 'बुकिंग अस्वीकार की गई।',
    toastRejectError: 'बुकिंग अस्वीकार करने में विफल',
    confirmReject: 'क्या आप वाकई इस बुकिंग को अस्वीकार करना चाहते हैं?',
    at: 'को'
  },
  TE: {
    headerTitle: 'బుకింగ్ సమీక్ష (మాన్యువల్ మోడ్)',
    headerDesc: 'ఇన్‌కమింగ్ విద్యార్థి రిజిస్ట్రేషన్‌లను సమీక్షించండి. ఇన్‌స్ట్రక్టర్‌ను కేటాయించండి మరియు వారి ఖాతాను అధికారికంగా సృష్టించడానికి ఆమోదించండి.',
    noBookings: 'పెండింగ్ బుకింగ్‌లు లేవు.',
    course: 'కోర్సు:',
    slot: 'స్లాట్:',
    dateApplied: 'దరఖాస్తు చేసిన తేదీ:',
    assignInstructor: 'ఇన్‌స్ట్రక్టర్‌ను కేటాయించండి',
    noInstructor: 'ఇన్‌స్ట్రక్టర్ లేరు (తర్వాత కేటాయించండి)',
    reject: 'తిరస్కరించండి',
    approve: 'ఆమోదించండి',
    approving: 'ఆమోదిస్తోంది...',
    toastApproveSuccess: 'బుకింగ్ ఆమోదించబడింది! విద్యార్థి ఖాతా సృష్టించబడింది.',
    toastApproveError: 'బుకింగ్‌ను ఆమోదించడం విఫలమైంది',
    toastRejectSuccess: 'బుకింగ్ తిరస్కరించబడింది.',
    toastRejectError: 'బుకింగ్‌ను తిరస్కరించడం విఫలమైంది',
    confirmReject: 'మీరు ఖచ్చితంగా ఈ బుకింగ్‌ను తిరస్కరించాలనుకుంటున్నారా?',
    at: 'వద్ద'
  }
}

interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  trainingType: string
  status: string
  createdAt: string
  slotId?: string | null
  slot?: {
    date: Date
    startTime: string
    endTime: string
  } | null
}

interface InstructorOption {
  id: string
  name: string
}

export default function BookingsManagerClient({ 
  initialBookings,
  instructors
}: { 
  initialBookings: BookingData[],
  instructors: InstructorOption[]
}) {
  const router = useRouter()
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, string>>({})
  
  const handleApprove = async (bookingId: string) => {
    setApprovingId(bookingId)
    try {
      const res = await fetch('/api/admin/bookings/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          instructorId: selectedInstructor[bookingId] || undefined
        })
      })

      if (res.ok) {
        toast.success(t.toastApproveSuccess)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || t.toastApproveError)
      }
    } catch (e) {
      toast.error('An error occurred.')
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (bookingId: string) => {
    if (!confirm(t.confirmReject)) return
    
    try {
      const res = await fetch('/api/public/bookings', { // This endpoint supports PUT status
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'REJECTED' })
      })

      if (res.ok) {
        toast.success(t.toastRejectSuccess)
        router.refresh()
      } else {
        toast.error(t.toastRejectError)
      }
    } catch (e) {
      toast.error('An error occurred.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.headerTitle}</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          {t.headerDesc}
        </p>
      </div>
      
      {initialBookings.length === 0 ? (
        <div className="bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-[rgb(var(--color-text-2))]">{t.noBookings}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBookings.map((b) => (
            <div key={b.id} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[rgb(var(--color-text-1))]">{b.name}</h4>
                  <p className="text-xs text-[rgb(var(--color-text-3))] font-medium">{b.email}</p>
                  <p className="text-xs text-[rgb(var(--color-text-3))] font-medium">{b.phone}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider flex items-center gap-1 border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> {b.status}
                </span>
              </div>

              <div className="bg-[rgb(var(--color-void))] p-3 rounded-xl border border-[rgb(var(--color-border))] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-2))] font-bold">{t.course}</span>
                  <span className="text-[rgb(var(--color-text-1))] font-medium">{b.trainingType}</span>
                </div>
                {b.slot && (
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--color-text-2))] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.slot}
                    </span>
                    <span className="text-[rgb(var(--color-text-1))] font-medium">{new Date(b.slot.date).toLocaleDateString()} {t.at} {b.slot.startTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-2))] font-bold">{t.dateApplied}</span>
                  <span className="text-[rgb(var(--color-text-1))] font-medium">{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.assignInstructor}</label>
                <select 
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-2 text-xs font-medium outline-none w-full"
                  value={selectedInstructor[b.id] || ''}
                  onChange={(e) => setSelectedInstructor(prev => ({...prev, [b.id]: e.target.value}))}
                >
                  <option value="">{t.noInstructor}</option>
                  {instructors.map(ins => (
                    <option key={ins.id} value={ins.id}>{ins.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => handleReject(b.id)}
                  disabled={approvingId === b.id}
                  className="flex-1 py-2 bg-[rgb(var(--color-void))] border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" /> {t.reject}
                </button>
                <button 
                  onClick={() => handleApprove(b.id)}
                  disabled={approvingId === b.id}
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {approvingId === b.id ? t.approving : t.approve}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
