import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type BreadcrumbDivider = 'arrow' | 'slash' | 'dot';

export interface BreadcrumbItemProps extends Omit<
  ComponentPropsWithoutRef<'a'>,
  'children'
> {
  children?: ReactNode;
  /** Leading icon. Omit for a text-only crumb; pass `children` for icon-only. */
  icon?: ReactNode;
  /** Marks the current page: renders as text, not a link, plus aria-current. */
  current?: boolean;
  /** Render the child element instead of an `<a>` — for router links. */
  asChild?: boolean;
}

export interface BreadcrumbProps extends Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children'
> {
  children: ReactNode;
  divider?: BreadcrumbDivider;
  /** Replaces the divider entirely. */
  separator?: ReactNode;
  /**
   * Collapse the middle of long trails into an ellipsis, keeping the first
   * crumb and the last `itemsAfterCollapse`. A five-level path on a phone
   * either wraps or scrolls; neither is good.
   */
  maxItems?: number;
  itemsAfterCollapse?: number;
  /** Accessible name for the landmark, e.g. `'Breadcrumb'`. */
  label?: string;
}
