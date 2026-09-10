import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Modal" page (node 29:34).
 *   Modal Header → Type (Basic·Right Icon·Error·Warning·Success·Information)
 *                  × Size (Medium 80 | Small 56)
 *   Modal Footer → Type (Basic·Checkbox·Information·Toggle·Stepper·Link Button·Stretch)
 *   Status Modal → Type (Error·Warning·Success·Information) × Alignment (H | V)
 *   Modal Overlay
 *
 * The header's six Types collapse to `status` (which picks the KeyIcon) plus a
 * free `icon` slot for "Right Icon". The footer's seven are content shapes, so
 * `footer` takes children and `stretchFooter` handles layout — the same split
 * as Drawer, for the same reason.
 */

export const modalOverlayVariants = cva([
  'fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4',
  'bg-[rgba(14,18,27,0.48)]',
  'transition-opacity duration-200 motion-reduce:transition-none',
  'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
]);

export const modalPanelVariants = cva(
  [
    'relative flex w-full flex-col rounded-2xl bg-white-0',
    'shadow-lg',
    'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
    'data-[state=closed]:scale-95 data-[state=closed]:opacity-0',
    'focus-visible:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[400px]',
        // Figma modals are 440 wide.
        md: 'max-w-[440px]',
        lg: 'max-w-[720px]',
        xl: 'max-w-[960px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const modalHeaderVariants = cva(
  'flex shrink-0 items-start gap-3.5 border-b border-soft-200',
  {
    variants: {
      /** Figma Medium (80) / Small (56) is header height, i.e. density. */
      size: {
        // Figma Modal Header: 20px sides, 16px top/bottom, 14px gap to a
        // 40px status icon. Both sizes draw the Figma header.
        sm: 'px-5 pt-4 pb-[15px]',
        md: 'px-5 pt-4 pb-[15px]',
      },
      alignment: {
        horizontal: 'flex-row items-start text-start',
        vertical: 'flex-col items-center text-center',
      },
    },
    defaultVariants: { size: 'sm', alignment: 'horizontal' },
  },
);

export const modalBodyVariants = cva('flex-1 overflow-y-auto', {
  variants: {
    size: {
      sm: 'px-4 py-3',
      md: 'px-5 py-4',
    },
  },
  defaultVariants: { size: 'sm' },
});

export const modalFooterVariants = cva(
  // Figma Modal Footer: 20px sides, 16px top/bottom.
  'flex shrink-0 items-center gap-3 border-t border-soft-200 px-5 py-4',
  {
    variants: {
      stretch: {
        true: 'justify-stretch [&>*]:flex-1',
        false: 'justify-end',
      },
    },
    defaultVariants: { stretch: false },
  },
);

export type ModalVariantProps = VariantProps<typeof modalPanelVariants>;
export type ModalHeaderVariantProps = VariantProps<typeof modalHeaderVariants>;
