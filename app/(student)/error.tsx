"use client"

import React, { useEffect } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export default function StudentDashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Student routing domain caught error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-void text-text-1 font-body flex items-center justify-center p-6 relative">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-danger/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-surface border border-border p-8 rounded-3xl shadow-2xl relative z-10 text-center flex flex-col items-center gap-6">
        
        <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/25 flex items-center justify-center text-danger">
          <AlertOctagon className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-[10px] font-mono text-danger uppercase font-bold tracking-wider">Operational Fault</span>
          <h2 className="text-xl font-extrabold text-text-1 font-display tracking-tight uppercase mt-1">
            Cadet Cockpit Error
          </h2>
          <p className="text-xs text-text-2 mt-2 leading-relaxed font-medium">
            Next.js routing has stalled. Please trigger reset switches to restart cockpit telemetries.
          </p>
        </div>

        {error.digest && (
          <span className="text-[8px] font-mono bg-void/60 border border-border px-3 py-1 rounded text-text-3 select-all">
            DIGEST: {error.digest}
          </span>
        )}

        <button
          onClick={() => reset()}
          className="w-full py-3 bg-danger hover:bg-danger/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-danger/10 flex items-center justify-center gap-1.5 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Re-initialize Cockpit
        </button>

      </div>

    </div>
  )
}
