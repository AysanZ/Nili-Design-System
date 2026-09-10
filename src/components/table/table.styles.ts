import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Table" page.
 *   Table Row Cell    → State (Default | Hover | Active)
 *                       × Priority (Leading | Regular | Passive | None)
 *                       × Misc (None | Button | Button Group | Toggle | Rating |
 *                               Progress Bar | Status Badge | Badge Group |
 *                               Avatar Group)
 *                       × Size (X-Large (64) | Large (48))
 *   Table Header Cell → State (Default | Disabled | Empty) || Checkbox, Sorting
 *   Sorting Icons     → Type (Default | Up | Down)
 *
 * ## What changed to match
 *
 * - **`appearance` (default | bordered | striped) does not exist.** It was
 *   invented; there is no such axis anywhere on the page.
 * - **`size` was 56/44px.** Figma's two heights are 64 and 48.
 * - **`Priority` is new.** It is a real axis and a real idea: how loudly a
 *   column reads. Leading is the row's identity, Regular is ordinary data,
 *   Passive is metadata the eye should skip, None removes the type styling
 *   entirely so a cell can host a control.
 * - **Header cells gain `Empty`** — the checkbox column's header, which has no
 *   label and must not be announced as one.
 *
 * ## `Misc` stays a slot, not an enum
 *
 * Figma lists nine things a cell might contain. Encoding them as a prop would
 * mean a cell cannot hold a rating *and* a badge, and that the tenth kind needs
 * a library release. This is the same call the codebase already made for Text
 * Input's adornments and Tag's leading slot: Figma has to draw every
 * combination as its own frame, and we do not.
 */
export const tableScrollVariants = cva(
  'w-full overflow-x-auto rounded-xl border border-soft-200',
);

export const tableVariants = cva(
  'w-full border-collapse text-[14px] leading-5 text-start',
);

export const tableHeaderVariants = cva('bg-weak-50 text-sub-600', {
  variants: {
    sticky: {
      // The header stays put while the body scrolls. `z-1` keeps it above the
      // rows sliding under it.
      true: '[&_th]:sticky [&_th]:top-0 [&_th]:z-1 [&_th]:bg-weak-50',
      false: '',
    },
  },
  defaultVariants: { sticky: false },
});

export const tableHeadVariants = cva(
  ['border-b border-soft-200 text-start font-medium', 'whitespace-nowrap'],
  {
    variants: {
      size: {
        xl: 'h-12 px-3',
        lg: 'h-10 px-3',
      },
      align: {
        start: 'text-start',
        center: 'text-center',
        end: 'text-end',
      },
      /**
       * Figma's header `State`. `empty` is the checkbox column's header — it
       * has no label, and a header cell with no accessible name must not be
       * announced as one.
       */
      state: {
        default: '',
        disabled: 'text-sub-300',
        empty: '',
      },
    },
    defaultVariants: { size: 'xl', align: 'start', state: 'default' },
  },
);

/** The button inside a sortable header — the whole cell is the target. */
export const tableSortButtonVariants = cva(
  [
    'inline-flex w-full items-center gap-1',
    'cursor-pointer rounded-sm text-inherit transition-colors duration-150',
    'hover:text-strong-950',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
      sorted: {
        true: 'text-strong-950',
        false: '',
      },
    },
    defaultVariants: { align: 'start', sorted: false },
  },
);

export const tableRowVariants = cva(
  'border-b border-soft-200 last:border-b-0',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer transition-colors duration-150 hover:bg-weak-50',
        false: '',
      },
      selected: {
        true: 'bg-information-lighter hover:bg-information-lighter',
        false: '',
      },
    },
    defaultVariants: { interactive: false, selected: false },
  },
);

export const tableCellVariants = cva('', {
  variants: {
    size: {
      xl: 'h-16 px-3',
      lg: 'h-12 px-3',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    /**
     * Figma's `Priority` — how loudly the column reads. `leading` is the row's
     * identity (the name you scan for), `regular` is ordinary data, `passive`
     * is metadata the eye should skip, and `none` drops the type styling so the
     * cell can host a control.
     */
    priority: {
      leading: 'font-medium text-strong-950',
      regular: 'text-strong-950',
      passive: 'text-sub-600',
      none: '',
    },
    /** Numeric columns line up when the digits are the same width. */
    numeric: {
      true: 'tabular-nums',
      false: '',
    },
  },
  defaultVariants: {
    size: 'xl',
    align: 'start',
    priority: 'regular',
    numeric: false,
  },
});

export const tableCaptionVariants = cva(
  'px-3 py-2 text-start text-[12px] leading-4 text-sub-600',
);

export type TableVariantProps = VariantProps<typeof tableVariants>;
export type TableCellVariantProps = VariantProps<typeof tableCellVariants>;
