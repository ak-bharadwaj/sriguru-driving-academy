import React from 'react'

/** Generic shimmer skeleton block */
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))]/50 ${className}`}
    />
  )
}

/** Stat card row — used in dashboards */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} className="h-24" />
      ))}
    </div>
  )
}

/** Full-page admin-style skeleton */
export function AdminPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2 animate-pulse">
      {/* Page header */}
      <div className="border-b border-[rgb(var(--color-border))]/50 pb-6">
        <Shimmer className="h-4 w-32 mb-2" />
        <Shimmer className="h-8 w-64 mb-2" />
        <Shimmer className="h-3 w-80" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-24" />)}
      </div>
      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Shimmer className="h-64 xl:col-span-1" />
        <div className="xl:col-span-2 flex flex-col gap-6">
          <Shimmer className="h-48" />
          <div className="grid grid-cols-2 gap-6">
            <Shimmer className="h-48" />
            <Shimmer className="h-48" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Student portal page skeleton — padded for bottom nav */
export function StudentPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-28 animate-pulse">
      <Shimmer className="h-10 w-48" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-24" />)}
      </div>
      <Shimmer className="h-48" />
      <Shimmer className="h-32" />
      <Shimmer className="h-32" />
    </div>
  )
}

/** Instructor portal page skeleton */
export function InstructorPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 pt-2 pb-28 animate-pulse">
      <Shimmer className="h-10 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <Shimmer key={i} className="h-24" />)}
      </div>
      <Shimmer className="h-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Shimmer className="h-48" />
        <Shimmer className="h-48" />
      </div>
    </div>
  )
}

/** Table-style list skeleton */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <Shimmer className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

/** Calendar / slot page skeleton */
export function CalendarSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex gap-4">
        <Shimmer className="h-10 w-32" />
        <Shimmer className="h-10 flex-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <Shimmer className="h-12 w-full" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => <Shimmer key={i} className="h-20" />)}
          </div>
        </div>
        <Shimmer className="h-96" />
      </div>
    </div>
  )
}
