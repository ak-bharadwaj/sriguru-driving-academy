import { useLanguageStore } from '@/store/languageStore'
import { DICTIONARIES, TranslationKey, Language } from '@/lib/i18n/dictionaries'

export function useTranslation() {
  const { language } = useLanguageStore()
  
  const t = (key: TranslationKey) => {
    // Default to EN if for some reason the language isn't set properly
    const activeLang = language as Language || 'EN'
    const dict = DICTIONARIES[activeLang] || DICTIONARIES['EN']
    
    // Return translation or fallback to EN if key is missing in the chosen language
    return dict[key] || DICTIONARIES['EN'][key] || key
  }

  return { t, currentLanguage: language }
}
