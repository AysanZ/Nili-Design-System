import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';

/**
 * Figma `Inline Input [1.0]` — 36px tall, 8px radius, `State` (Default · Hover ·
 * Focus · Filled · Disabled · Error). No Size axis: there is one size.
 *
 * The border only appears on hover and focus. This control sits *in* content —
 * a table cell, a card title — where a permanently boxed field would draw a
 * grid of rectangles over the page.
 */
const inlineInputFieldVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-lg border bg-transparent',
    'h-9 text-[14px] leading-5 [&_svg]:size-5',
    'transition-colors duration-150',
    'focus-within:bg-white-0 focus-within:outline focus-within:outline-2',
    'focus-within:outline-offset-2',
    'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-weak-50',
  ],
  {
    variants: {
      invalid: {
        true: 'border-error-base focus-within:outline-error-base',
        false: [
          'border-transparent hover:border-soft-200 hover:bg-white-0',
          'focus-within:border-primary-base focus-within:outline-primary-base',
        ],
      },
    },
    defaultVariants: { invalid: false },
  },
);

export interface InlineInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  /** Figma `⬅️ Left Icon` / `⬅️ Pick Left`. */
  startIcon?: ReactNode;
  /** Figma `🕹️ Button` — a trailing CompactButton, usually a pencil. */
  button?: ReactNode;
  /** Marks the field invalid. There is no message slot: this control is inline. */
  invalid?: boolean;
  /** Accessible name, since an inline field rarely has a visible label. */
  label?: string;
  rootClassName?: string;
}

/**
 * Figma → "❖ Text Input" page, `Inline Input [1.0]`. An edit-in-place field.
 *
 * ## Why there is no `label` or `hint` slot
 *
 * The other five inputs on that Figma page are drawn with a Label above and a
 * Hint below; this one is not, and that is the point of it — it replaces a
 * piece of text where it sits. So the accessible name comes from the `label`
 * prop (rendered as `aria-label`) rather than from a visible `<label>`, and
 * `invalid` is a plain boolean instead of the `error` message the others take.
 *
 * Passing `label` is not optional in practice: a field with no visible label
 * and no `aria-label` is announced as just "edit text", which tells a screen
 * reader user nothing about what they are about to change.
 */
export const InlineInput = forwardRef<HTMLInputElement, InlineInputProps>(
  function InlineInput(
    {
      startIcon,
      button,
      invalid = false,
      label,
      disabled,
      id,
      className,
      rootClassName,
      ...rest
    },
    ref,
  ) {
    const inputId = useId(id);

    return (
      <div
        className={cn(
          inlineInputFieldVariants({ invalid }),
          'ps-2.5 pe-2',
          rootClassName,
        )}
      >
        {startIcon != null && (
          <span className="grid shrink-0 place-items-center text-soft-400">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          disabled={disabled}
          aria-label={label}
          aria-invalid={invalid || undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-strong-950',
            'outline-none placeholder:text-soft-400',
            'disabled:cursor-not-allowed disabled:text-sub-300',
            className,
          )}
          {...rest}
        />
        {button != null && <span className="shrink-0">{button}</span>}
      </div>
    );
  },
);
