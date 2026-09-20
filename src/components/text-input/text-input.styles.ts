import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Text Input" page.
 *   Input → Size (Medium 40 · Small 36 · X-Small 32)
 *           × State (Default · Hover · Focus · Filled · Disabled · Error)
 *           × Leading (Icon | Text | None) × Trailing (Icon | Text | None)
 *
 * State is not a prop. Hover, focus and disabled are CSS states; "Filled" is
 * whether the field has a value, which the input already knows. Only `invalid`
 * survives as a prop, because nothing in the DOM can work it out.
 *
 * Leading and trailing are slots rather than an enum: as an enum, "an icon on
 * one side and a unit on the other" is unreachable, and every new kind of
 * adornment needs a library release.
 */
export const textInputFieldVariants = cva(
  [
    'flex w-full items-center overflow-hidden',
    'rounded-lg border bg-white-0',
    'transition-colors duration-150',
    'shadow-xs',
    // The border lives on this wrapper, not on the input, so an adornment
    // sits *inside* the field instead of beside a second box.
    'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
    'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-weak-50',
  ],
  {
    variants: {
      size: {
        md: 'h-10 gap-2 text-[14px] leading-5 [&_svg]:size-5',
        sm: 'h-9 gap-2 text-[14px] leading-5 [&_svg]:size-5',
        xs: 'h-8 gap-1.5 text-[12px] leading-4 [&_svg]:size-4',
      },
      invalid: {
        true: 'border-error-base focus-within:outline-error-base',
        false:
          'border-soft-200 hover:border-sub-300 focus-within:border-primary-base focus-within:outline-primary-base',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);

export const textInputControlVariants = cva(
  [
    'min-w-0 flex-1 bg-transparent text-strong-950',
    'outline-none placeholder:text-soft-400',
    'disabled:cursor-not-allowed disabled:text-sub-300',
  ],
  {
    variants: {
      size: {
        md: 'px-3',
        sm: 'px-2.5',
        xs: 'px-2',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

/** Icon or button sitting inside the field, on either edge. */
export const textInputAdornmentVariants = cva(
  'grid shrink-0 place-items-center text-soft-400',
  {
    variants: {
      side: {
        start: 'ps-3',
        end: 'pe-3',
      },
      size: {
        md: '',
        sm: '',
        xs: '',
      },
    },
    compoundVariants: [
      { side: 'start', size: 'xs', class: 'ps-2' },
      { side: 'end', size: 'xs', class: 'pe-2' },
    ],
    defaultVariants: { side: 'start', size: 'md' },
  },
);

/**
 * Attached text block — `https://`, `.com`, a currency. Bordered on its inner
 * edge with a logical property, so the divider lands between the affix and the
 * field in both directions rather than always on the right.
 */
export const textInputAffixVariants = cva(
  'grid h-full shrink-0 place-items-center bg-weak-50 text-sub-600',
  {
    variants: {
      side: {
        start: 'border-e border-soft-200',
        end: 'border-s border-soft-200',
      },
      size: {
        md: 'px-3',
        sm: 'px-2.5',
        xs: 'px-2',
      },
    },
    defaultVariants: { side: 'start', size: 'md' },
  },
);

export type TextInputVariantProps = VariantProps<typeof textInputFieldVariants>;

/**
 * Figma's `Type` presets.
 *
 * Everything here is behaviour, not paint: the keyboard a phone shows, the
 * autofill bucket the browser uses, and whether the value is Latin regardless
 * of the surrounding script. These are the details that are tedious to get
 * right on every field and therefore usually wrong, which is exactly why Figma
 * modelled them as a variant and why they belong in one table rather than in
 * twelve call sites.
 *
 * `latin: true` is not cosmetic. An email address, URL, IBAN or card number
 * rendered right-to-left keeps its correct value in the DOM and becomes
 * unreadable on screen — the slashes and dots migrate to the wrong end.
 */
export const TEXT_INPUT_TYPE_PRESETS: Record<
  string,
  {
    htmlType?:
      | 'text'
      | 'email'
      | 'tel'
      | 'url'
      | 'password'
      | 'search'
      | 'date'
      | 'number';
    inputMode?:
      'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';
    autoComplete?: string;
    /** Native constraint validation, overridable by the caller. */
    pattern?: string;
    step?: number | 'any';
    latin?: boolean;
    /**
     * Which edge the in-field `select` sits on for this type. Figma puts the
     * country code *before* a phone number and the currency *after* an amount,
     * so the side is a property of the type, not a free choice.
     */
    selectSide?: 'start' | 'end';
  }
> = {
  basic: {},
  email: {
    htmlType: 'email',
    inputMode: 'email',
    autoComplete: 'email',
    latin: true,
  },
  phone: {
    htmlType: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
    pattern: '[+0-9() .-]*',
    latin: true,
    selectSide: 'start',
  },
  card: {
    inputMode: 'numeric',
    autoComplete: 'cc-number',
    pattern: '[0-9 -]*',
    latin: true,
  },
  website: {
    htmlType: 'url',
    inputMode: 'url',
    autoComplete: 'url',
    latin: true,
  },
  amount: {
    htmlType: 'number',
    inputMode: 'decimal',
    step: 'any',
    latin: true,
    selectSide: 'end',
  },
  date: { inputMode: 'numeric', latin: true },
  search: { htmlType: 'search', inputMode: 'search' },
  password: { htmlType: 'password', autoComplete: 'current-password' },
  button: {},
  dropdown: { selectSide: 'end' },
  emoji: {},
};

/** The ⌘K chip on a search field. Figma's `Shortcut`. */
export const textInputShortcutVariants = cva([
  'grid shrink-0 place-items-center rounded-md border border-soft-200 bg-weak-50',
  'px-1.5 py-0.5 text-[11px] leading-4 font-medium text-sub-600',
]);

/** Muted text pinned inside the trailing edge. Figma's `Suffix`. */
export const textInputSuffixVariants = cva('shrink-0 select-none text-sub-600');

/**
 * Muted text pinned inside the *leading* edge — the `€` before an Amount.
 *
 * Not the same thing as `startAffix`: Figma draws the currency mark inside the
 * same padded frame as the value, with no rule and no fill, while `https://`
 * on a Website field is a bordered block beside it. Two different drawings, so
 * two different slots.
 */
export const textInputPrefixVariants = cva('shrink-0 select-none text-sub-600');

/**
 * An attached control — Figma's `Button` and `Dropdown` types. It sits inside
 * the field's border and is divided from the input by a logical rule, so the
 * divider lands between them in both directions.
 */
export const textInputAttachedVariants = cva(
  'flex h-full shrink-0 items-center',
  {
    variants: {
      side: {
        start: 'border-e border-soft-200',
        end: 'border-s border-soft-200',
      },
    },
    defaultVariants: { side: 'end' },
  },
);
