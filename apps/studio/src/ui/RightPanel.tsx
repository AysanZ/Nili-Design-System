import { useStudio } from '../document/StudioContext';
import type { RightTab } from '../document/state';
import { Inspector } from './inspector/Inspector';
import { PropsPanel } from './panels/PropsPanel';
import { ControlsPanel } from './run/ControlsPanel';

interface Tab {
  id: RightTab;
  label: string;
  hint: string;
}

/**
 * Three questions about the component, in the order they get asked.
 *
 * *Design* is what the selected thing looks like. *Props* is what the
 * component asks the world for. *Play* is the thing running against values
 * you can turn.
 *
 * They are one switch because the alternative was worse in two directions at
 * once: the contract lived in the left rail beside Images, and the panel
 * silently turned into a controls panel whenever a toggle in the toolbar was
 * flipped — two controls for one idea, neither of them naming the other.
 */
const TABS: Tab[] = [
  { id: 'design', label: 'Design', hint: 'What the selected layer looks like' },
  { id: 'props', label: 'Props', hint: "The component's API" },
  { id: 'play', label: 'Play', hint: 'Run it against values you can change' },
];

export function RightPanel(): JSX.Element {
  const { state, dispatch, component, findings } = useStudio();
  const errors = findings.filter(
    (finding) => finding.severity === 'error' && finding.nodeId === component.root.id,
  ).length;

  return (
    <aside className="panel panel--right">
      <div className="tabs" role="tablist" aria-label="Component">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={state.rightTab === tab.id}
            title={tab.hint}
            onClick={() => dispatch({ type: 'ui', patch: { rightTab: tab.id } })}
          >
            {tab.label}
            {tab.id === 'props' && component.params.length ? (
              <span className="tabs__count">{component.params.length}</span>
            ) : null}
            {tab.id === 'props' && errors ? <span className="tabs__dot" /> : null}
          </button>
        ))}
      </div>

      <div className="panel__body">
        {state.rightTab === 'design' ? <Inspector /> : null}
        {state.rightTab === 'props' ? <PropsPanel /> : null}
        {state.rightTab === 'play' ? <ControlsPanel /> : null}
      </div>
    </aside>
  );
}
