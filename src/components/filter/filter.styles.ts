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

/**
 * One filter control.
 *
 * The base used to carry no padding and no height at all, so every chip
 * collapsed to the width of its text and a row of them read as a run of bare
 * words with a stray bordered box around the clear button. Height and inline
 * padding are part of the chip, not something the call site supplies.
 *
 * `h-*` plus `px-*` rather than `py-*`: a fixed height is what keeps a chip
 * with an icon, a chip with a value and a chip with neither on the same
 * baseline as the Search field and the Filter button beside them.
 */
export const filterChipVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.5 rounded-lg border',
    'text-[14px] leading-5 font-medium whitespace-nowrap',
    'transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:text-sub-300',
    '[&_svg]:size-5 [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        /** Figma's toolbar row: 32px, to match Button `sm` next to it. */
        sm: 'h-8 gap-1.5 px-2.5',
        md: 'h-10 gap-2 px-3',
      },
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
    defaultVariants: { size: 'sm', active: false, placeholder: false },
  },
);

/**
 * The clear half of a chip that has a value.
 *
 * Square, and narrower than the chip's own padding, so the pair reads as one
 * control with a divider rather than as two buttons that happen to touch.
 */
export const filterChipClearVariants = cva(
  'shrink-0 border-s-0 px-0 rounded-s-none',
  {
    variants: {
      size: {
        sm: 'w-7',
        md: 'w-9',
      },
    },
    defaultVariants: { size: 'sm' },
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
