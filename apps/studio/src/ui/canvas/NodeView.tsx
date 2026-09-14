import { createElement, memo, useEffect, useRef } from 'react';
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { AxisSize, DocNode, FrameDirection, FrameLayout, FrameNode } from '../../document/types';
import { isFrame } from '../../document/types';
import { implementationFor, materialize } from '../../registry/adapter';
import { useContextMenu } from '../ContextMenu';
import { NodeBoundary } from './NodeBoundary';
import { DRAG_NODE } from './dnd';
import { ResizeFrame } from './ResizeFrame';
import type { Locale } from '../../i18n/types';
import type { Finding } from '../../lint/types';

const ALIGN: Record<FrameLayout['align'], CSSProperties['alignItems']> = {
  stretch: 'stretch', start: 'flex-start', center: 'center', end: 'flex-end',
};
const JUSTIFY: Record<FrameLayout['justify'], CSSProperties['justifyContent']> = {
  start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between',
};
const BACKGROUND: Record<FrameLayout['background'], string> = {
  none: 'transparent',
  surface: 'var(--nili-white-0)',
  weak: 'var(--nili-weak-50)',
  card: 'var(--nili-white-0)',
};

function frameStyle(layout: FrameLayout): CSSProperties {
  return {
    display: 'flex',
    flexDirection: layout.direction === 'vertical' ? 'column' : 'row',
    gap: layout.gap,
    padding: layout.padding,
    alignItems: ALIGN[layout.align],
    justifyContent: JUSTIFY[layout.justify],
    flexWrap: layout.wrap ? 'wrap' : 'nowrap',
    background: BACKGROUND[layout.background],
    borderRadius: layout.radius || undefined,
    border: layout.background === 'card' ? '1px solid var(--nili-soft-200)' : undefined,
    minHeight: 24,
    position: 'relative',
  };
}

const axis = (value: AxisSize): string | undefined =>
  typeof value === 'number' ? `${value}px` : value === 'fill' ? '100%' : undefined;

/**
 * The wrapper is the flex child on the canvas; in generated code the component
 * is. Both express the same three states, in the form each medium needs.
 */
function sizeStyle(node: DocNode, isRoot: boolean, parentDirection: FrameDirection): CSSProperties {
  if (isRoot) return {};
  const { width, height } = node.size;
  const main = parentDirection === 'horizontal' ? width : height;
  return {
    width: axis(width),
    height: axis(height),
    flex: main === 'fill' ? '1 1 0%' : '0 0 auto',
    minWidth: parentDirection === 'horizontal' && main === 'fill' ? 0 : undefined,
  };
}

const severityOf = (findings: Finding[]): 'error' | 'warning' | null => {
  if (findings.some((f) => f.severity === 'error')) return 'error';
  if (findings.some((f) => f.severity === 'warning')) return 'warning';
  return null;
};

/** The outline colour means nothing on its own, so the node also says why. */
const reasonFor = (findings: Finding[]): string =>
  findings
    .filter((f) => f.severity !== 'info')
    .map((f) => (f.fix ? `${f.message} ${f.fix}.` : f.message))
    .join('\n');

interface NodeViewProps {
  node: DocNode;
  isRoot?: boolean;
  parentDirection?: FrameDirection;
}

export const NodeView = memo(function NodeView({
  node,
  isRoot = false,
  parentDirection = 'vertical',
}: NodeViewProps): JSX.Element {
  const { state, dispatch, locale, findingsByNode } = useStudio();
  const menu = useContextMenu();
  const ref = useRef<HTMLDivElement>(null);
  const selected = state.selection.has(node.id);
  const findings = findingsByNode.get(node.id) ?? [];
  const flag = severityOf(findings);

  // Selecting in the layers list has to move the canvas, or the selection
  // happens somewhere the user cannot see.
  useEffect(() => {
    if (!selected) return;
    // Optional-called: not every environment implements it, and a missing
    // scroll must not break selection.
    ref.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [selected]);

  const select = (additive: boolean): void =>
    dispatch({ type: 'select', ids: [node.id], additive });

  const onClick = (event: ReactMouseEvent): void => {
    event.stopPropagation();
    select(event.shiftKey || event.metaKey || event.ctrlKey);
  };

  // Selection has to work from the keyboard too, or the canvas is unusable for
  // exactly the users the lint panel exists to protect.
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    select(event.shiftKey);
  };

  // Nodes are draggable on the canvas, not only in the layers list. The root
  // is excluded: there is nowhere for the page itself to go.
  const draggable = !isRoot;
  const onDragStart = (event: DragEvent): void => {
    if (isRoot) return;
    event.stopPropagation();
    event.dataTransfer.setData(DRAG_NODE, node.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const selectable = {
    role: 'button' as const,
    tabIndex: 0,
    'aria-pressed': selected,
    draggable,
    onDragStart,
    onClick,
    onKeyDown,
    onContextMenu: (event: ReactMouseEvent) => menu.open(event, node.id),
  };

  if (isFrame(node)) {
    return (
      <div
        ref={ref}
        data-node={node.id}
        data-frame="true"
        className={`node${selected ? ' is-selected' : ''}${isRoot ? ' node--root' : ''} ${node.className}`}
        style={{ ...frameStyle(node.layout), ...sizeStyle(node, isRoot, parentDirection) }}
        {...selectable}
      >
        {isRoot ? null : <span className="node__tag">Frame</span>}
        {flag && !isRoot ? (
          <span className={`node__flag node__flag--${flag}`}>{flag === 'error' ? 'Error' : 'Warning'}</span>
        ) : null}
        {selected && !isRoot ? <ResizeFrame node={node} parentDirection={parentDirection} /> : null}
        {node.children.length ? (
          node.children.map((child) => (
            <NodeView key={child.id} node={child} parentDirection={node.layout.direction} />
          ))
        ) : (
          <p className="node__empty">Empty frame — drop a component here</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-node={node.id}
      className={`node node--component${selected ? ' is-selected' : ''}${flag ? ` has-${flag}` : ''}`}
      style={sizeStyle(node, false, parentDirection)}
      title={flag ? reasonFor(findings) : undefined}
      {...selectable}
    >
      <ComponentView node={node as Extract<DocNode, { kind: 'component' }>} locale={locale} />
      {flag ? (
        <span className={`node__flag node__flag--${flag}`}>{flag === 'error' ? 'Error' : 'Warning'}</span>
      ) : null}
      {selected ? <ResizeFrame node={node} parentDirection={parentDirection} /> : null}
    </div>
  );
});

function ComponentView({ node, locale }: {
  node: Extract<DocNode, { kind: 'component' }>;
  locale: Locale | undefined;
}): JSX.Element {
  const implementation = implementationFor(node.component);
  if (!implementation) {
    return <p className="node__missing">No implementation for {node.component}</p>;
  }
  // Pointer events are off inside the preview so a click selects the node
  // rather than activating the control it lands on.
  return (
    <div className="node__inner">
      <NodeBoundary component={node.component}>
        {createElement(implementation, materialize(node, locale))}
      </NodeBoundary>
    </div>
  );
}

export type { FrameNode };
