import { forwardRef, useState, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  RiStarFill,
  RiStarLine,
  RiHeart3Fill,
  RiHeart3Line,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { formatNumber } from '../../lib/numerals';
import { Icon } from '../icon';

/**
 * Figma → "❖ Rating" page.
 *   Rating Bar Items → Type (🙂 Emoji | ⏺️ Number | ⭐️ Star | 💜 Heart)
 *                      × State (Default · Hover · Selected)
 *   Rating Bar       → Type, five items in a row (320 × 36)
 *   Rating Bar Area  → Rating Bar above a comment box
 *
 * This is a **different component from `Rating`**, which is why it is not a
 * fifth value on `RatingType`. `Rating` answers "how good was it, out of five"
 * and supports fractions because it also renders averages. A Rating Bar is a
 * survey scale: exactly one of N discrete choices, never fractional, never
 * read-only, and the Emoji and Number forms have no notion of "3.7 filled".
 */
export const ratingBarVariants = cva('flex w-full items-stretch');

/** One 64×36 cell. Figma pads 8/4 and centres a single 20px glyph. */
export const ratingBarItemVariants = cva(
  [
    'relative flex flex-1 flex-col items-center justify-center',
    'px-1 py-2 text-[14px] leading-5 tabular-nums',
    'transition-colors duration-150 [&_svg]:size-5',
    'first:rounded-s-lg last:rounded-e-lg',
    'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2',
    'has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-base',
  ],
  {
    variants: {
      /** Figma `🧩 Type`. */
      type: {
        emoji: '',
        number: '',
        star: '',
        heart: '',
      },
      selected: {
        true: '',
        false: 'text-sub-600',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: 'cursor-pointer hover:bg-weak-50',
      },
    },
    compoundVariants: [
      // Selected colour follows the glyph, exactly as in `Rating`: stars are
      // warning-yellow, hearts error-red, and the two text forms take the
      // brand colour because there is no glyph to inherit from.
      { type: 'star', selected: true, class: 'text-warning-base' },
      { type: 'heart', selected: true, class: 'text-error-base' },
      {
        type: 'number',
        selected: true,
        class: 'bg-primary-base font-medium text-static-white',
      },
      { type: 'emoji', selected: true, class: 'bg-weak-50' },
    ],
    defaultVariants: { type: 'star', selected: false, disabled: false },
  },
);

export const ratingBarInputVariants = cva([
  'peer absolute inset-0 m-0 cursor-pointer appearance-none opacity-0',
  'disabled:cursor-not-allowed',
]);

/** The comment box under the scale. Figma `Rating Bar Area` → the `Input` frame. */
export const ratingBarAreaVariants = cva([
  'flex w-full flex-col overflow-hidden rounded-xl border border-soft-200 bg-white-0',
]);

export type RatingBarVariantProps = VariantProps<typeof ratingBarItemVariants>;
export type RatingBarType = NonNullable<RatingBarVariantProps['type']>;

/** Figma's five faces, in order: Pensive → Grinning with smiling eyes. */
export const RATING_BAR_EMOJIS = ['😔', '😕', '😐', '🙂', '😄'] as const;

export interface RatingBarLabels {
  /** Names the whole scale, e.g. `'رضایت شما'`. */
  root?: string;
  /** Names one option: `(score, total) => string`. */
  item?: (score: string, total: string) => string;
}

export interface RatingBarProps {
  /** Figma `🧩 Type`. */
  type?: RatingBarType;
  /** How many options. Figma draws five; the count is yours. */
  count?: number;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  /** Overrides the emoji set. Must be at least `count` long. */
  emojis?: readonly ReactNode[];
  /** Digits follow the locale, so `4` reads as `۴` in Persian. */
  locale?: string;
  labels?: RatingBarLabels;
  name?: string;
  id?: string;
  className?: string;
}

const DEFAULT_LABELS: Required<RatingBarLabels> = {
  root: 'Rating',
  item: (score, total) => `${score} of ${total}`,
};

/**
 * A five-point satisfaction scale — Figma's `Rating Bar`.
 *
 * ## Why radios again
 *
 * Same reason as `Rating`: real radios give roving focus, arrow keys, form
 * participation and "2 of 5, radio, not selected" for free. A row of buttons
 * with `aria-pressed` announces each one independently and never tells the user
 * how many options there are, which on a survey scale is the only thing they
 * need to know before choosing.
 *
 * ## Hover preview
 *
 * Star and Heart light up cumulatively on hover — hovering the fourth glyph
 * fills four. Emoji and Number do not: they are nominal choices, not a
 * magnitude, and filling "1, 2, 3, 4" when the user means only "4" would state
 * something the scale does not mean.
 */
export const RatingBar = forwardRef<HTMLDivElement, RatingBarProps>(
  function RatingBar(
    {
      type = 'star',
      count = 5,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      disabled = false,
      emojis = RATING_BAR_EMOJIS,
      locale,
      labels,
      name,
      id,
      className,
    },
    ref,
  ) {
    const groupName = useId(name);
    const groupId = useId(id);
    const text = { ...DEFAULT_LABELS, ...labels };

    const [value, setValue] = useControllableState<number | null>({
      value: valueProp,
      defaultValue,
      onChange: (next) => {
        if (next != null) onValueChange?.(next);
      },
    });

    const [hovered, setHovered] = useState<number | null>(null);
    const cumulative = type === 'star' || type === 'heart';
    const active = hovered ?? value ?? 0;

    const solid = type === 'heart' ? RiHeart3Fill : RiStarFill;
    const outline = type === 'heart' ? RiHeart3Line : RiStarLine;

    return (
      <div
        ref={ref}
        id={groupId}
        role="radiogroup"
        aria-label={text.root}
        aria-disabled={disabled || undefined}
        className={cn(ratingBarVariants(), className)}
      >
        {Array.from({ length: count }, (_, index) => {
          const score = index + 1;
          const selected = cumulative ? score <= active : active === score;
          const checked = value === score;

          return (
            <label
              key={score}
              className={ratingBarItemVariants({ type, selected, disabled })}
              // The hover preview is reset per item rather than on the group:
              // a `radiogroup` that carries pointer handlers is expected to be
              // focusable itself, and it is not — focus belongs to the radios.
              // Browsers fire `mouseleave` before the next `mouseenter`, so
              // moving between items still reads as a continuous hover.
              onMouseEnter={() => !disabled && setHovered(score)}
              onMouseLeave={() => setHovered(null)}
            >
              <input
                type="radio"
                name={groupName}
                value={score}
                checked={checked}
                disabled={disabled}
                aria-label={text.item(
                  formatNumber(score, { locale }),
                  formatNumber(count, { locale }),
                )}
                onChange={() => setValue(score)}
                className={ratingBarInputVariants()}
              />
              <span aria-hidden className="pointer-events-none">
                {type === 'number' && formatNumber(score, { locale })}
                {type === 'emoji' && (
                  <span className="text-[20px] leading-5">
                    {emojis[index] ?? RATING_BAR_EMOJIS[index]}
                  </span>
                )}
                {cumulative && <Icon icon={selected ? solid : outline} />}
              </span>
            </label>
          );
        })}
      </div>
    );
  },
);

export interface RatingBarAreaProps extends RatingBarProps {
  /** The comment field's placeholder — Figma's "Tell us why!". */
  commentPlaceholder?: string;
  /** Accessible name for the comment field. Required if the comment is shown. */
  commentLabel?: string;
  comment?: string;
  defaultComment?: string;
  onCommentChange?: (comment: string) => void;
  /** Hides the comment box, leaving a bordered scale. */
  showComment?: boolean;
  rows?: number;
  footer?: ReactNode;
  rootClassName?: string;
}

/**
 * Figma's `Rating Bar Area` — the scale with a comment box beneath it.
 *
 * The comment is a plain `<textarea>` rather than the `TextArea` component: the
 * Figma frame has no label, no counter and no hint, and borrowing a component
 * that renders all three and then hiding them produces a worse control than
 * writing the four lines.
 */
export const RatingBarArea = forwardRef<HTMLDivElement, RatingBarAreaProps>(
  function RatingBarArea(
    {
      commentPlaceholder,
      commentLabel,
      comment,
      defaultComment = '',
      onCommentChange,
      showComment = true,
      rows = 4,
      footer,
      rootClassName,
      className,
      ...barProps
    },
    ref,
  ) {
    const [text, setText] = useControllableState<string>({
      value: comment,
      defaultValue: defaultComment,
      onChange: onCommentChange,
    });

    return (
      <div ref={ref} className={cn(ratingBarAreaVariants(), rootClassName)}>
        <RatingBar
          {...barProps}
          className={cn('border-b border-soft-200', className)}
        />
        {showComment && (
          <textarea
            rows={rows}
            value={text}
            aria-label={commentLabel}
            placeholder={commentPlaceholder}
            disabled={barProps.disabled}
            onChange={(event) => setText(event.target.value)}
            className={cn(
              'w-full resize-none bg-transparent p-3 text-[14px] leading-5',
              'text-strong-950 outline-none placeholder:text-soft-400',
              'disabled:cursor-not-allowed disabled:text-sub-300',
            )}
          />
        )}
        {footer}
      </div>
    );
  },
);
