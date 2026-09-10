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
   * `'basic'` is **deprecated**: it is not a Button type in Figma and exists
   * only on Fancy Button. It still renders (as a white Neutral button) so existing
   * callers do not break, but new code should use
   * `<FancyButton color="basic">` or `color="neutral" appearance="stroke"`.
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
  /** Announced while `loading`, e.g. `'Sending'`. */
  loadingLabel?: string;

  /**
   * Render the child element instead of a `<button>`, keeping every style and
   * handler. Use for links: `<Button asChild><a href="…">…</a></Button>`.
   */
  asChild?: boolean;
}
