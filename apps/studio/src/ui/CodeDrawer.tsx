import { useMemo, useState } from 'react';
import { useStudio } from '../document/StudioContext';
import type { CodeTab } from '../document/state';
import { componentSource } from '../codegen/jsx';
import { documentSource, themeSource, translationSource } from '../codegen/artifacts';

const TABS: { id: CodeTab; label: string }[] = [
  { id: 'component', label: 'SignUpPage.tsx' },
  { id: 'theme', label: 'theme.css' },
  { id: 'translations', label: 'translations.json' },
  { id: 'document', label: 'document.json' },
];

export function CodeDrawer(): JSX.Element | null {
  const { state, dispatch, findings } = useStudio();
  const [copied, setCopied] = useState(false);

  const source = useMemo(() => {
    switch (state.codeTab) {
      case 'theme':
        return themeSource(state.theme);
      case 'translations':
        return translationSource(state.root, state.locales);
      case 'document':
        return documentSource(state.root, state.theme, state.locales);
      default:
        return componentSource({ root: state.root, name: 'SignUpPage', findings });
    }
  }, [state.codeTab, state.root, state.theme, state.locales, findings]);

  if (!state.codeOpen) return null;

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="drawer" aria-label="Generated code">
      <header className="drawer__head">
        <div className="drawer__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={state.codeTab === tab.id}
              onClick={() => dispatch({ type: 'ui', patch: { codeTab: tab.id } })}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button type="button" className="drawer__action" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button type="button" className="drawer__action" onClick={() => dispatch({ type: 'ui', patch: { codeOpen: false } })}>
          Close
        </button>
      </header>
      <pre className="drawer__code">{source}</pre>
    </section>
  );
}
