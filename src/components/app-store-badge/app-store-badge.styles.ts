import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The pill. Every storefront publishes its badge at the same 3:1-ish ratio, so
 * sizes are a height and the width follows — a footer row of five badges from
 * five different stores then lines up on both edges.
 */
export const appStoreBadgeVariants = cva(
  'inline-flex shrink-0 overflow-hidden rounded-[10px] align-middle [aspect-ratio:180/60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
        xl: 'h-14',
      },
      variant: {
        /** The store's own colours on black — what you normally ship. */
        original: 'bg-[#0E121B]',
        /** Monochrome on black, for busy or dark footers. */
        black: 'bg-[#0E121B]',
        /** Inverted, for dark page backgrounds. */
        white: 'bg-white ring-1 ring-black/10 ring-inset',
      },
    },
    defaultVariants: { size: 'md', variant: 'original' },
  },
);

export type AppStoreBadgeVariantProps = VariantProps<
  typeof appStoreBadgeVariants
>;
export type AppStoreBadgeSize = NonNullable<AppStoreBadgeVariantProps['size']>;

export const APP_STORE_BADGE_SIZES: AppStoreBadgeSize[] = [
  'sm',
  'md',
  'lg',
  'xl',
];
