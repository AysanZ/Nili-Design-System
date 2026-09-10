import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Button Group" page (node 29:27).
 *   Group → Quantity 02–06, Size = Small (36) | X-Small (32) | 2X-Small (24)
 *   Item  → State, Size, Only Icon, Left Icon, Right Icon
 *
 * Quantity is not a prop — the count is however many children you pass.
 * The segmented look comes from collapsing the shared borders, which is a
 * `:first-child`/`:last-child` concern, not a per-item variant.
 */
export const buttonGroupVariants = cva('inline-flex isolate', {
  variants: {
    orientation: {
      // -ms-px collapses the doubled border between neighbours. Logical, so
      // the seam lands on the correct side in RTL.
      horizontal: 'flex-row [&>*:not(:first-child)]:-ms-px',
      vertical: 'flex-col [&>*:not(:first-child)]:-mt-px',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/**
 * Figma export (Button Group Items, three sizes):
 *   size  height  text   icon  text-side  icon-side  gap
 *   sm    36      14/20  20    16         8          8
 *   xs    32      14/20  20    14         6          6
 *   2xs   24      12/16  16    12         4          4
 * Inline padding is picked per side in button-group.tsx (text side vs icon
 * side) and is 1px less than Figma because the item border is inside it.
 *
 * States: Default white / sub-600 · Hover weak-50 / sub-600 · Active
 * (selected) weak-50 / strong-950 · Disabled sub-300. The group's outer
 * corners are radius 8.
 */
export const buttonGroupItemVariants = cva(
  [
    'relative inline-flex items-center justify-center shrink-0',
    'border border-soft-200 bg-white-0 text-sub-600',
    'font-medium whitespace-nowrap outline-hidden',
    'cursor-pointer transition-colors duration-200',
    'hovered:bg-weak-50',
    // Raise the focused and selected segments so their border wins over the
    // neighbour it is overlapping.
    'focused:z-10 focused:shadow-focus-neutral',
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:text-sub-300',
  ],
  {
    variants: {
      size: {
        sm: 'h-9 gap-2 text-[14px] leading-5 [&_svg]:size-5',
        xs: 'h-8 gap-1.5 text-[14px] leading-5 [&_svg]:size-5',
        '2xs': 'h-6 gap-1 text-[12px] leading-4 [&_svg]:size-4',
      },
      selected: {
        true: 'z-10 bg-weak-50 text-strong-950',
        false: '',
      },
      iconOnly: { true: 'px-0 aspect-square', false: '' },
      orientation: {
        // Only the outer edges are rounded, so the row reads as one control.
        horizontal:
          'first:rounded-s-md last:rounded-e-md [&:not(:first-child):not(:last-child)]:rounded-none',
        vertical:
          'first:rounded-t-md last:rounded-b-md [&:not(:first-child):not(:last-child)]:rounded-none',
      },
    },
    defaultVariants: {
      size: 'sm',
      selected: false,
      iconOnly: false,
      orientation: 'horizontal',
    },
  },
);

/** Side padding: [text side, icon side], already minus the 1px border. */
export const buttonGroupItemPadding = {
  sm: {
    textStart: 'ps-[15px]',
    textEnd: 'pe-[15px]',
    iconStart: 'ps-[7px]',
    iconEnd: 'pe-[7px]',
  },
  xs: {
    textStart: 'ps-[13px]',
    textEnd: 'pe-[13px]',
    iconStart: 'ps-[5px]',
    iconEnd: 'pe-[5px]',
  },
  '2xs': {
    textStart: 'ps-[11px]',
    textEnd: 'pe-[11px]',
    iconStart: 'ps-[3px]',
    iconEnd: 'pe-[3px]',
  },
} as const;

export type ButtonGroupVariantProps = VariantProps<
  typeof buttonGroupItemVariants
>;
