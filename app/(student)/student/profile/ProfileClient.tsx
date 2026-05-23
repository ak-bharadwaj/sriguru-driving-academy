"use client"

import React, { useState } from 'react'
import { Edit2, Save, X, Loader2, Camera, Shield, User, LogOut } from 'lucide-react'
import { updateProfile, updateAvatar, changePassword } from './actions'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

interface ProfileClientProps {
  initialUser: {
    id: string
    name: string
    email: string
    phone: string | null
    trainingType: string
    avatarUrl?: string | null
  }
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: initialUser.name,
    phone: initialUser.phone || ''
  })
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || null)
  
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await updateProfile(formData)
      if (res.success) {
        setIsEditing(false)
      } else {
        alert(res.error)
      }
    } catch (e) {
      alert('Failed to save profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!")
      return
    }

    setIsPasswordSaving(true)
    try {
      const res = await changePassword(passwordForm.newPassword)
      if (res.success) {
        toast.success("Password changed successfully!")
        setIsChangingPassword(false)
        setPasswordForm({ newPassword: '', confirmPassword: '' })
      } else {
        toast.error(res.error || "Failed to change password")
      }
    } catch (e) {
      toast.error('Failed to change password.')
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      try {
         const updateRes = await updateAvatar(base64)
         if (updateRes.success) {
           setAvatarUrl(base64)
           toast.success('Avatar updated successfully!')
         } else {
           toast.error('Failed to update avatar in database.')
         }
      } catch(err) {
         toast.error('Upload failed')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-[28px] shadow-app p-6 border border-[rgb(var(--color-border))] relative z-10 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))]">User information:</h3>
        
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsEditing(false)
                setFormData({ name: initialUser.name, phone: initialUser.phone || '' })
              }}
              disabled={isSaving}
              className="p-2 border-2 border-[rgb(var(--color-text-3))] rounded-full text-[rgb(var(--color-text-3))] hover:bg-[rgb(var(--color-text-3))]/10 transition disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 border-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] rounded-full text-white hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 border-2 border-[rgb(var(--color-primary))] rounded-full text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 transition"
          >
            <Edit2 className="w-5 h-5 fill-current" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {/* AVATAR DISPLAY */}
        <div className="flex items-center gap-4 mb-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-[rgb(var(--color-primary))]" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-void))] border-2 border-dashed border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-3))]">
              <User className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[rgb(var(--color-text-1))]">Profile Picture</span>
            <span className="text-[10px] text-[rgb(var(--color-text-3))] font-mono">Visible to instructors & admins</span>
          </div>
        </div>

        {/* NAME */}
        <div className="flex justify-between items-center border-b border-[rgb(var(--color-border))] pb-4">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Name:</span>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="text-sm text-[rgb(var(--color-text-1))] font-medium text-right bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-1 outline-none focus:border-[rgb(var(--color-primary))]"
            />
          ) : (
            <span className="text-sm text-[rgb(var(--color-text-1))] font-medium">{formData.name}</span>
          )}
        </div>
        
        {/* EMAIL (Readonly) */}
        <div className="flex justify-between items-center border-b border-[rgb(var(--color-border))] pb-4">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Email:</span>
          <span className="text-sm text-[rgb(var(--color-text-3))] font-medium">{initialUser.email}</span>
        </div>
        
        {/* PHONE */}
        <div className="flex justify-between items-center border-b border-[rgb(var(--color-border))] pb-4">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Phone:</span>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+ Not provided"
              className="text-sm text-[rgb(var(--color-text-1))] font-medium text-right bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-1 outline-none focus:border-[rgb(var(--color-primary))]"
            />
          ) : (
            <span className="text-sm text-[rgb(var(--color-text-1))] font-medium">{formData.phone || '+ Not provided'}</span>
          )}
        </div>
        
        {/* COURSE (Readonly) */}
        <div className="flex justify-between items-center border-b border-[rgb(var(--color-border))] pb-4">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Course:</span>
          <span className="text-sm text-[rgb(var(--color-text-1))] font-medium text-right max-w-[180px] truncate">{initialUser.trainingType} Training</span>
        </div>
        
        {/* REG NO (Readonly) */}
        <div className="flex justify-between items-center pb-4 border-b border-[rgb(var(--color-border))]">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Reg no:</span>
          <span className="text-sm text-[rgb(var(--color-text-1))] font-medium">{initialUser.id.substring(0, 8)}</span>
        </div>

        {/* AVATAR UPLOAD */}
        <div className="flex flex-col gap-3 pt-2">
          <span className="text-sm font-semibold text-[rgb(var(--color-text-2))] flex items-center gap-2">
            <Camera className="w-4 h-4" /> Update Profile Picture
          </span>
          <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-2xl p-4">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleAvatarUpload}
              className="block w-full text-sm text-[rgb(var(--color-text-3))]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[rgb(var(--color-primary))] file:text-white
                hover:file:bg-[rgb(var(--color-primary))]/80
                cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECURITY / CHANGE PASSWORD */}
      <div className="mt-10 pt-8 border-t border-[rgb(var(--color-border))]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-display text-[rgb(var(--color-text-1))] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[rgb(var(--color-primary))]" /> Security
          </h3>
          
          {isChangingPassword ? (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setIsChangingPassword(false)
                  setPasswordForm({ newPassword: '', confirmPassword: '' })
                }}
                disabled={isPasswordSaving}
                className="p-2 border-2 border-[rgb(var(--color-text-3))] rounded-full text-[rgb(var(--color-text-3))] hover:bg-[rgb(var(--color-text-3))]/10 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePasswordSave}
                disabled={isPasswordSaving}
                className="p-2 border-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] rounded-full text-white hover:bg-[rgb(var(--color-primary))]/90 transition disabled:opacity-50"
              >
                {isPasswordSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 text-sm font-bold border-2 border-[rgb(var(--color-primary))] rounded-full text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 transition"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className="flex flex-col gap-4 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-2xl p-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--color-text-2))]">New Password:</label>
              <input 
                type="password" 
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Enter new password"
                className="text-sm text-[rgb(var(--color-text-1))] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(var(--color-primary))]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--color-text-2))]">Confirm Password:</label>
              <input 
                type="password" 
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                className="text-sm text-[rgb(var(--color-text-1))] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(var(--color-primary))]"
              />
            </div>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))] flex justify-center">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

    </div>
  )
}
