"use client"

import React, { useState } from 'react'
import { Plus, User, Camera, Loader2, Save } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/store/languageStore'

const PAGE_DICT = {
  EN: {
    pageTitle: 'Instructor Management',
    pageDesc: 'Create new instructors, manage their profiles, and view their utilization.',
    addNew: '{t.addNew}',
    createProfile: '{t.createProfile}',
    profilePic: '{t.profilePic}',
    fullName: '{t.fullName}',
    email: '{t.email}',
    phone: '{t.phone}',
    exp: '{t.exp}',
    initPass: '{t.initPass}',
    passDesc: 'The instructor will use this password to log in. They can change it later.',
    cancel: 'Cancel',
    save: '{t.save}',
    activeInstructors: 'Active Instructors',
    experience: 'Experience',
    years: 'Years',
    totalSessions: 'Total Sessions',
    noInstructors: 'No instructors found in the database.',
    useFormAbove: 'Use the form above to add your first instructor.',
    reqErr: 'Name, email, and password are required.',
    succ: 'Instructor created successfully!',
    fail: 'Failed to create instructor',
    err: 'An error occurred',
    uploadFail: 'Upload failed:'
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
    initPass: 'ప్రారంభ పాస్‌వర్డ్',
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

import { useRouter } from 'next/navigation'

export default function InstructorManagerClient({ initialInstructors = [] }: { initialInstructors?: any[] }) {
  const { language } = useLanguageStore()
  const activeLang = language.toUpperCase() as keyof typeof PAGE_DICT
  const t = PAGE_DICT[activeLang] || PAGE_DICT.EN

  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    experienceYears: '5'
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

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

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-[rgb(var(--color-text-1))]">{t.pageTitle}</h1>
        <p className="text-sm text-[rgb(var(--color-text-2))] mt-1">
          {t.pageDesc}
        </p>
      </div>

      
      {!isCreating ? (
        <button 
          onClick={() => setIsCreating(true)}
          className="w-max flex items-center gap-2 px-5 py-3 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl shadow-lg hover:bg-[rgb(var(--color-primary))]/90 transition"
        >
          <Plus className="w-5 h-5" />
          {t.addNew}
        </button>
      ) : (
        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-2xl shadow-app max-w-2xl">
          <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))] mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            {t.createProfile}
          </h2>

          <div className="flex flex-col gap-5">
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[rgb(var(--color-text-2))] uppercase font-mono flex items-center gap-2">
                <Camera className="w-4 h-4" /> {t.profilePic}
              </label>
              
              <div className="flex gap-4 items-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-xl object-cover border-2 border-[rgb(var(--color-primary))]" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[rgb(var(--color-void))] border-2 border-dashed border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-3))]">
                    <User className="w-8 h-8" />
                  </div>
                )}
                
                <div className="flex-1 max-w-[300px]">
                  <UploadDropzone
                    endpoint="profilePicture"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) setAvatarUrl(res[0].url)
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`${t.uploadFail} ${error.message}`)
                    }}
                    appearance={{
                      container: "border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-void))] rounded-xl p-2 h-32",
                      button: "bg-[rgb(var(--color-primary))] text-xs font-bold px-4 py-1.5 h-8 after:bg-white/20",
                      label: "text-[rgb(var(--color-primary))] text-xs",
                      allowedContent: "text-[rgb(var(--color-text-3))] text-[10px]"
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.fullName}</label>
                <input 
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.email}</label>
                <input 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.phone}</label>
                <input 
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.exp}</label>
                <input 
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={e => setForm({...form, experienceYears: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">{t.initPass}</label>
                <input 
                  type="text"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
                <span className="text-[10px] text-[rgb(var(--color-text-3))]">{t.passDesc}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[rgb(var(--color-border))]">
              <button 
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(var(--color-primary))] text-white font-bold text-xs rounded-xl shadow-lg hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

      <div className="mt-12">
        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] mb-6">{t.activeInstructors}</h3>
        
        {initialInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialInstructors.map((ins) => (
              <div key={ins.id} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {ins.user.avatarUrl ? (
                    <img src={ins.user.avatarUrl} alt={ins.user.name} className="w-14 h-14 rounded-full object-cover border border-[rgb(var(--color-border))]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] flex items-center justify-center font-bold text-lg text-[rgb(var(--color-text-3))]">
                      {ins.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-[rgb(var(--color-text-1))]">{ins.user.name}</h4>
                    <p className="text-xs text-[rgb(var(--color-text-3))]">{ins.user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-[rgb(var(--color-border))]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-[rgb(var(--color-text-2))]">{t.experience}</span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{ins.experienceYears} {t.years}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-[rgb(var(--color-text-2))]">{t.totalSessions}</span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{ins.sessions.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[rgb(var(--color-void))] border border-dashed border-[rgb(var(--color-border))] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-[rgb(var(--color-text-2))]">{t.noInstructors}</p>
            <p className="text-xs font-mono text-[rgb(var(--color-text-3))] mt-2">{t.useFormAbove}</p>
          </div>
        )}
      </div>

  )
}
