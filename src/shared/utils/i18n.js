import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'en', // init language: should get languge from cookies or localStrorage
    fallbackLng: 'en', // should get languge from cookies or localStrorage
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    react: {
      useSuspense: false, // require to use
    },
  });

export default i18n;
