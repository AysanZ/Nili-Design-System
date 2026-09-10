import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Buttons [Overview]" → Buttons.
 *
 *   🧩 Type   = Primary · Neutral · Error · Success      → `color`
 *   🏵️ Style  = Filled · Stroke · Lighter · Ghost        → `appearance`
 *   📏 Size   = Medium (40) · Small (36) · X-Small (32) · 2X-Small (28) → `size`
 *   🔳 Only Icon = On · Off                             → `iconOnly`
 *   📌 State  = Default · Hover · Focus · Disabled      → CSS, not a prop
 *
 * Every value below was read out of the Figma export, not eyeballed:
 *
 * ── Geometry (identical for all four types and styles) ───────────────
 *   size  height  radius  edge→icon  icon↔label  text   icon
 *   md    40      10      10         8           14/20  20
 *   sm    36       8       8         8           14/20  20
 *   xs    32       8       6         6           14/20  20
 *   2xs   28       8       6         6           14/20  20
 *
 * The label carries its own 4px inline padding, so `edge→icon` is the root
 * padding and `icon↔label` is `gap + 4`. A text-only button therefore gets
 * 14 / 12 / 10 / 10 px of side padding — the same numbers Figma shows when
 * both icons are switched off.
 *
 * ── State behaviour ──────────────────────────────────────────────────
 *   Filled   hover: darker fill               focus: base fill + ring
 *   Stroke   hover: 10% tint, border drops    focus: white + border + ring
 *   Lighter  hover: white + border            focus: white + border + ring
 *   Ghost    hover: 10% tint                  focus: white + border + ring
 *   Disabled (every style): weak-50 fill, sub-300 text, no border, no shadow.
 *
 * Neutral additionally darkens its text from sub-600 to strong-950 on hover
 * and focus, and uses a strong-950 border when focused.
 *
 * Focus ring = 2px page colour + 2px tint (primary 24% blue, neutral
 * soft-200, error light, success light) — see `--shadow-focus-*` in
 * theme.css.
 *
 * `hovered:` / `focused:` are Nili variants (styles/variants.css): the same
 * browser states as `hover:` / `focus-visible:`, never applied to a disabled
 * control, and forceable with `data-nili-state` so the docs can draw the
 * Figma state row statically.
 *
 * Every button keeps a 1px border at all times (transparent when Figma has
 * none), so switching style or state never changes its size by a pixel.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center',
    'border border-transparent outline-hidden',
    'whitespace-nowrap select-none cursor-pointer',
    // Figma text style: Label/Small — 14/20, medium, -0.6% tracking.
    'text-[14px] leading-5 font-medium tracking-[-0.006em]',
    '[&_svg]:size-5 [&_svg]:shrink-0',
    'transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-weak-50 disabled:text-sub-300 disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-weak-50 aria-disabled:text-sub-300 aria-disabled:shadow-none',
  ],
  {
    variants: {
      color: {
        primary: '',
        neutral: '',
        error: '',
        success: '',
        basic: '',
      },
      appearance: {
        filled: '',
        stroke: '',
        lighter: '',
        ghost: 'bg-transparent',
      },
      size: {
        // Padding is Figma's edge→icon distance minus the 1px border: Figma
        // strokes are drawn inside the frame, CSS borders sit outside the
        // padding.
        md: 'h-10 gap-1 rounded-lg px-[9px]',
        sm: 'h-9 gap-1 rounded-md px-[7px]',
        xs: 'h-8 gap-0.5 rounded-md px-[5px]',
        '2xs': 'h-7 gap-0.5 rounded-md px-[5px]',
      },
      iconOnly: {
        true: 'px-0',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // ── icon-only squares ─────────────────────────────────────────────
      { iconOnly: true, size: 'md', class: 'w-10' },
      { iconOnly: true, size: 'sm', class: 'w-9' },
      { iconOnly: true, size: 'xs', class: 'w-8' },
      { iconOnly: true, size: '2xs', class: 'w-7' },

      // ── filled ────────────────────────────────────────────────────────
      {
        appearance: 'filled',
        color: 'primary',
        class:
          'bg-primary-base text-static-white hovered:bg-primary-darker focused:bg-primary-base focused:shadow-focus-primary',
      },
      {
        // Figma: strong-950 at rest, surface-800 on hover. `text-white-0`
        // (not static-white) so the button inverts cleanly in dark mode.
        appearance: 'filled',
        color: 'neutral',
        class:
          'bg-strong-950 text-white-0 hovered:bg-surface-800 focused:bg-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'filled',
        color: 'error',
        class:
          'bg-error-base text-static-white hovered:bg-error-darker focused:bg-error-base focused:shadow-focus-error',
      },
      {
        appearance: 'filled',
        color: 'success',
        class:
          'bg-success-base text-static-white hovered:bg-success-darker focused:bg-success-base focused:shadow-focus-success',
      },

      // ── stroke ────────────────────────────────────────────────────────
      {
        appearance: 'stroke',
        color: 'primary',
        class:
          'border-primary-base bg-white-0 text-primary-base hovered:border-transparent hovered:bg-primary-alpha-10 focused:border-primary-base focused:bg-white-0 focused:shadow-focus-primary',
      },
      {
        appearance: 'stroke',
        color: 'neutral',
        class:
          'border-soft-200 bg-white-0 text-sub-600 shadow-button-xs hovered:border-transparent hovered:bg-weak-50 hovered:text-strong-950 hovered:shadow-none focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'stroke',
        color: 'error',
        class:
          'border-error-base bg-white-0 text-error-base hovered:border-transparent hovered:bg-error-alpha-10 focused:border-error-base focused:bg-white-0 focused:shadow-focus-error',
      },
      {
        appearance: 'stroke',
        color: 'success',
        class:
          'border-success-base bg-white-0 text-success-base hovered:border-transparent hovered:bg-success-alpha-10 focused:border-success-base focused:bg-white-0 focused:shadow-focus-success',
      },

      // ── lighter ───────────────────────────────────────────────────────
      {
        appearance: 'lighter',
        color: 'primary',
        class:
          'bg-primary-alpha-10 text-primary-base hovered:border-primary-base hovered:bg-white-0 focused:border-primary-base focused:bg-white-0 focused:shadow-focus-primary',
      },
      {
        appearance: 'lighter',
        color: 'neutral',
        class:
          'bg-weak-50 text-sub-600 hovered:border-soft-200 hovered:bg-white-0 hovered:text-strong-950 hovered:shadow-button-xs focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'lighter',
        color: 'error',
        class:
          'bg-error-alpha-10 text-error-base hovered:border-error-base hovered:bg-white-0 focused:border-error-base focused:bg-white-0 focused:shadow-focus-error',
      },
      {
        appearance: 'lighter',
        color: 'success',
        class:
          'bg-success-alpha-10 text-success-base hovered:border-success-base hovered:bg-white-0 focused:border-success-base focused:bg-white-0 focused:shadow-focus-success',
      },

      // ── ghost ─────────────────────────────────────────────────────────
      {
        appearance: 'ghost',
        color: 'primary',
        class:
          'text-primary-base hovered:bg-primary-alpha-10 focused:border-primary-base focused:bg-white-0 focused:shadow-focus-primary',
      },
      {
        appearance: 'ghost',
        color: 'neutral',
        class:
          'text-sub-600 hovered:bg-weak-50 hovered:text-strong-950 focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'ghost',
        color: 'error',
        class:
          'text-error-base hovered:bg-error-alpha-10 focused:border-error-base focused:bg-white-0 focused:shadow-focus-error',
      },
      {
        appearance: 'ghost',
        color: 'success',
        class:
          'text-success-base hovered:bg-success-alpha-10 focused:border-success-base focused:bg-white-0 focused:shadow-focus-success',
      },

      // ── basic (deprecated — not a Button type in Figma) ──────────────
      // Kept so existing callers do not break. It renders as Neutral, with
      // `filled` drawn as Neutral · Stroke (a white button), which is the
      // closest thing Figma has. New code: <FancyButton color="basic">.
      {
        appearance: ['filled', 'stroke'],
        color: 'basic',
        class:
          'border-soft-200 bg-white-0 text-sub-600 shadow-button-xs hovered:border-transparent hovered:bg-weak-50 hovered:text-strong-950 hovered:shadow-none focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'lighter',
        color: 'basic',
        class:
          'bg-weak-50 text-sub-600 hovered:border-soft-200 hovered:bg-white-0 hovered:text-strong-950 hovered:shadow-button-xs focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
      {
        appearance: 'ghost',
        color: 'basic',
        class:
          'text-sub-600 hovered:bg-weak-50 hovered:text-strong-950 focused:border-strong-950 focused:bg-white-0 focused:text-strong-950 focused:shadow-focus-neutral',
      },
    ],
    defaultVariants: {
      color: 'primary',
      appearance: 'filled',
      size: 'md',
      iconOnly: false,
      fullWidth: false,
    },
  },
);

/** The four Figma types, in Figma's order. `basic` is deliberately absent. */
export const BUTTON_COLORS = [
  'primary',
  'neutral',
  'error',
  'success',
] as const;
/** Figma 🏵️ Style, in Figma's column order. */
export const BUTTON_APPEARANCES = [
  'filled',
  'stroke',
  'lighter',
  'ghost',
] as const;
/** Figma 📏 Size, largest first. */
export const BUTTON_SIZES = ['md', 'sm', 'xs', '2xs'] as const;

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
