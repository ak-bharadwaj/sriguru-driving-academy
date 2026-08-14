import { create } from 'zustand'

export interface StudentProfile {
  id: string
  name: string
  email: string
  phoneNumber?: string
  licenseCategory?: string
  instructorId?: string
}

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  isCompleted: boolean
  order: number
  skillsChecked: string[]
}

export interface AttendanceRecord {
  sessionId: string
  date: string
  present: boolean
  durationMinutes: number
  instructorFeedback?: string
}

interface StudentState {
  profile: StudentProfile | null
  roadmapProgress: RoadmapMilestone[]
  attendanceRecords: AttendanceRecord[]
  
  // Actions
  setProfile: (profile: StudentProfile) => void
  setRoadmap: (roadmap: RoadmapMilestone[]) => void
  completeMilestone: (milestoneId: string) => void
  recordAttendance: (record: AttendanceRecord) => void
  clearProfile: () => void
}

export const useStudentStore = create<StudentState>()((set) => ({
  profile: null,
  roadmapProgress: [],
  attendanceRecords: [],

  setProfile: (profile) => set({ profile }),

  setRoadmap: (roadmap) => set({ roadmapProgress: roadmap.sort((a, b) => a.order - b.order) }),

  completeMilestone: (milestoneId) => set((state) => ({
    roadmapProgress: state.roadmapProgress.map((m) =>
      m.id === milestoneId ? { ...m, isCompleted: true } : m
    )
  })),

  recordAttendance: (record) => set((state) => ({
    attendanceRecords: [...state.attendanceRecords, record]
  })),

  clearProfile: () => set({ profile: null, roadmapProgress: [], attendanceRecords: [] })
}))
