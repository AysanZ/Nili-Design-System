import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Buttons [Overview]" → Link Buttons.
 *
 *   🏵️ Style     = Gray · Black · Primary · Error · Success · Modifiable → `color`
 *   📏 Size      = Medium (20) · Small (16)                            → `size`
 *   〰️ Underline = Off · On                                             → `underline`
 *   📌 State     = Default · Hover · Focus · Disabled                   → CSS
 *
 * What each state does, per Figma:
 *
 *            Gray            Black      Primary / Error / Success   Modifiable
 *   Hover    + underline     + underline  darker + underline        + underline
 *   Focus    black + ul      + underline  base + underline          + underline
 *   Disabled sub-300, and the underline is removed even when `underline`
 *
 * "darker" is blue-700 / red-700 / green-700 — `*-darker` tokens.
 * Gray and Black do NOT change colour on hover (the previous code swapped
 * them to each other); Gray turns black only on focus.
 *
 * Focus has no ring in Figma — the underline (plus Gray's colour change) is
 * the indicator.
 *
 * The underline takes thickness and position from the font, which is what
 * Figma does: 1.1px at 14px and 0.95px at 12px in Inter, and Vazirmatn's
 * own metrics in Persian, instead of one hard-coded offset for both scripts.
 *
 * "Modifiable" means the colour is overridden per instance. In code that is
 * `color="inherit"`: the link takes the surrounding text colour, which is
 * what makes it usable inside a Banner or an Alert.
 */
export const linkButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1',
    'rounded-xs font-medium outline-hidden cursor-pointer',
    'decoration-from-font [text-underline-position:from-font]',
    'transition-colors duration-200 ease-out motion-reduce:transition-none',
    '[&_svg]:shrink-0',
    'disabled:pointer-events-none disabled:text-sub-300 disabled:no-underline',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300 aria-disabled:no-underline',
  ],
  {
    variants: {
      color: {
        gray: 'text-sub-600 focused:text-strong-950',
        black: 'text-strong-950',
        primary:
          'text-primary-base hovered:text-primary-darker focused:text-primary-base',
        error:
          'text-error-base hovered:text-error-darker focused:text-error-base',
        success:
          'text-success-base hovered:text-success-darker focused:text-success-base',
        inherit: 'text-inherit',
      },
      size: {
        md: 'text-[14px] leading-5 tracking-[-0.006em] [&_svg]:size-5',
        sm: 'text-[12px] leading-4 [&_svg]:size-4',
      },
      underline: {
        true: 'underline',
        false: 'no-underline hovered:underline focused:underline',
      },
    },
    defaultVariants: { color: 'gray', size: 'md', underline: false },
  },
);

/** Figma 🏵️ Style order. `inherit` (Modifiable) is last, as in Figma. */
export const LINK_BUTTON_COLORS = [
  'gray',
  'black',
  'primary',
  'error',
  'success',
  'inherit',
] as const;

export type LinkButtonVariantProps = VariantProps<typeof linkButtonVariants>;
