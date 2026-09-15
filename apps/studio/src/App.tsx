import { useEffect } from 'react';
import { StudioProvider, useStudio } from './document/StudioContext';
import { useHotkeys } from './hooks/useHotkeys';
import { Toolbar } from './ui/Toolbar';
import { LeftPanel } from './ui/LeftPanel';
import { Canvas } from './ui/canvas/Canvas';
import { BottomBar } from './ui/BottomBar';
import { ContextMenuProvider } from './ui/ContextMenu';
import { ResizeHandle } from './ui/ResizeHandle';
import { RightPanel } from './ui/RightPanel';
import { ComponentPage } from './ui/ComponentPage';
import { CodeDrawer } from './ui/CodeDrawer';
import { CommandPalette } from './ui/CommandPalette';

function Studio(): JSX.Element {
  const { state, dispatch } = useStudio();
  const [selected] = [...state.selection];
  useHotkeys(dispatch, selected ?? null);

  // Both attributes go on <html>: `data-ui` drives the chrome palette and
  // `data-theme` drives the Nili components used inside the chrome. Overlays
  // that render outside the studio subtree need them too.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ui = state.uiScheme;
    root.dataset.theme = state.uiScheme;
  }, [state.uiScheme]);

  const style = {
    '--left-width': `${state.leftWidth}px`,
    '--right-width': `${state.rightWidth}px`,
  } as React.CSSProperties;

  return (
    <div className="studio" style={style}>
      <Toolbar />
      <LeftPanel />
      <ResizeHandle
        side="left"
        width={state.leftWidth}
        min={266}
        max={460}
        onResize={(leftWidth) => dispatch({ type: 'ui', patch: { leftWidth } })}
      />
      <Canvas />
      <ResizeHandle
        side="right"
        width={state.rightWidth}
        min={240}
        max={440}
        onResize={(rightWidth) => dispatch({ type: 'ui', patch: { rightWidth } })}
      />
      <RightPanel />
      <BottomBar />
      <CodeDrawer />
      <ComponentPage />
      <CommandPalette />
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <StudioProvider>
      <ContextMenuProvider>
        <Studio />
      </ContextMenuProvider>
    </StudioProvider>
  );
}
