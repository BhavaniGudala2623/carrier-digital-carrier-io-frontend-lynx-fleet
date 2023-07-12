import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    fallbackLng: 'en-US',
    debug: false,
    returnNull: false,
    load: 'currentOnly',
    keySeparator: false,
    ns: ['lynx-static-data-v1'],
    defaultNS: 'lynx-static-data-v1',
    preload: [
      'de-DE',
      'en-US',
      'en-GB',
      'es-ES',
      'fr-FR',
      'nl-NL',
      'pl-PL',
      'it-IT',
      'sv-SE',
      'nb-NO',
      'da-DK',
    ],
  });

export { i18n };
