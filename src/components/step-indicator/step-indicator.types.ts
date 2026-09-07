import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  StepIndicatorVariantProps,
  StepMarkerVariantProps,
  StepperDotVariantProps,
} from './step-indicator.styles';

export type StepOrientation = NonNullable<
  StepIndicatorVariantProps['orientation']
>;
/** Figma: Default · Active · Completed. There is no error state in the file. */
export type StepStatus = NonNullable<StepMarkerVariantProps['status']>;
export type StepperDotSize = NonNullable<StepperDotVariantProps['size']>;

export interface StepIndicatorLabels {
  /** Accessible name for the landmark. */
  root?: string;
  /** How a step is announced, e.g. `` (n, t) => `Step ${n} of ${t}` ``. */
  step?: (index: string, total: string) => string;
  /** Appended for a finished step, so "done" is not carried by a tick alone. */
  completed?: string;
  active?: string;
  default?: string;
}

export interface StepIndicatorProps extends Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children'
> {
  children: ReactNode;
  /** Index of the current step, 0-based. */
  value?: number;
  orientation?: StepOrientation;
  /**
   * BCP-47 tag for the step numbers (`'fa'` → Persian). Defaults to the ambient
   * locale from `NiliProvider`.
   */
  locale?: string;
  labels?: StepIndicatorLabels;
}

export interface StepProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'value'
> {
  label?: ReactNode;
  description?: ReactNode;
  /**
   * Overrides the state derived from the indicator's `value`. Rarely needed —
   * all three states follow from the position for free.
   */
  status?: StepStatus;
  /** Replaces the number or the tick. */
  icon?: ReactNode;
  /**
   * Makes the step a real button — for a wizard whose earlier steps can be
   * revisited. Without it the step is inert text, which is right when the flow
   * is strictly forward.
   */
  onSelect?: () => void;
}

export interface StepperDotProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Number of dots. */
  count?: number;
  /** Index of the active dot, 0-based. Figma's "1st / 2nd / 3rd Active". */
  value?: number;
  size?: StepperDotSize;
  /** Accessible name, e.g. `'Form steps'`. */
  label?: string;
  /** How the position is announced. */
  formatProgress?: (index: string, total: string) => string;
  locale?: string;
}
