"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'

export default function ForgotPasswordRequest() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResetToken(null)

    if (!email.trim()) {
      setError('Please provide your registered email address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await res.json()
      if (res.ok) {
        setResetToken(data.resetToken)
      } else {
        setError(data.error || 'Failed to trigger password recovery')
      }
    } catch (err) {
      setError('Connection failure during password reset operation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body flex items-center justify-center p-6 relative">
      
      {/* Glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-surface border border-border p-8 rounded-3xl shadow-2xl relative z-10 text-left">
        
        <header className="mb-6">
          <button
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-1 text-[10px] font-mono text-text-3 hover:text-text-2 uppercase font-bold mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>

          <h1 className="text-xl md:text-2xl font-extrabold text-text-1 font-display tracking-tight uppercase">
            Recover Password
          </h1>
          <p className="text-xs text-text-2 mt-1 leading-relaxed">
            Enter your email to request recovery variables.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-text-3 uppercase font-bold">Account Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
              <input
                type="email"
                required
                placeholder="cadet@sriguru.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-void/60 border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-xs text-text-1 placeholder-text-3 transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Error displays */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-danger/10 border border-danger/25 text-danger px-3.5 py-2.5 rounded-xl flex items-start gap-2 text-xs font-semibold"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Token Display (Developer Assist Mode) */}
          <AnimatePresence>
            {resetToken && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/10 border border-success/20 p-5 rounded-2xl flex flex-col gap-3 text-xs"
              >
                <div className="flex items-center gap-1.5 text-success font-bold font-mono text-[10px] uppercase">
                  <CheckCircle className="w-4 h-4" />
                  <span>Recovery Token Acquired!</span>
                </div>
                
                <p className="text-text-2 leading-relaxed">
                  A reset token has been registered in the database for local verification.
                </p>

                <div className="bg-void/60 border border-border p-3.5 rounded-xl text-center text-accent font-mono font-bold tracking-wider select-all">
                  {resetToken}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200"
          >
            {loading ? 'Processing Recovery...' : 'Generate Reset Token'}
          </button>

        </form>

      </div>

    </div>
  )
}
