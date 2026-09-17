import { forwardRef } from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiMoreLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Slot } from '../../lib/slot';
import { formatNumber } from '../../lib/numerals';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDirection } from '../../providers/direction';
import { Icon } from '../icon';
import { Dropdown } from '../dropdown';
import {
  paginationVariants,
  paginationGroupVariants,
  paginationItemVariants,
  paginationEllipsisVariants,
  paginationSummaryVariants,
} from './pagination.styles';
import type {
  PaginationProps,
  PaginationItemProps,
  PaginationEllipsisProps,
  PaginationLabels,
  PaginationSlot,
} from './pagination.types';

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

/**
 * The visible window of page numbers.
 *
 * Pure and exported, because this is the part that is actually easy to get
 * wrong: the window has to stay a **constant width** as the user walks through
 * the pages, otherwise the buttons shuffle sideways under the cursor and the
 * next click lands on the wrong page. Keeping the count fixed is why the
 * sibling range is clamped against both boundaries rather than simply centred.
 */
export function getPaginationRange({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  count: number;
  page: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationSlot[] {
  if (count <= 0) return [];

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  return [
    ...startPages,

    // A gap of exactly one page is rendered as that page: an ellipsis hiding a
    // single number is both wider and less useful than the number itself.
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as PaginationSlot[])
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    ...range(siblingsStart, siblingsEnd),

    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as PaginationSlot[])
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
  ];
}

const DEFAULT_LABELS: Required<PaginationLabels> = {
  root: 'Pagination',
  previous: 'Previous page',
  next: 'Next page',
  first: 'First page',
  last: 'Last page',
  page: (page) => `Go to page ${page}`,
  currentPage: (page) => `Page ${page}`,
  ellipsis: 'More pages',
  summary: (page, count) => `Page ${page} of ${count}`,
  perPage: (size) => `${size} / page`,
  perPageLabel: 'Rows per page',
};

/**
 * One control in the row — a page number, an arrow, anything.
 *
 * Exported so a router-driven pagination can be composed by hand:
 * `<PaginationItem fullRadius={type === 'full-radius'} asChild active><Link to="/p/2">2</Link></PaginationItem>`.
 */
export const PaginationItem = forwardRef<HTMLElement, PaginationItemProps>(
  function PaginationItem(
    {
      children,
      active = false,
      fullRadius = false,
      asChild = false,
      className,
      type: buttonType,
      ...rest
    },
    ref,
  ) {
    const classes = cn(
      paginationItemVariants({ fullRadius, active }),
      className,
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...rest}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref as never}
        type={buttonType ?? 'button'}
        aria-current={active ? 'page' : undefined}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

/** The skipped-pages marker. Not a button: expanding it needs state you own. */
export const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(function PaginationEllipsis(
  { label = 'More pages', fullRadius = false, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="presentation"
      data-slot="ellipsis"
      aria-label={label}
      className={cn(paginationEllipsisVariants({ fullRadius }), className)}
      {...rest}
    >
      <Icon icon={RiMoreLine} />
    </span>
  );
});

/**
 * Page navigation.
 *
 * ## RTL
 *
 * Nothing here reads the direction in JavaScript. The row is a flex container,
 * so `dir="rtl"` puts page 1 on the right and the trail runs leftwards — which
 * is what a Persian reader expects. The chevrons carry `mirrored`, because an
 * arrow means "backwards along the reading direction", not "left".
 *
 * ## Numerals
 *
 * Digits are formatted through `Intl`, so a Persian pagination renders Persian
 * the DOM still holds a real number — find-in-page, copy-paste and screen
 * readers all agree with the screen. The accessible name of each button is
 * built from the same localized string.
 *
 * ## Semantics
 *
 * A named `<nav>` around a list, the current page marked with
 * `aria-current="page"`, and the arrows disabled at the ends rather than hidden
 * — a control that disappears at the boundary makes the row resize and shifts
 * every other target sideways.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      count,
      page: pageProp,
      defaultPage = 1,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      type = 'basic',
      deviceMode = 'desktop',
      align = 'center',
      showEdges = false,
      disabled = false,
      advanced = false,
      pageSize,
      pageSizeOptions = [7, 10, 25, 50],
      onPageSizeChange,
      locale: localeProp,
      labels,
      className,
      ...rest
    },
    ref,
  ) {
    const { locale: ambientLocale } = useDirection();
    const locale = localeProp ?? ambientLocale;
    const text = { ...DEFAULT_LABELS, ...labels };

    const [page, setPage] = useControllableState<number>({
      value: pageProp,
      defaultValue: defaultPage,
      onChange: onPageChange,
    });

    if (count < 1) return null;

    const current = Math.min(Math.max(page, 1), count);
    const format = (value: number) => formatNumber(value, { locale });
    const goTo = (next: number) => setPage(Math.min(Math.max(next, 1), count));

    /*
     * Mobile is a *narrower* pagination, not a different one.
     *
     * It used to render no cells at all and a "Page 2 of 16" line between the
     * arrows, which is not what Figma draws: the mobile group keeps the cells
     * and simply shows fewer of them — first, current, ellipsis, last — and
     * moves the rows-per-page control onto its own line underneath. Dropping
     * the cells also dropped the only way to jump more than one page at a
     * time on the device where that matters most.
     */
    const isMobile = deviceMode === 'mobile';
    const slots = getPaginationRange({
      count,
      page: current,
      siblingCount: isMobile ? 0 : siblingCount,
      boundaryCount: isMobile ? 1 : boundaryCount,
    });

    const arrow = (
      key: string,
      icon: typeof RiArrowLeftSLine,
      label: string,
      target: number,
      isDisabled: boolean,
    ) => (
      <li key={key}>
        <PaginationItem
          fullRadius={type === 'full-radius'}
          // Basic / Full Radius draw the arrows as bare icons; Group boxes them.
          className={
            type === 'group' ? undefined : 'border-transparent bg-transparent'
          }

          aria-label={label}
          disabled={disabled || isDisabled}
          onClick={() => goTo(target)}
        >
          <Icon icon={icon} mirrored />
        </PaginationItem>
      </li>
    );

    // Every Figma group draws arrows; only the mobile mode drops the cells.
    const showArrows = true;
    const atStart = current <= 1;
    const atEnd = current >= count;

    const list = (
      <ul
        className={cn(
          paginationVariants({ align }),
          // Group is one bordered track, so it must hug its cells instead
          // of stretching across the row.
          type === 'group'
            ? [paginationGroupVariants(), 'mx-auto w-auto']
            : advanced && 'flex-1',
        )}
      >
        {showArrows &&
          showEdges &&
          arrow('first', RiArrowLeftDoubleLine, text.first, 1, atStart)}
        {showArrows &&
          arrow(
            'previous',
            RiArrowLeftSLine,
            text.previous,
            current - 1,
            atStart,
          )}

        {slots.map((slot, index) =>
          typeof slot === 'number' ? (
            <li key={slot}>
              <PaginationItem
                fullRadius={type === 'full-radius'}

                active={slot === current}
                disabled={disabled}
                aria-label={
                  slot === current
                    ? text.currentPage(format(slot))
                    : text.page(format(slot))
                }
                onClick={() => goTo(slot)}
              >
                {format(slot)}
              </PaginationItem>
            </li>
          ) : (
            <li key={`${slot}-${index}`}>
              <PaginationEllipsis
                label={text.ellipsis}
                fullRadius={type === 'full-radius'}
              />
            </li>
          ),
        )}

        {showArrows &&
          arrow('next', RiArrowRightSLine, text.next, current + 1, atEnd)}
        {showArrows &&
          showEdges &&
          arrow('last', RiArrowRightDoubleLine, text.last, count, atEnd)}
      </ul>
    );

    if (!advanced) {
      return (
        <nav ref={ref} aria-label={text.root} className={className} {...rest}>
          {list}
        </nav>
      );
    }

    const perPage = pageSize != null && (
      <Dropdown
        appearance="compact"
        size="xs"
        ariaLabel={text.perPageLabel}
        value={String(pageSize)}
        disabled={disabled}
        onChange={(next) => onPageSizeChange?.(Number(next))}
        options={pageSizeOptions.map((option) => ({
          value: String(option),
          label: text.perPage(format(option)),
        }))}
      />
    );

    /*
     * Figma's mobile Advanced group stacks: the trail on one line, the
     * rows-per-page control centred underneath. There is no summary — at that
     * width it would push the cells off the row, and the cells already say
     * which page you are on.
     */
    if (isMobile) {
      return (
        <nav
          ref={ref}
          aria-label={text.root}
          className={cn('flex w-full flex-col items-center gap-3', className)}
          {...rest}
        >
          {list}
          {perPage}
        </nav>
      );
    }

    // Figma's desktop Advanced layout: summary — trail — rows-per-page, the
    // trail centred between two equal-width flanks so it does not drift
    // sideways as the page number grows from 1 to 16.
    return (
      <nav
        ref={ref}
        aria-label={text.root}
        className={cn('flex w-full items-center gap-4', className)}
        {...rest}
      >
        <p
          className={cn(paginationSummaryVariants(), 'w-48 shrink-0')}
          aria-live="polite"
        >
          {text.summary(format(current), format(count))}
        </p>

        {list}

        <div className="flex w-48 shrink-0 justify-end">{perPage}</div>
      </nav>
    );
  },
);
