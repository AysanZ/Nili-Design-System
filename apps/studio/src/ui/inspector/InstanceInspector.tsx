import { useStudio } from '../../document/StudioContext';
import { BREAKPOINTS } from '../../document/types';
import type { Breakpoint, DocNode, InstanceNode, ComponentDef } from '../../document/types';
import { bind, isBinding } from '../../logic/types';
import { literal } from '../../i18n/catalog';
import type { Scope } from '../../expr';
import type { Completion } from '../../logic/scope';
import { Section } from '../Section';
import { BoolSwitch, Field, NumberControl, asText } from './Controls';
import { ExpressionInput } from './BindingControl';
import { TextControl } from './Controls';

/**
 * Everything an instance can say is one row per declared parameter.
 *
 * There is no registry entry to read here — the "registry" is another component of
 * this document, which is the whole point of the feature. A parameter added to
 * the component shows up on every instance immediately.
 */
export function InstanceInspector({ node, component, scope, completions, suggestions }: {
  node: InstanceNode;
  component: ComponentDef | undefined;
  scope: Scope;
  completions: Completion[];
  suggestions: string[];
}): JSX.Element {
  const { dispatch } = useStudio();

  if (!component) {
    return (
      <Section id="instance" title="Component" badge="logic">
        <p className="note note--warning">This places a component that no longer exists.</p>
      </Section>
    );
  }

  const params = component.params ?? [];
  const set = (name: string, value: DocNode extends never ? never : unknown): void =>
    dispatch({ type: 'setArg', id: node.id, key: name, value: value as never });

  return (
    <>
      <Section id="instance" title={component.name} badge="logic">
        <p className="note note--quiet">
          Edited on its own artboard. Changes there reach every place it is used.
        </p>
        <button
          type="button"
          className="action"
          onClick={() => dispatch({ type: 'setActiveComponent', id: component.id })}
        >
          Open {component.component}
        </button>
      </Section>

      {params.length ? (
        <Section id="params" title="Properties">
          {params.map((param) => {
            const value = node.args[param.name];
            const bound = isBinding(value);

            if (param.type === 'action') {
              return (
                <Field key={param.id} label={param.name} propKey="action" doc="Runs from the instance.">
                  <p className="note note--quiet">Wired in Interactions below.</p>
                </Field>
              );
            }

            const bindable = {
              bound,
              onToggle: (next: boolean) => set(param.name, next ? bind(`'${param.name}'`) : literal('')),
            };

            if (bound) {
              return (
                <Field key={param.id} label={param.name} propKey={param.type} bindable={bindable}>
                  <ExpressionInput
                    value={(value as { expr: string }).expr}
                    onChange={(expr) => set(param.name, bind(expr))}
                    completions={completions}
                    scope={scope}
                    rows={1}
                  />
                </Field>
              );
            }

            if (param.type === 'boolean') {
              return (
                <Field key={param.id} label={param.name} propKey="boolean" bindable={bindable}>
                  <BoolSwitch value={value === true} onChange={(next) => set(param.name, next)} />
                </Field>
              );
            }

            if (param.type === 'number') {
              return (
                <Field key={param.id} label={param.name} propKey="number" bindable={bindable}>
                  <NumberControl
                    value={typeof value === 'number' ? value : 0}
                    onChange={(next) => set(param.name, next)}
                  />
                </Field>
              );
            }

            return (
              <Field key={param.id} label={param.name} propKey={param.type} bindable={bindable}>
                <TextControl
                  value={asText(value)}
                  suggestions={suggestions}
                  onChange={(next) => set(param.name, next)}
                />
              </Field>
            );
          })}
        </Section>
      ) : (
        <Section id="params" title="Properties">
          <p className="note note--quiet">
            This component takes nothing yet. Open it and declare a property to make it configurable.
          </p>
        </Section>
      )}
    </>
  );
}

/**
 * A hole, and what fills it when nobody says otherwise.
 *
 * The children drawn inside are the default rather than a placeholder — they
 * survive into the generated file as `{content ?? (…)}` — so this panel is
 * mostly about saying that out loud, since it is the one thing about a slot
 * that is not obvious from looking at it.
 */
export function SlotInspector({ node }: { node: { id: string; name: string; children: unknown[] } }): JSX.Element {
  const { component, dispatch } = useStudio();
  const declared = component.params.some((param) => param.name === node.name && param.type === 'slot');

  return (
    <Section id="slot" title="Slot" badge="api">
      <Field label="Property" propKey="name" doc="The ReactNode prop this hole reads.">
        <input
          className={`input input--mono${declared ? '' : ' input--invalid'}`}
          value={node.name}
          onChange={(event) => dispatch({ type: 'renameSlot', id: node.id, name: event.target.value })}
        />
      </Field>
      {declared ? null : (
        <p className="note note--warning">
          No <code>slot</code> property called <code>{node.name}</code>. Add one, or rename this.
        </p>
      )}
      <p className="note note--quiet">
        {node.children.length
          ? 'What you drew inside is the default. A caller who passes nothing still gets it.'
          : 'Nothing drawn inside, so a caller who passes nothing gets nothing. Drop something here to give it a default.'}
      </p>
    </Section>
  );
}

/* ─────────────────────────────  breakpoints  ───────────────────────── */

/**
 * Which variant the layout controls are editing.
 *
 * `base` is the narrow case, as Tailwind reads it. Selecting a stop makes the
 * layout controls write into an override for that width and up — and because
 * the artboard shows the variant its own width selects, the way to check the
 * result is to widen the component.
 */
export function BreakpointBar({ node }: { node: DocNode }): JSX.Element {
  const { state, dispatch, component } = useStudio();
  const active = state.breakpoint;

  return (
    <div className="bp">
      <button
        type="button"
        aria-pressed={active === null}
        onClick={() => dispatch({ type: 'ui', patch: { breakpoint: null } })}
      >
        base
      </button>
      {BREAKPOINTS.map((stop) => {
        const has = Boolean(node.responsive?.[stop.id]);
        return (
          <button
            key={stop.id}
            type="button"
            aria-pressed={active === stop.id}
            className={has ? 'has-override' : undefined}
            title={`${stop.min}px and up${component.width >= stop.min ? ' · this artboard is here' : ''}`}
            onClick={() => dispatch({ type: 'ui', patch: { breakpoint: stop.id as Breakpoint } })}
          >
            {stop.label}
          </button>
        );
      })}
    </div>
  );
}
