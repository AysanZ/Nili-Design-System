import { forwardRef, useState, type ReactNode } from 'react';
import {
  RiStarFill,
  RiStarLine,
  RiHeart3Fill,
  RiHeart3Line,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDirection } from '../../providers/direction';
import { formatNumber } from '../../lib/numerals';
import { Icon } from '../icon';
import {
  ratingVariants,
  ratingItemVariants,
  ratingFillVariants,
  ratingValueVariants,
  ratingReviewVariants,
  ratingInputVariants,
  ratingGlyphVariants,
} from './rating.styles';
import type { RatingProps, RatingLabels } from './rating.types';

const DEFAULT_LABELS: Required<RatingLabels> = {
  root: 'Rating',
  item: (score) => `${score} stars`,
  summary: (value, max) => `${value} out of ${max}`,
};

/**
 * Star rating — a score to read, or a score to give.
 *
 * ## Two components in one, on purpose
 *
 * `readOnly` is not a styling flag. A review average is **content**: one
 * `role="img"` named "4.5 out of 5", which a screen reader reads once.
 * An input is a **question**: a `radiogroup` of real radios, which brings form
 * participation, roving focus and arrow-key movement from the browser instead
 * of from three hundred lines of key handling. Announcing five separate
 * "4 stars, radio, not selected" items for something the user is only meant to
 * read is noise; a static image the user cannot answer is a dead end. So the
 * two render differently.
 *
 * ## Fractions
 *
 * Fractional values render read-only only. Halving an interactive item makes
 * each target about 10px wide and gives a pointer user two indistinguishable
 * hit areas — the score you meant to give and the one you got. Averages are
 * fractional; opinions are not.
 *
 * ## RTL
 *
 * The filled glyph is clipped with `inline-size`, so a partial star fills from
 * the right in Persian with no second icon and no direction read. Item order
 * follows the flex direction, so the first star sits on the right.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    max = 5,
    type = 'star',
    empty = 'line',
    readOnly = false,
    disabled = false,
    icon,
    emptyIcon,
    showValue = false,
    valueLabel,
    name,
    locale: localeProp,
    labels,
    alignment = 'ratings',
    description,
    linkButton,
    className,
    ...rest
  },
  ref,
) {
  const { locale: ambientLocale } = useDirection();
  const locale = localeProp ?? ambientLocale;
  const generatedName = useId();
  const text = { ...DEFAULT_LABELS, ...labels };

  const [value, setValue] = useControllableState<number>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  // Hover preview is local, ephemeral state — it never leaves the component
  // and must not fire onValueChange, or a mouse crossing the row would
  // silently rate everything on the way past.
  const [preview, setPreview] = useState<number | null>(null);
  const shown = preview ?? Math.min(Math.max(value, 0), max);

  const format = (input: number) =>
    formatNumber(input, { locale, maximumFractionDigits: 1 });

  // The glyph follows Figma's Type. `Empty Filled` reuses the solid shape in
  // grey — "rated, but not this far" — where `Empty Line` uses the outline.
  const solid = type === 'heart' ? RiHeart3Fill : RiStarFill;
  const outline = type === 'heart' ? RiHeart3Line : RiStarLine;
  const filledGlyph = icon ?? <Icon icon={solid} />;
  const emptyGlyph = emptyIcon ?? icon ?? (
    <Icon icon={empty === 'filled' ? solid : outline} />
  );

  const item = (index: number): ReactNode => {
    // 0 → empty, 1 → full, anything between → a clipped fill.
    const ratio = Math.min(Math.max(shown - index, 0), 1);
    return (
      <span className={ratingGlyphVariants()}>
        <span aria-hidden>{emptyGlyph}</span>
        {ratio > 0 && (
          <span
            aria-hidden
            className={ratingFillVariants({ type })}
            style={{ inlineSize: `${ratio * 100}%` }}
          >
            {filledGlyph}
          </span>
        )}
      </span>
    );
  };

  const readout: ReactNode = valueLabel ?? (showValue ? format(shown) : null);

  // Figma's `Rating & Review`. `alignment="ratings"` is the bare row, so the
  // supporting copy only renders when there is a layout that has a place
  // for it.
  const review =
    alignment !== 'ratings' && (description != null || linkButton != null) ? (
      <span className="flex flex-col gap-1">
        {description != null && (
          <span className="text-[14px] leading-5 text-sub-600">
            {description}
          </span>
        )}
        {linkButton}
      </span>
    ) : null;

  if (readOnly) {
    return (
      <div
        ref={ref}
        className={cn(ratingReviewVariants({ alignment }), className)}
        {...rest}
      >
        <div
          role="img"
          aria-label={text.summary(format(shown), format(max))}
          className={ratingVariants()}
        >
          {Array.from({ length: max }, (_, index) => (
            <span key={index} className={ratingItemVariants({ empty })}>
              {item(index)}
            </span>
          ))}
        </div>
        {readout != null && (
          <span className={ratingValueVariants()}>{readout}</span>
        )}
        {review}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(ratingReviewVariants({ alignment }), className)}
      {...rest}
    >
      <div
        role="radiogroup"
        aria-label={text.root}
        className={ratingVariants()}
      >
        {Array.from({ length: max }, (_, index) => {
          const score = index + 1;
          return (
            <label
              key={score}
              className={ratingItemVariants({
                interactive: !disabled,
                disabled,
                empty,
              })}
              // Enter and leave sit on the item, not on the group: a handler on
              // the group would make it an interactive element that has to be
              // focusable, and focus belongs on the radios inside it.
              onMouseEnter={() => !disabled && setPreview(score)}
              onMouseLeave={() => setPreview(null)}
            >
              <input
                type="radio"
                name={name ?? generatedName}
                value={score}
                checked={Math.round(value) === score}
                disabled={disabled}
                aria-label={text.item(format(score))}
                onChange={() => setValue(score)}
                className={ratingInputVariants()}
              />
              {item(index)}
            </label>
          );
        })}
      </div>
      {readout != null && (
        <span className={ratingValueVariants()}>{readout}</span>
      )}
      {review}
    </div>
  );
});
