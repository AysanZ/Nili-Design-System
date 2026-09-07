import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Button" page, Fancy Button [1.0].
 *   Type = Primary | Neutral | Error | Success | Basic
 *   Size = Medium (40) | Small (36) | X-Small (32) | 2X-Small (28)
 *
 * A regular button with a raised treatment: a top-down white overlay gradient,
 * a 12%-white inner hairline, and a two-part shadow (1px coloured ring plus a
 * soft drop). Figma expresses the fill as two stacked linear-gradients; that
 * is reproduced here rather than flattened, because flattening loses the sheen
 * on the top edge.
 */
const SHEEN =
  'bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_100%)]';

export const fancyButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center shrink-0 overflow-hidden',
    'gap-1 font-medium whitespace-nowrap',
    'border border-[rgba(255,255,255,0.12)]',
    'cursor-pointer transition-[filter,box-shadow] duration-150',
    'hover:brightness-110',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-none',
    'disabled:bg-disabled-300 disabled:text-sub-300 disabled:shadow-none',
    SHEEN,
  ],
  {
    variants: {
      color: {
        primary:
          'bg-primary-base text-static-white shadow-[0_0_0_1px_var(--nili-primary-base),var(--nili-shadow-button-primary)] focus-visible:outline-primary-base',
        neutral:
          'bg-surface-800 text-static-white shadow-[0_0_0_1px_var(--nili-surface-800),var(--nili-shadow-button-primary)] focus-visible:outline-surface-800',
        error:
          'bg-error-base text-static-white shadow-[0_0_0_1px_var(--nili-error-base),var(--nili-shadow-button-primary)] focus-visible:outline-error-base',
        success:
          'bg-success-base text-static-white shadow-[0_0_0_1px_var(--nili-success-base),var(--nili-shadow-button-primary)] focus-visible:outline-success-base',
        basic:
          'bg-white-0 text-sub-600 border-soft-200 shadow-[0_0_0_1px_var(--nili-soft-200),var(--nili-shadow-button-basic)] focus-visible:outline-primary-base',
      },
      size: {
        md: 'h-10 rounded-lg px-2.5 text-[14px] leading-5 [&_svg]:size-5',
        sm: 'h-9 rounded-lg px-2.5 text-[14px] leading-5 [&_svg]:size-5',
        xs: 'h-8 rounded-md px-2 text-[12px] leading-4 [&_svg]:size-4',
        '2xs': 'h-7 rounded-md px-2 text-[12px] leading-4 [&_svg]:size-4',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { color: 'primary', size: 'md', fullWidth: false },
  },
);

export type FancyButtonVariantProps = VariantProps<typeof fancyButtonVariants>;
