import { createFrame } from './factory';
import { nextId } from './factory';
import { collect, insert, locate, move, remove, reorder, replace } from './tree';
import { ROOT_ID, isFrame } from './types';
import type { DocNode, FrameNode, NodeId } from './types';
import type { Action, StudioState } from './state';
import { MUTATING } from './state';

const withoutRoot = (ids: Iterable<NodeId>): NodeId[] => [...ids].filter((id) => id !== ROOT_ID);

function cloneSubtree(node: DocNode): DocNode {
  if (isFrame(node)) return { ...node, id: nextId(), children: node.children.map(cloneSubtree) };
  return { ...node, id: nextId(), props: { ...node.props } };
}

/** Where a new node goes when the user did not drop it somewhere specific. */
function insertionTarget(state: StudioState): { parentId: NodeId; index: number } {
  const [first] = [...state.selection];
  if (!first) return { parentId: ROOT_ID, index: Number.MAX_SAFE_INTEGER };
  const located = locate(state.root, first);
  if (!located) return { parentId: ROOT_ID, index: Number.MAX_SAFE_INTEGER };
  if (isFrame(located.node)) return { parentId: located.node.id, index: located.node.children.length };
  return { parentId: located.parent?.id ?? ROOT_ID, index: located.index + 1 };
}

function apply(state: StudioState, action: Action): StudioState {
  switch (action.type) {
    case 'select': {
      if (!action.additive) return { ...state, selection: new Set(action.ids) };
      const next = new Set(state.selection);
      for (const id of action.ids) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return { ...state, selection: next.size ? next : new Set(action.ids) };
    }
    case 'selectAll':
      return { ...state, selection: new Set(collect(state.root).map((n) => n.id).filter((id) => id !== ROOT_ID)) };
    case 'clearSelection':
      return { ...state, selection: new Set() };
    case 'toggleExpanded': {
      const next = new Set(state.expanded);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      return { ...state, expanded: next };
    }
    case 'expand':
      return { ...state, expanded: new Set([...state.expanded, ...action.ids]) };

    case 'insert': {
      const root = insert(state.root, action.parentId, action.index, action.nodes);
      return {
        ...state,
        root,
        selection: new Set(action.nodes.map((n) => n.id)),
        expanded: new Set([...state.expanded, action.parentId]),
      };
    }
    case 'move':
      return { ...state, root: move(state.root, action.id, action.parentId, action.index) };

    case 'insertBeside':
    case 'moveBeside': {
      const target = locate(state.root, action.targetId);
      if (!target?.parent) return state;

      const incoming = action.type === 'insertBeside'
        ? action.nodes
        : [locate(state.root, action.id)?.node].filter((n): n is DocNode => Boolean(n));
      if (!incoming.length) return state;
      if (action.type === 'moveBeside' && action.id === action.targetId) return state;

      const offset = action.side === 'end' ? 1 : 0;

      // The parent is already a row: this is an ordinary insert next to the
      // target, no new frame needed.
      if (target.parent.layout.direction === 'horizontal') {
        const stripped = action.type === 'moveBeside'
          ? remove(state.root, new Set([action.id]))
          : state.root;
        const at = locate(stripped, action.targetId);
        if (!at?.parent) return state;
        return {
          ...state,
          root: insert(stripped, at.parent.id, at.index + offset, incoming),
          selection: new Set(incoming.map((n) => n.id)),
        };
      }

      /* The parent runs vertically, so putting something beside the target
         means the target becomes a row of two. This is the whole reason a
         side-drop exists: otherwise laying two things out horizontally takes
         three separate steps. */
      const stripped = action.type === 'moveBeside'
        ? remove(state.root, new Set([action.id]))
        : state.root;
      const at = locate(stripped, action.targetId);
      if (!at?.parent) return state;

      const ordered = offset ? [at.node, ...incoming] : [...incoming, at.node];
      const row = createFrame({ direction: 'horizontal', gap: 8, align: 'center' }, ordered);
      const withoutTarget = remove(stripped, new Set([action.targetId]));
      const slot = locate(withoutTarget, at.parent.id);
      if (!slot) return state;

      return {
        ...state,
        root: insert(withoutTarget, at.parent.id, at.index, [row]),
        selection: new Set(incoming.map((n) => n.id)),
        expanded: new Set([...state.expanded, row.id]),
      };
    }

    case 'setSize':
      return {
        ...state,
        root: replace(state.root, action.id, (node) => ({
          ...node,
          size: { ...node.size, [action.axis]: action.value },
        })),
      };
    case 'reorder':
      return { ...state, root: reorder(state.root, action.id, action.delta) };
    case 'delete': {
      const ids = withoutRoot(state.selection);
      if (!ids.length) return state;
      return { ...state, root: remove(state.root, new Set(ids)), selection: new Set() };
    }
    case 'duplicate': {
      const ids = withoutRoot(state.selection);
      if (!ids.length) return state;
      let root = state.root;
      const created: NodeId[] = [];
      for (const id of ids) {
        const located = locate(root, id);
        if (!located?.parent) continue;
        const copy = cloneSubtree(located.node);
        created.push(copy.id);
        root = insert(root, located.parent.id, located.index + 1, [copy]);
      }
      return { ...state, root, selection: new Set(created) };
    }
    case 'copy': {
      const ids = withoutRoot(state.selection);
      const nodes = ids.map((id) => locate(state.root, id)?.node).filter((n): n is DocNode => Boolean(n));
      return nodes.length ? { ...state, clipboard: nodes.map(cloneSubtree) } : state;
    }
    case 'paste': {
      if (!state.clipboard.length) return state;
      const { parentId, index } = insertionTarget(state);
      const copies = state.clipboard.map(cloneSubtree);
      return {
        ...state,
        root: insert(state.root, parentId, index, copies),
        selection: new Set(copies.map((n) => n.id)),
        expanded: new Set([...state.expanded, parentId]),
      };
    }
    case 'wrapInFrame': {
      const ids = withoutRoot(state.selection);
      if (!ids.length) return state;
      const first = locate(state.root, ids[0]!);
      if (!first?.parent) return state;
      const picked = ids
        .map((id) => locate(state.root, id)?.node)
        .filter((n): n is DocNode => Boolean(n));
      const frame = createFrame({ gap: 8, direction: action.direction ?? 'vertical' }, picked);
      const stripped = remove(state.root, new Set(ids));
      const root = insert(stripped, first.parent.id, first.index, [frame]);
      return { ...state, root, selection: new Set([frame.id]), expanded: new Set([...state.expanded, frame.id]) };
    }

    case 'setProp':
      return {
        ...state,
        root: replace(state.root, action.id, (node) =>
          node.kind === 'component' ? { ...node, props: { ...node.props, [action.key]: action.value } } : node,
        ),
      };
    case 'setClassName':
      return { ...state, root: replace(state.root, action.id, (node) => ({ ...node, className: action.value })) };
    case 'setLayout':
      return {
        ...state,
        root: replace(state.root, action.id, (node) =>
          isFrame(node) ? { ...node, layout: { ...node.layout, ...action.patch } } : node,
        ),
      };

    case 'setTheme':
      return { ...state, theme: { ...state.theme, ...action.patch } };
    case 'addLocale': {
      const others = state.locales.filter((l) => l.code !== action.locale.code);
      return { ...state, locales: [...others, action.locale], activeLocale: action.locale.code };
    }
    case 'removeLocale': {
      const locales = state.locales.filter((l) => l.code !== action.code);
      if (!locales.length) return state;
      const active = state.activeLocale === action.code ? locales[0]!.code : state.activeLocale;
      return { ...state, locales, activeLocale: active };
    }
    case 'setActiveLocale':
      return { ...state, activeLocale: action.code };
    case 'setMessage':
      return {
        ...state,
        locales: state.locales.map((l) =>
          l.code === action.code ? { ...l, messages: { ...l.messages, [action.key]: action.value } } : l,
        ),
      };

    case 'ui':
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

export interface HistoryState {
  present: StudioState;
  past: StudioState[];
  future: StudioState[];
  /** Identifies the gesture the last entry came from, for coalescing. */
  gesture?: string;
}

const LIMIT = 80;

/**
 * History wraps the reducer instead of living inside it, so no individual case
 * has to remember to record itself.
 */
export function historyReducer(state: HistoryState, action: Action): HistoryState {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    if (!previous) return state;
    return { present: previous, past: state.past.slice(0, -1), future: [state.present, ...state.future] };
  }
  if (action.type === 'redo') {
    const [next, ...rest] = state.future;
    if (!next) return state;
    return { present: next, past: [...state.past, state.present], future: rest };
  }

  const present = apply(state.present, action);
  if (present === state.present) return state;
  if (!MUTATING.has(action.type)) return { ...state, present };

  // A continuous gesture (a resize drag, a colour scrub) collapses into the
  // single entry it started with.
  const gesture = 'coalesce' in action ? action.coalesce : undefined;
  if (gesture && gesture === state.gesture) return { ...state, present, future: [] };

  return {
    present,
    past: [...state.past, state.present].slice(-LIMIT),
    future: [],
    ...(gesture ? { gesture } : { gesture: undefined }),
  };
}

export type { FrameNode };
