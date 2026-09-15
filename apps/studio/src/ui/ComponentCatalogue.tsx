import { useEffect, useMemo, useState } from 'react';
import type { DragEvent, KeyboardEvent } from 'react';
import { NiliProvider } from '@nili/ui';
import { useStudio } from '../document/StudioContext';
import { createComponent } from '../document/factory';
import { locate } from '../document/tree';
import { isFrame } from '../document/types';
import type { ComponentNode } from '../document/types';
import { getComponent } from '../registry/catalogue';
import { implementationFor, materialize } from '../registry/adapter';
import { presetsFor } from '../registry/presets';
import type { Preset } from '../registry/presets';
import { DRAG_ASSET, DRAG_PRESET } from './canvas/dnd';
import { NodeBoundary } from './canvas/NodeBoundary';

/**
 * A component's own page, beside the library.
 *
 * This is Storybook's overview, made pickable. The grid in Insert answers
 * "which component?" and stops; the question after it — *which of its shapes
 * did I mean?* — was being answered by inserting one, opening the inspector
 * and stepping through four selects while watching the canvas.
 *
 * It is a panel and not a dialog for one reason that decides everything else:
 * the canvas has to stay visible, because the point is to drag a variant onto
 * it. A modal would cover the only place the drag could land.
 *
 * Nothing here is authored. The variants come from `cva` through the registry,
 * so a variant added to the library shows up the next time the registry is
 * built and no file in this app changes.
 */
export function ComponentCatalogue(): JSX.Element | null {
  const { state, dispatch, locale, component: active } = useStudio();
  const [query, setQuery] = useState('');
  const name = state.catalogue;

  const close = (): void => dispatch({ type: 'ui', patch: { catalogue: null } });

  useEffect(() => {
    if (!name) return;
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') dispatch({ type: 'ui', patch: { catalogue: null } });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [name, dispatch]);

  const groups = useMemo(() => (name ? presetsFor(name) : []), [name]);
  if (!name) return null;

  const entry = getComponent(name);
  const { meta } = entry;

  /** Where a click-to-insert lands: the same rule the Insert grid uses. */
  const target = (): { parentId: string; index: number } => {
    const [first] = [...state.selection];
    const located = first ? locate(active.root, first) : null;
    return {
      parentId: located && isFrame(located.node) ? located.node.id : located?.parent?.id ?? active.root.id,
      index: located && !isFrame(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER,
    };
  };

  const insert = (node: ComponentNode): void => {
    const { parentId, index } = target();
    dispatch({ type: 'insert', parentId, index, nodes: [node] });
  };

  const term = query.trim().toLowerCase();
  const shown = groups
    .map((group) => ({
      ...group,
      presets: group.presets.filter(
        (preset) => !term || preset.label.toLowerCase().includes(term) || group.title.toLowerCase().includes(term),
      ),
    }))
    .filter((group) => group.presets.length);

  return (
    <aside className="cat" aria-label={`${name} variants`}>
      <header className="cat__head">
        <div className="cat__title">
          <strong>{name}</strong>
          <em>{entry.category} · {Object.keys(meta.props).length} props</em>
        </div>
        <button type="button" className="cat__x" aria-label="Close" onClick={close}>×</button>
      </header>

      <p className="cat__lede">
        Every shape this one comes in. Drag one onto the canvas, or click to drop it in — it arrives
        exactly as you see it here, and you can change anything afterwards.
      </p>

      <div className="cat__search">
        <input
          className="input"
          placeholder="Filter variants"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="cat__body">
        {/* The component is shown on the surface it will sit on — the canvas's
            theme, not the editor's. */}
        <NiliProvider attributeTarget="self" theme={state.canvasScheme} locale={locale?.code ?? 'en'} dir={locale?.dir ?? 'ltr'}>
          <div className="cat__scope">
            {shown.length === 0 ? (
              <p className="note note--quiet">
                {groups.length ? 'No variant matches that.' : 'This one comes in a single shape.'}
              </p>
            ) : null}

            {shown.map((group) => (
              <section key={group.id} className="cat__group">
                <h4>
                  {group.title}
                  <span>{group.presets.length}</span>
                </h4>
                {group.doc ? <p className="cat__doc">{group.doc}</p> : null}
                <div className="cat__grid">
                  {group.presets.map((preset) => (
                    <PresetTile
                      key={preset.id}
                      component={name}
                      preset={preset}
                      onInsert={insert}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </NiliProvider>
      </div>
    </aside>
  );
}

/**
 * One variant, drawn from the node that dropping it would create.
 *
 * Building the real node and rendering it through `materialize` — the same
 * function the canvas uses — is what makes the tile a promise rather than an
 * illustration. The previous version rendered from a separate bag of preview
 * props, so a Button that said "Label" in the sheet arrived on the canvas
 * saying "Button".
 */
function PresetTile({ component, preset, onInsert }: {
  component: string;
  preset: Preset;
  onInsert: (node: ComponentNode) => void;
}): JSX.Element {
  const { state, locale } = useStudio();
  const Implementation = implementationFor(component);

  /* One node per render: it is what the tile draws and what a drop inserts,
     so the two cannot drift. */
  const node = useMemo(() => createComponent(component, preset.props), [component, preset]);

  const assets = useMemo(
    () => Object.fromEntries(state.assets.map((asset) => [asset.name, asset.dataUrl])),
    [state.assets],
  );

  const onDragStart = (event: DragEvent): void => {
    event.dataTransfer.setData(DRAG_ASSET, component);
    event.dataTransfer.setData(DRAG_PRESET, JSON.stringify(node.props));
    event.dataTransfer.effectAllowed = 'copy';
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onInsert(createComponent(component, preset.props));
  };

  return (
    /* A div rather than a button: a draggable `<button>` is unreliable across
       browsers, which is the same reason the Insert tiles are divs. */
    <div
      className="cat__tile"
      role="button"
      tabIndex={0}
      draggable
      title={`${component} · ${preset.label} — drag onto the canvas, or press Enter`}
      onDragStart={onDragStart}
      onClick={() => onInsert(createComponent(component, preset.props))}
      onKeyDown={onKeyDown}
    >
      <span className="cat__stage">
        {Implementation ? (
          <NodeBoundary component={component}>
            <Implementation {...materialize(node, locale, {}, {}, assets)} />
          </NodeBoundary>
        ) : (
          <span className="note note--quiet">No preview</span>
        )}
      </span>
      <span className="cat__label">{preset.label}</span>
    </div>
  );
}
