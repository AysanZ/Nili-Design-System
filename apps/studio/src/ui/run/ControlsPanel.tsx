import { useStudio } from '../../document/StudioContext';
import { branchValues, conditionHolds, describeCondition } from '../../logic/types';
import type { ComponentParam, Json } from '../../logic/types';

/**
 * What the component is, running.
 *
 * It is a Storybook controls panel, because that is the right shape for the
 * question: a component has no state to inspect, only props somebody has to
 * try. Turning `loading` on and watching the spinner appear is the whole of
 * testing a component.
 *
 * Properties switched off by a condition are shown greyed rather than hidden.
 * Hiding them would make the panel jump under the pointer every time a switch
 * is flipped, and the fact that `errorLabel` *stops existing* when `error` goes
 * off is the behaviour being demonstrated — not a detail to conceal.
 */
export function ControlsPanel(): JSX.Element {
  const { state, component, dispatch } = useStudio();

  const current = (param: ComponentParam): unknown =>
    param.name in state.controls ? state.controls[param.name] : param.sample;

  const values: Record<string, unknown> = {};
  for (const param of component.params) values[param.name] = current(param);

  const settable = component.params.filter((param) => param.type !== 'action');
  const actions = component.params.filter((param) => param.type === 'action');
  const dimmed = settable.filter((param) => !conditionHolds(param.when, values)).length;

  return (
    <div className="run">
      <header className="run__head">
        <span className="run__dot" aria-hidden />
        <span className="run__title">{component.component}</span>
        <button type="button" className="run__btn" onClick={() => dispatch({ type: 'resetControls' })}>
          Reset
        </button>
      </header>

      <section className="run__sec">
        <h4>Properties<span className="run__badge">{settable.length}</span></h4>
        {settable.length ? (
          settable.map((param) => {
            const active = conditionHolds(param.when, values);
            return (
              <div key={param.id} className={`run__row${active ? '' : ' is-off'}`}>
                <code>{param.name}</code>
                {active ? (
                  <Control
                    param={param}
                    value={current(param)}
                    onChange={(value) => dispatch({ type: 'setControl', name: param.name, value })}
                  />
                ) : (
                  <span className="run__pill run__pill--idle" title={`Needs ${describeCondition(param.when!)}`}>
                    not set here
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p className="note note--quiet">This component takes nothing yet.</p>
        )}
        {dimmed ? (
          <p className="note note--quiet">
            {dimmed} propert{dimmed === 1 ? 'y is' : 'ies are'} switched off by a condition. In the
            generated type they do not exist in this branch at all.
          </p>
        ) : null}
      </section>

      {actions.length ? (
        <section className="run__sec">
          <h4>Events<span className="run__badge">{actions.length}</span></h4>
          {actions.map((param) => (
            <div key={param.id} className="run__row">
              <code>{param.name}</code>
              <span className="run__pill run__pill--idle">() =&gt; void</span>
            </div>
          ))}
          <p className="note note--quiet">
            Nothing happens here when these fire — that is the point. The application placing this
            component decides, and the story beside it records the call.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function Control({ param, value, onChange }: {
  param: ComponentParam;
  value: unknown;
  onChange: (value: Json) => void;
}): JSX.Element {
  const choices = branchValues(param);

  if (param.options?.length && choices) {
    return (
      <select
        className="select select--sm"
        value={typeof value === 'string' ? value : ''}
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
      <span className="run__tools">
        <button
          type="button"
          className="toggle"
          aria-pressed={Boolean(value)}
          aria-label={param.name}
          onClick={() => onChange(!value)}
        />
      </span>
    );
  }

  if (param.type === 'number') {
    return (
      <input
        className="run__input"
        type="number"
        value={typeof value === 'number' ? value : 0}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    );
  }

  if (param.type === 'text') {
    return (
      <input
        className="run__input"
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  // A list or an object is shown, not edited: a JSON textarea here would be a
  // second, worse copy of the one beside the property itself.
  return (
    <span className="run__pill run__pill--idle">
      {Array.isArray(value) ? `${value.length} rows` : typeof value === 'object' && value ? 'object' : String(value)}
    </span>
  );
}
