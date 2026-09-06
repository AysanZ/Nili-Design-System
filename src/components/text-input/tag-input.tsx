import {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';
import { Tag } from '../tag';
import {
  textInputFieldVariants,
  textInputControlVariants,
  textInputAdornmentVariants,
} from './text-input.styles';
import type { TextInputSize } from './text-input.types';

export interface TagInputProps {
  /** Figma `📏 Size` — Medium (40) · Small (36) · X-Small (32). */
  size?: TextInputSize;
  /** Figma `🔖 Label`. Omit to hide. */
  label?: ReactNode;
  /** Figma `💡 Hint Text`. Omit to hide. */
  hint?: ReactNode;
  /** Marks the field invalid *and* supplies the message. Figma `State=Error`. */
  error?: ReactNode;
  required?: boolean;
  /** Figma `⬅️ Left Icon` / `⬅️ Pick Left`. */
  startIcon?: ReactNode;
  /** The tags. Controlled. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Refuses to add beyond this many. */
  maxTags?: number;
  /** Accessible name for each tag's dismiss button, e.g. `'حذف'`. */
  dismissLabel?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  rootClassName?: string;
  fieldClassName?: string;
}

/**
 * Figma → "❖ Text Input" page, `Tag Input [1.0]`.
 * Size (40 · 36 · 32) × State (Default · Hover · Focus · Filled · Disabled · Error).
 *
 * The committed tags sit in a row *below* the field, which is what the Figma
 * `Tags` frame draws — not inside the box. That keeps the field height fixed
 * across all three sizes instead of growing as tags accumulate, and it means a
 * long tag wraps to a second row rather than squeezing the caret out of view.
 *
 * ## Keyboard
 *
 * Enter and comma commit the draft; Backspace on an empty field removes the
 * last tag. Both are what people already expect from every tag field they have
 * used, and neither is discoverable from looking at the control — which is
 * precisely why they belong in the component rather than in each app.
 *
 * The tags sit in a `<ul>`, whose implicit list role makes a screen reader
 * announce how many there are before reading them. The input is described by
 * that list, so the count is heard on focus rather than only after tabbing
 * through every tag.
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  function TagInput(
    {
      size = 'md',
      label,
      hint,
      error,
      required,
      startIcon,
      value,
      defaultValue = [],
      onValueChange,
      placeholder,
      maxTags,
      dismissLabel,
      disabled,
      id,
      name,
      className,
      rootClassName,
      fieldClassName,
    },
    ref,
  ) {
    const inputId = useId(id);
    const listId = `${inputId}-tags`;
    const messageId = error || hint ? `${inputId}-message` : undefined;
    const invalid = Boolean(error);

    const [tags, setTags] = useControllableState<string[]>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const [draft, setDraft] = useState('');
    const innerRef = useRef<HTMLInputElement | null>(null);

    const commit = () => {
      const next = draft.trim();
      if (!next) return;
      if (tags.includes(next)) {
        setDraft('');
        return;
      }
      if (maxTags != null && tags.length >= maxTags) return;
      setTags([...tags, next]);
      setDraft('');
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        commit();
        return;
      }
      if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
        setTags(tags.slice(0, -1));
      }
    };

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
            textInputFieldVariants({ size, invalid }),
            fieldClassName,
          )}
        >
          {startIcon != null && (
            <span
              className={textInputAdornmentVariants({ side: 'start', size })}
            >
              {startIcon}
            </span>
          )}
          <input
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={inputId}
            name={name}
            type="text"
            autoComplete="off"
            value={draft}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={
              [messageId, tags.length ? listId : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            className={cn(textInputControlVariants({ size }), className)}
          />
        </div>

        {tags.length > 0 && (
          <ul id={listId} className="flex flex-wrap items-center gap-2 pt-1">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag
                  dismissLabel={dismissLabel}
                  disabled={disabled}
                  onDismiss={() => {
                    setTags(tags.filter((item) => item !== tag));
                    innerRef.current?.focus();
                  }}
                >
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}

        {(error || hint) != null && (
          <HintText id={messageId} status={invalid ? 'error' : 'default'}>
            {error ?? hint}
          </HintText>
        )}
      </div>
    );
  },
);
