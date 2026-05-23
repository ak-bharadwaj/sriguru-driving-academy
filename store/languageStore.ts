import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'EN' | 'HI' | 'TE'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'EN',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'sri-guru-language',
    }
  )
)
