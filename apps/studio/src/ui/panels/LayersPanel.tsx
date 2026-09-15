import { useState, type DragEvent } from 'react';
import { label as labelOf, parentOf } from '../../core/tree';
import { container, describeCond, type AnyNode } from '../../core/model';
import { useStudio } from '../../core/store';
import { useT } from '../../i18n';
import { Empty, Glyph, ICON, IconBtn } from '../controls';

type Where = 'before' | 'after' | 'inside';
interface Drop {
  id: string;
  where: Where;
}

const iconFor = (node: AnyNode): string => {
  if (node.kind === 'box') return node.layout.dir === 'row' ? ICON.row : ICON.col;
  if (node.kind === 'text') return ICON.text;
  if (node.kind === 'slot') return ICON.slot;
  return ICON.box;
};

export function LayersPanel(): JSX.Element {
  const { component, state, dispatch } = useStudio();
  const t = useT();
  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);

  const root = component.root;

  const place = (targetId: string, where: Where): void => {
    if (!dragging || dragging === targetId) return;
    if (where === 'inside') {
      const node = findNode(root, targetId);
      const children = node ? (container(node) ?? []) : [];
      dispatch({ type: 'node.move', id: dragging, target: { parent: targetId, index: children.length } });
      return;
    }
    const parent = parentOf(root, targetId);
    if (!parent) return;
    const siblings = container(parent) ?? [];
    const index = siblings.findIndex((child: AnyNode) => child.id === targetId);
    dispatch({
      type: 'node.move',
      id: dragging,
      target: { parent: parent.id, index: where === 'before' ? index : index + 1 },
    });
  };

  const rows: JSX.Element[] = [];
  const walkInto = (node: AnyNode, depth: number): void => {
    const selected = state.ui.selected === node.id;
    const children = container(node);
    const isRoot = node.id === root.id;

    rows.push(
      <div
        key={node.id}
        className="layer"
        role="treeitem"
        tabIndex={0}
        aria-selected={selected}
        aria-level={depth + 1}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            dispatch({ type: 'ui', patch: { selected: node.id } });
          }
        }}
        data-selected={selected ? '' : undefined}
        data-drop={drop?.id === node.id ? drop.where : undefined}
        style={{ paddingInlineStart: 8 + depth * 14 }}
        draggable={!isRoot}
        onDragStart={(event) => {
          setDragging(node.id);
          event.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => {
          setDragging(null);
          setDrop(null);
        }}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          if (!dragging) return;
          event.preventDefault();
          const box = event.currentTarget.getBoundingClientRect();
          const offset = (event.clientY - box.top) / box.height;
          const where: Where = children
            ? offset < 0.28
              ? 'before'
              : offset > 0.72
                ? 'after'
                : 'inside'
            : offset < 0.5
              ? 'before'
              : 'after';
          setDrop({ id: node.id, where: isRoot ? 'inside' : where });
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (drop) place(drop.id, drop.where);
          setDragging(null);
          setDrop(null);
        }}
        onClick={() => dispatch({ type: 'ui', patch: { selected: node.id } })}
      >
        <span className="layer__icon">
          <Glyph d={iconFor(node)} size={12} />
        </span>
        <span className="layer__name">{labelOf(node)}</span>
        {node.when ? (
          <span className="layer__cond" title={describeCond(node.when)}>
            <Glyph d={ICON.eye} size={11} />
          </span>
        ) : null}
        {!isRoot ? (
          <span className="layer__actions">
            <IconBtn label={t('Duplicate')} onClick={() => dispatch({ type: 'node.duplicate', id: node.id })}>
              <Glyph d={ICON.copy} size={12} />
            </IconBtn>
            <IconBtn
              label={t('Delete')}
              tone="danger"
              onClick={() => dispatch({ type: 'node.remove', id: node.id })}
            >
              <Glyph d={ICON.trash} size={12} />
            </IconBtn>
          </span>
        ) : null}
      </div>,
    );

    for (const child of children ?? []) walkInto(child, depth + 1);
  };
  walkInto(root, 0);

  return (
    <div className="panel">
      <div className="panel__scroll panel__scroll--flush" role="tree" aria-label="Layers">
        {root.children.length === 0 ? (
          <>
            {rows[0]}
            <Empty title={t('Nothing drawn yet')} body={t('Pick a component from Insert')} />
          </>
        ) : (
          rows
        )}
      </div>
    </div>
  );
}

function findNode(root: AnyNode, id: string): AnyNode | null {
  if (root.id === id) return root;
  for (const child of container(root) ?? []) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
}
