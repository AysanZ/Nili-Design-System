import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ File Upload" page (node 29:32).
 *   File Upload Area  → State (Default | Hover)
 *   File Upload Cards → State (In Progress | Success | Error)
 *   Image Upload      → Type (Avatar·Company·1:1·4:3·16:9) × State (Empty|Uploaded)
 *                       × Alignment (Vertical|Horizontal)
 *   File Format Icons → Color × Size
 *
 * The area's "Hover" is a CSS state, but **drag-over is not** — it comes from
 * DOM events, so it is real component state exposed as `data-dragging`.
 */
export const fileUploadAreaVariants = cva(
  [
    'flex w-full flex-col items-center justify-center gap-2',
    'rounded-xl border border-dashed px-6 py-8 text-center',
    'cursor-pointer transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      dragging: {
        true: 'border-primary-base bg-information-lighter',
        false:
          'border-soft-200 bg-white-0 hover:border-sub-300 hover:bg-weak-50',
      },
      invalid: {
        true: 'border-error-base bg-error-lighter',
        false: '',
      },
      disabled: {
        true: 'pointer-events-none border-soft-200 bg-weak-50 opacity-60',
        false: '',
      },
    },
    defaultVariants: { dragging: false, invalid: false, disabled: false },
  },
);

export const fileCardVariants = cva(
  'flex w-full items-start gap-3 rounded-xl border bg-white-0 p-3',
  {
    variants: {
      status: {
        progress: 'border-soft-200',
        success: 'border-soft-200',
        error: 'border-error-base bg-error-lighter',
      },
    },
    defaultVariants: { status: 'progress' },
  },
);

export const fileProgressVariants = cva(
  'h-1 w-full overflow-hidden rounded-full bg-soft-200',
);

export const fileProgressBarVariants = cva(
  'h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none',
  {
    variants: {
      status: {
        progress: 'bg-primary-base',
        success: 'bg-success-base',
        error: 'bg-error-base',
      },
    },
    defaultVariants: { status: 'progress' },
  },
);

/** Figma "File Format Icons": ten colours, two sizes. */
/**
 * Figma File Format Icons: a white page (1.5px sub-300 outline, a cut
 * corner) with a coloured 28×16 label chip carrying the extension in white.
 * 40px and 32px. The colour sits on the chip, so it is the `-base` token.
 */
export const fileFormatIconVariants = cva('relative inline-block shrink-0', {
  variants: {
    color: {
      red: 'text-error-base',
      orange: 'text-warning-base',
      yellow: 'text-away-base',
      green: 'text-success-base',
      teal: 'text-stable-base',
      sky: 'text-verified-base',
      blue: 'text-information-base',
      purple: 'text-feature-base',
      pink: 'text-highlighted-base',
      gray: 'text-faded-base',
    },
    size: {
      md: 'size-10',
      xs: 'size-8',
    },
  },
  defaultVariants: { color: 'gray', size: 'md' },
});

export const imageUploadVariants = cva(
  [
    'group/upload relative flex items-center justify-center overflow-hidden',
    'border border-dashed border-soft-200 bg-weak-50',
    'cursor-pointer transition-colors duration-150 hover:border-sub-300',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      shape: {
        avatar: 'size-20 rounded-full',
        company: 'size-20 rounded-xl',
        square: 'aspect-square w-24 rounded-xl',
        '4:3': 'aspect-[4/3] w-24 rounded-xl',
        '16:9': 'aspect-video w-24 rounded-xl',
      },
    },
    defaultVariants: { shape: 'square' },
  },
);

export const imageUploadRootVariants = cva('flex gap-3', {
  variants: {
    alignment: {
      vertical: 'flex-col items-start',
      horizontal: 'flex-row items-center',
    },
  },
  defaultVariants: { alignment: 'vertical' },
});

export type FileCardVariantProps = VariantProps<typeof fileCardVariants>;
export type FileFormatIconVariantProps = VariantProps<
  typeof fileFormatIconVariants
>;
export type ImageUploadVariantProps = VariantProps<typeof imageUploadVariants>;
