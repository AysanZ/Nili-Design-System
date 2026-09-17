'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { defaultLocale, type Locale } from '@www/i18n/config';

/**
 * The overview demos' own translation layer.
 *
 * The site chrome reads `src/i18n/dictionaries/*.json`, four flat files keyed
 * by message id. That works for chrome, where a string is written once and
 * used once. It works badly here: a demo is forty short strings that only mean
 * anything next to the example they label, and putting them in a shared file
 * means every edit to one demo is an edit to four files nobody can read
 * side by side.
 *
 * So a demo declares its own strings, all four languages together, next to the
 * component that renders them:
 *
 *     const text = defineDemoText({
 *       'appearances.title': { en: 'Appearances', fa: 'ظاهرها', ar: '…', tr: '…' },
 *     });
 *
 * The value type is `Record<Locale, string>`, so a missing language is a
 * compile error rather than a string that silently stays English — the same
 * rule `dictionaries.ts` gets from typing `Dictionary` as `typeof en`.
 *
 * The locale comes from context rather than a prop because the demos are
 * rendered from a registry (`overviews.tsx` maps a slug to a component with no
 * props at all), and threading a locale through that map would mean every demo
 * declaring a prop it does nothing with but pass on.
 */
export type DemoText = Record<string, Record<Locale, string>>;

/** Identity at runtime; the point is the constraint it forces at the call site. */
export function defineDemoText<T extends DemoText>(text: T): T {
  return text;
}

const DemoLocaleContext = createContext<Locale>(defaultLocale);

export function DemoLocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <DemoLocaleContext.Provider value={locale}>
      {children}
    </DemoLocaleContext.Provider>
  );
}

export function useDemoLocale(): Locale {
  return useContext(DemoLocaleContext);
}

/**
 * Binds a demo's strings to the page's locale.
 *
 * Returns a lookup rather than the resolved object so a demo reads
 * `t('sizes.title')` — the same shape as the site's own `t`, and the same
 * shape as `useTranslation()` in the library's stories, so there is one way to
 * ask for a string across the whole repository.
 */
export function useDemoText<T extends DemoText>(
  text: T,
): (key: keyof T & string) => string {
  const locale = useDemoLocale();
  return useMemo(
    () => (key: keyof T & string) => text[key][locale],
    [text, locale],
  );
}

/**
 * The Copy / Copied pair, which every `DemoSection` needs and no demo should
 * have to declare. Kept here so `DemoSection` can default to it without the
 * forty-one call sites passing the same two strings down.
 */
export const demoChrome = defineDemoText({
  copy: { en: 'Copy', fa: 'کپی', ar: 'نسخ', tr: 'Kopyala' },
  copied: { en: 'Copied', fa: 'کپی شد', ar: 'تم النسخ', tr: 'Kopyalandı' },
});
