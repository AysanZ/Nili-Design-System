import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Dropdown" page (node 29:31).
 *   Dropdown        → Type (Basic·Country·Avatar·Provider·Brand·Company)
 *                     × State (Default·Hover·Focus·Filled·Disabled·Error)
 *                     × Size (Medium 40 · Small 36 · X-Small 32)
 *   Dropdown Item   → Type × State (…Selected, Selected Hover) × Size (36 · 56)
 *   Misc. Item      → Search · Button · Button Group · Caption
 *   Compact / Inline Dropdowns
 *
 * The six **Types** differ only by what sits in the item's leading slot — a
 * flag, an avatar, a card-provider mark. That is a slot, not a variant: as an
 * enum, "avatar plus a trailing badge" is unreachable and every new kind of
 * adornment needs a library release. `startAdornment` covers all six.
 */

/**
 * Figma Dropdown trigger (40 / 36 / 32, radius 10 / 8 / 8):
 *   Default   white, soft-200 border, xs shadow; placeholder sub-600, icons soft-400
 *   Filled    value strong-950, icons sub-600
 *   Hover     weak-50, no border, no shadow
 *   Focus/Open white, strong-950 border and the neutral focus ring
 *   Disabled  weak-50, sub-300 · Error  error-base border
 * Padding 12 to the leading icon (8px gap), 10 to the chevron.
 */
export const dropdownTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-2',
    'border bg-white-0 text-start outline-hidden',
    'cursor-pointer transition-[background-color,border-color,box-shadow,color] duration-200',
    '[&_[data-slot=chevron]]:text-soft-400',
    'hovered:border-transparent hovered:bg-weak-50 hovered:shadow-none hovered:[&_[data-slot=chevron]]:text-sub-600',
    'focused:border-strong-950 focused:bg-white-0 focused:shadow-focus-neutral',
    'aria-expanded:border-strong-950 aria-expanded:bg-white-0 aria-expanded:shadow-focus-neutral aria-expanded:[&_[data-slot=chevron]]:text-sub-600',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-weak-50 disabled:text-sub-300 disabled:shadow-none disabled:[&_[data-slot=chevron]]:text-sub-300',
  ],
  {
    variants: {
      size: {
        md: 'h-10 rounded-[10px] ps-[11px] pe-[9px] text-[14px] leading-5 [&_svg]:size-5',
        sm: 'h-9 rounded-md ps-[9px] pe-[7px] text-[14px] leading-5 [&_svg]:size-5',
        xs: 'h-8 rounded-md ps-[7px] pe-[5px] text-[14px] leading-5 [&_svg]:size-5',
      },
      filled: {
        true: 'text-strong-950 [&_[data-slot=chevron]]:text-sub-600',
        false: 'text-sub-600',
      },
      invalid: {
        true: 'border-error-base focused:border-error-base',
        false: 'border-soft-200',
      },
      appearance: {
        default: 'shadow-button-xs',
        compact:
          'border-transparent bg-transparent shadow-none hovered:bg-weak-50',
        inline:
          'h-auto w-auto border-transparent bg-transparent p-0 shadow-none hovered:bg-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      filled: false,
      invalid: false,
      appearance: 'default',
    },
  },
);

export const dropdownMenuVariants = cva([
  'z-50 flex max-h-[320px] min-w-[--nili-dropdown-width] flex-col overflow-hidden',
  'rounded-xl border border-soft-200 bg-white-0 p-1',
  'shadow-md',
]);

/**
 * Figma Dropdown Item: 36px (single line) or with a description, radius 8,
 * 8px padding, 20px leading visual (icon, flag, avatar, brand) and 8px gap.
 * Label strong-950, icon sub-600 · Hover weak-50 · Disabled sub-300.
 */
export const dropdownItemVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-md text-start outline-hidden',
    'cursor-pointer text-strong-950 transition-colors duration-200',
    '[&_svg]:text-sub-600',
    'hovered:bg-weak-50',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300 aria-disabled:[&_svg]:text-sub-300 aria-disabled:[&_img]:opacity-40',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-9 px-2 py-2 text-[14px] leading-5 [&_svg]:size-5',
        lg: 'min-h-14 px-2 py-2 text-[14px] leading-5 [&_svg]:size-5',
      },
      selected: {
        true: 'bg-weak-50',
        false: '',
      },
      active: {
        true: 'bg-weak-50',
        false: '',
      },
    },
    defaultVariants: { size: 'sm', selected: false, active: false },
  },
);

export const dropdownSearchVariants = cva(
  'flex items-center gap-2 border-b border-soft-200 px-2 pb-1.5',
);

export const dropdownCaptionVariants = cva(
  'px-2 py-1.5 text-[11px] font-medium uppercase leading-4 tracking-wider text-soft-400',
);

export type DropdownVariantProps = VariantProps<typeof dropdownTriggerVariants>;
export type DropdownItemVariantProps = VariantProps<
  typeof dropdownItemVariants
>;
