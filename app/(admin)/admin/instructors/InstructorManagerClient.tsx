"use client"

import React, { useState } from 'react'
import { Plus, User, Camera, Loader2, Save } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function InstructorManagerClient() {
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
      toast.error('Name, email, and password are required.')
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
        toast.success('Instructor created successfully!')
        setIsCreating(false)
        setForm({ name: '', email: '', phone: '', password: '', experienceYears: '5' })
        setAvatarUrl(null)
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to create instructor')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {!isCreating ? (
        <button 
          onClick={() => setIsCreating(true)}
          className="w-max flex items-center gap-2 px-5 py-3 bg-[rgb(var(--color-primary))] text-white font-bold rounded-xl shadow-lg hover:bg-[rgb(var(--color-primary))]/90 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Instructor
        </button>
      ) : (
        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] p-6 rounded-2xl shadow-app max-w-2xl">
          <h2 className="text-xl font-bold font-display text-[rgb(var(--color-text-1))] mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            Create Instructor Profile
          </h2>

          <div className="flex flex-col gap-5">
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[rgb(var(--color-text-2))] uppercase font-mono flex items-center gap-2">
                <Camera className="w-4 h-4" /> Profile Picture
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
                      toast.error(`Upload failed: ${error.message}`)
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
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Full Name</label>
                <input 
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Email Address</label>
                <input 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Phone Number</label>
                <input 
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Years of Experience</label>
                <input 
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={e => setForm({...form, experienceYears: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-[rgb(var(--color-text-2))] uppercase font-mono">Initial Password</label>
                <input 
                  type="text"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[rgb(var(--color-primary))]"
                />
                <span className="text-[10px] text-[rgb(var(--color-text-3))]">The instructor will use this password to log in. They can change it later.</span>
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
                Save Instructor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
