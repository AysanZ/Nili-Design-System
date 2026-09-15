import { useStudio } from '../document/StudioContext';
import type { PanelTab } from '../document/state';
import { countBySeverity } from '../lint/engine';
import { DocumentPanel } from './panels/DocumentPanel';
import { InsertPanel } from './panels/InsertPanel';
import { ThemePanel } from './panels/ThemePanel';
import { LocalesPanel } from './panels/LocalesPanel';
import { AssetsPanel } from './panels/AssetsPanel';
import { ProblemsPanel } from './panels/ProblemsPanel';
import { ChecksIcon, DocumentIcon, ImageIcon, InsertIcon, StylesIcon, TextIcon } from './icons';

interface Destination {
  id: PanelTab;
  label: string;
  hint: string;
  icon: JSX.Element;
  /** Separated from the working tools: these describe the document, not its shape. */
  trailing?: boolean;
}

/**
 * Six destinations, none of them nested.
 *
 * Styles used to be one rail button hiding three panels behind a row of text
 * tabs, so reaching the image you had just imported took two clicks and a
 * guess about which tab it lived under. The rail has the room; hiding things
 * inside it was never buying anything.
 */
const DESTINATIONS: Destination[] = [
  { id: 'layers', label: 'Layers', hint: 'Every component and what is inside it', icon: <DocumentIcon /> },
  { id: 'insert', label: 'Insert', hint: 'The component library', icon: <InsertIcon /> },
  { id: 'theme', label: 'Theme', hint: 'The tokens every artboard renders with', icon: <StylesIcon />, trailing: true },
  { id: 'text', label: 'Text', hint: 'Translation catalogues', icon: <TextIcon />, trailing: true },
  { id: 'images', label: 'Images', hint: 'What the document carries with it', icon: <ImageIcon />, trailing: true },
  { id: 'problems', label: 'Checks', hint: 'What the design system says is wrong', icon: <ChecksIcon />, trailing: true },
];

export function LeftPanel(): JSX.Element {
  const { state, dispatch, findings } = useStudio();
  const counts = countBySeverity(findings);
  const blocking = counts.error + counts.warning;

  const active = DESTINATIONS.find((d) => d.id === state.panel) ?? (DESTINATIONS[0] as Destination);
  const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

  const subtitle: Record<PanelTab, string> = {
    layers: plural(state.components.length, 'component'),
    insert: 'Drag onto the canvas, or click',
    theme: 'Applies to every artboard',
    text: plural(state.locales.length, 'language'),
    images: plural(state.assets.length, 'image'),
    problems: blocking ? `${counts.error} errors · ${counts.warning} warnings` : 'All clear',
  };

  return (
    <aside className="panel panel--left">
      <nav className="rail" aria-label="Panels">
        {DESTINATIONS.map((destination, index) => (
          <span key={destination.id} className="rail__slot">
            {destination.trailing && !DESTINATIONS[index - 1]?.trailing ? <span className="rail__sep" /> : null}
            <button
              type="button"
              aria-pressed={state.panel === destination.id}
              aria-label={destination.label}
              title={`${destination.label} — ${destination.hint}`}
              onClick={() => dispatch({ type: 'ui', patch: { panel: destination.id } })}
            >
              {destination.icon}
              {destination.id === 'problems' && blocking ? (
                <span className="rail__count" data-tone={counts.error ? 'error' : 'warning'}>
                  {blocking}
                </span>
              ) : null}
            </button>
          </span>
        ))}
      </nav>

      <div className="panel__column">
        <header className="panel__head">
          <span className="panel__title">{active.label}</span>
          <span className="panel__sub">{subtitle[active.id]}</span>

          {active.id === 'layers' ? (
            <button
              type="button"
              className="panel__action"
              title="New component"
              aria-label="Add component"
              onClick={() => dispatch({ type: 'addComponent' })}
            >
              +
            </button>
          ) : null}
        </header>

        <div className="panel__body">
          {state.panel === 'layers' ? <DocumentPanel /> : null}
          {state.panel === 'insert' ? <InsertPanel /> : null}
          {state.panel === 'theme' ? <ThemePanel /> : null}
          {state.panel === 'text' ? <LocalesPanel /> : null}
          {state.panel === 'images' ? <AssetsPanel /> : null}
          {state.panel === 'problems' ? <ProblemsPanel /> : null}
        </div>
      </div>
    </aside>
  );
}
