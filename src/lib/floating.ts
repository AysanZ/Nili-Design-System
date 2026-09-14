import type { Middleware, Placement } from '@floating-ui/react';
import { offset, flip, shift, arrow, hide, size, limitShift } from '@floating-ui/react';

/**
 * Nili → Floating UI.
 *
 * ## Why this file exists
 *
 * Floating UI speaks in physical placements (`top`, `right`, `bottom-start`).
 * Nili's components speak in logical ones — `side="start"` is the left in
 * English and the right in Persian — because a design system whose first
 * language is RTL cannot ask every call site to know which way round it is.
 *
 * Everything that translates between the two lives here, once, instead of
 * being re-derived in Tooltip, Dropdown, Popover and DatePicker.
 *
 * ## What Floating UI does and does not resolve for us
 *
 * The *alignment* suffix (`-start` / `-end`) is resolved by Floating UI from
 * the reference element's computed `direction`, so `bottom-start` already
 * flips correctly. The *side* is not: `left` means left in any language.
 * So alignment passes through untouched and the side is mapped by hand.
 */

/** Nili's logical sides, as the components' props spell them. */
export type Side = 'top' | 'bottom' | 'start' | 'end';
/** Nili's alignment. Resolved by Floating UI against the writing direction. */
export type Align = 'start' | 'center' | 'end';

export type Direction = 'ltr' | 'rtl';

export function toPlacement(side: Side, align: Align, dir: Direction): Placement {
  const physicalSide =
    side === 'start' ? (dir === 'rtl' ? 'right' : 'left')
    : side === 'end' ? (dir === 'rtl' ? 'left' : 'right')
    : side;

  // A tooltip on the left or right has no meaningful alignment axis — it is
  // centred against the trigger either way — so we drop the suffix rather
  // than emit `left-start`, which quietly means "top-aligned" and reads as
  // a bug to anyone debugging it.
  if (physicalSide === 'left' || physicalSide === 'right') return physicalSide;

  return align === 'center' ? physicalSide : (`${physicalSide}-${align}` as Placement);
}

/** The inverse, for the arrow: which edge of the floating box points back. */
export function sideFromPlacement(placement: Placement, dir: Direction): Side {
  const physical = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
  if (physical === 'top' || physical === 'bottom') return physical;
  if (physical === 'left') return dir === 'rtl' ? 'end' : 'start';
  return dir === 'rtl' ? 'start' : 'end';
}

export interface MiddlewareOptions {
  /** Gap between trigger and floating element, in px. */
  gap?: number;
  /** Element used to draw the arrow, if there is one. */
  arrowRef?: React.MutableRefObject<HTMLElement | null>;
  /** Keep the arrow this far from the floating element's corners. */
  arrowPadding?: number;
  /** Distance to keep from the clipping boundary while shifting. */
  padding?: number;
  /**
   * Constrain the floating element to the space actually available, exposing
   * the result as CSS custom properties. A menu near the bottom of the
   * viewport gets a scrollbar instead of running off the screen.
   */
  constrainToViewport?: boolean;
  /**
   * Match the floating element's width to the trigger. Right for a select
   * menu, wrong for a tooltip.
   */
  matchTriggerWidth?: boolean;
  /**
   * Hide instead of following when the trigger scrolls out of its clipping
   * ancestor. Without this a dropdown detaches and floats over unrelated
   * content — the single most common bug in hand-rolled positioning.
   */
  hideWhenDetached?: boolean;
}

/**
 * The middleware stack, in the order Floating UI requires: `offset` before
 * `flip`, `shift` after both, `arrow` last so it measures the final box.
 * Getting this order wrong produces subtle drift that only shows up near a
 * viewport edge, which is exactly where nobody tests.
 */
export function middlewareFor({
  gap = 8,
  arrowRef,
  arrowPadding = 8,
  padding = 8,
  constrainToViewport = false,
  matchTriggerWidth = false,
  hideWhenDetached = false,
}: MiddlewareOptions = {}): Middleware[] {
  const stack: Middleware[] = [offset(gap), flip({ padding }), shift({ padding, limiter: limitShift() })];

  if (constrainToViewport || matchTriggerWidth) {
    stack.push(
      size({
        padding,
        apply({ availableHeight, rects, elements }) {
          const style: Record<string, string> = {};
          if (constrainToViewport) style.maxHeight = `${Math.max(120, availableHeight)}px`;
          if (matchTriggerWidth) style.minWidth = `${rects.reference.width}px`;
          Object.assign(elements.floating.style, style);
        },
      }),
    );
  }

  if (hideWhenDetached) stack.push(hide({ strategy: 'referenceHidden', padding }));
  if (arrowRef) stack.push(arrow({ element: arrowRef, padding: arrowPadding }));

  return stack;
}

/** Absolute offsets for the arrow, derived from what `arrow()` measured. */
export function arrowStyle(
  placement: Placement,
  data: { x?: number | null; y?: number | null } | undefined,
): React.CSSProperties {
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
  const staticSide = opposite[placement.split('-')[0] as keyof typeof opposite];
  return {
    left: data?.x != null ? `${data.x}px` : '',
    top: data?.y != null ? `${data.y}px` : '',
    [staticSide]: '-4px',
  };
}
