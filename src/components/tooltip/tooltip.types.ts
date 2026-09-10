import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TooltipVariantProps } from './tooltip.styles';

export type TooltipSide = NonNullable<TooltipVariantProps['side']>;
export type TooltipAlign = NonNullable<TooltipVariantProps['align']>;
export type TooltipSize = NonNullable<TooltipVariantProps['size']>;

export interface TooltipBaseProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'content'
> {
  /**
   * The trigger. A single element, which receives the hover, focus and
   * `aria-describedby` wiring — so it must be able to take focus. Wrap plain
   * text in a `<button>` or a focusable element; a tooltip on a `<span>` is
   * invisible to keyboard users.
   */
  children: ReactNode;
  /**
   * Tooltip text. Keep it to a phrase and keep it non-essential: a tooltip is
   * unreachable on touch and can be missed entirely, so anything the user
   * *must* read belongs in the page.
   */
  content: ReactNode;
  /** Second line under the text. Figma's "Edit Description". */
  description?: ReactNode;
  /** Leading slot inside the bubble. Figma's "Left Icon". */
  startIcon?: ReactNode;

  size?: TooltipSize;
  /** Figma's "Tail". */
  arrow?: boolean;
  /**
   * Figma's "Dark Mode". A tooltip is inverted against its surface, so this is
   * a per-tooltip choice rather than something the theme decides. On by
   * default, which is the dark bubble on a light page.
   */
  darkMode?: boolean;

  /** Controlled visibility. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Milliseconds before it appears on hover. Focus opens it immediately. */
  delay?: number;
  /** Turns the tooltip off without unmounting the trigger. */
  disabled?: boolean;

  /** Figma's large tooltip carries a close (×) button. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name for the close button. */
  dismissLabel?: string;

  /** Class for the bubble. Use `className` for the wrapper. */
  contentClassName?: string;
}

/**
 * Figma's eight `Type` values, spelled as a side plus an alignment.
 *
 * Left and Right carry no alignment in the design, so the union makes that
 * unrepresentable instead of accepting an `align` that does nothing — which is
 * what the previous flat prop pair did for six of the twelve combinations it
 * appeared to offer.
 */
export type TooltipPlacement =
  | { side?: 'top' | 'bottom'; align?: TooltipAlign }
  | { side: 'start' | 'end'; align?: never };

export type TooltipProps = TooltipBaseProps & TooltipPlacement;
