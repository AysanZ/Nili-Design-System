import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../src/locales/en/translation.json';
import faTranslation from '../src/locales/fa/translation.json';

/**
 * i18next now lives in .storybook, not in src.
 *
 * Shipping it as a library dependency forced every consumer onto i18next even
 * if they used react-intl, Next.js routing, or no i18n at all. Components take
 * their strings as props; only the docs surface translates.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fa: { translation: faTranslation },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
