'use client';

import type { ReactNode } from 'react';

import { NiliProvider } from '@www/components/nili';
import { directionOf, type Locale } from '@www/i18n/config';

/**
 * Theme and direction for the whole document.
 *
 * `locale` comes from the URL, not from the browser, so `/fa` is the same page
 * for everyone and can be cached, shared and crawled. The provider mirrors it
 * onto `<html>` after hydration; the server already rendered the same pair of
 * attributes, so there is nothing to correct and nothing flashes.
 */
export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <NiliProvider
      locale={locale}
      dir={directionOf(locale)}
      defaultTheme="system"
    >
      {children}
    </NiliProvider>
  );
}
