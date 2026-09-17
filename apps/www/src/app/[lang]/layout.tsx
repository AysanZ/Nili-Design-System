import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Providers } from '@www/components/providers';
import { SiteFooter } from '@www/components/site/site-footer';
import { SiteHeader } from '@www/components/site/site-header';
import {
  directionOf,
  isLocale,
  locales,
  type Locale,
} from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';

import '../globals.css';

/** The library's default `localStorage` key — see `ThemeProvider`. */
const STORAGE_KEY = 'nili-theme';

const THEME_INIT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

/**
 * This is the root layout — there is no `app/layout.tsx` above it. The `<html>`
 * element has to carry `lang` and `dir`, and both come from the URL, so the
 * document can only be opened once the locale is known.
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dictionary = await getDictionary(lang);

  return {
    title: 'nili/ui — a multilingual, RTL-first React design system',
    description: dictionary['ft.tagline'],
    /* Every locale points at every other one. Without this, the four
       translations compete with each other in search results instead of being
       understood as one page in four languages. */
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `/${locale}`]),
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dictionary = await getDictionary(locale);
  const t = translator(dictionary);

  return (
    <html lang={locale} dir={directionOf(locale)} suppressHydrationWarning>
      <head>
        {/* Google's copies of the three families the site sets. Deliberately
            not `next/font`: the Persian and Arabic faces are already served
            from `public/fonts` by the library's own `fonts.css`, and these are
            the Latin and Arabic display cuts layered on top. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/*
          Persian is the one script whose face is served from this origin
          rather than from Google, and it is the face the whole page is set in
          — so on `/fa` it is a render-blocking dependency the browser only
          discovers after it has parsed the stylesheet and found some Persian
          text. Preloading it removes that round trip. Only the Arabic-script
          subset: the Latin subset covers digits and brand names, which are a
          minority of the glyphs on the page and can arrive late without the
          paragraph reflowing.

          Scoped to `fa` on purpose. An English page must not download a 46 KB
          Persian face it will never draw.
        */}
        {locale === 'fa' ? (
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="/fonts/vazirmatn/vazirmatn-arabic-wght-normal.woff2"
            crossOrigin=""
          />
        ) : null}
      </head>
      <body className="bg-white-0 text-strong-950 antialiased">
        {/*
          Paints `data-theme` before the first frame. `NiliProvider` sets the
          same attribute, but only after React has booted — one to two hundred
          milliseconds of white page for every dark-mode visitor.

          It sits at the top of <body>, not in <head>, and that position is the
          fix for a real bug rather than a style choice. React only warns
          ("Encountered a script tag while rendering React component") when it
          *creates* a script in the browser instead of hydrating the one the
          server sent — and a script React creates after parsing never runs, so
          the warning meant the no-flash guard was dead on every client-side
          navigation. In <head> it was never matched: React and Next inject
          their own tags there, and the positions do not line up. As the first
          child of <body> it is an ordinary host child, hydrated in place, and
          it still executes before anything below it paints.

          Not `next/script` either: `beforeInteractive` renders through a
          client component, which guarantees the same client-side creation.

          The content is a copy of the library's own `themeInitScript()`. That
          helper lives in `providers/theme.tsx`, a module that calls
          `createContext` at the top level, and importing anything from it
          inside a Server Component evaluates that call — which React's server
          build refuses. The one thing that must not drift is `STORAGE_KEY`; it
          is the library's default.

          `suppressHydrationWarning` on <html> is the other half: this script
          mutates the element the server just rendered, which React would
          otherwise report as a mismatch.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />

        <Providers locale={locale}>
          <SiteHeader locale={locale} t={t} />
          <main id="top">{children}</main>
          <SiteFooter t={t} />
        </Providers>
      </body>
    </html>
  );
}
