import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Switch Toggle" page.
 *   Switch Toggle       → Left Icon = On/Off, Only Icon = On/Off, Label, Show Triple
 *   Switch Toggle Items → Type (Default | Left Icon | Only Icon)
 *                         × State (Default · Hover · Active · Disabled)
 *
 * ## The page names are swapped relative to this codebase
 *
 * Figma's **"Toggle"** page is the on/off switch — it lives in
 * `components/switch`. Figma's **"Switch Toggle"** page is the segmented
 * control, and that is this file. An earlier version of this component had it
 * backwards and grew a pile of axes Figma never had: `appearance`
 * (stroke/ghost/filled), `size`, a `multiple` selection mode, a vertical
 * orientation, and an `attached` flag. None of those exist in the design.
 *
 * ## What follows from that
 *
 * - **Selection is single.** A segmented control shows which of N views you
 *   are looking at; two selected segments is not a state any screen renders.
 * - **The track is always joined.** `attached` was a prop for a shape the
 *   design only draws one way.
 * - **Horizontal only.** There is no vertical segmented control in the file.
 *
 * `Show Triple` is the segment count, which is however many children you pass,
 * so it is not a prop either.
 */
export const toggleGroupVariants = cva([
  // Equal grid tracks let segments consume the whole control when its parent
  // stretches it, while an intrinsic group still sizes itself to its content.
  // A flex row left unused grey space after the last content-width segment.
  'inline-grid grid-flow-col auto-cols-fr items-center gap-1',
  'rounded-lg bg-weak-50 p-1',
]);

export const toggleVariants = cva(
  [
    'inline-flex h-8 shrink-0 items-center justify-center gap-1.5',
    'rounded-md px-3 text-[14px] font-medium leading-5 whitespace-nowrap',
    'cursor-pointer transition-colors duration-150',
    '[&_svg]:size-5',
    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-base',
    'disabled:pointer-events-none disabled:text-sub-300',
  ],
  {
    variants: {
      /** Icon-only segments still fill their equal group track. */
      iconOnly: {
        true: 'w-full px-0',
        false: '',
      },
      /** Figma's "Active" — the segment you are currently on. */
      selected: {
        true: 'bg-white-0 text-strong-950 shadow-xs',
        false: 'text-sub-600 hover:text-strong-950',
      },
    },
    defaultVariants: { iconOnly: false, selected: false },
  },
);

export type ToggleVariantProps = VariantProps<typeof toggleVariants>;
