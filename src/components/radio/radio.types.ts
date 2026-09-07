import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { RadioGroupVariantProps } from './radio.styles';

export type RadioOrientation = NonNullable<
  RadioGroupVariantProps['orientation']
>;

export interface RadioProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'size'
> {
  label?: ReactNode;
  /** Muted text inline after the label — Figma's "Sublabel". */
  sublabel?: ReactNode;
  /** Trailing slot on the label row — Figma's "Badge". */
  badge?: ReactNode;
  /** Action under the description — Figma's "Link Button". */
  linkButton?: ReactNode;
  /** Secondary line under the label. Figma's "Description" toggle. */
  description?: ReactNode;
  /**
   * Which side the label sits on. Figma calls this "Flip". Logical, so `start`
   * is left in English and right in Persian.
   */
  labelPosition?: 'start' | 'end';
  invalid?: boolean;
  /** Wrapper class. Use `className` for the control itself. */
  rootClassName?: string;
}

export interface RadioGroupProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'title'
> {
  /** Selected value. Controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Shared `name`. Generated when omitted — without one the browser will not
   * treat the inputs as a single group, and arrow keys stop moving between
   * them.
   */
  name?: string;
  orientation?: RadioOrientation;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Accessible name for the group, e.g. `'Payment method'`. */
  label?: string;
  /** Visible heading. Also names the group. */
  title?: ReactNode;
  /** Marks the whole group invalid, e.g. an unanswered required question. */
  invalid?: boolean;
}

/**
 * Figma → `Radio Card [1.0]`: Type (Basic | Left Icon | Avatar | Card Provider |
 * Brand | Company) × State (Default | Hover | Active | Disabled), plus Sublabel
 * and Badge.
 *
 * A radio rendered as a selectable panel — plan pickers, payment methods. The
 * six `Type` values are a leading slot rather than an enum, for the reason this
 * codebase already argued for Text Input adornments: as an enum they are
 * mutually exclusive and a seventh needs a library release.
 */
export interface RadioCardProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'size'
> {
  label?: ReactNode;
  sublabel?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  /** Leading slot — an icon, an `<Avatar>`, a brand mark, a card provider. */
  startAdornment?: ReactNode;
  /** Hides the radio dot, leaving the panel itself as the affordance. */
  hideControl?: boolean;
  /** Wrapper class. Use `className` for the control itself. */
  rootClassName?: string;
}
