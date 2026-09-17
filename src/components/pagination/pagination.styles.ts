import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Pagination" page.
 *
 *   Pagination Cells → State (Default | Hover | Selected | Disabled)
 *                      × Full Radius = On/Off
 *   Pagination Group → Device Mode (Desktop | Mobile)
 *                      × Type (Basic | Full Radius | Group)
 *                      || First / Last, Next / Previous, Advanced
 *
 * ## Axes this file used to invent
 *
 * - **`size` (sm | md)** does not exist. Figma draws one cell height.
 * - **`appearance` (ghost | stroke)** does not exist either. What Figma
 *   actually varies is `Full Radius` — pill cells versus rounded-rect ones.
 *
 * **Quantity is not a variant.** Figma draws a fixed number of page cells; a
 * real pagination has to render whatever `count` it is given, so the visible
 * window is computed (`getPaginationRange`) rather than enumerated.
 *
 * **State is not a prop either** — hover and disabled are CSS states, and
 * "Active" is `active`, which is a fact about the data (the page you are on),
 * not a look. See the component API conventions in the README.
 */
export const paginationVariants = cva('flex items-center gap-2', {
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      /** Arrows pinned to the edges, summary in the middle — the mobile row. */
      between: 'w-full justify-between',
    },
  },
  defaultVariants: { align: 'center' },
});

/**
 * Figma Pagination Cell: 32px, radius 8 (or full), 14px. Default white with
 * a soft-200 border and sub-600 text · Hover weak-50, no border · Active
 * weak-50 with the border and strong-950 text · Disabled sub-300.
 * Cells sit 8px apart; the arrows in Basic / Full Radius are bare icons.
 */
export const paginationItemVariants = cva(
  [
    'inline-flex size-8 shrink-0 items-center justify-center',
    'border border-soft-200 bg-white-0 outline-hidden',
    'text-[14px] leading-5 font-medium tabular-nums text-sub-600',
    'cursor-pointer transition-colors duration-200',
    'hovered:border-transparent hovered:bg-weak-50',
    'focused:shadow-focus-neutral',
    'disabled:pointer-events-none disabled:text-sub-300',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300',
  ],
  {
    variants: {
      /** Figma's `Full Radius`: circles instead of rounded squares. */
      fullRadius: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        active: true,
        class:
          'bg-weak-50 text-strong-950 hovered:border-soft-200 hovered:bg-weak-50',
      },
    ],
    defaultVariants: { fullRadius: false, active: false },
  },
);

/**
 * Figma's `Group` type: the cells share one bordered track instead of floating
 * as separate targets.
 */
export const paginationGroupVariants = cva(
  // Figma Group: one bordered track, radius 8, cells divided by 1px rules.
  'gap-0 overflow-hidden rounded-md border border-soft-200 [&>li>*]:rounded-none [&>li>*]:border-0 [&>li+li>*]:border-s [&>li+li>*]:border-soft-200',
);

/**
 * The skipped-pages marker.
 *
 * It carried a hard-coded `rounded-md`, so in the Full Radius row it sat as a
 * rounded rectangle in a line of circles. It is drawn as a cell in Figma, so
 * it takes the cell's radius.
 */
export const paginationEllipsisVariants = cva(
  'inline-flex size-8 shrink-0 select-none items-center justify-center border border-soft-200 bg-white-0 text-[14px] leading-5 text-sub-600',
  {
    variants: {
      fullRadius: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    defaultVariants: { fullRadius: false },
  },
);

export const paginationSummaryVariants = cva(
  'select-none whitespace-nowrap text-[14px] leading-5 tabular-nums text-sub-600',
);

export type PaginationVariantProps = VariantProps<typeof paginationVariants>;
export type PaginationItemVariantProps = VariantProps<
  typeof paginationItemVariants
>;
