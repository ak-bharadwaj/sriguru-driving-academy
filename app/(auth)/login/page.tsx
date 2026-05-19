"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  HelpCircle
} from 'lucide-react'

export default function AcademySignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Please provide both email/phone and password details')
      return
    }

    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false
      })

      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Invalid email or password combination' : res.error)
        setLoading(false)
      } else {
        // Authenticated successfully! Fetch user session to determine role redirect
        const sessionRes = await fetch('/api/auth/session')
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          const role = sessionData?.user?.role || 'STUDENT'
          
          if (role === 'ADMIN') {
            router.push('/admin/dashboard')
          } else if (role === 'INSTRUCTOR') {
            router.push('/instructor/dashboard')
          } else {
            router.push('/student/dashboard')
          }
        } else {
          router.push('/student/dashboard')
        }
      }
    } catch (err) {
      setError('An unexpected validation error occurred during sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body flex overflow-hidden">
      
      {/* ----------------------------------------------------
          LEFT 50% PANEL: BRANDING + ROAD VISUAL (SVG)
          ---------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-border relative flex-col justify-between p-12 select-none overflow-hidden">
        
        {/* Repeating road-lane visual SVG */}
        <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
          <svg className="w-[140px] h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="100" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="10, 15" />
          </svg>
        </div>

        <div>
          <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest block">
            SRI GURU AUTH PORTAL
          </span>
          <h2 className="text-3xl font-extrabold text-text-1 font-display tracking-tight uppercase mt-1">
            The future of<br />driving education
          </h2>
        </div>

        {/* Conceptual visual dashboard card */}
        <div className="relative bg-void/50 border border-border p-6 rounded-2xl flex flex-col gap-4 max-w-sm z-10 mx-auto">
          <div className="flex justify-between items-center text-[10px] font-mono text-text-3 uppercase">
            <span>COCKPIT TELEMETRIES</span>
            <span className="text-accent animate-pulse">● LIVE CONNECTION</span>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-primary to-transparent w-3/4 rounded-full" />
          
          <p className="text-xs text-text-2 leading-relaxed">
            Access customized student roadmaps, real-time instructor feedback logs, and dynamic RTO examinations instantly.
          </p>

          <div className="flex gap-4 font-mono text-[9px] text-text-3 border-t border-border/40 pt-3 uppercase">
            <span>LMV manual</span>
            <span>•</span>
            <span>defensive friction</span>
          </div>
        </div>

        <div className="text-[9px] font-mono text-text-3 uppercase">
          © 2024 SRI GURU DRIVING ACADEMY
        </div>

      </div>

      {/* ----------------------------------------------------
          RIGHT 50% PANEL: LOGIN FORM
          ---------------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 py-12 relative">
        
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto flex flex-col gap-8 text-left">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-1 font-display tracking-tight uppercase">
              Sign In to Academy
            </h1>
            <p className="text-xs text-text-2 mt-1.5 font-medium leading-relaxed font-body">
              Provide your credential registries to access dashboards.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email/Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-3 uppercase font-bold">Email or Phone Registry</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  type="text"
                  required
                  placeholder="student@sriguru.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <label className="text-text-3 uppercase font-bold">Account Password</label>
                <a 
                  href="/forgot-password" 
                  className="text-primary hover:underline uppercase font-bold"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border focus:border-primary pl-10 pr-12 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-3 hover:text-text-2 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Inline Error Displays (No toasts) */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-danger/10 border border-danger/25 text-danger px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40"
            >
              {loading ? 'Validating Registry...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </form>

          {/* New student booking link */}
          <div className="text-center border-t border-border/80 pt-6 font-mono text-[10px]">
            <span className="text-text-3 uppercase">New cadet? </span>
            <a 
              href="/booking" 
              className="text-accent hover:underline uppercase font-bold ml-1"
            >
              Book a Trial Demo first
            </a>
          </div>

        </div>

      </div>

    </div>
  )
}
