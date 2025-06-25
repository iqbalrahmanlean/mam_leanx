import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Only initialize on client side
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      lng: 'en', // Force to 'en' instead of 'en-US'
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false
      },

      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        // Map en-US to en
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
      },

      // Map languages
      load: 'languageOnly', // This removes country codes (en-US -> en)

      saveMissing: process.env.NODE_ENV === 'development',
      missingKeyHandler: (lng, ns, key) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation key: ${key} for language: ${lng}`)
        }
      }
    })
}

export default i18n