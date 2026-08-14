import React from 'react'

export default function RoadmapSkeleton() {
  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 relative animate-pulse pt-28">
      
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="flex flex-col gap-2">
            <div className="w-52 h-8 bg-surface rounded" />
            <div className="w-72 h-4 bg-surface rounded" />
          </div>
          <div className="w-32 h-8 bg-surface rounded-xl" />
        </div>

        {/* Progress box */}
        <div className="bg-surface border border-border p-5 rounded-3xl h-24" />

        {/* Winding road box */}
        <div className="bg-surface border border-border rounded-3xl h-[600px] flex justify-center items-center">
          <div className="w-16 h-full bg-void/50 border-r border-l border-dashed border-border" />
        </div>

      </div>

    </div>
  )
}
