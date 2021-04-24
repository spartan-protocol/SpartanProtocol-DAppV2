import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en/translation.json'
import translationHI from './locales/hi/translation.json'
import translationES from './locales/es/translation.json'
import translationFR from './locales/fr/translation.json'
import translationBN from './locales/bn/translation.json'
import translationRU from './locales/ru/translation.json'
import translationNL from './locales/nl/translation.json'

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  hi: {
    translation: translationHI,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  bn: {
    translation: translationBN,
  },
  ru: {
    translation: translationRU,
  },
  nl: {
    translation: translationNL,
  },
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
