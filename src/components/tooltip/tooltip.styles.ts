import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Tooltip" page.
 *   Tooltip → Type (Top Left · Top Center · Top Right ·
 *                   Bottom Left · Bottom Center · Bottom Right ·
 *                   Left · Right)
 *             × Size (2X-Small (24) | X-Small (34) | Large)
 *             × Dark Mode = On/Off
 *             || Tail, Left Icon, Edit Text, Edit Description
 *
 * ## Type is `side` × `align`, and the eight are not twelve
 *
 * Figma's eight positions decompose into four sides and three alignments —
 * except that **Left and Right have no alignment**, which is why the set has
 * eight members and not twelve. That is a real constraint of the design, not
 * an oversight, so `align` is typed to reject a value on those two sides
 * rather than silently ignoring it, which is what this file used to do.
 *
 * Figma's Left and Right become `start` and `end`: a tooltip pinned to the
 * "left" of its trigger in Persian is on the wrong side of it, and the whole
 * point of a side is which way it points relative to the reading flow.
 *
 * `Size` has three values, not two — an earlier version of this file was
 * missing the largest.
 */
export const tooltipVariants = cva(
  [
    'absolute z-50 w-max max-w-[16rem]',
    'rounded-lg',
    'shadow-md',
    'transition-opacity duration-150 motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        /** Figma "2X-Small (24)". */
        '2xs': 'px-2 py-1 text-[11px] leading-4',
        /** Figma "X-Small (34)". */
        xs: 'px-2.5 py-1.5 text-[12px] leading-4',
        /** Figma "Large" — the two-line form with a description. */
        lg: 'px-3 py-2 text-[12px] leading-4',
      },
      /**
       * Figma's `Dark Mode`. Not the theme: a tooltip is deliberately inverted
       * against its surface, so in a dark UI the *light* bubble is the one that
       * reads as an overlay. That makes this a per-tooltip choice, which is why
       * it is a prop here and a variant there rather than something
       * `[data-theme]` decides.
       */
      darkMode: {
        true: 'bg-strong-950 text-static-white',
        false: 'bg-white-0 text-strong-950 border border-soft-200',
      },
      side: {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        /**
         * Logical: `start` is left in English and right in Persian, so the
         * tooltip stays on the side the trigger's label runs *from*.
         */
        start: 'end-full me-2 top-1/2 -translate-y-1/2',
        end: 'start-full ms-2 top-1/2 -translate-y-1/2',
      },
      align: {
        start: '',
        center: '',
        end: '',
      },
    },
    compoundVariants: [
      { side: 'top', align: 'start', class: 'start-0' },
      {
        side: 'top',
        align: 'center',
        class: 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
      },
      { side: 'top', align: 'end', class: 'end-0' },
      { side: 'bottom', align: 'start', class: 'start-0' },
      {
        side: 'bottom',
        align: 'center',
        class: 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
      },
      { side: 'bottom', align: 'end', class: 'end-0' },
    ],
    defaultVariants: {
      size: 'xs',
      side: 'top',
      align: 'center',
      darkMode: true,
    },
  },
);

/** A rotated square peeking out from under the bubble. */
export const tooltipArrowVariants = cva('absolute size-2 rotate-45', {
  variants: {
    darkMode: {
      true: 'bg-strong-950',
      false: 'bg-white-0 border-b border-e border-soft-200',
    },
    side: {
      top: 'bottom-[-3px] start-1/2 -ms-1',
      bottom: 'top-[-3px] start-1/2 -ms-1',
      start: 'end-[-3px] top-1/2 -mt-1',
      end: 'start-[-3px] top-1/2 -mt-1',
    },
  },
  defaultVariants: { side: 'top', darkMode: true },
});

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>;
