import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  sampleValues,
  type AnyNode,
  type ComponentDoc,
  type Doc,
  type Json,
  type NamedState,
  type NodeId,
  type PropDef,
  type Value,
} from './model';
import {
  contains,
  duplicate,
  find,
  insert,
  makeComponent,
  parentOf,
  remove,
  replace,
  uid,
  updateRoot,
  type DropTarget,
} from './tree';
import { starter } from './starter';

export type View = 'design' | 'variants' | 'code';
export type LeftTab = 'insert' | 'layers' | 'api';

export interface UI {
  view: View;
  left: LeftTab;
  selected: NodeId | null;
  /** The theme the preview is painted in. The chrome has its own. */
  theme: 'light' | 'dark';
  chrome: 'light' | 'dark';
  /** Preview locale — decides direction and font. */
  locale: 'en' | 'fa';
  /** The studio's own language. */
  lang: 'en' | 'fa';
  zoom: number;
  /** Named state being previewed, or null for the samples. */
  stateId: string | null;
  /** Props crossed in the variants grid. */
  axes: [string | null, string | null];
  leftWidth: number;
  rightWidth: number;
  codeFile: string;
}

export interface StudioState {
  doc: Doc;
  ui: UI;
  past: Doc[];
  future: Doc[];
}

export type Action =
  | { type: 'ui'; patch: Partial<UI> }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'doc.replace'; doc: Doc }
  | { type: 'component.add'; name: string }
  | { type: 'component.remove'; id: string }
  | { type: 'component.select'; id: string }
  | { type: 'component.patch'; patch: Partial<Omit<ComponentDoc, 'id' | 'root'>> }
  | { type: 'prop.add'; prop: PropDef }
  | { type: 'prop.patch'; id: string; patch: Partial<PropDef> }
  | { type: 'prop.remove'; id: string }
  | { type: 'prop.move'; id: string; to: number }
  | { type: 'state.add'; state: NamedState }
  | { type: 'state.patch'; id: string; patch: Partial<NamedState> }
  | { type: 'state.remove'; id: string }
  | { type: 'node.insert'; node: AnyNode; target: DropTarget; select?: boolean }
  | { type: 'node.remove'; id: NodeId }
  | { type: 'node.duplicate'; id: NodeId }
  | { type: 'node.move'; id: NodeId; target: DropTarget }
  | { type: 'node.patch'; id: NodeId; patch: Record<string, unknown> }
  | { type: 'node.prop'; id: NodeId; key: string; value: Value | undefined };

const HISTORY_LIMIT = 80;

/** Actions that change the document and therefore belong in history. */
const isEdit = (action: Action): boolean =>
  action.type !== 'ui' &&
  action.type !== 'undo' &&
  action.type !== 'redo' &&
  action.type !== 'component.select';

export const activeComponent = (state: StudioState): ComponentDoc =>
  state.doc.components.find((c) => c.id === state.doc.activeId) ?? state.doc.components[0];

/**
 * Identity is the signal, so a no-op has to stay the same object.
 *
 * The history stack records an action when the document changed, and it knows
 * that by reference. Rebuilding the array unconditionally would push an undo
 * step for a move that was refused — and then undo would appear to do nothing.
 */
function patchActive(doc: Doc, fn: (component: ComponentDoc) => ComponentDoc): Doc {
  let changed = false;
  const components = doc.components.map((component) => {
    if (component.id !== doc.activeId) return component;
    const next = fn(component);
    if (next !== component) changed = true;
    return next;
  });
  return changed ? { ...doc, components } : doc;
}

function patchTree(doc: Doc, fn: (root: AnyNode) => AnyNode): Doc {
  return patchActive(doc, (component) => {
    const root = fn(component.root);
    return root === component.root ? component : updateRoot(component, root);
  });
}

function document(doc: Doc, action: Action): Doc {
  switch (action.type) {
    case 'doc.replace':
      return action.doc;

    case 'component.add': {
      const component = makeComponent(action.name);
      return { ...doc, components: [...doc.components, component], activeId: component.id };
    }
    case 'component.remove': {
      if (doc.components.length === 1) return doc;
      const components = doc.components.filter((c) => c.id !== action.id);
      return {
        ...doc,
        components,
        activeId: doc.activeId === action.id ? components[0].id : doc.activeId,
      };
    }
    case 'component.patch':
      return patchActive(doc, (component) => ({ ...component, ...action.patch }));

    case 'prop.add':
      return patchActive(doc, (c) => ({ ...c, props: [...c.props, action.prop] }));
    case 'prop.patch':
      return patchActive(doc, (c) => ({
        ...c,
        props: c.props.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }));
    case 'prop.remove':
      return patchActive(doc, (c) => ({ ...c, props: c.props.filter((p) => p.id !== action.id) }));
    case 'prop.move':
      return patchActive(doc, (c) => {
        const from = c.props.findIndex((p) => p.id === action.id);
        if (from < 0) return c;
        const props = [...c.props];
        const [moved] = props.splice(from, 1);
        props.splice(Math.max(0, Math.min(action.to, props.length)), 0, moved);
        return { ...c, props };
      });

    case 'state.add':
      return patchActive(doc, (c) => ({ ...c, states: [...c.states, action.state] }));
    case 'state.patch':
      return patchActive(doc, (c) => ({
        ...c,
        states: c.states.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      }));
    case 'state.remove':
      return patchActive(doc, (c) => ({ ...c, states: c.states.filter((s) => s.id !== action.id) }));

    case 'node.insert':
      return patchTree(doc, (root) => insert(root, action.node, action.target));
    case 'node.remove':
      return patchTree(doc, (root) => remove(root, action.id));
    case 'node.duplicate':
      return patchTree(doc, (root) => {
        const node = find(root, action.id);
        const parent = parentOf(root, action.id);
        if (!node || !parent) return root;
        const siblings = (parent as { children?: AnyNode[] }).children ?? [];
        const index = siblings.findIndex((child) => child.id === action.id);
        return insert(root, duplicate(node), { parent: parent.id, index: index + 1 });
      });
    case 'node.move':
      return patchTree(doc, (root) => {
        if (contains(root, action.id, action.target.parent)) return root;
        const node = find(root, action.id);
        if (!node) return root;
        const parent = parentOf(root, action.id);
        const siblings = (parent as { children?: AnyNode[] } | null)?.children ?? [];
        const from = siblings.findIndex((child) => child.id === action.id);
        const sameParent = parent?.id === action.target.parent;
        const index =
          sameParent && from > -1 && from < action.target.index
            ? action.target.index - 1
            : action.target.index;
        return insert(remove(root, action.id), node, { ...action.target, index });
      });
    case 'node.patch':
      return patchTree(doc, (root) =>
        replace(root, action.id, (node) => ({ ...node, ...action.patch }) as AnyNode),
      );
    case 'node.prop':
      return patchTree(doc, (root) =>
        replace(root, action.id, (node) => {
          if (node.kind !== 'el') return node;
          const props = { ...node.props };
          if (action.value === undefined) delete props[action.key];
          else props[action.key] = action.value;
          return { ...node, props };
        }),
      );
    default:
      return doc;
  }
}

function ui(state: UI, action: Action, doc: Doc): UI {
  switch (action.type) {
    case 'ui':
      return { ...state, ...action.patch };
    case 'component.add':
    case 'component.select':
      return { ...state, selected: null, stateId: null };
    case 'node.insert':
      return action.select === false ? state : { ...state, selected: action.node.id, left: 'layers' };
    case 'node.remove':
      return state.selected === action.id ? { ...state, selected: null } : state;
    case 'doc.replace':
      return { ...state, selected: null, stateId: null };
    case 'prop.remove': {
      const component = doc.components.find((c) => c.id === doc.activeId);
      return component && component.props.length === 0 ? { ...state, axes: [null, null] } : state;
    }
    default:
      return state;
  }
}

export function reducer(state: StudioState, action: Action): StudioState {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    if (!previous) return state;
    return {
      ...state,
      doc: previous,
      past: state.past.slice(0, -1),
      future: [state.doc, ...state.future].slice(0, HISTORY_LIMIT),
    };
  }
  if (action.type === 'redo') {
    const next = state.future[0];
    if (!next) return state;
    return {
      ...state,
      doc: next,
      past: [...state.past, state.doc].slice(-HISTORY_LIMIT),
      future: state.future.slice(1),
    };
  }

  const doc = document(state.doc, action);
  const nextDoc =
    action.type === 'component.select' && doc.components.some((c) => c.id === action.id)
      ? { ...doc, activeId: action.id }
      : doc;

  const changed = nextDoc !== state.doc;
  return {
    doc: nextDoc,
    ui: ui(state.ui, action, nextDoc),
    past: changed && isEdit(action) ? [...state.past, state.doc].slice(-HISTORY_LIMIT) : state.past,
    future: changed && isEdit(action) ? [] : state.future,
  };
}

/* ────────────────────────────  persistence  ─────────────────────────── */

const KEY = 'nili.studio.v2';

const DEFAULT_UI: UI = {
  view: 'design',
  left: 'insert',
  selected: null,
  theme: 'light',
  chrome: 'dark',
  locale: 'en',
  lang: 'fa',
  zoom: 1,
  stateId: null,
  axes: [null, null],
  leftWidth: 264,
  rightWidth: 288,
  codeFile: '',
};

function load(): StudioState {
  const fallback: StudioState = { doc: starter(), ui: DEFAULT_UI, past: [], future: [] };
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as { doc?: Doc; ui?: Partial<UI> };
    if (!saved.doc || saved.doc.version !== 2 || !saved.doc.components?.length) return fallback;
    return { doc: saved.doc, ui: { ...DEFAULT_UI, ...saved.ui }, past: [], future: [] };
  } catch {
    return fallback;
  }
}

/* ──────────────────────────────  context  ───────────────────────────── */

interface StudioValue {
  state: StudioState;
  dispatch: Dispatch<Action>;
  component: ComponentDoc;
  /** Prop values the canvas draws against: samples, then the active state. */
  values: Record<string, Json | undefined>;
}

const StudioContext = createContext<StudioValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const component = activeComponent(state);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ doc: state.doc, ui: state.ui }));
      } catch {
        /* a full quota is not worth interrupting the work for */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [state.doc, state.ui]);

  const values = useMemo(() => {
    const active = component.states.find((s) => s.id === state.ui.stateId);
    return sampleWith(component, active?.values ?? {});
  }, [component, state.ui.stateId]);

  const value = useMemo<StudioValue>(
    () => ({ state, dispatch, component, values }),
    [state, component, values],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside <StudioProvider>.');
  return value;
}

export function useUI(): UI {
  return useStudio().state.ui;
}

export function useDispatch(): Dispatch<Action> {
  return useStudio().dispatch;
}

export const newState = (name: string): NamedState => ({ id: uid('st'), name, values: {} });

/** Sample values for a component, with a named state's overrides applied. */
export function sampleWith(
  component: ComponentDoc,
  overrides: Record<string, Json>,
): Record<string, Json | undefined> {
  return sampleValues(component.props, overrides);
}
