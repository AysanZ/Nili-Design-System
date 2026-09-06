import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/**
 * Figma → `Checkbox Label [1.0]`, `Radio Label [1.0]`, `Toggle Label [1.0]`.
 *
 * All three are the same set with the same six properties — Active,
 * Description, Flip, plus a Sublabel, a Badge and a Link Button slot. Figma
 * duplicates the component per control because a Figma component cannot be
 * parameterised across pages; there is no such constraint here, so it is one
 * primitive that Checkbox, Radio and Switch all compose.
 *
 * `Active` is not a prop: it belongs to the control, not to its label.
 * `Flip` is `labelPosition` on the control, for the same reason — it decides
 * where the label sits relative to the box, which is the control's layout.
 */
const controlLabelVariants = cva('text-[14px] font-medium leading-5', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed text-sub-300',
      false: 'cursor-pointer text-strong-950',
    },
  },
  defaultVariants: { disabled: false },
});

const sublabelVariants = cva('text-[14px] font-normal leading-5', {
  variants: {
    disabled: { true: 'text-sub-300', false: 'text-sub-600' },
  },
  defaultVariants: { disabled: false },
});

const descriptionVariants = cva('text-[12px] font-normal leading-4', {
  variants: {
    disabled: { true: 'text-sub-300', false: 'text-sub-600' },
  },
  defaultVariants: { disabled: false },
});

export interface ControlLabelProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  /** Ties the label to its control. Omit when the label is not a `<label>`. */
  htmlFor?: string;
  label?: ReactNode;
  /**
   * Muted text sitting inline *after* the label — "(optional)", a unit, a
   * count. Figma's `Sublabel`. Distinct from `description`, which is a second
   * line rather than a continuation of the first.
   */
  sublabel?: ReactNode;
  /** Second line under the label. Figma's `Description`. */
  description?: ReactNode;
  /** Trailing slot on the label row — a `<Badge>`. */
  badge?: ReactNode;
  /** Action under the description — a `<LinkButton>`. */
  linkButton?: ReactNode;
  disabled?: boolean;
  /** Wired to the control's `aria-describedby`. */
  descriptionId?: string;
}

export const ControlLabel = forwardRef<HTMLSpanElement, ControlLabelProps>(
  function ControlLabel(
    {
      htmlFor,
      label,
      sublabel,
      description,
      badge,
      linkButton,
      disabled = false,
      descriptionId,
      className,
      ...rest
    },
    ref,
  ) {
    if (
      label == null &&
      sublabel == null &&
      description == null &&
      badge == null &&
      linkButton == null
    ) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn('flex min-w-0 flex-col gap-0.5', className)}
        {...rest}
      >
        {(label != null || sublabel != null || badge != null) && (
          <span className="flex items-center gap-1">
            {label != null && (
              <label
                htmlFor={htmlFor}
                className={controlLabelVariants({ disabled })}
              >
                {label}
              </label>
            )}
            {sublabel != null && (
              <span className={sublabelVariants({ disabled })}>{sublabel}</span>
            )}
            {badge != null && <span className="ms-1 inline-flex">{badge}</span>}
          </span>
        )}

        {description != null && (
          <span
            id={descriptionId}
            className={descriptionVariants({ disabled })}
          >
            {description}
          </span>
        )}

        {linkButton != null && (
          <span className="mt-0.5 inline-flex">{linkButton}</span>
        )}
      </span>
    );
  },
);
