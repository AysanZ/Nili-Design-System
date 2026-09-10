import { cva } from 'class-variance-authority';

/**
 * Figma → "❖ Slider" page.
 *   Slider       → Percentage (0% | 25% | 50% | 75% | 100%)
 *                  || Label, Sublabel, Tooltip, Edit Label / Sublabel / Amount
 *   Range Slider → Left Range × Right Range
 *                  || the same four slots
 *
 * ## Axes this file used to invent
 *
 * - **`size` (sm | md)** does not exist. Figma draws one slider.
 * - **`color`** does not exist. The fill is always primary.
 * - **`marks` / ticks** do not exist anywhere on the page.
 *
 * `Percentage` and `Left/Right Range` are *values*, not variants — Figma has
 * to draw each position as its own frame; here it is `value`, and one thumb or
 * two follows from its shape (`number` or `[number, number]`), so a range
 * slider cannot be given a single number by accident.
 */
export const sliderRootVariants = cva('flex w-full flex-col gap-2', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-60',
      false: '',
    },
  },
  defaultVariants: { disabled: false },
});

/**
 * The filled span. Positioned with `inset-inline-start`, a logical property,
 * so the fill grows from the right inside an RTL subtree instead of running
 * backwards.
 */
export const sliderTrackVariants = cva(
  ['relative h-1.5 w-full rounded-full bg-soft-200', 'touch-none select-none'],
  {
    variants: {
      disabled: {
        true: '',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { disabled: false },
  },
);

export const sliderRangeVariants = cva(
  'absolute inset-y-0 rounded-full bg-primary-base',
);

export const sliderThumbVariants = cva(
  [
    'absolute top-1/2 size-5 -translate-y-1/2',
    'rounded-full border-2 border-primary-base bg-white-0',
    'shadow-xs transition-[box-shadow,transform] duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:cursor-not-allowed disabled:border-soft-200 disabled:bg-weak-50',
  ],
  {
    variants: {
      disabled: {
        true: '',
        false: 'cursor-grab active:cursor-grabbing hover:scale-110',
      },
    },
    defaultVariants: { disabled: false },
  },
);

/**
 * Figma's `Tooltip` slot: the current value in a bubble above the thumb.
 * Positioned with a logical inset so it tracks the thumb in both directions.
 */
export const sliderTooltipVariants = cva([
  'pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 rtl:translate-x-1/2',
  'rounded-md bg-strong-950 px-2 py-1',
  'text-[11px] leading-4 font-medium tabular-nums text-static-white',
  'whitespace-nowrap shadow-xs',
]);

export const sliderHeaderVariants = cva(
  'flex items-center justify-between gap-2 text-[14px] leading-5',
);
