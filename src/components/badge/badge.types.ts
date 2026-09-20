import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { BadgeVariantProps } from './badge.styles';

export type BadgeAppearance = NonNullable<BadgeVariantProps['appearance']>;
export type BadgeColor = NonNullable<BadgeVariantProps['color']>;
export type BadgeSize = NonNullable<BadgeVariantProps['size']>;

export interface BadgeProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'color' | 'children'
> {
  /**
   * Visual treatment.
   *
   * Renamed from `style`, which collided with React's own `style` prop
   * (`CSSProperties`) — you could not set an inline style on a Badge at all.
   */
  appearance?: BadgeAppearance;
  color?: BadgeColor;
  size?: BadgeSize;
  disabled?: boolean;
  /** Renders a dot before the label, or a standalone dot without children. */
  dot?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /**
   * Badge content. Replaces the old `label` / `number` / `number_label` trio:
   * a boolean flag plus two parallel content props meant three ways to say
   * the same thing and one of them was always ignored.
   */
  children?: ReactNode;
}
