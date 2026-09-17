'use client';

import { RiMoonLine, RiSunLine } from '@remixicon/react';

import { Button, useTheme } from '@www/components/nili';
import { cn } from '@www/lib/cn';

/**
 * The site's theme switch.
 *
 * It owns no state: `useTheme` reads the resolved theme from `NiliProvider`,
 * which is also what wrote `data-theme` onto `<html>` and persisted the
 * choice. Two switches on one page therefore agree with each other for free —
 * the one in the header and the one in the token section are both views of the
 * same value.
 *
 * Which glyph shows is decided in CSS, not in JavaScript. The server cannot
 * know the visitor's theme, so branching on `theme` here would render a sun on
 * the server and possibly a moon on the client, and React would report a
 * hydration mismatch on every dark-mode load. Both icons are rendered and the
 * `dark` variant — an attribute selector, per the library's `@custom-variant`
 * — hides one. Correct before hydration, correct after, and no flash.
 */
export function ThemeToggle({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg border border-soft-200 text-sub-600 transition-colors hover:bg-weak-50 hover:text-strong-950 [&_svg]:size-4',
        className,
      )}
    >
      <RiSunLine aria-hidden="true" className="dark:hidden" />
      <RiMoonLine aria-hidden="true" className="hidden dark:block" />
    </button>
  );
}

/**
 * The same action as a labelled button, for the token section — so the claim
 * "the whole page swaps" can be tested from the paragraph that makes it.
 * Same hook, so pressing either control moves both.
 */
export function ThemeToggleButton({ label }: { label: string }) {
  const { toggleTheme } = useTheme();

  return (
    <Button
      size="xs"
      color="neutral"
      appearance="stroke"
      onClick={toggleTheme}
    >
      {label}
    </Button>
  );
}
