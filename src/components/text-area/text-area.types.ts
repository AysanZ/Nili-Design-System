import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TextAreaControlVariantProps } from './text-area.styles';

export type TextAreaResize = NonNullable<TextAreaControlVariantProps['resize']>;

export interface TextAreaProps extends Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'size'
> {
  label?: ReactNode;
  hint?: ReactNode;
  /**
   * Validation message. Its presence is what marks the field invalid, so the
   * border and the message can never disagree.
   */
  error?: ReactNode;

  /** Which handles the browser offers. */
  resize?: TextAreaResize;
  /**
   * Grow with the content instead of scrolling, up to `maxRows`. Off by
   * default: a field that resizes on every keystroke moves everything below
   * it, which is unpleasant in a long form.
   */
  autoResize?: boolean;
  maxRows?: number;

  /**
   * Shows `used / limit` under the field. Pass a number to set the limit
   * without also passing `maxLength` — see the note in the component about why
   * those are different things.
   */
  showCount?: boolean;
  /** Soft limit for the counter. Defaults to `maxLength` when that is set. */
  countLimit?: number;

  /** Formats the counter, e.g. `` (used, limit) => `${used} of ${limit}` ``. */
  formatCount?: (used: string, limit: string) => string;
  /**
   * BCP-47 tag driving the counter digits (`'fa'` → Persian). Defaults to the
   * ambient locale from `NiliProvider`.
   */
  locale?: string;

  /** Wrapper class. Use `className` for the `<textarea>` itself. */
  rootClassName?: string;
  /** Class for the bordered field box. */
  fieldClassName?: string;
}
