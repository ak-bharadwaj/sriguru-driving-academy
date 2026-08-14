"use client"

import React from 'react'

export default function DashboardLoadingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-24 space-y-8 animate-pulse font-body">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="h-6 w-32 bg-[rgb(var(--color-surface))]/50 rounded-full mb-3" />
          <div className="h-10 w-64 bg-[rgb(var(--color-surface))] rounded-2xl" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-[rgb(var(--color-surface))]/50 rounded-full" />
          <div className="h-10 w-24 bg-[rgb(var(--color-surface))]/50 rounded-full" />
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-5 h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))]/50" />
              <div className="w-12 h-4 rounded bg-[rgb(var(--color-void))]" />
            </div>
            <div className="w-24 h-8 rounded bg-[rgb(var(--color-void))]" />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Session & Tests) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 h-64">
            <div className="h-6 w-48 bg-[rgb(var(--color-void))] rounded-lg mb-6" />
            <div className="space-y-4">
              <div className="h-12 w-full bg-[rgb(var(--color-void))] rounded-xl" />
              <div className="h-12 w-3/4 bg-[rgb(var(--color-void))] rounded-xl" />
            </div>
          </div>
          
          <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 h-48">
             <div className="h-6 w-40 bg-[rgb(var(--color-void))] rounded-lg mb-6" />
             <div className="h-20 w-full bg-[rgb(var(--color-void))] rounded-xl" />
          </div>
        </div>

        {/* Right Column (Roadmap) */}
        <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-3xl p-6 h-[440px]">
          <div className="h-6 w-48 bg-[rgb(var(--color-void))] rounded-lg mb-8" />
          
          {/* Roadmap Steps */}
          <div className="space-y-6 relative pl-4">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[rgb(var(--color-void))]" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-void))] shrink-0 z-10 -ml-[23px] border-4 border-[rgb(var(--color-surface))]" />
                <div className="w-full">
                  <div className="h-5 w-3/4 bg-[rgb(var(--color-void))] rounded mb-2" />
                  <div className="h-3 w-1/2 bg-[rgb(var(--color-void))] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
