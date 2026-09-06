import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { RiArrowDownSLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';

/**
 * Figma → "❖ Dropdown" page, `Compact Dropdowns for Input [1.0]`.
 *   Size (Medium 40 · Small 36 · X-Small 32) × State (Default · Hover · Active · Disabled)
 *   || 🌍 Country, 🌍 Pick Country, ✏️ Edit Text
 *
 * It exists because a full `Dropdown` cannot go inside a `TextInput`: it draws
 * its own border and its own background, and nesting one field inside another
 * gives you two rounded rectangles where the design has one. This is the
 * borderless form — the dividing rule comes from the TextInput's attached
 * slot, not from here.
 *
 * Figma's padding is 10/8/10/10 at Medium, which is why the leading and
 * trailing insets differ: the chevron reads as closer to the edge than the
 * flag does at equal padding.
 */
export const inputSelectVariants = cva(
  [
    'flex h-full shrink-0 items-center bg-transparent',
    'text-strong-950 transition-colors duration-150',
    'outline-none focus-visible:outline focus-visible:outline-2',
    'focus-visible:-outline-offset-2 focus-visible:outline-primary-base',
    'disabled:cursor-not-allowed disabled:text-sub-300',
  ],
  {
    variants: {
      size: {
        md: 'gap-2 ps-2.5 pe-2 text-[14px] leading-5 [&_svg]:size-5',
        sm: 'gap-2 ps-2.5 pe-2 text-[14px] leading-5 [&_svg]:size-5',
        xs: 'gap-1.5 ps-2 pe-1.5 text-[12px] leading-4 [&_svg]:size-4',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-weak-50',
        false: 'cursor-default',
      },
    },
    defaultVariants: { size: 'md', interactive: true },
  },
);

export type InputSelectVariantProps = VariantProps<typeof inputSelectVariants>;
export type InputSelectSize = NonNullable<InputSelectVariantProps['size']>;

export interface InputSelectProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  size?: InputSelectSize;
  /** Figma `🌍 Pick Country` — a flag, a currency mark, any leading glyph. */
  icon?: ReactNode;
  /** Figma `✏️ Edit Text` — `+98`, `EUR`, `can view`. */
  children?: ReactNode;
  /** Hides the chevron for a display-only affix. */
  chevron?: boolean;
}

/**
 * The compact select that lives *inside* a `TextInput` — the `+1 ▾` before a
 * phone number, the `EUR ▾` after an amount, the `can view ▾` on an invite
 * field.
 *
 * It renders a `<button>`, not a `<select>`. The Figma control shows a flag
 * beside the text, and a native `<option>` cannot contain an image in any
 * browser. Wire it to a listbox or a menu; on its own it is the trigger.
 *
 * The accessible name has to come from you — `aria-label="Country code"` —
 * because "+98" on its own tells a screen-reader user nothing about what they
 * are choosing.
 */
export const InputSelect = forwardRef<HTMLButtonElement, InputSelectProps>(
  function InputSelect(
    {
      size = 'md',
      icon,
      chevron = true,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          inputSelectVariants({ size, interactive: !disabled }),
          className,
        )}
        {...rest}
      >
        {icon != null && (
          <span aria-hidden className="grid shrink-0 place-items-center">
            {icon}
          </span>
        )}
        {children != null && (
          <span className="whitespace-nowrap">{children}</span>
        )}
        {chevron && (
          <span
            aria-hidden
            className="grid shrink-0 place-items-center text-soft-400"
          >
            <Icon icon={RiArrowDownSLine} />
          </span>
        )}
      </button>
    );
  },
);
