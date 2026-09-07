import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** One thumb (`number`) or two (`[number, number]`). */
export type SliderValue = number | [number, number];

export interface SliderProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'color'
> {
  /**
   * Controlled value. A `number` renders one thumb, a `[number, number]`
   * renders a range — the shape of the value *is* Figma's "Type", so a range
   * slider cannot be handed a single number by accident.
   */
  value?: SliderValue;
  defaultValue?: SliderValue;
  /** Fires on every step while dragging. */
  onValueChange?: (value: SliderValue) => void;
  /**
   * Fires once, when the pointer or key is released. Use this for anything
   * expensive — a request per pixel of drag is the usual way a slider takes a
   * server down.
   */
  onValueCommit?: (value: SliderValue) => void;

  min?: number;
  max?: number;
  step?: number;
  /** Smallest allowed gap between the two thumbs of a range. */
  minStepsBetweenThumbs?: number;

  disabled?: boolean;

  /** Visible label above the track. Also names the thumbs. Figma's "Label". */
  label?: ReactNode;
  /** Muted second line under the label. Figma's "Sublabel". */
  sublabel?: ReactNode;
  /** Shows the current value beside the label. Figma's "Edit Amount". */
  showValue?: boolean;
  /** Value bubble above the thumb while dragging. Figma's "Tooltip". */
  tooltip?: boolean;

  /**
   * Formats every number the user sees or hears. Defaults to localized digits.
   */
  formatValue?: (value: number) => string;
  /**
   * BCP-47 tag driving the digits (`'fa'` → Persian). Defaults to the ambient
   * locale from `NiliProvider`.
   */
  locale?: string;
  /**
   * Forces the drag direction, overriding the ambient locale. Needed for a
   * track whose axis is not the reading axis — a video timeline runs from the
   * video's start to its end, which is not a sentence, so it is pinned `ltr`
   * even in a Persian UI. Without this the CSS renders one way and the pointer
   * maths mirrors the other, and the playhead jumps backwards.
   */
  dir?: 'ltr' | 'rtl';
  /** Accessible names for the thumbs, when there is no visible `label`. */
  thumbLabels?: [string, string?];
  /** `name` for the hidden inputs, when the form is submitted natively. */
  name?: string;
}
