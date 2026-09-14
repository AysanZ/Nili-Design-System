import type { ThemeTokens } from './tokens';

export const DEFAULT_THEME: ThemeTokens = {
  primary: '#335CFF',
  primaryDarker: '#2547D0',
  error: '#FB3748',
  success: '#1FC16B',
  warning: '#FF9147',
  information: '#335CFF',
  feature: '#7D52F4',
  strong: '#0E121B',
  sub: '#525866',
  soft: '#E1E4EA',
  weak: '#F5F7FA',
  surface: '#FFFFFF',
  radius: 10,
  fontFamily: 'Automatic',
};

/** Indigo is the colour "nili" actually names; it sits between the library's
 *  own blue-900 and purple-900. */
export const PRESETS: Record<string, ThemeTokens> = {
  'Nili blue': DEFAULT_THEME,
  'Nili indigo': { ...DEFAULT_THEME, primary: '#2B2688', primaryDarker: '#1F1B66', information: '#2B2688', radius: 12 },
  'High contrast': { ...DEFAULT_THEME, primary: '#0033CC', primaryDarker: '#002499', soft: '#8A8F99', sub: '#2A2F38', radius: 6 },
  Soft: { ...DEFAULT_THEME, primary: '#5B7CFA', primaryDarker: '#4762D8', soft: '#EDEFF4', radius: 16 },
};

/**
 * `Automatic` picks by script: Inter for Latin, Vazirmatn for Arabic script.
 * Pinning one family for both is the wrong trade in either direction — Inter
 * has no Persian glyphs, and Vazirmatn's Latin is not what an English screen
 * should ship.
 */
export const FONT_OPTIONS = ['Automatic', 'Inter', 'Vazirmatn', 'IBM Plex Sans', 'Sora'] as const;

export const resolveFont = (choice: string, dir: 'ltr' | 'rtl'): string =>
  choice === 'Automatic' ? (dir === 'rtl' ? 'Vazirmatn' : 'Inter') : choice;
