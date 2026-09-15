import { useEffect, useMemo, useRef, useState } from 'react';
import { useStudio } from '../document/StudioContext';
import { branchValues, conditionHolds, describeCondition } from '../logic/types';
import type { ComponentParam, Json } from '../logic/types';
import type { ComponentDef, ComponentState } from '../document/types';

/**
 * What a state is, said in the one place you make one.
 *
 * A state used to be created empty by a `+` and named by typing into the chip
 * itself, which grew under the cursor and never said what it was for. The
 * thing being described is not a label — it is *a set of property values*, and
 * the name is what you call the result. So the dialog asks for both, in that
 * order, and shows which properties even exist once the others are pinned.
 *
 * That last part is not decoration. A property can be switched off by a
 * condition on another one, so the list here changes as you fill it in: turn
 * `error` on and `errorLabel` appears, because that is exactly when the
 * component has one.
 */
export function StateDialog({ component, state, onClose }: {
  component: ComponentDef;
  /** The state being edited, or null to create one. */
  state: ComponentState | null;
  onClose: () => void;
}): JSX.Element {
  const { dispatch } = useStudio();
  const [values, setValues] = useState<Record<string, Json>>(state?.values ?? {});
  const [name, setName] = useState(state?.name ?? '');
  const [named, setNamed] = useState(Boolean(state));
  const nameField = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    nameField.current?.select();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* The values the component has while this dialog's draft is applied — what
     every condition is read against, and what makes the list below live. */
  const resolved = useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const param of component.params) {
      out[param.name] = param.name in values ? values[param.name] : param.sample;
    }
    return out;
  }, [component.params, values]);

  const settable = component.params.filter((param) => param.type !== 'action' && param.type !== 'slot');
  const active = settable.filter((param) => conditionHolds(param.when, resolved));
  const dormant = settable.filter((param) => !conditionHolds(param.when, resolved));

  /* Until the person types a name, the name follows what they have pinned.
     "Email invalid" is what they would have written anyway, and a state
     called `State 3` is a state nobody can find again. */
  const suggested = useMemo(() => suggestName(component, values), [component, values]);
  const finalName = named && name.trim() ? name.trim() : suggested;

  const pin = (param: ComponentParam, on: boolean): void =>
    setValues((current) => {
      const next = { ...current };
      if (on) next[param.name] = param.sample;
      else delete next[param.name];
      return next;
    });

  const set = (param: ComponentParam, value: Json): void =>
    setValues((current) => ({ ...current, [param.name]: value }));

  const save = (): void => {
    /* A value pinned while its property was switched on, and left behind
       after it was switched off, describes something the generated type
       forbids. Dropping it here is quieter than a warning nobody reads. */
    const kept: Record<string, Json> = {};
    for (const param of active) if (param.name in values) kept[param.name] = values[param.name] as Json;

    if (state) dispatch({ type: 'patchState', componentId: component.id, id: state.id, patch: { name: finalName, values: kept } });
    else dispatch({ type: 'addState', componentId: component.id, name: finalName, values: kept });
    onClose();
  };

  const pinned = active.filter((param) => param.name in values);

  return (
    <div className="dialog" role="presentation" onMouseDown={(event) => {
      if (!box.current?.contains(event.target as Node)) onClose();
    }}>
      <div className="dialog__box" ref={box} role="dialog" aria-modal="true" aria-label={state ? 'Edit state' : 'New state'}>
        <header className="dialog__head">
          <strong>{state ? 'Edit state' : 'New state'}</strong>
          <button type="button" className="dialog__x" aria-label="Close" onClick={onClose}>×</button>
        </header>

        <p className="dialog__lede">
          A state is a set of property values and a name for the result. The canvas draws it, the
          export writes a story for it, and the linter can ask whether you designed it.
        </p>

        <div className="dialog__body">
          <label className="row">
            <span className="row__label">Name</span>
            <input
              ref={nameField}
              className="input"
              value={named ? name : suggested}
              placeholder={suggested}
              onChange={(event) => {
                setNamed(true);
                setName(event.target.value);
              }}
            />
          </label>

          <div className="row">
            <span className="row__label">
              Set these properties
              <em title="Anything you leave alone keeps the value the canvas is showing.">?</em>
            </span>

            {active.length === 0 ? (
              <p className="note note--quiet">
                This component takes nothing yet, so there is only one appearance to draw. Add a
                property under Props first.
              </p>
            ) : (
              <ul className="dialog__params">
                {active.map((param) => {
                  const on = param.name in values;
                  const value = on ? values[param.name] : param.sample;
                  return (
                    <li key={param.id} className={on ? 'is-on' : ''}>
                      <button
                        type="button"
                        className="row__pin"
                        aria-pressed={on}
                        aria-label={`Set ${param.name} in this state`}
                        onClick={() => pin(param, !on)}
                      />
                      <code>{param.name}</code>
                      {param.when ? (
                        <span className="dialog__because" title={`Only exists while ${describeCondition(param.when)}`}>
                          needs {describeCondition(param.when)}
                        </span>
                      ) : null}
                      {on ? (
                        <ValueInput param={param} value={value as Json} onChange={(next) => set(param, next)} />
                      ) : (
                        <span className="row__inherit">same as default</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {dormant.length ? (
            <p className="note note--quiet">
              {dormant.map((param) => param.name).join(', ')}{' '}
              {dormant.length === 1 ? 'is not part of' : 'are not part of'} this state — {' '}
              {dormant.length === 1 ? 'it needs' : 'they need'}{' '}
              {[...new Set(dormant.map((param) => describeCondition(param.when!)))].join(', ')}.
            </p>
          ) : null}
        </div>

        <footer className="dialog__foot">
          <span className="dialog__summary">
            {pinned.length
              ? `${pinned.length} propert${pinned.length === 1 ? 'y' : 'ies'} set`
              : 'Nothing set — this will look the same as Default'}
          </span>
          <button type="button" className="action" onClick={onClose}>Cancel</button>
          <button type="button" className="dialog__save" onClick={save}>
            {state ? 'Save' : 'Add state'}
          </button>
        </footer>
      </div>
    </div>
  );
}

/** `{ emailInvalid: true }` → `Email invalid`; `{ size: 'sm' }` → `Sm`. */
function suggestName(component: ComponentDef, values: Record<string, Json>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(values)) {
    const words = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
    if (value === true) parts.push(words);
    else if (value === false) parts.push(`no ${words}`);
    else if (typeof value === 'string' && value) parts.push(value);
    else if (typeof value === 'number') parts.push(`${words} ${value}`);
  }
  if (!parts.length) return `State ${(component.states?.length ?? 0) + 1}`;
  const joined = parts.slice(0, 2).join(' · ');
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

function ValueInput({ param, value, onChange }: {
  param: ComponentParam;
  value: Json;
  onChange: (value: Json) => void;
}): JSX.Element {
  const choices = param.options?.length ? param.options : null;

  if (choices) {
    return (
      <select className="select select--sm" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)}>
        {choices.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (param.type === 'boolean') {
    return (
      <div className="segments segments--sm">
        <button type="button" aria-pressed={!value} onClick={() => onChange(false)}>false</button>
        <button type="button" aria-pressed={Boolean(value)} onClick={() => onChange(true)}>true</button>
      </div>
    );
  }

  if (param.type === 'number') {
    return (
      <input
        className="input input--mono input--sm"
        type="number"
        value={typeof value === 'number' ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    );
  }

  if (param.type === 'text') {
    return (
      <input
        className="input input--sm"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  /* A list or an object is pinned, not typed: the JSON editor beside the
     property itself is the place for that, and a second copy here would be a
     worse one in a smaller box. */
  return (
    <span className="run__pill run__pill--idle">
      {Array.isArray(value) ? `${value.length} rows` : 'object'}
    </span>
  );
}

/** Whether a state's values still describe something the contract allows. */
export const stateIsCoherent = (component: ComponentDef, state: ComponentState): boolean => {
  const resolved: Record<string, unknown> = {};
  for (const param of component.params) {
    resolved[param.name] = param.name in state.values ? state.values[param.name] : param.sample;
  }
  return component.params
    .filter((param) => param.name in state.values)
    .every((param) => conditionHolds(param.when, resolved));
};

export { branchValues };
