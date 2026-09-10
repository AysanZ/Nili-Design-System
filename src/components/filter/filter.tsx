import { RiArrowRightSLine } from '@remixicon/react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { RiCloseLine, RiAddLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import {
  filterBarVariants,
  filterChipVariants,
  filterListVariants,
  filterListItemVariants,
} from './filter.styles';

export interface FilterBarProps extends ComponentPropsWithoutRef<'div'> {
  surface?: 'plain' | 'panel';
  /** Accessible name for the group, e.g. "Table filters". */
  label?: string;
}

/**
 * Row of filter controls.
 *
 * `role="group"` with a name, so a screen-reader user hears "Table filters,
 * group" instead of a bare run of buttons. Figma's Calendar and Table "Types"
 * describe the surface being filtered, not a visual difference — both are this
 * component with different children.
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  function FilterBar(
    { surface = 'plain', label, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn(filterBarVariants({ surface }), className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface FilterChipProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'value'
> {
  /** A value is set. Renders `aria-pressed` so the state is announced. */
  active?: boolean;
  /** Dashed outline — an empty "add filter" affordance. */
  placeholder?: boolean;
  startIcon?: ReactNode;
  /** The chosen value, shown after the label. */
  value?: ReactNode;
  /** Shows a clear button. Requires `clearLabel`. */
  onClear?: () => void;
  clearLabel?: string;
}

/**
 * One filter control.
 *
 * The clear affordance is a **sibling** button, not a nested one: a `<button>`
 * inside a `<button>` is invalid HTML, and browsers resolve it by dropping the
 * inner one — so the clear target silently stops working.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip(
    {
      active = false,
      placeholder = false,
      startIcon,
      value,
      onClear,
      clearLabel = 'Clear',
      className,
      children,
      type,
      ...rest
    },
    ref,
  ) {
    const chip = (
      <button
        ref={ref}
        type={type ?? 'button'}
        aria-pressed={active}
        className={cn(
          filterChipVariants({ active, placeholder }),
          onClear && active && 'rounded-e-none border-e-0',
          className,
        )}
        {...rest}
      >
        {startIcon ?? (placeholder ? <Icon icon={RiAddLine} /> : null)}
        <span>{children}</span>
        {value != null && (
          <>
            <span aria-hidden className="text-soft-400">
              ·
            </span>
            <span className="font-medium text-strong-950">{value}</span>
          </>
        )}
      </button>
    );

    if (!onClear || !active) return chip;

    return (
      <span className="inline-flex">
        {chip}
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={cn(
            filterChipVariants({ active }),
            'rounded-s-none border-s border-s-primary-base px-1.5',
          )}
        >
          <Icon icon={RiCloseLine} />
        </button>
      </span>
    );
  },
);

export interface FilterListProps extends ComponentPropsWithoutRef<'div'> {
  label?: string;
}

/** Vertical filter column — Figma's Vertical Filter Items. */
export const FilterList = forwardRef<HTMLDivElement, FilterListProps>(
  function FilterList({ label, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn(filterListVariants(), className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface FilterListItemProps extends ComponentPropsWithoutRef<'button'> {
  active?: boolean;
  startIcon?: ReactNode;
  /** Count chip at the trailing edge — pass a `<Badge>` or plain text. */
  count?: ReactNode;
}

export const FilterListItem = forwardRef<
  HTMLButtonElement,
  FilterListItemProps
>(function FilterListItem(
  { active = false, startIcon, count, className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-pressed={active}
      className={cn(filterListItemVariants({ active }), className)}
      {...rest}
    >
      {startIcon && (
        <span data-slot="start-icon" className="flex shrink-0">
          {startIcon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {count != null && (
        <span className="shrink-0 text-[12px] leading-4 text-soft-400">
          {count}
        </span>
      )}
      {/* Figma: the active item ends with a chevron. */}
      {active && (
        <RiArrowRightSLine
          size={20}
          aria-hidden
          className="shrink-0 text-soft-400 rtl:-scale-x-100"
        />
      )}
    </button>
  );
});
