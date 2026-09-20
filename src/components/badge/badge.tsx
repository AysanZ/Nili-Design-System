import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import {
  badgeVariants,
  badgeIconVariants,
  badgeDotVariants,
  badgeDotSlotVariants,
} from './badge.styles';
import type { BadgeProps } from './badge.types';

/**
 * Compact status / count indicator.
 *
 * Purely presentational: it renders a `<span>`, forwards its ref, spreads
 * unknown props, and adds no ARIA of its own. When a badge conveys something
 * not present in the surrounding text — an unread count, say — give it a
 * label at the call site: `<Badge aria-label="3 unread messages">3</Badge>`.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    appearance = 'filled',
    color = 'gray',
    size = 'medium',
    disabled = false,
    dot = false,
    startIcon,
    endIcon,
    children,
    className,
    ...rest
  },
  ref,
) {
  // Figma "Number" badge: a circle, 16px (small) / 20px (medium).
  const isNumber =
    typeof children === 'number' && !dot && !startIcon && !endIcon;
  const isDotOnly = dot && children == null && !startIcon && !endIcon;
  const leading = dot ? 'dot' : startIcon ? 'icon' : 'text';

  return (
    <span
      ref={ref}
      className={cn(
        badgeVariants({ appearance, color, size, disabled }),
        isDotOnly
          ? 'size-2 gap-0 p-0'
          : isNumber
            ? cn('justify-center px-0', size === 'small' ? 'size-4' : 'size-5')
            : [
                leading === 'text' && 'ps-2',
                leading === 'icon' && 'ps-1',
                leading === 'dot' && (size === 'small' ? 'ps-0.5' : 'ps-1'),
                endIcon ? 'pe-1' : 'pe-2',
              ],
        // Stroke draws its 1px border inside Figma's frame.
        appearance === 'stroke' || disabled ? 'py-px' : null,
        className,
      )}
      {...rest}
    >
      {dot && !isDotOnly ? (
        <span className={badgeDotSlotVariants()} aria-hidden>
          <span className={badgeDotVariants({ size })} />
        </span>
      ) : (
        startIcon && (
          <span className={badgeIconVariants({ size })} aria-hidden>
            {startIcon}
          </span>
        )
      )}

      {children}

      {endIcon && (
        <span className={badgeIconVariants({ size })} aria-hidden>
          {endIcon}
        </span>
      )}
    </span>
  );
});
