import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  ProgressFillVariantProps,
  ProgressLabelVariantProps,
  ProgressCircleVariantProps,
} from './progress-bar.styles';

export type ProgressColor = NonNullable<ProgressFillVariantProps['color']>;
/** Figma's label `Type`: On Top | On Right. Logical, so `end` flips in RTL. */
export type ProgressLabelPosition = NonNullable<
  ProgressLabelVariantProps['position']
>;
export type ProgressCircleSize = NonNullable<
  ProgressCircleVariantProps['size']
>;

interface ProgressCommonProps {
  /** Current value, clamped to `0…max`. Ignored while `indeterminate`. */
  value?: number;
  max?: number;
  color?: ProgressColor;
  /**
   * Unknown duration: drops `aria-valuenow` so assistive tech announces "busy"
   * rather than inventing a percentage.
   */
  indeterminate?: boolean;
  /** Visible label. Also becomes the accessible name. */
  label?: ReactNode;
  /** Figma's label `Type`. */
  labelPosition?: ProgressLabelPosition;
  /** Action under the bar. Figma's "Link Button". */
  linkButton?: ReactNode;
  /** Shows the percentage. */
  showValue?: boolean;
  /** Overrides the rendered readout — `'3 of 10 files'`, a size, an ETA. */
  valueLabel?: ReactNode;
  /**
   * BCP-47 tag driving the digits (`'fa'` → Persian). Defaults to the ambient
   * locale from `NiliProvider`.
   */
  locale?: string;
  /**
   * Accessible name when there is no visible `label` — a bare bar in a table
   * cell has nothing to be named by otherwise.
   */
  'aria-label'?: string;
}

export interface ProgressBarProps
  extends
    ProgressCommonProps,
    Omit<ComponentPropsWithoutRef<'div'>, 'color' | 'children'> {
}

export interface ProgressCircleProps
  extends
    ProgressCommonProps,
    Omit<ComponentPropsWithoutRef<'div'>, 'color' | 'children'> {
  size?: ProgressCircleSize;
  /** Stroke width in px. */
  thickness?: number;
  /** Content in the middle. Defaults to the percentage when `showValue`. */
  children?: ReactNode;
}
