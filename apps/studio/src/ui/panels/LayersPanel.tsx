import { useState } from 'react';
import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { DocNode } from '../../document/types';
import { isFrame } from '../../document/types';
import { DRAG_ASSET, DRAG_NODE } from '../canvas/dnd';
import { createComponent, createFrame } from '../../document/factory';
import { locate } from '../../document/tree';
import { useContextMenu } from '../ContextMenu';

interface RowProps {
  node: DocNode;
  depth: number;
}

type DropEdge = 'before' | 'after' | 'inside';

function Row({ node, depth }: RowProps): JSX.Element {
  const { state, dispatch, findingsByNode } = useStudio();
  const menu = useContextMenu();
  const [edge, setEdge] = useState<DropEdge | null>(null);
  const selected = state.selection.has(node.id);
  const expanded = state.expanded.has(node.id);
  const findings = (findingsByNode.get(node.id) ?? []).filter((f) => f.severity !== 'info');
  const severity = findings.some((f) => f.severity === 'error') ? 'error' : findings.length ? 'warning' : null;
  const isRoot = node.id === state.root.id;

  const label = isFrame(node)
    ? isRoot
      ? 'Page'
      : `${node.layout.direction === 'vertical' ? 'Vertical' : 'Horizontal'} frame`
    : node.component;

  const onClick = (event: MouseEvent): void => {
    dispatch({ type: 'select', ids: [node.id], additive: event.shiftKey || event.metaKey || event.ctrlKey });
  };

  const onDragStart = (event: DragEvent): void => {
    if (isRoot) return;
    event.stopPropagation();
    event.dataTransfer.setData(DRAG_NODE, node.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  /**
   * A row is three drop zones: the top and bottom thirds insert as a sibling,
   * the middle drops inside when the row is a frame. Without the thirds, a
   * dense tree gives you no way to land beside a frame instead of in it.
   */
  const edgeAt = (event: DragEvent): DropEdge => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - box.top) / box.height;
    if (isFrame(node) && ratio > 0.3 && ratio < 0.7) return 'inside';
    return ratio < 0.5 ? 'before' : 'after';
  };

  const onDragOver = (event: DragEvent): void => {
    const types = event.dataTransfer.types;
    if (!types.includes(DRAG_NODE) && !types.includes(DRAG_ASSET)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = types.includes(DRAG_ASSET) ? 'copy' : 'move';
    setEdge(isRoot ? 'inside' : edgeAt(event));
  };

  const onDrop = (event: DragEvent): void => {
    const target = isRoot ? 'inside' : edgeAt(event);
    setEdge(null);
    event.preventDefault();
    event.stopPropagation();

    const located = locate(state.root, node.id);
    const parentId = target === 'inside' ? node.id : located?.parent?.id ?? state.root.id;
    const index = target === 'inside'
      ? (isFrame(node) ? node.children.length : 0)
      : (located?.index ?? 0) + (target === 'after' ? 1 : 0);

    const asset = event.dataTransfer.getData(DRAG_ASSET);
    if (asset) {
      const created = asset === '__frame'
        ? createFrame({ padding: 16, radius: 12, background: 'weak' })
        : createComponent(asset);
      dispatch({ type: 'insert', parentId, index, nodes: [created] });
      return;
    }

    const moved = event.dataTransfer.getData(DRAG_NODE);
    if (moved && moved !== node.id) dispatch({ type: 'move', id: moved, parentId, index });
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    dispatch({ type: 'select', ids: [node.id], additive: event.shiftKey });
  };

  return (
    <>
      <div
        className={`layer${selected ? ' is-selected' : ''}${edge ? ` is-drop-${edge}` : ''}`}
        style={{ paddingInlineStart: 8 + depth * 13 }}
        draggable={!isRoot}
        role="treeitem"
        tabIndex={0}
        aria-selected={selected}
        aria-expanded={isFrame(node) && node.children.length ? expanded : undefined}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={() => setEdge(null)}
        onDrop={onDrop}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onContextMenu={(event) => menu.open(event, node.id)}
      >
        <button
          type="button"
          className={`layer__caret${expanded ? ' is-open' : ''}`}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          onClick={(event) => {
            event.stopPropagation();
            dispatch({ type: 'toggleExpanded', id: node.id });
          }}
        >
          {isFrame(node) && node.children.length ? '›' : ''}
        </button>
        <span className="layer__name">{label}</span>
        {severity ? <span className={`layer__flag layer__flag--${severity}`} aria-label={severity} /> : null}
      </div>
      {isFrame(node) && expanded
        ? node.children.map((child) => <Row key={child.id} node={child} depth={depth + 1} />)
        : null}
    </>
  );
}

export function LayersPanel(): JSX.Element {
  const { state } = useStudio();
  return (
    <>
      <div className="layers" role="tree" aria-label="Layers">
        <Row node={state.root} depth={0} />
      </div>
      <p className="note">Shift-click to select several. Drag a row to move it.</p>
    </>
  );
}
