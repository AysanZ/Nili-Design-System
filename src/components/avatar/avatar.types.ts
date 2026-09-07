import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { AvatarSize, AvatarTone } from './avatar.styles';

export type { AvatarSize, AvatarTone };

export type AvatarTopStatus =
  'verified' | 'pin' | 'favorite' | 'add' | 'remove' | 'notification';

export type AvatarBottomStatus =
  'online' | 'offline' | 'busy' | 'away' | 'company';

export interface AvatarProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'color' | 'children'
> {
  size?: AvatarSize;
  /**
   * Background/foreground pair for the fallback surface.
   *
   * Figma has no colour axis on Avatar — it draws one `⚪️ Solid BG` On/Off.
   * The six tones are an extension, and they exist for `AvatarGroup`: a stack
   * of six identical grey circles is unreadable, and tinting them is the
   * cheapest way to tell them apart before the images load. `soft` is the
   * Figma default and matches its Solid BG exactly.
   */
  tone?: AvatarTone;

  /**
   * Accessible name. Required, because an avatar with no name is either an
   * unlabelled image or a decorative blob, and only the call site knows which.
   * Pass `''` to mark it decorative when the person's name is already visible
   * next to it.
   */
  name: string;

  src?: string;
  onImageError?: () => void;

  /** Initials to show when there is no image. Derived from `name` if omitted. */
  initials?: string;
  /** Arbitrary fallback content — overrides `initials`. */
  fallback?: ReactNode;

  topStatus?: AvatarTopStatus;
  bottomStatus?: AvatarBottomStatus;
  /** Rendered when `bottomStatus` is `'company'`. */
  companyIcon?: ReactNode;
  /** Accessible name for the status marker, e.g. `'Online'`. */
  statusLabel?: string;
}

export interface AvatarGroupItem extends Pick<
  AvatarProps,
  'name' | 'src' | 'initials' | 'tone' | 'fallback' | 'onImageError'
> {
  id?: string;
}

export interface AvatarGroupProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  size?: AvatarSize;
  items: AvatarGroupItem[];
  /** Render at most this many avatars, then a "+N" chip. */
  max?: number;
  /** Overrides the computed overflow count. */
  overflowCount?: number;
  /** Accessible label for the whole stack, e.g. `'Team members'`. */
  label?: string;
}
