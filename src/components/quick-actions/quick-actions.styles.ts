import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Quick Actions" page.
 *
 *   Quick Action Item → State = Default | Hover | Active | Disabled,
 *                       Icon = On | Off, Description = On | Off,
 *                       Layout = Horizontal | Vertical
 *
 * Hover and disabled are CSS states, not props (README → component API
 * conventions), so what survives as variants is layout, weight and tone.
 */
export const quickActionsVariants = cva('grid w-full', {
  variants: {
    /**
     * `row` scrolls horizontally instead of wrapping: a dashboard shortcut row
     * that reflows to two lines on a phone pushes the content below it off
     * screen, which is the one thing a shortcut must never do.
     */
    layout: {
      grid: '',
      row: 'auto-cols-[minmax(9rem,1fr)] grid-flow-col overflow-x-auto',
    },
    size: {
      sm: 'gap-2',
      md: 'gap-3',
    },
  },
  defaultVariants: { layout: 'grid', size: 'md' },
});

export const quickActionItemVariants = cva(
  [
    'group/quick-action relative flex w-full items-center text-start',
    'cursor-pointer transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:text-sub-300',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300',
  ],
  {
    variants: {
      appearance: {
        card: 'rounded-xl border border-soft-200 bg-white-0 shadow-xs hovered:bg-weak-50',
        tile: 'rounded-xl bg-weak-50 hovered:bg-soft-200/60',
        ghost: 'rounded-lg bg-transparent hovered:bg-weak-50',
        /** Figma Quick Actions Items: a flat row, radius 10, no border. */
        list: 'rounded-[10px] bg-transparent hovered:bg-weak-50',
      },
      layout: {
        horizontal: 'flex-row gap-3',
        /** Icon over label — the square tile a phone grid is made of. */
        vertical: 'flex-col items-center gap-2 text-center',
      },
      size: {
        sm: 'p-2.5',
        md: 'p-3',
      },
      /** The shortcut that is currently in effect. Adds `aria-pressed`. */
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        active: true,
        appearance: 'card',
        class:
          'border-primary-base bg-information-lighter hover:bg-information-lighter',
      },
      { active: true, appearance: 'tile', class: 'bg-information-lighter' },
      { active: true, appearance: 'ghost', class: 'bg-weak-50' },
      { active: true, appearance: 'list', class: 'bg-weak-50' },
    ],
    defaultVariants: {
      appearance: 'card',
      layout: 'horizontal',
      size: 'md',
      active: false,
    },
  },
);

export const quickActionIconVariants = cva(
  'grid shrink-0 place-items-center rounded-lg transition-colors duration-150',
  {
    variants: {
      tone: {
        neutral:
          'bg-weak-50 text-sub-600 group-hover/quick-action:text-strong-950',
        primary: 'bg-primary-alpha-10 text-primary-base',
        information: 'bg-information-lighter text-information-base',
        success: 'bg-success-lighter text-success-base',
        warning: 'bg-warning-lighter text-warning-base',
        error: 'bg-error-lighter text-error-base',
        feature: 'bg-feature-lighter text-feature-base',
        away: 'bg-away-lighter text-away-base',
        verified: 'bg-verified-lighter text-verified-base',
      },
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export const quickActionLabelVariants = cva(
  'block truncate font-medium text-strong-950',
  {
    variants: {
      size: {
        sm: 'text-[12px] leading-4',
        md: 'text-[14px] leading-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const quickActionDescriptionVariants = cva(
  'block text-[12px] leading-4 text-sub-600',
);

/** `⌘K`-style hint at the trailing edge. Latin by convention, even in Persian. */
export const quickActionShortcutVariants = cva(
  'shrink-0 rounded-md border border-soft-200 bg-white-0 px-1.5 py-0.5 font-mono text-[11px] leading-4 text-sub-600',
);

export type QuickActionsVariantProps = VariantProps<
  typeof quickActionsVariants
>;
export type QuickActionItemVariantProps = VariantProps<
  typeof quickActionItemVariants
>;
export type QuickActionIconVariantProps = VariantProps<
  typeof quickActionIconVariants
>;
