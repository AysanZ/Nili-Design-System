import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  DropdownVariantProps,
  DropdownItemVariantProps,
} from './dropdown.styles';

export type DropdownSize = NonNullable<DropdownVariantProps['size']>;
export type DropdownAppearance = NonNullable<
  DropdownVariantProps['appearance']
>;
export type DropdownItemSize = NonNullable<DropdownItemVariantProps['size']>;

export interface DropdownOption {
  value: string;
  label: ReactNode;
  /** Figma `💬 Sublabel` — muted text on the label's own line. */
  sublabel?: ReactNode;
  /** Second line — Figma's Large (56) item. */
  description?: ReactNode;
  /** Figma `🎖️ Badge` — beside the label. */
  badge?: ReactNode;
  /** Figma `⌘ Shortcut` — key hint pinned to the trailing edge. */
  shortcut?: ReactNode;
  /**
   * Leading slot. Covers all six Figma Types: a flag for Country, an `<Avatar>`
   * for Avatar, a card mark for Provider, a logo for Brand or Company.
   */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  disabled?: boolean;
  /** Groups items under a Figma "Caption" heading. */
  group?: string;
}

export interface DropdownProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'children'
> {
  options: DropdownOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;

  placeholder?: ReactNode;
  size?: DropdownSize;
  itemSize?: DropdownItemSize;
  appearance?: DropdownAppearance;
  disabled?: boolean;
  invalid?: boolean;

  /** Figma misc. item "Search". */
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;

  /** Figma misc. items "Button" / "Button Group", pinned under the list. */
  footer?: ReactNode;

  /**
   * Figma `🔖 Label` — the visible label above the field, drawn with the same
   * `Label` component the Text Input page uses.
   *
   * Until v1.1 this prop was the trigger's `aria-label` and rendered nothing,
   * which is why every Dropdown in this system was missing the label Figma
   * draws above it. When there is no visible label, pass `ariaLabel`.
   */
  label?: ReactNode;
  /** Figma Label's `💬 Sublabel` — the muted "(Optional)". */
  sublabel?: ReactNode;
  /** Figma Label's `ℹ️ Information` glyph. `true` uses the default icon. */
  information?: boolean | ReactNode;
  /** Accessible name for that glyph. */
  informationLabel?: string;
  /** Figma Label's `🌟 Button` — trailing slot on the label row. */
  labelAction?: ReactNode;
  /** Figma `💡 Hint Text` — the line under the field. */
  hint?: ReactNode;
  /** Validation message. Its presence is what marks the field invalid. */
  error?: ReactNode;
  /** Figma `🎖️ Badge` — inside the trigger, after the value. */
  badge?: ReactNode;
  /** Accessible name when no visible `label` is rendered. */
  ariaLabel?: string;
  required?: boolean;
  /** Applied to the outer wrapper rather than to the field. */
  rootClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
}
