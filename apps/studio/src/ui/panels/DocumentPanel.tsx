import { useEffect, useRef, useState } from 'react';
import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { DocNode, ComponentDef } from '../../document/types';
import { isFrame } from '../../document/types';
import { isBinding } from '../../logic/types';
import { DRAG_ASSET, DRAG_NODE } from '../canvas/dnd';
import { createComponent, createFrame } from '../../document/factory';
import { locate } from '../../document/tree';
import { useContextMenu } from '../ContextMenu';
import { NodeGlyph, defaultLabel } from '../glyphs';

/**
 * One tree, with the components as its roots.
 *
 * Pages and Layers used to be two panels, which meant the answer to "whose
 * tree am I looking at?" lived in a different tab from the tree. Merging them
 * removes a destination from the rail and makes the containment real: a layer
 * is *inside* a component, and now it looks that way.
 */
export function DocumentPanel(): JSX.Element {
  const { state, dispatch } = useStudio();

  return (
    <>
      <div className="tree" role="tree" aria-label="Document">
        {state.components.map((component) => (
          <ComponentBranch key={component.id} component={component} />
        ))}
      </div>
      {/* `panel__body` scrolls and carries no padding, so anything sitting
          directly in it has to bring its own or it touches the edge. */}
      <div className="panel__foot">
        <button type="button" className="action action--dashed" onClick={() => dispatch({ type: 'addComponent' })}>
          + New component
        </button>
        <p className="note">
          One artboard, one exported component. Drag an artboard by its title to move it on the board.
        </p>
      </div>
    </>
  );
}

function ComponentBranch({ component }: { component: ComponentDef }): JSX.Element {
  const { state, dispatch } = useStudio();
  const active = component.id === state.activeId;
  const open = state.expanded.has(component.root.id);
  const [renaming, setRenaming] = useState(false);
  /* Focus by hand rather than through `autoFocus`, which fires on mount
     wherever the element happens to be — a different promise from "the field
     the person just asked to edit". */
  const rename = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renaming) rename.current?.select();
  }, [renaming]);

  return (
    <>
      <div className={`prow${active ? ' is-active' : ''}`}>
        <button
          type="button"
          className={`prow__caret${open ? ' is-open' : ''}`}
          aria-label={open ? 'Collapse' : 'Expand'}
          onClick={() => dispatch({ type: 'toggleExpanded', id: component.root.id })}
        >
          ›
        </button>
        <button
          type="button"
          className="prow__main"
          onClick={() => dispatch({ type: 'setActiveComponent', id: component.id })}
          onDoubleClick={() => setRenaming(true)}
        >
          {renaming ? (
            <input
              ref={rename}
              className="input input--inline"
              value={component.name}
              onClick={(event) => event.stopPropagation()}
              onBlur={() => setRenaming(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') setRenaming(false);
              }}
              onChange={(event) => dispatch({ type: 'patchComponent', id: component.id, patch: { name: event.target.value } })}
            />
          ) : (
            <span className="prow__name">{component.name}</span>
          )}
          <span className="prow__file">{component.component}.tsx</span>
        </button>
      </div>
      {open ? component.root.children.map((child) => <Row key={child.id} node={child} depth={1} component={component} />) : null}
    </>
  );
}

type DropEdge = 'before' | 'after' | 'inside';

function Row({ node, depth, component }: { node: DocNode; depth: number; component: ComponentDef }): JSX.Element {
  const { state, dispatch, findingsByNode } = useStudio();
  const menu = useContextMenu();
  const [edge, setEdge] = useState<DropEdge | null>(null);
  const [renaming, setRenaming] = useState(false);
  /* Focus by hand rather than through `autoFocus`, which fires on mount
     wherever the element happens to be — a different promise from "the field
     the person just asked to edit". */
  const rename = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renaming) rename.current?.select();
  }, [renaming]);
  const selected = state.selection.has(node.id);
  const expanded = state.expanded.has(node.id);
  const findings = (findingsByNode.get(node.id) ?? []).filter((f) => f.severity !== 'info');
  const severity = findings.some((f) => f.severity === 'error') ? 'error' : findings.length ? 'warning' : null;

  const bound = node.kind === 'component' && Object.values(node.props).some(isBinding);
  const componentName = node.kind === 'instance'
    ? state.components.find((item) => item.id === node.componentId)?.name
    : undefined;

  const onClick = (event: MouseEvent): void => {
    dispatch({ type: 'select', ids: [node.id], additive: event.shiftKey || event.metaKey || event.ctrlKey });
  };

  const onDragStart = (event: DragEvent): void => {
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
    setEdge(edgeAt(event));
  };

  const onDrop = (event: DragEvent): void => {
    const target = edgeAt(event);
    setEdge(null);
    event.preventDefault();
    event.stopPropagation();

    const located = locate(component.root, node.id);
    const parentId = target === 'inside' ? node.id : located?.parent?.id ?? component.root.id;
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
    if (event.key === 'F2') {
      event.preventDefault();
      setRenaming(true);
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    dispatch({ type: 'select', ids: [node.id], additive: event.shiftKey });
  };

  return (
    <>
      <div
        className={`layer${selected ? ' is-selected' : ''}${edge ? ` is-drop-${edge}` : ''}`}
        style={{ paddingInlineStart: 10 + depth * 14 }}
        draggable
        role="treeitem"
        tabIndex={0}
        aria-selected={selected}
        aria-expanded={isFrame(node) && node.children.length ? expanded : undefined}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={() => setEdge(null)}
        onDrop={onDrop}
        onClick={onClick}
        onDoubleClick={() => setRenaming(true)}
        onKeyDown={onKeyDown}
        onContextMenu={(event) => menu.open(event, node.id)}
      >
        {/* One hairline per level of depth. Counting pixels stops working at
            about three levels in, and this tree now routinely goes deeper. */}
        {Array.from({ length: depth }, (_, level) => (
          <span key={level} className="layer__guide" style={{ insetInlineStart: 16 + level * 14 }} />
        ))}

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

        <span className="layer__glyph"><NodeGlyph node={node} /></span>

        {renaming ? (
          <input
            ref={rename}
            className="input input--inline"
            defaultValue={defaultLabel(node, componentName)}
            onClick={(event) => event.stopPropagation()}
            onBlur={(event) => {
              dispatch({ type: 'renameNode', id: node.id, label: event.target.value });
              setRenaming(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur();
              if (event.key === 'Escape') setRenaming(false);
            }}
          />
        ) : (
          <>
            <span className="layer__name">{defaultLabel(node, componentName)}</span>
            {node.label && node.kind === 'component' ? (
              <span className="layer__type">{node.component}</span>
            ) : null}
          </>
        )}

        {/* The link between the logic layer and the tree. Without these, a node
            with a render condition looks exactly like one without, and the only
            way to tell is to select every node in turn. */}
        <span className="layer__marks">
          {bound ? <span className="chip chip--fx" title="Has a computed prop">fx</span> : null}
          {node.visibleWhen ? (
            <span className="chip chip--if" title={`Shown when ${node.visibleWhen.expr}`}>if</span>
          ) : null}
          {node.repeat ? (
            <span className="chip chip--repeat" title={`Repeats over ${node.repeat.each.expr}`}>
              ↻ {node.repeat.as || 'item'}
            </span>
          ) : null}
          {node.events && Object.keys(node.events).length ? (
            <span className="chip chip--event" title={Object.keys(node.events).join(', ')}>⚡</span>
          ) : null}
          {severity ? <span className={`layer__flag layer__flag--${severity}`} aria-label={severity} /> : null}
        </span>
      </div>

      {isFrame(node) && expanded
        ? node.children.map((child) => <Row key={child.id} node={child} depth={depth + 1} component={component} />)
        : null}
    </>
  );
}
