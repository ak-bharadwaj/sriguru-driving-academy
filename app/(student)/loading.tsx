import React from 'react'

export default function StudentDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 relative animate-pulse pt-28">
      
      {/* Navigation floating pill placeholder */}
      <div className="max-w-2xl mx-auto mb-10 h-14 bg-surface border border-border rounded-full" />

      {/* Main Grid split area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[62%_38%] gap-6">
        
        {/* Left Col (Hero stats) */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-[32px] p-8 h-80 flex flex-col gap-4">
            <div className="w-40 h-6 bg-void/50 rounded-lg" />
            <div className="w-180px h-180px rounded-full bg-void/50 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-surface border border-border rounded-2xl p-6 h-32 flex flex-col gap-3">
                <div className="w-20 h-4 bg-void/50 rounded" />
                <div className="w-12 h-8 bg-void/50 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (Activity timeline) */}
        <div className="bg-surface border border-border rounded-[32px] p-6 h-[500px] flex flex-col gap-4">
          <div className="w-32 h-6 bg-void/50 rounded-lg mb-4" />
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-void/50 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-3/4 h-4 bg-void/50 rounded" />
                <div className="w-1/2 h-3 bg-void/50 rounded" />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
