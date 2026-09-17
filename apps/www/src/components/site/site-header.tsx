import { RiSearchLine } from '@remixicon/react';
import Link from 'next/link';

import { Container } from '@www/components/site/container';
import { LangSwitcher } from '@www/components/site/lang-switcher';
import { MobileNav } from '@www/components/site/mobile-nav';
import { ThemeToggle } from '@www/components/site/theme-toggle';
import type { Locale } from '@www/i18n/config';
import type { Translate } from '@www/i18n/dictionaries';

/**
 * The header is a server component. Only the two controls that need a click
 * handler — the language links and the theme button — cross into the client,
 * so the chrome costs almost nothing in JavaScript.
 */
export function SiteHeader({ locale, t }: { locale: Locale; t: Translate }) {
  const nav = [
    { href: `/${locale}/docs`, label: t('nav.docs') },
    { href: `/${locale}/components`, label: t('nav.comp') },
    { href: `/${locale}#theming`, label: t('nav.theme') },
    { href: `/${locale}#access`, label: t('nav.access') },
    { href: `/${locale}#team`, label: t('nav.team') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-soft-200 bg-white-0/85 backdrop-blur-xl">
      <Container className="flex h-[var(--site-header-h)] items-center gap-3 sm:gap-4">
        {/* The wordmark is a Latin lockup and stays one in every locale, so it
            is pinned to `ltr` — otherwise "nili/ui" reorders under `dir=rtl`
            and reads "ui/nili". */}
        <Link
          href={`/${locale}`}
          dir="ltr"
          className="flex shrink-0 items-center gap-2"
        >
          <span className="grid size-6 place-items-center rounded-md bg-strong-950">
            <span className="size-1.5 rounded-full bg-white-0" />
          </span>
          <span className="text-[15px] leading-5 font-semibold tracking-[-0.01em]">
            nili<span className="text-soft-400">/ui</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-[14px] leading-5 text-sub-600 transition-colors hover:text-strong-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
          {/* Not a field yet — the search index arrives with the component
              pages. Rendered as a `span` on purpose: an `<input>` that does
              nothing is a trap for anyone tabbing through. */}
          <span className="hidden items-center gap-2 rounded-lg border border-soft-200 bg-weak-50 px-2.5 py-1.5 lg:flex">
            <span className="inline-flex text-soft-400 [&_svg]:size-4">
              <RiSearchLine aria-hidden="true" />
            </span>
            <span className="text-[13px] leading-4 text-soft-400">
              {t('search.ph')}
            </span>
            <kbd className="ms-6 rounded border border-soft-200 bg-white-0 px-1.5 py-0.5 font-mono text-[12px] leading-4 text-soft-400">
              ⌘K
            </kbd>
          </span>

          <LangSwitcher current={locale} />
          <ThemeToggle label={t('f3.btn')} />
          <MobileNav
            items={nav}
            menuLabel={t('nav.menu')}
            closeLabel={t('nav.closeMenu')}
          />
        </div>
      </Container>
    </header>
  );
}
