import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Content Divider" page (node 29:29).
 *   Type = Line · Line Spacing · Text & Line Divider · Text Divider ·
 *          Solid Text Divider · Icon Button · Icon Button Group ·
 *          Text Button · Text Button Group
 *
 * Those nine names describe two independent things: how much vertical room the
 * divider takes, and what sits in the middle of it. Modelling them as one
 * nine-value enum would mean "text divider with a button" is unreachable.
 * They are split into `spacing` and `children` here — pass nothing for `Line`,
 * text for `Text Divider`, a Button for `Text Button`, a ButtonGroup for
 * `Text Button Group`, and so on. All nine Figma variants are expressible, plus
 * the combinations Figma has no name for.
 */
export const contentDividerVariants = cva('flex w-full items-center', {
  variants: {
    spacing: {
      /** Figma "Line": the rule with no vertical padding. */
      none: 'gap-0',
      /** Figma "Line Spacing". */
      sm: 'gap-2 py-2',
      md: 'gap-2.5 py-3',
      lg: 'gap-3 py-4',
    },
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'h-full w-px flex-col',
    },
  },
  defaultVariants: {
    spacing: 'none',
    align: 'center',
    orientation: 'horizontal',
  },
});

export const contentDividerRuleVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full flex-1',
      vertical: 'h-full w-px flex-1',
    },
    appearance: {
      /** Figma "Solid Text Divider" uses the stronger rule. */
      subtle: 'bg-soft-200',
      solid: 'bg-sub-300',
    },
  },
  defaultVariants: { orientation: 'horizontal', appearance: 'subtle' },
});

export const contentDividerContentVariants = cva('shrink-0', {
  variants: {
    variant: {
      // Figma: Subheading/2X-Small — 11px, uppercase, soft-400.
      text: 'px-1 text-[11px] font-medium uppercase leading-3 tracking-[0.02em] text-soft-400',
      /** Anything interactive keeps its own typography. */
      element: '',
    },
  },
  defaultVariants: { variant: 'text' },
});

export type ContentDividerVariantProps = VariantProps<
  typeof contentDividerVariants
>;

/** Figma "Solid Text Divider": a weak-50 bar with the label at the start. */
export const contentDividerSolidVariants = cva(
  'flex w-full items-center bg-weak-50 px-5 py-2 text-[11px] font-medium uppercase leading-3 tracking-[0.02em] text-soft-400',
);
