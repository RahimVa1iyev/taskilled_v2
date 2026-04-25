import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  az: {
    common: {
      welcome: 'Xoş gəldiniz',
      landingTitle: 'Taskool',
      login: 'Daxil ol',
      goHome: 'Home-a keç',
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      landingTitle: 'Taskool',
      login: 'Login',
      goHome: 'Go to Home',
    },
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'az',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export { i18n }

