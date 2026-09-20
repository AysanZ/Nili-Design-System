import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, isLocale, locales } from '@www/i18n/config';

/**
 * Every page lives under a locale, so a bare `/` has to become one.
 *
 * The choice is a redirect rather than a rewrite: the visitor ends up at a URL
 * that says which language they are reading, which is what makes it
 * shareable, bookmarkable and cacheable. A rewrite would serve four different
 * pages from one address and defeat both the CDN and the back button.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

/**
 * First match from `Accept-Language`, falling back to English. Deliberately
 * simple: this is a first guess, and the language switcher in the header is
 * the real answer. Quality values are ignored because browsers send them in
 * descending order anyway.
 */
function preferredLocale(request: NextRequest) {
  const header = request.headers.get('accept-language') ?? '';

  for (const entry of header.split(',')) {
    const tag = entry.split(';')[0]?.trim().toLowerCase() ?? '';
    const base = tag.split('-')[0] ?? '';
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}

export const config = {
  /* Everything except Next's own assets, the public folder and the files a
     crawler fetches from the root by convention. */
  matcher: [
    '/((?!_next|favicon.ico|icon.svg|robots.txt|sitemap.xml|fonts|flags|avatars|card-providers).*)',
  ],
};
