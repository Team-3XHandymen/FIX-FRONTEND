import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

const supportedLngs = ['en', 'si', 'ta'] as const;
const DEFAULT_LANGUAGE = 'en';
const LOCAL_STORAGE_KEY = 'fixfinder_language';

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: supportedLngs as unknown as string[],
      load: 'languageOnly',
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: LOCAL_STORAGE_KEY,
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      returnNull: false,
    });
}

export const availableLanguages = supportedLngs;
export const LANGUAGE_STORAGE_KEY = LOCAL_STORAGE_KEY;

export default i18n;

