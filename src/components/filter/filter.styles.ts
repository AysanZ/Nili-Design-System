import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Filter" page (node 2868:15964).
 *   Horizontal Filter    → Type (Calendar | Table)
 *   Vertical Filter Items→ State (Default | Hover | Active)
 *
 * "Calendar" and "Table" describe the *surface* being filtered, not a visual
 * difference — both render a row of filter controls. So they are not a variant:
 * `FilterBar` is the row, and what you put in it is your business.
 */

export const filterBarVariants = cva(
  'flex w-full flex-wrap items-center gap-2',
  {
    variants: {
      surface: {
        plain: '',
        /** Boxed, for a filter bar pinned above a table. */
        panel: 'rounded-xl border border-soft-200 bg-white-0 p-2',
      },
    },
    defaultVariants: { surface: 'plain' },
  },
);

export const filterChipVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.5 rounded-lg border',
    'text-[14px] font-medium leading-5',
    'transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:text-sub-300',
  ],
  {
    variants: {
      active: {
        true: 'border-primary-base bg-information-lighter text-primary-base',
        false:
          'border-soft-200 bg-white-0 text-sub-600 hover:bg-weak-50 hover:text-strong-950',
      },
      /** A dashed chip reads as "add a filter" rather than "a filter is set". */
      placeholder: {
        true: 'border-dashed',
        false: '',
      },
    },
    defaultVariants: { active: false, placeholder: false },
  },
);

export const filterListVariants = cva('flex w-full flex-col gap-0.5');

/**
 * Figma Vertical Filter Items: 32px, radius 8, 20px icon, 14px text.
 * Default: icon soft-400, text sub-600 · Hover: weak-50, icon sub-600 ·
 * Active: weak-50, primary icon, strong-950 text and a chevron at the end.
 */
export const filterListItemVariants = cva(
  [
    'flex h-8 w-full items-center gap-2 rounded-md px-2 text-start outline-hidden',
    'text-[14px] leading-5 transition-colors duration-200',
    '[&_[data-slot=start-icon]_svg]:size-5',
    'focused:shadow-focus-neutral',
    'disabled:pointer-events-none disabled:text-sub-300',
  ],
  {
    variants: {
      active: {
        true: 'bg-weak-50 text-strong-950 [&_[data-slot=start-icon]]:text-primary-base',
        false:
          'text-sub-600 [&_[data-slot=start-icon]]:text-soft-400 hovered:bg-weak-50 hovered:[&_[data-slot=start-icon]]:text-sub-600',
      },
    },
    defaultVariants: { active: false },
  },
);

export type FilterChipVariantProps = VariantProps<typeof filterChipVariants>;
