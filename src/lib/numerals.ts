/**
 * Persian numeral helpers.
 *
 * ## Why this file exists
 *
 * The old font was `YekanBakhFaNum` — a cut where the Persian digit glyphs
 * are mapped onto the ASCII digit codepoints, so typing `123` *displays*
 * Persian-looking digits. It looks like it works. It is the wrong layer:
 *
 * - The DOM still holds `123`, so `Ctrl+F` for the Persian form fails and
 *   copy-paste gives Latin digits.
 * - Screen readers read the codepoints, not the glyphs.
 * - It only ever renders one numeral system, so a Persian UI showing a
 *   deliberately-Latin value (an IBAN, a version string) cannot.
 * - Swap the font and every number in the product silently changes.
 *
 * Vazirmatn ships true Latin *and* Persian digits at their own codepoints, so
 * numeral system becomes a formatting decision made in code, per value, where
 * it belongs.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** ASCII digits → Persian ones. Leaves every non-digit character untouched. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Persian digits → ASCII. Accepts Persian and Arabic-Indic digits. */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const persian = PERSIAN_DIGITS.indexOf(char);
    if (persian !== -1) return String(persian);
    return String(ARABIC_INDIC_DIGITS.indexOf(char));
  });
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

/**
 * Locale-correct number formatting. Prefer this over `toPersianDigits` for
 * anything numeric: it also gets the thousands separator right (Persian uses its
 * not `,`) and handles currency and percentages.
 *
 * ```ts
 * formatNumber(1234567.89, { locale: 'fa-IR' })  // Persian digits
 * formatNumber(1234567.89, { locale: 'en-US' })  // '1,234,567.89'
 * ```
 */
export function formatNumber(
  value: number,
  { locale = 'en-US', ...options }: FormatNumberOptions = {},
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Strips Persian/Arabic digits and separators so a localized number typed into
 * a numeric input produces `123456`. Every numeric field in the system should
 * run its value through this before parsing.
 */
export function parseLocalizedNumber(input: string): number {
  const normalized = toLatinDigits(input)
    .replace(/[٬,\s]/g, '')
    .replace(/[٫]/g, '.');
  return Number(normalized);
}
