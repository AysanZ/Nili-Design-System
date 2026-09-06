import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { RiInformationFill } from '@remixicon/react';
import { cn } from '../../lib/cn';

/**
 * Figma → "Key Components" page, `Label [1.0]`.
 *   State (Normal | Disabled)
 *   || 🚨 Required · 💬 Sublabel · ℹ️ Information · 🌟 Button
 *
 * Figma lays the parts out in this order and nothing else: the label text, the
 * required asterisk, the sublabel — which on every drawing in the file reads
 * "(Optional)" — the information glyph, then a Link Button.
 *
 * These primitives share one folder because Figma groups them and because each
 * is a handful of lines that exists to be composed *into* other components — a
 * Label alone is not a feature. They are still separate exports with their own
 * types.
 *
 * ## Why the row is not the `<label>`
 *
 * Everything inside a `<label for="x">` becomes part of x's accessible name.
 * Put the information glyph in there with `aria-label="More information"` and
 * the field is announced as "Phone Number More information, edit text" — the
 * help text has eaten the name of the field. So the row is a wrapper, and only
 * the text, the asterisk and the sublabel live inside the `<label>` itself;
 * the glyph and the trailing button are siblings of it.
 */
export const labelRowVariants = cva('flex w-full items-center gap-1');

export const labelVariants = cva(
  'inline-flex items-center gap-1 text-[14px] font-medium leading-5',
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

export interface LabelProps
  extends
    ComponentPropsWithoutRef<'label'>,
    VariantProps<typeof labelVariants> {
  /** Adds an asterisk and, crucially, keeps it out of the accessible name. */
  required?: boolean;
  /**
   * Figma `💬 Sublabel` — the muted "(Optional)" after the asterisk.
   *
   * `aria-hidden` for the same reason the asterisk is: requiredness is carried
   * by the input's own `required` attribute, and a screen reader that hears
   * "Phone Number star optional" has been told the same thing three times,
   * twice contradictorily.
   */
  sublabel?: ReactNode;
  /**
   * Figma `ℹ️ Information` — the glyph that explains the field.
   *
   * `true` renders the default icon. An icon with no name says nothing, so
   * pass `informationLabel` as well, or pass your own node — a Tooltip trigger
   * is the usual thing — when there is something to read.
   */
  information?: boolean | ReactNode;
  /** Accessible name for the information glyph. */
  informationLabel?: string;
  /** Figma `🌟 Button` — trailing slot, usually a LinkButton. */
  hint?: ReactNode;
  /** Applied to the row rather than to the `<label>` element. */
  rowClassName?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  {
    required = false,
    sublabel,
    information = false,
    informationLabel,
    hint,
    disabled = false,
    className,
    rowClassName,
    children,
    ...rest
  },
  ref,
) {
  const showInformation = information !== false && information != null;

  return (
    <span className={cn(labelRowVariants(), rowClassName)}>
      <label
        ref={ref}
        className={cn(labelVariants({ disabled }), className)}
        {...rest}
      >
        {children}
        {required && (
          // aria-hidden: the asterisk is a visual convention. Requiredness is
          // communicated by the input's own `required` attribute, and reading
          // "Email star" out loud helps nobody.
          <span aria-hidden className="text-error-base">
            *
          </span>
        )}
        {sublabel != null && (
          <span aria-hidden className="font-normal text-sub-600">
            {sublabel}
          </span>
        )}
      </label>

      {showInformation && (
        <span
          role={informationLabel ? 'img' : undefined}
          aria-label={informationLabel}
          aria-hidden={informationLabel ? undefined : true}
          className="inline-grid shrink-0 place-items-center text-soft-400 [&_svg]:size-4"
        >
          {information === true ? <RiInformationFill /> : information}
        </span>
      )}

      {hint && <span className="ms-auto font-normal text-sub-600">{hint}</span>}
    </span>
  );
});
