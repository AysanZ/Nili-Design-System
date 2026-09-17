import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Text Area" page.
 *   Text Area         → State (Default · Hover · Focus · Filled · Disabled · Error)
 *                        || Label, Counter, Hint Text
 *   Character Counter → State (Default | Error | Disabled) || Number, Resize
 *
 * Same finding as Text Input: hover, focus and disabled are CSS states and
 * "Filled" is whether the field has a value, so only `invalid` survives as a
 * prop.
 *
 * **There is no Size axis.** An earlier version of this file carried
 * `md`/`sm`; Figma draws one text area.
 */
export const textAreaFieldVariants = cva(
  [
    'flex w-full flex-col overflow-hidden',
    'rounded-lg border bg-white-0',
    'transition-colors duration-150',
    'shadow-xs',
    'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
    'has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:bg-weak-50',
  ],
  {
    variants: {
      invalid: {
        true: 'border-error-base focus-within:outline-error-base',
        false:
          'border-soft-200 hover:border-sub-300 focus-within:border-primary-base focus-within:outline-primary-base',
      },
    },
    defaultVariants: { invalid: false },
  },
);

export const textAreaControlVariants = cva(
  [
    'w-full flex-1 bg-transparent px-3 py-2.5 text-[14px] leading-5 text-strong-950',
    'outline-none placeholder:text-soft-400',
    'disabled:cursor-not-allowed disabled:text-sub-300',
  ],
  {
    variants: {
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
    },
    defaultVariants: { resize: 'vertical' },
  },
);

/**
 * The counter row, inside the box under the text.
 *
 * It used to be a filled grey band with a rule across the top. Figma draws no
 * band: the count sits on the field's own surface, pinned to the trailing
 * edge, with the resize grip beside it. The band added a second horizontal
 * line right under the one the field already has, which is why a Text Area
 * with a counter looked a size taller than one without.
 */
export const textAreaFooterVariants = cva(
  'flex items-center justify-end gap-1.5 px-3 pb-2 text-[12px] leading-4',
);

/**
 * Figma's Character Counter states: Default, Error, Disabled.
 *
 * Disabled was missing, so a disabled Text Area faded its text, its border and
 * its placeholder while the count underneath stayed at full contrast — the one
 * element still claiming to be live.
 */
export const textAreaCounterVariants = cva('tabular-nums', {
  variants: {
    over: {
      true: 'font-medium text-error-base',
      false: 'text-sub-600',
    },
    disabled: {
      true: 'text-sub-300',
      false: '',
    },
  },
  compoundVariants: [
    /* Disabled wins over the limit: a field nobody can type in cannot be over
       its limit in any sense the user can act on. */
    { over: true, disabled: true, class: 'font-normal text-sub-300' },
  ],
  defaultVariants: { over: false, disabled: false },
});

/** Figma's resize grip, beside the count. Decorative — the handle is native. */
export const textAreaGripVariants = cva('shrink-0', {
  variants: {
    disabled: { true: 'text-sub-300', false: 'text-soft-400' },
  },
  defaultVariants: { disabled: false },
});

export type TextAreaVariantProps = VariantProps<typeof textAreaFieldVariants>;
export type TextAreaControlVariantProps = VariantProps<
  typeof textAreaControlVariants
>;
