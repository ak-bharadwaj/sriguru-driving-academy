"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  UserCheck,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileText,
  Users,
  Award,
  X
} from 'lucide-react'

interface PaymentRecord {
  id: string
  amount: number
  method: string
  note: string | null
  receivedAt: string
}

interface TestRecord {
  id: string
  testDate: string
  testCenter: string | null
  result: 'SCHEDULED' | 'PASS' | 'FAIL'
  attemptNo: number
  notes: string | null
}

interface StudentData {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  trainingType: string
  enrolledAt: string
  courseFee: number | null
  feeStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  totalPaid: number
  balance: number
  instructorId: string | null
  instructorName: string | null
  totalSessions: number
  payments: PaymentRecord[]
  nextTest: { id: string; testDate: string; testCenter: string | null; attemptNo: number } | null
  lastTestResult: { id: string; testDate: string; result: string; attemptNo: number } | null
  drivingTests: TestRecord[]
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED'
}

interface InstructorOption {
  id: string
  name: string
}

type FilterMode = 'ALL' | 'UNPAID' | 'TEST_UPCOMING' | 'NO_INSTRUCTOR'
type ModalType = 'payment' | 'test' | 'fee' | 'assign' | 'result' | 'create' | null

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [instructors, setInstructors] = useState<InstructorOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Modal state
  const [modal, setModal] = useState<ModalType>(null)
  const [modalStudentId, setModalStudentId] = useState<string | null>(null)

  // Form states
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'CASH', note: '' })
  const [testForm, setTestForm] = useState({ testDate: '', testCenter: '', notes: '' })
  const [feeForm, setFeeForm] = useState({ courseFee: '', trainingType: '' })
  const [resultForm, setResultForm] = useState({ testId: '', result: 'PASS' as 'PASS' | 'FAIL', notes: '' })
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', trainingType: 'BEGINNER', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
        setInstructors(data.instructors || [])
      }
    } catch (e) {
      console.error('Failed to fetch students:', e)
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchStudents()
      setLoading(false)
    }
    init()
  }, [])

  // Filter logic
  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm))

    if (!matchesSearch) return false

    switch (filterMode) {
      case 'UNPAID': return s.feeStatus !== 'PAID'
      case 'TEST_UPCOMING': return !!s.nextTest
      case 'NO_INSTRUCTOR': return !s.instructorId
      default: return true
    }
  })

  // Stats
  const totalStudents = students.length
  const paidCount = students.filter(s => s.feeStatus === 'PAID').length
  const unpaidCount = students.filter(s => s.feeStatus !== 'PAID').length
  const testUpcoming = students.filter(s => !!s.nextTest).length

  const openModal = (type: ModalType, studentId: string) => {
    setModalStudentId(studentId)
    setModal(type)
    // Pre-fill fee form
    if (type === 'fee') {
      const stu = students.find(s => s.id === studentId)
      setFeeForm({
        courseFee: stu?.courseFee?.toString() || '',
        trainingType: stu?.trainingType || 'BEGINNER'
      })
    }
    if (type === 'assign') {
      const stu = students.find(s => s.id === studentId)
      setAssignForm({ instructorId: stu?.instructorId || '' })
    }
    if (type === 'result') {
      const stu = students.find(s => s.id === studentId)
      setResultForm({
        testId: stu?.nextTest?.id || '',
        result: 'PASS',
        notes: ''
      })
    }
  }

  const closeModal = () => {
    setModal(null)
    setModalStudentId(null)
    setPaymentForm({ amount: '', method: 'CASH', note: '' })
    setTestForm({ testDate: '', testCenter: '', notes: '' })
    setFeeForm({ courseFee: '', trainingType: '' })
    setAssignForm({ instructorId: '' })
    setResultForm({ testId: '', result: 'PASS', notes: '' })
    setCreateForm({ name: '', email: '', phone: '', trainingType: 'BEGINNER', password: '' })
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalStudentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/${modalStudentId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      })
      if (res.ok) {
        await fetchStudents()
        closeModal()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleScheduleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalStudentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/${modalStudentId}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm)
      })
      if (res.ok) {
        await fetchStudents()
        closeModal()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleSetFee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalStudentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/${modalStudentId}/fee`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeForm)
      })
      if (res.ok) {
        await fetchStudents()
        closeModal()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleAssignInstructor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalStudentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/${modalStudentId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm)
      })
      if (res.ok) {
        await fetchStudents()
        closeModal()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleRecordResult = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalStudentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/${modalStudentId}/tests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultForm)
      })
      if (res.ok) {
        await fetchStudents()
        closeModal()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/students/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      })
      const data = await res.json()
      if (res.ok) {
        await fetchStudents()
        closeModal()
      } else {
        alert(data.error || 'Failed to create student')
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const handleStatusChange = async (studentId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change this student's status to ${newStatus}?`)) return
    try {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        await fetchStudents()
      }
    } catch (e) { console.error(e) }
  }

  const feeStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      PAID: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      PARTIAL: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', icon: <Clock className="w-3.5 h-3.5" /> },
      PENDING: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
      OVERDUE: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-800 dark:text-red-300', icon: <XCircle className="w-3.5 h-3.5" /> },
    }
    const s = map[status] || map.PENDING
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${s.bg} ${s.text}`}>
        {s.icon} {status}
      </span>
    )
  }

  const trainingBadge = (type: string) => {
    const labels: Record<string, string> = {
      BEGINNER: 'Beginner',
      ADVANCED: 'Advanced',
      RTO_FAST_TRACK: 'Fast Track',
    }
    return (
      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
        {labels[type] || type}
      </span>
    )
  }

  const filterPills: { label: string; mode: FilterMode; count: number }[] = [
    { label: 'All', mode: 'ALL', count: totalStudents },
    { label: 'Unpaid', mode: 'UNPAID', count: unpaidCount },
    { label: 'Test Upcoming', mode: 'TEST_UPCOMING', count: testUpcoming },
    { label: 'No Instructor', mode: 'NO_INSTRUCTOR', count: students.filter(s => !s.instructorId).length },
  ]

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[rgb(var(--color-text-1))]">
              Student Management
            </h1>
            <p className="text-[rgb(var(--color-text-3))] text-sm mt-1">
              Manage course fees, driving tests, instructor assignments, and student lifecycle.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-3))]">Total</span>
            </div>
            <span className="text-2xl font-bold">{totalStudents}</span>
          </div>
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-3))]">Fee Paid</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{paidCount}</span>
          </div>
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-3))]">Unpaid</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{unpaidCount}</span>
          </div>
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--color-text-3))]">Test Scheduled</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">{testUpcoming}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 bg-[rgb(var(--color-surface))] p-4 rounded-2xl border border-[rgb(var(--color-border))] shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => openModal('create', '')}
            className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-[rgb(var(--color-primary))]/90 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Student
          </button>
          <div className="flex gap-2 flex-wrap">
            {filterPills.map(pill => (
              <button
                key={pill.mode}
                onClick={() => setFilterMode(pill.mode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterMode === pill.mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] hover:bg-[rgb(var(--color-border))]'
                }`}
              >
                {pill.label} ({pill.count})
              </button>
            ))}
          </div>
        </div>

        {/* Student List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-[rgb(var(--color-text-3))]">
            <Clock className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-base font-bold">Loading Students...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-[rgb(var(--color-text-3))]">
            <Users className="w-12 h-12 text-slate-300" />
            <span className="text-lg font-bold">No students found</span>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((stu, idx) => {
              const isExpanded = expandedId === stu.id
              return (
                <motion.div
                  key={stu.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Main Row */}
                  <div
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : stu.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {stu.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-bold text-[rgb(var(--color-text-1))] truncate">{stu.name}</span>
                        <span className="text-xs text-[rgb(var(--color-text-3))] font-medium truncate">{stu.email} {stu.phone ? `• ${stu.phone}` : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {trainingBadge(stu.trainingType)}
                      {feeStatusBadge(stu.feeStatus)}

                      {stu.courseFee ? (
                        <span className="text-xs font-bold text-[rgb(var(--color-text-2))] bg-[rgb(var(--color-border))] px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          {stu.totalPaid.toLocaleString()} / {stu.courseFee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 italic">No fee set</span>
                      )}

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        stu.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                        stu.status === 'COMPLETED' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                        'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                      }`}>
                        {stu.status}
                      </span>

                      {stu.instructorName ? (
                        <span className="text-xs font-bold text-[rgb(var(--color-text-2))] bg-[rgb(var(--color-border))] px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> {stu.instructorName}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg">No Instructor</span>
                      )}

                      {stu.nextTest && (
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Test: {new Date(stu.nextTest.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}

                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-[rgb(var(--color-border))] pt-4">
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 mb-5">
                            <button
                              onClick={(e) => { e.stopPropagation(); openModal('fee', stu.id) }}
                              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" /> Set Fee
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openModal('payment', stu.id) }}
                              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Record Payment
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openModal('test', stu.id) }}
                              className="px-4 py-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 rounded-xl text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors flex items-center gap-1.5"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Schedule Test
                            </button>
                            {stu.nextTest && (
                              <button
                                onClick={(e) => { e.stopPropagation(); openModal('result', stu.id) }}
                                className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1.5"
                              >
                                <Award className="w-3.5 h-3.5" /> Record Test Result
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); openModal('assign', stu.id) }}
                              className="px-4 py-2 bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] rounded-xl text-xs font-bold hover:bg-[rgb(var(--color-border))] transition-colors flex items-center gap-1.5"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> {stu.instructorId ? 'Change' : 'Assign'} Instructor
                            </button>
                            
                            {stu.status === 'ACTIVE' ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(stu.id, 'DROPPED') }}
                                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1.5 ml-auto"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(stu.id, 'ACTIVE') }}
                                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5 ml-auto"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Payment History */}
                            <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-4">
                              <h4 className="text-sm font-bold text-[rgb(var(--color-text-2))] mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-emerald-600" /> Payment History
                              </h4>
                              {stu.payments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No payments recorded yet.</p>
                              ) : (
                                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                                  {stu.payments.map(p => (
                                    <div key={p.id} className="flex justify-between items-center text-xs bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-3 rounded-lg">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-[rgb(var(--color-text-1))] flex items-center gap-1">
                                          <IndianRupee className="w-3 h-3" />{p.amount.toLocaleString()}
                                        </span>
                                        {p.note && <span className="text-slate-400 mt-0.5">{p.note}</span>}
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="font-semibold text-[rgb(var(--color-text-3))]">{p.method}</span>
                                        <span className="text-slate-400">{new Date(p.receivedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Driving Test History */}
                            <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-4">
                              <h4 className="text-sm font-bold text-[rgb(var(--color-text-2))] mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-600" /> Driving Test History
                              </h4>
                              {stu.drivingTests.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No driving tests scheduled yet.</p>
                              ) : (
                                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                                  {stu.drivingTests.map(t => (
                                    <div key={t.id} className="flex justify-between items-center text-xs bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-3 rounded-lg">
                                      <div className="flex flex-col">
                                        <span className="font-bold text-[rgb(var(--color-text-1))]">
                                          Attempt #{t.attemptNo}
                                        </span>
                                        <span className="text-slate-400 mt-0.5">
                                          {new Date(t.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                          {t.testCenter ? ` • ${t.testCenter}` : ''}
                                        </span>
                                      </div>
                                      <span className={`px-2.5 py-1 rounded-lg font-bold ${
                                        t.result === 'PASS' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                                        t.result === 'FAIL' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                                        'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                      }`}>
                                        {t.result}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info row */}
                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[rgb(var(--color-text-3))]">
                            <span>Enrolled: {new Date(stu.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span>Sessions: {stu.totalSessions}</span>
                            {stu.balance > 0 && <span className="text-red-500 font-bold">Balance Due: ₹{stu.balance.toLocaleString()}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
            >
              {/* Close button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[rgb(var(--color-text-1))]">
                  {modal === 'payment' && '💰 Record Payment'}
                  {modal === 'test' && '🚗 Schedule Driving Test'}
                  {modal === 'fee' && '📋 Set Course Fee'}
                  {modal === 'assign' && '👨‍🏫 Assign Instructor'}
                  {modal === 'result' && '🏆 Record Test Result'}
                  {modal === 'create' && '👤 Create New Student'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-[rgb(var(--color-border))] rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Record Payment Form */}
              {modal === 'payment' && (
                <form onSubmit={handleRecordPayment} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Amount (₹)</label>
                    <input type="number" required min="1" placeholder="e.g. 5000"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Method</label>
                    <select
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Note (optional)</label>
                    <input type="text" placeholder="e.g. First installment"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={paymentForm.note} onChange={e => setPaymentForm({...paymentForm, note: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record Payment'}
                  </button>
                </form>
              )}

              {/* Schedule Test Form */}
              {modal === 'test' && (
                <form onSubmit={handleScheduleTest} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Test Date</label>
                    <input type="date" required
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={testForm.testDate} onChange={e => setTestForm({...testForm, testDate: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Test Center / RTO (optional)</label>
                    <input type="text" placeholder="e.g. Hyderabad RTO Office"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={testForm.testCenter} onChange={e => setTestForm({...testForm, testCenter: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Notes (optional)</label>
                    <input type="text" placeholder="e.g. Bring documents"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={testForm.notes} onChange={e => setTestForm({...testForm, notes: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Scheduling...' : 'Schedule Test'}
                  </button>
                </form>
              )}

              {/* Set Fee Form */}
              {modal === 'fee' && (
                <form onSubmit={handleSetFee} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Course Fee (₹)</label>
                    <input type="number" required min="0" placeholder="e.g. 8999"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={feeForm.courseFee} onChange={e => setFeeForm({...feeForm, courseFee: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Training Type</label>
                    <select
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={feeForm.trainingType} onChange={e => setFeeForm({...feeForm, trainingType: e.target.value})}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="RTO_FAST_TRACK">Fast Track (RTO)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Set Fee'}
                  </button>
                </form>
              )}

              {/* Assign Instructor Form */}
              {modal === 'assign' && (
                <form onSubmit={handleAssignInstructor} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Select Instructor</label>
                    {instructors.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No instructors found in system.</p>
                    ) : (
                      <select required
                        className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        value={assignForm.instructorId} onChange={e => setAssignForm({...assignForm, instructorId: e.target.value})}
                      >
                        <option value="">Choose instructor...</option>
                        {instructors.map(i => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button type="submit" disabled={submitting || instructors.length === 0}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Assigning...' : 'Assign Instructor'}
                  </button>
                </form>
              )}

              {/* Record Test Result Form */}
              {modal === 'result' && (
                <form onSubmit={handleRecordResult} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Result</label>
                    <div className="flex gap-3">
                      <button type="button"
                        onClick={() => setResultForm({...resultForm, result: 'PASS'})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          resultForm.result === 'PASS'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))]'
                        }`}
                      >
                        ✅ PASS
                      </button>
                      <button type="button"
                        onClick={() => setResultForm({...resultForm, result: 'FAIL'})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          resultForm.result === 'FAIL'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))]'
                        }`}
                      >
                        ❌ FAIL
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Notes (optional)</label>
                    <input type="text" placeholder="e.g. Needs more practice"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={resultForm.notes} onChange={e => setResultForm({...resultForm, notes: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record Result'}
                  </button>
                </form>
              )}

              {/* Create Student Form */}
              {modal === 'create' && (
                <form onSubmit={handleCreateStudent} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Full Name</label>
                    <input type="text" required
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Email Address</label>
                    <input type="email" required
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Phone Number (Optional)</label>
                    <input type="text"
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={createForm.phone} onChange={e => setCreateForm({...createForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Training Type</label>
                    <select
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={createForm.trainingType} onChange={e => setCreateForm({...createForm, trainingType: e.target.value})}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="RTO_FAST_TRACK">Fast Track (RTO)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[rgb(var(--color-text-2))]">Initial Password</label>
                    <input type="text" required
                      className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-5 py-3 bg-[rgb(var(--color-primary))] text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:bg-[rgb(var(--color-primary))]/90 disabled:opacity-50 mt-2"
                  >
                    {submitting ? 'Creating...' : 'Create Student'}
                  </button>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
