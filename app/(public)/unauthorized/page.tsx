"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedAccess() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow highlight rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Rotating Cyber Analytics wheel in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <svg className="w-[450px] h-[450px] animate-[spin_60s_linear_infinite] opacity-20" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="0.7" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" strokeDasharray="5,10" />
        </svg>
      </div>

      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 relative z-10">
        {/* Cinematic pulsating shield medallion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-danger/25 rounded-3xl blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-surface border border-danger/40 flex items-center justify-center text-danger relative z-10 shadow-lg shadow-danger/10">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
        </motion.div>

        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-danger font-bold">
            Security Status: 403 Forbidden
          </span>
          <h1 className="text-3xl font-extrabold text-text-1 font-display tracking-tight uppercase">
            Restricted Analytics
          </h1>
          <p className="text-xs text-text-3 leading-relaxed mt-2 px-4">
            Your active registry role is unauthorized for this coaching or command console. Please establish appropriate clearance parameters.
          </p>
        </div>

        {/* Action button cards */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <Link
            href="/login"
            className="w-full p-4 bg-surface border border-border hover:border-danger/30 rounded-2xl flex items-center justify-between transition-all duration-300 group text-left shadow-md hover:shadow-lg hover:shadow-danger/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger group-hover:scale-105 transition-transform duration-200">
                <KeyRound className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-1 group-hover:text-danger transition-colors duration-200">
                  Switch Account Credentials
                </span>
                <span className="text-[10px] text-text-3 font-mono mt-0.5">
                  Authenticate with authorized clearances
                </span>
              </div>
            </div>
            <span className="text-text-3 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>

          <Link
            href="/"
            className="w-full py-3.5 bg-void border border-border hover:bg-white/[0.02] text-text-2 hover:text-text-1 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Academy Terminal
          </Link>
        </div>

        {/* Interactive cockpit Analytics footer */}
        <footer className="border-t border-border/40 w-full pt-4 mt-6">
          <div className="flex justify-between items-center text-[8.5px] font-mono text-text-3">
            <span>GRID SYSTEM: SGDA-V1.0</span>
            <span>SHIELD ENFORCER: ACTIVE</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

