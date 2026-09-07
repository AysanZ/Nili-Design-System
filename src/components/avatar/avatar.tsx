import { forwardRef, useEffect, useState } from 'react';
import {
  RiVerifiedBadgeFill,
  RiPushpinFill,
  RiStarFill,
  RiAddLine,
  RiCloseLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import { Typography } from '../typography';
import {
  avatarVariants,
  avatarSurfaceVariants,
  avatarTextVariant,
  avatarSupportsStatus,
} from './avatar.styles';
import type {
  AvatarProps,
  AvatarTopStatus,
  AvatarBottomStatus,
} from './avatar.types';

/** "Ada Lovelace" → "AL". Works for RTL scripts too. */
export function initialsFromName(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => Array.from(part)[0]?.toLocaleUpperCase() ?? '')
    .join('');
}

const TOP_STATUS: Record<AvatarTopStatus, React.ReactNode> = {
  verified: (
    <Icon icon={RiVerifiedBadgeFill} size={24} className="text-verified-base" />
  ),
  pin: (
    <span className="flex size-6 items-center justify-center rounded-full border-2 border-white-0 bg-feature-base">
      <Icon icon={RiPushpinFill} size={14} className="text-static-white" />
    </span>
  ),
  favorite: (
    <span className="flex size-6 items-center justify-center rounded-full border-2 border-white-0 bg-success-base">
      <Icon icon={RiStarFill} size={14} className="text-static-white" />
    </span>
  ),
  add: (
    <span className="flex size-6 items-center justify-center rounded-full border-2 border-white-0 bg-faded-base">
      <Icon icon={RiAddLine} size={14} className="text-static-white" />
    </span>
  ),
  remove: (
    <span className="flex size-6 items-center justify-center rounded-full border-2 border-white-0 bg-error-base">
      <Icon icon={RiCloseLine} size={14} className="text-static-white" />
    </span>
  ),
  notification: (
    <span className="block size-3 shrink-0 rounded-full border-2 border-white-0 bg-error-base" />
  ),
};

const BOTTOM_STATUS_COLOR: Record<
  Exclude<AvatarBottomStatus, 'company'>,
  string
> = {
  online: 'bg-success-base',
  offline: 'bg-faded-base',
  busy: 'bg-error-base',
  away: 'bg-away-base',
};

/**
 * Person or entity representation, with an image → initials → fallback chain.
 *
 * ## Notes on the rewrite
 *
 * - `firstName`/`lastName` were required, which forced callers with a single
 *   display name (very common in Persian UIs) to pass a fake empty surname.
 *   One `name` prop, split at the call site's discretion.
 * - The image had `alt={`${firstName} ${lastName}`}`, producing `alt=" "`
 *   when both were empty — an unlabelled image rather than a decorative one.
 * - `bgColor` was a loose `string` indexed into a lookup with a silent
 *   fallback, so a typo produced grey with no warning. Now a typed `tone`.
 * - Status markers used `end-0` but were positioned with `translate-x-[30%]`,
 *   which does not flip in RTL — the marker fell outside the avatar in
 *   Persian. Now `-end-1`, which is direction-aware.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = 'md',
    tone = 'soft',
    name,
    src,
    onImageError,
    initials,
    fallback,
    topStatus,
    bottomStatus,
    companyIcon,
    statusLabel,
    className,
    ...rest
  },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false);

  // Reset when the src changes, otherwise a previously-failed avatar stays
  // stuck on its initials even after the caller supplies a working URL.
  useEffect(() => setImageFailed(false), [src]);

  const showImage = Boolean(src) && !imageFailed;
  const showStatus = avatarSupportsStatus(size);
  const resolvedInitials = initials ?? initialsFromName(name);

  return (
    <div
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...rest}
    >
      <div className={avatarSurfaceVariants({ tone })}>
        {showImage ? (
          <img
            src={src}
            // Empty alt marks the image decorative, which is correct when the
            // name is already rendered beside the avatar.
            alt={name}
            loading="lazy"
            decoding="async"
            className="size-full rounded-full object-cover"
            onError={() => {
              setImageFailed(true);
              onImageError?.();
            }}
          />
        ) : (
          (fallback ?? (
            <Typography
              as="span"
              variant={avatarTextVariant[size]}
              className="select-none text-inherit"
              aria-hidden={name === ''}
            >
              {resolvedInitials || '—'}
            </Typography>
          ))
        )}
      </div>

      {/* `-end-1` is the logical equivalent of `-right-1` in LTR and
          `-left-1` in RTL, so the marker stays glued to the avatar in both. */}
      {topStatus && showStatus && (
        <span className="absolute -top-1 -end-1 flex items-center justify-center">
          {TOP_STATUS[topStatus]}
        </span>
      )}

      {bottomStatus && showStatus && (
        <span
          className="absolute -bottom-0.5 -end-0.5 flex items-center justify-center"
          role={statusLabel ? 'img' : undefined}
          aria-label={statusLabel}
          aria-hidden={statusLabel ? undefined : true}
        >
          {bottomStatus === 'company' ? (
            companyIcon
          ) : (
            <span className="flex size-5 items-center justify-center rounded-full bg-white-0 shadow-sm">
              <span
                className={cn(
                  'size-3 rounded-full',
                  BOTTOM_STATUS_COLOR[bottomStatus],
                )}
              />
            </span>
          )}
        </span>
      )}
    </div>
  );
});
