import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import {
  badgeVariants,
  badgeIconVariants,
  badgeDotVariants,
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
  return (
    <span
      ref={ref}
      className={cn(
        badgeVariants({ appearance, color, size, disabled }),
        className,
      )}
      {...rest}
    >
      {dot ? (
        <span className={badgeIconVariants({ size })} aria-hidden>
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
