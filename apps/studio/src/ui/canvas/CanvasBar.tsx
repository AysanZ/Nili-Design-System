import { useState } from 'react';
import { useStudio } from '../../document/StudioContext';
import { StateDialog } from '../StateDialog';
import type { ComponentState } from '../../document/types';

/**
 * What the canvas is showing, said once, above the canvas.
 *
 * Two things used to be apart that belong together. Design/Preview sat in the
 * application toolbar, which implied it changed the tool rather than the
 * board; the states sat here on their own. They are the same question —
 * *which version of this component am I looking at?* — so they are one bar,
 * and the state chips step aside while it is running.
 *
 * The chips are chips and nothing else. Renaming used to happen inside one,
 * which made it grow under the cursor and still never said what a state was
 * for. Both editing and creating open the dialog now.
 */
export function CanvasBar(): JSX.Element {
  const { state, component, dispatch } = useStudio();
  /** The state being edited, `'new'` while creating, or null. */
  const [editing, setEditing] = useState<ComponentState | 'new' | null>(null);
  const states = component.states ?? [];
  const preview = state.mode === 'preview';

  return (
    <div className="cbar">
      <div className="cbar__mode" role="radiogroup" aria-label="Canvas mode">
        <button
          type="button"
          role="radio"
          aria-checked={!preview}
          onClick={() => dispatch({ type: 'ui', patch: { mode: 'design' } })}
        >
          Design
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={preview}
          onClick={() => dispatch({ type: 'ui', patch: { mode: 'preview' } })}
        >
          Preview
        </button>
      </div>

      <span className="cbar__divider" />

      {preview ? (
        <span className="cbar__hint">
          Running against the values in <strong>Play</strong>. Nothing here edits the component.
        </span>
      ) : (
        <>
          {/* The row is chips, and chips alone say nothing. This does. */}
          <span
            className="cbar__label"
            title="A state is a set of property values with a name — the error one, the empty one, the loading one. Pick one to draw it."
          >
            Showing
          </span>

          <button
            type="button"
            className={`stchip${state.activeState === null && !state.allStates ? ' is-on' : ''}`}
            title="The component with the values the properties are set to"
            onClick={() => dispatch({ type: 'ui', patch: { activeState: null, allStates: false } })}
          >
            <i className="stchip__dot" />
            Default
          </button>

          {states.map((item) => (
            <span
              key={item.id}
              className={`stchip__wrap${state.activeState === item.id && !state.allStates ? ' is-on' : ''}`}
            >
              <button
                type="button"
                className={`stchip${state.activeState === item.id && !state.allStates ? ' is-on' : ''}`}
                title={`${describe(item)} — double-click to edit`}
                onDoubleClick={() => setEditing(item)}
                onClick={() => dispatch({ type: 'ui', patch: { activeState: item.id, allStates: false } })}
              >
                <i className="stchip__dot" data-tone={toneOf(item.name)} />
                {item.name}
              </button>
              <button
                type="button"
                className="stchip__edit"
                aria-label={`Edit ${item.name}`}
                title="Edit this state"
                onClick={() => setEditing(item)}
              >
                ⋯
              </button>
              <button
                type="button"
                className="stchip__x"
                aria-label={`Remove ${item.name}`}
                onClick={() => dispatch({ type: 'removeState', componentId: component.id, id: item.id })}
              >
                ×
              </button>
            </span>
          ))}

          <button
            type="button"
            className="stchip stchip--add"
            title="Name a set of property values, and draw the component that way"
            onClick={() => setEditing('new')}
          >
            + State
          </button>

          {states.length ? (
            <button
              type="button"
              className={`cbar__all${state.allStates ? ' is-on' : ''}`}
              onClick={() => dispatch({ type: 'ui', patch: { allStates: !state.allStates } })}
            >
              All side by side <kbd>⇧A</kbd>
            </button>
          ) : (
            <span className="cbar__hint">
              Loading, error, empty — or let <strong>Props</strong> draw every value of a property.
            </span>
          )}
        </>
      )}

      {editing ? (
        <StateDialog
          component={component}
          state={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}

/** `error = true, errorLabel = "…"`, for the chip's tooltip. */
function describe(state: ComponentState): string {
  const entries = Object.entries(state.values);
  if (!entries.length) return 'Same as Default';
  return entries.map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(', ');
}

/* Purely cosmetic: a dot that agrees with the name costs nothing and makes a
   row of five chips readable at a glance. */
function toneOf(name: string): string {
  const lower = name.toLowerCase();
  if (/load|pend|busy|wait/.test(lower)) return 'loading';
  if (/error|fail|invalid|danger/.test(lower)) return 'error';
  if (/empty|none|zero|blank/.test(lower)) return 'empty';
  if (/disabled|readonly|locked|no /.test(lower)) return 'muted';
  return 'default';
}
