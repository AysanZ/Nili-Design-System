import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Sidebar Navigation [1.0]".
 *
 * Two widths, not two components. The frame draws an expanded panel and a
 * collapsed rail side by side, but every row is the same row with its text
 * hidden — so `collapsed` is a boolean on one component rather than a second
 * set of parts that will drift from the first.
 */
export const sidebarVariants = cva(
  [
    'flex h-full shrink-0 flex-col overflow-hidden bg-white-0',
    'border-e border-soft-200',
    /* Width, not display. Animating `width` keeps the rail in the layout the
       whole time, so the page beside it slides instead of jumping when the
       labels disappear. */
    'transition-[width] duration-200 ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-[72px]',
        false: 'w-[272px]',
      },
    },
    defaultVariants: { collapsed: false },
  },
);

export const sidebarHeaderVariants = cva(
  'flex items-center gap-3 border-b border-soft-200 p-4',
  {
    variants: {
      collapsed: { true: 'justify-center px-3', false: '' },
    },
    defaultVariants: { collapsed: false },
  },
);

/**
 * The square controls in the header — the workspace switcher and the collapse
 * toggle.
 *
 * `CompactButton` is the obvious candidate and is the wrong size for this: its
 * large step is a 24px box around a 20px glyph, so the icon all but fills it
 * and the control reads as an icon someone drew a box around. Figma's is a
 * 32px box around a 20px glyph, which is a button.
 */
export const sidebarIconButtonVariants = cva([
  'grid size-8 shrink-0 place-items-center rounded-lg outline-hidden',
  'border border-soft-200 bg-white-0 text-sub-600 shadow-button-xs',
  'cursor-pointer transition-colors duration-200 ease-out motion-reduce:transition-none',
  'hovered:border-transparent hovered:bg-weak-50 hovered:text-strong-950 hovered:shadow-none',
  'focused:shadow-focus-neutral',
  '[&_svg]:size-5 [&_svg]:shrink-0',
]);

/** The "MAIN" / "FAVS" caption over a group. */
export const sidebarGroupLabelVariants = cva(
  [
    'flex h-8 items-center px-3',
    'text-[12px] leading-4 font-medium tracking-[0.4px] text-soft-400 uppercase',
    'transition-opacity duration-200 ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      collapsed: { true: 'justify-center px-0', false: '' },
    },
    defaultVariants: { collapsed: false },
  },
);

/**
 * One navigation row.
 *
 * ## The active marker
 *
 * It used to be written `before:inset-inline-start-[-20px]`, which is not a
 * Tailwind utility — nothing was emitted, so the bar fell back to its static
 * position and landed *inside* the row, in front of the icon. That is the
 * stray blue rectangle.
 *
 * The utility is `start-*`, and the offset is exactly `-3` so that it cancels
 * the group's `px-3` and lands on the panel's own inline-start edge, which is
 * where Figma draws it. Logical, so in Persian it lands on the right — which
 * is where the panel's edge is there.
 *
 * `-3` and not further: the panel clips its overflow for the width animation,
 * so anything past the edge would simply disappear.
 */
export const sidebarItemVariants = cva(
  [
    'relative flex h-10 w-full items-center rounded-lg text-start outline-hidden',
    'text-[14px] leading-5 font-medium',
    'cursor-pointer transition-colors duration-200 ease-out motion-reduce:transition-none',
    '[&_[data-slot=icon]_svg]:size-5 [&_[data-slot=icon]]:shrink-0',
    'hovered:bg-weak-50',
    'focused:shadow-focus-neutral',
    'aria-disabled:pointer-events-none aria-disabled:text-sub-300',
    'before:absolute before:-start-3 before:top-1/2 before:h-5 before:w-1',
    'before:-translate-y-1/2 before:rounded-e-full before:bg-primary-base',
    'before:opacity-0 before:transition-opacity before:duration-200 motion-reduce:before:transition-none',
  ],
  {
    variants: {
      active: {
        true: 'bg-weak-50 text-strong-950 before:opacity-100 [&_[data-slot=icon]]:text-primary-base',
        false: 'text-sub-600 [&_[data-slot=icon]]:text-sub-600',
      },
      collapsed: {
        // The zero-width label remains mounted for the collapse animation.
        // Its gap must disappear too, otherwise that invisible 12px space
        // shifts the icon away from the centre of the rail.
        true: 'justify-center gap-0 px-0',
        false: 'gap-3 px-3',
      },
    },
    defaultVariants: { active: false, collapsed: false },
  },
);

/**
 * The label inside a row.
 *
 * It is faded and clipped rather than unmounted. Removing the text node mid
 * transition collapses the row's content box before the width animation
 * finishes, which reads as a flicker; `w-0 opacity-0` leaves the element in
 * place and lets both properties animate together.
 */
export const sidebarItemLabelVariants = cva(
  [
    'min-w-0 flex-1 truncate text-start',
    'transition-[opacity,width] duration-200 ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      collapsed: { true: 'w-0 flex-none opacity-0', false: 'opacity-100' },
    },
    defaultVariants: { collapsed: false },
  },
);

/** The trailing chevron and the ⌘1 chip: both vanish on the rail. */
export const sidebarItemTrailingVariants = cva(
  [
    'flex shrink-0 items-center text-soft-400',
    'transition-opacity duration-200 ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      collapsed: { true: 'hidden opacity-0', false: 'opacity-100' },
    },
    defaultVariants: { collapsed: false },
  },
);

export const sidebarFooterVariants = cva(
  'mt-auto flex flex-col gap-1 border-t border-soft-200 p-3',
);

export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;
