import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Flags are always circles, so one number is enough — but the sizes are named
 * rather than free-form because the places a flag appears are fixed: `xs` is
 * the compact dropdown trigger, `sm` the standard input adornment, `md` a
 * dropdown item, and the rest are for lists and detail headers.
 *
 * `shrink-0` matters more than it looks: a flag next to a long country name
 * inside a flex row gets squashed into an ellipse without it.
 */
export const countryFlagVariants = cva(
  'inline-block shrink-0 overflow-hidden rounded-full align-middle',
  {
    variants: {
      size: {
        xs: 'size-4',
        sm: 'size-5',
        md: 'size-6',
        lg: 'size-8',
        xl: 'size-10',
        '2xl': 'size-12',
      },
      /**
       * Figma's flags sit flush on white. On a tinted or photographic surface
       * a hairline keeps a white-edged flag (Japan, Poland) from dissolving.
       */
      bordered: {
        true: 'ring-1 ring-soft-200 ring-inset',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      bordered: false,
    },
  },
);

export type CountryFlagVariantProps = VariantProps<typeof countryFlagVariants>;
export type CountryFlagSize = NonNullable<CountryFlagVariantProps['size']>;

export const COUNTRY_FLAG_SIZES: CountryFlagSize[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];

/** Pixel value of each named size, for callers that need the number. */
export const COUNTRY_FLAG_PX: Record<CountryFlagSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
};
