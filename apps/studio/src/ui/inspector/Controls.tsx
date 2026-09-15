import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { PropValue } from '../../document/types';
import type { TextValue } from '../../i18n/types';
import { isText, keyRef, literal } from '../../i18n/catalog';

interface FieldProps {
  label: string;
  propKey: string;
  doc?: string | null;
  invalid?: boolean;
  /**
   * Present on every prop that can hold an expression. The switch lives on the
   * field rather than inside each control, which is why adding bindings did
   * not mean touching the select, the swatch row, the number stepper and the
   * icon picker one at a time.
   */
  bindable?: { bound: boolean; onToggle: (bound: boolean) => void };
  /**
   * Turns this prop into one of the component's properties, in one click.
   *
   * This is the gesture that replaced the data layer. A flag nobody has
   * decided — is this loading, is this in error — used to need a variable
   * somewhere else and a binding back to here. Now it stops being a value and
   * becomes part of what the component asks for.
   */
  expose?: () => void;
  children: React.ReactNode;
}

export function Field({ label, propKey, doc, invalid, bindable, expose, children }: FieldProps): JSX.Element {
  return (
    <div className={`field${invalid ? ' field--invalid' : ''}${bindable?.bound ? ' field--bound' : ''}`}>
      <div className="field__head">
        <span className="field__label">{label}</span>
        {doc ? <abbr className="field__doc" title={doc}>?</abbr> : null}
        <span className="field__spacer" />
        {expose ? (
          <button
            type="button"
            className="expose"
            title="Leave this to whoever places the component"
            onClick={expose}
          >
            +prop
          </button>
        ) : null}
        {bindable ? (
          <button
            type="button"
            className="fx"
            aria-pressed={bindable.bound}
            title={bindable.bound ? 'Back to a fixed value' : 'Compute it from a property'}
            onClick={() => bindable.onToggle(!bindable.bound)}
          >
            fx
          </button>
        ) : null}
        <code className="field__key">{propKey}</code>
      </div>
      {children}
    </div>
  );
}

/** The toggle on its own, for when it sits inside a `Field` rather than a row. */
export function BoolSwitch({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }): JSX.Element {
  return <button type="button" className="toggle" aria-pressed={value} onClick={() => onChange(!value)} />;
}

interface OptionsProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SWATCHES: Record<string, string> = {
  primary: '#335CFF', neutral: '#0E121B', error: '#FB3748', success: '#1FC16B', basic: '#E1E4EA',
  blue: '#335CFF', green: '#1FC16B', red: '#FB3748', orange: '#FF9147', purple: '#7D52F4',
  gray: '#717784', yellow: '#F6B51E', sky: '#47C2FF', pink: '#FB4BA3', teal: '#22D3BB',
  soft: '#E1E4EA', warning: '#FF9147', information: '#335CFF', feature: '#7D52F4',
};

/** The control shape follows the option count: swatches, segments, chips, then
 *  a select once a row of buttons would wrap past readability. */
export function OptionControl({ value, options, onChange, swatch }: OptionsProps & { swatch?: boolean }): JSX.Element {
  if (swatch && options.every((o) => SWATCHES[o])) {
    return (
      <div className="swatches">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            title={option}
            aria-pressed={value === option}
            className="swatch"
            style={{ background: SWATCHES[option] }}
            onClick={() => onChange(option)}
          />
        ))}
      </div>
    );
  }

  if (options.length <= 4 && options.every((o) => o.length <= 9)) {
    return (
      <div className="segments">
        {options.map((option) => (
          <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (options.length <= 6) {
    return (
      <div className="chips">
        {options.map((option) => (
          <button key={option} type="button" className="chip" aria-pressed={value === option} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select className="select" value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

export function BooleanControl({ label, propKey, value, onChange }: {
  label: string; propKey: string; value: boolean; onChange: (value: boolean) => void;
}): JSX.Element {
  const id = useId();
  return (
    <div className="toggle-row">
      <label htmlFor={id}>
        {label} <code className="field__key">{propKey}</code>
      </label>
      <button id={id} type="button" className="toggle" aria-pressed={value} onClick={() => onChange(!value)} />
    </div>
  );
}

export function NumberControl({ value, onChange, min, step }: {
  value: number; onChange: (value: number) => void; min?: number; step?: number;
}): JSX.Element {
  return (
    <input
      className="input input--mono"
      type="number"
      value={value}
      min={min ?? 0}
      step={step ?? 1}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
}

interface TextControlProps {
  value: TextValue;
  onChange: (value: TextValue) => void;
  /** Keys already present in the catalogues, offered as suggestions. */
  suggestions: string[];
  missing?: boolean;
}

/**
 * The only control that is not a straight prop editor. A text prop can hold a
 * literal or a catalogue key, and the switch between them is the whole reason
 * a document can be authored once and shipped in several languages.
 */
export function TextControl({ value, onChange, suggestions, missing }: TextControlProps): JSX.Element {
  const listId = useId();
  const isKey = value.kind === 'key';

  return (
    <div className="text-control">
      <div className="text-control__mode">
        <button type="button" aria-pressed={!isKey} onClick={() => onChange(literal(isKey ? value.key : value.value))}>
          Text
        </button>
        <button type="button" aria-pressed={isKey} onClick={() => onChange(keyRef(isKey ? value.key : value.value))}>
          Key
        </button>
      </div>
      {isKey ? (
        <>
          <input
            className={`input input--mono${missing ? ' input--invalid' : ''}`}
            list={listId}
            value={value.key}
            placeholder="section.key"
            onChange={(e) => onChange(keyRef(e.target.value))}
          />
          <datalist id={listId}>
            {suggestions.map((key) => (
              <option key={key} value={key} />
            ))}
          </datalist>
        </>
      ) : (
        <input className="input" value={value.value} onChange={(e) => onChange(literal(e.target.value))} />
      )}
    </div>
  );
}

const NAMED: Record<string, string> = { currentColor: '#808080', inherit: '#808080', transparent: '#00000000' };

export function ColourControl({ value, onChange }: { value: string; onChange: (value: string) => void }): JSX.Element {
  const swatch = /^#[0-9a-f]{6}$/i.test(value) ? value : NAMED[value] ?? '#808080';
  return (
    <div className="colour-control">
      <span className="colour-control__swatch" style={{ background: value || 'transparent' }}>
        <input type="color" aria-label="Pick a colour" value={swatch} onChange={(e) => onChange(e.target.value)} />
      </span>
      <input
        className="input input--mono"
        value={value}
        placeholder="currentColor"
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button type="button" className="colour-control__clear" aria-label="Clear colour" onClick={() => onChange('')}>
          ×
        </button>
      ) : null}
    </div>
  );
}

export const asText = (value: PropValue): TextValue =>
  isText(value) ? value : literal(typeof value === 'string' ? value : '');


/**
 * A list or an object, edited as JSON.
 *
 * It commits only when the text parses, so typing a `[` never destroys what
 * was there. The alternative — dropping these props — is what made
 * `ColorPicker` look like it had no swatches and `Pagination` like it had no
 * page sizes.
 */
export function JsonControl({ value, onChange }: {
  value: unknown;
  onChange: (value: unknown) => void;
}): JSX.Element {
  const [draft, setDraft] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [broken, setBroken] = useState(false);

  return (
    <textarea
      className={`input input--code${broken ? ' input--invalid' : ''}`}
      value={draft}
      rows={4}
      spellCheck={false}
      onChange={(event) => {
        setDraft(event.target.value);
        try {
          onChange(JSON.parse(event.target.value) as unknown);
          setBroken(false);
        } catch {
          setBroken(true);
        }
      }}
    />
  );
}
