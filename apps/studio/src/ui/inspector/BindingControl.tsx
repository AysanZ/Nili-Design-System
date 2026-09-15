import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { compile, evaluateSource } from '../../expr';
import type { Scope } from '../../expr';
import type { Completion } from '../../logic/scope';

/** The fragment being typed, so the suggestions narrow as you go. */
function fragmentAt(source: string, caret: number): { text: string; start: number } {
  const before = source.slice(0, caret);
  const match = /[A-Za-z_$][A-Za-z0-9_$.]*$/.exec(before);
  if (!match) return { text: '', start: caret };
  return { text: match[0], start: caret - match[0].length };
}

const ORIGIN_LABEL: Record<Completion['origin'], string> = {
  param: 'property',
  item: 'row',
  global: 'built-in',
};

function preview(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? '' : 's'}`;
  if (typeof value === 'object') return Object.keys(value as object).slice(0, 3).join(', ') || 'object';
  return String(value);
}

interface ExpressionInputProps {
  value: string;
  onChange: (value: string) => void;
  completions: Completion[];
  scope: Scope;
  placeholder?: string;
  rows?: number;
}

/**
 * A plain textarea with a filtered list under it.
 *
 * A code editor was the obvious thing and would have been the wrong one: the
 * expressions people write here are one line, and the useful help is not
 * syntax colouring but knowing which names exist and what this one currently
 * evaluates to. Both are shown; neither needs a parser running per keystroke
 * in a worker.
 */
export function ExpressionInput({
  value, onChange, completions, scope, placeholder, rows = 2,
}: ExpressionInputProps): JSX.Element {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [caret, setCaret] = useState(value.length);
  const [highlighted, setHighlighted] = useState(0);

  const fragment = fragmentAt(value, caret);
  const suggestions = useMemo(() => {
    const needle = fragment.text.toLowerCase();
    const pool = needle
      ? completions.filter((entry) => entry.name.toLowerCase().startsWith(needle) && entry.name !== fragment.text)
      : completions;
    return pool.slice(0, 6);
  }, [completions, fragment.text]);

  const result = useMemo(() => {
    if (!value.trim()) return null;
    const parsed = compile(value);
    if (!parsed.ok) return { error: parsed.error.message };
    return evaluateSource(value, scope);
  }, [value, scope]);

  const accept = (name: string): void => {
    const next = value.slice(0, fragment.start) + name + value.slice(caret);
    onChange(next);
    const position = fragment.start + name.length;
    window.requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(position, position);
      setCaret(position);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlighted((index) => (index + 1) % suggestions.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlighted((index) => (index - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (event.key === 'Tab' || (event.key === 'Enter' && fragment.text)) {
      const pick = suggestions[highlighted] ?? suggestions[0];
      if (!pick) return;
      event.preventDefault();
      accept(pick.name);
    }
  };

  const track = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setCaret(event.target.selectionStart ?? event.target.value.length);
    onChange(event.target.value);
  };

  return (
    <div className="expr">
      <textarea
        ref={ref}
        className={`input input--code expr__input${result && 'error' in result && result.error ? ' input--invalid' : ''}`}
        value={value}
        rows={rows}
        spellCheck={false}
        placeholder={placeholder ?? 'search.length > 0'}
        onChange={track}
        onKeyDown={onKeyDown}
        onKeyUp={(event) => setCaret(event.currentTarget.selectionStart ?? 0)}
        onClick={(event) => setCaret(event.currentTarget.selectionStart ?? 0)}
      />

      {suggestions.length ? (
        <ul className="expr__list">
          {suggestions.map((entry, index) => (
            <li key={entry.name}>
              <button
                type="button"
                className={index === highlighted ? 'is-highlighted' : undefined}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => accept(entry.name)}
              >
                <code>{entry.name}</code>
                <em>{entry.type}</em>
                <span>{ORIGIN_LABEL[entry.origin]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {result ? (
        'error' in result && result.error ? (
          <p className="expr__result expr__result--error">{result.error}</p>
        ) : (
          <p className="expr__result">
            <span>now</span>
            <code>{preview((result as { value: unknown }).value)}</code>
          </p>
        )
      ) : null}
    </div>
  );
}
