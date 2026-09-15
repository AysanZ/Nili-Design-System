import { useStudio } from '../../document/StudioContext';
import { INTERACTION_STATES } from '../../document/types';
import type { DocNode, InteractionState, StateEffect } from '../../document/types';
import { bind } from '../../logic/types';
import { stateClasses } from '../../codegen/states';
import type { Scope } from '../../expr';
import type { Completion } from '../../logic/scope';
import { Section } from '../Section';
import { Field } from './Controls';
import { ExpressionInput } from './BindingControl';

const BACKGROUNDS: NonNullable<StateEffect['background']>[] = ['none', 'weak', 'soft', 'primary'];
const OPACITIES: NonNullable<StateEffect['opacity']>[] = [100, 90, 80, 70, 60];
const SHADOWS: NonNullable<StateEffect['shadow']>[] = ['none', 'sm', 'md', 'lg'];
const TRANSLATES: NonNullable<StateEffect['translate']>[] = ['none', 'up', 'down'];

/**
 * Hover, focus, pressed and disabled — chosen from a list rather than typed.
 *
 * The `className` field has always accepted `hover:bg-weak-50` and it has
 * always been half a lie: Tailwind emits the classes it can see in the source,
 * and a class assembled from a document at runtime is not in the source. So a
 * hover effect typed by hand worked in the export and did nothing on the
 * canvas. Picking from a fixed table means every class already exists, and the
 * canvas shows the real thing.
 */
export function StatesSection({ node }: { node: DocNode }): JSX.Element {
  const { dispatch } = useStudio();
  const active = INTERACTION_STATES.filter((state) => node.states?.[state.id]);
  const spare = INTERACTION_STATES.filter((state) => !node.states?.[state.id]);
  const preview = stateClasses(node.states);

  const set = (state: InteractionState, patch: Partial<StateEffect>): void => {
    dispatch({
      type: 'setStateEffect',
      id: node.id,
      state,
      effect: { ...(node.states?.[state] ?? {}), ...patch },
    });
  };

  return (
    <Section id="states" title="States" badge="design" defaultOpen={false}>
      {active.length === 0 ? (
        <p className="note note--quiet">Nothing changes when this node is pointed at or pressed.</p>
      ) : null}

      {active.map((state) => {
        const effect = node.states?.[state.id] as StateEffect;
        return (
          <div key={state.id} className="statebox">
            <div className="statebox__head">
              <strong>{state.label}</strong>
              <em>{state.hint}</em>
              <button
                type="button"
                aria-label={`Remove ${state.label}`}
                onClick={() => dispatch({ type: 'setStateEffect', id: node.id, state: state.id, effect: undefined })}
              >
                ×
              </button>
            </div>

            <Field label="Background" propKey="bg">
              <div className="segments">
                {BACKGROUNDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={(effect.background ?? 'none') === option}
                    onClick={() => set(state.id, { background: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Opacity" propKey="opacity">
              <div className="segments">
                {OPACITIES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={(effect.opacity ?? 100) === option}
                    onClick={() => set(state.id, { opacity: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Shadow" propKey="shadow">
              <div className="segments">
                {SHADOWS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={(effect.shadow ?? 'none') === option}
                    onClick={() => set(state.id, { shadow: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Lift" propKey="translate">
              <div className="segments">
                {TRANSLATES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={(effect.translate ?? 'none') === option}
                    onClick={() => set(state.id, { translate: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        );
      })}

      {spare.length ? (
        <div className="chips">
          {spare.map((state) => (
            <button
              key={state.id}
              type="button"
              className="chip-btn"
              onClick={() => dispatch({ type: 'setStateEffect', id: node.id, state: state.id, effect: { background: 'weak' } })}
            >
              + {state.label}
            </button>
          ))}
        </div>
      ) : null}

      {preview ? <code className="code-block">{preview}</code> : null}
    </Section>
  );
}

/* ────────────────────────────  validation  ──────────────────────────── */

interface ValidationProps {
  node: DocNode;
  /** True when the component has an `error` prop to put the message in. */
  supported: boolean;
  scope: Scope;
  completions: Completion[];
}

/**
 * A message, not a boolean.
 *
 * A boolean has to be turned back into words somewhere, and the only place
 * that knows the words is this field. The result lands on the component's own
 * `error` prop, so the design system draws the invalid state and the studio
 * does not invent a second one that looks almost right.
 */
export function ValidationSection({ node, supported, scope, completions }: ValidationProps): JSX.Element {
  const { dispatch } = useStudio();
  const rule = node.validate;

  return (
    <Section id="validation" title="Validation" badge="logic" defaultOpen={Boolean(rule)}>
      {!supported ? (
        <p className="note note--quiet">
          This component has no <code>error</code> prop, so a message would have nowhere to go.
        </p>
      ) : (
        <Field
          label="Error message"
          propKey="validate"
          doc="An expression returning the message, or an empty string when the value is fine."
          bindable={{
            bound: Boolean(rule),
            onToggle: (bound) =>
              dispatch({
                type: 'setValidate',
                id: node.id,
                value: bound ? bind("email.includes('@') ? '' : 'Enter a valid email'") : undefined,
              }),
          }}
        >
          {rule ? (
            <>
              <ExpressionInput
                value={rule.expr}
                onChange={(expr) => dispatch({ type: 'setValidate', id: node.id, value: bind(expr) })}
                completions={completions}
                scope={scope}
                rows={2}
                placeholder="email.includes('@') ? '' : 'Enter a valid email'"
              />
              <p className="note note--quiet">
                Use the same expression in a <strong>Only if…</strong> step to stop a submit while it fails.
              </p>
            </>
          ) : (
            <p className="note note--quiet">Always valid.</p>
          )}
        </Field>
      )}
    </Section>
  );
}
