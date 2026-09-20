import { forwardRef, useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';
import {
  textInputFieldVariants,
  textInputControlVariants,
  textInputAdornmentVariants,
  textInputAffixVariants,
  textInputShortcutVariants,
  textInputSuffixVariants,
  textInputPrefixVariants,
  textInputAttachedVariants,
  TEXT_INPUT_TYPE_PRESETS,
} from './text-input.styles';
import { PasswordStrength } from '../key-components/password-strength';
import type { TextInputProps } from './text-input.types';

/**
 * A single-line field: label, box, adornments and message, wired together.
 *
 * ## Why the whole field and not just a styled `<input>`
 *
 * The parts that get skipped when each app assembles its own are the ones
 * that matter: `htmlFor` on the label, `aria-describedby` on the input,
 * `aria-invalid` when it fails, and `role="alert"` on the message so a
 * validation error that appears after submit is actually announced. That last
 * one is the single most common accessibility bug in forms, and it is a
 * property of the *field*, not of the input.
 *
 * `error` is what marks the field invalid, so a red border with no message —
 * or a message beside a field that still looks fine — cannot happen.
 *
 * ## Adornments are slots
 *
 * Figma models Leading and Trailing as enums of Icon | Text | None. As props
 * that would make "an icon on one side and a unit on the other" unreachable,
 * so there are four slots instead: two inside the box (`startIcon`, `endIcon`)
 * and two attached to it (`startAffix`, `endAffix`).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      size = 'md',
      type = 'basic',
      htmlType,
      label,
      sublabel,
      information = false,
      informationLabel,
      labelAction,
      hint,
      error,
      required,
      startIcon,
      endIcon,
      startAffix,
      endAffix,
      shortcut,
      cardProvider,
      strength = false,
      strengthLabel,
      emojiPicker,
      select,
      button,
      suffix,
      prefix,
      selectPosition,
      reveal = true,
      revealLabel = 'Show password',
      hideLabel = 'Hide password',
      latin,
      disabled,
      id,
      className,
      rootClassName,
      fieldClassName,
      dir,
      ...rest
    },
    ref,
  ) {
    const inputId = useId(id);
    const messageId = error || hint ? `${inputId}-message` : undefined;
    const invalid = Boolean(error);
    const strengthId = strength !== false ? `${inputId}-strength` : undefined;

    // Figma's Type is a preset. Anything the caller passes explicitly wins, so
    // the table sets a floor rather than a ceiling.
    const preset = TEXT_INPUT_TYPE_PRESETS[type] ?? {};

    /* A password field with no way to see what you typed is a field people get
       wrong twice and then paste from a note. The toggle is on by default
       because that is the right default, and off is one prop away for the
       rare screen where a shoulder is the threat model.

       It is a button rather than a checkbox: it performs an action on the
       field, it does not record a preference, and it must not be reachable as
       a form value. */
    const [revealed, setRevealed] = useState(false);
    const isPassword = (htmlType ?? preset.htmlType) === 'password';
    const showReveal =
      isPassword && reveal && endIcon == null && button == null;
    const isLatin = latin ?? preset.latin ?? false;

    // The leading edge can be an emoji picker or an attached dropdown; the
    // trailing edge a shortcut chip, a card brand, a suffix or a button. None
    // of them costs anything when the slot is empty.
    // Figma puts the country code before a phone number and the currency
    // after an amount, so the side comes from the type unless overridden.
    const selectSide = selectPosition ?? preset.selectSide ?? 'end';
    const leadingAttached = selectSide === 'start' ? select : undefined;
    const trailingAttached =
      type === 'button' ? button : selectSide === 'end' ? select : undefined;

    return (
      <div className={cn('flex w-full flex-col gap-1', rootClassName)}>
        {label != null && (
          <Label
            htmlFor={inputId}
            required={required}
            sublabel={sublabel}
            information={information}
            informationLabel={informationLabel}
            hint={labelAction}
            disabled={Boolean(disabled)}
          >
            {label}
          </Label>
        )}

        <div
          className={cn(
            textInputFieldVariants({ size, invalid }),
            fieldClassName,
          )}
        >
          {startAffix != null && (
            <span className={textInputAffixVariants({ side: 'start', size })}>
              {startAffix}
            </span>
          )}
          {leadingAttached != null && (
            <span className={textInputAttachedVariants({ side: 'start' })}>
              {leadingAttached}
            </span>
          )}
          {emojiPicker != null && (
            <span
              className={textInputAdornmentVariants({ side: 'start', size })}
            >
              {emojiPicker}
            </span>
          )}
          {startIcon != null && (
            <span
              className={textInputAdornmentVariants({ side: 'start', size })}
            >
              {startIcon}
            </span>
          )}

          {prefix != null && (
            <span className={cn(textInputPrefixVariants(), 'ps-3')}>
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={
              showReveal && revealed
                ? 'text'
                : (htmlType ?? preset.htmlType ?? 'text')
            }
            inputMode={rest.inputMode ?? preset.inputMode}
            autoComplete={rest.autoComplete ?? preset.autoComplete}
            pattern={rest.pattern ?? preset.pattern}
            step={rest.step ?? preset.step}
            required={required}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={
              [messageId, strengthId].filter(Boolean).join(' ') || undefined
            }
            // Latin values stay LTR even in a Persian UI: rendered RTL, a URL's
            // slashes and dots migrate to the wrong end.
            dir={dir ?? (isLatin ? 'ltr' : undefined)}
            /* An address, a URL or a card number is not prose, and the browser
               underlining it in red reads as an error the field never
               reported. Explicit rather than left to the browser, because the
               browsers disagree about which input types they check. */
            spellCheck={rest.spellCheck ?? (isLatin ? false : undefined)}
            className={cn(textInputControlVariants({ size }), className)}
            {...rest}
          />

          {suffix != null && (
            <span className={textInputSuffixVariants()}>{suffix}</span>
          )}
          {cardProvider != null && (
            <span
              aria-hidden
              className={textInputAdornmentVariants({ side: 'end', size })}
            >
              {cardProvider}
            </span>
          )}
          {endIcon != null && (
            <span className={textInputAdornmentVariants({ side: 'end', size })}>
              {endIcon}
            </span>
          )}
          {showReveal && (
            <button
              type="button"
              // `tabIndex={-1}` deliberately not set: someone navigating by
              // keyboard is exactly who needs to check what they typed.
              onClick={() => setRevealed((shown) => !shown)}
              aria-label={revealed ? hideLabel : revealLabel}
              aria-pressed={revealed}
              disabled={disabled}
              className={cn(
                textInputAdornmentVariants({ side: 'end', size }),
                'cursor-pointer text-soft-400 transition-colors hover:text-sub-600',
                'focus-visible:outline-none focus-visible:text-primary-base',
                'disabled:cursor-default disabled:text-disabled-300',
              )}
            >
              {revealed ? (
                <RiEyeOffLine aria-hidden />
              ) : (
                <RiEyeLine aria-hidden />
              )}
            </button>
          )}
          {endAffix != null && (
            <span className={textInputAffixVariants({ side: 'end', size })}>
              {endAffix}
            </span>
          )}
          {shortcut != null && (
            <span
              aria-hidden
              className={cn(
                textInputAdornmentVariants({ side: 'end', size }),
                'pointer-events-none',
              )}
            >
              <span className={textInputShortcutVariants()}>{shortcut}</span>
            </span>
          )}
          {trailingAttached != null && (
            <span
              className={cn(
                textInputAttachedVariants({ side: 'end' }),
                // A button is shorter than the field and needs the same 4px
                // breathing room on every edge. Selects intentionally stay
                // flush because their surface is part of the field frame.
                type === 'button' && 'p-1',
              )}
            >
              {trailingAttached}
            </span>
          )}
        </div>

        {strength !== false && (
          <PasswordStrength
            id={strengthId}
            strength={strength}
            label={strengthLabel}
          />
        )}

        {(error || hint) && (
          <HintText
            id={messageId}
            status={invalid ? 'error' : disabled ? 'disabled' : 'default'}
            icon={invalid}
          >
            {error ?? hint}
          </HintText>
        )}
      </div>
    );
  },
);
