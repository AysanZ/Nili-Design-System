import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Badge visuals.
 *
 * The old version hand-rolled six `Record<Color, string>` maps and a
 * `getBadgeStyles()` switch — 10 colours × 4 appearances = 40 branches to keep
 * in sync by hand, and it carried zero `dark:` classes, so every badge was
 * broken in dark mode. Both problems disappear here: `cva` owns the matrix,
 * and the colours are semantic tokens that swap themselves under
 * `[data-theme="dark"]`.
 */
export const badgeVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0',
    // Inline padding is set per slot in badge.tsx: Figma uses 8px beside
    // text, 4px beside an icon, and 4px (medium) / 2px (small) beside a dot.
    'gap-0.5 rounded-full py-0.5',
    'align-middle whitespace-nowrap',
  ],
  {
    variants: {
      appearance: {
        filled: 'text-static-white',
        light: '',
        lighter: '',
        stroke: 'bg-transparent border',
      },
      color: {
        gray: '',
        red: '',
        blue: '',
        orange: '',
        green: '',
        yellow: '',
        purple: '',
        sky: '',
        pink: '',
        teal: '',
      },
      size: {
        medium: 'text-[12px] font-medium leading-4',
        // Figma Small uses the uppercase Subheading/2X-Small style ("BADGE").
        small: 'text-[11px] font-medium leading-3 tracking-[0.02em] uppercase',
      },
      disabled: {
        true: 'bg-transparent text-sub-300 border border-soft-200',
        false: '',
      },
    },
    compoundVariants: [
      // ── filled ────────────────────────────────────────────────────────
      {
        appearance: 'filled',
        color: 'gray',
        disabled: false,
        class: 'bg-faded-base',
      },
      {
        appearance: 'filled',
        color: 'blue',
        disabled: false,
        class: 'bg-information-base',
      },
      {
        appearance: 'filled',
        color: 'orange',
        disabled: false,
        class: 'bg-warning-base',
      },
      {
        appearance: 'filled',
        color: 'red',
        disabled: false,
        class: 'bg-error-base',
      },
      {
        appearance: 'filled',
        color: 'green',
        disabled: false,
        class: 'bg-success-base',
      },
      {
        appearance: 'filled',
        color: 'yellow',
        disabled: false,
        class: 'bg-away-base',
      },
      {
        appearance: 'filled',
        color: 'purple',
        disabled: false,
        class: 'bg-feature-base',
      },
      {
        appearance: 'filled',
        color: 'sky',
        disabled: false,
        class: 'bg-verified-base',
      },
      {
        appearance: 'filled',
        color: 'pink',
        disabled: false,
        class: 'bg-highlighted-base',
      },
      {
        appearance: 'filled',
        color: 'teal',
        disabled: false,
        class: 'bg-stable-base',
      },

      // ── light ─────────────────────────────────────────────────────────
      {
        appearance: 'light',
        color: 'gray',
        disabled: false,
        class: 'bg-faded-light text-faded-dark',
      },
      {
        appearance: 'light',
        color: 'blue',
        disabled: false,
        class: 'bg-information-light text-information-dark',
      },
      {
        appearance: 'light',
        color: 'orange',
        disabled: false,
        class: 'bg-warning-light text-warning-dark',
      },
      {
        appearance: 'light',
        color: 'red',
        disabled: false,
        class: 'bg-error-light text-error-dark',
      },
      {
        appearance: 'light',
        color: 'green',
        disabled: false,
        class: 'bg-success-light text-success-dark',
      },
      {
        appearance: 'light',
        color: 'yellow',
        disabled: false,
        class: 'bg-away-light text-away-dark',
      },
      {
        appearance: 'light',
        color: 'purple',
        disabled: false,
        class: 'bg-feature-light text-feature-dark',
      },
      {
        appearance: 'light',
        color: 'sky',
        disabled: false,
        class: 'bg-verified-light text-verified-dark',
      },
      {
        appearance: 'light',
        color: 'pink',
        disabled: false,
        class: 'bg-highlighted-light text-highlighted-dark',
      },
      {
        appearance: 'light',
        color: 'teal',
        disabled: false,
        class: 'bg-stable-light text-stable-dark',
      },

      // ── lighter ───────────────────────────────────────────────────────
      {
        appearance: 'lighter',
        color: 'gray',
        disabled: false,
        class: 'bg-faded-lighter text-faded-base',
      },
      {
        appearance: 'lighter',
        color: 'blue',
        disabled: false,
        class: 'bg-information-lighter text-information-base',
      },
      {
        appearance: 'lighter',
        color: 'orange',
        disabled: false,
        class: 'bg-warning-lighter text-warning-base',
      },
      {
        appearance: 'lighter',
        color: 'red',
        disabled: false,
        class: 'bg-error-lighter text-error-base',
      },
      {
        appearance: 'lighter',
        color: 'green',
        disabled: false,
        class: 'bg-success-lighter text-success-base',
      },
      {
        appearance: 'lighter',
        color: 'yellow',
        disabled: false,
        class: 'bg-away-lighter text-away-base',
      },
      {
        appearance: 'lighter',
        color: 'purple',
        disabled: false,
        class: 'bg-feature-lighter text-feature-base',
      },
      {
        appearance: 'lighter',
        color: 'sky',
        disabled: false,
        class: 'bg-verified-lighter text-verified-base',
      },
      {
        appearance: 'lighter',
        color: 'pink',
        disabled: false,
        class: 'bg-highlighted-lighter text-highlighted-base',
      },
      {
        appearance: 'lighter',
        color: 'teal',
        disabled: false,
        class: 'bg-stable-lighter text-stable-base',
      },

      // ── stroke ────────────────────────────────────────────────────────
      {
        appearance: 'stroke',
        color: 'gray',
        disabled: false,
        class: 'border-faded-base text-faded-base',
      },
      {
        appearance: 'stroke',
        color: 'blue',
        disabled: false,
        class: 'border-information-base text-information-base',
      },
      {
        appearance: 'stroke',
        color: 'orange',
        disabled: false,
        class: 'border-warning-base text-warning-base',
      },
      {
        appearance: 'stroke',
        color: 'red',
        disabled: false,
        class: 'border-error-base text-error-base',
      },
      {
        appearance: 'stroke',
        color: 'green',
        disabled: false,
        class: 'border-success-base text-success-base',
      },
      {
        appearance: 'stroke',
        color: 'yellow',
        disabled: false,
        class: 'border-away-base text-away-base',
      },
      {
        appearance: 'stroke',
        color: 'purple',
        disabled: false,
        class: 'border-feature-base text-feature-base',
      },
      {
        appearance: 'stroke',
        color: 'sky',
        disabled: false,
        class: 'border-verified-base text-verified-base',
      },
      {
        appearance: 'stroke',
        color: 'pink',
        disabled: false,
        class: 'border-highlighted-base text-highlighted-base',
      },
      {
        appearance: 'stroke',
        color: 'teal',
        disabled: false,
        class: 'border-stable-base text-stable-base',
      },
    ],
    defaultVariants: {
      appearance: 'filled',
      color: 'gray',
      size: 'medium',
      disabled: false,
    },
  },
);

export const badgeIconVariants = cva(
  'inline-flex items-center justify-center shrink-0',
  {
    variants: {
      size: {
        medium: 'size-4 [&>svg]:size-4',
        small: 'size-3 [&>svg]:size-3',
      },
    },
    defaultVariants: { size: 'medium' },
  },
);

/** The dot inherits the text colour, so it stays correct in every appearance. */
export const badgeDotVariants = cva('rounded-full bg-current', {
  variants: {
    size: {
      medium: 'size-1',
      small: 'size-1',
    },
  },
  defaultVariants: { size: 'medium' },
});

/** The dot sits centred in a 12px slot on both sizes (Figma). */
export const badgeDotSlotVariants = cva(
  'inline-flex size-3 shrink-0 items-center justify-center',
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
