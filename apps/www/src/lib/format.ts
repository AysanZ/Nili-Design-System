import { formatNumber } from '@nili/ui/lib/numerals';

import { intlLocale, type Locale } from '@www/i18n/config';

/**
 * Every number on this site goes through here, and every one of these is
 * `Intl` underneath — which is the whole argument of the "digits are
 * formatting" section. A localised digit is a formatted value; it is never a
 * font that draws ۱ on top of the codepoint 1.
 */

export function num(value: number, locale: Locale): string {
  return formatNumber(value, { locale: intlLocale[locale] });
}

export function money(value: number, locale: Locale): string {
  return formatNumber(value, {
    locale: intlLocale[locale],
    maximumFractionDigits: 0,
  });
}

/**
 * The percent sign alone, in this locale's script — `%`, `٪`, `؉`. Formatting
 * a known value and deleting its digits is the only way to ask `Intl` for the
 * symbol: it has no API for "the unit without the number", and hard-coding
 * `'%'` is exactly the kind of assumption this site exists to argue against.
 */
export function percentSign(locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], { style: 'percent' })
    .format(1)
    .replace(/[\d\u0660-\u0669\u06F0-\u06F9\s\u00a0\u202f]/g, '');
}

/**
 * A fixed date, so the page reads the same on every visit and the four rows of
 * the locale table can be compared against each other.
 */
const SAMPLE_DATE = new Date(2026, 8, 17);

export function date(locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(SAMPLE_DATE);
}
