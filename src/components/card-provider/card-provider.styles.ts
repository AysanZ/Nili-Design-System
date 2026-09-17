import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Scheme marks are landscape, not square — 780×500, the ISO card ratio. Sizes
 * are therefore stated as a width, with the height following the aspect ratio,
 * so a row of providers lines up on both edges no matter which marks it holds.
 */
export const cardProviderVariants = cva(
  'inline-block shrink-0 overflow-hidden align-middle [aspect-ratio:780/500]',
  {
    variants: {
      size: {
        xs: 'w-6',
        sm: 'w-8',
        md: 'w-10',
        lg: 'w-12',
        xl: 'w-[60px]',
        '2xl': 'w-20',
      },
      /* The three treatments differ in the file, not in CSS — an <img>
         cannot inherit colour. The axis stays here so `framed` and future
         per-treatment spacing have somewhere to hang. */
      variant: {
        original: '',
        mono: '',
        outline: '',
      },
      /** Figma's Light Color tile: the mark on its own tinted chip. */
      framed: {
        true: 'rounded-md bg-white-0 ring-1 ring-soft-200 ring-inset',
        false: 'rounded-md',
      },
    },
    defaultVariants: { size: 'md', variant: 'original', framed: false },
  },
);

export type CardProviderVariantProps = VariantProps<
  typeof cardProviderVariants
>;
export type CardProviderSize = NonNullable<CardProviderVariantProps['size']>;

export const CARD_PROVIDER_SIZES: CardProviderSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];
