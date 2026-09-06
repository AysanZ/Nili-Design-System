import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  QuickActionsVariantProps,
  QuickActionItemVariantProps,
  QuickActionIconVariantProps,
} from './quick-actions.styles';

export type QuickActionsLayout = NonNullable<
  QuickActionsVariantProps['layout']
>;
export type QuickActionSize = NonNullable<QuickActionsVariantProps['size']>;
export type QuickActionAppearance = NonNullable<
  QuickActionItemVariantProps['appearance']
>;
export type QuickActionItemLayout = NonNullable<
  QuickActionItemVariantProps['layout']
>;
export type QuickActionTone = NonNullable<QuickActionIconVariantProps['tone']>;

export interface QuickActionsProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  layout?: QuickActionsLayout;
  size?: QuickActionSize;
  /**
   * Columns, when `layout="grid"`. A number is applied at every width; pass a
   * Tailwind class through `className` instead if you need it responsive.
   */
  columns?: number;
  /** Accessible name for the group, e.g. `'اقدام‌های سریع'`. */
  label?: string;
  /** Optional heading rendered above the group; also names it. */
  title?: ReactNode;
  /** Trailing control beside the title — "See all", a menu. */
  action?: ReactNode;
}

export interface QuickActionItemProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'title'
> {
  children?: ReactNode;
  appearance?: QuickActionAppearance;
  layout?: QuickActionItemLayout;
  size?: QuickActionSize;
  /** Colour of the icon chip. */
  tone?: QuickActionTone;
  /** The glyph. Wrapped in a tinted chip unless `iconWrapper={false}`. */
  icon?: ReactNode;
  /** Set `false` to drop the tinted chip and render the glyph bare. */
  iconWrapper?: boolean;
  /**
   * Figma `💬 Sublabel` — muted text on the *label's* line.
   *
   * Figma's item draws a sublabel and a description at once, so they are two
   * slots here as well; folding them together loses the second line.
   */
  sublabel?: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  /** Figma `🎖️ Badge` — beside the label. */
  badge?: ReactNode;
  /** Keyboard hint at the trailing edge, e.g. `'⌘N'`. */
  shortcut?: ReactNode;
  /** Anything at the trailing edge — a Badge, a count, a chevron. */
  endAdornment?: ReactNode;
  /** Marks the shortcut as the one in effect: adds `aria-pressed`. */
  active?: boolean;
  /** Render the child element instead of a `<button>` — for router links. */
  asChild?: boolean;
}
