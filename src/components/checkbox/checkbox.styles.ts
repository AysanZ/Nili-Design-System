import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Checkbox" page (node 29:28).
 *   Checkbox       → State (Default · Hover · Focused · Disabled) × Active × Indeterminate
 *   Checkbox Label → Active × Description × Flip
 *
 * State is not a prop: hover, focus and disabled are CSS states. `Flip` becomes
 * `labelPosition`, expressed with logical properties so it follows the reading
 * direction instead of hardcoding a side.
 */
/**
 * Figma export: a 16px box in a 20px frame (2px margin), radius 4, a 1.5px
 * edge. Default soft-200 → Hover sub-300 → Focus primary-base; checked /
 * indeterminate fill primary-base → Hover primary-darker → Focus
 * primary-dark. Disabled is a flat soft-200 square in every state.
 */
export const checkboxControlVariants = cva(
  [
    'peer relative m-0.5 grid size-4 shrink-0 place-items-center',
    'rounded-[4px] border-[1.5px] outline-hidden transition-colors duration-200',
    'cursor-pointer appearance-none',
    'border-soft-200 bg-white-0',
    'hovered:border-sub-300 focused:border-primary-base',
    'checked:border-primary-base checked:bg-primary-base',
    'indeterminate:border-primary-base indeterminate:bg-primary-base',
    'checked:hovered:border-primary-darker checked:hovered:bg-primary-darker',
    'indeterminate:hovered:border-primary-darker indeterminate:hovered:bg-primary-darker',
    'checked:focused:border-primary-dark checked:focused:bg-primary-dark',
    'indeterminate:focused:border-primary-dark indeterminate:focused:bg-primary-dark',
    'disabled:cursor-not-allowed disabled:border-soft-200 disabled:bg-soft-200',
  ],
  {
    variants: {
      invalid: {
        true: 'border-error-base hovered:border-error-base focused:border-error-base',
        false: '',
      },
    },
    defaultVariants: { invalid: false },
  },
);

/**
 * The glyph is drawn on top of the input rather than inside it, because a
 * native `<input type="checkbox">` cannot have children. `peer-checked`
 * keeps the two in sync without a single line of JavaScript, which is what
 * lets the control stay a real checkbox for forms and assistive tech.
 */
export const checkboxIndicatorVariants = cva([
  'pointer-events-none absolute inset-0 grid place-items-center',
  'text-static-white opacity-0 transition-opacity duration-150',
  'peer-checked:opacity-100 peer-indeterminate:opacity-100',
]);

export const checkboxRootVariants = cva('inline-flex gap-2', {
  // Figma: 8px from the 20px frame to the label
  variants: {
    labelPosition: {
      // `flex-row-reverse` on top of logical properties: the control moves to
      // the opposite edge in both LTR and RTL, which is what Figma's "Flip" is.
      end: 'flex-row',
      start: 'flex-row-reverse justify-between',
    },
    align: {
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: { labelPosition: 'end', align: 'center' },
});

export const checkboxLabelVariants = cva(
  'text-[14px] font-medium leading-5 cursor-pointer select-none',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-sub-300',
        false: 'text-strong-950',
      },
    },
    defaultVariants: { disabled: false },
  },
);

export const checkboxDescriptionVariants = cva(
  'text-[12px] font-normal leading-4',
  {
    variants: {
      disabled: {
        true: 'text-sub-300',
        false: 'text-sub-600',
      },
    },
    defaultVariants: { disabled: false },
  },
);

export type CheckboxVariantProps = VariantProps<typeof checkboxRootVariants>;
