import { forwardRef, useState, type ReactNode } from 'react';
import { RiSubtractLine, RiAddLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { formatNumber, parseLocalizedNumber } from '../../lib/numerals';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';
import { CompactButton } from '../button';
import { Icon } from '../icon';
import { textInputFieldVariants } from './text-input.styles';
import type { TextInputSize } from './text-input.types';

export interface CounterInputProps {
  /** Figma `📏 Size` — Medium (40) · Small (36) · X-Small (32). */
  size?: TextInputSize;
  /** Figma `🔖 Label`. Omit to hide. */
  label?: ReactNode;
  /** Figma `💡 Hint Text`. Omit to hide. */
  hint?: ReactNode;
  /** Marks the field invalid *and* supplies the message. Figma `State=Error`. */
  error?: ReactNode;
  required?: boolean;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Digits follow the locale, so `16` renders in Persian digits under `fa`. */
  locale?: string;
  /** Overrides the rendered value — units, currency, `2 hrs`. */
  formatValue?: (value: number) => string;
  /**
   * Accessible names for the two buttons. Required, not optional: an icon-only
   * button with no accessible name is announced as just "button".
   */
  decrementLabel: string;
  incrementLabel: string;
  id?: string;
  name?: string;
  className?: string;
  rootClassName?: string;
  fieldClassName?: string;
}

/**
 * Figma → "❖ Text Input" page, `Counter Input [1.0]`.
 * Size (40 · 36 · 32) × State (Default · Hover · Focus · Filled · Disabled · Error).
 *
 * ## Why this is a text-backed spinbutton, not `<input type="number">`
 *
 * Figma draws a Compact Button on each edge with the value centred between
 * them. Native number spinners are unstyleable and browsers disagree about
 * wheel behaviour, so the centre is a numeric text input with
 * `role="spinbutton"`. That keeps direct typing, localized digits and the
 * custom −/+ controls without a second set of browser arrows. A hidden input
 * keeps the normalized number in form submissions.
 *
 * Arrow keys work on the value itself, so the control is fully usable from the
 * keyboard without reaching for either button.
 */
export const CounterInput = forwardRef<HTMLDivElement, CounterInputProps>(
  function CounterInput(
    {
      size = 'md',
      label,
      hint,
      error,
      required,
      value,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      disabled,
      locale,
      formatValue,
      decrementLabel,
      incrementLabel,
      id,
      name,
      className,
      rootClassName,
      fieldClassName,
    },
    ref,
  ) {
    const inputId = useId(id);
    const messageId = error || hint ? `${inputId}-message` : undefined;
    const invalid = Boolean(error);

    const [count, setCount] = useControllableState<number>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    const clamp = (next: number) => Math.min(max, Math.max(min, next));
    const normalize = (next: number) => {
      if (step <= 0) return clamp(next);
      const decimals = (String(step).split('.')[1] ?? '').length;
      const snapped = Math.round((next - min) / step) * step + min;
      return clamp(Number(snapped.toFixed(decimals)));
    };
    const atMin = count <= min;
    const atMax = count >= max;

    const display = formatValue
      ? formatValue(count)
      : formatNumber(count, { locale });
    const editableDisplay = formatNumber(count, {
      locale,
      useGrouping: false,
      maximumFractionDigits: 20,
    });

    const finishEditing = () => {
      const parsed =
        draft.trim() === '' ? Number.NaN : parseLocalizedNumber(draft);
      if (Number.isFinite(parsed)) setCount(normalize(parsed));
      setEditing(false);
      setDraft('');
    };

    const stepBy = (delta: number) => {
      setEditing(false);
      setDraft('');
      setCount(clamp(count + delta));
    };

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col gap-1', rootClassName)}
      >
        {label != null && (
          <Label
            htmlFor={inputId}
            required={required}
            disabled={Boolean(disabled)}
          >
            {label}
          </Label>
        )}

        <div
          className={cn(
            textInputFieldVariants({ size, invalid }),
            'justify-between px-2',
            fieldClassName,
          )}
        >
          <CompactButton
            appearance="stroke"
            size={size === 'xs' ? 'md' : 'lg'}
            disabled={disabled || atMin}
            aria-label={decrementLabel}
            aria-controls={inputId}
            onClick={() => stepBy(-step)}
          >
            <Icon icon={RiSubtractLine} />
          </CompactButton>

          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            role="spinbutton"
            required={required}
            disabled={disabled}
            value={editing ? draft : display}
            aria-valuenow={count}
            aria-valuemin={min}
            aria-valuemax={max === Number.MAX_SAFE_INTEGER ? undefined : max}
            aria-valuetext={display}
            aria-invalid={invalid || undefined}
            aria-describedby={messageId}
            onFocus={(event) => {
              event.currentTarget.select();
              setEditing(true);
              setDraft(editableDisplay);
            }}
            onChange={(event) => {
              // Accept Latin, Persian and Arabic-Indic digits plus decimal and
              // grouping separators. Invalid characters never enter the DOM.
              if (!/^[+\-0-9۰-۹٠-٩.,٬٫\s]*$/.test(event.target.value)) return;
              setEditing(true);
              setDraft(event.target.value);
            }}
            onBlur={finishEditing}
            onKeyDown={(event) => {
              if (disabled) return;
              if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
                event.preventDefault();
                stepBy(step);
              } else if (
                event.key === 'ArrowDown' ||
                event.key === 'ArrowLeft'
              ) {
                event.preventDefault();
                stepBy(-step);
              } else if (event.key === 'Home') {
                event.preventDefault();
                setCount(min);
                setEditing(false);
              } else if (
                event.key === 'End' &&
                max !== Number.MAX_SAFE_INTEGER
              ) {
                event.preventDefault();
                setCount(max);
                setEditing(false);
              } else if (event.key === 'Enter') {
                event.preventDefault();
                finishEditing();
              }
            }}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-center tabular-nums text-strong-950',
              'rounded-md outline-none focus-visible:outline focus-visible:outline-2',
              'focus-visible:outline-offset-2 focus-visible:outline-primary-base',
              disabled && 'text-sub-300',
              className,
            )}
          />

          <CompactButton
            appearance="stroke"
            size={size === 'xs' ? 'md' : 'lg'}
            disabled={disabled || atMax}
            aria-label={incrementLabel}
            aria-controls={inputId}
            onClick={() => stepBy(step)}
          >
            <Icon icon={RiAddLine} />
          </CompactButton>
        </div>

        {name != null && <input type="hidden" name={name} value={count} />}

        {(error || hint) != null && (
          <HintText id={messageId} status={invalid ? 'error' : 'default'}>
            {error ?? hint}
          </HintText>
        )}
      </div>
    );
  },
);
