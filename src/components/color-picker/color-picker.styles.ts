import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Color Picker" page (node 1465:6280).
 *   Color Picker  → the composite
 *   Color Spectrum→ saturation/value area
 *   Color Sliders → Hue Slider | Opacity
 *   Color Dots    → 10 palette colours × Default/Hover/Selected/Disabled
 */

/**
 * Figma export (Color Picker):
 *   panel 272 wide, radius 16, soft-200 border, the two-layer drop shadow;
 *   16px padding; spectrum 240×232 radius 8; hue and opacity tracks 8px with
 *   14px thumbs (current colour, 2px white ring); a "Hex ▾" format row; a
 *   32px field with an eyedropper cell and a 100% alpha cell; a divider; then
 *   "Recommended Colors" and 16px dots in 24px slots.
 */
export const colorPickerVariants = cva(
  'flex w-[272px] max-w-full flex-col overflow-hidden rounded-2xl border border-soft-200 bg-white-0 shadow-alert',
);

export const colorSpectrumVariants = cva([
  'relative h-[232px] w-full cursor-crosshair rounded-lg',
  'touch-none select-none overflow-hidden',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
]);

export const colorSliderVariants = cva(
  [
    // 8px track; the 14px thumb overhangs it, so the row is 14px tall.
    'relative my-[3px] h-2 w-full cursor-pointer rounded-full',
    'touch-none select-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      type: {
        hue: 'bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)] rtl:bg-[linear-gradient(to_left,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)]',
        // The checkerboard shows through the alpha gradient.
        // White under a 30% checkerboard, as in Figma.
        opacity:
          'bg-white-0 bg-[repeating-conic-gradient(rgb(14_18_27/0.3)_0_25%,transparent_0_50%)] bg-[length:4px_4px]',
      },
    },
    defaultVariants: { type: 'hue' },
  },
);

/**
 * The draggable knob. Positioned with a logical inset so a slider inside an
 * RTL subtree tracks the pointer correctly instead of running backwards.
 */
export const colorThumbVariants = cva([
  'pointer-events-none absolute top-1/2 size-3.5 -translate-y-1/2',
  'rounded-full border-2 border-static-white',
  'shadow-[0_6px_10px_0_#0E121B0F,0_2px_4px_0_#0E121B08]',
]);

export const colorSpectrumThumbVariants = cva([
  'pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2',
  'rounded-full border-2 border-static-white',
  'shadow-[0_6px_10px_0_#0E121B0F,0_2px_4px_0_#0E121B08]',
]);

/**
 * Figma Color Dots: a 16px dot in a 24px slot. Hover shrinks it to 14px;
 * Selected keeps 16px with a 2px white inner ring and a 1.5px outer ring in
 * the dot's own colour; Disabled is a soft-200 dot. The colour is a CSS
 * variable so the rings can follow any custom `value`.
 */
export const colorDotVariants = cva(
  [
    'group/dot relative grid size-6 shrink-0 place-items-center rounded-full outline-hidden',
    'cursor-pointer',
    'focused:shadow-focus-neutral',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      color: {
        gray: '[--nili-dot:var(--nili-faded-base)]',
        blue: '[--nili-dot:var(--nili-information-base)]',
        orange: '[--nili-dot:var(--nili-warning-base)]',
        red: '[--nili-dot:var(--nili-error-base)]',
        green: '[--nili-dot:var(--nili-success-base)]',
        yellow: '[--nili-dot:var(--nili-away-base)]',
        purple: '[--nili-dot:var(--nili-feature-base)]',
        sky: '[--nili-dot:var(--nili-verified-base)]',
        pink: '[--nili-dot:var(--nili-highlighted-base)]',
        teal: '[--nili-dot:var(--nili-stable-base)]',
      },
    },
  },
);

export const colorDotSwatchVariants = cva([
  'size-4 rounded-full bg-(--nili-dot) transition-[width,height,box-shadow] duration-200',
  'group-hover/dot:size-3.5 group-data-[nili-state=hover]/dot:size-3.5',
  'group-data-[selected=true]/dot:size-4 group-data-[selected=true]/dot:shadow-[inset_0_0_0_2px_var(--nili-static-white),0_0_0_1.5px_var(--nili-dot)]',
  'group-disabled/dot:bg-soft-200 group-disabled/dot:shadow-none',
]);

export type ColorDotVariantProps = VariantProps<typeof colorDotVariants>;
export type ColorDotColor = NonNullable<ColorDotVariantProps['color']>;
