import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ButtonVariantProps } from './button.styles';

export type ButtonColor = NonNullable<ButtonVariantProps['color']>;
export type ButtonAppearance = NonNullable<ButtonVariantProps['appearance']>;
export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

export interface ButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'color'
> {
  /**
   * Figma `🧩 Type` — Primary · Neutral · Error · Success.
   *
   * `basic` is **not** on Figma's Button. It exists there only on Fancy Button,
   * so reach for `<FancyButton color="basic">` when you want that treatment.
   * The value is kept here because removing it would break callers, but treat
   * it as outside the design system rather than as a fifth type.
   */
  color?: ButtonColor;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  fullWidth?: boolean;

  startIcon?: ReactNode;
  endIcon?: ReactNode;

  /**
   * Square icon-only button. Requires `aria-label` — a button whose only
   * content is an SVG has no accessible name otherwise.
   */
  iconOnly?: boolean;

  /** Shows a spinner and blocks interaction without collapsing the layout. */
  loading?: boolean;
  /** Announced while `loading`, e.g. `'در حال ارسال'`. */
  loadingLabel?: string;

  /**
   * Render the child element instead of a `<button>`, keeping every style and
   * handler. Use for links: `<Button asChild><a href="…">…</a></Button>`.
   */
  asChild?: boolean;
}
