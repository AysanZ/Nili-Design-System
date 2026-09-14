import { useStudio } from '../document/StudioContext';
import type { PanelTab } from '../document/state';
import { countBySeverity } from '../lint/engine';
import { LayersPanel } from './panels/LayersPanel';
import { AssetsPanel } from './panels/AssetsPanel';
import { ThemePanel } from './panels/ThemePanel';
import { LocalesPanel } from './panels/LocalesPanel';
import { ProblemsPanel } from './panels/ProblemsPanel';

const TABS: { id: PanelTab; label: string }[] = [
  { id: 'layers', label: 'Layers' },
  { id: 'assets', label: 'Assets' },
  { id: 'theme', label: 'Theme' },
  { id: 'locales', label: 'i18n' },
  { id: 'problems', label: 'Checks' },
];

export function LeftPanel(): JSX.Element {
  const { state, dispatch, findings } = useStudio();
  const counts = countBySeverity(findings);
  const blocking = counts.error + counts.warning;

  return (
    <aside className="panel panel--left">
      <nav className="panel__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={state.panel === tab.id}
            onClick={() => dispatch({ type: 'ui', patch: { panel: tab.id } })}
          >
            {tab.label}
            {tab.id === 'problems' && blocking ? <span className="panel__badge">{blocking}</span> : null}
          </button>
        ))}
      </nav>
      <div className="panel__body">
        {state.panel === 'layers' ? <LayersPanel /> : null}
        {state.panel === 'assets' ? <AssetsPanel /> : null}
        {state.panel === 'theme' ? <ThemePanel /> : null}
        {state.panel === 'locales' ? <LocalesPanel /> : null}
        {state.panel === 'problems' ? <ProblemsPanel /> : null}
      </div>
    </aside>
  );
}
