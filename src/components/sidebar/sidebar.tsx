import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import {
  RiArrowRightSLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useControllableState } from '../../hooks/use-controllable-state';
import { Icon } from '../icon';
import {
  sidebarVariants,
  sidebarHeaderVariants,
  sidebarIconButtonVariants,
  sidebarGroupLabelVariants,
  sidebarItemVariants,
  sidebarItemLabelVariants,
  sidebarItemTrailingVariants,
  sidebarFooterVariants,
} from './sidebar.styles';
import type {
  SidebarIconButtonProps,
  SidebarProps,
  SidebarHeaderProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarFooterProps,
  SidebarUserProps,
} from './sidebar.types';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (next: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * `collapsed` travels by context, not by prop drilling.
 *
 * Every row, caption and label needs it, and a sidebar is assembled by the
 * app rather than from an `items={[…]}` array — so passing it down by hand
 * would mean the one row somebody forgets is the one that never collapses.
 *
 * The setter rides along too, so `SidebarTrigger` can sit anywhere inside the
 * panel without the app wiring up state it does not otherwise need. Pass
 * `collapsed` to control it from outside; leave it off and the sidebar keeps
 * its own.
 */
const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
export const useSidebarCollapsed = () => useContext(SidebarContext).collapsed;

/**
 * The application sidebar — Figma "Sidebar Navigation [1.0]".
 *
 * Expanded and collapsed are one component with a boolean, not two layouts.
 * The rail is the same panel with its labels faded to zero width, so a row
 * added to one is a row added to both.
 *
 * ## The animation
 *
 * Only `width` animates on the panel, and only `opacity`/`width` on the
 * labels — never `display`. An element that is removed mid-transition takes
 * its box with it, and the row collapses before the panel has finished
 * moving, which reads as a flicker rather than as a fold. Everything here is
 * behind `motion-reduce:transition-none`.
 *
 * ## Accessibility
 *
 * A `<nav>` with an accessible name, because a page normally has more than
 * one. The collapse control is a `<button>` with `aria-expanded`, and the
 * labels stay in the DOM while collapsed — a rail of unlabelled icons is
 * exactly the layout that needs its accessible names most, and they are what
 * `title` and the screen reader both read.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    label,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [collapsed, setCollapsed] = useControllableState({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  const context = useMemo(
    () => ({ collapsed, setCollapsed }),
    [collapsed, setCollapsed],
  );

  return (
    <SidebarContext.Provider value={context}>
      <nav
        ref={ref}
        aria-label={label}
        data-collapsed={collapsed || undefined}
        className={cn(sidebarVariants({ collapsed }), className)}
        {...rest}
      >
        {children}
      </nav>
    </SidebarContext.Provider>
  );
});

/**
 * A square control in the header — the workspace switcher, the collapse
 * toggle, anything 32×32.
 *
 * It exists because `CompactButton`'s largest step is a 24px box around a 20px
 * glyph, which leaves almost no frame and reads as an icon with a box drawn
 * round it rather than as a button. Figma's header controls are 32px.
 */
export const SidebarIconButton = forwardRef<
  HTMLButtonElement,
  SidebarIconButtonProps
>(function SidebarIconButton({ className, children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(sidebarIconButtonVariants(), className)}
      {...rest}
    >
      {children}
    </button>
  );
});

/**
 * The collapse toggle.
 *
 * Part of the component rather than something every app rebuilds: the panel
 * already owns the state, and a trigger that has to be wired up by hand is a
 * trigger half the call sites never add — which is why the sidebar looked like
 * it could not be collapsed at all.
 *
 * `aria-expanded` and a name that changes with the state, because an icon that
 * flips is invisible to a screen reader.
 */
export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  Omit<SidebarIconButtonProps, 'children'> & {
    /** Accessible name while the panel is open. */
    collapseLabel?: string;
    /** Accessible name while it is a rail. */
    expandLabel?: string;
  }
>(function SidebarTrigger(
  {
    collapseLabel = 'Collapse sidebar',
    expandLabel = 'Expand sidebar',
    onClick,
    ...rest
  },
  ref,
) {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <SidebarIconButton
      ref={ref}
      aria-expanded={!collapsed}
      aria-label={collapsed ? expandLabel : collapseLabel}
      title={collapsed ? expandLabel : collapseLabel}
      onClick={(event) => {
        onClick?.(event);
        setCollapsed((value) => !value);
      }}
      {...rest}
    >
      <Icon icon={collapsed ? RiMenuUnfoldLine : RiMenuFoldLine} mirrored />
    </SidebarIconButton>
  );
});

/** Logo, workspace name, and the switcher control Figma draws beside them. */
export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  function SidebarHeader(
    { logo, title, subtitle, action, collapsedAction, className, ...rest },
    ref,
  ) {
    const { collapsed } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(sidebarHeaderVariants({ collapsed }), className)}
        {...rest}
      >
        {collapsed ? (
          (collapsedAction ?? logo)
        ) : (
          <>
            {logo}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[16px] leading-6 font-medium text-strong-950">
                {title}
              </span>
              {subtitle != null && (
                <span className="truncate text-[14px] leading-5 text-sub-600">
                  {subtitle}
                </span>
              )}
            </span>
            {action}
          </>
        )}
      </div>
    );
  },
);

/**
 * A captioned block of rows — Figma's "MAIN" and "FAVS".
 *
 * The caption is a real heading for the list rather than a styled `<div>`, so
 * a screen reader can jump between the groups instead of hearing one run of
 * twelve links.
 */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ label, className, children, ...rest }, ref) {
    const { collapsed } = useSidebar();
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn('flex flex-col gap-1 px-3 py-2', className)}
        {...rest}
      >
        {label != null && (
          <span aria-hidden className={sidebarGroupLabelVariants({ collapsed })}>
            {/* On the rail the caption becomes a divider rule: the word does
                not fit, but the grouping it expresses still has to read. */}
            {collapsed ? (
              <span className="h-px w-6 bg-soft-200" />
            ) : (
              label
            )}
          </span>
        )}
        {children}
      </div>
    );
  },
);

/**
 * One navigation row.
 *
 * Renders an `<a>` when given an `href` and a `<button>` otherwise, so the
 * same component works in a router-driven app and in a Storybook page without
 * leaving dead links behind.
 */
export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  function SidebarItem(
    {
      icon,
      active = false,
      href,
      shortcut,
      trailing,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { collapsed } = useSidebar();
    const Component = (href ? 'a' : 'button') as 'a';

    /* The visible label doubles as the accessible name on the rail, where it
       is the only thing distinguishing twelve identical-sized icons. */
    const name = typeof children === 'string' ? children : undefined;

    return (
      <Component
        ref={ref as never}
        href={href}
        type={href ? undefined : 'button'}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        aria-label={collapsed ? name : undefined}
        title={collapsed ? name : undefined}
        className={cn(sidebarItemVariants({ active, collapsed }), className)}
        {...rest}
      >
        {icon && (
          <span data-slot="icon" className="flex">
            {icon}
          </span>
        )}
        <span className={sidebarItemLabelVariants({ collapsed })}>
          {children}
        </span>
        <span className={sidebarItemTrailingVariants({ collapsed })}>
          {shortcut != null ? (
            <kbd className="rounded-md border border-soft-200 bg-weak-50 px-1.5 py-0.5 text-[11px] leading-4 font-medium text-sub-600">
              {shortcut}
            </kbd>
          ) : (
            (trailing ?? <Icon icon={RiArrowRightSLine} mirrored />)
          )}
        </span>
      </Component>
    );
  },
);

/**
 * The coloured dot Figma uses instead of an icon in the FAVS group. It is the
 * only thing left of the row on the rail, so it keeps its size there.
 */
export function SidebarDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn(sidebarFooterVariants(), className)} {...rest}>
        {children}
      </div>
    );
  },
);

/** The account row at the bottom: avatar, name, email, chevron. */
export const SidebarUser = forwardRef<HTMLButtonElement, SidebarUserProps>(
  function SidebarUser(
    { avatar, name, email, badge, className, ...rest },
    ref,
  ) {
    const { collapsed } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={collapsed ? name : undefined}
        title={collapsed ? name : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg p-2 text-start outline-hidden',
          'transition-colors duration-200 ease-out motion-reduce:transition-none',
          'hovered:bg-weak-50 focused:shadow-focus-neutral',
          collapsed && 'justify-center px-0',
          className,
        )}
        {...rest}
      >
        {avatar}
        {!collapsed && (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-1">
                <span className="truncate text-[14px] leading-5 font-medium text-strong-950">
                  {name}
                </span>
                {badge}
              </span>
              {email != null && (
                <span className="truncate text-[12px] leading-4 text-sub-600">
                  {email}
                </span>
              )}
            </span>
            <Icon icon={RiArrowRightSLine} mirrored className="text-soft-400" />
          </>
        )}
      </button>
    );
  },
);

/** A promo or reminder card pinned above the account row. */
export function SidebarCard({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { children: ReactNode }) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <div
      className={cn(
        'mx-3 mb-3 flex flex-col gap-2 rounded-xl border border-soft-200 p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
