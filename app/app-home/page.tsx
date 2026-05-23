"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AppHome() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (via cookie/localstorage or just redirect to login)
    // For now, redirect to login since middleware will handle dashboard redirection if logged in.
    const timer = setTimeout(() => {
      router.replace('/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H7.3a2 2 0 0 0-1.6.8L3 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1-4 0m0 0H9m-6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1-4 0" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-black font-display tracking-tight text-white uppercase">
          Sri Guru Driving
        </h1>
        
        <div className="flex items-center gap-2 text-text-3 font-mono text-sm mt-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Loading App...</span>
        </div>
      </div>
    </div>
  )
}
