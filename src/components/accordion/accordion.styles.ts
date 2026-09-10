import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "Accordion [Overview]".
 *
 *   📌 State      = Default · Hover · Active (open)  → CSS hover + `open`
 *   ⬅️ Icon       = On · Off                           → `startAdornment`
 *   🔄 Flip Icon  = Off · On                           → `indicatorPosition`
 *
 * Read from the Figma export:
 *   closed   48px tall: 14px padding, 20px icons, 10px gaps, radius 10
 *   Default  white-0, 1px soft-200 border, 0 1px 2px #0E121B 5%;
 *            title strong-950 (Label/Small), icon sub-600, ＋ soft-400
 *   Hover    weak-50, no border, no shadow, ＋ turns sub-600
 *   Active   weak-50, no border, － sub-600; description (Paragraph/Small,
 *            sub-600) starts 10px under the title, aligned with the title's
 *            first letter, 20px bottom padding — 104px for two lines.
 *
 * Hover is on the whole card, not only on the trigger, which is why the
 * border and shadow disappear with it. `hovered:` also answers to
 * `data-nili-state="hover"`, which is how the docs draw the Hover row.
 */
export const accordionVariants = cva(
  [
    'w-full rounded-lg border',
    'transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
    'has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
    'has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-base',
  ],
  {
    variants: {
      open: {
        true: 'border-transparent bg-weak-50 [&_[data-slot=accordion-indicator]]:text-sub-600',
        false: 'border-soft-200 bg-white-0 shadow-button-xs',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        open: false,
        disabled: false,
        class:
          'hovered:border-transparent hovered:bg-weak-50 hovered:shadow-none hovered:[&_[data-slot=accordion-indicator]]:text-sub-600',
      },
    ],
    defaultVariants: { open: false, disabled: false },
  },
);

export const accordionTriggerVariants = cva(
  [
    'flex w-full items-start justify-between gap-2.5',
    // 13px, not 14: the card's 1px border is always present (transparent
    // when Figma draws none), and Figma's stroke sits inside its 48px frame.
    'rounded-lg p-[13px] text-start',
    'cursor-pointer transition-[padding] duration-200 ease-out motion-reduce:transition-none',
    // The ring is drawn by the container via :has(), so the button itself
    // shows nothing — otherwise you get two nested focus rings.
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      // Figma puts the description 10px under the title, not 14.
      open: { true: 'pb-2.5', false: '' },
    },
    defaultVariants: { open: false },
  },
);

export const accordionIndicatorVariants = cva(
  [
    'relative flex size-5 shrink-0 items-center justify-center',
    'text-soft-400 transition-colors duration-200',
  ],
  {
    variants: {
      /** `end` is the default; `start` puts the indicator before the title. */
      position: {
        start: 'order-first',
        end: 'order-last',
      },
    },
    defaultVariants: { position: 'end' },
  },
);

/**
 * The description lines up with the title's first letter, so its inline
 * padding is the card's 14px plus 20px + 10px for every slot that sits
 * beside the title on that side (minus the 1px border).
 */
export const accordionPanelVariants = cva('pb-[19px]', {
  // All values are Figma's minus the 1px border: 14 / 44 / 74, bottom 20.
  variants: {
    start: { 0: 'ps-[13px]', 1: 'ps-[43px]', 2: 'ps-[73px]' },
    end: { 0: 'pe-[13px]', 1: 'pe-[43px]' },
  },
  defaultVariants: { start: 0, end: 1 },
});

/**
 * Height animation without measuring anything in JS.
 *
 * The old implementation read `contentRef.current.scrollHeight` during render
 * and wrote it to inline `maxHeight` — a layout read in the render phase, and
 * one that produced `undefined` on the very first open. `grid-rows-[0fr]` →
 * `grid-rows-[1fr]` animates to the natural content height with pure CSS.
 */
export const accordionContentVariants = cva(
  'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
  {
    variants: {
      open: {
        true: 'grid-rows-[1fr]',
        false: 'grid-rows-[0fr]',
      },
    },
    defaultVariants: { open: false },
  },
);

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;
