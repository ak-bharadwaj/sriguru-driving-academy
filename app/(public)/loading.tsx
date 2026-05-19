import React from 'react'

export default function PublicLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 md:p-12 animate-pulse">
      {/* Navbar skeleton */}
      <div className="max-w-6xl mx-auto h-16 bg-surface border border-border rounded-2xl mb-12" />
      
      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
        <div className="flex flex-col gap-6">
          <div className="w-3/4 h-12 bg-surface border border-border rounded-xl" />
          <div className="w-1/2 h-6 bg-surface border border-border rounded-xl" />
          <div className="w-40 h-12 bg-surface border border-border rounded-xl mt-4" />
        </div>
        <div className="h-96 bg-surface border border-border rounded-[32px]" />
      </div>
    </div>
  )
}
