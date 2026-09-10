import type { ReactNode } from 'react';
import { forwardRef, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useDismissable } from '../../hooks/use-dismissable';
import { Icon } from '../icon';
import { CompactButton } from '../button';
import {
  drawerOverlayVariants,
  drawerPanelVariants,
  drawerHeaderVariants,
  drawerBodyVariants,
  drawerFooterVariants,
} from './drawer.styles';
import type { DrawerProps } from './drawer.types';

/**
 * Panel that slides in from an edge.
 *
 * ## Accessibility
 *
 * `role="dialog"` + `aria-modal`, labelled by its own title, with focus trapped
 * inside and returned to the trigger on close. Background scroll is locked —
 * without it the page behind scrolls under the panel on mobile, which reads as
 * a broken app.
 *
 * ## RTL
 *
 * `side` is logical. `end` resolves to the right edge in English and the left
 * edge in Persian, and the enter/exit transform flips with it — a drawer that
 * slides in from the correct side but exits to the wrong one is worse than one
 * that never animates.
 *
 * ## Rendering
 *
 * Portalled to `document.body` so the panel escapes any ancestor with
 * `overflow: hidden` or a stacking context. It stays mounted while closing so
 * the exit transition can run, then unmounts.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    onOpenChange,
    side = 'end',
    size = 'md',
    title,
    description,
    icon,
    headerSize = 'sm',
    children,
    footer,
    stretchFooter = false,
    showClose = true,
    closeLabel = 'Close',
    closeOnOutsideClick = true,
    closeOnEscape = true,
    container,
    className,
    ...rest
  },
  ref,
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  // Keep the panel mounted for the exit transition, then drop it so the
  // trapped focus and scroll lock are genuinely released.
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timer);
  }, [open]);

  useDismissable(panelRef, {
    open,
    onDismiss: () => onOpenChange(false),
    closeOnEscape,
    closeOnOutsideClick,
    trapFocus: true,
    lockScroll: true,
  });

  if (!mounted || typeof document === 'undefined') return null;

  const state = open ? 'open' : 'closed';

  return createPortal(
    <>
      <div data-state={state} className={drawerOverlayVariants()} aria-hidden />
      <div
        ref={(node) => {
          (panelRef as { current: HTMLDivElement | null }).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as { current: HTMLDivElement | null }).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        data-state={state}
        tabIndex={-1}
        className={cn(drawerPanelVariants({ side, size }), className)}
        {...rest}
      >
        {(title || showClose) && (
          <DrawerHeader
            title={title}
            description={description}
            icon={icon}
            size={headerSize}
            titleId={titleId}
            descriptionId={descriptionId}
            onClose={showClose ? () => onOpenChange(false) : undefined}
            closeLabel={closeLabel}
          />
        )}

        <div className={drawerBodyVariants({ size: headerSize })}>
          {children}
        </div>

        {footer && (
          <DrawerFooter stretch={stretchFooter}>{footer}</DrawerFooter>
        )}
      </div>
    </>,
    container ?? document.body,
  );
});

export interface DrawerHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  /** A 20px icon, or a 48px key icon. */
  icon?: ReactNode;
  size?: 'sm' | 'lg';
  titleId?: string;
  descriptionId?: string;
  /** Shows the × when set. */
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
}

/** Figma Drawer Header. Used by `Drawer`, and usable on its own. */
export function DrawerHeader({
  title,
  description,
  icon,
  size = 'sm',
  titleId,
  descriptionId,
  onClose,
  closeLabel = 'Close',
  className,
}: DrawerHeaderProps) {
  return (
    <header className={cn(drawerHeaderVariants({ size }), className)}>
      {icon && <span className="flex shrink-0 self-center">{icon}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && (
          <h2
            id={titleId}
            className="text-[18px] leading-6 font-medium tracking-[-0.015em] text-strong-950"
          >
            {title}
          </h2>
        )}
        {description && (
          <p id={descriptionId} className="text-[14px] leading-5 text-sub-600">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <CompactButton
          appearance="ghost"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <Icon icon={RiCloseLine} />
        </CompactButton>
      )}
    </header>
  );
}

/** Figma Drawer Footer: `start` content, then the actions at the end. */
export function DrawerFooter({
  start,
  stretch = false,
  className,
  children,
}: {
  start?: ReactNode;
  stretch?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <footer
      className={cn(
        drawerFooterVariants({ stretch: stretch && !start }),
        start && 'justify-between',
        className,
      )}
    >
      {start && <div className="flex min-w-0 items-center gap-2">{start}</div>}
      {start ? (
        <div className="flex shrink-0 items-center gap-3">{children}</div>
      ) : (
        children
      )}
    </footer>
  );
}
