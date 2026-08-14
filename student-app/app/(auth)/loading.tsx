import React from 'react'

export default function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 flex items-center justify-center animate-pulse">
      <div className="max-w-md w-full bg-surface border border-border p-8 rounded-3xl flex flex-col gap-6">
        <div className="w-1/2 h-8 bg-void/50 rounded-lg mx-auto" />
        <div className="w-full h-12 bg-void/50 rounded-xl" />
        <div className="w-full h-12 bg-void/50 rounded-xl" />
        <div className="w-full h-12 bg-void/50 rounded-xl mt-4" />
      </div>
    </div>
  )
}
