import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  RatingFillVariantProps,
  RatingItemVariantProps,
  RatingReviewVariantProps,
} from './rating.styles';

/** Figma's Type: Star | Heart. */
export type RatingType = NonNullable<RatingFillVariantProps['type']>;
/** Figma's two empty states: Empty Line | Empty Filled. */
export type RatingEmpty = NonNullable<RatingItemVariantProps['empty']>;
/** Figma's `Rating & Review` → Alignment. */
export type RatingAlignment = NonNullable<
  RatingReviewVariantProps['alignment']
>;

export interface RatingLabels {
  /** Accessible name for the whole control. */
  root?: string;
  /** Name of one option, e.g. `` (score) => `${score} stars` ``. */
  item?: (score: string) => string;
  /**
   * How a read-only rating is announced, e.g. `'4.5 out of 5'`. Read-only
   * are a single `role="img"`, so this is the one string a screen reader gets.
   */
  summary?: (value: string, max: string) => string;
}

export interface RatingProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'color'
> {
  /** Current score. Controlled. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;

  /** Number of items. */
  max?: number;
  /** Figma's Type. Drives the glyph and its colour. */
  type?: RatingType;
  /** Which empty glyph to draw. Figma's `Empty Line` / `Empty Filled`. */
  empty?: RatingEmpty;

  /**
   * Display only — an average, a review score. Renders a single `role="img"`
   * instead of a set of radios, and accepts fractional values.
   */
  readOnly?: boolean;
  disabled?: boolean;

  /** Replaces the glyph the `type` would pick. */
  icon?: ReactNode;
  /** Empty-state glyph, when it is not simply the outline of `icon`. */
  emptyIcon?: ReactNode;

  /** Shows the numeric score beside the items. */
  showValue?: boolean;
  /** Replaces the readout — `'4.5 (128 reviews)'`, a count, anything. */
  valueLabel?: ReactNode;

  /** `name` for the underlying radios, when the form is submitted natively. */
  name?: string;
  /**
   * BCP-47 tag driving the digits (`'fa'` → Persian). Defaults to the ambient
   * locale from `NiliProvider`.
   */
  locale?: string;
  labels?: RatingLabels;

  /**
   * Figma's `Rating & Review` → Alignment. `ratings` is the bare row;
   * `vertical` and `horizontal` place `description` below it or beside it.
   */
  alignment?: RatingAlignment;
  /** Supporting copy. Figma's "Description". */
  description?: ReactNode;
  /** Action under the score. Figma's "Link Button". */
  linkButton?: ReactNode;
}
