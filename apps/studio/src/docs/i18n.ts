import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '@nili/ui/locales/en/translation.json';
import faTranslation from '@nili/ui/locales/fa/translation.json';

/**
 * The docs surface's own i18next, copied from `.storybook/i18n.ts`.
 *
 * The library ships without an i18n runtime — components take their strings
 * as props — but the *documentation* translates, and the overview pages are
 * documentation. Rendering them means giving them the instance Storybook
 * gives them, from the same two catalogues.
 *
 * Its own instance rather than the global default, so nothing here can
 * interfere with an application that embeds the studio.
 */
export const docsI18n = i18n.createInstance();

void docsI18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fa: { translation: faTranslation },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
