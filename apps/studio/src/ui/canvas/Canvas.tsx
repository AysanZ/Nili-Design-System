import { useCallback, useEffect, useRef, useState } from 'react';
import { NiliProvider } from '@nili/ui';
import type { DragEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import { createComponent, createFrame } from '../../document/factory';
import { contains } from '../../document/tree';
import type { ComponentDef } from '../../document/types';
import { GUTTER, isFrame } from '../../document/types';
import type { PropBag } from '../../document/types';
import { cssVariables } from '../../theme/tokens';
import { resolveFont } from '../../theme/presets';
import { NodeView } from './NodeView';
import { DRAG_ASSET, DRAG_NODE, DRAG_PRESET, dropTargetAt } from './dnd';
import { CanvasBar } from './CanvasBar';
import { stateScope } from '../../logic/scope';
import { fitAll, zoomAround, zoomByCentre } from './view';
import type { DropIndicator } from './dnd';

/** The four artboard widths, offered on the title of the component they resize. */
const WIDTHS: { value: number; label: string }[] = [
  { value: 380, label: 'sm' },
  { value: 440, label: 'md' },
  { value: 640, label: 'lg' },
  { value: 960, label: 'xl' },
];



/**
 * The canvas is a board, not a viewport onto one screen.
 *
 * Every component is an artboard at its own coordinates, and pan and zoom are a
 * single transform on the world beneath them. That is the whole difference
 * from the previous version, and it is the reason a sign-up screen and the
 * screen it navigates to can be looked at together — which is when the
 * `navigate` step stops being an abstraction.
 */
export function Canvas(): JSX.Element {
  const { state, dispatch, locale, component: active } = useStudio();
  const dir = locale?.dir ?? 'ltr';
  const stageRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<DropIndicator | null>(null);
  const [panning, setPanning] = useState(false);

  /** The component whose artboard is under a viewport point. */
  const pageAt = useCallback(
    (x: number, y: number): ComponentDef | null => {
      const element = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-component]');
      const id = element?.dataset.component;
      return state.components.find((component) => component.id === id) ?? null;
    },
    [state.components],
  );

  const onDragOver = useCallback(
    (event: DragEvent): void => {
      const types = event.dataTransfer.types;
      if (!types.includes(DRAG_ASSET) && !types.includes(DRAG_NODE)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = types.includes(DRAG_ASSET) ? 'copy' : 'move';
      const component = pageAt(event.clientX, event.clientY);
      setIndicator(component ? dropTargetAt(component.root, event.clientX, event.clientY, dir === 'rtl') : null);
    },
    [pageAt, dir],
  );

  const onDrop = (event: DragEvent): void => {
    event.preventDefault();
    setIndicator(null);
    const component = pageAt(event.clientX, event.clientY);
    if (!component) return;

    const asset = event.dataTransfer.getData(DRAG_ASSET);
    const nodeId = event.dataTransfer.getData(DRAG_NODE);
    const target = dropTargetAt(component.root, event.clientX, event.clientY, dir === 'rtl');
    if (!target) return;
    const { kind } = target;

    if (asset) {
      /* A variant dragged from a component's page lands set up the way it was
         drawn there. Without this the thing you dropped and the thing you
         pointed at would be two different components with the same name. */
      const preset = event.dataTransfer.getData(DRAG_PRESET);
      const node = asset === '__frame'
        ? createFrame({ padding: 16, radius: 12, background: 'weak' })
        : createComponent(asset, preset ? (JSON.parse(preset) as PropBag) : {});
      if (kind.mode === 'beside') {
        dispatch({ type: 'insertBeside', targetId: kind.targetId, side: kind.side, nodes: [node] });
      } else {
        dispatch({ type: 'insert', parentId: kind.parentId, index: kind.index, nodes: [node] });
      }
      return;
    }

    if (!nodeId) return;
    if (kind.mode === 'beside') {
      if (nodeId === kind.targetId || contains(component.root, nodeId, kind.targetId)) return;
      dispatch({ type: 'moveBeside', id: nodeId, targetId: kind.targetId, side: kind.side });
      return;
    }
    if (!contains(component.root, nodeId, kind.parentId) && nodeId !== kind.parentId) {
      dispatch({ type: 'move', id: nodeId, parentId: kind.parentId, index: kind.index });
    }
  };

  /* Trackpad conventions, because nobody wants to learn a third set: two
     fingers pans, pinch — which the browser reports as ctrl+wheel — zooms
     about the cursor rather than about the centre.
     
     Attached natively rather than through `onWheel`, because React registers
     its wheel listener as passive: `preventDefault` there is ignored, so a
     pinch zoomed the whole studio instead of the board. This is the one place
     in the app where a native listener is not a shortcut but the only way. */
  const view = useRef({ zoom: state.zoom, pan: state.pan });
  view.current = { zoom: state.zoom, pan: state.pan };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const onWheel = (event: globalThis.WheelEvent): void => {
      event.preventDefault();
      const box = stage.getBoundingClientRect();
      const { zoom: current, pan } = view.current;

      if (event.ctrlKey || event.metaKey) {
        dispatch({
          type: 'ui',
          patch: zoomAround({ zoom: current, pan }, Math.exp(-event.deltaY * 0.0022), {
            x: event.clientX - box.left,
            y: event.clientY - box.top,
          }),
        });
        return;
      }

      // Shift swaps the axis, the way it does in every canvas tool.
      const dx = event.shiftKey ? event.deltaY : event.deltaX;
      const dy = event.shiftKey ? event.deltaX : event.deltaY;
      dispatch({ type: 'ui', patch: { pan: { x: pan.x - dx, y: pan.y - dy } } });
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [dispatch]);

  /* Holding space turns the whole board into a pan surface, which is how every
     canvas tool works and the only way to move a view that is covered edge to
     edge in artboards. */
  const [spaceHeld, setSpaceHeld] = useState(false);
  useEffect(() => {
    const editing = (target: EventTarget | null): boolean =>
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

    const down = (event: KeyboardEvent): void => {
      if (event.code !== 'Space' || editing(event.target)) return;
      event.preventDefault();
      setSpaceHeld(true);
    };
    const up = (event: KeyboardEvent): void => {
      if (event.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    // Alt-tabbing away with space held would otherwise leave the board stuck.
    window.addEventListener('blur', () => setSpaceHeld(false));
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Middle mouse, space-drag, or a drag on the empty board, pans.
  const onPointerDown = (event: ReactPointerEvent): void => {
    const onBackdrop = (event.target as HTMLElement).classList.contains('stage__backdrop');
    if (event.button !== 1 && !(event.button === 0 && (onBackdrop || spaceHeld))) return;
    event.preventDefault();
    setPanning(true);
    const origin = { x: event.clientX, y: event.clientY, pan: state.pan };
    const move = (move: PointerEvent): void => {
      dispatch({
        type: 'ui',
        patch: {
          pan: { x: origin.pan.x + (move.clientX - origin.x), y: origin.pan.y + (move.clientY - origin.y) },
        },
      });
    };
    const up = (): void => {
      setPanning(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  /* The canvas shortcuts every tool shares. They live here rather than with
     the document shortcuts because they need the viewport, and because zoom is
     not an edit — pressing them should not land in the undo stack. */
  useEffect(() => {
    const editing = (target: EventTarget | null): boolean =>
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

    const onKey = (event: KeyboardEvent): void => {
      if (editing(event.target)) return;
      const stage = stageRef.current;
      if (!stage) return;
      const box = stage.getBoundingClientRect();
      const mod = event.metaKey || event.ctrlKey;

      // `+` arrives as `=` on most layouts, so both are accepted.
      if (mod && (event.key === '=' || event.key === '+')) {
        event.preventDefault();
        dispatch({ type: 'ui', patch: zoomByCentre(view.current, 1.25, box) });
        return;
      }
      if (mod && event.key === '-') {
        event.preventDefault();
        dispatch({ type: 'ui', patch: zoomByCentre(view.current, 0.8, box) });
        return;
      }
      if (mod && event.key === '0') {
        event.preventDefault();
        dispatch({ type: 'ui', patch: { zoom: 1 } });
        return;
      }
      if (event.shiftKey && (event.key === 'A' || event.key === 'a')) {
        event.preventDefault();
        dispatch({ type: 'ui', patch: { allStates: !state.allStates } });
        return;
      }
      if (event.shiftKey && event.key === '1') {
        event.preventDefault();
        const patch = fitAll(state.components, box, state.measured);
        if (patch) dispatch({ type: 'ui', patch });
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, state.components, state.allStates]);

  /* Open on the whole board rather than on a guess about the first artboard.
     With components stacked downward the board is taller than it is wide, and a
     hand-computed offset put the second screen below the fold on every
     window that was not the one it was written against. */
  const framed = useRef(false);
  useEffect(() => {
    if (framed.current) return;
    const box = stageRef.current?.getBoundingClientRect();
    if (!box || !box.width) return;
    framed.current = true;
    const patch = fitAll(state.components, box, state.measured);
    if (patch) dispatch({ type: 'ui', patch });
  }, [dispatch, state.components, state.measured]);

  return (
    <main
      className={`stage${panning ? ' is-panning' : ''}${spaceHeld ? ' is-grabbing' : ''}${state.mode === 'preview' ? ' is-live' : ''}`}
      ref={stageRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPointerDown={onPointerDown}
      onDragLeave={(e) => {
        if (!stageRef.current?.contains(e.relatedTarget as Node | null)) setIndicator(null);
      }}
    >
      {/* Clicking the empty board clears the selection. It is a button rather
          than a handler on <main> so it is reachable from the keyboard, and it
          sits behind the artboards rather than wrapping them. */}
      <button
        type="button"
        className="stage__backdrop"
        aria-label="Clear selection"
        onClick={() => dispatch({ type: 'clearSelection' })}
      />

      <CanvasBar />

      <div
        className="stage__world"
        style={{ transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})` }}
      >
        {state.components.map((component) => (
          <Artboard key={component.id} component={component} dir={dir} />
        ))}

        {/* Every state of the component being edited, laid out to the right of
            its own artboard. Four appearances in one glance is the whole point
            of naming them. */}
        {state.allStates
          ? (active?.states ?? []).map((item, index) => (
              <Artboard
                key={`${active.id}:${item.id}`}
                component={{
                  ...active,
                  id: `${active.id}:${item.id}`,
                  name: item.name,
                  x: active.x + (active.width + GUTTER) * (index + 1),
                }}
                dir={dir}
                overrideScope={stateScope(active.params, item.values)}
                stateName={item.name}
              />
            ))
          : null}
      </div>

      {indicator ? <DropLine indicator={indicator} /> : null}

    </main>
  );
}

interface ArtboardProps {
  component: ComponentDef;
  dir: 'ltr' | 'rtl';
  /** Set when this board is a copy showing one named state. */
  overrideScope?: ReturnType<typeof stateScope>;
  stateName?: string;
}

function Artboard({ component, dir, overrideScope, stateName }: ArtboardProps): JSX.Element {
  const { state, dispatch, locale, scopeFor } = useStudio();
  const isActive = component.id === state.activeId && !stateName;
  const frame = useRef<HTMLDivElement>(null);

  /* Only the DOM knows how tall a component is. Reporting it back is what lets the
     board restack without overlapping when a component is widened, and what makes
     Fit frame the real thing rather than a guess about aspect ratios. */
  useEffect(() => {
    const element = frame.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    if (stateName) return undefined; // a state board is a view, not an artboard
    const observer = new ResizeObserver(([entry]) => {
      const height = entry?.contentRect.height ?? 0;
      if (height > 0) dispatch({ type: 'measureComponent', id: component.id, height: Math.round(height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [dispatch, component.id, stateName]);
  const themeStyle = cssVariables(state.theme, state.canvasScheme) as Record<string, string>;

  /* The title is the handle. Dragging the artboard body would fight with
     dragging the nodes inside it, and Figma made the same call. */
  const onTitlePointerDown = (event: ReactPointerEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    dispatch({ type: 'setActiveComponent', id: component.id });
    const origin = { x: event.clientX, y: event.clientY, pageX: component.x, pageY: component.y };
    const gesture = `component:${component.id}`;
    const move = (move: PointerEvent): void => {
      dispatch({
        type: 'moveComponent',
        id: component.id,
        x: Math.round(origin.pageX + (move.clientX - origin.x) / state.zoom),
        y: Math.round(origin.pageY + (move.clientY - origin.y) / state.zoom),
        coalesce: gesture,
      });
    };
    const up = (): void => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const live = state.mode === 'preview' && isActive;

  return (
    <div
      className={`board${isActive ? ' is-active' : ''}${live ? ' is-live' : ''}${stateName ? ' is-ghost' : ''}`}
      style={{ left: component.x, top: component.y, width: component.width }}
      data-component={component.id}
    >
      <div className="board__title" onPointerDown={onTitlePointerDown}>
        <span className="board__name">{component.name}</span>
        <span className="board__meta">
          {stateName ? stateName : `${component.component}.tsx`}
          {live ? <em className="board__live">live</em> : null}
        </span>
        {/* Widths used to sit in the floating canvas bar, which claimed they
            were a property of the view. They are a property of this component, so
            they live on this component's title — where the width they set is the
            thing directly underneath. */}
        <span className="board__widths" onPointerDown={(event) => event.stopPropagation()}>
          {WIDTHS.map((width) => (
            <button
              key={width.value}
              type="button"
              aria-pressed={component.width === width.value}
              title={`${width.value}px`}
              onClick={() => dispatch({ type: 'patchComponent', id: component.id, patch: { width: width.value } })}
            >
              {width.label}
            </button>
          ))}
        </span>
      </div>

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
          ref={frame}
          className="artboard"
          style={{
            ...themeStyle,
            width: component.width,
            fontFamily: `'${resolveFont(state.theme.fontFamily, dir)}', system-ui, sans-serif`,
          }}
        >
          <NodeView
            node={component.root}
            scope={overrideScope ?? scopeFor(component)}
            isRoot
            board={component.width}
          />
        </div>
      </NiliProvider>
    </div>
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

export { isFrame };
