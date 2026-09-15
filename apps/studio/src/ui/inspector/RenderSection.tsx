import { useStudio } from '../../document/StudioContext';
import type { DocNode } from '../../document/types';
import { bind } from '../../logic/types';
import type { Scope } from '../../expr';
import type { Completion } from '../../logic/scope';
import { Section } from '../Section';
import { Field } from './Controls';
import { ExpressionInput } from './BindingControl';

interface RenderSectionProps {
  node: DocNode;
  scope: Scope;
  completions: Completion[];
  invalidFields: ReadonlySet<string>;
}

/**
 * Two fields, on every node, frame or component alike.
 *
 * Keeping them together in one section rather than scattering "show if" next
 * to the visibility-ish props and "repeat" next to the list-ish ones means
 * there is exactly one place to look when a node is on the canvas but not in
 * the running component.
 */
export function RenderSection({ node, scope, completions, invalidFields }: RenderSectionProps): JSX.Element {
  const { dispatch } = useStudio();
  const condition = node.visibleWhen;
  const repeat = node.repeat;

  return (
    <Section id="render" title="Render" badge="logic">
      <Field
        label="Visible when"
        propKey="visibleWhen"
        invalid={invalidFields.has('visibleWhen')}
        bindable={{
          bound: Boolean(condition),
          onToggle: (bound) =>
            dispatch({ type: 'setVisibleWhen', id: node.id, value: bound ? bind('true') : undefined }),
        }}
      >
        {condition ? (
          <ExpressionInput
            value={condition.expr}
            onChange={(expr) => dispatch({ type: 'setVisibleWhen', id: node.id, value: bind(expr) })}
            completions={completions}
            scope={scope}
            placeholder="users.isLoading"
          />
        ) : (
          <p className="note note--quiet">Always rendered.</p>
        )}
      </Field>

      <Field
        label="Repeat for each"
        propKey="repeat"
        invalid={invalidFields.has('repeat')}
        bindable={{
          bound: Boolean(repeat),
          onToggle: (bound) =>
            dispatch({
              type: 'setRepeat',
              id: node.id,
              value: bound ? { each: bind('[]'), as: 'item', keyExpr: '' } : undefined,
            }),
        }}
      >
        {repeat ? (
          <>
            <ExpressionInput
              value={repeat.each.expr}
              onChange={(expr) =>
                dispatch({ type: 'setRepeat', id: node.id, value: { ...repeat, each: bind(expr) } })
              }
              completions={completions}
              scope={scope}
              placeholder="users.data"
            />
            <div className="pair">
              <label className="pair__field">
                <span>Row name</span>
                <input
                  className="input input--mono"
                  value={repeat.as}
                  placeholder="item"
                  onChange={(event) =>
                    dispatch({ type: 'setRepeat', id: node.id, value: { ...repeat, as: event.target.value } })
                  }
                />
              </label>
              <label className="pair__field">
                <span>Key</span>
                <input
                  className="input input--mono"
                  value={repeat.keyExpr}
                  placeholder={`${repeat.as || 'item'}.id`}
                  onChange={(event) =>
                    dispatch({ type: 'setRepeat', id: node.id, value: { ...repeat, keyExpr: event.target.value } })
                  }
                />
              </label>
            </div>
            <p className="note">
              <code>{repeat.as || 'item'}</code> and <code>{(repeat.as || 'item')}Index</code> are available to
              everything inside this node — and nowhere else.
            </p>
          </>
        ) : (
          <p className="note note--quiet">Rendered once.</p>
        )}
      </Field>
    </Section>
  );
}
