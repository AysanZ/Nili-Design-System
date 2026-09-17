'use client';

import { useEffect, useState } from 'react';
import { RiCloseLine, RiMenuLine } from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@www/lib/cn';
import type { Locale } from '@www/i18n/config';

export interface SidebarGroup {
  id: string;
  label: string;
  entries: { dir: string; name: string }[];
}

interface Props {
  locale: Locale;
  groups: SidebarGroup[];
  navLabel: string;
  browseAllLabel: string;
  jumpToLabel: string;
  /** Shown at the end of the narrow-screen trigger: "Browse" / "Close". */
  openLabel: string;
  closeLabel: string;
}

/**
 * The `/components` navigation: every entry, grouped, with the active one
 * highlighted — the shadcn/ui docs layout, rather than a page of cards you
 * click into and back out of one at a time.
 *
 * Takes already-translated strings rather than the `t()` function itself:
 * this is a client component (it needs `usePathname` to know which link is
 * active), and a translator closure created on the server cannot cross that
 * boundary — only the plain data it produces can.
 *
 * Two renderings of the same data, and they are deliberately not the same
 * shape.
 *
 * From `lg` up it is the persistent left column, sticky under the site header
 * and scrolling inside its own height.
 *
 * Below `lg` it used to be a horizontal strip of every entry — forty-one pills
 * in one swipeable row, with the group headings thrown away because a row has
 * nowhere to put them. Finding `Tooltip` meant swiping past thirty other
 * things with no idea how much was left. So the narrow layout is a disclosure
 * instead: one control that says where you are, and the same grouped list
 * under it once opened. It closes on navigation and on Escape — a menu still
 * covering the page you just asked for is a menu you have to dismiss before
 * you can read anything.
 */
export function ComponentsSidebar({
  locale,
  groups,
  navLabel,
  browseAllLabel,
  jumpToLabel,
  openLabel,
  closeLabel,
}: Props) {
  const pathname = usePathname();
  const activeDir = pathname?.split('/components/')[1]?.split('/')[0];
  const [open, setOpen] = useState(false);

  /* Close on navigation. The panel sits outside the page it links into, so
     nothing else would unmount it. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const activeName = activeDir
    ? groups
        .flatMap((group) => group.entries)
        .find((entry) => entry.dir === activeDir)?.name
    : undefined;

  const list = (
    <div className="flex flex-col gap-6">
      <Link
        href={`/${locale}/components`}
        className={cn(
          'rounded-md px-2.5 py-1.5 text-[13px] leading-5 font-medium transition-colors',
          !activeDir
            ? 'bg-weak-50 text-strong-950'
            : 'text-sub-600 hover:bg-weak-50 hover:text-strong-950',
        )}
      >
        {browseAllLabel}
      </Link>

      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          <span className="px-2.5 text-[11px] leading-4 font-medium tracking-[0.06em] text-soft-400 uppercase">
            {group.label}
          </span>
          <ul className="flex flex-col gap-0.5">
            {group.entries.map((entry) => {
              const active = entry.dir === activeDir;
              return (
                <li key={entry.dir}>
                  <Link
                    href={`/${locale}/components/${entry.dir}`}
                    dir="ltr"
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-md border-s-2 px-2.5 py-1.5 text-start text-[13px] leading-5 transition-colors',
                      active
                        ? 'border-primary-base bg-weak-50 font-medium text-strong-950'
                        : 'border-transparent text-sub-600 hover:bg-weak-50 hover:text-strong-950',
                    )}
                  >
                    {entry.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* ── lg and up: the column ─────────────────────────────────── */}
      <aside
        className={cn(
          'nili-scroll hidden',
          'lg:sticky lg:top-[var(--site-header-h)] lg:block lg:h-[calc(100dvh-var(--site-header-h))]',
          'lg:w-[240px] lg:shrink-0 lg:overflow-y-auto lg:py-8 lg:pe-3',
        )}
      >
        <nav aria-label={navLabel}>{list}</nav>
      </aside>

      {/* ── below lg: the disclosure ──────────────────────────────── */}
      <div className="lg:hidden">
        <div className="sticky top-[var(--site-header-h)] z-30 -mx-4 border-b border-soft-200 bg-white-0/85 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="components-nav"
            className="flex w-full items-center gap-2 rounded-lg border border-soft-200 px-3 py-2 text-start text-[13px] leading-5 transition-colors hover:border-sub-300"
          >
            <span className="inline-flex text-soft-400 [&_svg]:size-4">
              {open ? (
                <RiCloseLine aria-hidden="true" />
              ) : (
                <RiMenuLine aria-hidden="true" />
              )}
            </span>
            <span className="truncate font-medium text-strong-950">
              {activeName ?? browseAllLabel}
            </span>
            <span className="ms-auto shrink-0 text-[12px] text-soft-400">
              {open ? closeLabel : openLabel}
            </span>
          </button>
        </div>

        <div
          id="components-nav"
          hidden={!open}
          className="nili-scroll -mx-4 max-h-[min(70dvh,32rem)] overflow-y-auto border-b border-soft-200 px-4 py-5 sm:-mx-6 sm:px-6"
        >
          <nav aria-label={jumpToLabel}>{list}</nav>
        </div>
      </div>
    </>
  );
}
