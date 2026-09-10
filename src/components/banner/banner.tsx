import { forwardRef, isValidElement } from 'react';
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
import {
  bannerVariants,
  bannerIconVariants,
  bannerActionVariants,
  bannerDismissVariants,
} from './banner.styles';
import type { BannerProps, BannerStatus } from './banner.types';

/** Named imports, so only the six glyphs actually used get bundled. */
const STATUS_ICON: Record<BannerStatus, IconComponent> = {
  error: RiErrorWarningFill,
  warning: RiAlertFill,
  success: RiCheckboxCircleFill,
  info: RiInformationFill,
  feature: RiMagicFill,
};

/**
 * Full-bleed, page-level announcement bar — 44px tall, spanning the container.
 *
 * ## Banner vs Alert
 *
 * They share a colour matrix on purpose, but they are not interchangeable:
 *
 * - **Alert** is *contextual*. It sits next to the thing it describes, wraps
 *   over multiple lines, comes in three sizes, and usually appears in response
 *   to something the user just did.
 * - **Banner** is *ambient*. It sits at the top of the page, is one line tall,
 *   has a single fixed size, and usually concerns the whole session — a trial
 *   expiring, scheduled maintenance, a degraded service.
 *
 * That difference drives the defaults: Alert announces assertively for errors,
 * Banner announces politely for everything, because a banner is normally
 * already on screen when the page loads and interrupting a screen reader on
 * every navigation is hostile.
 *
 * ## Layout note
 *
 * The content is centred while the dismiss button is absolutely positioned at
 * the inline end — matching the Figma spec exactly. `pe-12` is applied when
 * dismissible so long text can never slide underneath the button.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    status = 'info',
    appearance = 'filled',
    title,
    description,
    icon = true,
    action,
    dismissible = false,
    onDismiss,
    dismissLabel = 'Dismiss',
    sticky = false,
    urgency = 'polite',
    className,
    ...rest
  },
  ref,
) {
  const renderIcon = () => {
    if (icon === false) return null;
    if (isValidElement(icon)) {
      return (
        <span
          className={bannerIconVariants({ status, appearance })}
          aria-hidden
        >
          {icon}
        </span>
      );
    }
    return (
      <Icon
        icon={STATUS_ICON[status]}
        size={20}
        className={bannerIconVariants({ status, appearance })}
      />
    );
  };

  return (
    <div
      ref={ref}
      role={urgency === 'assertive' ? 'alert' : 'status'}
      aria-live={urgency}
      data-status={status}
      data-dismissible={dismissible}
      className={cn(
        bannerVariants({ status, appearance }),
        sticky && 'sticky top-0 z-50',
        className,
      )}
      {...rest}
    >
      {renderIcon()}

      <div className="flex min-w-0 items-center justify-center gap-2 text-center">
        <span className="text-[14px] font-medium leading-5">{title}</span>

        {description && (
          <>
            {/* Decorative separator: it is punctuation, not content, so it
                stays out of the accessible name. */}
            <span aria-hidden className="text-[14px] leading-5">
              ·
            </span>
            <span className="truncate text-[14px] font-normal leading-5">
              {description}
            </span>
          </>
        )}
      </div>

      {action &&
        (action.href ? (
          <a
            href={action.href}
            className={bannerActionVariants({ appearance })}
          >
            {action.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className={bannerActionVariants({ appearance })}
          >
            {action.label}
          </button>
        ))}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={bannerDismissVariants({ appearance })}
        >
          <Icon icon={RiCloseLine} size={20} />
        </button>
      )}
    </div>
  );
});
