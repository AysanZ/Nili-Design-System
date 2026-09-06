import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Figma's item Type axis. */
export type ActivityFeedItemType = 'basic' | 'button' | 'file' | 'message';

export interface ActivityFeedFile {
  name: string;
  /** Pre-formatted, e.g. `'1.2 MB'` — formatting is a locale decision. */
  size?: string;
  icon?: ReactNode;
  href?: string;
}

export interface ActivityFeedItemProps extends Omit<
  ComponentPropsWithoutRef<'li'>,
  'title' | 'children'
> {
  type?: ActivityFeedItemType;
  /** Usually an `<Avatar>`. */
  avatar?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Pre-formatted timestamp. Use `formatNumber` for Persian digits. */
  timestamp?: ReactNode;
  /** Figma `🎖️ Badge` — sits beside the title, e.g. a status or a count. */
  badge?: ReactNode;
  unread?: boolean;
  /** `type="button"`: up to two actions under the text. */
  actions?: ReactNode;
  /** `type="file"`: the attachment card. */
  file?: ActivityFeedFile;
  /** `type="message"`: quoted message body. */
  message?: ReactNode;
  children?: ReactNode;
  onSelect?: () => void;
}

export interface ActivityFeedProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'title'
> {
  title?: ReactNode;
  /** Rendered at the trailing edge of the header — a link or menu button. */
  headerAction?: ReactNode;
  /** `<ActivityFeedTab>` children. Omit for a feed with no tabs. */
  tabs?: ReactNode;
  label?: string;
}

export interface ActivityFeedTabProps extends ComponentPropsWithoutRef<'button'> {
  selected?: boolean;
  /** Count chip after the label — pass a `<Badge>` or plain text. */
  badge?: ReactNode;
}
