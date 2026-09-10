import { createContext, forwardRef, useContext } from 'react';
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiExpandUpDownLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import { useId } from '../../hooks/use-id';
import {
  tableScrollVariants,
  tableVariants,
  tableHeaderVariants,
  tableHeadVariants,
  tableSortButtonVariants,
  tableRowVariants,
  tableCellVariants,
  tableCaptionVariants,
} from './table.styles';
import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableSize,
} from './table.types';

interface TableContextValue {
  size: TableSize;
  stickyHeader: boolean;
}

const TableContext = createContext<TableContextValue>({
  size: 'xl',
  stickyHeader: false,
});

/**
 * A real `<table>`.
 *
 * ## Why not a grid of divs
 *
 * A table built from `<div role="row">` has to re-declare every relationship
 * the element already encodes: which cell belongs to which column, which
 * header describes it, how many rows there are. Screen readers give a real
 * table a navigation mode — move by cell, hear the column header repeated on
 * every jump — and none of that survives the rewrite. The only thing divs buy
 * is layout freedom, and `display: grid` on a `<table>` buys that too.
 *
 * ## The scroll wrapper is focusable on purpose
 *
 * A wide table scrolls sideways. A `<div>` that scrolls but cannot be focused
 * is unreachable by keyboard — the content is simply gone for anyone not using
 * a mouse. So the wrapper is a `role="region"` with `tabIndex={0}` and a name,
 * which is the documented fix and also what puts it in the landmark list.
 *
 * ## RTL
 *
 * Nothing here reads the direction. Cells are `text-start`, the vertical rules
 * in the bordered variant use `border-e`, and the browser reverses column
 * order under `dir="rtl"` by itself — a table is one of the few places where
 * the platform already does the right thing.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    size = 'xl',
    label,
    caption,
    stickyHeader = false,
    scrollable = true,
    className,
    scrollClassName,
    children,
    ...rest
  },
  ref,
) {
  const captionId = useId();

  const table = (
    <table
      ref={ref}
      aria-label={caption == null ? label : undefined}
      aria-labelledby={caption != null ? captionId : undefined}
      className={cn(tableVariants(), className)}
      {...rest}
    >
      {caption != null && (
        <caption id={captionId} className={tableCaptionVariants()}>
          {caption}
        </caption>
      )}
      <TableContext.Provider value={{ size, stickyHeader }}>
        {children}
      </TableContext.Provider>
    </table>
  );

  if (!scrollable) return table;

  return (
    <div
      // Focusable on purpose, and the one place a non-interactive element
      // should be: a region that scrolls but cannot take focus is unreachable
      // by keyboard, so a wide table's right-hand columns simply do not exist
      // for anyone not using a mouse. `role="region"` + a name is the
      // documented pairing, and it puts the table in the landmark list too.
      role="region"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={label}
      className={cn(
        tableScrollVariants(),
        stickyHeader && 'max-h-[32rem] overflow-y-auto',
        scrollClassName,
      )}
    >
      {table}
    </div>
  );
});

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ className, children, ...rest }, ref) {
  const { stickyHeader } = useContext(TableContext);
  return (
    <thead
      ref={ref}
      className={cn(tableHeaderVariants({ sticky: stickyHeader }), className)}
      {...rest}
    >
      {children}
    </thead>
  );
});

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, children, ...rest }, ref) {
    return (
      <tbody ref={ref} className={className} {...rest}>
        {children}
      </tbody>
    );
  },
);

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(function TableFooter({ className, children, ...rest }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('bg-weak-50 font-medium text-strong-950', className)}
      {...rest}
    >
      {children}
    </tfoot>
  );
});

/**
 * One row.
 *
 * `interactive` is a hover affordance, not a click target. A row whose
 * `onClick` opens a record is unreachable by keyboard and invisible to a
 * screen reader; put a real link or button in one of the cells — usually the
 * first — and let the row highlight follow it.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { selected = false, interactive = false, className, children, ...rest },
    ref,
  ) {
    return (
      <tr
        ref={ref}
        aria-selected={selected || undefined}
        data-selected={selected || undefined}
        className={cn(tableRowVariants({ interactive, selected }), className)}
        {...rest}
      >
        {children}
      </tr>
    );
  },
);

/**
 * A column header.
 *
 * `aria-sort` goes on the cell, not on the button inside it, and only the
 * column actually sorted carries a value — announcing "none" on the other six
 * is noise. The sort control is a real `<button>`, so the column can be
 * reordered from the keyboard.
 */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead(
    {
      align = 'start',
      state = 'default',
      sortable = false,
      sortDirection = null,
      onSort,
      sortLabel,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { size } = useContext(TableContext);

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={
          sortable && sortDirection
            ? sortDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : undefined
        }
        className={cn(tableHeadVariants({ size, align, state }), className)}
        {...rest}
      >
        {sortable ? (
          <button
            type="button"
            aria-label={sortLabel}
            onClick={() => onSort?.(sortDirection === 'asc' ? 'desc' : 'asc')}
            className={tableSortButtonVariants({
              align,
              sorted: Boolean(sortDirection),
            })}
          >
            {children}
            <Icon
              icon={
                sortDirection === 'asc'
                  ? RiArrowUpSLine
                  : sortDirection === 'desc'
                    ? RiArrowDownSLine
                    : RiExpandUpDownLine
              }
              size={16}
              className={sortDirection ? undefined : 'text-soft-400'}
            />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);

/** One cell. `header` makes it the row's header instead. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    {
      align = 'start',
      priority = 'regular',
      numeric = false,
      header = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { size } = useContext(TableContext);
    const classes = cn(
      tableCellVariants({ size, align, priority, numeric }),
      className,
    );

    if (header) {
      return (
        <th
          ref={ref}
          scope="row"
          className={cn(classes, 'font-medium')}
          {...rest}
        >
          {children}
        </th>
      );
    }

    return (
      <td ref={ref} className={classes} {...rest}>
        {children}
      </td>
    );
  },
);
