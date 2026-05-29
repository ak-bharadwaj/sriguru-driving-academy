"use client"

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export const GuidedTour = () => {
  const pathname = usePathname()
  const isDashboard = pathname === '/student/dashboard'

  useEffect(() => {
    const hasSeen = localStorage.getItem('sgda_has_seen_tour')
    if (!hasSeen && isDashboard) {
      // Small delay to let the UI mount
      const timer = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          allowClose: true,
          overlayColor: 'rgba(5, 5, 5, 0.85)', // Darker, premium backdrop
          doneBtnText: 'Finish',
          nextBtnText: 'Next',
          prevBtnText: 'Back',
          steps: [
            {
              element: '#nav-home',
              popover: {
                title: 'Your Command Center',
                description: 'Welcome! This is your main dashboard. Track your upcoming sessions, view your roadmap progress, and check for RTO exam dates here.',
                side: 'top',
                align: 'center'
              }
            },
            {
              element: '#nav-learn',
              popover: {
                title: 'Study Materials',
                description: 'Tap here to access interactive flashcards and study modules to prepare for your LLR theory exams.',
                side: 'top',
                align: 'center'
              }
            },
            {
              element: '#nav-practice',
              popover: {
                title: '3D Simulators',
                description: 'Get behind the virtual wheel! Practice your spatial awareness and parking skills in our interactive simulations.',
                side: 'top',
                align: 'center'
              }
            },
            {
              element: '#nav-analysis',
              popover: {
                title: 'Leaderboards',
                description: 'See how you stack up against other students. Earn XP and badges to climb the ranks!',
                side: 'top',
                align: 'center'
              }
            },
            {
              element: '#nav-profile',
              popover: {
                title: 'Your Profile',
                description: 'Customize your settings, view your earned badges, and track your overall driving academy journey.',
                side: 'top',
                align: 'center'
              }
            }
          ],
          onDestroyStarted: () => {
            if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
              localStorage.setItem('sgda_has_seen_tour', 'true')
              driverObj.destroy()
            }
          },
        })

        driverObj.drive()
      }, 1500)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isDashboard])

  // We inject custom CSS to override driver.js defaults so it matches our premium dark theme
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .driver-popover {
        background-color: rgb(var(--color-surface)) !important;
        border: 1px solid rgba(var(--color-border), 0.5) !important;
        color: rgb(var(--color-text-1)) !important;
        border-radius: 24px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        padding: 24px !important;
        font-family: var(--font-body) !important;
      }
      .driver-popover-title {
        font-family: var(--font-display) !important;
        font-size: 20px !important;
        font-weight: 700 !important;
        margin-bottom: 8px !important;
        color: rgb(var(--color-text-1)) !important;
      }
      .driver-popover-description {
        color: rgb(var(--color-text-2)) !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      .driver-popover-footer {
        margin-top: 20px !important;
      }
      .driver-popover-progress-text {
        color: rgb(var(--color-primary)) !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
      }
      .driver-popover-next-btn, 
      .driver-popover-prev-btn {
        background-color: rgb(var(--color-primary)) !important;
        color: white !important;
        border-radius: 12px !important;
        padding: 8px 16px !important;
        font-weight: 600 !important;
        text-shadow: none !important;
        border: none !important;
        transition: all 0.2s !important;
      }
      .driver-popover-next-btn:hover, 
      .driver-popover-prev-btn:hover {
        background-color: rgb(var(--color-primary-hover)) !important;
        transform: scale(1.05) !important;
      }
      .driver-popover-close-btn {
        color: rgb(var(--color-text-3)) !important;
      }
      .driver-popover-close-btn:hover {
        color: rgb(var(--color-text-1)) !important;
      }
      /* Fix arrow colors */
      .driver-popover-arrow-side-top {
        border-top-color: rgb(var(--color-surface)) !important;
      }
      .driver-popover-arrow-side-bottom {
        border-bottom-color: rgb(var(--color-surface)) !important;
      }
      .driver-popover-arrow-side-left {
        border-left-color: rgb(var(--color-surface)) !important;
      }
      .driver-popover-arrow-side-right {
        border-right-color: rgb(var(--color-surface)) !important;
      }
    `}} />
  )
}
