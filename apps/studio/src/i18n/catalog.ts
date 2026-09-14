import type { Locale, LocaleCode, MissingKey, TextValue } from './types';

const RTL_LANGUAGES = new Set(['ar', 'fa', 'he', 'ur', 'ps', 'sd', 'ckb', 'yi', 'dv']);

export function directionForLocale(code: LocaleCode): 'ltr' | 'rtl' {
  const base = code.toLowerCase().split(/[-_]/)[0] ?? '';
  return RTL_LANGUAGES.has(base) ? 'rtl' : 'ltr';
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

/** `{ auth: { title: 'Hi' } }` → `{ 'auth.title': 'Hi' }`. */
export function flatten(source: JsonObject, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flatten(value as JsonObject, path));
    } else if (typeof value === 'string') {
      out[path] = value;
    }
  }
  return out;
}

export function parseCatalog(code: LocaleCode, label: string, raw: string): Locale {
  const parsed: unknown = JSON.parse(raw);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('A translation file must be a JSON object.');
  }
  return {
    code,
    label,
    dir: directionForLocale(code),
    messages: flatten(parsed as JsonObject),
  };
}

export function allKeys(locales: Locale[]): string[] {
  const set = new Set<string>();
  for (const locale of locales) for (const key of Object.keys(locale.messages)) set.add(key);
  return [...set].sort();
}

/** Keys referenced by the document that at least one locale does not define. */
export function findMissing(used: string[], locales: Locale[]): MissingKey[] {
  const out: MissingKey[] = [];
  for (const key of used) {
    const absent = locales.filter((l) => l.messages[key] === undefined).map((l) => l.code);
    if (absent.length) out.push({ key, locales: absent });
  }
  return out;
}

export const literal = (value: string): TextValue => ({ kind: 'literal', value });
export const keyRef = (key: string): TextValue => ({ kind: 'key', key });

export function isText(value: unknown): value is TextValue {
  if (value === null || typeof value !== 'object') return false;
  const kind = (value as { kind?: unknown }).kind;
  return kind === 'literal' || kind === 'key';
}

/**
 * Resolution never throws and never renders an empty box: a key with no
 * message shows the key itself, which is what makes a missing translation
 * visible on the canvas instead of silently blank.
 */
export function resolve(value: TextValue | undefined, locale: Locale | undefined): string {
  if (!value) return '';
  if (value.kind === 'literal') return value.value;
  return locale?.messages[value.key] ?? value.key;
}
