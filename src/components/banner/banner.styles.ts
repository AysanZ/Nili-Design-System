import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Banner [Overview]".
 *
 * Checked against the export: 44px tall, 12px padding, 20px icon, 12px gaps,
 * title (medium) · description with 8px either side of the dot, 20px ×
 * 12px from the end. Feature is the grey status (faded-*), as on Alert.
 *
 * (Original note, still true:)
 *
 *   Status = Error | Warning | Success | Information | Feature
 *   Style  = Filled | Light | Lighter | Stroke
 *
 * There is no size axis: a banner is always 44px tall (20px content + 12px
 * padding) and always spans the full width of its container.
 *
 * The colour matrix is identical to Alert's, which is the point — a banner is
 * Alert's page-level sibling, not a different visual language. Both read from
 * the same semantic tokens, so retheming moves them together.
 */
export const bannerVariants = cva(
  [
    'relative flex w-full items-center justify-center',
    'gap-3 px-12 py-3',
    // Room for the absolutely positioned dismiss button, so long content
    // never slides underneath it.
    'data-[dismissible=true]:pe-12',
  ],
  {
    variants: {
      status: {
        error: '',
        warning: '',
        success: '',
        info: '',
        feature: '',
      },
      appearance: {
        filled: 'text-static-white',
        light: 'text-strong-950',
        lighter: 'text-strong-950',
        // Figma's bottom stroke sits inside the 44px frame.
        stroke: 'border-b border-soft-200 bg-white-0 pb-[11px] text-strong-950',
      },
    },
    compoundVariants: [
      { status: 'error', appearance: 'filled', class: 'bg-error-base' },
      { status: 'error', appearance: 'light', class: 'bg-error-light' },
      { status: 'error', appearance: 'lighter', class: 'bg-error-lighter' },

      { status: 'warning', appearance: 'filled', class: 'bg-warning-base' },
      { status: 'warning', appearance: 'light', class: 'bg-warning-light' },
      { status: 'warning', appearance: 'lighter', class: 'bg-warning-lighter' },

      { status: 'success', appearance: 'filled', class: 'bg-success-base' },
      { status: 'success', appearance: 'light', class: 'bg-success-light' },
      { status: 'success', appearance: 'lighter', class: 'bg-success-lighter' },

      { status: 'info', appearance: 'filled', class: 'bg-information-base' },
      { status: 'info', appearance: 'light', class: 'bg-information-light' },
      {
        status: 'info',
        appearance: 'lighter',
        class: 'bg-information-lighter',
      },

      { status: 'feature', appearance: 'filled', class: 'bg-faded-base' },
      { status: 'feature', appearance: 'light', class: 'bg-faded-light' },
      { status: 'feature', appearance: 'lighter', class: 'bg-faded-lighter' },
    ],
    defaultVariants: {
      status: 'info',
      appearance: 'filled',
    },
  },
);

export const bannerIconVariants = cva('shrink-0 [&>svg]:size-5', {
  variants: {
    status: {
      error: '',
      warning: '',
      success: '',
      info: '',
      feature: '',
    },
    appearance: {
      filled: 'text-static-white',
      light: '',
      lighter: '',
      stroke: '',
    },
  },
  compoundVariants: [
    {
      status: 'error',
      appearance: ['light', 'lighter', 'stroke'],
      class: 'text-error-base',
    },
    {
      status: 'warning',
      appearance: ['light', 'lighter', 'stroke'],
      class: 'text-warning-base',
    },
    {
      status: 'success',
      appearance: ['light', 'lighter', 'stroke'],
      class: 'text-success-base',
    },
    {
      status: 'info',
      appearance: ['light', 'lighter', 'stroke'],
      class: 'text-information-base',
    },
    {
      status: 'feature',
      appearance: ['light', 'lighter', 'stroke'],
      class: 'text-faded-base',
    },
  ],
  defaultVariants: { status: 'info', appearance: 'filled' },
});

export const bannerActionVariants = cva(
  [
    'shrink-0 rounded-xs text-[14px] font-medium leading-5',
    'underline decoration-from-font [text-underline-position:from-font]',
    'cursor-pointer outline-hidden transition-opacity hovered:opacity-72',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  ],
  {
    variants: {
      appearance: {
        filled: 'text-static-white focus-visible:outline-static-white',
        light: 'text-strong-950 focus-visible:outline-primary-base',
        lighter: 'text-strong-950 focus-visible:outline-primary-base',
        stroke: 'text-strong-950 focus-visible:outline-primary-base',
      },
    },
    defaultVariants: { appearance: 'filled' },
  },
);

export const bannerDismissVariants = cva(
  [
    // `end-3` rather than `right-3`: in Persian the close button belongs on
    // the left, and a logical inset flips itself.
    'absolute end-3 top-3 grid size-5 place-items-center',
    // Full colour, as in Figma (it used to sit at 70%).
    'rounded-xs outline-hidden transition-opacity hovered:opacity-72',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  ],
  {
    variants: {
      appearance: {
        filled: 'focus-visible:outline-static-white',
        light: 'focus-visible:outline-primary-base',
        lighter: 'focus-visible:outline-primary-base',
        stroke: 'focus-visible:outline-primary-base',
      },
    },
    defaultVariants: { appearance: 'filled' },
  },
);

export type BannerVariantProps = VariantProps<typeof bannerVariants>;
