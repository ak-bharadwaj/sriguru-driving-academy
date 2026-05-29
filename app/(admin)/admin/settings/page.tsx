"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Settings, Upload, Save, CheckCircle2, Building2, Image as ImageIcon } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

export default function SettingsPage() {
  const { academyName, logoUrl, setAcademyName, setLogoUrl } = useSettingsStore()
  
  const [localName, setLocalName] = useState(academyName)
  const [localLogo, setLocalLogo] = useState<string | null>(logoUrl)
  const [isSaved, setIsSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLocalLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setAcademyName(localName)
    setLogoUrl(localLogo)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 lg:p-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">Admin Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-1 font-display tracking-tight uppercase">
            Platform Settings
          </h1>
          <p className="text-text-3 mt-2 text-sm max-w-xl">
            Configure global branding, academy name, and platform-wide defaults. These changes reflect instantly across the entire application, including student certificates.
          </p>
        </header>

        {/* Settings Form */}
        <div className="bg-surface/50 border border-border rounded-3xl p-8 backdrop-blur-md shadow-xl flex flex-col gap-8">
          
          {/* Academy Name */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-bold text-text-1 uppercase tracking-wider font-mono">
              <Building2 className="w-4 h-4 text-primary" />
              Academy Name
            </label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="e.g. Sri Guru Driving Academy"
              className="bg-void border border-border rounded-xl px-5 py-3.5 text-text-1 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <p className="text-[10px] text-text-3 font-mono">This name will appear in the navigation bar and on official certificates.</p>
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-bold text-text-1 uppercase tracking-wider font-mono">
              <ImageIcon className="w-4 h-4 text-primary" />
              Official Logo
            </label>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Logo Preview */}
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-void flex items-center justify-center overflow-hidden shrink-0 relative group">
                {localLogo ? (
                  <img src={localLogo} alt="Academy Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-text-3 opacity-50" />
                )}
                
                {/* Hover Overlay */}
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-void/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                >
                  <Upload className="w-6 h-6 text-primary mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-1">Change</span>
                </div>
              </div>

              <div className="flex-1">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden" 
                />
                <button 
                  onClick={triggerFileInput}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-text-1 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 mb-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Image
                </button>
                <p className="text-[10px] text-text-3 font-mono leading-relaxed">
                  Recommended size: 256x256px. Supported formats: PNG, JPG, SVG.<br/>
                  Transparent background PNGs work best for the top navigation bar.
                </p>
                {localLogo && (
                  <button 
                    onClick={() => setLocalLogo(null)}
                    className="text-[10px] text-red-400 hover:text-red-300 font-mono mt-2 transition-colors uppercase tracking-wider font-bold"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-border/50 my-2" />

          {/* Save Action */}
          <div className="flex justify-end items-center gap-4">
            {isSaved && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-success text-xs font-bold uppercase tracking-wider"
              >
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved
              </motion.span>
            )}
            <button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
