'use client';

import { usePathname } from 'next/navigation';

import { locales, type Locale } from '@www/i18n/config';

/**
 * Four links, not four buttons.
 *
 * The locale is a path segment, so switching language is a navigation: it has
 * a URL, it works with the back button, middle-click opens Persian in a new
 * tab, and a crawler can see all four. A `useState` toggle would have none of
 * that.
 *
 * Plain `<a>`, not `next/link`, and that is the one deliberate exception on
 * this site. Everything a locale change touches lives on the document itself:
 * `lang` and `dir` on `<html>`, the font stack those attributes select, the
 * `fa`-only font preload, and the theme script that runs before the first
 * paint. A soft navigation re-renders the root layout in the browser and
 * mutates `<html>` mid-session instead — which is why switching language was
 * the one navigation that logged "Encountered a script tag while rendering
 * React component": React was re-creating the theme script client-side, where
 * a created script never runs. It also meant `/fa` reached by the switcher
 * never got the Persian font preload, since that link only exists in
 * server-rendered HTML.
 *
 * A document load costs one request and gives the new language a clean start:
 * correct direction from the first frame, the right font already requested,
 * the theme painted before React boots.
 *
 * Each label is marked `lang` with its own code so the browser picks the right
 * font for it — العربية renders in the Arabic stack even while the page around
 * it is English.
 */
export function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  /* `/fa/components/button` → `/ar/components/button`. The first segment is
     always the locale, guaranteed by the route structure. */
  const swap = (next: Locale) => {
    const segments = pathname.split('/');
    segments[1] = next;
    return segments.join('/') || `/${next}`;
  };

  return (
    <div
      className="flex overflow-hidden rounded-lg border border-soft-200"
      role="group"
      aria-label="Language"
    >
      {locales.map((locale) => (
        <a
          key={locale}
          href={swap(locale)}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
          className="px-2 py-1.5 text-[12px] leading-4 text-sub-600 uppercase transition-colors hover:bg-weak-50 aria-[current]:bg-strong-950 aria-[current]:text-white-0"
        >
          {locale}
        </a>
      ))}
    </div>
  );
}
