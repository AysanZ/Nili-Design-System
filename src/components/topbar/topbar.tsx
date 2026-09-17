import { forwardRef } from 'react';
import { RiArrowDownSLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import {
  topbarVariants,
  topbarListVariants,
  topbarItemVariants,
  topbarUserVariants,
} from './topbar.styles';
import type {
  TopbarProps,
  TopbarItemProps,
  TopbarUserProps,
} from './topbar.types';

/**
 * The application top bar — Figma "Topbar Navigation [1.0]".
 *
 * A `<header>` wrapping a named `<nav>`, rather than one element doing both.
 * The bar holds things that are not navigation — search, notifications, the
 * account menu — and putting those inside the navigation landmark makes a
 * screen reader read them out as part of the site's menu every time.
 *
 * Figma's two rows (text-only items and items with icons) are not a variant:
 * an item draws an icon when it is given one.
 */
export const Topbar = forwardRef<HTMLElement, TopbarProps>(function Topbar(
  { label, logo, actions, className, children, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(topbarVariants(), className)}
      {...rest}
    >
      {logo}
      <nav aria-label={label} className="min-w-0 flex-1">
        {/* A list, so a screen reader announces how many items there are
            before reading them. The markers are off; the semantics are not. */}
        <ul className={topbarListVariants()}>
          {Array.isArray(children)
            ? children.map((child, index) => <li key={index}>{child}</li>)
            : <li>{children}</li>}
        </ul>
      </nav>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
});

/**
 * One item in the bar.
 *
 * Renders an `<a>` with an `href` and a `<button>` without one, so a menu
 * trigger and a page link are the same component rather than a link that goes
 * nowhere.
 */
export const TopbarItem = forwardRef<HTMLElement, TopbarItemProps>(
  function TopbarItem(
    {
      icon,
      active = false,
      href,
      menu = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const Component = (href ? 'a' : 'button') as 'a';
    return (
      <Component
        ref={ref as never}
        href={href}
        type={href ? undefined : 'button'}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        aria-haspopup={menu ? 'menu' : undefined}
        className={cn(topbarItemVariants({ active }), className)}
        {...rest}
      >
        {icon}
        <span className="truncate">{children}</span>
        {menu && (
          <Icon icon={RiArrowDownSLine} className="text-soft-400" />
        )}
      </Component>
    );
  },
);

/** The account chip. A `<button>`, because it opens a menu. */
export const TopbarUser = forwardRef<HTMLButtonElement, TopbarUserProps>(
  function TopbarUser({ avatar, name, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="menu"
        className={cn(topbarUserVariants(), className)}
        {...rest}
      >
        {avatar}
        <span className="truncate">{name}</span>
        <Icon icon={RiArrowDownSLine} className="text-soft-400" />
      </button>
    );
  },
);
