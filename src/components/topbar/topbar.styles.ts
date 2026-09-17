import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Topbar Navigation [1.0]" and "Topbar Items EN [1.0]".
 *
 * The frame draws two rows: one with text-only items and one where each item
 * carries an icon. That is not two components — it is whether the caller
 * passes an `icon`, so there is no `variant` for it here.
 */
export const topbarVariants = cva(
  'flex h-16 w-full items-center gap-6 border-b border-soft-200 bg-white-0 px-5',
);

/**
 * The item row.
 *
 * `gap-1` put 4px between two pills whose own padding was only 10px, so the
 * words ran together and the active pill looked like it was touching its
 * neighbour. Figma leaves a clear channel between items.
 */
export const topbarListVariants = cva(
  'flex min-w-0 items-center gap-2 overflow-x-auto',
);

/**
 * One navigation item.
 *
 * Active is a filled pill, not an underline: Figma tints the background and
 * darkens the text. `aria-current="page"` carries the same fact to a screen
 * reader, because a grey pill announces nothing.
 */
export const topbarItemVariants = cva(
  [
    'inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 outline-hidden',
    'text-[14px] leading-5 font-medium whitespace-nowrap',
    'cursor-pointer transition-colors duration-200 ease-out motion-reduce:transition-none',
    '[&_svg]:size-5 [&_svg]:shrink-0',
    'hovered:bg-weak-50 hovered:text-strong-950',
    'focused:shadow-focus-neutral',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300',
  ],
  {
    variants: {
      active: {
        true: 'bg-weak-50 text-strong-950',
        false: 'text-sub-600',
      },
    },
    defaultVariants: { active: false },
  },
);

/** The account chip on the trailing edge: avatar, first name, chevron. */
export const topbarUserVariants = cva([
  'inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-soft-200 bg-white-0 ps-1 pe-2 outline-hidden',
  'text-[14px] leading-5 font-medium text-strong-950',
  'cursor-pointer transition-colors duration-200 ease-out motion-reduce:transition-none',
  'hovered:bg-weak-50 focused:shadow-focus-neutral',
]);

export type TopbarItemVariantProps = VariantProps<typeof topbarItemVariants>;
