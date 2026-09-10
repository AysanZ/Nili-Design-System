import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import {
  fancyButtonVariants,
  type FancyButtonVariantProps,
} from './fancy-button.styles';

export type FancyButtonColor = NonNullable<FancyButtonVariantProps['color']>;
export type FancyButtonSize = NonNullable<FancyButtonVariantProps['size']>;

export interface FancyButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'color'
> {
  /** Figma `🧩 Type` — Neutral · Primary · Error · Success · Basic. */
  color?: FancyButtonColor;
  /** Figma `📏 Size` — Medium (40) · Small (36) · X-Small (32). */
  size?: FancyButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  asChild?: boolean;
}

/**
 * Raised variant of Button — Figma "Buttons [Overview]" → Fancy Buttons.
 *
 * Reserve it for the single most important action on a screen. Its whole job
 * is to outrank a normal filled Button, which it cannot do if there are three
 * of them on the page.
 */
export const FancyButton = forwardRef<HTMLButtonElement, FancyButtonProps>(
  function FancyButton(
    {
      color = 'primary',
      size = 'md',
      fullWidth = false,
      startIcon,
      endIcon,
      asChild = false,
      className,
      children,
      type,
      disabled,
      ...rest
    },
    ref,
  ) {
    const classes = cn(
      fancyButtonVariants({ color, size, fullWidth }),
      className,
    );

    // The label owns 4px of inline padding — see Button for why.
    const renderContent = (label: ReactNode) => (
      <>
        {startIcon}
        {label != null && label !== false && (
          <span className="px-1">{label}</span>
        )}
        {endIcon}
      </>
    );

    // Slot needs exactly one element child. Passing icons + label as siblings
    // (as the previous version did) made `asChild` render nothing at all.
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ children?: ReactNode }>;
      return (
        <Slot
          ref={ref as never}
          aria-disabled={disabled || undefined}
          className={classes}
          {...rest}
        >
          {cloneElement(child, undefined, renderContent(child.props.children))}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        disabled={disabled}
        className={classes}
        {...rest}
      >
        {renderContent(children)}
      </button>
    );
  },
);
