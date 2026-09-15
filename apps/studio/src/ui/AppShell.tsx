import { useEffect } from 'react';
import { NiliProvider } from '@nili/ui';
import { StudioProvider, useStudio } from '../document/StudioContext';
import { activeComponent } from '../document/state';
import { cssVariables } from '../theme/tokens';
import { resolveFont } from '../theme/presets';
import { EditableContext, NodeView } from './canvas/NodeView';
import { ControlsPanel } from './run/ControlsPanel';

/**
 * One component, on its own, with its properties on a panel beside it.
 *
 * It opens in its own tab and reads the same autosaved document the studio
 * writes, so there is no build step between drawing a component and trying
 * every state it has. It is deliberately not an application: the previous
 * version of this page ran a whole screen with routing and fetches, and
 * that was the tool answering questions it had no business answering.
 */
function Shell(): JSX.Element {
  const { state, dispatch, locale, scopeFor } = useStudio();
  const component = activeComponent(state);
  const dir = locale?.dir ?? 'ltr';

  useEffect(() => {
    if (state.mode !== 'preview') dispatch({ type: 'ui', patch: { mode: 'preview' } });
  }, [state.mode, dispatch]);

  useEffect(() => {
    document.title = `${component.component} — Nili`;
  }, [component.component]);

  const themeStyle = cssVariables(state.theme, state.canvasScheme) as Record<string, string>;

  return (
    <div className="appshell" data-ui={state.canvasScheme}>
      <main className="appshell__stage">
        <NiliProvider attributeTarget="self" theme={state.canvasScheme} locale={locale?.code ?? 'en'} dir={dir}>
          <div
            className="appshell__component"
            style={{
              ...themeStyle,
              maxWidth: component.width,
              fontFamily: `'${resolveFont(state.theme.fontFamily, dir)}', system-ui, sans-serif`,
            }}
          >
            {/* Everything below this is a component running, not a document. */}
            <EditableContext.Provider value={false}>
              <NodeView node={component.root} scope={scopeFor(component)} isRoot board={component.width} />
            </EditableContext.Provider>
          </div>
        </NiliProvider>
      </main>

      <aside className="appshell__controls">
        <ControlsPanel />
      </aside>

      <nav className="appshell__bar" aria-label="Components">
        {state.components.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === component.id}
            onClick={() => dispatch({ type: 'setActiveComponent', id: item.id })}
          >
            {item.name}
          </button>
        ))}
        <span className="appshell__spacer" />
        <button type="button" onClick={() => window.close()}>Close</button>
      </nav>
    </div>
  );
}

export function AppShell(): JSX.Element {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  );
}
