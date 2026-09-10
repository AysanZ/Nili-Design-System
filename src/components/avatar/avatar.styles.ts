import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative shrink-0 rounded-full', {
  variants: {
    size: {
      '3xl': 'size-20',
      '2xl': 'size-[72px]',
      xl: 'size-16',
      lg: 'size-14',
      md: 'size-12',
      sm: 'size-10',
      xs: 'size-8',
      '2xs': 'size-6',
      '3xs': 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
});

export const avatarSurfaceVariants = cva(
  'relative flex size-full items-center justify-center overflow-hidden rounded-full',
  {
    variants: {
      tone: {
        soft: 'bg-soft-200 text-static-black',
        yellow: 'bg-yellow-200 text-yellow-950',
        blue: 'bg-blue-200 text-blue-950',
        // Was sky-200 under the name `green`; Figma's green tone is green-200.
        green: 'bg-green-200 text-green-950',
        pink: 'bg-pink-200 text-pink-950',
        purple: 'bg-purple-200 text-purple-950',
        red: 'bg-red-200 text-red-950',
      },
    },
    defaultVariants: { tone: 'soft' },
  },
);

export type AvatarSize = NonNullable<
  VariantProps<typeof avatarVariants>['size']
>;
export type AvatarTone = NonNullable<
  VariantProps<typeof avatarSurfaceVariants>['tone']
>;

/** Pixel size per token — needed for `<img sizes>` and intrinsic icon sizing. */
export const avatarPixelSize: Record<AvatarSize, number> = {
  '3xl': 80,
  '2xl': 72,
  xl: 64,
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32,
  '2xs': 24,
  '3xs': 20,
};

export const avatarTextVariant: Record<
  AvatarSize,
  'h5' | 'label-large' | 'label-medium' | 'label-small' | 'label-xsmall'
> = {
  '3xl': 'h5',
  '2xl': 'h5',
  xl: 'h5',
  lg: 'label-large',
  md: 'label-large',
  sm: 'label-medium',
  xs: 'label-small',
  '2xs': 'label-xsmall',
  '3xs': 'label-xsmall',
};

/**
 * Figma draws both statuses on all nine sizes, down to 20px, so every size
 * supports them. Kept as a function for existing imports.
 */
export const avatarSupportsStatus = (size: AvatarSize): boolean =>
  Boolean(avatarPixelSize[size]);

/**
 * Status geometry per size, read from the Figma component set. Markers are
 * drawn at their 80px size and scaled; `x` is the marker centre's distance
 * from the avatar's end edge, `top` / `bottom` from the top / bottom edge.
 */
export const avatarStatusGeometry: Record<
  AvatarSize,
  { scale: number; x: number; top: number; bottom: number }
> = {
  '3xl': { scale: 1, x: 8, top: 16, bottom: 16 },
  '2xl': { scale: 1, x: 8, top: 16, bottom: 12.8 },
  xl: { scale: 0.875, x: 6, top: 14, bottom: 14 },
  lg: { scale: 0.75, x: 6, top: 12, bottom: 12 },
  md: { scale: 0.625, x: 4, top: 10, bottom: 10 },
  sm: { scale: 0.5625, x: 3, top: 9, bottom: 9 },
  xs: { scale: 0.5, x: 2, top: 8, bottom: 8 },
  '2xs': { scale: 0.375, x: 2, top: 6, bottom: 6 },
  '3xs': { scale: 0.3125, x: 1, top: 5, bottom: 5 },
};

/** Avatar Group overlap per size (Figma: 80–56 → 16, 48–40 → 12, 32 → 6, 24–20 → 4). */
export const avatarGroupOverlap: Record<AvatarSize, string> = {
  '3xl': '-ms-4',
  '2xl': '-ms-4',
  xl: '-ms-4',
  lg: '-ms-4',
  md: '-ms-3',
  sm: '-ms-3',
  xs: '-ms-1.5',
  '2xs': '-ms-1',
  '3xs': '-ms-1',
};

/**
 * Deprecated size names kept so existing call sites keep compiling.
 * `xxxsmall`/`xxsmall`/… were ambiguous at a glance; `3xs`/`2xs`/… match the
 * naming already used by the Figma library and by Tailwind itself.
 */
export const legacyAvatarSize: Record<string, AvatarSize> = {
  xxxlarge: '3xl',
  xxlarge: '2xl',
  xlarge: 'xl',
  large: 'lg',
  medium: 'md',
  small: 'sm',
  xsmall: 'xs',
  xxsmall: '2xs',
  xxxsmall: '3xs',
};
