import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Date Picker" page (node 29:30).
 *   Day Labels    → the weekday header row
 *   Day Cells     → Type (Basic | Range) × Active × Hover × Disabled × Marked × Empty
 *   Period Range  → the preset shortcuts column
 *   Date Selector → the month/year header, with left/right icons
 *   Date & Range Picker → Type (Date Picker | Range Picker)
 */

/**
 * Figma export (Date & Range Pickers): radius 20, soft-200 border, 20px
 * padding; a weak-50 month bar (36px, radius 8) with white 24px arrow
 * buttons; 40px day cells with 8px gaps; a full-bleed footer with a top
 * divider and 16px padding (Cancel / Apply, or "Range: …" + buttons).
 */
export const datePickerVariants = cva(
  'inline-flex flex-col gap-2 rounded-[20px] border border-soft-200 bg-white-0 p-[19px]',
);

/** Full-bleed footer bar — pass it as `footer`. */
export const datePickerFooterVariants = cva(
  '-mx-[19px] -mb-[19px] mt-2 flex items-center gap-3 border-t border-soft-200 p-4',
);

export const dateSelectorVariants = cva(
  'flex h-9 items-center justify-between gap-2 rounded-lg bg-weak-50 px-1.5',
);

export const dayLabelVariants = cva(
  'grid size-10 place-items-center text-[12px] font-medium leading-4 text-soft-400 uppercase',
);

/**
 * A day cell.
 *
 * The range background is painted with pseudo-elements pinned to the inline
 * axis (`start`/`end`), so a range highlight flows right-to-left in Persian
 * without a mirrored copy of every rule.
 */
export const dayCellVariants = cva(
  [
    // Figma Day Cells: 40px, radius 8, 14px. Default sub-600 → Hover
    // weak-50 / strong-950 → Selected primary / white → Disabled sub-300.
    'relative grid size-10 place-items-center rounded-lg outline-hidden',
    'text-[14px] font-medium leading-5',
    'transition-colors duration-200',
    'focused:z-10 focused:shadow-focus-primary',
    'disabled:pointer-events-none disabled:text-sub-300',
  ],
  {
    variants: {
      // Text colours live in compoundVariants so exactly one applies —
      // two competing text-* utilities resolve by stylesheet order, not intent.
      outside: {
        true: '',
        false: '',
      },
      selected: {
        true: 'bg-primary-base text-static-white hovered:bg-primary-darker',
        false: 'hovered:bg-weak-50 hovered:text-strong-950',
      },
      /**
       * Between the two ends of a range. Figma draws one continuous 10%
       * primary band across the row, so each cell also paints the 8px gap
       * before it; the grid rounds the band at the row ends.
       */
      inRange: {
        true: 'rounded-none bg-primary-alpha-10 before:absolute before:inset-y-0 before:-start-2 before:w-2 before:bg-primary-alpha-10',
        false: '',
      },
      rangeEdge: {
        start: 'rounded-e-none',
        end: 'rounded-s-none',
        both: '',
        none: '',
      },
      /** Figma: today's number is primary-base (no dot). */
      today: {
        true: '',
        false: '',
      },
      /** Figma "Marked": a 3px primary dot 6px above the bottom edge. */
      marked: {
        true: 'after:absolute after:bottom-1.5 after:size-[3px] after:rounded-full after:bg-primary-base disabled:after:bg-sub-300',
        false: '',
      },
    },
    compoundVariants: [
      {
        selected: false,
        inRange: false,
        today: false,
        outside: false,
        class: 'text-sub-600',
      },
      {
        selected: false,
        inRange: false,
        today: false,
        outside: true,
        class: 'text-sub-300',
      },
      {
        selected: false,
        inRange: false,
        today: true,
        class: 'text-primary-base',
      },
      { selected: false, inRange: true, class: 'text-primary-base' },
      { selected: true, marked: true, class: 'after:bg-static-white' },
    ],
    defaultVariants: {
      outside: false,
      selected: false,
      inRange: false,
      rangeEdge: 'none',
      today: false,
      marked: false,
    },
  },
);

export const periodRangeVariants = cva(
  'flex flex-col gap-0.5 border-e border-soft-200 pe-3',
);

export const periodRangeItemVariants = cva(
  [
    'h-9 rounded-md px-3 text-start text-[14px] font-medium leading-5 outline-hidden',
    'transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      // Figma Period Range: 36px, radius 8; Hover weak-50; Active weak-50 + strong-950.
      selected: {
        true: 'bg-weak-50 text-strong-950',
        false: 'text-sub-600 hovered:bg-weak-50',
      },
    },
    defaultVariants: { selected: false },
  },
);

export const calendarToggleVariants = cva([
  'inline-flex items-center gap-1 rounded-lg border border-soft-200 p-0.5',
]);

export type DayCellVariantProps = VariantProps<typeof dayCellVariants>;
