import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Rating" page.
 *   Rating Items    → Type (Star | Heart) × State (Empty Line | Empty Filled | Half | Full)
 *   Rating Cell     → Type (Star | Heart) × State (Default | Hover | Selected)
 *   Rating & Review → Type (Star | Heart) × Alignment (Only Ratings | Vertical | Horizontal)
 *                     || Description, Link Button, Edit Text
 *
 * ## Axes this file used to invent
 *
 * - **`size` (Small | Medium | Large)** does not exist. The docblock here used
 *   to claim it did; there is no Size axis anywhere on the page.
 * - **`color`** does not exist either. Stars are always warning-yellow and
 *   hearts always error-red, which follows from `type` rather than being a
 *   free choice.
 *
 * Value is not a variant. Figma draws each score as its own frame; here the
 * fill comes from `value`, so 3.7 renders as three and a bit — a quantised
 * variant would be a component that cannot show the average it is given.
 */
export const ratingVariants = cva(
  'inline-flex items-center gap-1 [&_svg]:size-5',
);

/**
 * The filled glyph sits on top of the empty one and is clipped with a logical
 * inline size, so a half star fills from the right in Persian without a second
 * icon or a direction read in JavaScript.
 */
export const ratingFillVariants = cva(
  'pointer-events-none absolute inset-0 overflow-hidden',
  {
    variants: {
      /** Figma's Type. The colour follows the glyph; it is not a free choice. */
      type: {
        star: 'text-warning-base',
        heart: 'text-error-base',
      },
    },
    defaultVariants: { type: 'star' },
  },
);

export const ratingValueVariants = cva(
  'ms-1.5 text-[14px] leading-5 tabular-nums text-sub-600',
);

/**
 * One item in the row. Figma's `Rating Items` → State covers the two empty
 * forms as well as half and full: `Empty Line` is an outline glyph and
 * `Empty Filled` a flat grey one — the first reads as "not rated yet", the
 * second as "rated, but not this far".
 */
export const ratingItemVariants = cva(
  ['relative inline-grid place-items-center', 'transition-colors duration-150'],
  {
    variants: {
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
      empty: {
        line: 'text-soft-400',
        filled: 'text-soft-200',
      },
    },
    defaultVariants: { interactive: false, disabled: false, empty: 'line' },
  },
);

/**
 * The radio that carries the interaction and the semantics. Transparent and
 * stretched over the glyph rather than `display:none` — a hidden input cannot
 * be focused, and the whole point of using radios here is the keyboard
 * behaviour browsers give them for free.
 */
export const ratingInputVariants = cva([
  'peer absolute inset-0 m-0 cursor-pointer appearance-none opacity-0',
  'disabled:cursor-not-allowed',
]);

/** Focus lands on the input; the ring is drawn on the glyph beside it. */
export const ratingGlyphVariants = cva([
  'pointer-events-none relative rounded-sm',
  'peer-focus-visible:outline peer-focus-visible:outline-2',
  'peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-base',
]);

/**
 * Figma's `Rating & Review` → `Alignment`. The score on its own, stacked above
 * its description, or beside it.
 */
export const ratingReviewVariants = cva('flex', {
  variants: {
    alignment: {
      ratings: 'items-center',
      vertical: 'flex-col items-start gap-1',
      horizontal: 'flex-row items-center gap-3',
    },
  },
  defaultVariants: { alignment: 'ratings' },
});

export type RatingItemVariantProps = VariantProps<typeof ratingItemVariants>;
export type RatingFillVariantProps = VariantProps<typeof ratingFillVariants>;
export type RatingReviewVariantProps = VariantProps<
  typeof ratingReviewVariants
>;
