/**
 * The site's locales.
 *
 * Adding a fifth is: one entry in `locales`, one entry in each map below, and
 * one dictionary file. Nothing in any component changes — which is the claim
 * the home page makes, so the site had better be built that way itself.
 */
export const locales = ['en', 'fa', 'ar', 'tr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Scripts that read right to left. */
const rtl: readonly Locale[] = ['fa', 'ar'];

export type Direction = 'ltr' | 'rtl';

export function directionOf(locale: Locale): Direction {
  return rtl.includes(locale) ? 'rtl' : 'ltr';
}

/**
 * BCP-47 tags for `Intl`. The short code is what appears in the URL; the full
 * tag is what decides digits, grouping separators and calendar.
 * `fa-IR` gives Persian digits and the Persian calendar, `ar-EG` gives
 * Eastern-Arabic digits — `ar-SA` would give a Hijri date, which is a
 * different claim than the one this page is making.
 */
export const intlLocale: Record<Locale, string> = {
  en: 'en-US',
  fa: 'fa-IR',
  ar: 'ar-EG',
  tr: 'tr-TR',
};

/** Endonyms — a language is always listed in its own script. */
export const localeName: Record<Locale, string> = {
  en: 'English',
  fa: 'فارسی',
  ar: 'العربية',
  tr: 'Türkçe',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
