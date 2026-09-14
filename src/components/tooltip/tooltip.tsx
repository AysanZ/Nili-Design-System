import { forwardRef } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { RiCloseLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { Icon } from '../icon';
import { useAnchored } from '../../hooks/use-anchored';
import { useControllableState } from '../../hooks/use-controllable-state';
import {
  tooltipSurfaceVariants,
  tooltipArrowSurfaceVariants,
} from './tooltip.styles';
import type {
  TooltipProps,
  TooltipBaseProps,
  TooltipSide,
  TooltipAlign,
} from './tooltip.types';

/**
 * The public type is a union that forbids `align` on the start/end sides. That
 * is right for callers and awkward to destructure, so the implementation reads
 * the flattened shape and re-narrows below.
 */
type TooltipInternalProps = TooltipBaseProps & {
  side?: TooltipSide;
  align?: TooltipAlign;
};

/**
 * ## What changed in this file
 *
 * Every prop is the same. `side`, `align`, `delay`, `arrow`, `darkMode`,
 * `dismissible` — all unchanged, all still doing what their documentation
 * says. No story, no test and no consumer needed editing.
 *
 * Three things are different underneath:
 *
 * 1. **Position is measured, not guessed.** The bubble used to be placed
 *    with `bottom-full mb-2`, which is correct only when there is room
 *    above and no clipping ancestor. It now flips and shifts against the
 *    real viewport and recomputes on scroll and resize.
 *
 * 2. **It renders in a portal.** A tooltip inside `overflow: hidden` — a
 *    table cell, a card, a drawer — used to be cut in half. The portal
 *    takes it out of the clipping context; `useAnchored` keeps it glued to
 *    the trigger anyway.
 *
 * 3. **The arrow points at the trigger.** Previously the arrow's side came
 *    from the requested `side` prop, so a tooltip that flipped from top to
 *    bottom kept an arrow pointing the wrong way. It now comes from where
 *    the bubble actually landed.
 *
 * The hover/focus/Escape behaviour that was written out by hand here is now
 * `useAnchored`'s, including the part the old version did not have: a
 * tooltip is `aria-describedby`, never the accessible name, so an icon-only
 * button still needs its own `aria-label`.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      children,
      content,
      description,
      startIcon,
      side = 'top',
      align = 'center',
      size = 'xs',
      arrow = true,
      darkMode = true,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      delay = 200,
      disabled = false,
      dismissible = false,
      onDismiss,
      dismissLabel = 'Close',
      className,
      contentClassName,
      ...rest
    }: TooltipInternalProps,
    ref,
  ) {
    const [open, setOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const anchored = useAnchored({
      open: open ?? false,
      onOpenChange: setOpen,
      side,
      align,
      trigger: ['hover', 'focus'],
      openDelay: delay,
      role: 'tooltip',
      gap: 8,
      disabled,
      // A tooltip stuck to a row that has scrolled out of the table should
      // disappear, not hover over whatever is now in that spot.
      hideWhenDetached: true,
    });

    return (
      <>
        {/*
          The handlers go on the trigger through `Slot`, not on a wrapper: a
          wrapper that owns the hover has a different shape from the control
          the user is aiming at, so the tooltip opens from the padding and
          the trigger's own handlers are silently replaced instead of merged.
        */}
        <Slot ref={anchored.refs.setReference} {...anchored.triggerProps}>
          {children}
        </Slot>

        {anchored.mounted && !disabled && (
          <FloatingPortal>
            <div
              ref={anchored.setFloating(ref)}
              style={anchored.floatingStyles}
              // The side the bubble *landed* on, after flipping — so the
              // entrance animation grows from the trigger and not from
              // wherever the author originally asked for.
              data-side={anchored.side}
              data-state={anchored.status}
              className={cn(
                tooltipSurfaceVariants({ size, darkMode }),
                contentClassName,
              )}
              {...anchored.floatingProps}
              {...rest}
            >
              <span className={cn('flex items-start gap-1.5', className)}>
                {startIcon != null && (
                  <span aria-hidden className="mt-px shrink-0 [&_svg]:size-4">
                    {startIcon}
                  </span>
                )}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span>{content}</span>
                  {description != null && (
                    <span className="font-normal opacity-70">{description}</span>
                  )}
                </span>
                {dismissible && (
                  <button
                    type="button"
                    aria-label={dismissLabel}
                    onClick={() => {
                      setOpen(false);
                      onDismiss?.();
                    }}
                    className="-m-1 flex shrink-0 cursor-pointer rounded-xs p-1 opacity-70 outline-hidden transition-opacity hovered:opacity-100 focused:opacity-100"
                  >
                    <Icon icon={RiCloseLine} size={16} />
                  </button>
                )}
              </span>

              {arrow && (
                <span
                  ref={anchored.arrowRef as React.Ref<HTMLSpanElement>}
                  aria-hidden
                  style={anchored.arrowStyles}
                  className={tooltipArrowSurfaceVariants({ darkMode })}
                />
              )}
            </div>
          </FloatingPortal>
        )}
      </>
    );
  },
);
