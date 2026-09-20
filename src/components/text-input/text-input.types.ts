import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { TextInputVariantProps } from './text-input.styles';
import type { PasswordStrengthLevel } from '../key-components/password-strength';

export type TextInputSize = NonNullable<TextInputVariantProps['size']>;

/**
 * Figma's `🧩 Type`, all twelve values.
 *
 * This is a **preset**, not a paint job. Each type carries the keyboard, the
 * autofill hint, native validation, direction and default adornments that go
 * with the kind of value being asked for — the things that are tedious to
 * remember and therefore usually wrong. `type="phone"` gets a telephone
 * keypad and a phone-number pattern; `type="amount"` rejects non-numeric
 * input; `type="email"` gets an LTR field even in a Persian UI, because an
 * email address rendered right-to-left is unreadable.
 *
 * Every default it sets can still be overridden by passing the prop yourself.
 */
export type TextInputType =
  | 'basic'
  | 'email'
  | 'phone'
  | 'card'
  | 'website'
  | 'amount'
  | 'date'
  | 'search'
  | 'password'
  | 'button'
  | 'dropdown'
  | 'emoji';

export interface TextInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'prefix'
> {
  size?: TextInputSize;
  /**
   * Figma's `Type`. Sets native validation, input mode, autofill hint and
   * direction for the kind of value being asked for; see
   * {@link TextInputType}.
   *
   * The native `type` attribute is derived from it, which is why this prop
   * takes its name: two props called `type` on one input is how you get a
   * `type="email"` field that asks for a password.
   */
  type?: TextInputType;
  /** Escape hatch: forces the native attribute when the preset gets it wrong. */
  htmlType?: ComponentPropsWithoutRef<'input'>['type'];
  /** Rendered above the field and tied to it. */
  label?: ReactNode;
  /** Figma Label's `💬 Sublabel` — the muted "(Optional)" beside the label. */
  sublabel?: ReactNode;
  /** Figma Label's `ℹ️ Information` glyph. `true` uses the default icon. */
  information?: boolean | ReactNode;
  /** Accessible name for that glyph. */
  informationLabel?: string;
  /** Figma Label's `🌟 Button` — trailing slot on the label row. */
  labelAction?: ReactNode;
  /** The line under the field. Becomes the error message when `error` is set. */
  hint?: ReactNode;
  /**
   * Validation message. Its presence is what marks the field invalid, so the
   * two can never disagree — a red border with no message, or a message with
   * a field that still looks fine.
   */
  error?: ReactNode;

  /** Icon inside the field, on the leading edge. */
  startIcon?: ReactNode;
  /** Icon or control inside the field, on the trailing edge. */
  endIcon?: ReactNode;
  /** Attached block before the field — `https://`, a currency. */
  startAffix?: ReactNode;
  /** Attached block after the field — `.com`, a unit. */
  endAffix?: ReactNode;

  /* ── slots that belong to a particular Type ──
     Each one is inert unless it is given something, so a Basic field pays
     nothing for them. */

  /** `type="search"` — the keyboard shortcut chip on the trailing edge (⌘K). */
  shortcut?: ReactNode;
  /** `type="card"` — the detected card brand, shown once enough digits exist. */
  cardProvider?: ReactNode;
  /**
   * `type="password"` — wires the existing `PasswordStrength` meter under the
   * field. Pass a level, or `false` to hide it.
   */
  strength?: PasswordStrengthLevel | false;
  /** Text read out beside the strength meter, e.g. `'Strong password'`. */
  strengthLabel?: string;
  /** `type="emoji"` — the picker trigger on the leading edge. */
  emojiPicker?: ReactNode;
  /** `type="dropdown"` — an attached `<Dropdown>` sharing the field's border. */
  select?: ReactNode;
  /** `type="button"` — an attached action sharing the field's border. */
  button?: ReactNode;
  /**
   * Shows a reveal toggle on a password field. On by default — a field nobody
   * can read back is a field people get wrong twice and then paste from a
   * note. Turn it off where a shoulder is the threat model.
   */
  reveal?: boolean;
  /** Accessible name for the reveal toggle while the value is hidden. */
  revealLabel?: string;
  /** Accessible name for the reveal toggle while the value is visible. */
  hideLabel?: string;

  /** Figma's `Suffix` — muted text pinned inside the trailing edge. */
  suffix?: ReactNode;
  /** Muted text before the value — Figma's `€` on an Amount field. */
  prefix?: ReactNode;
  /**
   * Overrides which edge `select` sits on. Defaults to the type's own side:
   * `start` for Phone, `end` for Amount and Dropdown.
   */
  selectPosition?: 'start' | 'end';

  /**
   * Pins the field to left-to-right regardless of the ambient direction.
   *
   * Email addresses, URLs, IBANs, card numbers and version strings are Latin
   * even in a Persian UI: rendered RTL, a URL's slashes and dots migrate to
   * the wrong end and the value becomes unreadable while staying technically
   * correct in the DOM.
   */
  latin?: boolean;

  /** Wrapper class. Use `className` for the `<input>` itself. */
  rootClassName?: string;
  /** Class for the bordered field box. */
  fieldClassName?: string;
}
