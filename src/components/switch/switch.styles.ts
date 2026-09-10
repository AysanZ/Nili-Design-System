import { cva } from 'class-variance-authority';

/**
 * Figma → "❖ Toggle" page — *not* "Switch Toggle", which is the segmented
 * control implemented in `components/toggle`.
 *
 *   Toggle       → State (Default · Hover · Pressed · Disabled) × Active
 *   Toggle Label → Active × Description × Flip, plus Sublabel, Badge, Link Button
 *
 * State is not a prop — hover, focus and disabled are CSS states, and a
 * `state="focused"` prop produces a control that looks focused but is not.
 *
 * **There is no Size axis.** An earlier version of this file carried
 * `sm`/`md`; Figma has one size only, so the variant is gone.
 */
export const switchControlVariants = cva([
  'peer relative h-5 w-9 shrink-0 appearance-none rounded-full',
  'cursor-pointer transition-colors duration-200 motion-reduce:transition-none',
  'bg-soft-200 hover:bg-sub-300',
  'checked:bg-primary-base checked:hover:bg-primary-dark',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  'disabled:cursor-not-allowed disabled:bg-weak-50 disabled:hover:bg-weak-50',
  'disabled:checked:bg-sub-300',
]);

/**
 * The knob is drawn over the input, because a native `<input>` cannot have
 * children. `peer-checked` keeps the two in sync with no JavaScript, which is
 * what lets the control stay a real checkbox for forms and assistive tech.
 *
 * The travel is mirrored under `rtl:`, since `translate-x` is physical: an
 * unmirrored knob would slide *out of* the track in Persian.
 */
export const switchThumbVariants = cva([
  'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-white-0',
  'shadow-xs transition-transform duration-200',
  'motion-reduce:transition-none',
  'start-0.5 size-4 peer-checked:translate-x-4 peer-checked:rtl:-translate-x-4',
  'peer-disabled:bg-weak-50',
]);

export const switchRootVariants = cva('inline-flex gap-2', {
  variants: {
    labelPosition: {
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
