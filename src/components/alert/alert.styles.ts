import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Alert, Notification & Toast [Overview]".
 *
 *   Status = Error · Warning · Success · Information · Feature → `status`
 *   Style  = Filled · Light · Lighter · Stroke                   → `appearance`
 *   Size   = X-Small · Small · Large                             → `size`
 *
 * Read from the Figma export (all radii 8):
 *   size     padding      icon  title                  link / close
 *   x-small  8            16    Paragraph/X-Small 12    12px link, 16px ×, inline
 *   small    10 · 8       20    Paragraph/Small 14      14px link, 20px ×, inline
 *   large    14 · 14/16   20    Label/Small 14          description + links below
 *
 * Colours:
 *   Filled   status-base fill, everything white.
 *   Light    status-light fill; Lighter status-lighter fill; Stroke white
 *            with a soft-200 border and a two-layer drop (`shadow-alert`).
 *            Text strong-950, description at 72%, icon in status-base.
 *   Feature is the grey status (faded-*), not purple — that is what Figma
 *   draws. Warning uses the Nili orange ramp (see tokens.semantic.css).
 *
 * Stroke gets 1px less padding: its border is inside Figma's frame.
 */
export const alertVariants = cva(
  'flex w-full shrink-0 items-start rounded-md',
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
        stroke:
          'border border-soft-200 bg-white-0 text-strong-950 shadow-alert',
      },
      size: {
        'x-small': 'gap-2 p-2',
        small: 'gap-2 px-2.5 py-2',
        large: 'gap-3 p-3.5 pb-4',
      },
    },
    compoundVariants: [
      { appearance: 'stroke', size: 'x-small', class: 'p-[7px]' },
      { appearance: 'stroke', size: 'small', class: 'px-[9px] py-[7px]' },
      { appearance: 'stroke', size: 'large', class: 'p-[13px] pb-[15px]' },

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
      size: 'small',
    },
  },
);

export const alertIconVariants = cva('flex shrink-0', {
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
    size: {
      'x-small': '[&_svg]:size-4',
      small: '[&_svg]:size-5',
      large: '[&_svg]:size-5',
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
  defaultVariants: { status: 'info', appearance: 'filled', size: 'small' },
});

/** The × — same colour as the text, 16px on x-small, 20px otherwise. */
export const alertCloseVariants = cva(
  [
    'flex shrink-0 cursor-pointer rounded-xs text-inherit outline-hidden',
    'transition-opacity duration-200 hovered:opacity-72',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
  ],
  {
    variants: {
      size: {
        'x-small': '[&_svg]:size-4',
        small: '[&_svg]:size-5',
        large: '[&_svg]:size-5',
      },
    },
    defaultVariants: { size: 'small' },
  },
);

/** Kept for existing imports; actions are now Link Buttons (`color="inherit"`). */
export const alertActionVariants = cva('');

export type AlertVariantProps = VariantProps<typeof alertVariants>;
