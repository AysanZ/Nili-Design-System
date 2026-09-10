import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { RiAttachment2 } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import {
  activityFeedVariants,
  activityFeedHeaderVariants,
  activityFeedTabsVariants,
  activityFeedTabVariants,
  activityFeedTabIndicatorVariants,
  activityFeedCountVariants,
  activityFeedItemVariants,
  activityFeedChipVariants,
  activityFeedFooterVariants,
  activityFeedKeyVariants,
} from './activity-feed.styles';
import type {
  ActivityFeedProps,
  ActivityFeedItemProps,
  ActivityFeedTabProps,
} from './activity-feed.types';

/**
 * Container for a chronological list of events — Figma Activity Feed:
 * Header, Tab Menu, Items and Footer in one card.
 *
 * The list is a `<ul>` inside a labelled `<section>`, so screen-reader users
 * get "list, 8 items" instead of an undifferentiated wall of text.
 */
export const ActivityFeed = forwardRef<HTMLElement, ActivityFeedProps>(
  function ActivityFeed(
    {
      title,
      headerAction,
      tabs,
      tabsAction,
      footer,
      label,
      className,
      children,
      ...rest
    },
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
          <ActivityFeedHeader action={headerAction}>{title}</ActivityFeedHeader>
        )}

        {(tabs || tabsAction) && (
          <ActivityFeedTabs action={tabsAction}>{tabs}</ActivityFeedTabs>
        )}

        <ul className="flex flex-col p-2">{children}</ul>

        {footer}
      </section>
    );
  },
);

/** Figma Activity Feed Header — usable on its own. */
export function ActivityFeedHeader({
  children,
  action,
  className,
  ...rest
}: ComponentPropsWithoutRef<'header'> & { action?: ReactNode }) {
  return (
    <header className={cn(activityFeedHeaderVariants(), className)} {...rest}>
      {children && (
        <h2 className="text-[16px] leading-6 font-medium tracking-[-0.011em] text-strong-950">
          {children}
        </h2>
      )}
      {action}
    </header>
  );
}

/** Figma Activity Feed Tab Menu — usable on its own. */
export function ActivityFeedTabs({
  children,
  action,
  className,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { action?: ReactNode }) {
  return (
    <div className={cn(activityFeedTabsVariants(), className)} {...rest}>
      <div
        role="tablist"
        className="flex h-full min-w-0 flex-1 items-center gap-5"
      >
        {children}
      </div>
      {action && <span className="flex shrink-0 items-center">{action}</span>}
    </div>
  );
}

export const ActivityFeedTab = forwardRef<
  HTMLButtonElement,
  ActivityFeedTabProps
>(function ActivityFeedTab(
  { selected = false, count, badge, className, children, type, ...rest },
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
      <span className="relative flex h-full items-center">
        {children}
        {selected && (
          <span aria-hidden className={activityFeedTabIndicatorVariants()} />
        )}
      </span>
      {count != null && (
        <span className={activityFeedCountVariants()}>{count}</span>
      )}
      {badge}
    </button>
  );
});

/** The 20px vertical rule Figma draws before "Archived". */
export function ActivityFeedTabSeparator({
  className,
  ...rest
}: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className={cn('h-5 w-px shrink-0 bg-soft-200', className)}
      {...rest}
    />
  );
}

/**
 * One event — Figma Activity Feed Items.
 *
 * Figma's four Types are content shapes, not four components: `basic` is
 * text, `button` adds actions, `file` adds an attachment chip, `message`
 * adds boxed text.
 */
export const ActivityFeedItem = forwardRef<
  HTMLLIElement,
  ActivityFeedItemProps
>(function ActivityFeedItem(
  {
    type = 'basic',
    avatar,
    title,
    timestamp,
    subject,
    subjectIcon,
    badge,
    description,
    actions,
    file,
    message,
    menu,
    unread = false,
    onSelect,
    className,
    children,
    ...rest
  },
  ref,
) {
  const hasMeta = timestamp != null || subject != null;

  const body =
    type === 'button' && actions ? (
      <div className="relative z-10 flex flex-wrap items-center gap-2.5">
        {actions}
      </div>
    ) : type === 'file' && file ? (
      <FileChip file={file} />
    ) : type === 'message' && message ? (
      <blockquote className={activityFeedChipVariants({ kind: 'message' })}>
        {message}
      </blockquote>
    ) : description ? (
      <p className="text-[14px] leading-5 tracking-[-0.006em] text-sub-600">
        {description}
      </p>
    ) : null;

  return (
    <li
      ref={ref}
      data-type={type}
      data-unread={unread || undefined}
      className={cn(activityFeedItemVariants({ unread }), className)}
      {...rest}
    >
      <div className="flex items-start gap-4">
        {avatar && <span className="flex shrink-0">{avatar}</span>}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-2">
            {onSelect ? (
              // Stretched over the whole card: one real button, and the
              // actions/menu stay separate (z-10) instead of being nested
              // inside it, which would be invalid HTML.
              <button
                type="button"
                onClick={onSelect}
                className="truncate text-start text-[14px] leading-5 font-medium tracking-[-0.006em] text-strong-950 outline-hidden after:absolute after:inset-0 after:rounded-[inherit]"
              >
                {title}
              </button>
            ) : (
              <span className="truncate text-[14px] leading-5 font-medium tracking-[-0.006em] text-strong-950">
                {title}
              </span>
            )}
            {badge && <span className="shrink-0">{badge}</span>}
          </div>

          {hasMeta && (
            <div className="flex min-w-0 items-center gap-1.5 text-[12px] leading-4 text-sub-600">
              {timestamp != null && (
                <time className="shrink-0">{timestamp}</time>
              )}
              {timestamp != null && subject != null && (
                <span aria-hidden className="text-soft-400">
                  ·
                </span>
              )}
              {subject != null && (
                <span className="flex min-w-0 items-center gap-1.5">
                  {subjectIcon && (
                    <span className="flex size-4 shrink-0 [&_svg]:size-4">
                      {subjectIcon}
                    </span>
                  )}
                  <span className="truncate">{subject}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {menu && (
          <span
            data-slot="activity-menu"
            className="relative z-10 flex shrink-0 opacity-0 transition-opacity duration-200 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
          >
            {menu}
          </span>
        )}
      </div>

      {(body || children) && (
        <div
          className={cn(
            'mt-4 flex flex-col items-start gap-2',
            avatar && 'ps-14',
          )}
        >
          {body}
          {children}
        </div>
      )}
    </li>
  );
});

function FileChip({
  file,
}: {
  file: NonNullable<ActivityFeedItemProps['file']>;
}) {
  const content = (
    <>
      {file.icon ?? (
        <Icon icon={RiAttachment2} size={20} className="text-sub-600" />
      )}
      <span className="truncate">{file.name}</span>
      {file.size && (
        <span className="shrink-0 text-soft-400">({file.size})</span>
      )}
    </>
  );
  const classes = activityFeedChipVariants({ kind: 'file' });
  return file.href ? (
    <a
      href={file.href}
      className={cn(
        classes,
        'relative z-10 outline-hidden hovered:bg-weak-50 focus-visible:shadow-focus-neutral',
      )}
    >
      {content}
    </a>
  ) : (
    <span className={classes}>{content}</span>
  );
}

/**
 * Figma Activity Feed Footer: a 12px hint on the start side and an action
 * (usually a small gray Link Button) on the end.
 */
export function ActivityFeedFooter({
  hint,
  action,
  className,
  ...rest
}: Omit<ComponentPropsWithoutRef<'footer'>, 'children'> & {
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <footer className={cn(activityFeedFooterVariants(), className)} {...rest}>
      <span className="flex min-w-0 items-center gap-2">{hint}</span>
      {action}
    </footer>
  );
}

/** A keyboard key cap for the footer hint, e.g. `<ActivityFeedKey>↑</ActivityFeedKey>`. */
export function ActivityFeedKey({
  className,
  ...rest
}: ComponentPropsWithoutRef<'kbd'>) {
  return <kbd className={cn(activityFeedKeyVariants(), className)} {...rest} />;
}
