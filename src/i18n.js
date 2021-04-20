import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'
import translationENG from './locales/en/translation.json'
import translationNL from './locales/nl/translation.json'

// the translations
const resources = {
  eng: {
    translation: translationENG,
  },
  nl: {
    translation: translationNL,
  },
}

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en', // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
