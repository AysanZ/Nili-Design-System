import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma draws every placeholder logo as a disc. The three variants are the
 * three surfaces a logo lands on: its own colour, a light neutral page, and a
 * dark one. Colour lives in `style` rather than in a class, because the brand
 * colour comes from data and Tailwind cannot emit a class for a value it
 * never sees at build time.
 */
export const placeholderLogoVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full align-middle',
  {
    variants: {
      size: {
        xs: 'size-5',
        sm: 'size-6',
        md: 'size-8',
        lg: 'size-10',
        xl: 'size-12',
        '2xl': 'size-16',
      },
      variant: {
        original: '',
        black: 'bg-strong-950 text-white-0',
        white: 'bg-white-0 text-strong-950 ring-1 ring-soft-200 ring-inset',
      },
    },
    defaultVariants: { size: 'md', variant: 'original' },
  },
);

export type PlaceholderLogoVariantProps = VariantProps<
  typeof placeholderLogoVariants
>;
export type PlaceholderLogoSize = NonNullable<
  PlaceholderLogoVariantProps['size']
>;

export const PLACEHOLDER_LOGO_SIZES: PlaceholderLogoSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];
