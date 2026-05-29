import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  academyName: string
  logoUrl: string | null
  setAcademyName: (name: string) => void
  setLogoUrl: (url: string | null) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      academyName: 'Sri Guru Driving Academy',
      logoUrl: null,
      setAcademyName: (name) => set({ academyName: name }),
      setLogoUrl: (url) => set({ logoUrl: url }),
    }),
    {
      name: 'academy-settings',
    }
  )
)
