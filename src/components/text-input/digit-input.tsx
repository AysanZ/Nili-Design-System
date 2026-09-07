import {
  forwardRef,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { toLatinDigits } from '../../lib/numerals';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';

/**
 * Figma `Digit Input [1.0]` — one 80×64 cell, `State` (Default · Hover · Focus ·
 * Filled · Disabled · Error). The set is a single cell because a Figma
 * component cannot take a length; here `length` produces the row.
 */
const digitCellVariants = cva(
  [
    'h-16 w-14 rounded-[10px] border bg-white-0 text-center',
    'text-[32px] leading-8 font-medium tabular-nums text-strong-950',
    'shadow-xs outline-none transition-colors duration-150',
    'focus:outline focus:outline-2 focus:outline-offset-2',
    'disabled:cursor-not-allowed disabled:bg-weak-50 disabled:text-sub-300',
  ],
  {
    variants: {
      invalid: {
        true: 'border-error-base focus:outline-error-base',
        false:
          'border-soft-200 hover:border-sub-300 focus:border-primary-base focus:outline-primary-base',
      },
    },
    defaultVariants: { invalid: false },
  },
);

export interface DigitInputProps {
  /** How many cells. Figma draws one; the count is yours. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once the last cell is filled. */
  onComplete?: (value: string) => void;
  label?: ReactNode;
  hint?: ReactNode;
  /** Marks every cell invalid *and* supplies the message. Figma `State=Error`. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** `one-time-code` by default, which is what lets iOS and Android autofill. */
  autoComplete?: string;
  /** Accessible name for the group, e.g. `'Verification code'`. */
  groupLabel?: string;
  /** Names each cell for a screen reader: `(index, total) => string`. */
  cellLabel?: (index: string, total: string) => string;
  id?: string;
  name?: string;
  className?: string;
  rootClassName?: string;
}

/**
 * Figma → "❖ Text Input" page, `Digit Input [1.0]`. A one-time-code field.
 *
 * ## Three things that are always wrong in hand-rolled OTP fields
 *
 * - **Paste.** People receive the code and paste all six digits at once.
 *   Pasting into cell 1 fills the whole row here, rather than dropping five
 *   characters on the floor.
 * - **Persian digits.** A Persian keyboard emits them, and `parseInt` on
 *   those is `NaN`. Every keystroke is normalised through `toLatinDigits`, so
 *   the value the server sees is Latin no matter which keyboard produced it.
 * - **Direction.** The row is forced to `dir="ltr"` even inside a Persian page.
 *   A code is a number, not a sentence; reversing it under RTL changes what the
 *   user is reading.
 *
 * `inputMode="numeric"` raises the number pad on phones and
 * `autoComplete="one-time-code"` is what triggers the iOS and Android SMS
 * autofill prompt — the two attributes people most often leave off.
 *
 * ## No `autoFocus`
 *
 * OTP screens are the classic place people reach for it, and it is still the
 * wrong tool: it moves focus before a screen reader has finished announcing the
 * page, and on a phone it opens the keyboard over the very text explaining
 * where the code was sent. Focus the first cell yourself from a ref once the
 * screen has settled if you want that behaviour, so the timing is yours.
 */
export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  function DigitInput(
    {
      length = 4,
      value,
      defaultValue = '',
      onValueChange,
      onComplete,
      label,
      hint,
      error,
      required,
      disabled,
      autoComplete = 'one-time-code',
      groupLabel,
      cellLabel,
      id,
      name,
      className,
      rootClassName,
    },
    ref,
  ) {
    const fieldId = useId(id);
    const messageId = error || hint ? `${fieldId}-message` : undefined;
    const invalid = Boolean(error);
    const cells = useRef<(HTMLInputElement | null)[]>([]);

    const [code, setCode] = useControllableState<string>({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const digits = Array.from({ length }, (_, i) => code[i] ?? '');

    const write = (next: string) => {
      const trimmed = next.slice(0, length);
      setCode(trimmed);
      if (trimmed.length === length) onComplete?.(trimmed);
    };

    const focusCell = (index: number) => {
      cells.current[Math.min(Math.max(index, 0), length - 1)]?.focus();
    };

    const handleChange = (index: number, raw: string) => {
      const typed = toLatinDigits(raw).replace(/\D/g, '');
      if (!typed) return;
      const chars = code.padEnd(length, ' ').split('');
      // Typing several characters into one cell (a soft-keyboard autofill)
      // spills forward instead of keeping only the first.
      for (let i = 0; i < typed.length && index + i < length; i += 1) {
        chars[index + i] = typed[i];
      }
      write(chars.join('').trimEnd());
      focusCell(index + typed.length);
    };

    const handleKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Backspace') {
        event.preventDefault();
        const chars = code.padEnd(length, ' ').split('');
        if (chars[index] && chars[index] !== ' ') {
          chars[index] = ' ';
          write(chars.join('').trimEnd());
        } else if (index > 0) {
          chars[index - 1] = ' ';
          write(chars.join('').trimEnd());
          focusCell(index - 1);
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusCell(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusCell(index + 1);
      }
    };

    const handlePaste = (
      index: number,
      event: ClipboardEvent<HTMLInputElement>,
    ) => {
      event.preventDefault();
      const pasted = toLatinDigits(event.clipboardData.getData('text')).replace(
        /\D/g,
        '',
      );
      if (!pasted) return;
      const chars = code.padEnd(length, ' ').split('');
      for (let i = 0; i < pasted.length && index + i < length; i += 1) {
        chars[index + i] = pasted[i];
      }
      write(chars.join('').trimEnd());
      focusCell(index + pasted.length);
    };

    return (
      <div className={cn('flex w-full flex-col gap-1', rootClassName)}>
        {label != null && (
          <Label
            htmlFor={`${fieldId}-0`}
            required={required}
            disabled={Boolean(disabled)}
          >
            {label}
          </Label>
        )}

        <div
          role="group"
          aria-label={groupLabel}
          aria-describedby={messageId}
          // A code is a number. Under `dir="rtl"` the row would render
          // right-to-left and the user would read their own code backwards.
          dir="ltr"
          className={cn('flex items-center gap-2', className)}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                cells.current[index] = node;
                if (index === 0) {
                  if (typeof ref === 'function') ref(node);
                  else if (ref) ref.current = node;
                }
              }}
              id={`${fieldId}-${index}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? autoComplete : 'off'}
              maxLength={1}
              disabled={disabled}
              value={digit === ' ' ? '' : digit}
              aria-label={cellLabel?.(String(index + 1), String(length))}
              aria-invalid={invalid || undefined}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onFocus={(event) => event.target.select()}
              className={digitCellVariants({ invalid })}
            />
          ))}
        </div>

        {name != null && <input type="hidden" name={name} value={code} />}

        {(error || hint) != null && (
          <HintText id={messageId} status={invalid ? 'error' : 'default'}>
            {error ?? hint}
          </HintText>
        )}
      </div>
    );
  },
);
