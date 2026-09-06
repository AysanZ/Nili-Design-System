import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface ToggleProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'value' | 'onChange'
> {
  /**
   * Identifies the segment inside its `ToggleGroup`. Required — a segmented
   * control is a choice between named options, and a segment with no name
   * cannot be the answer.
   */
  value: string;
  /** Figma's "Left Icon". Logical, so it leads in both directions. */
  startIcon?: ReactNode;
  /** Figma's "Only Icon". Requires `aria-label`. */
  iconOnly?: boolean;
}

export interface ToggleGroupProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** Selected segment. Controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /**
   * Figma `🔖 Label` — the visible label above the group, drawn with the same
   * `Label` component the rest of the file uses.
   *
   * Until v1.1 this was only the group's `aria-label` and rendered nothing,
   * so the label Figma draws above every Switch Toggle was missing. When there
   * is no visible label, pass `ariaLabel` instead.
   */
  label?: ReactNode;
  /** Figma Label's `💬 Sublabel` — the muted "(Optional)". */
  sublabel?: ReactNode;
  /** Figma Label's `ℹ️ Information` glyph. `true` uses the default icon. */
  information?: boolean | ReactNode;
  /** Accessible name for that glyph. */
  informationLabel?: string;
  /** Accessible name for the set when no visible `label` is rendered. */
  ariaLabel?: string;
  /** Applied to the wrapper rather than to the group row. */
  rootClassName?: string;
}
