import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface TopbarProps extends ComponentPropsWithoutRef<'header'> {
  /** Accessible name for the navigation landmark inside the bar. */
  label?: string;
  /** The brand mark on the leading edge. */
  logo?: ReactNode;
  /** Controls pinned to the trailing edge — search, notifications, account. */
  actions?: ReactNode;
}

export interface TopbarItemProps extends Omit<
  ComponentPropsWithoutRef<'a'>,
  'color'
> {
  icon?: ReactNode;
  /** The current page. */
  active?: boolean;
  /** Makes it a link; without it the item renders as a `<button>`. */
  href?: string;
  /** Adds a chevron — the "Others ▾" item that opens a menu. */
  menu?: boolean;
  disabled?: boolean;
}

export interface TopbarUserProps extends ComponentPropsWithoutRef<'button'> {
  avatar?: ReactNode;
  name: string;
}
