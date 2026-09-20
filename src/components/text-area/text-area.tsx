import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useDirection } from '../../providers/direction';
import { formatNumber } from '../../lib/numerals';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';
import {
  textAreaFieldVariants,
  textAreaControlVariants,
  textAreaFooterVariants,
  textAreaCounterVariants,
} from './text-area.styles';
import type { TextAreaProps } from './text-area.types';

/**
 * A multi-line field.
 *
 * ## The counter counts what the user sees
 *
 * Length is measured with `Array.from(value).length`, not `value.length`.
 * `String.length` counts UTF-16 code units, so an emoji costs two and a
 * Persian word with a zero-width non-joiner costs one more than its letters —
 * a user typing a word with a ZWNJ would watch the counter jump ahead of their
 * fingers. `Array.from` iterates code points, which is much closer to what a
 * reader would call a character.
 *
 * ## `maxLength` and `countLimit` are different things
 *
 * `maxLength` is a hard stop: the browser refuses the next keystroke, which is
 * hostile when someone pastes a paragraph and silently loses the end of it.
 * `countLimit` is a *soft* limit — the counter turns red and the form can
 * refuse to submit, but the text survives so it can be edited down. Prefer the
 * soft one for prose and keep `maxLength` for fields with a real technical
 * ceiling.
 *
 * ## Accessibility
 *
 * Label, message and field are wired together here rather than in each app:
 * `htmlFor`, `aria-describedby`, `aria-invalid`, and `role="alert"` on the
 * error, so a validation message that appears after submit is announced. The
 * counter is a polite live region, so it is heard on pause rather than on
 * every keystroke.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      hint,
      error,
      resize = 'vertical',
      autoResize = false,
      maxRows = 10,
      showCount = false,
      countLimit,
      formatCount,
      locale: localeProp,
      required,
      disabled,
      rows = 4,
      id,
      value,
      defaultValue,
      onChange,
      className,
      rootClassName,
      fieldClassName,
      ...rest
    },
    forwardedRef,
  ) {
    const { locale: ambientLocale } = useDirection();
    const locale = localeProp ?? ambientLocale;
    const inputId = useId(id);
    const messageId = error || hint ? `${inputId}-message` : undefined;
    const invalid = Boolean(error);

    const innerRef = useRef<HTMLTextAreaElement>(null);
    const setRefs = (node: HTMLTextAreaElement | null) => {
      (innerRef as { current: HTMLTextAreaElement | null }).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as { current: HTMLTextAreaElement | null }).current =
          node;
    };

    // Code points, not UTF-16 code units: an emoji is one character to the
    // person typing it, and two to `String.length`.
    const measure = (input: unknown) =>
      typeof input === 'string' ? Array.from(input).length : 0;

    const [used, setUsed] = useState(() =>
      measure(value ?? defaultValue ?? ''),
    );
    useEffect(() => {
      if (value !== undefined) setUsed(measure(value));
    }, [value]);

    const grow = useCallback(() => {
      const node = innerRef.current;
      if (!node || !autoResize) return;
      node.style.height = 'auto';
      const lineHeight = Number.parseFloat(
        getComputedStyle(node).lineHeight || '20',
      );
      const max = lineHeight * maxRows;
      node.style.height = `${Math.min(node.scrollHeight, max)}px`;
      node.style.overflowY = node.scrollHeight > max ? 'auto' : 'hidden';
    }, [autoResize, maxRows]);

    useEffect(grow, [grow, value]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setUsed(measure(event.target.value));
      grow();
      onChange?.(event);
    };

    const limit = countLimit ?? rest.maxLength;
    const over = limit !== undefined && used > limit;
    const format = (input: number) => formatNumber(input, { locale });
    const counter =
      limit === undefined
        ? format(used)
        : (formatCount ?? ((a, b) => `${a}/${b}`))(format(used), format(limit));

    return (
      <div className={cn('flex w-full flex-col gap-1', rootClassName)}>
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
            textAreaFieldVariants({ invalid: invalid || over }),
            fieldClassName,
          )}
        >
          <textarea
            ref={setRefs}
            id={inputId}
            rows={rows}
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={invalid || over || undefined}
            aria-describedby={messageId}
            className={cn(
              textAreaControlVariants({
                resize: autoResize ? 'none' : resize,
              }),
              className,
            )}
            {...rest}
          />

          {showCount && (
            <div className={textAreaFooterVariants()}>
              {/*
                Polite, so the count is heard on a pause rather than after
                every keystroke — an assertive counter makes the field
                unusable with a screen reader.
              */}
              <span
                aria-live="polite"
                className={textAreaCounterVariants({ over, disabled })}
              >
                {counter}
              </span>
            </div>
          )}
        </div>

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
