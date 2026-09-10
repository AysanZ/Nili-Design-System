import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { PaginationVariantProps } from './pagination.styles';

export type PaginationAlign = NonNullable<PaginationVariantProps['align']>;

/** Figma's "Type": which controls the row is made of. */
/** Figma's `Type` on the group. */
export type PaginationType = 'basic' | 'full-radius' | 'group';
/** Figma's `Device Mode`. Mobile collapses the cells to a summary row. */
export type PaginationDeviceMode = 'desktop' | 'mobile';

/** One slot in the computed window: a page, or a gap. */
export type PaginationSlot = number | 'start-ellipsis' | 'end-ellipsis';

/**
 * Every visible string, as props.
 *
 * i18next is a Storybook dependency here, not a library one — a design system
 * that owns its copy forces its translation stack on every consumer. The
 * defaults are English so the component is usable without any of this.
 */
export interface PaginationLabels {
  /** Accessible name for the `<nav>` landmark. */
  root?: string;
  previous?: string;
  next?: string;
  first?: string;
  last?: string;
  /**
   * Accessible name for a page button. Receives the *localized* digits, so a
   * Persian screen reader hears the Persian phrasing and not "…page 3".
   */
  page?: (page: string) => string;
  /** Name for the current page button. */
  currentPage?: (page: string) => string;
  /** Skipped-pages marker. */
  ellipsis?: string;
  /** Compact readout, e.g. `'Page 3 of 10'`. Used when `type="arrows"`. */
  summary?: (page: string, count: string) => string;
  /** The per-page control's rendered text, e.g. `'7 / page'`. */
  perPage?: (size: string) => string;
  /** Accessible name for the per-page control. */
  perPageLabel?: string;
}

export interface PaginationItemProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  children?: ReactNode;
  /** The page you are on: adds `aria-current="page"`. */
  active?: boolean;
  /** Figma's `Full Radius`: a pill cell instead of a rounded rectangle. */
  fullRadius?: boolean;
  /** Render the child element instead of a `<button>` — for router links. */
  asChild?: boolean;
}

export interface PaginationEllipsisProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  /** Accessible name; the glyph itself is hidden. */
  label?: string;
}

export interface PaginationProps extends Omit<
  ComponentPropsWithoutRef<'nav'>,
  'onChange' | 'children'
> {
  /** Total number of pages. Anything below 1 renders nothing. */
  count: number;
  /** Current page, 1-based. Controlled. */
  page?: number;
  /** Starting page while uncontrolled. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;

  /** Pages either side of the current one. */
  siblingCount?: number;
  /** Pages pinned at each end of the trail. */
  boundaryCount?: number;

  type?: PaginationType;
  /** Figma's `Device Mode`. `mobile` shows arrows plus a summary, not cells. */
  deviceMode?: PaginationDeviceMode;
  align?: PaginationAlign;
  /** Outline the arrow buttons, as in Figma's stroke arrows. */
  /** Adds first/last jumps outside the arrows. */
  showEdges?: boolean;
  /** Greys out the whole control — a table reloading, for instance. */
  disabled?: boolean;

  /**
   * Figma's `🧪 Advanced`. Adds the "Page 2 of 16" summary before the trail and
   * the rows-per-page control after it.
   */
  advanced?: boolean;
  /** Rows per page. Only rendered when `advanced`. */
  pageSize?: number;
  /** Choices offered by the per-page control. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * BCP-47 tag driving the digits (`'fa'` → Persian). Defaults to the ambient
   * locale from `NiliProvider`.
   */
  locale?: string;
  labels?: PaginationLabels;
}
