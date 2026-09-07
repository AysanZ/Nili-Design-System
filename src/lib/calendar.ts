/**
 * Dual-calendar core: Jalali (Solar Hijri) and Gregorian.
 *
 * A note on names: **Shamsi and Jalali are the same calendar** — Solar Hijri.
 * "Shamsi" (solar) describes what it tracks, "Jalali" credits Jalaluddin Malik
 * Shah, under whom it was reformed in 1079. There is no third system to
 * support, so this file has exactly two: `'jalali'` and `'gregorian'`.
 *
 * ## Why the conversion is written out rather than imported
 *
 * `Intl.DateTimeFormat` with `fa-IR-u-ca-persian` can *format* a Jalali date,
 * but it cannot answer "how many days are in Esfand 1403" or "which weekday
 * starts Mehr" — and a calendar grid is nothing but those two questions. A
 * npm dependency would solve it, but a design system's runtime dependencies
 * are inherited by every consumer, so 60 lines of arithmetic is the cheaper
 * trade.
 *
 * The algorithm is Kazimierz M. Borkowski's, the same one `jalaali-js` uses.
 * It is exact for Jalali years 1178–1633 (Gregorian 1799–2254).
 */

export type CalendarSystem = 'jalali' | 'gregorian';

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

/** Jalali years at which the 33-year leap cycle shifts. */
const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
];

function jalCal(jy: number) {
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;
  const gy = jy + 621;

  if (jy < jp || jy >= BREAKS[BREAKS.length - 1]) {
    throw new RangeError(`Jalali year out of supported range: ${jy}`);
  }

  for (let i = 1; i < BREAKS.length; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

/** Gregorian date → Julian Day Number. */
function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/** Julian Day Number → Gregorian date. */
function d2g(jdn: number): DateParts {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const day = div(mod(i, 153), 5) + 1;
  const month = mod(div(i, 153), 12) + 1;
  const year = div(j, 1461) - 100100 + div(8 - month, 6);
  return { year, month, day };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): DateParts {
  const g = d2g(jdn);
  let jy = g.year - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(r.gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { year: jy, month: 1 + div(k, 31), day: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    // `r` is the calibration for the ORIGINAL jy. Recomputing it after the
    // decrement reads the wrong year's leap flag and shifts every date in the
    // last Gregorian quarter by a day.
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }

  return { year: jy, month: 7 + div(k, 30), day: mod(k, 30) + 1 };
}

export function isLeapYear(year: number, system: CalendarSystem): boolean {
  if (system === 'jalali') return jalCal(year).leap === 0;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** A JS `Date` (local midnight) → calendar parts in the given system. */
export function toParts(date: Date, system: CalendarSystem): DateParts {
  if (system === 'gregorian') {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

/** Calendar parts → a JS `Date` at local midnight. */
export function fromParts(parts: DateParts, system: CalendarSystem): Date {
  if (system === 'gregorian') {
    return new Date(parts.year, parts.month - 1, parts.day);
  }
  const g = d2g(j2d(parts.year, parts.month, parts.day));
  return new Date(g.year, g.month - 1, g.day);
}

export function daysInMonth(
  year: number,
  month: number,
  system: CalendarSystem,
): number {
  if (system === 'jalali') {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isLeapYear(year, 'jalali') ? 30 : 29;
  }
  return new Date(year, month, 0).getDate();
}

export function addMonths(
  parts: DateParts,
  delta: number,
  system: CalendarSystem,
): DateParts {
  const total = parts.year * 12 + (parts.month - 1) + delta;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  // Clamp rather than overflow: 31 Farvardin + 6 months is 30 Mehr, not 1 Aban.
  return {
    year,
    month,
    day: Math.min(parts.day, daysInMonth(year, month, system)),
  };
}

/**
 * First weekday of the week, as a JS day index (0 = Sunday).
 * Iran starts the week on Saturday; most of Europe on Monday; the US on Sunday.
 */
export function weekStartsOn(system: CalendarSystem, locale: string): number {
  if (system === 'jalali') return 6; // Saturday
  return locale.toLowerCase().startsWith('en-us') ? 0 : 1;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface CalendarCell {
  date: Date;
  parts: DateParts;
  /** False for the leading/trailing days borrowed from adjacent months. */
  inMonth: boolean;
}

/**
 * A 6×7 grid for the given month, padded with neighbouring days so every month
 * renders at the same height — a calendar that changes size as you page
 * through it drags the whole layout with it.
 */
export function getMonthGrid(
  year: number,
  month: number,
  system: CalendarSystem,
  locale: string,
): CalendarCell[] {
  const first = fromParts({ year, month, day: 1 }, system);
  const start = weekStartsOn(system, locale);
  const offset = (first.getDay() - start + 7) % 7;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(first);
    date.setDate(first.getDate() - offset + i);
    const parts = toParts(date, system);
    cells.push({
      date,
      parts,
      inMonth: parts.month === month && parts.year === year,
    });
  }
  return cells;
}

/** Localized month name. Falls back to the numeral if Intl lacks the calendar. */
export function getMonthName(
  year: number,
  month: number,
  system: CalendarSystem,
  locale: string,
): string {
  const date = fromParts({ year, month, day: 1 }, system);
  const tag = system === 'jalali' ? `${locale}-u-ca-persian` : locale;
  try {
    return new Intl.DateTimeFormat(tag, { month: 'long' }).format(date);
  } catch {
    return String(month);
  }
}

/** Weekday names in display order, starting from the calendar's first day. */
export function getWeekdayNames(
  system: CalendarSystem,
  locale: string,
  format: 'short' | 'narrow' | 'long' = 'short',
): string[] {
  const start = weekStartsOn(system, locale);
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  // 2024-01-07 was a Sunday, so day index maps directly onto the date.
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2024, 0, 7 + ((start + i) % 7))),
  );
}

/** Localized full date, with the right numerals for the locale. */
export function formatDate(
  date: Date,
  system: CalendarSystem,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const tag = system === 'jalali' ? `${locale}-u-ca-persian` : locale;
  try {
    return new Intl.DateTimeFormat(tag, options).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Year label. Kept separate so the header can show month and year in one line. */
export function formatYear(year: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { useGrouping: false }).format(year);
  } catch {
    return String(year);
  }
}

/** Day number, localized — Persian digits under `fa`, Latin under `en`. */
export function formatDay(day: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(day);
  } catch {
    return String(day);
  }
}
