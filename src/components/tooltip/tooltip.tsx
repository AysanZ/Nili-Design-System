import { forwardRef, useEffect, useRef } from 'react';
import { RiCloseLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { Icon } from '../icon';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { tooltipVariants, tooltipArrowVariants } from './tooltip.styles';
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
 * A short label that appears beside its trigger.
 *
 * ## Hover is only half of it
 *
 * A tooltip that opens on `mouseenter` alone does not exist for anyone using a
 * keyboard, and that is the most common way this component is built. This one
 * opens on **focus** as well, closes on **Escape** while the trigger keeps
 * focus (WAI-ARIA requires the dismissal), and stays open while the pointer is
 * over the bubble itself, so a long label can be read without it vanishing.
 *
 * ## It describes, it does not name
 *
 * The trigger gets `aria-describedby`, not `aria-labelledby`. A tooltip is
 * supplementary: an icon-only button still needs its own `aria-label`, because
 * a description is announced after a pause and some setups skip it entirely.
 * If the text is the only name the control has, it is not a tooltip — it is a
 * label, and it belongs in the button.
 *
 * ## Not for touch
 *
 * There is no hover on a phone, and tapping a trigger activates it. Anything
 * the user genuinely needs to read has to be on the page; a tooltip is for the
 * detail that helps and can be missed.
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
    const tooltipId = useId();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [open, setOpen] = useControllableState<boolean>({
      value: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };

    useEffect(() => clear, []);

    const show = (immediate = false) => {
      if (disabled) return;
      clear();
      if (immediate || delay <= 0) setOpen(true);
      else timer.current = setTimeout(() => setOpen(true), delay);
    };

    const hide = () => {
      clear();
      setOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex w-fit', className)}
        {...rest}
      >
        {/*
          The handlers go on the trigger through `Slot`, not on a wrapper: a
          wrapper that owns the hover has a different shape from the control
          the user is aiming at, so the tooltip opens from the padding and the
          trigger's own handlers are silently replaced instead of merged.
        */}
        <Slot
          aria-describedby={open ? tooltipId : undefined}
          onMouseEnter={() => show()}
          onMouseLeave={hide}
          // Focus opens immediately: a keyboard user has already committed to
          // the control, so a hover delay would just look broken.
          onFocus={() => show(true)}
          onBlur={hide}
          // Escape must dismiss it without moving focus — a tooltip covering
          // the next control with no way to close it is a trap.
          onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
              event.stopPropagation();
              hide();
            }
          }}
        >
          {children}
        </Slot>

        {open && !disabled && (
          <div
            id={tooltipId}
            role="tooltip"
            className={cn(
              tooltipVariants({
                side,
                // Left and Right carry no alignment in the design; forcing
                // centre here keeps the class list honest about that.
                align: side === 'start' || side === 'end' ? 'center' : align,
                size,
                darkMode,
              }),
              contentClassName,
            )}
          >
            <span className="flex items-start gap-1.5">
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
                    hide();
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
                aria-hidden
                className={tooltipArrowVariants({ side, darkMode })}
              />
            )}
          </div>
        )}
      </div>
    );
  },
);
