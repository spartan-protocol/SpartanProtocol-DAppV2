import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationGr from './locales/rs/translation.json';
import translationIT from './locales/tu/translation.json';
import translationRS from './locales/rs/translation.json';
import translationSP from './locales/ch/translation';
import translationENG from './locales/en/translation.json';
import translationVI from './locales/vi/translation.json';

// the translations
const resources = {
  gr: {
    translation: translationGr
  },
  it: {
    translation: translationIT
  },
  rs: {
    translation: translationRS
  },
  sp: {
    translation: translationSP
  },
  eng: {
    translation: translationENG
  },
  vi: {
    translation: translationVI
  }
};

i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
