import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';
import { Typography } from '../../typography';
import { Avatar } from '../avatar';
import {
  avatarGroupOverlap,
  avatarVariants,
  avatarTextVariant,
} from '../avatar.styles';
import type { AvatarGroupProps } from '../avatar.types';

/**
 * Overlapping stack of avatars.
 *
 * ## Why the overlap is now pure CSS
 *
 * The old version computed `translateX(±n%)` in JavaScript and read the page
 * direction from `document.dir`. Three problems: it touched `document` during
 * render (breaks SSR outright), it read a *global* direction so a group inside
 * a `dir="rtl"` subtree on an LTR page overlapped the wrong way, and the
 * per-item transform meant N inline styles instead of one class.
 *
 * A negative logical margin (`-ms-2`) does the whole job, flips itself, and
 * costs nothing at runtime.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    { size = 'md', items, max, overflowCount, label, className, ...rest },
    ref,
  ) {
    const visible = typeof max === 'number' ? items.slice(0, max) : items;
    const overflow =
      overflowCount ?? Math.max(items.length - visible.length, 0);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn('flex items-center', className)}
        {...rest}
      >
        {visible.map((item, index) => (
          <Avatar
            key={item.id ?? `${item.name}-${index}`}
            size={size}
            name={item.name}
            src={item.src}
            initials={item.initials}
            tone={item.tone}
            fallback={item.fallback}
            onImageError={item.onImageError}
            // First avatar keeps its natural position; the rest slide back
            // over their predecessor. `ms` is logical, so RTL flips for free.
            // Figma: a 2px white ring outside the avatar, and a per-size
            // overlap (16 / 12 / 6 / 4px). `ms` is logical, so RTL flips.
            className={cn(
              'ring-2 ring-white-0',
              index > 0 && avatarGroupOverlap[size],
            )}
          />
        ))}

        {overflow > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              avatarGroupOverlap[size],
              'flex items-center justify-center rounded-full',
              'bg-weak-50 ring-2 ring-white-0',
            )}
          >
            <Typography
              as="span"
              variant={avatarTextVariant[size]}
              className="select-none text-sub-600"
            >
              +{overflow}
            </Typography>
          </div>
        )}
      </div>
    );
  },
);
