import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  RiCloseLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiInformationLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useDismissable } from '../../hooks/use-dismissable';
import { Icon, type IconComponent } from '../icon';
import { CompactButton } from '../button';
import { KeyIcon, type KeyIconColor } from '../key-components';
import {
  modalOverlayVariants,
  modalPanelVariants,
  modalHeaderVariants,
  modalBodyVariants,
  modalFooterVariants,
} from './modal.styles';
import type { ModalProps, ModalStatus, StatusModalProps } from './modal.types';

const STATUS_ICON: Record<ModalStatus, IconComponent> = {
  error: RiErrorWarningLine,
  warning: RiAlertLine,
  success: RiCheckboxCircleLine,
  info: RiInformationLine,
};

const STATUS_COLOR: Record<ModalStatus, KeyIconColor> = {
  error: 'red',
  warning: 'orange',
  success: 'green',
  info: 'blue',
};

/**
 * Centred dialog.
 *
 * ## Accessibility
 *
 * `role="dialog"` + `aria-modal`, labelled by its own title and described by
 * its description, focus trapped inside and returned to the trigger on close,
 * background scroll locked. Same contract as Drawer, sharing `useDismissable`.
 *
 * ## Why the overlay is a sibling, not a parent
 *
 * The panel is centred by the overlay's grid, but outside-click detection asks
 * whether the event landed inside the *panel*. Nesting the panel inside a
 * click-handling overlay makes every click on the panel bubble through it, and
 * the usual workaround — `stopPropagation` on the panel — breaks any consumer
 * listening for clicks higher up.
 *
 * ## Scrolling
 *
 * The overlay scrolls, not the panel: a tall modal on a short viewport should
 * scroll the whole dialog rather than trapping the content in an inner
 * scrollbar with the header and footer clipped off screen.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    title,
    description,
    icon,
    status,
    headerSize = 'sm',
    alignment = 'horizontal',
    size = 'md',
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
  const vertical = alignment === 'vertical';

  const leading =
    icon ??
    (status ? (
      <KeyIcon color={STATUS_COLOR[status]} size="md">
        <Icon icon={STATUS_ICON[status]} />
      </KeyIcon>
    ) : null);

  return createPortal(
    <div data-state={state} className={modalOverlayVariants()}>
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
        className={cn(modalPanelVariants({ size }), className)}
        {...rest}
      >
        {(title || leading || showClose) && (
          <header
            className={modalHeaderVariants({ size: headerSize, alignment })}
          >
            {leading && <span className="shrink-0">{leading}</span>}

            <div
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-1',
                vertical && 'items-center',
              )}
            >
              {title && (
                <h2
                  id={titleId}
                  className="text-[14px] font-medium leading-5 tracking-[-0.006em] text-strong-950"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="text-[12px] leading-4 text-sub-600"
                >
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <CompactButton
                appearance="ghost"
                aria-label={closeLabel}
                onClick={() => onOpenChange(false)}
                className={cn(vertical && 'absolute end-3 top-3')}
              >
                <Icon icon={RiCloseLine} />
              </CompactButton>
            )}
          </header>
        )}

        {children && (
          <div className={modalBodyVariants({ size: headerSize })}>
            {children}
          </div>
        )}

        {footer && (
          <footer className={modalFooterVariants({ stretch: stretchFooter })}>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    container ?? document.body,
  );
});

/**
 * Figma's Status Modal: a Modal that always carries a status icon, with the
 * vertical alignment used for confirmations and outcome messages.
 */
export const StatusModal = forwardRef<HTMLDivElement, StatusModalProps>(
  function StatusModal(
    { status, alignment = 'vertical', size = 'sm', ...rest },
    ref,
  ) {
    return (
      <Modal
        ref={ref}
        status={status}
        alignment={alignment}
        size={size}
        {...rest}
      />
    );
  },
);
