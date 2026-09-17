'use client';

import { useEffect, useState } from 'react';
import { RiCloseLine, RiMenuLine } from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * The header navigation, below `md`.
 *
 * The links were simply `hidden md:flex`, which on a phone left the header
 * with a wordmark, a language switcher and a theme button and no way to reach
 * Docs, Components or any of the sections — the whole site, unreachable from
 * the top of the page.
 *
 * A disclosure rather than a drawer: the panel is a sibling of the header's
 * own row, so it pushes nothing, traps nothing, and needs no focus management
 * beyond closing itself. It closes on navigation and on Escape.
 */
export function MobileNav({
  items,
  menuLabel,
  closeLabel,
}: {
  items: { href: string; label: string }[];
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? closeLabel : menuLabel}
        className="grid size-8 place-items-center rounded-lg border border-soft-200 text-sub-600 transition-colors hover:border-sub-300 hover:text-strong-950 [&_svg]:size-4"
      >
        {open ? (
          <RiCloseLine aria-hidden="true" />
        ) : (
          <RiMenuLine aria-hidden="true" />
        )}
      </button>

      <div
        id="site-nav"
        hidden={!open}
        className="absolute inset-x-0 top-[var(--site-header-h)] border-b border-soft-200 bg-white-0/95 backdrop-blur-xl"
      >
        <nav
          aria-label={menuLabel}
          className="mx-auto flex w-full max-w-[1120px] flex-col gap-0.5 px-4 py-3 sm:px-6"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-[14px] leading-5 text-sub-600 transition-colors hover:bg-weak-50 hover:text-strong-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
