import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationAF from './locales/af/translation.json'
import translationBN from './locales/bn/translation.json'
import translationDE from './locales/de/translation.json'
import translationEL from './locales/el/translation.json'
import translationEN from './locales/en/translation.json'
import translationES from './locales/es/translation.json'
import translationFA from './locales/fa/translation.json'
import translationFR from './locales/fr/translation.json'
import translationHI from './locales/hi/translation.json'
import translationIT from './locales/it/translation.json'
import translationNL from './locales/nl/translation.json'
import translationPA from './locales/pa/translation.json'
import translationPL from './locales/pl/translation.json'
import translationPT from './locales/pt/translation.json'
import translationRO from './locales/ro/translation.json'
import translationRU from './locales/ru/translation.json'
import translationSV from './locales/sv/translation.json'
import translationUK from './locales/uk/translation.json'
import translationZH from './locales/zh/translation.json'

// the translations
const resources = {
  af: {
    translation: translationAF,
  },
  bn: {
    translation: translationBN,
  },
  de: {
    translation: translationDE,
  },
  el: {
    translation: translationEL,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fa: {
    translation: translationFA,
  },
  fr: {
    translation: translationFR,
  },
  hi: {
    translation: translationHI,
  },
  it: {
    translation: translationIT,
  },
  nl: {
    translation: translationNL,
  },
  pa: {
    translation: translationPA,
  },
  pl: {
    translation: translationPL,
  },
  pt: {
    translation: translationPT,
  },
  ro: {
    translation: translationRO,
  },
  ru: {
    translation: translationRU,
  },
  sv: {
    translation: translationSV,
  },
  uk: {
    translation: translationUK,
  },
  zh: {
    translation: translationZH,
  },
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
