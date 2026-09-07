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

export const dropdownTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-2',
    'rounded-lg border bg-white-0 text-start',
    'cursor-pointer transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:bg-weak-50 disabled:text-sub-300',
  ],
  {
    variants: {
      size: {
        md: 'h-10 px-3 text-[14px] leading-5 [&_svg]:size-5',
        sm: 'h-9 px-2.5 text-[14px] leading-5 [&_svg]:size-5',
        xs: 'h-8 px-2 text-[12px] leading-4 [&_svg]:size-4',
      },
      /** Figma "Filled" — a value is chosen, so the text goes full strength. */
      filled: {
        true: 'border-soft-200 text-strong-950',
        false: 'border-soft-200 text-soft-400',
      },
      invalid: {
        true: 'border-error-base focus-visible:outline-error-base',
        false: 'hover:border-sub-300',
      },
      /** Figma "Compact Dropdowns": no border, for toolbars and input adornments. */
      appearance: {
        default: 'shadow-xs',
        compact:
          'border-transparent bg-transparent shadow-none hover:bg-weak-50',
        inline:
          'h-auto w-auto border-transparent bg-transparent p-0 shadow-none',
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

export const dropdownItemVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-lg text-start',
    'cursor-pointer transition-colors duration-150',
    'focus-visible:outline-none',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300',
  ],
  {
    variants: {
      size: {
        /** Figma Small (36): a single line. */
        sm: 'min-h-9 px-2 py-1.5 text-[14px] leading-5 [&_svg]:size-5',
        /** Figma Large (56): label plus description. */
        lg: 'min-h-14 px-2 py-2 text-[14px] leading-5 [&_svg]:size-6',
      },
      selected: {
        true: 'bg-weak-50 text-strong-950',
        false: 'text-sub-600',
      },
      /** Keyboard cursor, kept separate from `selected`: they co-occur. */
      active: {
        true: 'bg-weak-50 text-strong-950',
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
