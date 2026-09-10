import { Children, forwardRef, isValidElement, type ReactNode } from 'react';
import { RiArrowRightSLine, RiMoreLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { Icon } from '../icon';
import {
  breadcrumbVariants,
  breadcrumbItemVariants,
  breadcrumbSeparatorVariants,
} from './breadcrumb.styles';
import type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbDivider,
} from './breadcrumb.types';

/**
 * One crumb. Renders an `<a>` normally and a `<span>` for the current page —
 * a link to the page you are already on is a dead end for keyboard and screen
 * reader users alike, which is why `current` also drops `href`.
 */
export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { children, icon, current = false, asChild = false, className, ...rest },
    ref,
  ) {
    const content = (
      <>
        {icon}
        {children != null && children !== false && (
          <span data-slot="label">{children}</span>
        )}
      </>
    );

    const classes = cn(
      breadcrumbItemVariants({ current, interactive: !current }),
      className,
    );

    if (current) {
      return (
        <span ref={ref as never} aria-current="page" className={classes}>
          {content}
        </span>
      );
    }

    const Component = asChild ? Slot : 'a';
    return (
      <Component ref={ref as never} className={classes} {...rest}>
        {content}
      </Component>
    );
  },
);

const DIVIDER_GLYPH: Record<BreadcrumbDivider, ReactNode> = {
  arrow: <Icon icon={RiArrowRightSLine} size={20} />,
  slash: '/',
  dot: '•',
};

/**
 * Path indicator.
 *
 * ## RTL
 *
 * The arrow divider carries `rtl:-scale-x-100`, because a chevron points along
 * the reading direction — in Persian the trail runs right to left and an
 * unmirrored chevron sends the eye backwards. `slash` and `dot` are
 * direction-neutral and stay as they are.
 *
 * ## Semantics
 *
 * A `<nav>` wrapping an ordered list, because the order carries meaning.
 * Separators live in `aria-hidden` list items so they are seen and not heard.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(
    {
      children,
      divider = 'arrow',
      separator,
      maxItems,
      itemsAfterCollapse = 1,
      label = 'Breadcrumb',
      className,
      ...rest
    },
    ref,
  ) {
    const items = Children.toArray(children).filter(isValidElement);

    const collapsed =
      typeof maxItems === 'number' && items.length > maxItems
        ? [
            items[0],
            <span
              key="ellipsis"
              className="inline-flex items-center text-soft-400"
              // Not a button: expanding on click needs state the caller owns.
              // Pass a shorter trail instead when you want it interactive.
              aria-label="…"
            >
              <Icon icon={RiMoreLine} size={20} />
            </span>,
            ...items.slice(items.length - itemsAfterCollapse),
          ]
        : items;

    const glyph = separator ?? DIVIDER_GLYPH[divider];

    return (
      <nav ref={ref} aria-label={label} className={className} {...rest}>
        <ol className={breadcrumbVariants()}>
          {collapsed.map((item, index) => (
            <li key={index} className="inline-flex items-center gap-1.5">
              {item}
              {index < collapsed.length - 1 && (
                <span
                  aria-hidden
                  data-slot="separator"
                  className={breadcrumbSeparatorVariants({ divider })}
                >
                  {glyph}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);
