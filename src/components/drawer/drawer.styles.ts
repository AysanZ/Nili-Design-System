import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Drawer" page (node 1444:2828).
 *   Drawer Header → Type (Basic | Left Icon) × Size (Small | Large)
 *   Drawer Footer → Type (Basic | Checkbox | Toggle | Stepper | Link Button | Stretch)
 *
 * The footer's six "types" are content shapes, so the footer takes `children`
 * and a `stretch` flag rather than a six-value enum — otherwise "checkbox plus
 * stretched buttons" is unreachable.
 */

export const drawerOverlayVariants = cva([
  'fixed inset-0 z-50 bg-[rgba(14,18,27,0.48)]',
  'transition-opacity duration-200 motion-reduce:transition-none',
  'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
]);

export const drawerPanelVariants = cva(
  [
    'fixed z-50 flex flex-col bg-white-0 shadow-md',
    'transition-transform duration-200 ease-out motion-reduce:transition-none',
    'focus-visible:outline-none',
  ],
  {
    variants: {
      /**
       * Logical sides. `end` is the right edge in English and the left edge in
       * Persian, which is where a detail panel belongs in both.
       */
      side: {
        start:
          'inset-y-0 start-0 h-full rounded-e-2xl data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full',
        end: 'inset-y-0 end-0 h-full rounded-s-2xl data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full',
        top: 'inset-x-0 top-0 w-full rounded-b-2xl data-[state=closed]:-translate-y-full',
        bottom:
          'inset-x-0 bottom-0 w-full rounded-t-2xl data-[state=closed]:translate-y-full',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        full: '',
      },
    },
    compoundVariants: [
      { side: ['start', 'end'], size: 'sm', class: 'w-[320px] max-w-[90vw]' },
      { side: ['start', 'end'], size: 'md', class: 'w-[400px] max-w-[90vw]' },
      { side: ['start', 'end'], size: 'lg', class: 'w-[560px] max-w-[95vw]' },
      { side: ['start', 'end'], size: 'full', class: 'w-screen' },
      { side: ['top', 'bottom'], size: 'sm', class: 'h-[240px] max-h-[90vh]' },
      { side: ['top', 'bottom'], size: 'md', class: 'h-[400px] max-h-[90vh]' },
      { side: ['top', 'bottom'], size: 'lg', class: 'h-[640px] max-h-[95vh]' },
      { side: ['top', 'bottom'], size: 'full', class: 'h-screen' },
    ],
    defaultVariants: { side: 'end', size: 'md' },
  },
);

/**
 * Figma Drawer Header (400 wide): 20px sides, 68px tall with a title
 * (Label/Large 18/24), 92px with a description (Paragraph/Small, 4px below),
 * a 20px icon or a 48px key-icon 16px before the text, and a × at the end.
 * `size` is kept for existing callers; both draw the Figma header.
 */
export const drawerHeaderVariants = cva(
  'flex shrink-0 items-start gap-4 border-b border-soft-200 bg-white-0 px-5 pt-[22px] pb-[21px]',
  {
    variants: {
      size: {
        sm: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'sm' },
  },
);

export const drawerBodyVariants = cva('flex-1 overflow-y-auto', {
  variants: {
    size: {
      sm: 'px-4 py-3',
      lg: 'px-5 py-4',
    },
  },
  defaultVariants: { size: 'sm' },
});

export const drawerFooterVariants = cva(
  // Figma Drawer Footer: 20px sides, 16px top/bottom, actions at the end
  // and an optional start slot (checkbox, switch, step dots, link).
  'flex shrink-0 items-center gap-3 border-t border-soft-200 bg-white-0 px-5 py-4',
  {
    variants: {
      /** Figma "Stretch": actions fill the width instead of hugging the end. */
      stretch: {
        true: 'justify-stretch [&>*]:flex-1',
        false: 'justify-end',
      },
    },
    defaultVariants: { stretch: false },
  },
);

export type DrawerVariantProps = VariantProps<typeof drawerPanelVariants>;
