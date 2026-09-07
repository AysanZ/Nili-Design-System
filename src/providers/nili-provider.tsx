import type { ReactNode } from 'react';
import { ThemeProvider, type ThemeProviderProps } from './theme';
import { DirectionProvider, type DirectionProviderProps } from './direction';

export interface NiliProviderProps
  extends
    Omit<ThemeProviderProps, 'children' | 'attributeTarget'>,
    Omit<DirectionProviderProps, 'children' | 'attributeTarget'> {
  children: ReactNode;
  /**
   * `'document'` (default) writes `data-theme`, `lang` and `dir` onto `<html>`.
   * `'self'` scopes them to a wrapper element instead, so several providers
   * can coexist on one page — that is exactly what the docs site and the
   * theme-builder preview pane need.
   */
  attributeTarget?: 'document' | 'self';
}

/**
 * The single place where the two global decisions live: which theme is
 * painted, and which way the page reads.
 *
 * Deliberately does NOT own translation. Components take their strings as
 * props, so the library ships without an i18n runtime and consumers stay
 * free to use i18next, react-intl, Next.js routing, or nothing at all.
 */
export function NiliProvider({
  children,
  attributeTarget = 'document',
  defaultTheme,
  theme,
  onThemeChange,
  storageKey,
  locale,
  dir,
}: NiliProviderProps) {
  return (
    <ThemeProvider
      attributeTarget={attributeTarget}
      defaultTheme={defaultTheme}
      theme={theme}
      onThemeChange={onThemeChange}
      storageKey={storageKey}
    >
      <DirectionProvider
        attributeTarget={attributeTarget}
        locale={locale}
        dir={dir}
      >
        {children}
      </DirectionProvider>
    </ThemeProvider>
  );
}
