import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Buttons [Overview]" → Compact Button.
 *
 *   🏵️ Style       = Stroke · Ghost · White · Error · Modifiable → `appearance`
 *   📏 Size        = Large (24) · Medium (20)                    → `size`
 *   ⭕️ Full Radius = Off · On                                     → `fullRadius`
 *   📌 State       = Default · Hover · Active · Disabled          → CSS
 *
 * Geometry from the Figma export:
 *   lg  24×24  icon 20  radius 6 (12 when full)
 *   md  20×20  icon 18  radius 6 (10 when full)
 * The previous code used 16px icons on md and a 4px radius on both.
 *
 * States:
 *            Default                       Hover                 Active
 *   Stroke   white, soft-200 border, xs    weak-50, strong-950   strong-950 fill, white icon
 *   Ghost    transparent, sub-600          weak-50, strong-950   strong-950 fill, white icon
 *   White    white, xs shadow              weak-50, strong-950   strong-950 fill, white icon
 *   Error    transparent, error-base       error-lighter         error-base fill, white icon
 *   Modif.   transparent, currentColor     current @16%          current @16% + current border
 *   Disabled  icon sub-300 on nothing, for every style.
 *
 * Figma's "Active" is the keyboard-focus look: it is mapped to `focused:`
 * (focus-visible). A filled square is a far clearer focus indicator on a
 * 20px target than a ring would be, and the design system has no separate
 * focus drawing for this component.
 *
 * Modifiable is `appearance="inherit"`: every colour is derived from
 * `currentColor`, so it works on any container, not only on the dark one
 * Figma draws it on.
 */
export const compactButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'border border-transparent outline-hidden cursor-pointer',
    '[&_svg]:shrink-0',
    'transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-transparent disabled:text-sub-300 disabled:shadow-none',
  ],
  {
    variants: {
      appearance: {
        stroke:
          'border-soft-200 bg-white-0 text-sub-600 shadow-button-xs hovered:border-transparent hovered:bg-weak-50 hovered:text-strong-950 hovered:shadow-none focused:border-transparent focused:bg-strong-950 focused:text-white-0 focused:shadow-none',
        ghost:
          'bg-transparent text-sub-600 hovered:bg-weak-50 hovered:text-strong-950 focused:bg-strong-950 focused:text-white-0',
        white:
          'bg-white-0 text-sub-600 shadow-button-xs hovered:bg-weak-50 hovered:text-strong-950 hovered:shadow-none focused:bg-strong-950 focused:text-white-0 focused:shadow-none',
        error:
          'bg-transparent text-error-base hovered:bg-error-lighter focused:bg-error-base focused:text-static-white',
        inherit:
          'bg-transparent text-inherit hovered:bg-current/16 focused:border-current focused:bg-current/16',
      },
      size: {
        lg: 'size-6 [&_svg]:size-5',
        md: 'size-5 [&_svg]:size-[18px]',
      },
      fullRadius: {
        true: 'rounded-full',
        false: 'rounded-sm',
      },
    },
    defaultVariants: { appearance: 'stroke', size: 'lg', fullRadius: false },
  },
);

/** Figma 🏵️ Style order. */
export const COMPACT_BUTTON_APPEARANCES = [
  'stroke',
  'ghost',
  'white',
  'error',
  'inherit',
] as const;

export type CompactButtonVariantProps = VariantProps<
  typeof compactButtonVariants
>;
