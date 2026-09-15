import { useStudio } from '../../document/StudioContext';
import { PARAM_SIGNATURE } from '../../logic/types';
import type { ComponentDef } from '../../document/types';

/**
 * The component's type, at the top of the inspector.
 *
 * What this tool produces is a typed component, so its type is the one thing
 * that should always be in front of you. Before this, finding out what a
 * component took meant opening a different panel — which meant the contract,
 * the whole point of the thing, was the part you saw least.
 */
export function Signature({ component }: { component: ComponentDef }): JSX.Element {
  const { dispatch } = useStudio();
  const params = component.params;

  return (
    <div className="sig">
      <div className="sig__head">
        <strong>{component.component}</strong>
        {params.length ? <span>{params.length} props</span> : null}
        <button type="button" onClick={() => dispatch({ type: 'ui', patch: { rightTab: 'props' } })}>
          edit
        </button>
      </div>
      <pre>
        {params.length === 0 ? (
          <span className="q">{'// takes nothing but className'}</span>
        ) : (
          params.map((param) => (
            <span key={param.id}>
              <span className="n">{param.name}</span>
              <span className="q">{param.required ? '' : '?'}</span>
              <span className="q">: </span>
              <span className="t">
                {param.options?.length
                  ? param.options.map((option) => `'${option}'`).join(' | ')
                  : PARAM_SIGNATURE[param.type]}
              </span>
              {'\n'}
            </span>
          ))
        )}
      </pre>
    </div>
  );
}
