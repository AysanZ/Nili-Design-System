import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TabsListVariantProps } from './tabs.styles';

/** Figma's vertical `Style`. Has no effect on a horizontal tab menu. */
export type TabsAppearance = NonNullable<TabsListVariantProps['appearance']>;
export type TabsOrientation = NonNullable<TabsListVariantProps['orientation']>;

/**
 * `automatic` selects a tab as focus reaches it — the WAI-ARIA default, and
 * right when the panels are cheap. `manual` waits for Enter or Space, which is
 * what you want when a tab loads data: arrowing past four tabs should not fire
 * four requests.
 */
export type TabsActivationMode = 'automatic' | 'manual';

export interface TabsProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** Selected tab. Controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  orientation?: TabsOrientation;
  /**
   * Figma's `Style (Card | List)`. Vertical only — the horizontal tab menu has
   * no style axis in the design.
   */
  appearance?: TabsAppearance;
  activationMode?: TabsActivationMode;
}

export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  /** Accessible name for the tab set, e.g. `'Account settings'`. */
  label?: string;
  /** Tabs share the width instead of hugging their labels. */
  stretch?: boolean;
}

export interface TabsTriggerProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'value'
> {
  /** Ties the tab to its panel. Must be unique within one `Tabs`. */
  value: string;
  /** Figma's "Left Icon". Logical, so it leads in both directions. */
  startIcon?: ReactNode;
  /** Figma's "Right Icon". */
  endIcon?: ReactNode;
  /** Figma's "Number" — a count or a `<Badge>`, after the label. */
  badge?: ReactNode;
}

export interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string;
  /**
   * Keep the panel mounted while hidden. Off by default: an unmounted panel
   * cannot run effects or hold stale data. Turn it on to preserve scroll
   * position, form state or a chart that is expensive to rebuild.
   */
  keepMounted?: boolean;
}

/** Figma's vertical `Divider` — a rule between groups of tabs. */
export type TabsDividerProps = ComponentPropsWithoutRef<'div'>;
