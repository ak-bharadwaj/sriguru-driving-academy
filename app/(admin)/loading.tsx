import React from 'react'

export default function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 relative animate-pulse pt-24">
      
      {/* Admin header */}
      <div className="max-w-7xl mx-auto h-16 bg-surface border border-border rounded-2xl mb-6" />

      {/* 3-Column Futuristic grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[20%_55%_25%] gap-6 h-[720px]">
        
        {/* Left Col (Vertical Nav tree) */}
        <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col gap-4">
          <div className="w-1/2 h-5 bg-void/50 rounded mb-4" />
          {[1, 2, 3, 5, 6].map(idx => (
            <div key={idx} className="w-full h-8 bg-void/40 rounded-xl" />
          ))}
        </div>

        {/* Center Col (Main stats grids, charts) */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-3xl p-5 h-20 flex gap-4 items-center">
            <div className="w-24 h-6 bg-void/50 rounded" />
            <div className="w-24 h-6 bg-void/50 rounded" />
            <div className="w-24 h-6 bg-void/50 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-surface border border-border rounded-3xl p-5 h-[280px]" />
            <div className="bg-surface border border-border rounded-3xl p-5 h-[280px]" />
            <div className="bg-surface border border-border rounded-3xl p-5 h-[240px] col-span-2" />
          </div>
        </div>

        {/* Right Col (Live activity logs) */}
        <div className="bg-surface border border-border rounded-3xl p-5 flex flex-col gap-4">
          <div className="w-1/2 h-5 bg-void/50 rounded" />
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="w-full h-20 bg-void/40 rounded-2xl" />
          ))}
        </div>

      </div>

    </div>
  )
}
