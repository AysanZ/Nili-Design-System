import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TagVariantProps } from './tag.styles';

/** Figma's `Style`: Stroke | Gray. */
export type TagAppearance = NonNullable<TagVariantProps['appearance']>;

export interface TagProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'onSelect'
> {
  appearance?: TagAppearance;
  disabled?: boolean;
  /** The tag is currently applied — adds `aria-pressed` when selectable. */
  selected?: boolean;

  /**
   * Leading slot. Covers all six of Figma's `Type` values — Left Icon, Avatar,
   * Country, Brand, Company — without making them mutually exclusive.
   */
  startAdornment?: ReactNode;
  /** Muted text after the label. Figma's "Sublabel". */
  sublabel?: ReactNode;

  /** Makes the label a button — a filter chip you can toggle. */
  onSelect?: () => void;
  /** Shows the remove button. */
  onDismiss?: () => void;
  /**
   * Accessible name for the remove button. Required alongside `onDismiss`: an
   * ✕ has no accessible name, and "button" is all a screen reader would get.
   */
  dismissLabel?: string;
}

export interface TagGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** Accessible name for the set, e.g. `'Tags'`. */
  label?: string;
}
