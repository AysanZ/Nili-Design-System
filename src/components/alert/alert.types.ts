import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { AlertVariantProps } from './alert.styles';

export type AlertStatus = NonNullable<AlertVariantProps['status']>;
export type AlertAppearance = NonNullable<AlertVariantProps['appearance']>;
export type AlertSize = NonNullable<AlertVariantProps['size']>;

export interface AlertAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface AlertProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title' | 'children'
> {
  status?: AlertStatus;
  /** Renamed from `style`, which shadowed React's `style` (`CSSProperties`). */
  appearance?: AlertAppearance;
  size?: AlertSize;

  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;

  /**
   * `true` shows the default glyph for `status`; pass a node to override it;
   * `false` hides it. The default glyph is decorative — the alert's meaning
   * is carried by `role`, not by the picture.
   */
  icon?: boolean | ReactNode;

  /** Up to two inline actions. Replaces the unused `linkButton`/`doubleLink`. */
  actions?: AlertAction[];

  /** Shows a close button. Requires `dismissLabel` for the accessible name. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name for the close button, e.g. `'Close'`. */
  dismissLabel?: string;

  /**
   * How assistive tech announces this alert.
   * - `'assertive'` (default for `error`) interrupts the user immediately.
   * - `'polite'` waits for a pause — right for success and info.
   * - `'off'` for alerts rendered statically on page load, which should not
   *   be announced at all.
   */
  urgency?: 'assertive' | 'polite' | 'off';
}
