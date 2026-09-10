import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Step Indicator" page.
 *   Step Indicator Horizontal / Vertical → Quantity (03 | 04 | 05)
 *   Step Indicator … Items               → State (Default | Active | Completed)
 *   Stepper Dot                          → State × Size (Small | X-Small)
 *   Step Indicator Sidebar               → one form, no variants
 *
 * ## Axes this file used to invent
 *
 * - **`type` (Number | Dot | Bar)** does not exist. There is no such axis in
 *   the file, and no bar form anywhere in it. The dot form is its own
 *   component — `StepperDot` below — which is also the only place a Size axis
 *   appears.
 * - **`size` on the indicator** does not exist.
 * - **`status="error"`** does not exist. Figma has three states, not four.
 *
 * Quantity is not a prop — the step count is however many children you pass.
 * State *is* a prop, unlike hover or focus elsewhere in this system: a step's
 * state is a fact about where the user is in the flow, not a pointer
 * interaction, and it is derived from `value`.
 */
export const stepIndicatorVariants = cva('flex w-full', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-start',
      vertical: 'flex-col',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const stepItemVariants = cva('group/step flex min-w-0', {
  variants: {
    orientation: {
      horizontal: 'flex-1 flex-col items-center gap-2 text-center',
      vertical: 'flex-row items-stretch gap-3 text-start',
    },
    interactive: {
      true: '',
      false: '',
    },
  },
  defaultVariants: { orientation: 'horizontal', interactive: false },
});

/** The numbered circle, the dot, or the bar segment. */
export const stepMarkerVariants = cva(
  [
    'grid size-8 shrink-0 place-items-center rounded-full',
    'text-[12px] font-medium leading-4 tabular-nums [&_svg]:size-4',
    'transition-colors duration-200 motion-reduce:transition-none',
  ],
  {
    variants: {
      status: {
        completed: 'bg-primary-base text-static-white',
        active: 'bg-primary-base text-static-white',
        default: 'bg-weak-50 text-sub-600',
      },
    },
    compoundVariants: [
      // A ring makes the active step readable without relying on colour
      // alone, which fails for the same users twice: colour-blind and
      // high-contrast.
      { status: 'active', class: 'ring-4 ring-primary-alpha-16' },
    ],
    defaultVariants: { status: 'default' },
  },
);

/**
 * The line between two steps. Sized with logical properties, so a horizontal
 * connector grows from the right in Persian and a vertical one is unaffected.
 */
export const stepConnectorVariants = cva('shrink-0 rounded-full', {
  variants: {
    orientation: {
      horizontal: 'h-0.5 flex-1',
      vertical: 'w-0.5 flex-1',
    },
    complete: {
      true: 'bg-primary-base',
      false: 'bg-soft-200',
    },
  },
  defaultVariants: { orientation: 'horizontal', complete: false },
});

export const stepLabelVariants = cva(
  'truncate text-[14px] font-medium leading-5',
  {
    variants: {
      status: {
        completed: 'text-strong-950',
        active: 'text-strong-950',
        default: 'text-sub-600',
      },
    },
    defaultVariants: { status: 'default' },
  },
);

/**
 * Figma → `Stepper Dot [1.0]`: State (1st | 2nd | 3rd Active) × Size (Small |
 * X-Small). A separate component in the file, and the only one on this page
 * with a Size axis — which is why `size` belongs here and not on the indicator.
 *
 * "1st / 2nd / 3rd Active" is the position of the active dot, i.e. a value,
 * not a variant. It is `value` on the component.
 */
export const stepperDotVariants = cva(
  'rounded-full transition-colors duration-200 motion-reduce:transition-none',
  {
    variants: {
      size: {
        sm: 'size-2',
        xs: 'size-1.5',
      },
      active: {
        true: 'bg-primary-base',
        false: 'bg-soft-200',
      },
    },
    defaultVariants: { size: 'sm', active: false },
  },
);

export const stepDescriptionVariants = cva(
  'text-[12px] leading-4 text-sub-600',
);

export type StepIndicatorVariantProps = VariantProps<
  typeof stepIndicatorVariants
>;
export type StepMarkerVariantProps = VariantProps<typeof stepMarkerVariants>;
export type StepperDotVariantProps = VariantProps<typeof stepperDotVariants>;
