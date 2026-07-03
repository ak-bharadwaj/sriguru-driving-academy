"use client"

import React, { useState } from 'react'
import { Check, X, UserCheck, AlertTriangle, Clock, MapPin, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    headerTitle: 'Booking Review (Manual Mode)',
    headerDesc: 'Review incoming student registrations. Approve to officially create their account.',
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
    headerDesc: 'आने वाले छात्र पंजीकरणों की समीक्षा करें। आधिकारिक तौर पर उनका खाता बनाने के लिए स्वीकृति दें।',
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
    headerDesc: 'ఇన్‌కమింగ్ విద్యార్థి రిజిస్ట్రేషన్‌లను సమీక్షించండి. వారి ఖాతాను అధికారికంగా సృష్టించడానికి ఆమోదించండి.',
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
    dayOfWeek: string
    time: string
  } | null
}

interface InstructorOption {
  id: string
  name: string
}

export default function BookingsManagerClient({ 
  initialBookings
}: { 
  initialBookings: BookingData[]
}) {
  const router = useRouter()
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [approvingId, setApprovingId] = useState<string | null>(null)
  
  const handleApprove = async (bookingId: string) => {
    setApprovingId(bookingId)
    try {
      const res = await fetch('/api/admin/bookings/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId
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
        <div className="bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-3))]">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-[rgb(var(--color-text-1))]">{t.noBookings}</p>
            <p className="text-sm text-[rgb(var(--color-text-3))] max-w-xs">New student booking requests will appear here for your review and approval.</p>
          </div>
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
                 <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-2))] font-bold">{t.dateApplied}</span>
                  <span className="text-[rgb(var(--color-text-1))] font-medium">{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-3">
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
                <a
                  href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + b.phone.replace(/[^0-9]/g, '') : b.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.name)},%20this%20is%20Sri%20Guru%20Driving%20School.%20We%20have%20received%20your%20booking%20request%20for%20the%20${encodeURIComponent(b.trainingType)}%20course.%20Let's%20discuss%20to%20finalize%20your%20admission!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366] text-void hover:bg-[#20ba5a] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45h.005c5.379 0 9.75-4.37 9.754-9.751.002-2.607-1.01-5.057-2.852-6.9a9.69 9.69 0 0 0-6.907-2.853c-5.385 0-9.757 4.37-9.761 9.752-.001 1.71.477 3.382 1.387 4.87L1.936 21.06l4.711-1.906zm12.42-7.514c-.302-.15-1.785-.882-2.062-.982-.278-.1-.48-.15-.68.15-.2.3-.775.982-.95 1.183-.175.2-.35.225-.65.075-.3-.15-1.27-.47-2.42-1.493-.895-.8-1.5-1.787-1.675-2.087-.175-.3-.02-.463.13-.613.137-.134.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C10.744 6.782 10.144 5.3 9.893 4.7c-.244-.589-.493-.51-.68-.52-.174-.01-.374-.01-.574-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.308 1.272.493 1.707.632.717.228 1.37.196 1.885.119.574-.087 1.785-.73 2.037-1.437.252-.708.252-1.313.175-1.437-.075-.125-.275-.2-.575-.35z"/>
                  </svg>
                  WhatsApp Follow Up
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
