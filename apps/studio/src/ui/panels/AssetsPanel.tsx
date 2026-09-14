import { useMemo, useState } from 'react';
import type { DragEvent, KeyboardEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import { groupedByCategory } from '../../registry/catalogue';
import { createComponent, createFrame } from '../../document/factory';
import { locate } from '../../document/tree';
import { isFrame } from '../../document/types';
import { DRAG_ASSET } from '../canvas/dnd';

export function AssetsPanel(): JSX.Element {
  const { state, dispatch } = useStudio();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    return groupedByCategory()
      .map(([category, items]) => [category, items.filter((i) => !term || i.name.toLowerCase().includes(term))] as const)
      .filter(([, items]) => items.length);
  }, [query]);

  const add = (name: string): void => {
    const [first] = [...state.selection];
    const located = first ? locate(state.root, first) : null;
    const parentId = located && isFrame(located.node) ? located.node.id : located?.parent?.id ?? state.root.id;
    const index = located && !isFrame(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER;
    const node = name === '__frame'
      ? createFrame({ padding: 16, radius: 12, background: 'weak' })
      : createComponent(name);
    dispatch({ type: 'insert', parentId, index, nodes: [node] });
  };

  const onDragStart = (name: string) => (event: DragEvent): void => {
    event.dataTransfer.setData(DRAG_ASSET, name);
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <>
      <input
        className="input input--search"
        placeholder="Search components"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="assets">
        <p className="assets__category">Layout</p>
        <ul className="assets__list">
          <Row name="Frame" meta="container" onAdd={() => add('__frame')} onDragStart={onDragStart('__frame')} />
        </ul>
        {groups.map(([category, items]) => (
          <div key={category}>
            <p className="assets__category">{category}</p>
            <ul className="assets__list">
              {items.map((item) => (
                <Row
                  key={item.name}
                  name={item.name}
                  meta={`${Object.keys(item.meta.variants).length || '—'}`}
                  onAdd={() => add(item.name)}
                  onDragStart={onDragStart(item.name)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

interface RowProps {
  name: string;
  meta: string;
  onAdd: () => void;
  onDragStart: (event: DragEvent) => void;
}

/**
 * A plain list. Thumbnails looked richer and read worse: forty-five scaled
 * previews are forty-five different shapes to parse before finding a name.
 *
 * A div rather than a button, because a draggable <button> is unreliable
 * across browsers — that is why nothing could be dragged out of this panel.
 */
function Row({ name, meta, onAdd, onDragStart }: RowProps): JSX.Element {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onAdd();
  };

  return (
    <li>
      <div
        className="asset"
        role="button"
        tabIndex={0}
        title={`${name} — drag onto the canvas`}
        draggable
        onDragStart={onDragStart}
        onClick={onAdd}
        onKeyDown={onKeyDown}
      >
        <span className="asset__name">{name}</span>
        <span className="asset__meta">{meta}</span>
      </div>
    </li>
  );
}
