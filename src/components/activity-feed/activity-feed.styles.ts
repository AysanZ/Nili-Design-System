import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → Activity Feed [1.0] — four component sets, all read from the
 * Figma export:
 *
 *   Header    540×56   px 20, title Label/Medium (16/24) strong-950, an
 *                      action (Link Button, primary) at the end, 1px
 *                      soft-200 bottom border.
 *   Tab Menu  540×48   20px start padding, 20px between tabs, Label/Small
 *                      tabs (sub-600, selected strong-950) with a 2px
 *                      primary underline exactly as wide as the label, a
 *                      16px error-base count, an optional 20px divider,
 *                      and a 24px action at the end (12px end padding).
 *   Items     524 wide  rounded 12, 12px padding, white → weak-50 on hover.
 *                      40px avatar, 16px gap, title (Label/Small) over a
 *                      12px meta line (time · 16px icon + subject), body
 *                      16px below the avatar, indented to the title.
 *                      Types: Basic (text) · Button (actions) · File
 *                      (attachment chip) · Message (boxed text). Hover also
 *                      reveals a 40px ghost "more" button at the end.
 *   Footer    540×48   px 20, 12px sub-600 hint with key caps, and a
 *                      small gray Link Button at the end.
 *
 * Quantity (tab count) and State (hover) are not props: the count is how
 * many children you pass, and hover is CSS (`hovered:`, which the docs can
 * force with `data-nili-state="hover"`).
 */
export const activityFeedVariants = cva(
  'flex w-full flex-col overflow-hidden rounded-xl border border-soft-200 bg-white-0',
);

export const activityFeedHeaderVariants = cva(
  'flex min-h-14 items-center justify-between gap-3 border-b border-soft-200 bg-white-0 px-5 py-4',
);

export const activityFeedTabsVariants = cva(
  'flex h-12 items-center gap-5 border-b border-soft-200 bg-white-0 ps-5 pe-3',
);

export const activityFeedTabVariants = cva(
  [
    'relative inline-flex h-full shrink-0 items-center gap-1',
    'text-[14px] leading-5 font-medium tracking-[-0.006em]',
    'cursor-pointer outline-hidden transition-colors duration-200 ease-out',
    'focus-visible:text-strong-950',
    'disabled:pointer-events-none disabled:text-sub-300',
  ],
  {
    variants: {
      selected: {
        true: 'text-strong-950',
        false: 'text-sub-600 hovered:text-strong-950',
      },
    },
    defaultVariants: { selected: false },
  },
);

/**
 * The selected underline sits on the label only (Figma: 16px under "All"),
 * over the row's bottom border. Logical insets, so RTL needs nothing extra.
 */
export const activityFeedTabIndicatorVariants = cva(
  'pointer-events-none absolute inset-x-0 -bottom-px h-0.5 bg-primary-base',
);

export const activityFeedCountVariants = cva(
  'inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-error-base text-[11px] leading-3 font-medium text-static-white',
);

export const activityFeedItemVariants = cva(
  [
    'group/item relative flex w-full flex-col rounded-xl p-3',
    'transition-colors duration-200 ease-out motion-reduce:transition-none',
    'hovered:bg-weak-50 hovered:[&_[data-slot=activity-menu]]:opacity-100',
    'has-[:focus-visible]:bg-weak-50 has-[:focus-visible]:[&_[data-slot=activity-menu]]:opacity-100',
  ],
  {
    variants: {
      unread: {
        // A logical inset so the unread marker sits on the leading edge in
        // both directions. Not in Figma; kept for existing callers.
        true: 'before:absolute before:start-0 before:top-4 before:h-2 before:w-0.5 before:rounded-e-full before:bg-primary-base',
        false: '',
      },
    },
    defaultVariants: { unread: false },
  },
);

/** Boxed chip used by File and Message items. */
export const activityFeedChipVariants = cva(
  'inline-flex max-w-full items-center rounded-md border border-soft-200 bg-white-0 text-[14px] leading-5 text-sub-600 shadow-button-xs',
  {
    variants: {
      kind: {
        file: 'h-9 gap-1 ps-[7px] pe-2',
        message: 'px-[11px] py-[7px]',
      },
    },
    defaultVariants: { kind: 'file' },
  },
);

export const activityFeedFooterVariants = cva(
  'flex min-h-12 items-center justify-between gap-3 bg-white-0 px-5 py-2 text-[12px] leading-4 text-sub-600',
);

/** Keyboard key cap in the footer hint (Figma: 20px, radius 4). */
export const activityFeedKeyVariants = cva(
  'inline-flex size-5 shrink-0 items-center justify-center rounded-xs border border-soft-200 bg-weak-50 text-sub-600 [&_svg]:size-4',
);

export type ActivityFeedItemVariantProps = VariantProps<
  typeof activityFeedItemVariants
>;
