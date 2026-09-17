import type { Locale } from './config';

import ar from './dictionaries/ar.json';
import en from './dictionaries/en.json';
import fa from './dictionaries/fa.json';
import tr from './dictionaries/tr.json';

/**
 * English is the source dictionary, so its keys are the type. A missing key in
 * `fa.json` is a compile error rather than a string that quietly renders in
 * the wrong language.
 */
export type Dictionary = typeof en;
export type MessageKey = keyof Dictionary;

const dictionaries: Record<Locale, Dictionary> = { en, fa, ar, tr };

/**
 * Async on purpose. The dictionaries are small enough to bundle today, but the
 * call sites are already `await`ing, so moving to `import()` per locale later
 * is a change to this file only.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}

/** A bound lookup, so components take `t` rather than a dictionary and a locale. */
export type Translate = (key: MessageKey) => string;

export function translator(dictionary: Dictionary): Translate {
  return (key) => dictionary[key];
}
