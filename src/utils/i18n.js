import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import translationEN from '../../assets/locales/en/translation.json';
import translationDE from '../../assets/locales/de/translation.json';

const userLanguage = getLocales()[0].languageCode;
const fallbacklanguage = 'en';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

i18n.use(initReactI18next).init({
  lng: userLanguage,
  fallbackLng: fallbacklanguage,
  resources,
});
export default i18n;
