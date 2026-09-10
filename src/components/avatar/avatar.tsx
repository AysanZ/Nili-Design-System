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
  avatarStatusGeometry,
  type AvatarSize,
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

/*
 * Top statuses at their 80px Figma size — a 24px disc with a 2px white ring
 * (28 overall), the 12px notification dot with the same ring, and the
 * verified badge with a white outline. Scaled per avatar size.
 */
const RING =
  'flex size-7 items-center justify-center rounded-full border-2 border-white-0';
const TOP_STATUS: Record<AvatarTopStatus, React.ReactNode> = {
  verified: (
    <span className="relative flex size-7 items-center justify-center">
      <Icon
        icon={RiVerifiedBadgeFill}
        size={28}
        className="absolute text-white-0"
      />
      <Icon
        icon={RiVerifiedBadgeFill}
        size={24}
        className="relative text-verified-base"
      />
    </span>
  ),
  pin: (
    <span className={cn(RING, 'bg-feature-base')}>
      <Icon icon={RiPushpinFill} size={14} className="text-static-white" />
    </span>
  ),
  favorite: (
    <span className={cn(RING, 'bg-success-base')}>
      <Icon icon={RiStarFill} size={16} className="text-static-white" />
    </span>
  ),
  add: (
    <span className={cn(RING, 'bg-faded-base')}>
      <Icon icon={RiAddLine} size={16} className="text-static-white" />
    </span>
  ),
  remove: (
    <span className={cn(RING, 'bg-error-base')}>
      <Icon icon={RiCloseLine} size={14} className="text-static-white" />
    </span>
  ),
  notification: (
    <span className="block size-4 shrink-0 rounded-full border-2 border-white-0 bg-error-base" />
  ),
};

/** Figma "Icon" style silhouette — head 40% of the avatar, 90% white. */
function PlaceholderSilhouette() {
  return (
    <svg viewBox="0 0 80 80" className="size-full" aria-hidden>
      <circle cx="40" cy="32" r="16" fill="white" fillOpacity="0.9" />
      <circle cx="40" cy="94" r="36" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

/**
 * Positions a status marker by its centre, then scales it from its 80px
 * design size — the same thing Figma's component set does per size.
 */
function StatusAnchor({
  size,
  edge,
  children,
  ...rest
}: {
  size: AvatarSize;
  edge: 'top' | 'bottom';
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const g = avatarStatusGeometry[size];
  return (
    <span
      className="pointer-events-none absolute size-0"
      style={{
        insetInlineEnd: g.x,
        ...(edge === 'top' ? { top: g.top } : { bottom: g.bottom }),
      }}
      {...rest}
    >
      <span
        className="absolute top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ scale: String(g.scale) }}
      >
        {children}
      </span>
    </span>
  );
}

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
    placeholder = false,
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
  // Figma shows one initial at 32px and below ("O"), two above ("OR").
  const resolvedInitials =
    initials ??
    initialsFromName(name, ['xs', '2xs', '3xs'].includes(size) ? 1 : 2);

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
        ) : placeholder ? (
          <PlaceholderSilhouette />
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

      {topStatus && showStatus && (
        <StatusAnchor size={size} edge="top">
          {TOP_STATUS[topStatus]}
        </StatusAnchor>
      )}

      {bottomStatus && showStatus && (
        <StatusAnchor
          size={size}
          edge="bottom"
          role={statusLabel ? 'img' : undefined}
          aria-label={statusLabel}
          aria-hidden={statusLabel ? undefined : true}
        >
          {bottomStatus === 'company' ? (
            // Figma: a 24px feature-base disc with a white ring and logo.
            <span className="flex size-7 items-center justify-center rounded-full border-2 border-white-0 bg-feature-base text-static-white [&_svg]:size-4">
              {companyIcon}
            </span>
          ) : (
            <span className="flex size-5 items-center justify-center rounded-full bg-white-0">
              <span
                className={cn(
                  'size-3 rounded-full',
                  BOTTOM_STATUS_COLOR[bottomStatus],
                )}
              />
            </span>
          )}
        </StatusAnchor>
      )}
    </div>
  );
});
