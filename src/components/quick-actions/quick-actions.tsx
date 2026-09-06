import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { useId } from '../../hooks/use-id';
import {
  quickActionsVariants,
  quickActionItemVariants,
  quickActionIconVariants,
  quickActionLabelVariants,
  quickActionDescriptionVariants,
  quickActionShortcutVariants,
} from './quick-actions.styles';
import type {
  QuickActionsProps,
  QuickActionItemProps,
} from './quick-actions.types';

/**
 * A group of shortcuts — the row of "New invoice / Invite member / Upload"
 * tiles that sits on a dashboard or at the top of an empty state.
 *
 * ## Why a group and not a list
 *
 * `role="group"` with a name, rather than `<ul>`: these are commands, not
 * content. A screen-reader user hears "Quick actions, group" and then the
 * buttons, instead of "list, 6 items" — which implies something to read
 * through rather than something to do.
 *
 * ## RTL
 *
 * Grid and flex both follow the ambient direction, and the item's padding and
 * gaps are logical, so the icon sits on the right in Persian with no direction
 * read. `layout="row"` scrolls rather than wraps, and scrolling starts at the
 * inline start — the right — for free.
 */
export const QuickActions = forwardRef<HTMLDivElement, QuickActionsProps>(
  function QuickActions(
    {
      layout = 'grid',
      size = 'md',
      columns = 2,
      label,
      title,
      action,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const titleId = useId();
    const hasHeader = title != null || action != null;

    // Without a header the group *is* the root, so the ref, className and the
    // rest of the props land on it. With one, the root is the column that holds
    // the heading and the group sits inside it.
    const group = (
      <div
        ref={hasHeader ? undefined : ref}
        role="group"
        aria-label={title == null ? label : undefined}
        aria-labelledby={title != null ? titleId : undefined}
        className={cn(
          quickActionsVariants({ layout, size }),
          !hasHeader && className,
        )}
        style={
          layout === 'grid'
            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
            : undefined
        }
        {...(hasHeader ? {} : rest)}
      >
        {children}
      </div>
    );

    if (!hasHeader) return group;

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col gap-3', className)}
        {...rest}
      >
        <div className="flex items-center justify-between gap-2">
          {title != null && (
            <span
              id={titleId}
              className="text-[14px] font-medium leading-5 text-strong-950"
            >
              {title}
            </span>
          )}
          {action}
        </div>
        {group}
      </div>
    );
  },
);

/**
 * One shortcut.
 *
 * A `<button>` by default and an `<a>` through `asChild` — the distinction is
 * not cosmetic: "create an invoice" is an action and belongs on a button,
 * while "go to billing" is navigation and has to be a link so it can be
 * middle-clicked, copied and opened in a new tab.
 *
 * The icon is decorative here. It sits beside the label, so announcing it only
 * duplicates the output; when there is no label, name the button itself with
 * `aria-label`.
 */
export const QuickActionItem = forwardRef<HTMLElement, QuickActionItemProps>(
  function QuickActionItem(
    {
      children,
      appearance = 'card',
      layout = 'horizontal',
      size = 'md',
      tone = 'neutral',
      icon,
      iconWrapper = true,
      sublabel,
      description,
      badge,
      shortcut,
      endAdornment,
      active = false,
      asChild = false,
      className,
      type,
      ...rest
    },
    ref,
  ) {
    const classes = cn(
      quickActionItemVariants({ appearance, layout, size, active }),
      className,
    );

    const content = (
      <>
        {icon != null &&
          (iconWrapper ? (
            <span
              aria-hidden
              className={quickActionIconVariants({ tone, size })}
            >
              {icon}
            </span>
          ) : (
            <span aria-hidden className="shrink-0 text-sub-600 [&_svg]:size-5">
              {icon}
            </span>
          ))}

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          {(children != null || badge != null || sublabel != null) && (
            <span className="flex min-w-0 items-center gap-1.5">
              {children != null && (
                <span className={quickActionLabelVariants({ size })}>
                  {children}
                </span>
              )}
              {badge != null && <span className="shrink-0">{badge}</span>}
              {sublabel != null && (
                <span className={quickActionDescriptionVariants()}>
                  {sublabel}
                </span>
              )}
            </span>
          )}
          {description != null && (
            <span className={quickActionDescriptionVariants()}>
              {description}
            </span>
          )}
        </span>

        {shortcut != null && (
          <span aria-hidden className={quickActionShortcutVariants()}>
            {shortcut}
          </span>
        )}
        {endAdornment}
      </>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-pressed={active || undefined}
          className={classes}
          {...rest}
        >
          {content}
        </Slot>
      );
    }

    return (
      <button
        ref={ref as never}
        type={type ?? 'button'}
        aria-pressed={active || undefined}
        className={classes}
        {...rest}
      >
        {content}
      </button>
    );
  },
);
