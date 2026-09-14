import { useRef, useMemo, useCallback, type Ref } from 'react';
import {
  useFloating,
  autoUpdate,
  useHover,
  useFocus,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useTransitionStatus,
  safePolygon,
  type UseFloatingReturn,
} from '@floating-ui/react';
import { useDirection } from '../providers/direction';
import {
  middlewareFor,
  toPlacement,
  sideFromPlacement,
  arrowStyle,
  type Side,
  type Align,
  type MiddlewareOptions,
} from '../lib/floating';

/**
 * Positioning and interaction for everything that hangs off a trigger:
 * Tooltip, Dropdown, Popover, DatePicker.
 *
 * ## What this replaces
 *
 * Tooltip positioned itself with Tailwind classes (`bottom-full mb-2`), which
 * is correct until the trigger is near a viewport edge or inside a scroll
 * container — then the bubble is clipped or points at nothing. Dropdown
 * measured the trigger once on open and flipped above when there was less
 * than 280px below, which is a guess that goes wrong on the second scroll.
 *
 * Neither handled: nested scroll containers, `position: fixed` ancestors,
 * `transform` ancestors (which re-root every absolutely positioned child),
 * or the trigger scrolling out of view while the overlay stays behind.
 *
 * These are not edge cases in a dashboard. They are Tuesday.
 *
 * ## Why Floating UI and not Radix
 *
 * Radix would mean rewriting every overlay into compound components
 * (`Tooltip.Root` / `Trigger` / `Content`) and breaking every call site and
 * story in the library. Floating UI is hooks only — it slots underneath the
 * existing props without changing one of them, which is why this migration
 * is invisible to consumers. Radix remains the right answer if Nili later
 * grows a Combobox or a Menubar, where the *behaviour* is the hard part
 * rather than the arithmetic.
 */

export type AnchoredTrigger = 'hover' | 'click' | 'focus' | 'manual';

export interface UseAnchoredOptions extends MiddlewareOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  side?: Side;
  align?: Align;

  /** How the overlay is opened. Several may apply — a tooltip is hover+focus. */
  trigger?: AnchoredTrigger | AnchoredTrigger[];

  /** Delay before a hover-opened overlay appears, in ms. */
  openDelay?: number;
  closeDelay?: number;

  /** ARIA relationship. Drives `aria-describedby` vs `aria-haspopup`. */
  role?: 'tooltip' | 'menu' | 'listbox' | 'dialog';

  /** Trap Tab inside. Right for a popover with controls, wrong for a tooltip. */
  modal?: boolean;

  disabled?: boolean;

  /**
   * Keep the overlay mounted for this long after it closes, so an exit
   * transition can run. Zero — the default — unmounts immediately, which is
   * what every Nili overlay did before this hook existed.
   *
   * Defaulting to a non-zero value would have been a behaviour change
   * smuggled inside a positioning change: the element stays in the DOM after
   * `open` goes false, and any assertion that it is gone starts failing.
   * An exit animation is worth having, but it is its own decision.
   */
  exitDuration?: number;
}

export interface UseAnchoredReturn {
  /** Spread onto the trigger element. */
  triggerProps: Record<string, unknown>;
  /** Spread onto the floating element. */
  floatingProps: Record<string, unknown>;
  /** Ref callbacks and the resolved coordinates. */
  refs: UseFloatingReturn['refs'];
  /**
   * Ref callback for the floating element that also honours a `ref` the
   * caller forwarded. Without this every component repeats the same
   * six-line merge, and forgets the function-ref branch about half the time.
   */
  setFloating: (forwarded?: Ref<HTMLElement> | null) => (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
  /** The logical side the overlay actually landed on, after flipping. */
  side: Side;
  /** Ref for the arrow element, plus its resolved offsets. */
  arrowRef: React.MutableRefObject<HTMLElement | null>;
  arrowStyles: React.CSSProperties;
  /** `true` once mounted, `false` while the close transition runs. */
  status: 'unmounted' | 'initial' | 'open' | 'close';
  mounted: boolean;
  /** The trigger has scrolled out of its clipping ancestor. */
  detached: boolean;
}

export function useAnchored({
  open,
  onOpenChange,
  side = 'top',
  align = 'center',
  trigger = 'hover',
  openDelay = 200,
  closeDelay = 0,
  role = 'tooltip',
  modal = false,
  disabled = false,
  exitDuration = 0,
  ...middleware
}: UseAnchoredOptions): UseAnchoredReturn {
  const { dir } = useDirection();
  const arrowRef = useRef<HTMLElement | null>(null);
  const triggers = useMemo(
    () => (Array.isArray(trigger) ? trigger : [trigger]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Array.isArray(trigger) ? trigger.join() : trigger],
  );

  const floating = useFloating({
    open: open && !disabled,
    onOpenChange,
    placement: toPlacement(side, align, dir),
    // `autoUpdate` is the whole point: it re-measures on scroll, resize,
    // layout shift and element resize, which is what "it drifts when I
    // scroll" always turns out to be.
    whileElementsMounted: autoUpdate,
    middleware: middlewareFor({ ...middleware, arrowRef }),
  });

  const hover = useHover(floating.context, {
    enabled: triggers.includes('hover') && !disabled,
    delay: { open: openDelay, close: closeDelay },
    // Lets the pointer cross the gap between trigger and overlay without the
    // overlay closing underneath it — the reason "I can't click the link in
    // the tooltip" is a bug report on every hand-rolled implementation.
    handleClose: role === 'tooltip' ? null : safePolygon(),
    move: false,
  });

  const focus = useFocus(floating.context, {
    // Keyboard focus opens immediately. A delay after a deliberate Tab reads
    // as lag, not polish.
    enabled: (triggers.includes('focus') || triggers.includes('hover')) && !disabled,
    visibleOnly: true,
  });

  const click = useClick(floating.context, {
    enabled: triggers.includes('click') && !disabled,
    toggle: true,
  });

  const dismiss = useDismiss(floating.context, {
    outsidePress: role !== 'tooltip',
    escapeKey: true,
    // Closing on ancestor scroll is right for a menu anchored to a row and
    // wrong for a tooltip, which should simply follow.
    ancestorScroll: role === 'menu' || role === 'listbox',
  });

  const aria = useRole(floating.context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, focus, click, dismiss, aria,
  ]);

  const { isMounted, status } = useTransitionStatus(floating.context, {
    duration: exitDuration,
  });

  const placement = floating.placement;

  /**
   * `hide()` reports `referenceHidden: true` whenever the trigger's rect is
   * empty — and an empty rect is what you get before first layout, during
   * SSR hydration, and in any test environment that does not do layout at
   * all. Hiding on that is hiding because we have no information, which is
   * the opposite of what the middleware is for.
   *
   * So the flag only counts once the trigger has a measurable box.
   */
  const referenceRect = (
    floating.refs.reference.current as Element | null
  )?.getBoundingClientRect?.();
  const measured = Boolean(
    referenceRect && (referenceRect.width > 0 || referenceRect.height > 0),
  );
  const detached =
    measured && Boolean(floating.middlewareData.hide?.referenceHidden);

  const setFloating = useCallback(
    (forwarded?: Ref<HTMLElement> | null) => (node: HTMLElement | null) => {
      floating.refs.setFloating(node);
      if (typeof forwarded === 'function') forwarded(node);
      else if (forwarded && typeof forwarded === 'object')
        (forwarded as { current: HTMLElement | null }).current = node;
    },
    [floating.refs],
  );

  return {
    triggerProps: getReferenceProps(),
    setFloating,
    floatingProps: getFloatingProps({
      ...(modal ? { 'aria-modal': true } : {}),
      ...(detached ? { style: { visibility: 'hidden' as const, pointerEvents: 'none' as const } } : {}),
    }),
    refs: floating.refs,
    floatingStyles: floating.floatingStyles,
    side: sideFromPlacement(placement, dir),
    arrowRef,
    arrowStyles: arrowStyle(placement, floating.middlewareData.arrow),
    status,
    mounted: isMounted,
    detached,
  };
}
