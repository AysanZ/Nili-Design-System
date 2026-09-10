import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Figma's item Type axis. */
export type ActivityFeedItemType = 'basic' | 'button' | 'file' | 'message';

export interface ActivityFeedFile {
  name: string;
  /** Pre-formatted, e.g. `'4mb'` — formatting is a locale decision. */
  size?: string;
  /** Replaces the default paperclip. */
  icon?: ReactNode;
  href?: string;
}

export interface ActivityFeedItemProps extends Omit<
  ComponentPropsWithoutRef<'li'>,
  'title' | 'children'
> {
  /** Figma Type: Basic · Button · File · Message. */
  type?: ActivityFeedItemType;
  /** Usually a 40px `<Avatar size="sm">`. */
  avatar?: ReactNode;
  title: ReactNode;
  /** Pre-formatted time, e.g. "8 min ago". First part of the meta line. */
  timestamp?: ReactNode;
  /** Figma "Insert subject here." — second part of the meta line. */
  subject?: ReactNode;
  /** 16px glyph before `subject` (an app or workspace logo). */
  subjectIcon?: ReactNode;
  /** Sits beside the title, e.g. a status or a count. */
  badge?: ReactNode;
  /** Body text — Figma Type Basic. */
  description?: ReactNode;
  /** Figma Type Button: the actions row, usually two `size="xs"` Buttons. */
  actions?: ReactNode;
  /** Figma Type File: the attachment chip. */
  file?: ActivityFeedFile;
  /** Figma Type Message: the boxed message text. */
  message?: ReactNode;
  /**
   * The "more" control Figma reveals on hover — pass a ghost icon Button
   * or a Dropdown trigger. Shown on hover and keyboard focus, and always on
   * touch screens.
   */
  menu?: ReactNode;
  unread?: boolean;
  /**
   * Makes the whole card selectable. The title becomes a real button that
   * stretches over the card, so actions and the menu inside stay separate,
   * valid, focusable buttons.
   */
  onSelect?: () => void;
  children?: ReactNode;
}

export interface ActivityFeedProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'title'
> {
  /** Figma Header title, e.g. "Notifications". */
  title?: ReactNode;
  /** End of the header, e.g. `<LinkButton color="primary">Mark all as read</LinkButton>`. */
  headerAction?: ReactNode;
  /** `<ActivityFeedTab>` children (and `<ActivityFeedTabSeparator>`). */
  tabs?: ReactNode;
  /** End of the tab row, e.g. a filter `<CompactButton appearance="ghost">`. */
  tabsAction?: ReactNode;
  /** Figma Footer content — see `<ActivityFeedFooter>`. */
  footer?: ReactNode;
  label?: string;
}

export interface ActivityFeedTabProps extends ComponentPropsWithoutRef<'button'> {
  selected?: boolean;
  /** Figma's red count after the label. */
  count?: ReactNode;
  /** Any other node after the label — e.g. a `<Badge>`. */
  badge?: ReactNode;
}
