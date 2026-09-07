import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Color Picker" page (node 1465:6280).
 *   Color Picker  → the composite
 *   Color Spectrum→ saturation/value area
 *   Color Sliders → Hue Slider | Opacity
 *   Color Dots    → 10 palette colours × Default/Hover/Selected/Disabled
 */

export const colorPickerVariants = cva(
  'flex w-full max-w-[280px] flex-col gap-3 rounded-xl border border-soft-200 bg-white-0 p-3',
);

export const colorSpectrumVariants = cva([
  'relative h-40 w-full cursor-crosshair rounded-lg',
  'touch-none select-none overflow-hidden',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
]);

export const colorSliderVariants = cva(
  [
    'relative h-3 w-full cursor-pointer rounded-full',
    'touch-none select-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      type: {
        hue: 'bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)] rtl:bg-[linear-gradient(to_left,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)]',
        // The checkerboard shows through the alpha gradient.
        opacity:
          'bg-[repeating-conic-gradient(var(--nili-soft-200)_0_25%,transparent_0_50%)] bg-[length:8px_8px]',
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
  'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2',
  'rounded-full border-2 border-static-white bg-transparent',
  'shadow-[0_0_0_1px_rgba(14,18,27,0.24)]',
]);

export const colorSpectrumThumbVariants = cva([
  'pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2',
  'rounded-full border-2 shadow-[0_0_0_1px_rgba(14,18,27,0.24)]',
]);

export const colorDotVariants = cva(
  [
    'relative grid size-6 shrink-0 place-items-center rounded-full',
    'cursor-pointer transition-transform duration-150',
    'hover:scale-110',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:opacity-40',
    // The selected ring is drawn outside the dot so it never shrinks the swatch.
    'data-[selected=true]:ring-2 data-[selected=true]:ring-strong-950 data-[selected=true]:ring-offset-2 data-[selected=true]:ring-offset-white-0',
  ],
  {
    variants: {
      color: {
        gray: 'bg-faded-base',
        blue: 'bg-information-base',
        orange: 'bg-warning-base',
        red: 'bg-error-base',
        green: 'bg-success-base',
        yellow: 'bg-away-base',
        purple: 'bg-feature-base',
        sky: 'bg-verified-base',
        pink: 'bg-highlighted-base',
        teal: 'bg-stable-base',
      },
    },
  },
);

export type ColorDotVariantProps = VariantProps<typeof colorDotVariants>;
export type ColorDotColor = NonNullable<ColorDotVariantProps['color']>;
