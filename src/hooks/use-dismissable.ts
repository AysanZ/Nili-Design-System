import { useEffect, useRef, type RefObject } from 'react';
import { tabbable, focusable, isFocusable } from 'tabbable';
import { FloatingFocusManager, FloatingOverlay, useFloating, useDismiss, useRole, useInteractions } from '@floating-ui/react';

export interface UseDismissableOptions {
  open: boolean;
  onDismiss: () => void;
  /** Escape closes it. Off for nested layers that handle their own key. */
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  /** Trap Tab inside the container and restore focus on close. */
  trapFocus?: boolean;
  /** Prevent background scroll. Right for a modal drawer, wrong for a menu. */
  lockScroll?: boolean;
  /** Elements that should not count as "outside" — typically the trigger. */
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
}

/**
 * The four behaviours every non-anchored overlay needs: Escape, outside
 * press, focus trap, scroll lock. Used by Modal and Drawer.
 *
 * ## What changed, and what did not
 *
 * The signature is identical to the hand-rolled version this replaces, so
 * Modal and Drawer did not change. What changed is underneath.
 *
 * The old focus trap walked a hardcoded list of focusable selectors. That
 * list is wrong in ways that only show up in production:
 *
 *   - `contenteditable` elements are focusable and were not in the list
 *   - elements inside `inert` or `hidden="until-found"` subtrees were in it
 *     but should not be
 *   - `<iframe>` content swallows Tab entirely; the trap could not see past it
 *   - shadow DOM children were invisible to `querySelectorAll`
 *   - `display: none` was detected via `offsetParent`, which is also null for
 *     `position: fixed` elements — so a fixed-position button inside a modal
 *     was treated as hidden and skipped
 *
 * The old outside-press handler listened on `pointerdown` with capture and
 * compared against `contains()`. That misses a press that starts inside and
 * ends outside (a drag from a slider), and it fires for right-clicks.
 *
 * Both are now Floating UI's problem, which has fixed each of the above
 * against real bug reports. Nili keeps the API; it stops keeping the edge
 * cases.
 *
 * ## Scroll lock
 *
 * Still handled here rather than by `FloatingOverlay`, because Nili's Drawer
 * animates its own backdrop and rendering a second overlay element would
 * put a transparent layer between the user and the drawer. The iOS rubber
 * band fix is the part worth keeping: `overflow: hidden` alone does nothing
 * on iOS Safari.
 */
export function useDismissable(
  containerRef: RefObject<HTMLElement | null>,
  {
    open,
    onDismiss,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    trapFocus = false,
    lockScroll = false,
    ignoreRefs = [],
  }: UseDismissableOptions,
) {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => { if (!next) onDismiss(); },
  });

  // Bridge the caller's own ref to Floating UI's, so callers keep passing a
  // plain ref and never learn this hook has a positioning engine inside it.
  useEffect(() => {
    refs.setFloating(containerRef.current);
  }, [refs, containerRef, open]);

  useDismiss(context, {
    enabled: open,
    escapeKey: closeOnEscape,
    outsidePress: closeOnOutsideClick
      ? (event) => {
          const target = event.target as Node;
          return !ignoreRefs.some((r) => r.current?.contains(target));
        }
      : false,
    // `pointerdown` closes before a click can land on whatever is underneath,
    // which is what people expect from a backdrop but not from a drag that
    // happens to end outside.
    outsidePressEvent: 'mousedown',
  });

  useRole(context, { role: trapFocus ? 'dialog' : undefined });
  useInteractions([]);

  /* ── focus ──────────────────────────────────────────────────────
     Floating UI ships `FloatingFocusManager`, but it is a component and
     this is a hook with an existing signature that Modal and Drawer pass
     a plain ref to. Wrapping their panels would have meant editing both,
     which is exactly what this migration promised not to do.

     What *is* borrowed is the hard part: `tabbable` enumerates focusable
     elements correctly. The list this replaces was a hardcoded selector
     string that missed `contenteditable`, walked into `inert` subtrees,
     and used `offsetParent === null` as a visibility test — which is also
     null for `position: fixed`, so a fixed button inside a modal counted
     as hidden and was skipped. */
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open || !trapFocus) return;
    const container = containerRef.current;
    if (!container) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Prefer the first tabbable control. Fall back to anything focusable —
    // a dialog whose only content is text still has to receive focus, or
    // the screen reader stays outside it.
    const first = tabbable(container)[0] ?? focusable(container)[0];
    if (first) first.focus();
    else {
      if (!isFocusable(container)) container.setAttribute('tabindex', '-1');
      container.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const stops = tabbable(container);
      if (!stops.length) {
        event.preventDefault();
        return;
      }
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      // Returning focus is the half everyone forgets: without it, closing an
      // overlay drops the user back at the top of the document.
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trapFocus]);

  /* ── scroll lock ────────────────────────────────────────────────
     `overflow: hidden` on <body> does not stop iOS Safari, which scrolls
     the visual viewport instead. Pinning the body to its current offset
     does, and restoring the offset afterwards keeps the page where the
     user left it. */
  const scrollY = useRef(0);
  useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return;

    const body = document.body;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingInlineEnd: body.style.paddingInlineEnd,
    };

    // Replacing the scrollbar's width avoids the whole page jumping sideways
    // the moment a modal opens.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    scrollY.current = window.scrollY;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    const iOS = /iP(hone|ad|od)/.test(navigator.platform ?? '')
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (iOS) {
      body.style.position = 'fixed';
      body.style.top = `-${scrollY.current}px`;
      body.style.width = '100%';
    }

    return () => {
      Object.assign(body.style, previous);
      if (iOS) window.scrollTo(0, scrollY.current);
    };
  }, [open, lockScroll]);

  return { context, trapFocus };
}

/**
 * Re-exported so Modal and Drawer can wrap their panel without importing
 * Floating UI directly — the dependency stays one file deep, which is what
 * makes it swappable later.
 */
export { FloatingFocusManager, FloatingOverlay };
