import { useMemo, useState } from 'react';
import { useStudio } from '../../document/StudioContext';
import {
  CONDITION_OPS, PARAM_TYPES, branchValues, controllerParams, describeCondition,
} from '../../logic/types';
import type { ComponentParam, ConditionOp, Json, ParamCondition, ParamType } from '../../logic/types';
import type { ComponentDef, ComponentState } from '../../document/types';
import { isIdentifier } from '../../logic/scope';
import { contractOf } from '../../codegen/contract';
import { Section } from '../Section';
import { StateDialog } from '../StateDialog';

/**
 * A component's whole API, and the only panel that is about the component
 * rather than about a thing inside it.
 *
 * It moved to the right for that reason. On the left it sat beside Layers and
 * Images — a list of what the document contains — which made the contract
 * look like one more piece of furniture. It is the output.
 *
 * Every property is one line until you open it. Fifteen properties used to be
 * fifteen stacked editors and a thousand pixels of scroll; now it is fifteen
 * lines and the one you are working on.
 */
export function PropsPanel(): JSX.Element {
  const { component, dispatch } = useStudio();
  const [open, setOpen] = useState<string | null>(null);

  /* Declaration order, except a dependent property follows the one it depends
     on. The tie between them is the thing that is hard to see in a flat list,
     and it is the whole reason conditions exist. */
  const ordered = useMemo(() => order(component.params), [component.params]);

  return (
    <div className="props">
      <Contract component={component} />

      <Section id="params" title="Properties" badge={String(component.params.length)}>
        {component.params.length === 0 ? (
          <p className="note note--quiet">
            Nothing yet. Add one here, or press <code>+prop</code> on any field in Design to turn
            what you are looking at into part of the API.
          </p>
        ) : null}

        <div className="plist">
          {ordered.map((param) => (
            <PropRow
              key={param.id}
              param={param}
              params={component.params}
              component={component}
              open={open === param.id}
              onToggle={() => setOpen(open === param.id ? null : param.id)}
            />
          ))}
        </div>

        <button
          type="button"
          className="action action--dashed"
          onClick={() => dispatch({ type: 'addParam', componentId: component.id })}
        >
          + Add property
        </button>
      </Section>

      <StatesSection component={component} />
    </div>
  );
}

/** Controllers first, each trailed by what it switches on. */
function order(params: ComponentParam[]): ComponentParam[] {
  const dependents = new Map<string, ComponentParam[]>();
  for (const param of params) {
    if (!param.when) continue;
    dependents.set(param.when.param, [...(dependents.get(param.when.param) ?? []), param]);
  }
  const out: ComponentParam[] = [];
  for (const param of params) {
    if (param.when && params.some((item) => item.name === param.when?.param)) continue;
    out.push(param, ...(dependents.get(param.name) ?? []));
  }
  /* Anything pointing at a property that does not exist would vanish from the
     list otherwise, which is the worst possible response to a broken
     reference. It goes at the end, and the linter says why. */
  for (const param of params) if (!out.includes(param)) out.push(param);
  return out;
}

/* ───────────────────────────  the contract  ─────────────────────────── */

/**
 * The generated type, at the top, always.
 *
 * What this tool makes is a typed component. Showing the type as it is being
 * assembled is the difference between designing an API and finding out what
 * you designed after export.
 */
function Contract({ component }: { component: ComponentDef }): JSX.Element {
  const contract = useMemo(() => contractOf(component), [component]);
  const { dispatch, state } = useStudio();

  return (
    <div className="contract">
      <div className="contract__head">
        <strong>{component.component}</strong>
        <span className="contract__file">{component.component}.tsx</span>
        <button
          type="button"
          className="contract__open"
          aria-pressed={state.codeOpen}
          title="Open the generated file"
          onClick={() => dispatch({ type: 'ui', patch: { codeOpen: true, codeId: component.id, codeTab: 'component' } })}
        >
          Code
        </button>
      </div>
      <pre className="contract__code">{contract.blocks.join('\n\n')}</pre>
      {contract.discriminated ? (
        <p className="note note--quiet">
          A union, because some properties depend on others. The caller cannot set one without the
          other — TypeScript refuses it rather than a reviewer noticing.
        </p>
      ) : null}
    </div>
  );
}

/* ────────────────────────────  one property  ──────────────────────────── */

interface RowProps {
  param: ComponentParam;
  params: ComponentParam[];
  component: ComponentDef;
  open: boolean;
  onToggle: () => void;
}

function PropRow({ param, params, component, open, onToggle }: RowProps): JSX.Element {
  const { dispatch } = useStudio();
  const patch = (next: Partial<ComponentParam>): void =>
    dispatch({ type: 'patchParam', componentId: component.id, id: param.id, patch: next });

  const dependent = Boolean(param.when);
  const controllers = controllerParams(params, param.name);
  const values = branchValues(param);

  return (
    <div className={`prop${open ? ' is-open' : ''}${dependent ? ' is-dependent' : ''}`}>
      <button type="button" className="prop__head" onClick={onToggle}>
        <span className="prop__caret" aria-hidden>›</span>
        <span className={`prop__name${isIdentifier(param.name) ? '' : ' is-invalid'}`}>{param.name}</span>
        <span className="prop__type">{summarise(param)}</span>
        {param.required ? <span className="prop__req" title="Required">•</span> : null}
      </button>

      {dependent && param.when ? (
        <span className="prop__when" title="This property only exists while the condition holds">
          when {describeCondition(param.when)}
        </span>
      ) : null}

      {open ? (
        <div className="prop__body">
          <div className="pair">
            <label className="pair__field">
              <span>Name</span>
              <input
                className={`input input--mono${isIdentifier(param.name) ? '' : ' input--invalid'}`}
                value={param.name}
                onChange={(event) => patch({ name: event.target.value })}
              />
            </label>
            <label className="pair__field pair__field--narrow">
              <span>Type</span>
              <select
                className="select"
                value={param.type}
                onChange={(event) => patch({ type: event.target.value as ParamType })}
              >
                {PARAM_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="pair__remove"
              aria-label={`Remove ${param.name}`}
              title="Remove this property"
              onClick={() => dispatch({ type: 'removeParam', componentId: component.id, id: param.id })}
            >
              ×
            </button>
          </div>

          <div className="row">
            <span className="row__label">Description</span>
            <input
              className="input"
              value={param.description ?? ''}
              placeholder="What it is for — becomes a doc comment"
              onChange={(event) => patch({ description: event.target.value || undefined })}
            />
          </div>

          {param.type === 'action' ? (
            <p className="note note--quiet">
              Becomes <code>{param.name}?: () =&gt; void</code>. Point an event at it under Design ›
              Interactions.
            </p>
          ) : param.type === 'slot' ? (
            <p className="note note--quiet">
              Becomes <code>{param.name}?: ReactNode</code>. Whatever you draw inside the slot stays
              as its default.
            </p>
          ) : (
            <>
              {param.type === 'text' || param.type === 'number' ? (
                <OptionsEditor param={param} onChange={(options) => patch({ options })} />
              ) : null}

              <div className="row">
                <span className="row__label">
                  Canvas value
                  <em title="Stands in while you design. It never ships — but it does become the story's arg.">?</em>
                </span>
                <SampleInput param={param} onChange={(sample) => patch({ sample })} />
              </div>
            </>
          )}

          <label className="toggle-row">
            <span>
              Required
              {param.when ? <em className="toggle-row__note">when the condition below holds</em> : null}
            </span>
            <button
              type="button"
              className="toggle"
              aria-pressed={Boolean(param.required)}
              onClick={() => patch({ required: !param.required || undefined })}
            />
          </label>

          <ConditionEditor
            param={param}
            controllers={controllers}
            onChange={(when) => patch({ when })}
          />

          {values && param.type !== 'action' && param.type !== 'slot' ? (
            <button
              type="button"
              className="action"
              title="One artboard per value, laid out side by side"
              onClick={() => dispatch({ type: 'generateStates', componentId: component.id, param: param.name })}
            >
              Draw every value of {param.name}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** `'sm' | 'md'`, `boolean`, `string` — whatever fits on the collapsed line. */
function summarise(param: ComponentParam): string {
  if (param.options?.length) {
    const joined = param.options.map((option) => `'${option}'`).join(' | ');
    return joined.length <= 24 ? joined : `${param.options.length} values`;
  }
  return param.type;
}

/* ───────────────────────────  the condition  ─────────────────────────── */

/**
 * "Only when."
 *
 * This is the control the studio was missing. Without it an author can say
 * `errorLabel` is a string and can say it is optional, and cannot say the
 * thing they actually know — that it is required when `error` is on and
 * meaningless when it is off. The sentence under the control is the type it
 * generates, written out, because the whole point is that the promise is kept
 * by the compiler rather than by a reviewer.
 */
function ConditionEditor({ param, controllers, onChange }: {
  param: ComponentParam;
  controllers: ComponentParam[];
  onChange: (when: ParamCondition | undefined) => void;
}): JSX.Element {
  const when = param.when;
  const controller = controllers.find((item) => item.name === when?.param);
  const op = CONDITION_OPS.find((item) => item.id === when?.op);
  const choices = controller ? branchValues(controller) : null;

  if (!controllers.length) {
    return (
      <p className="note note--quiet">
        Add a switch or a variant property and this one can be made to depend on it.
      </p>
    );
  }

  return (
    <div className="cond">
      <div className="row">
        <span className="row__label">Only when</span>
        <div className="cond__row">
          <select
            className="select"
            value={when?.param ?? ''}
            onChange={(event) => {
              const name = event.target.value;
              if (!name) return onChange(undefined);
              const next = controllers.find((item) => item.name === name) as ComponentParam;
              const first = branchValues(next)?.[0];
              onChange(
                next.type === 'boolean'
                  ? { param: name, op: 'truthy' }
                  : { param: name, op: 'is', value: first ?? '' },
              );
            }}
          >
            <option value="">always</option>
            {controllers.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>

          {when ? (
            <select
              className="select"
              value={when.op}
              onChange={(event) =>
                onChange({ ...when, op: event.target.value as ConditionOp })
              }
            >
              {CONDITION_OPS.filter(
                (item) => controller?.type === 'boolean' || item.needsValue,
              ).map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          ) : null}

          {when && op?.needsValue ? (
            choices ? (
              <select
                className="select"
                value={String(when.value ?? '')}
                onChange={(event) => onChange({ ...when, value: event.target.value })}
              >
                {choices.map((choice) => (
                  <option key={String(choice)} value={String(choice)}>{String(choice)}</option>
                ))}
              </select>
            ) : (
              <input
                className="input input--mono"
                value={String(when.value ?? '')}
                onChange={(event) => onChange({ ...when, value: event.target.value })}
              />
            )
          ) : null}
        </div>
      </div>

      {when ? (
        <p className="cond__out">
          <code>{param.name}</code> {param.required ? 'is required' : 'may be set'} when{' '}
          <code>{describeCondition(when)}</code>, and cannot be set otherwise.
        </p>
      ) : null}
    </div>
  );
}

/* ────────────────────────────  allowed values  ──────────────────────────── */

/**
 * A property standing in for a variant is not a string — it is one of four
 * words, and typing it as a string throws away the thing that made the design
 * system worth having. `exposeProp` already knew that; a property added by
 * hand had no way to say it.
 */
function OptionsEditor({ param, onChange }: {
  param: ComponentParam;
  onChange: (options: string[] | undefined) => void;
}): JSX.Element {
  const [draft, setDraft] = useState('');
  const options = param.options ?? [];

  const commit = (): void => {
    const value = draft.trim();
    if (!value || options.includes(value)) return setDraft('');
    onChange([...options, value]);
    setDraft('');
  };

  return (
    <div className="row">
      <span className="row__label">
        Allowed values
        <em title="Generates a union instead of a string, and lets other properties depend on this one.">?</em>
      </span>
      <div className="opts">
        {options.map((option) => (
          <span key={option} className="opt">
            {option}
            <button
              type="button"
              aria-label={`Remove ${option}`}
              onClick={() => {
                const next = options.filter((item) => item !== option);
                // An empty list is not "a union of nothing" — it is a free
                // string, which is what the property was before anyone
                // narrowed it.
                onChange(next.length ? next : undefined);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="input input--flush opts__add"
          value={draft}
          placeholder={options.length ? 'add…' : 'anything (leave empty for a free string)'}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
          }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────  states  ────────────────────────────── */

function StatesSection({ component }: { component: ComponentDef }): JSX.Element {
  const { state, dispatch } = useStudio();
  const [editing, setEditing] = useState<ComponentState | 'new' | null>(null);
  const states = component.states ?? [];
  const enumerable = component.params.filter((param) => branchValues(param));

  return (
    <Section id="states" title="States" badge={String(states.length)}>
      <p className="note note--quiet">
        A set of property values with a name for the result — the error one, the empty one, the
        loading one. The canvas draws it, the export writes a story for it, and the linter can ask
        whether you designed it.
      </p>

      {states.length ? (
        <button
          type="button"
          className={`action${state.allStates ? ' is-on' : ''}`}
          onClick={() => dispatch({ type: 'ui', patch: { allStates: !state.allStates } })}
        >
          {state.allStates ? 'Showing all side by side' : 'Show all side by side'}
        </button>
      ) : null}

      <div className="plist">
        {states.map((item) => (
          <StateRow
            key={item.id}
            state={item}
            component={component}
            onEdit={() => setEditing(item)}
          />
        ))}
      </div>

      <button type="button" className="action action--dashed" onClick={() => setEditing('new')}>
        + Add state
      </button>

      {enumerable.length ? (
        <div className="gen">
          <span className="gen__label">Or draw every value of</span>
          {enumerable.map((param) => (
            <button
              key={param.id}
              type="button"
              className="chip"
              onClick={() => dispatch({ type: 'generateStates', componentId: component.id, param: param.name })}
            >
              {param.name}
            </button>
          ))}
        </div>
      ) : null}

      {editing ? (
        <StateDialog
          component={component}
          state={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </Section>
  );
}

/**
 * A state, as one line: what it is called, and what it pins.
 *
 * Editing happens in the dialog rather than here, so there is one description
 * of what a state is and one place that asks for it — instead of a panel and
 * a chip disagreeing about which fields a state has.
 */
function StateRow({ state, component, onEdit }: {
  state: ComponentState;
  component: ComponentDef;
  onEdit: () => void;
}): JSX.Element {
  const { dispatch, state: studio } = useStudio();
  const entries = Object.entries(state.values);
  const showing = studio.activeState === state.id && !studio.allStates;

  return (
    <div className="prop">
      <div className="prop__head prop__head--static">
        <button
          type="button"
          className="staterow__show"
          aria-pressed={showing}
          title={showing ? 'Showing this state on the canvas' : 'Draw this state on the canvas'}
          onClick={() =>
            dispatch({ type: 'ui', patch: { activeState: showing ? null : state.id, allStates: false } })
          }
        >
          <i className="stchip__dot" />
        </button>
        <button type="button" className="staterow__main" onClick={onEdit}>
          <span className="prop__name">{state.name}</span>
          <span className="prop__type">
            {entries.length
              ? entries.map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(' ')
              : 'same as default'}
          </span>
        </button>
        <button
          type="button"
          className="pair__remove"
          aria-label={`Remove ${state.name}`}
          onClick={() => dispatch({ type: 'removeState', componentId: component.id, id: state.id })}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────  value controls  ──────────────────────────── */

function SampleInput({ param, onChange }: { param: ComponentParam; onChange: (value: Json) => void }): JSX.Element {
  if (param.options?.length) {
    return (
      <select
        className="select"
        value={typeof param.sample === 'string' ? param.sample : ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {param.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (param.type === 'boolean') {
    return (
      <div className="segments">
        <button type="button" aria-pressed={!param.sample} onClick={() => onChange(false)}>false</button>
        <button type="button" aria-pressed={Boolean(param.sample)} onClick={() => onChange(true)}>true</button>
      </div>
    );
  }

  if (param.type === 'number') {
    return (
      <input
        className="input input--mono"
        type="number"
        value={typeof param.sample === 'number' ? param.sample : 0}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    );
  }

  if (param.type === 'text') {
    return (
      <input
        className="input"
        value={typeof param.sample === 'string' ? param.sample : ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return <JsonArea value={param.sample} onChange={onChange} />;
}

/** Edits JSON as text and only commits when it parses, so typing never destroys the value. */
function JsonArea({ value, onChange }: { value: Json; onChange: (value: Json) => void }): JSX.Element {
  return (
    <textarea
      className="input input--code"
      defaultValue={JSON.stringify(value, null, 2)}
      rows={5}
      spellCheck={false}
      onChange={(event) => {
        try {
          onChange(JSON.parse(event.target.value) as Json);
          event.target.classList.remove('input--invalid');
        } catch {
          event.target.classList.add('input--invalid');
        }
      }}
    />
  );
}
