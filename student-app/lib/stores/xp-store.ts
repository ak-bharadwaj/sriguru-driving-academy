import { create } from 'zustand'

export interface Badge {
  id: string
  name: string
  description: string
  unlockedAt: string
  icon: string
  customImage?: string
  type?: string
  rarity?: string
}

export interface ToastMessage {
  id: string
  title: string
  description: string
  type: 'xp' | 'badge' | 'level' | 'error'
  xpAmount?: number
}

interface XPState {
  currentXP: number
  level: number
  streakDays: number
  badges: Badge[]
  pendingToasts: ToastMessage[]
  pendingLevelUp: boolean
  pendingBadgeReveal: Badge | null
  
  // Actions
  addXP: (amount: number) => void
  awardBadge: (badge: Badge) => void
  incrementStreak: () => void
  resetStreak: () => void
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
  reconcileXP: (amount: number) => Promise<void>
  setPendingLevelUp: (val: boolean) => void
  setPendingBadgeReveal: (badge: Badge | null) => void
}

export const useXPStore = create<XPState>()((set) => ({
  currentXP: 0,
  level: 1,
  streakDays: 3, // Mocked initialized to 3 for daily streak triggers
  badges: [],
  pendingToasts: [],
  pendingLevelUp: false,
  pendingBadgeReveal: null,

  addXP: (amount) => set((state) => {
    const newXP = state.currentXP + amount
    const neededXP = state.level * 1000
    
    // Add toast to display
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(7),
      title: 'XP Gained',
      description: `+${amount} XP`,
      type: 'xp',
      xpAmount: amount
    }

    if (newXP >= neededXP) {
      const nextLevel = state.level + 1
      const remainingXP = newXP - neededXP
      
      const levelToast: ToastMessage = {
        id: Math.random().toString(36).substring(7),
        title: 'Level Up!',
        description: `Congratulations! You reached Level ${nextLevel}!`,
        type: 'level'
      }

      return {
        currentXP: remainingXP,
        level: nextLevel,
        pendingLevelUp: true, // Trigger overlay
        pendingToasts: [...state.pendingToasts, newToast, levelToast]
      }
    }

    return { 
      currentXP: newXP,
      pendingToasts: [...state.pendingToasts, newToast]
    }
  }),

  awardBadge: (badge) => set((state) => {
    if (state.badges.some((b) => b.id === badge.id)) return state
    
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(7),
      title: 'Badge Unlocked!',
      description: badge.name,
      type: 'badge'
    }

    return {
      badges: [...state.badges, badge],
      pendingBadgeReveal: badge, // Trigger full screen overlay reveal
      pendingToasts: [...state.pendingToasts, newToast]
    }
  }),

  incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),
  
  resetStreak: () => set({ streakDays: 0 }),
  
  addToast: (toast) => set((state) => ({
    pendingToasts: [
      ...state.pendingToasts,
      { ...toast, id: Math.random().toString(36).substring(7) }
    ]
  })),

  dismissToast: (id) => set((state) => ({
    pendingToasts: state.pendingToasts.filter((t) => t.id !== id)
  })),

  reconcileXP: async (amount) => {
    try {
      const res = await fetch('/api/student/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.levelUp) {
          set({ pendingLevelUp: true, level: data.newLevel })
        }
        set({ currentXP: data.currentXP })
      }
    } catch (e) {
      console.error('Failed to sync XP with cloud server:', e)
    }
  },

  setPendingLevelUp: (val) => set({ pendingLevelUp: val }),
  setPendingBadgeReveal: (badge) => set({ pendingBadgeReveal: badge })
}))
