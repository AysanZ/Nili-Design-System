import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Progress Bar" page.
 *   Progress Bar Line      → Color (Empty | Blue | Red | Green | Orange)
 *   Progress Bar           → Percentage (0…100%) × Direction (LTR | RTL)
 *   Progress Bar Label     → Type (On Top | On Right) × Show Bottom
 *                            || Show Percentage, Link Button
 *   Circular Progress Bar  → Percentage × Size (80 | 72 | 64 | 56 | 48 | 40)
 *                            || Number
 *
 * ## What changed to match
 *
 * - **`size` on the linear bar does not exist** and is gone. Figma draws one
 *   track height. The Size axis lives on the circular form only.
 * - **`color` had six values; Figma has five.** `feature` and `neutral` were
 *   invented. The remaining four keep their semantic names rather than Figma's
 *   literal Blue/Red/Green/Orange: a theme can repoint `--nili-primary-base` at
 *   any hue, so a prop called `blue` would become a lie the moment anyone
 *   builds one.
 * - **`Direction (LTR | RTL)` is not a prop.** Figma has to draw both; here the
 *   fill uses logical properties and follows `dir` for free.
 * - `Percentage` is `value`, not a variant, for the same reason.
 */
export const progressTrackVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-soft-200',
);

export const progressFillVariants = cva(
  'h-full rounded-full transition-[inline-size] duration-300 ease-out motion-reduce:transition-none',
  {
    variants: {
      color: {
        primary: 'bg-primary-base',
        success: 'bg-success-base',
        warning: 'bg-warning-base',
        error: 'bg-error-base',
      },
      /**
       * Unknown duration. The stripe travels along `inset-inline-start`, a
       * logical property, so it runs right-to-left in Persian without a second
       * keyframe or a direction read in JavaScript.
       */
      indeterminate: {
        true: 'absolute top-0 w-2/5 animate-[nili-progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:w-full',
        false: '',
      },
    },
    defaultVariants: { color: 'primary', indeterminate: false },
  },
);

export const progressLabelVariants = cva(
  'flex items-center gap-2 text-[14px] leading-5',
  {
    variants: {
      /** Figma's label `Type`: above the track, or beside it. */
      position: {
        top: 'justify-between',
        end: 'shrink-0',
      },
    },
    defaultVariants: { position: 'top' },
  },
);

/** Radial readout — same value, for tiles and cards where width is scarce. */
export const progressCircleVariants = cva(
  'relative inline-grid place-items-center',
  {
    variants: {
      /** Figma's circular Size, in pixels. */
      size: {
        80: 'size-20 text-[18px] leading-6',
        72: 'size-[72px] text-[16px] leading-6',
        64: 'size-16 text-[16px] leading-6',
        56: 'size-14 text-[14px] leading-5',
        48: 'size-12 text-[12px] leading-4',
        40: 'size-10 text-[11px] leading-4',
      },
    },
    defaultVariants: { size: 64 },
  },
);

export const progressCircleStrokeVariants = cva(
  'transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none',
  {
    variants: {
      color: {
        primary: 'stroke-primary-base',
        success: 'stroke-success-base',
        warning: 'stroke-warning-base',
        error: 'stroke-error-base',
      },
    },
    defaultVariants: { color: 'primary' },
  },
);

export type ProgressFillVariantProps = VariantProps<
  typeof progressFillVariants
>;
export type ProgressLabelVariantProps = VariantProps<
  typeof progressLabelVariants
>;
export type ProgressCircleVariantProps = VariantProps<
  typeof progressCircleVariants
>;
