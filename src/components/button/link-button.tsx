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
  linkButtonVariants,
  type LinkButtonVariantProps,
} from './link-button.styles';

export type LinkButtonColor = NonNullable<LinkButtonVariantProps['color']>;
export type LinkButtonSize = NonNullable<LinkButtonVariantProps['size']>;

export interface LinkButtonProps extends Omit<
  ComponentPropsWithoutRef<'a'>,
  'color'
> {
  color?: LinkButtonColor;
  size?: LinkButtonSize;
  underline?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  /** Render the child element instead of an `<a>` — for router links. */
  asChild?: boolean;
}

/**
 * Text-weight action that sits inline with copy.
 *
 * `color="inherit"` is Figma's "Modifiable" style: the link adopts the
 * surrounding text colour, which is what lets it sit inside a filled Banner or
 * Alert without a hardcoded white variant for every container.
 *
 * Renders an `<a>`. When there is no `href` it becomes a `<button>`, because
 * an anchor without href is not focusable and not announced as actionable.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      color = 'gray',
      size = 'md',
      underline = false,
      startIcon,
      endIcon,
      disabled,
      asChild = false,
      className,
      children,
      href,
      ...rest
    },
    ref,
  ) {
    const classes = cn(
      linkButtonVariants({ color, size, underline }),
      className,
    );
    const content = (
      <>
        {startIcon}
        {children}
        {endIcon}
      </>
    );

    // asChild used to pass `children` straight through, which silently
    // dropped startIcon / endIcon on router links. The icons are now injected
    // into the child element, the same way Button does it.
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ children?: ReactNode }>;
      return (
        <Slot
          ref={ref as never}
          aria-disabled={disabled || undefined}
          className={classes}
          {...rest}
        >
          {cloneElement(
            child,
            undefined,
            <>
              {startIcon}
              {child.props.children}
              {endIcon}
            </>,
          )}
        </Slot>
      );
    }

    if (!href) {
      return (
        <button
          ref={ref as never}
          type="button"
          disabled={disabled}
          className={classes}
          {...(rest as ComponentPropsWithoutRef<'button'>)}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={classes}
        {...rest}
      >
        {content}
      </a>
    );
  },
);
