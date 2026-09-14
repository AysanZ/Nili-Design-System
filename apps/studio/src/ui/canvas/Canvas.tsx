import { useCallback, useRef, useState } from 'react';
import { NiliProvider } from '@nili/ui';
import type { DragEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import { createComponent, createFrame } from '../../document/factory';
import { contains, locate } from '../../document/tree';
import { isFrame } from '../../document/types';
import { cssVariables } from '../../theme/tokens';
import { resolveFont } from '../../theme/presets';
import { NodeView } from './NodeView';
import { DRAG_ASSET, DRAG_NODE, dropTargetAt } from './dnd';
import type { DropIndicator } from './dnd';

export function Canvas(): JSX.Element {
  const { state, dispatch, locale } = useStudio();
  // Direction is a property of the locale, never stored separately: a document
  // authored in English and viewed in Persian must flip without being re-saved.
  const dir = locale?.dir ?? 'ltr';
  const stageRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<DropIndicator | null>(null);

  const onDragOver = useCallback(
    (event: DragEvent): void => {
      const types = event.dataTransfer.types;
      if (!types.includes(DRAG_ASSET) && !types.includes(DRAG_NODE)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = types.includes(DRAG_ASSET) ? 'copy' : 'move';
      setIndicator(dropTargetAt(state.root, event.clientX, event.clientY, dir === 'rtl'));
    },
    [state.root, dir],
  );

  const onDrop = (event: DragEvent): void => {
    event.preventDefault();
    setIndicator(null);
    const asset = event.dataTransfer.getData(DRAG_ASSET);
    const nodeId = event.dataTransfer.getData(DRAG_NODE);
    const target = dropTargetAt(state.root, event.clientX, event.clientY, dir === 'rtl');
    if (!target) return;
    const { kind } = target;

    if (asset) {
      const node = asset === '__frame'
        ? createFrame({ padding: 16, radius: 12, background: 'weak' })
        : createComponent(asset);
      if (kind.mode === 'beside') {
        dispatch({ type: 'insertBeside', targetId: kind.targetId, side: kind.side, nodes: [node] });
      } else {
        dispatch({ type: 'insert', parentId: kind.parentId, index: kind.index, nodes: [node] });
      }
      return;
    }

    if (!nodeId) return;
    if (kind.mode === 'beside') {
      if (nodeId === kind.targetId || contains(state.root, nodeId, kind.targetId)) return;
      dispatch({ type: 'moveBeside', id: nodeId, targetId: kind.targetId, side: kind.side });
      return;
    }
    if (!contains(state.root, nodeId, kind.parentId) && nodeId !== kind.parentId) {
      dispatch({ type: 'move', id: nodeId, parentId: kind.parentId, index: kind.index });
    }
  };

  const themeStyle = cssVariables(state.theme, state.canvasScheme) as Record<string, string>;

  return (
    <main
      className="stage"
      ref={stageRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={(e) => {
        if (!stageRef.current?.contains(e.relatedTarget as Node | null)) setIndicator(null);
      }}
    >
      {/* Clicking empty canvas clears the selection. It is a button rather than
          a handler on <main> so it is reachable from the keyboard, and it sits
          behind the artboard rather than wrapping it. */}
      <button
        type="button"
        className="stage__backdrop"
        aria-label="Clear selection"
        onClick={() => dispatch({ type: 'clearSelection' })}
      />
      <p className="stage__label">
        Page · {locale?.code.toUpperCase() ?? '—'} · {dir.toUpperCase()} · {state.breakpoint}px
      </p>
      <div className="stage__zoom" style={{ transform: `scale(${state.zoom})` }}>
        {/* `attributeTarget="self"` keeps theme and direction on the artboard
            instead of <html>, which is what lets the editor stay LTR while the
            preview renders Persian. */}
        <NiliProvider
          attributeTarget="self"
          theme={state.canvasScheme}
          locale={locale?.code ?? 'en'}
          dir={dir}
        >
          <div
            className="artboard"
            style={{
              ...themeStyle,
              width: state.breakpoint,
              fontFamily: `'${resolveFont(state.theme.fontFamily, dir)}', system-ui, sans-serif`,
            }}
          >
            <NodeView node={state.root} isRoot />
          </div>
        </NiliProvider>
      </div>
      {indicator ? <DropLine indicator={indicator} /> : null}
    </main>
  );
}

/**
 * Fixed-positioned so it is never clipped by the frame it is drawn inside.
 * A side drop also outlines the node it will pair with and says so, because
 * "this will become a row" is not obvious from a line alone.
 */
function DropLine({ indicator }: { indicator: DropIndicator }): JSX.Element {
  const vertical = indicator.orientation === 'vertical';
  return (
    <>
      {indicator.pair ? (
        <div className="drop-pair" style={{ ...indicator.pair }}>
          <span className="drop-pair__label">Row</span>
        </div>
      ) : null}
      <div
        className="drop-line"
        data-orientation={indicator.orientation}
        style={{
          left: indicator.x,
          top: indicator.y,
          width: vertical ? 2 : indicator.length,
          height: vertical ? indicator.length : 2,
        }}
      />
    </>
  );
}

export { locate, isFrame };
