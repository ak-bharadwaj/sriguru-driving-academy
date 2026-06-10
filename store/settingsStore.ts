import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  academyName: string
  logoUrl: string | null
  instagramUrl: string
  facebookUrl: string
  twitterUrl: string
  setAcademyName: (name: string) => void
  setLogoUrl: (url: string | null) => void
  setInstagramUrl: (url: string) => void
  setFacebookUrl: (url: string) => void
  setTwitterUrl: (url: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      academyName: 'Sri Guru Driving School',
      logoUrl: '/logo.png',
      instagramUrl: 'https://instagram.com/srigurudriving',
      facebookUrl: 'https://facebook.com/srigurudriving',
      twitterUrl: 'https://twitter.com/srigurudriving',
      setAcademyName: (name) => set({ academyName: name }),
      setLogoUrl: (url) => set({ logoUrl: url }),
      setInstagramUrl: (url) => set({ instagramUrl: url }),
      setFacebookUrl: (url) => set({ facebookUrl: url }),
      setTwitterUrl: (url) => set({ twitterUrl: url }),
    }),
    {
      name: 'academy-settings-v2',
    }
  )
)
