"use client"

import React, { useState } from 'react'
import { Plus, User, Camera, Loader2, Save, Edit2, Trash2, Shield, Sparkles, Link, Upload } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'
import { useRouter } from 'next/navigation'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Instructor Roster',
    pageDesc: 'Manage driving academy instructors, active credentials, and profile snapshots.',
    addNew: 'Add New Instructor',
    createProfile: 'Create Profile',
    profilePic: 'Profile Pic',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    exp: 'Experience (Yrs)',
    initPass: 'Initial Password',
    passDesc: 'Must be at least 6 chars',
    cancel: 'Cancel',
    save: 'Save Instructor',
    activeInstructors: 'Active Instructors',
    experience: 'Experience',
    years: 'Years',
    totalSessions: 'Total Sessions',
    noInstructors: 'No instructors found.',
    useFormAbove: 'Use the button above to add an instructor.',
    reqErr: 'Name, email, and password are required.',
    succ: 'Instructor created successfully!',
    fail: 'Failed to create instructor',
    err: 'An error occurred',
    uploadFail: 'Upload Failed'
  },
  HI: {
    pageTitle: 'प्रशिक्षक प्रबंधन',
    pageDesc: 'नए प्रशिक्षक बनाएं, उनके प्रोफाइल प्रबंधित करें, और उनके उपयोग को देखें।',
    addNew: 'नया प्रशिक्षक जोड़ें',
    createProfile: 'प्रशिक्षक प्रोफ़ाइल बनाएं',
    profilePic: 'प्रोफ़ाइल चित्र',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'फ़ोन नंबर',
    exp: 'अनुभव के वर्ष',
    initPass: 'प्रारंभिक पासवर्ड',
    passDesc: 'प्रशिक्षक इस पासवर्ड का उपयोग लॉग इन करने के लिए करेगा। वे इसे बाद में बदल सकते हैं।',
    cancel: 'रद्द करें',
    save: 'प्रशिक्षक सहेजें',
    activeInstructors: 'सक्रिय प्रशिक्षक',
    experience: 'अनुभव',
    years: 'वर्ष',
    totalSessions: 'कुल सत्र',
    noInstructors: 'डेटाबेस में कोई प्रशिक्षक नहीं मिला।',
    useFormAbove: 'अपना पहला प्रशिक्षक जोड़ने के लिए उपरोक्त फॉर्म का उपयोग करें।',
    reqErr: 'नाम, ईमेल और पासवर्ड आवश्यक हैं।',
    succ: 'प्रशिक्षक सफलतापूर्वक बनाया गया!',
    fail: 'प्रशिक्षक बनाने में विफल',
    err: 'एक त्रुटि हुई',
    uploadFail: 'अपलोड विफल:'
  },
  TE: {
    pageTitle: 'బోధకుల నిర్వహణ',
    pageDesc: 'కొత్త బోధకులను సృష్టించండి, వారి ప్రొఫైల్‌లను నిర్వహించండి మరియు వారి వినియోగాన్ని వీక్షించండి.',
    addNew: 'కొత్త బోధకుడిని జోడించండి',
    createProfile: 'బోధకుడి ప్రొఫైల్‌ను సృష్టించండి',
    profilePic: 'ప్రొఫైల్ చిత్రం',
    fullName: 'పూర్తి పేరు',
    email: 'ఈమెయిల్ చిరునామా',
    phone: 'ఫోన్ నంబర్',
    exp: 'అనుభవం (సంవత్సరాలు)',
    initPass: 'ప్రారంభ పాసవర్డ్',
    passDesc: 'లాగిన్ అవ్వడానికి బోధకుడు ఈ పాస్‌వర్డ్‌ను ఉపయోగిస్తారు. వారు తర్వాత దీన్ని మార్చుకోవచ్చు.',
    cancel: 'రద్దు చేయండి',
    save: 'బోధకుడిని సేవ్ చేయండి',
    activeInstructors: 'క్రియాశీల బోధకులు',
    experience: 'అనుభవం',
    years: 'సంవత్సరాలు',
    totalSessions: 'మొత్తం సెషన్లు',
    noInstructors: 'డేటాబేస్‌లో బోధకులు ఎవరూ కనుగొనబడలేదు.',
    useFormAbove: 'మీ మొదటి బోధకుడిని జోడించడానికి పై ఫారమ్‌ను ఉపయోగించండి.',
    reqErr: 'పేరు, ఇమెయిల్ మరియు పాస్‌వర్డ్ అవసరం.',
    succ: 'బోధకుడు విజయవంతంగా సృష్టించబడ్డారు!',
    fail: 'బోధకుడిని సృష్టించడం విఫలమైంది',
    err: 'ఒక లోపం ఏర్పడింది',
    uploadFail: 'అప్‌లోడ్ విఫలమైంది:'
  }
}

export default function InstructorManagerClient({ initialInstructors = [] }: { initialInstructors?: any[] }) {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<any>(null)
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    experienceYears: '5'
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const { startUpload } = useUploadThing("profilePicture", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url
      if (url) {
        if (editingInstructor) {
          setEditingInstructor({
            ...editingInstructor,
            user: { ...editingInstructor.user, avatarUrl: url }
          })
        } else {
          setAvatarUrl(url)
        }
        toast.success("Uploaded successfully to your image bucket!")
      }
      setIsUploadingAvatar(false)
    },
    onUploadError: (error: Error) => {
      toast.error(`${t.uploadFail} ${error.message}`)
      setIsUploadingAvatar(false)
    }
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingAvatar(true)
    await startUpload([file])
  }

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error(t.reqErr)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          avatarUrl
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(t.succ)
        setIsCreating(false)
        setForm({ name: '', email: '', phone: '', password: '', experienceYears: '5' })
        setAvatarUrl(null)
        router.refresh()
      } else {
        toast.error(data.error || t.fail)
      }
    } catch (e) {
      toast.error(t.err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInstructor) return
    
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/instructors/${editingInstructor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingInstructor.user.name,
          email: editingInstructor.user.email,
          phone: editingInstructor.user.phone,
          experienceYears: editingInstructor.yearsExp,
          avatarUrl: editingInstructor.user.avatarUrl,
          specialization: editingInstructor.specialization,
          bio: editingInstructor.bio
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Instructor profile updated successfully!')
        setEditingInstructor(null)
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(t.err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to completely remove this instructor?\n\nThis will permanently delete their account, scheduled sessions, slot templates, and unassign any active students.')) return
    
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Instructor successfully removed!')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to remove instructor')
      }
    } catch (err) {
      toast.error(t.err)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 px-1 md:px-0">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">{t.pageTitle}</h1>
          <p className="text-sm text-text-3 mt-2">
            {t.pageDesc}
          </p>
        </div>

        {!isCreating ? (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-max flex items-center gap-2 px-5 py-3 bg-primary text-void font-bold rounded-xl shadow-lg hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5 animate-pulse" />
            {t.addNew}
          </button>
        ) : (
          <div className="bg-surface border border-border p-5 md:p-6 rounded-3xl shadow-2xl max-w-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h2 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t.createProfile}
            </h2>

            <div className="flex flex-col gap-5">
              {/* Profile Image Select via Uploadthing Image Bucket */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-text-3 uppercase font-mono flex items-center gap-2">
                  <Camera className="w-4 h-4" /> {t.profilePic}
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-void/50 p-4 rounded-2xl border border-border/50">
                  {avatarUrl ? (
                    <div className="relative shrink-0 mx-auto sm:mx-0">
                      <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary" />
                      <button onClick={() => setAvatarUrl(null)} className="absolute -top-1.5 -right-1.5 p-1 bg-danger text-white rounded-full text-[10px] leading-none hover:bg-danger/80">&times;</button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-void border-2 border-dashed border-border flex items-center justify-center text-text-3 shrink-0 mx-auto sm:mx-0">
                      <User className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  
                  <div className="flex-1 w-full flex flex-col gap-3">
                    <label className={`
                      flex flex-col items-center justify-center gap-1.5 w-full py-4 px-3 rounded-2xl cursor-pointer border border-dashed transition-all h-24
                      ${isUploadingAvatar 
                        ? 'border-primary bg-primary/10 cursor-wait' 
                        : 'border-border bg-void hover:border-primary/50 hover:bg-primary/5'
                      }
                    `}>
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-[10px] text-primary font-bold">Uploading to cloud...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-text-3" />
                          <span className="text-[10px] text-text-2 font-semibold">Click to upload photo</span>
                          <span className="text-[8px] text-text-3 font-mono">Max 4MB (PNG, JPG, WEBP)</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="h-[1px] bg-border/50 flex-1"></div>
                      <span className="text-[9px] text-text-3 uppercase font-mono font-bold">Or Paste CDN Link</span>
                      <div className="h-[1px] bg-border/50 flex-1"></div>
                    </div>

                    <div className="relative">
                      <Link className="w-3.5 h-3.5 text-text-3 absolute left-3 top-3" />
                      <input 
                        type="text"
                        value={avatarUrl || ''}
                        onChange={e => setAvatarUrl(e.target.value)}
                        placeholder="https://utfs.io/f/... or other direct URL"
                        className="bg-void border border-border/70 text-white rounded-xl pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-3 uppercase font-mono">{t.fullName}</label>
                  <input 
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Enter full name"
                    className="bg-void border border-border text-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-3 uppercase font-mono">{t.email}</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="example@sriguru.in"
                    className="bg-void border border-border text-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-3 uppercase font-mono">{t.phone}</label>
                  <input 
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="Phone number"
                    className="bg-void border border-border text-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-text-3 uppercase font-mono">{t.exp}</label>
                  <input 
                    type="number"
                    min="0"
                    value={form.experienceYears}
                    onChange={e => setForm({...form, experienceYears: e.target.value})}
                    className="bg-void border border-border text-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold text-text-3 uppercase font-mono">{t.initPass}</label>
                  <input 
                    type="text"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Secure password"
                    className="bg-void border border-border text-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-text-3">{t.passDesc}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-text-3 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-primary text-void font-bold text-xs rounded-xl shadow-lg hover:bg-primary/95 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 px-1 md:px-0">
        <h3 className="text-xl font-extrabold font-display text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          {t.activeInstructors}
        </h3>
        
        {initialInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialInstructors.map((ins) => (
              <div key={ins.id} className="bg-surface border border-border rounded-3xl p-5 shadow-xl flex flex-col gap-4 relative group hover:border-primary/40 transition-all duration-300">
                
                {/* Action Buttons: Always visible on Mobile, Hover overlay on Desktop */}
                <div className="absolute top-4 right-4 flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingInstructor({
                      id: ins.id,
                      user: {
                        name: ins.user.name || '',
                        email: ins.user.email || '',
                        phone: ins.user.phone || '',
                        avatarUrl: ins.user.avatarUrl || ''
                      },
                      yearsExp: ins.yearsExp || 0,
                      specialization: ins.specialization || '',
                      bio: ins.bio || ''
                    })}
                    className="p-1.5 bg-void hover:bg-white/10 rounded-lg text-text-2 hover:text-white transition-all shadow-md border border-border/50"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-primary" />
                  </button>
                  <button 
                    onClick={() => handleDelete(ins.id)}
                    className="p-1.5 bg-void hover:bg-danger/20 hover:text-danger rounded-lg text-text-2 transition-all shadow-md border border-border/50"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {ins.user.avatarUrl ? (
                    <img src={ins.user.avatarUrl} alt={ins.user.name} className="w-14 h-14 rounded-full object-cover border border-border shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-void border border-border flex items-center justify-center font-bold text-lg text-primary shrink-0">
                      {ins.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="pr-16 sm:pr-0">
                    <h4 className="font-bold text-white text-base truncate max-w-[140px] xs:max-w-none">{ins.user.name}</h4>
                    <p className="text-xs text-text-3 mt-0.5 truncate max-w-[140px] xs:max-w-none">{ins.user.email}</p>
                    {ins.specialization && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-success/20 text-success text-[9px] uppercase font-mono font-bold rounded">
                        {ins.specialization}
                      </span>
                    )}
                  </div>
                </div>
                
                {ins.bio && (
                  <p className="text-xs text-text-2 line-clamp-2 leading-relaxed bg-void/50 p-2.5 rounded-xl border border-border/50">
                    "{ins.bio}"
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-text-3">{t.experience}</span>
                    <span className="text-sm font-bold text-white mt-0.5">
                      {ins.yearsExp || 0} {t.years}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-text-3">{t.totalSessions}</span>
                    <span className="text-sm font-bold text-white mt-0.5">{ins.sessions?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-void border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-text-2">{t.noInstructors}</p>
            <p className="text-xs font-mono text-text-3 mt-2">{t.useFormAbove}</p>
          </div>
        )}
      </div>

      {/* Floating Edit Instructor Modal - Perfectly Responsive & Beautiful on Mobile */}
      {editingInstructor && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-2" onClick={() => setEditingInstructor(null)}>
          <div 
            className="bg-surface border border-border rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md max-h-[82vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-void/50 shrink-0">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                Edit Instructor Profile
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingInstructor(null)} 
                className="text-text-3 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-all"
              >
                &times;
              </button>
            </div>

            {/* Modal Form Contents (Scrollable inside) */}
            <form onSubmit={handleUpdate} className="p-4 flex flex-col gap-3.5 overflow-y-auto flex-1 bg-void/25">
              
              {/* Profile Image via Uploadthing Image Bucket */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Profile Image</label>
                <div className="flex flex-col gap-3 bg-void/50 p-3 rounded-xl border border-border/50">
                  <div className="flex gap-4 items-center justify-center sm:justify-start">
                    {editingInstructor.user.avatarUrl ? (
                      <div className="relative shrink-0">
                        <img src={editingInstructor.user.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-xl object-cover border-2 border-primary" />
                        <button 
                          type="button" 
                          onClick={() => setEditingInstructor({
                            ...editingInstructor,
                            user: { ...editingInstructor.user, avatarUrl: '' }
                          })} 
                          className="absolute -top-1.5 -right-1.5 p-1 bg-danger text-white rounded-full text-[9px] leading-none hover:bg-danger/80"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-void border border-border flex items-center justify-center text-text-3 shrink-0">
                        <User className="w-6 h-6 opacity-40" />
                      </div>
                    )}

                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      <label className={`
                        flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl cursor-pointer border border-dashed transition-all h-14
                        ${isUploadingAvatar 
                          ? 'border-primary bg-primary/10 cursor-wait' 
                          : 'border-border bg-void hover:border-primary/50 hover:bg-primary/5'
                        }
                      `}>
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-[9px] text-primary font-bold">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-text-3" />
                            <span className="text-[9px] text-text-2 font-semibold">Click to upload photo</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-[1px] bg-border/50 flex-1"></div>
                    <span className="text-[8px] text-text-3 uppercase font-mono font-bold">Or Paste CDN Link</span>
                    <div className="h-[1px] bg-border/50 flex-1"></div>
                  </div>

                  <div className="relative">
                    <Link className="w-3 h-3 text-text-3 absolute left-2.5 top-2.5" />
                    <input 
                      type="text"
                      value={editingInstructor.user.avatarUrl || ''}
                      onChange={e => setEditingInstructor({
                        ...editingInstructor,
                        user: { ...editingInstructor.user, avatarUrl: e.target.value }
                      })}
                      placeholder="Paste image link directly..."
                      className="bg-void border border-border/70 text-white rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium outline-none focus:border-primary w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={editingInstructor.user.name}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      user: { ...editingInstructor.user, name: e.target.value }
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={editingInstructor.user.email}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      user: { ...editingInstructor.user, email: e.target.value }
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Phone Number</label>
                  <input 
                    type="text" 
                    value={editingInstructor.user.phone}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      user: { ...editingInstructor.user, phone: e.target.value }
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Experience (Years) *</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={editingInstructor.yearsExp}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      yearsExp: parseInt(e.target.value) || 0
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Specialization</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Defensive LMV, Automatic Transmission"
                    value={editingInstructor.specialization}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      specialization: e.target.value
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-text-3 uppercase font-mono">Bio & Summary</label>
                  <textarea 
                    rows={2.5}
                    placeholder="Brief description of the instructor's background and teaching philosophy..."
                    value={editingInstructor.bio}
                    onChange={e => setEditingInstructor({
                      ...editingInstructor,
                      bio: e.target.value
                    })}
                    className="bg-void border border-border text-white rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary w-full resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-border shrink-0">
                <button 
                  type="button"
                  onClick={() => setEditingInstructor(null)}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-text-3 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-success text-void font-bold text-xs rounded-xl shadow-lg hover:bg-success/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
