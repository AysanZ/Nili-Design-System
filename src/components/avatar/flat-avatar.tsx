import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import { FLAT_AVATAR_PARTS } from './flat-avatar.parts';
import { avatarPixelSize, type AvatarSize } from './avatar.styles';

type Count<K extends keyof typeof FLAT_AVATAR_PARTS> =
  (typeof FLAT_AVATAR_PARTS)[K]['length'];

/** How many variants Figma ships for each part. */
export const FLAT_AVATAR_COUNTS = {
  background: FLAT_AVATAR_PARTS.background.length,
  face: FLAT_AVATAR_PARTS.face.length,
  outfit: FLAT_AVATAR_PARTS.outfit.length,
  hair: FLAT_AVATAR_PARTS.hair.length,
  eye: FLAT_AVATAR_PARTS.eye.length,
  cheek: FLAT_AVATAR_PARTS.cheek.length,
  mouth: FLAT_AVATAR_PARTS.mouth.length,
  glasses: FLAT_AVATAR_PARTS.glasses.length,
  hat: FLAT_AVATAR_PARTS.hat.length,
} as const satisfies { [K in keyof typeof FLAT_AVATAR_PARTS]: Count<K> };

export interface FlatAvatarProps extends Omit<
  ComponentPropsWithoutRef<'svg'>,
  'children'
> {
  /** An Avatar size token or a pixel size. */
  size?: AvatarSize | number;
  /** Zero-based variant index of each Figma part. */
  background?: number;
  face?: number;
  outfit?: number;
  hair?: number;
  eye?: number;
  /** Optional parts: omit (or `null`) to leave them off. */
  cheek?: number | null;
  mouth?: number;
  glasses?: number | null;
  hat?: number | null;
  /** Accessible name. Without it the avatar is decorative. */
  label?: string;
}

/**
 * Figma "Flat Avatar" — the illustrated avatar built in Figma's Avatar
 * Creator from interchangeable parts.
 *
 * Each part is the exact vector from the Figma file, in the same 85×85
 * frame, painted in Figma's layer order and clipped to the background
 * circle. Indices wrap, so any number is a valid (deterministic) choice —
 * handy for deriving an avatar from a user id.
 */
export const FlatAvatar = forwardRef<SVGSVGElement, FlatAvatarProps>(
  function FlatAvatar(
    {
      size = 'md',
      background = 4,
      face = 0,
      outfit = 0,
      hair = 0,
      eye = 0,
      cheek = 0,
      mouth = 0,
      glasses = null,
      hat = null,
      label,
      className,
      ...rest
    },
    ref,
  ) {
    const clipId = `nili-flat-${useId().replace(/:/g, '')}`;
    const px = typeof size === 'number' ? size : avatarPixelSize[size];
    const pick = (list: readonly string[], index: number | null | undefined) =>
      index == null
        ? ''
        : list[((index % list.length) + list.length) % list.length];

    const markup = [
      pick(FLAT_AVATAR_PARTS.face, face),
      pick(FLAT_AVATAR_PARTS.outfit, outfit),
      pick(FLAT_AVATAR_PARTS.hair, hair),
      pick(FLAT_AVATAR_PARTS.eye, eye),
      pick(FLAT_AVATAR_PARTS.cheek, cheek),
      pick(FLAT_AVATAR_PARTS.mouth, mouth),
      pick(FLAT_AVATAR_PARTS.glasses, glasses),
      pick(FLAT_AVATAR_PARTS.hat, hat),
    ].join('');

    return (
      <svg
        ref={ref}
        width={px}
        height={px}
        viewBox="0 0 84.38 84.38"
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn('shrink-0 rounded-full', className)}
        {...rest}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="42.19" cy="42.19" r="42.19" />
          </clipPath>
        </defs>
        <g
          clipPath={`url(#${clipId})`}
          // Static, first-party vector data generated from the Figma file.
          dangerouslySetInnerHTML={{
            __html: pick(FLAT_AVATAR_PARTS.background, background) + markup,
          }}
        />
      </svg>
    );
  },
);
