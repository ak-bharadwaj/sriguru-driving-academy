"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, CarFront } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

// ELEGANT SPRING VARIANTS
const fadeUpSpring = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 70, damping: 20 } }
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
} as const

export default function CentralLoginHub() {
  const router = useRouter()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (res?.error) {
        setErrorMsg('Invalid credentials. Please try again.')
        setIsAuthenticating(false)
      } else {
        const session = await getSession()
        const role = (session?.user as { role?: string })?.role

        if (role === 'ADMIN') router.push('/admin/students')
        else if (role === 'INSTRUCTOR') router.push('/instructor/schedule')
        else router.push('/student/dashboard')
      }
    } catch {
      setErrorMsg('An unexpected error occurred.')
      setIsAuthenticating(false)
    }
  }
  const handleGoogleLogin = async () => {
    setIsAuthenticating(true)
    setErrorMsg('')
    try {
      // signIn with Google will redirect; role-based redirect handled in middleware
      await signIn('google', { callbackUrl: '/student/dashboard' })
    } catch {
      setErrorMsg('Google sign-in failed. Please try again.')
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-void relative overflow-hidden font-body px-4 py-8">
      {/* ----------------------------------------------------
          CINEMATIC BACKGROUND
          ---------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-void to-void" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/images/grid.svg')] opacity-5" />
      </div>

      {/* ----------------------------------------------------
          GLASSMORPHISM LOGIN CARD
          ---------------------------------------------------- */}
      <motion.div 
        variants={fadeUpSpring}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[480px] flex flex-col"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <CarFront className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-text-1 mb-2">
            {t('auth.title1')} <span className="text-primary">{t('auth.title2')}</span>
          </h1>
          <p className="text-sm text-text-3 font-medium px-4">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Auth Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface/80 backdrop-blur-xl border border-border/50 shadow-app-hover rounded-[32px] p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-accent" />

          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-text-1 mb-1 tracking-tight">
              {t('auth.welcome')}
            </h2>
            <p className="text-text-3 text-sm font-medium">
              {t('auth.welcomeSub')}
            </p>
            
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-danger/10 border border-danger/20 text-danger text-sm rounded-2xl font-medium flex items-center gap-3"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-sm text-gray-700 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 mb-2"
          >
            {/* Google Logo SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('auth.google')}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-[11px] font-mono text-text-3 uppercase tracking-widest">{t('auth.orEmail')}</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-3 ml-1 font-mono uppercase tracking-widest">{t('auth.email')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-3 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-void/30 hover:bg-void/50 border border-border/50 rounded-2xl pl-12 pr-4 py-4 text-text-1 placeholder:text-text-3/50 focus:outline-none focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm font-body text-sm font-medium"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-text-3 ml-1 font-mono uppercase tracking-widest">{t('auth.pass')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-3 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-void/30 hover:bg-void/50 border border-border/50 rounded-2xl pl-12 pr-4 py-4 text-text-1 placeholder:text-text-3/50 focus:outline-none focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm font-body text-sm font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full mt-6 py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-display tracking-wide">{t('auth.authBtn')}</span>
                </>
              ) : (
                <>
                  <span className="font-display tracking-wide text-[15px]">{t('auth.loginBtn')}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            
            <div className="mt-2 text-center flex flex-col items-center justify-center">
              <span className="text-[13px] text-text-3 font-medium">{t('auth.signupPrompt')}</span>
              <button 
                type="button" 
                onClick={() => router.push('/booking')}
                className="mt-1 text-[13px] text-primary font-bold hover:underline transition-all"
              >
                {t('auth.signupBtn')}
              </button>
            </div>
          </form>

        </motion.div>

        {/* Bottom Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-full border border-border backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-[11px] font-mono text-text-2 uppercase tracking-wider">{t('auth.security')}</span>
          </div>
          <button type="button" className="text-xs text-text-3 font-medium hover:text-primary transition-colors">
            {t('auth.support')}
          </button>
        </motion.div>

      </motion.div>
    </div>
  )
}
