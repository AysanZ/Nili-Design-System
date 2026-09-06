import { forwardRef } from 'react';
import { RiFile3Line } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import {
  activityFeedVariants,
  activityFeedHeaderVariants,
  activityFeedTabsVariants,
  activityFeedTabVariants,
  activityFeedItemVariants,
  activityFeedAttachmentVariants,
} from './activity-feed.styles';
import type {
  ActivityFeedProps,
  ActivityFeedItemProps,
  ActivityFeedTabProps,
} from './activity-feed.types';

/**
 * Container for a chronological list of events.
 *
 * The list is a `<ul>` inside a labelled `<section>`, so screen-reader users
 * get "list, 8 items" instead of an undifferentiated wall of text.
 */
export const ActivityFeed = forwardRef<HTMLElement, ActivityFeedProps>(
  function ActivityFeed(
    { title, headerAction, tabs, label, className, children, ...rest },
    ref,
  ) {
    return (
      <section
        ref={ref}
        aria-label={label}
        className={cn(activityFeedVariants(), className)}
        {...rest}
      >
        {(title || headerAction) && (
          <header className={activityFeedHeaderVariants()}>
            {title && (
              <h2 className="text-[16px] font-medium leading-6 text-strong-950">
                {title}
              </h2>
            )}
            {headerAction}
          </header>
        )}

        {tabs && (
          <div role="tablist" className={activityFeedTabsVariants()}>
            {tabs}
          </div>
        )}

        <ul className="flex flex-col divide-y divide-soft-200">{children}</ul>
      </section>
    );
  },
);

export const ActivityFeedTab = forwardRef<
  HTMLButtonElement,
  ActivityFeedTabProps
>(function ActivityFeedTab(
  { selected = false, badge, className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      role="tab"
      aria-selected={selected}
      className={cn(activityFeedTabVariants({ selected }), className)}
      {...rest}
    >
      {children}
      {badge}
    </button>
  );
});

/**
 * One event.
 *
 * Figma's four Types are content shapes, not four components: `basic` is text,
 * `button` adds actions, `file` adds an attachment card, `message` adds a
 * quoted body. Splitting them into separate components would duplicate the
 * avatar, timestamp and unread handling four times.
 *
 * When `onSelect` is passed the row becomes a real `<button>`, so it is
 * reachable by keyboard — a clickable `<li>` is not.
 */
export const ActivityFeedItem = forwardRef<
  HTMLLIElement,
  ActivityFeedItemProps
>(function ActivityFeedItem(
  {
    type = 'basic',
    avatar,
    title,
    badge,
    description,
    timestamp,
    unread = false,
    actions,
    file,
    message,
    children,
    onSelect,
    className,
    ...rest
  },
  ref,
) {
  const body = (
    <>
      {avatar && <span className="shrink-0">{avatar}</span>}

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-start justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <span className="text-[14px] font-medium leading-5 text-strong-950">
              {title}
            </span>
            {badge && <span className="shrink-0">{badge}</span>}
          </span>
          {timestamp && (
            <time className="shrink-0 text-[12px] leading-4 text-soft-400">
              {timestamp}
            </time>
          )}
        </span>

        {description && (
          <span className="text-[14px] leading-5 text-sub-600">
            {description}
          </span>
        )}

        {type === 'message' && message && (
          // A quoted body: `border-s` is logical, so the rule sits on the
          // leading edge in both directions.
          <blockquote className="mt-1 border-s-2 border-soft-200 ps-3 text-[14px] leading-5 text-sub-600">
            {message}
          </blockquote>
        )}

        {type === 'file' && file && (
          <span className={cn(activityFeedAttachmentVariants(), 'mt-1')}>
            {file.icon ?? (
              <Icon icon={RiFile3Line} size={20} className="text-sub-600" />
            )}
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[14px] font-medium leading-5 text-strong-950">
                {file.name}
              </span>
              {file.size && (
                <span className="text-[12px] leading-4 text-soft-400">
                  {file.size}
                </span>
              )}
            </span>
          </span>
        )}

        {type === 'button' && actions && (
          <span className="mt-1 flex items-center gap-2">{actions}</span>
        )}

        {children}
      </span>
    </>
  );

  return (
    <li ref={ref} data-type={type} data-unread={unread || undefined} {...rest}>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            activityFeedItemVariants({ interactive: true, unread }),
            className,
          )}
        >
          {body}
        </button>
      ) : (
        <div className={cn(activityFeedItemVariants({ unread }), className)}>
          {body}
        </div>
      )}
    </li>
  );
});
