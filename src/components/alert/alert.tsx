import { Fragment, forwardRef, isValidElement } from 'react';
import {
  RiErrorWarningFill,
  RiAlertFill,
  RiCheckboxCircleFill,
  RiInformationFill,
  RiMagicFill,
  RiCloseLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon, type IconComponent } from '../icon';
import { Typography } from '../typography';
import { LinkButton } from '../button/link-button';
import {
  alertVariants,
  alertIconVariants,
  alertCloseVariants,
} from './alert.styles';
import type { AlertProps, AlertStatus } from './alert.types';

/** Named imports, so only the five glyphs actually used get bundled. */
const STATUS_ICON: Record<AlertStatus, IconComponent> = {
  error: RiErrorWarningFill,
  warning: RiAlertFill,
  success: RiCheckboxCircleFill,
  info: RiInformationFill,
  feature: RiMagicFill,
};

const DEFAULT_URGENCY: Record<AlertStatus, 'assertive' | 'polite'> = {
  error: 'assertive',
  warning: 'assertive',
  success: 'polite',
  info: 'polite',
  feature: 'polite',
};

/**
 * Inline status message.
 *
 * ## Accessibility
 *
 * The previous version rendered a plain `<div>`, so an alert appearing after
 * a failed form submit was silent for screen-reader users — the single most
 * consequential thing an alert has to get right. It also rendered the title
 * inside `<header>`, which put a landmark in the middle of a form.
 *
 * This version sets `role="alert"` / `role="status"` and a matching
 * `aria-live` based on `status`, overridable via `urgency`. Set
 * `urgency="off"` for alerts that are present on first paint.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    status = 'info',
    appearance = 'filled',
    size = 'small',
    title,
    description,
    children,
    icon = true,
    actions,
    dismissible = false,
    onDismiss,
    dismissLabel = 'Dismiss',
    urgency,
    className,
    ...rest
  },
  ref,
) {
  const resolvedUrgency = urgency ?? DEFAULT_URGENCY[status];
  const titleVariant =
    size === 'x-small'
      ? 'paragraph-xsmall'
      : size === 'large'
        ? 'label-small'
        : 'paragraph-small';

  const iconSize = size === 'x-small' ? 16 : 20;
  const inlineActions = size !== 'large';

  const renderIcon = () => {
    if (icon === false) return null;
    return (
      <span
        className={alertIconVariants({ status, appearance, size })}
        aria-hidden
      >
        {isValidElement(icon) ? (
          icon
        ) : (
          <Icon icon={STATUS_ICON[status]} size={iconSize} />
        )}
      </span>
    );
  };

  // Figma: the first link is underlined, the next one is not, and a 48%
  // dot sits between them. Link Buttons with `color="inherit"`, so they
  // follow the alert's text colour (white on Filled, strong-950 otherwise).
  const renderActions = () =>
    actions && actions.length > 0 ? (
      <div className="flex shrink-0 items-center gap-2">
        {actions.slice(0, 2).map((action, index) => (
          <Fragment key={action.label}>
            {index > 0 && (
              <span aria-hidden className="text-[14px] leading-5 opacity-48">
                ·
              </span>
            )}
            <LinkButton
              color="inherit"
              size={size === 'x-small' ? 'sm' : 'md'}
              underline={index === 0}
              href={action.href}
              onClick={action.onClick}
            >
              {action.label}
            </LinkButton>
          </Fragment>
        ))}
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      role={resolvedUrgency === 'assertive' ? 'alert' : 'status'}
      aria-live={resolvedUrgency}
      data-status={status}
      className={cn(alertVariants({ status, appearance, size }), className)}
      {...rest}
    >
      {renderIcon()}

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <Typography
          as="span"
          variant={titleVariant}
          className="break-words text-inherit"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="paragraph-small"
            className={cn(
              'break-words text-inherit',
              appearance !== 'filled' && 'opacity-72',
            )}
          >
            {description}
          </Typography>
        )}

        {children}

        {!inlineActions && actions && actions.length > 0 && (
          <div className="mt-1.5">{renderActions()}</div>
        )}
      </div>

      {inlineActions && renderActions()}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={alertCloseVariants({ size })}
        >
          <Icon icon={RiCloseLine} size={iconSize} />
        </button>
      )}
    </div>
  );
});
