import React from 'react'

export default function InstructorDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 relative animate-pulse pt-24">
      
      {/* Top operational bar */}
      <div className="max-w-6xl mx-auto h-16 bg-surface border border-border rounded-2xl mb-6" />

      {/* 2-Column Split panel */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 h-[680px]">
        
        {/* Left Panel (Roster) */}
        <div className="bg-surface border border-border rounded-[32px] p-5 flex flex-col gap-4">
          <div className="w-1/2 h-5 bg-void/50 rounded" />
          <div className="w-full h-10 bg-void/50 rounded-xl" />
          
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3, 4, 5].map(idx => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-void/30 border border-border/40 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-void/50" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-3/4 h-3.5 bg-void/50 rounded" />
                  <div className="w-1/2 h-2.5 bg-void/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel (Active coaching detail screen) */}
        <div className="bg-surface border border-border rounded-[32px] p-6 flex flex-col gap-6">
          <div className="w-1/3 h-6 bg-void/50 rounded" />
          <div className="w-full h-40 bg-void/40 rounded-2xl" />
          
          <div className="flex-1 flex flex-col gap-4 mt-4">
            <div className="w-full h-10 bg-void/40 rounded-xl" />
            <div className="w-full h-10 bg-void/40 rounded-xl" />
            <div className="w-full h-24 bg-void/40 rounded-xl" />
          </div>
        </div>

      </div>

    </div>
  )
}
