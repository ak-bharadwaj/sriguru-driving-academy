"use client"

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  if (!pathname) return null

  // Split pathname into segments, filter out empties
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return null

  // Build the breadcrumb paths
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    // Format the label: capitalize first letter, replace hyphens with spaces
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    
    return {
      path,
      label,
      isLast: index === segments.length - 1
    }
  })

  // Determine base path for the home icon based on the first segment
  const basePath = segments[0] === 'admin' 
    ? '/admin/dashboard' 
    : segments[0] === 'instructor' 
      ? '/instructor/dashboard' 
      : '/student/dashboard'

  return (
    <nav className="flex items-center space-x-1 text-sm font-medium text-[rgb(var(--color-text-3))] mb-4" aria-label="Breadcrumb">
      <Link href={basePath} className="hover:text-[rgb(var(--color-text-1))] transition-colors p-1">
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((crumb) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          {crumb.isLast ? (
            <span className="text-[rgb(var(--color-primary))] font-semibold" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.path} className="hover:text-[rgb(var(--color-text-1))] transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
