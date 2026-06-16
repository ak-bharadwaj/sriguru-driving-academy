"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Car, MapPin, CheckCircle2, Circle, Trophy } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import Image from 'next/image'

const PAGE_DICT = {
  EN: {
    title: 'Your Training Batch',
    batchDetails: 'Batch Details',
    instructor: 'Lead Instructor',
    vehicle: 'Training Vehicle',
    timing: 'Daily Slot',
    location: 'Reporting Area',
    syllabusTitleBeginner: '21-Day Mastery Syllabus',
    syllabusTitleAdvanced: '14-Day Advanced Syllabus',
    syllabusTitleRto: '7-Day RTO Bootcamp Syllabus',
    day: 'Day',
    completed: 'Completed',
    today: 'Today',
    upcoming: 'Upcoming'
  },
  HI: {
    title: 'आपका प्रशिक्षण बैच',
    batchDetails: 'बैच विवरण',
    instructor: 'प्रमुख प्रशिक्षक',
    vehicle: 'प्रशिक्षण वाहन',
    timing: 'दैनिक स्लॉट',
    location: 'रिपोर्टिंग क्षेत्र',
    syllabusTitleBeginner: '21-दिवसीय महारत पाठ्यक्रम',
    syllabusTitleAdvanced: '14-दिवसीय उन्नत पाठ्यक्रम',
    syllabusTitleRto: '7-दिवसीय RTO बूटकैंप पाठ्यक्रम',
    day: 'दिन',
    completed: 'पूरा हुआ',
    today: 'आज',
    upcoming: 'आगामी'
  },
  TE: {
    title: 'మీ శిక్షణ బ్యాచ్',
    batchDetails: 'బ్యాచ్ వివరాలు',
    instructor: 'ప్రధాన బోధకుడు',
    vehicle: 'శిక్షణ వాహనం',
    timing: 'రోజువారీ స్లాట్',
    location: 'రిపోర్టింగ్ ప్రాంతం',
    syllabusTitleBeginner: '21-రోజుల నైపుణ్య సిలబస్',
    syllabusTitleAdvanced: '14-రోజుల అధునాతన సిలబస్',
    syllabusTitleRto: '7-రోజుల RTO బూట్‌క్యాంప్ సిలబస్',
    day: 'రోజు',
    completed: 'పూర్తయింది',
    today: 'నేడు',
    upcoming: 'రాబోయే'
  }
}



export default function SchedulePage() {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syllabusList, setSyllabusList] = useState<{ dayNumber: number; title: string; description: string }[]>([])

  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(res => res.json())
      .then(data => {
        setStudent(data)
        setLoading(false)
        // Fetch syllabus from DB based on student's training type
        const type = data?.trainingType || 'BEGINNER'
        fetch(`/api/public/syllabus?type=${type}`)
          .then(r => r.json())
          .then(days => {
            if (Array.isArray(days)) {
              setSyllabusList(days.sort((a: any, b: any) => a.dayNumber - b.dayNumber))
            }
          })
          .catch(() => {})
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-primary animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Loading Schedule...</span>
        </div>
      </div>
    )
  }

  const trainingType = student?.trainingType || 'BEGINNER'
  const durationDays = trainingType === 'ADVANCED' ? 14 : trainingType === 'RTO_FAST_TRACK' ? 7 : 21
  const currentDay = Math.min((student?.totalAttended || 0) + 1, durationDays + 1)
  const timingTime = student?.bookings?.[0]?.slot?.time || student?.bookings?.[0]?.preferredTime || '07:00 AM'

  let vehicleName = 'Maruti Swift (Dual Control)'
  let vehicleDesc = 'Manual Transmission LMV'
  if (trainingType === 'ADVANCED') {
    vehicleName = 'Hyundai i20 (Dual Control)'
    vehicleDesc = 'Defensive Manual/Automatic LMV'
  } else if (trainingType === 'RTO_FAST_TRACK') {
    vehicleName = 'Maruti Alto (RTO Spec)'
    vehicleDesc = 'RTO Track Exam Ready Car'
  }

  const syllabusTitle = trainingType === 'ADVANCED' ? t.syllabusTitleAdvanced
                      : trainingType === 'RTO_FAST_TRACK' ? t.syllabusTitleRto
                      : t.syllabusTitleBeginner

  const getRecurrenceNotice = () => {
    if (activeLang === 'HI') {
      return `दैनिक स्लॉट नीति: आपका चयनित स्लॉट (${timingTime}) आपके पूरे ${durationDays}-दिवसीय पाठ्यक्रम के लिए हर दिन इसी समय आपकी दैनिक सीट सुरक्षित करता है।`
    }
    if (activeLang === 'TE') {
      return `రోజువారీ స్లాట్ విధానం: మీరు ఎంచుకున్న స్లాట్ (${timingTime}) మీ మొత్తం ${durationDays}-రోజుల కోర్సు కోసం ప్రతిరోజు ఇదే సమయానికి మీ రోజువారీ సీటును రిజర్వ్ చేస్తుంది.`
    }
    return `Daily Recurrence: Your selected slot (${timingTime}) reserves your daily seat at this exact hour every single day for your entire ${durationDays}-day course duration.`
  }

  return (
    <div className="min-h-screen bg-void text-text-1 pb-32 pt-20 px-4 md:px-8 font-body">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">{t.title}</h1>
          <p className="text-text-3 mt-2">Your dedicated time slot and instructor for the entire course.</p>
        </div>

        {/* Batch Details Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-xl mb-12 relative overflow-hidden">
          {/* Decorative background logo/icon */}
          <Calendar className="absolute -right-10 -bottom-10 w-64 h-64 text-primary/5 pointer-events-none" />
          
          <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2 text-text-1">
            <span className="w-2 h-6 bg-accent rounded-full" />
            {t.batchDetails}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Instructor & Vehicle */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-void/50 p-4 rounded-2xl border border-border/50">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-3 uppercase">{t.instructor}</p>
                  <p className="text-lg font-bold">{student?.instructor?.name || 'Capt. Vikram Singh'}</p>
                  <p className="text-sm text-accent">15+ Years Experience</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-void/50 p-4 rounded-2xl border border-border/50">
                <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center shrink-0">
                  <Car className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-3 uppercase">{t.vehicle}</p>
                  <p className="text-lg font-bold">{vehicleName}</p>
                  <p className="text-sm text-text-2">{vehicleDesc}</p>
                </div>
              </div>
            </div>

            {/* Timing & Location */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-2xl border border-primary/30">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-3 uppercase">{t.timing}</p>
                  <p className="text-2xl font-display font-bold text-primary">{timingTime}</p>
                  <p className="text-sm text-text-2">Monday - Saturday (1 Hour)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-void/50 p-4 rounded-2xl border border-border/50">
                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-text-2" />
                </div>
                <div>
                  <p className="text-xs font-mono text-text-3 uppercase">{t.location}</p>
                  <p className="text-lg font-bold">Academy Main Gate</p>
                  <p className="text-sm text-text-2">Zone A Parking</p>
                </div>
              </div>
            </div>

            {/* Dynamic Daily Recurrence Notice */}
            <div className="col-span-1 md:col-span-2 bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-3 mt-2">
              <span className="text-lg leading-none shrink-0 mt-0.5">📅</span>
              <div className="text-xs leading-relaxed text-text-2 font-mono">
                <strong className="text-text-1 uppercase font-bold block mb-1">Recurrence Implication</strong>
                {getRecurrenceNotice()}
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Timeline */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-display font-bold">{syllabusTitle}</h2>
          <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {Math.min(currentDay - 1, durationDays)} / {durationDays} {t.completed}
          </span>
        </div>

        <div className="relative pl-6 md:pl-8">
          {/* The vertical line */}
          <div className="absolute left-[34px] md:left-[42px] top-4 bottom-4 w-1 bg-surface border-r border-border" />

          <div className="space-y-8 relative">
            {syllabusList.map((day, idx) => {
              const dayNum = day.dayNumber
              const isCompleted = dayNum < currentDay
              const isToday = dayNum === currentDay
              const isUpcoming = dayNum > currentDay

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative flex items-start gap-6 md:gap-8 group ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}
                >
                  {/* Node Icon */}
                  <div className="relative z-10 shrink-0 mt-1">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : isToday ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface border-2 border-border flex items-center justify-center group-hover:border-text-3 transition-colors">
                        <Circle className="w-3 h-3 text-border" />
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                    isToday 
                      ? 'bg-primary/10 border-primary shadow-[0_4px_24px_rgba(37,99,235,0.15)]' 
                      : 'bg-surface border-border hover:border-border/80'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <span className={`text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                        isCompleted ? 'bg-success/20 text-success' 
                        : isToday ? 'bg-primary text-white' 
                        : 'bg-void text-text-3'
                      }`}>
                        {t.day} {dayNum}
                      </span>
                      {isToday && <span className="text-xs text-primary font-bold animate-pulse">{t.today}!</span>}
                    </div>
                    
                    <h3 className={`text-lg font-display font-semibold ${isToday ? 'text-primary' : 'text-text-1'}`}>
                      {day.title}
                    </h3>
                    <p className="text-sm text-text-3 mt-1">
                      {day.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
