import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { BannerVariantProps } from './banner.styles';

export type BannerStatus = NonNullable<BannerVariantProps['status']>;
export type BannerAppearance = NonNullable<BannerVariantProps['appearance']>;

export interface BannerAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface BannerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title' | 'children'
> {
  status?: BannerStatus;
  /** Named `appearance`, not `style`, so React's own `style` prop stays usable. */
  appearance?: BannerAppearance;

  title: ReactNode;
  /** Shown after the title, separated by a `∙`. */
  description?: ReactNode;

  /** `true` uses the default glyph for `status`; a node overrides it; `false` hides it. */
  icon?: boolean | ReactNode;

  /** Single inline link, per the Figma spec. */
  action?: BannerAction;

  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name for the close button. Required by `dismissible`. */
  dismissLabel?: string;

  /**
   * Pins the banner to the top of the viewport. A page-level banner usually
   * wants this; one rendered inside a card does not.
   */
  sticky?: boolean;

  /**
   * How assistive tech announces the banner. Defaults to `'polite'` — unlike
   * Alert, a banner is almost always present on first paint rather than
   * appearing in response to an action, so interrupting is wrong.
   * Use `'assertive'` only when the banner appears mid-session.
   */
  urgency?: 'assertive' | 'polite' | 'off';
}
