import { useMemo, useState } from 'react';
import { useStudio } from '../document/StudioContext';
import type { CodeTab } from '../document/state';
import { componentSource } from '../codegen/jsx';
import { storySource } from '../codegen/stories';
import { documentSource, themeSource, translationSource } from '../codegen/artifacts';

/**
 * The drawer answers one question — "what does this actually compile to?" —
 * and now has to answer it per component. The component tabs sit above the artefact tabs
 * rather than multiplying them, because the theme and the translations belong
 * to the document, not to whichever screen happens to be selected.
 */
export function CodeDrawer(): JSX.Element | null {
  const { state, dispatch, findings } = useStudio();
  const [copied, setCopied] = useState(false);

  const codeComponent = state.components.find((item) => item.id === state.codeId) ?? state.components[0];

  const tabs: { id: CodeTab; label: string }[] = [
    { id: 'component', label: codeComponent ? `${codeComponent.component}.tsx` : 'component.tsx' },
    { id: 'story', label: codeComponent ? `${codeComponent.component}.stories.tsx` : 'story.tsx' },
    { id: 'theme', label: 'theme.css' },
    { id: 'translations', label: 'translations.json' },
    { id: 'document', label: 'document.json' },
  ];

  const source = useMemo(() => {
    switch (state.codeTab) {
      case 'story':
        return codeComponent ? storySource(codeComponent) : '// No component.';
      case 'theme':
        return themeSource(state.theme);
      case 'translations':
        return translationSource(state.components, state.locales);
      case 'document':
        return documentSource(state.components, state.theme, state.locales);
      default: {
        if (!codeComponent) return '// No components.';
        const ownFindings = findings.filter((finding) => finding.nodeId.startsWith(codeComponent.id));
        return componentSource({ component: codeComponent, components: state.components, findings: ownFindings });
      }
    }
  }, [state.codeTab, state.components, state.theme, state.locales, codeComponent, findings]);

  if (!state.codeOpen) return null;

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const showsPage = state.codeTab === 'component';

  return (
    <section className="drawer" aria-label="Generated code">
      <header className="drawer__head">
        {showsPage && state.components.length > 1 ? (
          <div className="drawer__pages">
            {state.components.map((component) => (
              <button
                key={component.id}
                type="button"
                aria-pressed={component.id === codeComponent?.id}
                onClick={() => dispatch({ type: 'ui', patch: { codeId: component.id } })}
              >
                {component.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="drawer__tabs">
          {tabs.map((tab) => (
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
        <button
          type="button"
          className="drawer__action"
          onClick={() => dispatch({ type: 'ui', patch: { codeOpen: false } })}
        >
          Close
        </button>
      </header>
      <pre className="drawer__code">{source}</pre>
    </section>
  );
}
