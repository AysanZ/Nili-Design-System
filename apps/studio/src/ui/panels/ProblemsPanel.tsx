import { useStudio } from '../../document/StudioContext';
import { ownerOf } from '../../document/state';
import { ancestors } from '../../document/tree';
import { RULES } from '../../lint/rules';

export function ProblemsPanel(): JSX.Element {
  const { findings, state, dispatch } = useStudio();

  if (!findings.length) {
    return (
      <div className="panel__clean">
        <p>Nothing to fix.</p>
        <p className="note">
          Checks are the library&rsquo;s own constraints: required props and the rules each component states in
          its documentation.
        </p>
      </div>
    );
  }

  const reveal = (nodeId: string): void => {
    const owner = ownerOf(state, nodeId);
    if (owner) dispatch({ type: 'expand', ids: ancestors(owner.root, nodeId).map((n) => n.id) });
    dispatch({ type: 'select', ids: [nodeId] });
    dispatch({ type: 'ui', patch: { panel: 'layers' } });
  };

  return (
    <>
      <ul className="findings">
        {findings.map((finding) => (
          <li key={finding.id}>
            <button type="button" className={`finding finding--${finding.severity}`} onClick={() => reveal(finding.nodeId)}>
              <span className="finding__message">{finding.message}</span>
              <span className="finding__meta">
                {finding.subject} · {finding.source}
              </span>
              {finding.fix ? <span className="finding__fix">{finding.fix}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <div className="panel__foot">
        <p className="note">
          {RULES.length} rules, each traceable to a line in the design system.
        </p>
      </div>
    </>
  );
}
