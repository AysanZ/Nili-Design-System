import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface SidebarProps extends ComponentPropsWithoutRef<'nav'> {
  /**
   * The rail. One boolean rather than a second component: every row is the
   * same row with its label faded out.
   *
   * Optional, because the panel keeps its own state when you leave it off —
   * a sidebar that cannot collapse without the app writing a `useState` is a
   * sidebar most apps ship uncollapsible.
   */
  collapsed?: boolean;
  /** Starting state while uncontrolled. */
  defaultCollapsed?: boolean;
  /** Fires on every toggle, controlled or not. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Accessible name, e.g. "Main". A page usually has more than one `<nav>`,
   * and "navigation, navigation, navigation" is not a landmark list.
   */
  label?: string;
}

export interface SidebarHeaderProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  /** The workspace mark — a `PlaceholderLogo`, an `Avatar`, an `<img>`. */
  logo?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Figma's workspace switcher, on the trailing edge. Hidden on the rail. */
  action?: ReactNode;
  /**
   * What the header shows instead of the logo once collapsed. Usually a
   * `SidebarTrigger`, so there is a way back out of the rail — otherwise the
   * only control that expands it is the one that just disappeared.
   */
  collapsedAction?: ReactNode;
}

export type SidebarIconButtonProps = ComponentPropsWithoutRef<'button'>;

export interface SidebarGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** Figma's "MAIN" / "FAVS" caption. Becomes a rule on the rail. */
  label?: string;
}

export interface SidebarItemProps extends Omit<
  ComponentPropsWithoutRef<'a'>,
  'color'
> {
  icon?: ReactNode;
  /** The current page. Draws the primary marker in the gutter. */
  active?: boolean;
  /** Makes it a link. Without it the row renders as a `<button>`. */
  href?: string;
  /** Figma's ⌘1 chip on a FAVS row. Replaces the trailing chevron. */
  shortcut?: ReactNode;
  /** Overrides the trailing chevron with anything else — a count, a badge. */
  trailing?: ReactNode;
  disabled?: boolean;
}

export type SidebarFooterProps = ComponentPropsWithoutRef<'div'>;

export interface SidebarUserProps extends ComponentPropsWithoutRef<'button'> {
  avatar?: ReactNode;
  name: string;
  email?: string;
  /** The verified tick beside the name. */
  badge?: ReactNode;
}
