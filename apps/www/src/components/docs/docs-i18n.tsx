'use client';

import i18next, { type i18n as I18n } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import type { ReactNode } from 'react';

import enTranslation from '@nili/ui/locales/en/translation.json';
import faTranslation from '@nili/ui/locales/fa/translation.json';

/**
 * The overview pages translate themselves.
 *
 * The library ships without an i18n runtime — components take their strings as
 * props — but its *documentation* does not: the overview stories call
 * `useTranslation()` against the catalogues in `src/locales`. Rendering those
 * pages here therefore means handing them the instance Storybook hands them,
 * from the same two files. This is the same arrangement `apps/studio` uses.
 *
 * One instance per language, created once and reused. Not one shared instance
 * whose language is reassigned: under SSR two requests for two languages would
 * be rendering at the same time, and whichever called `changeLanguage` last
 * would win for both.
 *
 * Only `en` and `fa` exist as catalogues. Arabic and Turkish pages fall back to
 * English for the *documentation prose* while the components on them still
 * render in the page's own direction and numerals — the fallback is a missing
 * translation, not a missing capability.
 */
const DOCS_LANGUAGES = ['en', 'fa'] as const;
type DocsLanguage = (typeof DOCS_LANGUAGES)[number];

const instances = new Map<DocsLanguage, I18n>();

function instanceFor(language: DocsLanguage): I18n {
  const existing = instances.get(language);
  if (existing) return existing;

  const created = i18next.createInstance();
  void created.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslation },
      fa: { translation: faTranslation },
    },
    lng: language,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

  instances.set(language, created);
  return created;
}

export function DocsI18n({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const language: DocsLanguage = locale === 'fa' ? 'fa' : 'en';
  return (
    <I18nextProvider i18n={instanceFor(language)}>{children}</I18nextProvider>
  );
}
