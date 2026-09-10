import {
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { buttonVariants } from './button.styles';
import type { ButtonProps } from './button.types';

function Spinner() {
  return (
    <span
      aria-hidden
      className="absolute inline-block size-4 animate-spin rounded-full border-2 border-current border-e-transparent motion-reduce:animate-none"
    />
  );
}

/**
 * The primary action primitive — Figma "Buttons [Overview]" → Buttons.
 *
 * Notable choices:
 * - `appearance` rather than `style`, so React's own `style` prop stays usable.
 * - No `state` prop. Hover/focus/disabled are CSS states, not React state —
 *   a `state="focus"` prop produces buttons that look focused but aren't.
 * - `type` defaults to `"button"`, not HTML's `"submit"`. A button inside a
 *   form that submits on every stray click is a bug, not a default.
 * - `loading` keeps the label mounted at `opacity-0` instead of swapping it
 *   out, so the button does not change width mid-click and shift the layout
 *   under the user's cursor.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      color = 'primary',
      appearance = 'filled',
      size = 'md',
      fullWidth = false,
      iconOnly = false,
      loading = false,
      loadingLabel,
      startIcon,
      endIcon,
      asChild = false,
      disabled,
      className,
      children,
      type,
      ...rest
    },
    ref,
  ) {
    // Composed once and injected either into a <button> or into the asChild
    // element, so icons and the loading state work identically in both modes.
    const renderContent = (content: ReactNode) => (
      <>
        {loading && <Spinner />}
        {loading && loadingLabel && (
          <span className="sr-only" role="status">
            {loadingLabel}
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-[inherit]',
            loading && 'opacity-0',
          )}
        >
          {startIcon}
          {/*
            The label owns 4px of inline padding. That is what reproduces
            Figma's two different distances — edge→icon (root padding) and
            icon↔label (gap + 4) — and why a text-only button still gets the
            wider side padding Figma shows with both icons switched off.
          */}
          {iconOnly || content == null || content === false ? (
            content
          ) : (
            <span className="px-1">{content}</span>
          )}
          {endIcon}
        </span>
      </>
    );

    const sharedProps = {
      'aria-busy': loading || undefined,
      className: cn(
        buttonVariants({ color, appearance, size, iconOnly, fullWidth }),
        className,
      ),
      ...rest,
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ children?: ReactNode }>;
      return (
        <Slot
          ref={ref as never}
          // A non-button element cannot be natively disabled, so the state has
          // to be communicated to assistive tech explicitly.
          aria-disabled={disabled || loading || undefined}
          {...sharedProps}
        >
          {cloneElement(child, undefined, renderContent(child.props.children))}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        disabled={disabled || loading}
        data-loading={loading || undefined}
        {...sharedProps}
      >
        {renderContent(children)}
      </button>
    );
  },
);
