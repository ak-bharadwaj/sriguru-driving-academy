import React from 'react'

export default function RTOLearningSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 relative animate-pulse pt-28">
      
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="flex flex-col gap-2">
            <div className="w-48 h-8 bg-surface rounded" />
            <div className="w-80 h-4 bg-surface rounded" />
          </div>
          <div className="w-28 h-8 bg-surface rounded-xl" />
        </div>

        {/* Scroll Category Tab Bar */}
        <div className="flex gap-3 overflow-hidden py-2 border-b border-border/40">
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div key={idx} className="w-24 h-9 bg-surface rounded-xl flex-shrink-0" />
          ))}
        </div>

        {/* Sign Cards Grid (160x160px cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(idx => (
            <div key={idx} className="w-[160px] h-[160px] bg-surface border border-border rounded-2xl mx-auto" />
          ))}
        </div>

      </div>

    </div>
  )
}
