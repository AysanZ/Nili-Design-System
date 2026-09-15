import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NiliProvider } from '@nili/ui';
import { renderNode } from '../core/render';
import { find, makeEl, parentOf } from '../core/tree';
import { label as labelOf } from '../core/tree';
import { container } from '../core/model';
import { useStudio } from '../core/store';
import { useT } from '../i18n';
import { Glyph, ICON, IconBtn, Segmented } from './controls';

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * The rectangle a node occupies, in the artboard's own coordinates.
 *
 * `getBoundingClientRect` reports screen pixels and the artboard is scaled, so
 * the measurements are divided back out — otherwise the selection outline
 * drifts further from the node the further you zoom.
 */
function rectOf(stage: HTMLElement, id: string, zoom: number): Box | null {
  const host = stage.querySelector<HTMLElement>(`[data-node-id="${id}"]`);
  if (!host) return null;
  // The wrapper is `display: contents`, so its own rect is empty: the node's
  // real box is the union of whatever it rendered.
  const parts = [...host.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  if (parts.length === 0) return null;
  const base = stage.getBoundingClientRect();
  let top = Infinity;
  let left = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const part of parts) {
    const rect = part.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    top = Math.min(top, rect.top);
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.right);
    bottom = Math.max(bottom, rect.bottom);
  }
  if (!Number.isFinite(top)) return null;
  return {
    top: (top - base.top) / zoom,
    left: (left - base.left) / zoom,
    width: (right - left) / zoom,
    height: (bottom - top) / zoom,
  };
}

/*
 * A canvas is a pointer surface, and pretending otherwise helps nobody: the
 * keyboard path to every node is the Layers tree, which is a real tree with
 * real focus. These two rules are off for that reason and no other.
 */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

export function Canvas(): JSX.Element {
  const { component, state, dispatch, values } = useStudio();
  const t = useT();
  const stage = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);

  const selected = state.ui.selected;

  const measure = useCallback(() => {
    const host = stage.current;
    if (!host) return;
    const zoom = state.ui.zoom || 1;
    setSelectedBox(selected ? rectOf(host, selected, zoom) : null);
    setHoverBox(hover && hover !== selected ? rectOf(host, hover, zoom) : null);
  }, [selected, hover, state.ui.zoom]);

  useLayoutEffect(measure);

  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(host);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const nodeAt = (target: EventTarget | null): string | null => {
    const element = target instanceof Element ? target.closest('[data-node-id]') : null;
    return element?.getAttribute('data-node-id') ?? null;
  };

  const dir = state.ui.locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <div className="canvas">
      <CanvasBar />

      <div
        className="canvas__stage"
        onMouseLeave={() => setHover(null)}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes('application/nili-component')) {
            event.preventDefault();
            setHover(nodeAt(event.target));
          }
        }}
        onDrop={(event) => {
          const name = event.dataTransfer.getData('application/nili-component');
          if (!name) return;
          event.preventDefault();
          const id = nodeAt(event.target);
          const node = id ? find(component.root, id) : null;
          const parent = node && container(node) ? node : node ? parentOf(component.root, node.id) : null;
          const host = parent ?? component.root;
          dispatch({
            type: 'node.insert',
            node: makeEl(name),
            target: { parent: host.id, index: (container(host) ?? []).length },
          });
          setHover(null);
        }}
      >
        <div
          className="artboard"
          ref={stage}
          style={{ width: component.width, transform: `scale(${state.ui.zoom})` }}
          onClick={(event) => {
            const id = nodeAt(event.target);
            dispatch({ type: 'ui', patch: { selected: id ?? component.root.id } });
          }}
          onMouseMove={(event) => setHover(nodeAt(event.target))}
        >
          <NiliProvider
            attributeTarget="self"
            theme={state.ui.theme}
            locale={state.ui.locale}
            dir={dir}
          >
            <div className="artboard__inner" data-theme={state.ui.theme} lang={state.ui.locale} dir={dir}>
              {renderNode(component.root, { values, editable: true })}
            </div>
          </NiliProvider>

          {hoverBox ? <span className="overlay overlay--hover" style={boxStyle(hoverBox)} /> : null}
          {selectedBox ? (
            <span className="overlay overlay--selected" style={boxStyle(selectedBox)}>
              <span className="overlay__tag">
                {labelOf(find(component.root, selected!) ?? component.root)}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      <footer className="canvas__foot">
        <span className="canvas__states">
          <button
            type="button"
            className="pill"
            aria-pressed={state.ui.stateId === null}
            onClick={() => dispatch({ type: 'ui', patch: { stateId: null } })}
          >
            {t('Sample')}
          </button>
          {component.states.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pill"
              aria-pressed={state.ui.stateId === item.id}
              onClick={() => dispatch({ type: 'ui', patch: { stateId: item.id } })}
            >
              {item.name}
            </button>
          ))}
        </span>
        <span className="spacer" />
        <span className="zoom">
          <IconBtn
            label="−"
            onClick={() => dispatch({ type: 'ui', patch: { zoom: Math.max(0.4, state.ui.zoom - 0.1) } })}
          >
            <Glyph d="M4 8h8" size={12} />
          </IconBtn>
          <button type="button" className="zoom__value" onClick={() => dispatch({ type: 'ui', patch: { zoom: 1 } })}>
            {Math.round(state.ui.zoom * 100)}%
          </button>
          <IconBtn
            label="+"
            onClick={() => dispatch({ type: 'ui', patch: { zoom: Math.min(2, state.ui.zoom + 0.1) } })}
          >
            <Glyph d={ICON.plus} size={12} />
          </IconBtn>
        </span>
      </footer>
    </div>
  );
}

export function CanvasBar(): JSX.Element {
  const { state, dispatch } = useStudio();
  const t = useT();
  return (
    <div className="canvas__bar">
      <Segmented
        value={state.ui.theme}
        onChange={(theme) => dispatch({ type: 'ui', patch: { theme } })}
        options={[
          { value: 'light' as const, label: t('Light') },
          { value: 'dark' as const, label: t('Dark') },
        ]}
      />
      <Segmented
        value={state.ui.locale}
        onChange={(locale) => dispatch({ type: 'ui', patch: { locale } })}
        options={[
          { value: 'en' as const, label: 'LTR' },
          { value: 'fa' as const, label: 'RTL' },
        ]}
      />
    </div>
  );
}

const boxStyle = (box: Box): React.CSSProperties => ({
  top: box.top,
  left: box.left,
  width: box.width,
  height: box.height,
});
