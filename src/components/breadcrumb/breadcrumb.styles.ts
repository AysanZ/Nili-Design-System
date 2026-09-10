import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Breadcrumbs" page (node 29:25).
 *
 *   Breadcrumb  → Divider = Arrow | Slash | Dot, Quantity 01–05
 *   Item        → State = Default | Hover | Active, Text = On/Off, Icon = On/Off
 *
 * Quantity is not a prop: the number of crumbs is however many children you
 * pass. Encoding it as a variant would mean a component that cannot render a
 * six-level path.
 */
export const breadcrumbVariants = cva(
  'flex items-center gap-1.5 overflow-hidden',
);

export const breadcrumbItemVariants = cva(
  [
    // Figma: 20px icon, 4px to the label, Label/Small.
    'inline-flex items-center gap-1 shrink-0',
    'rounded-xs text-[14px] font-medium leading-5',
    'transition-colors duration-200 ease-out',
    'decoration-from-font [text-underline-position:from-font]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
    '[&_svg]:size-5',
  ],
  {
    variants: {
      /**
       * `current` is the Figma "Active" state — the page you are on. It is not
       * a link, so it renders as plain text and carries aria-current.
       */
      current: {
        true: 'text-strong-950',
        // Hover: strong-950 and the label (not the icon) underlined.
        false:
          'text-sub-600 hovered:text-strong-950 hovered:[&_[data-slot=label]]:underline',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: { current: false, interactive: true },
  },
);

export const breadcrumbSeparatorVariants = cva(
  // Figma draws dividers in sub-300 (#CACFD8), lighter than soft-400.
  'shrink-0 select-none text-sub-300 [&_svg]:size-5',
  {
    variants: {
      divider: {
        // The chevron points along the reading direction, so it must mirror.
        arrow: 'rtl:-scale-x-100',
        slash: 'text-[14px] leading-5',
        dot: 'text-[14px] leading-5',
      },
    },
    defaultVariants: { divider: 'arrow' },
  },
);

export type BreadcrumbVariantProps = VariantProps<
  typeof breadcrumbItemVariants
>;
