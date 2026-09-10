/**
 * Docs-only building blocks shared by every component's Storybook pages.
 *
 * NOT part of the library: nothing in `src/index.ts` imports this folder,
 * and `*.docs.tsx` is excluded from the type build in vite.config.ts.
 *
 * Hover / Focus cells are drawn with `data-nili-state`, which the `hovered:`
 * and `focused:` variants (styles/variants.css) treat like the real
 * pseudo-class — so a docs picture is always the component's own styling.
 */
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export const STATES = ['default', 'hover', 'focus', 'disabled'] as const;
export type DocState = (typeof STATES)[number];

/** Props that put a component into one Figma state, statically. */
export function stateProps(state: DocState) {
  if (state === 'hover' || state === 'focus') {
    return { 'data-nili-state': state } as const;
  }
  if (state === 'disabled') return { disabled: true } as const;
  return {};
}

/** i18n keys for the Figma 📌 State names. */
export const STATE_KEY: Record<DocState, string> = {
  default: 'docs.stateDefault',
  hover: 'docs.stateHover',
  focus: 'docs.stateFocus',
  disabled: 'docs.stateDisabled',
};

/** The dashed purple frame Figma draws around a component set. */
export function FigmaFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="max-w-full overflow-x-auto">
      <div
        className={cn(
          'inline-flex flex-col gap-14 rounded-[5px] border border-dashed border-[#9747FF] p-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Small axis caption — the only thing added on top of the Figma drawing. */
export function Caption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-[11px] leading-4 font-medium tracking-[0.04em] whitespace-nowrap text-soft-400 uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A size (or variant) heading over a matrix. */
export function SizeBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <span className="text-[14px] leading-5 font-medium text-strong-950">
        {label}
      </span>
      {children}
    </section>
  );
}
