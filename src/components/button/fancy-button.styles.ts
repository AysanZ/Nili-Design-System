import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Buttons [Overview]" → Fancy Buttons.
 *
 *   🧩 Type = Neutral · Primary · Error · Success · Basic → `color`
 *   📏 Size = Medium (40) · Small (36) · X-Small (32)     → `size`
 *   📌 State = Default · Hover · Focus · Disabled         → CSS
 *
 * Figma draws exactly three sizes. The `2xs` (28) size that used to be here
 * does not exist in the design and has been removed.
 *
 * Geometry (from the export):
 *   size  height  radius  edge→icon  icon↔label  text   icon
 *   md    40      10      10         8           14/20  20
 *   sm    36       8       8         8           14/20  20
 *   xs    32       8       6         8           14/20  20
 * Note xs keeps an 8px icon↔label gap, unlike the regular Button's 6.
 *
 * Layers, top to bottom, exactly as Figma stacks them:
 *   1. 1px inner edge: white 12% → 0% top-to-bottom (the `::before`)
 *   2. sheen: white 16% → 0% top-to-bottom; 32% on hover
 *   3. the fill colour
 *   4. shadow: 1px ring in the fill colour + 0 1px 2px #0E121B 48%
 *   5. focus only: a 4px ring (neutral 24% black, primary 24% blue,
 *      error / success *-light) — directly on the edge, no white gap.
 *
 * Basic is a white button: no sheen, a soft-200 1px ring and a softer drop
 * (0 1px 3px 12%); hover goes weak-50 with strong-950 text.
 *
 * Disabled (every type): weak-50 fill, sub-300 text, no shadow, no layers.
 */
const SHEEN =
  'bg-[linear-gradient(180deg,rgb(255_255_255/var(--nili-fancy-sheen))_0%,rgb(255_255_255/0)_100%)]';

// The gradient edge is a masked pseudo-element: a real `border` cannot take
// a gradient and still follow the radius.
const EDGE = [
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-px',
  'before:bg-[linear-gradient(180deg,rgb(255_255_255/0.12)_0%,rgb(255_255_255/0)_100%)]',
  'before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]',
  'before:[mask-composite:exclude] before:[-webkit-mask-composite:xor]',
];

export const fancyButtonVariants = cva(
  [
    'relative isolate inline-flex shrink-0 items-center justify-center',
    'whitespace-nowrap select-none outline-hidden cursor-pointer',
    'text-[14px] leading-5 font-medium tracking-[-0.006em]',
    '[&_svg]:size-5 [&_svg]:shrink-0',
    '[--nili-fancy-sheen:0.16] hovered:[--nili-fancy-sheen:0.32] focused:[--nili-fancy-sheen:0.16]',
    'transition-[color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
    SHEEN,
    ...EDGE,
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:bg-none disabled:text-sub-300 disabled:shadow-none disabled:before:hidden',
    'aria-disabled:pointer-events-none aria-disabled:bg-weak-50 aria-disabled:bg-none aria-disabled:text-sub-300 aria-disabled:shadow-none aria-disabled:before:hidden',
  ],
  {
    variants: {
      color: {
        neutral:
          'bg-strong-950 text-white-0 shadow-fancy-neutral focused:shadow-fancy-neutral-focus',
        primary:
          'bg-primary-base text-static-white shadow-fancy-primary focused:shadow-fancy-primary-focus',
        error:
          'bg-error-base text-static-white shadow-fancy-error focused:shadow-fancy-error-focus',
        success:
          'bg-success-base text-static-white shadow-fancy-success focused:shadow-fancy-success-focus',
        basic:
          'bg-white-0 bg-none text-sub-600 shadow-fancy-basic hovered:bg-weak-50 hovered:text-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-fancy-basic-focus',
      },
      size: {
        md: 'h-10 gap-1 rounded-lg px-2.5',
        sm: 'h-9 gap-1 rounded-md px-2',
        xs: 'h-8 gap-1 rounded-md px-1.5',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { color: 'primary', size: 'md', fullWidth: false },
  },
);

/** Figma 🧩 Type, in Figma's column order. */
export const FANCY_BUTTON_COLORS = [
  'neutral',
  'primary',
  'error',
  'success',
  'basic',
] as const;
/** Figma 📏 Size — three, not four. */
export const FANCY_BUTTON_SIZES = ['md', 'sm', 'xs'] as const;

export type FancyButtonVariantProps = VariantProps<typeof fancyButtonVariants>;
