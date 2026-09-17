import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { AppStoreBadgeVariantProps } from './app-store-badge.styles';
import type { AppStoreId } from './app-store-badge.data';

export type { AppStoreId };

export interface AppStoreBadgeProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'color'>,
    AppStoreBadgeVariantProps {
  /** Which storefront. `APP_STORE_IDS` is the list. */
  store: AppStoreId;

  /** Makes it a link. Without it the badge renders as a non-interactive span. */
  href?: string;

  /**
   * Accessible name. Defaults to the badge's own sentence, e.g. "Download on
   * the App Store" — which is what the badge says, so overriding it is
   * usually a mistake.
   */
  label?: string;

  /**
   * The store's official badge SVG, which replaces the built-in stand-in
   * drawing entirely. Required before this ships to users: see the note at the
   * top of `app-store-badge.data.ts`.
   */
  artwork?: ReactNode;
}
