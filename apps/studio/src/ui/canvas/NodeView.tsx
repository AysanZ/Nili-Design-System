import { createContext, createElement, memo, useContext, useEffect, useRef } from 'react';
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { AxisSize, DocNode, FrameDirection, FrameLayout, FrameNode, ComponentDef } from '../../document/types';
import { breakpointFor, isFrame } from '../../document/types';
import { implementationFor, materialize } from '../../registry/adapter';
import type { Handlers } from '../../registry/adapter';
import { evaluateSource } from '../../expr';
import type { Scope } from '../../expr';
import { withItem } from '../../logic/scope';
import { stateClasses } from '../../codegen/states';
import { useContextMenu } from '../ContextMenu';
import { NodeBoundary } from './NodeBoundary';
import { DRAG_NODE } from './dnd';
import { ResizeFrame } from './ResizeFrame';
import type { Locale } from '../../i18n/types';
import type { Finding } from '../../lint/types';

/**
 * Whether this tree is being authored or simply run.
 *
 * The app shell renders the same `NodeView` as the canvas, which is what keeps
 * the two honest about each other — but a running app has no selection, no
 * drag handles and no lint badges, and leaving them in meant a click both
 * pressed a button and selected a node. Editing affordances are a property of
 * where the tree is mounted, not of the tree, so they live in a context.
 */
export const EditableContext = createContext(true);

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

/**
 * The layout as it is at this artboard's width.
 *
 * Which finally gives the artboard width a job beyond cropping: widening a
 * component switches the canvas to the variant that width selects, so a responsive
 * override is something you see rather than something you hope for.
 */
function layoutAt(node: FrameNode, width: number): FrameLayout {
  const stop = breakpointFor(width);
  if (!stop) return node.layout;
  let merged = node.layout;
  for (const id of ['sm', 'md', 'lg', 'xl'] as const) {
    const override = node.responsive?.[id]?.layout;
    if (override) merged = { ...merged, ...override };
    if (id === stop) break;
  }
  return merged;
}

function sizeAt(node: DocNode, width: number): DocNode['size'] {
  const stop = breakpointFor(width);
  if (!stop) return node.size;
  let merged = node.size;
  for (const id of ['sm', 'md', 'lg', 'xl'] as const) {
    const override = node.responsive?.[id]?.size;
    if (override) merged = { ...merged, ...override };
    if (id === stop) break;
  }
  return merged;
}

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
function sizeStyle(node: DocNode, isRoot: boolean, parentDirection: FrameDirection, board: number): CSSProperties {
  if (isRoot) return {};
  const { width, height } = sizeAt(node, board);
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
  scope: Scope;
  isRoot?: boolean;
  parentDirection?: FrameDirection;
  /** The artboard's width, which selects the responsive variant to draw. */
  board?: number;
  /** Instances render another component's tree; this stops that from recursing forever. */
  depth?: number;
}

/**
 * A repeat is resolved here rather than in the renderer below, so everything
 * downstream sees an ordinary node with an ordinary scope — which is why a
 * repeated subtree is selectable, resizable and inspectable exactly like any
 * other, without a single branch for "is this inside a list".
 */
export const NodeView = memo(function NodeView({
  node,
  scope,
  isRoot = false,
  parentDirection = 'vertical',
  board = 440,
  depth = 0,
}: NodeViewProps): JSX.Element | null {
  const { state } = useStudio();
  const previewing = state.mode === 'preview';

  if (node.repeat && !isRoot) {
    const alias = node.repeat.as || 'item';
    const { value } = evaluateSource(node.repeat.each.expr, scope);
    const rows = Array.isArray(value) ? value : [];

    if (!rows.length) {
      // Nothing to repeat over. In preview that means an empty list and the
      // node is genuinely absent; while designing, one placeholder row keeps
      // the template on the canvas where it can still be edited.
      if (previewing) return null;
      return (
        <Rendered
          node={node}
          scope={withItem(scope, alias, undefined, 0)}
          parentDirection={parentDirection}
          isRoot={false}
          board={board}
          depth={depth}
          badge={`repeat ${alias} · no rows`}
        />
      );
    }

    return (
      <>
        {rows.map((row, index) => (
          <Rendered
            key={index}
            node={node}
            scope={withItem(scope, alias, row, index)}
            parentDirection={parentDirection}
            isRoot={false}
            board={board}
            depth={depth}
            clone={index > 0}
            badge={index === 0 ? `repeat ${alias} · ${rows.length}` : undefined}
          />
        ))}
      </>
    );
  }

  return (
    <Rendered
      node={node}
      scope={scope}
      parentDirection={parentDirection}
      isRoot={isRoot}
      board={board}
      depth={depth}
    />
  );
});

interface RenderedProps {
  node: DocNode;
  scope: Scope;
  isRoot: boolean;
  parentDirection: FrameDirection;
  board: number;
  depth: number;
  /** Copies past the first carry no `data-node`, so drag-and-drop stays unambiguous. */
  clone?: boolean;
  badge?: string;
}

function Rendered({ node, scope, isRoot, parentDirection, board, depth, clone, badge }: RenderedProps): JSX.Element | null {
  const { state, dispatch, locale, findingsByNode } = useStudio();
  const menu = useContextMenu();
  const editable = useContext(EditableContext);
  const ref = useRef<HTMLDivElement>(null);
  const selected = editable && state.selection.has(node.id);
  const findings = findingsByNode.get(node.id) ?? [];
  const flag = severityOf(findings);
  const previewing = state.mode === 'preview';

  // Selecting in the layers list has to move the canvas, or the selection
  // happens somewhere the user cannot see.
  useEffect(() => {
    if (!selected || clone) return;
    // Optional-called: not every environment implements it, and a missing
    // scroll must not break selection.
    ref.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [selected, clone]);

  const condition = node.visibleWhen?.expr;
  const hidden = condition ? !evaluateSource(condition, scope).value : false;
  if (hidden && previewing) return null;

  const select = (additive: boolean): void => dispatch({ type: 'select', ids: [node.id], additive });

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
  // is excluded: there is nowhere for the component itself to go.
  const draggable = editable && !isRoot && !previewing;
  const onDragStart = (event: DragEvent): void => {
    if (isRoot) return;
    event.stopPropagation();
    event.dataTransfer.setData(DRAG_NODE, node.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  /* In a running app these are simply absent. Not disabled, not hidden by CSS
     — absent, so the node is not a button in the accessibility tree and a
     screen reader describes the component the way the shipped one will. */
  const selectable = editable
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-pressed': selected,
        draggable,
        onDragStart,
        onClick,
        onKeyDown,
        onContextMenu: (event: ReactMouseEvent) => menu.open(event, node.id),
      }
    : {};

  const interaction = stateClasses(node.states);
  const marks = [
    selected ? ' is-selected' : '',
    hidden ? ' is-hidden' : '',
    node.repeat ? ' is-repeated' : '',
    clone ? ' is-clone' : '',
  ].join('');

  const marker = editable ? badge ?? (condition ? `if ${condition}` : null) : null;
  const showFlag = editable ? flag : null;

  if (isFrame(node)) {
    return (
      <div
        ref={ref}
        {...(clone ? {} : { 'data-node': node.id, 'data-frame': 'true' })}
        className={`node${marks}${isRoot ? ' node--root' : ''} ${node.className} ${interaction}`}
        style={{ ...frameStyle(layoutAt(node, board)), ...sizeStyle(node, isRoot, parentDirection, board) }}
        {...selectable}
      >
        {isRoot || !editable ? null : <span className="node__tag">Frame</span>}
        {marker && !isRoot ? <span className="node__logic">{marker}</span> : null}
        {showFlag && !isRoot ? (
          <span className={`node__flag node__flag--${showFlag}`}>{showFlag === 'error' ? 'Error' : 'Warning'}</span>
        ) : null}
        {selected && !isRoot && !clone ? <ResizeFrame node={node} parentDirection={parentDirection} /> : null}
        {node.children.length ? (
          node.children.map((child) => (
            <NodeView
              key={child.id}
              node={child}
              scope={scope}
              parentDirection={layoutAt(node, board).direction}
              board={board}
              depth={depth}
            />
          ))
        ) : editable ? (
          <p className="node__empty">Empty frame — drop a component here</p>
        ) : null}
      </div>
    );
  }

  /* A slot shows its default content, outlined, with its name — because the
     one thing you cannot tell by looking at a component is where somebody
     else's content is allowed to go. */
  if (node.kind === 'slot') {
    return (
      <div
        ref={ref}
        {...(clone ? {} : { 'data-node': node.id, 'data-frame': 'true' })}
        className={`node node--slot${marks}${editable ? '' : ' is-plain'}`}
        style={{ ...sizeStyle(node, false, parentDirection, board), display: 'flex', flexDirection: 'column', gap: 8 }}
        {...selectable}
      >
        {editable ? <span className="node__slot">{node.name}</span> : null}
        {node.children.length ? (
          node.children.map((child) => (
            <NodeView key={child.id} node={child} scope={scope} board={board} depth={depth} />
          ))
        ) : editable ? (
          <p className="node__empty">Slot — drop the default content here</p>
        ) : null}
      </div>
    );
  }

  if (node.kind === 'instance') {
    const component = state.components.find((component) => component.id === node.componentId);
    return (
      <div
        ref={ref}
        {...(clone ? {} : { 'data-node': node.id })}
        className={`node node--instance${marks}${showFlag ? ` has-${showFlag}` : ''} ${interaction}`}
        style={sizeStyle(node, false, parentDirection, board)}
        {...selectable}
      >
        {component && depth < 6 ? (
          <NodeView
            node={component.root}
            scope={instanceScope(component, node.args, scope)}
            isRoot
            board={board}
            depth={depth + 1}
          />
        ) : (
          <p className="node__missing">{component ? 'Component nests too deeply' : 'Missing component'}</p>
        )}
        {editable ? (
          <span className="node__logic node__logic--instance">{component?.name ?? 'missing'}</span>
        ) : null}
        {selected && !clone ? <ResizeFrame node={node} parentDirection={parentDirection} /> : null}
      </div>
    );
  }

  const assetMap = Object.fromEntries(state.assets.map((asset) => [asset.name, asset.dataUrl]));

  /* Events are wired to nothing here, deliberately. A component says that
     something happened; the application placing it decides what follows, and
     the canvas is not that application. The handler exists only so the control
     is interactive and its pressed and focused states can be seen. */
  const handlers: Handlers = {};
  if (previewing) {
    for (const event of Object.keys(node.events ?? {})) handlers[event] = () => undefined;
  }

  return (
    <div
      ref={ref}
      {...(clone ? {} : { 'data-node': node.id })}
      className={`node node--component${marks}${showFlag ? ` has-${showFlag}` : ''} ${interaction}`}
      style={sizeStyle(node, false, parentDirection, board)}
      title={showFlag ? reasonFor(findings) : undefined}
      {...selectable}
    >
      <ComponentView
        node={node as Extract<DocNode, { kind: 'component' }>}
        locale={locale}
        scope={scope}
        handlers={handlers}
        assets={assetMap}
      />
      {marker ? <span className="node__logic">{marker}</span> : null}
      {showFlag ? (
        <span className={`node__flag node__flag--${showFlag}`}>{showFlag === 'error' ? 'Error' : 'Warning'}</span>
      ) : null}
      {selected && !clone ? <ResizeFrame node={node} parentDirection={parentDirection} /> : null}
    </div>
  );
}

function ComponentView({ node, locale, scope, handlers, assets }: {
  node: Extract<DocNode, { kind: 'component' }>;
  locale: Locale | undefined;
  scope: Scope;
  handlers: Handlers;
  assets: Record<string, string>;
}): JSX.Element {
  const implementation = implementationFor(node.component);
  if (!implementation) {
    return <p className="node__missing">No implementation for {node.component}</p>;
  }
  // Pointer events are off inside the preview so a click selects the node
  // rather than activating the control it lands on — except in preview mode,
  // where activating the control is the entire point.
  return (
    <div className="node__inner">
      <NodeBoundary component={node.component}>
        {createElement(implementation, materialize(node, locale, scope, handlers, assets))}
      </NodeBoundary>
    </div>
  );
}

/**
 * What a component sees when it is placed.
 *
 * Its parameters, evaluated in the *caller's* scope, plus its own state and
 * resources. Deliberately not the caller's variables: a component that can
 * read whatever happens to be defined where it was dropped is not reusable,
 * it is a macro.
 */
function instanceScope(component: ComponentDef, args: Record<string, unknown>, outer: Scope): Scope {
  const scope: Scope = { t: outer.t };
  for (const param of component.params) {
    const value = args[param.name];
    if (value === undefined) {
      scope[param.name] = param.sample;
      continue;
    }
    if (value !== null && typeof value === 'object' && (value as { kind?: string }).kind === 'expr') {
      scope[param.name] = evaluateSource((value as { expr: string }).expr, outer).value;
      continue;
    }
    if (value !== null && typeof value === 'object' && 'kind' in (value as object)) {
      const text = value as { kind: string; value?: string; key?: string };
      scope[param.name] = text.kind === 'literal' ? text.value : text.key;
      continue;
    }
    scope[param.name] = value;
  }
  return scope;
}

export type { FrameNode };
