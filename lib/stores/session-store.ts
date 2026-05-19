import { create } from 'zustand'

export interface DrivingSession {
  id: string
  instructorName: string
  dateTime: string
  durationHours: number
  topic: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
}

export interface ActiveSessionState {
  sessionId: string | null
  elapsedMinutes: number
  gpsRoute: { lat: number; lng: number }[]
  speedKmh: number
  currentManeuver: string | null
}

interface SessionState {
  upcomingSessions: DrivingSession[]
  activeSession: ActiveSessionState
  
  // Actions
  setUpcomingSessions: (sessions: DrivingSession[]) => void
  startSession: (sessionId: string) => void
  updateActiveSessionMetrics: (metrics: Partial<ActiveSessionState>) => void
  completeActiveSession: () => void
  cancelSession: (sessionId: string) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  upcomingSessions: [],
  activeSession: {
    sessionId: null,
    elapsedMinutes: 0,
    gpsRoute: [],
    speedKmh: 0,
    currentManeuver: null
  },

  setUpcomingSessions: (sessions) => set({ upcomingSessions: sessions }),

  startSession: (sessionId) => set((state) => {
    const session = state.upcomingSessions.find((s) => s.id === sessionId)
    if (!session) return state
    
    // Update state to set session active
    return {
      upcomingSessions: state.upcomingSessions.map((s) =>
        s.id === sessionId ? { ...s, status: 'active' } : s
      ),
      activeSession: {
        sessionId,
        elapsedMinutes: 0,
        gpsRoute: [],
        speedKmh: 0,
        currentManeuver: 'Initializing lesson...'
      }
    }
  }),

  updateActiveSessionMetrics: (metrics) => set((state) => ({
    activeSession: {
      ...state.activeSession,
      ...metrics
    }
  })),

  completeActiveSession: () => set((state) => {
    const { sessionId } = state.activeSession
    if (!sessionId) return state

    return {
      upcomingSessions: state.upcomingSessions.map((s) =>
        s.id === sessionId ? { ...s, status: 'completed' } : s
      ),
      activeSession: {
        sessionId: null,
        elapsedMinutes: 0,
        gpsRoute: [],
        speedKmh: 0,
        currentManeuver: null
      }
    }
  }),

  cancelSession: (sessionId) => set((state) => ({
    upcomingSessions: state.upcomingSessions.map((s) =>
      s.id === sessionId ? { ...s, status: 'cancelled' } : s
    )
  }))
}))
