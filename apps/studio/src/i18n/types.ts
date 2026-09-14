export type LocaleCode = string;

export type Direction = 'ltr' | 'rtl';

export interface Locale {
  code: LocaleCode;
  label: string;
  dir: Direction;
  /** Flat key → message. Nested JSON is flattened on import. */
  messages: Record<string, string>;
}

/**
 * Every text-valued prop holds one of these rather than a bare string, so a
 * document can be authored once and rendered in any locale. `literal` exists
 * because not all copy belongs in a catalogue — a placeholder email address
 * is the same in every language.
 */
export type TextValue =
  | { kind: 'literal'; value: string }
  | { kind: 'key'; key: string };

export interface MissingKey {
  key: string;
  locales: LocaleCode[];
}
