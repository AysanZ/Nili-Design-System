import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TableCellVariantProps } from './table.styles';

/** Figma's row-cell Size: X-Large (64) | Large (48). */
export type TableSize = NonNullable<TableCellVariantProps['size']>;
export type TableAlign = NonNullable<TableCellVariantProps['align']>;
/** Figma's `Priority`. */
export type TablePriority = NonNullable<TableCellVariantProps['priority']>;
/** Figma's header `State`. */
export type TableHeadState = 'default' | 'disabled' | 'empty';
export type SortDirection = 'asc' | 'desc';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  size?: TableSize;
  /**
   * Accessible name. A table with no name is announced as "table" and nothing
   * else, which is useless on a page with three of them.
   */
  label?: string;
  /** Visible caption, rendered above the table. Also names it. */
  caption?: ReactNode;
  /** Keeps the header visible while the body scrolls. */
  stickyHeader?: boolean;
  /**
   * Wrap in a scrollable, keyboard-focusable region. On by default: a table
   * that overflows horizontally is unreachable by keyboard otherwise.
   */
  scrollable?: boolean;
  /** Class for the scroll wrapper. Use `className` for the `<table>`. */
  scrollClassName?: string;
}

export type TableHeaderProps = ComponentPropsWithoutRef<'thead'>;
export type TableBodyProps = ComponentPropsWithoutRef<'tbody'>;
export type TableFooterProps = ComponentPropsWithoutRef<'tfoot'>;

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  /** Highlights the row and adds `aria-selected`. */
  selected?: boolean;
  /**
   * Hover affordance for a row that navigates. The click target must still be
   * a real control *inside* the row — see the note in the component.
   */
  interactive?: boolean;
}

/**
 * `align` shadows the deprecated presentational HTML attribute, which is
 * *physical* (`left` / `right`) and therefore wrong in an RTL-first system.
 * Ours is logical, so the base attribute is omitted rather than merged.
 */
export interface TableHeadProps extends Omit<
  ComponentPropsWithoutRef<'th'>,
  'align'
> {
  align?: TableAlign;
  /**
   * Figma's header `State`. `empty` marks a header with no label — the
   * checkbox column — so it is not announced as naming its column.
   */
  state?: TableHeadState;
  /** Renders a sort button and manages `aria-sort` on the cell. */
  sortable?: boolean;
  /** Current direction, or `null` when this column is not the sort key. */
  sortDirection?: SortDirection | null;
  onSort?: (direction: SortDirection) => void;
  /** Accessible name for the sort button, e.g. `` (c) => `Sort by ${c}` ``. */
  sortLabel?: string;
}

export interface TableCellProps extends Omit<
  ComponentPropsWithoutRef<'td'>,
  'align'
> {
  align?: TableAlign;
  /**
   * Figma's `Priority` — how loudly the column reads. `leading` is the row's
   * identity, `passive` is metadata the eye should skip, `none` drops the type
   * styling so the cell can host a control.
   */
  priority?: TablePriority;
  /** Tabular figures, so a column of numbers lines up. */
  numeric?: boolean;
  /**
   * Makes the cell a row header (`<th scope="row">`). The first column of a
   * data table usually is one, and marking it lets a screen reader say which
   * row it is reading.
   */
  header?: boolean;
}
