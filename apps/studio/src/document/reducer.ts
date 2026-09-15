import { createComponentDef, createFrame, createSlot } from './factory';
import { nextId } from './ids';
import { collect, insert, locate, move, remove, reorder, replace } from './tree';
import { DEFAULT_WIDTH, GUTTER, estimatedHeight, isFrame, rootIdFor } from './types';
import type { ComponentDef, ComponentId, DocNode, FrameNode, NodeId } from './types';
import { branchValues, createParam, sampleFor, toEventName } from '../logic/types';
import type { ComponentParam, ParamType } from '../logic/types';
import type { ComponentState } from './types';
import { toComponentName } from '../logic/scope';
import { getComponent } from '../registry/catalogue';
import type { Locale } from '../i18n/types';
import type { Action, StudioState } from './state';
import { MUTATING, activeComponent, ownerOf } from './state';

const isRoot = (state: StudioState, id: NodeId): boolean =>
  state.components.some((component) => component.root.id === id);

const selectable = (state: StudioState, ids: Iterable<NodeId>): NodeId[] =>
  [...ids].filter((id) => !isRoot(state, id));

function cloneSubtree(node: DocNode): DocNode {
  const base = { ...node, id: nextId() } as DocNode;
  if (base.kind === 'frame' || base.kind === 'slot') {
    return { ...base, children: base.children.map(cloneSubtree) };
  }
  if (base.kind === 'instance') return { ...base, args: { ...base.args } };
  return { ...base, props: { ...base.props } };
}

/* ────────────────────────  component plumbing  ──────────────────────── */

const patchById = (state: StudioState, id: ComponentId, produce: (c: ComponentDef) => ComponentDef): StudioState => ({
  ...state,
  components: state.components.map((component) => (component.id === id ? produce(component) : component)),
});

/**
 * Structural edits are addressed by node, and a node belongs to exactly one
 * component — so the reducer finds the owner rather than assuming the active
 * one. Without this, selecting something on a second artboard and pressing
 * delete would quietly edit the first.
 */
function patchOwnerOf(state: StudioState, nodeId: NodeId, produce: (root: FrameNode) => FrameNode): StudioState {
  const owner = ownerOf(state, nodeId) ?? activeComponent(state);
  return patchById(state, owner.id, (current) => ({ ...current, root: produce(current.root) }));
}

const ownerOfSelection = (state: StudioState): ComponentDef => {
  const [first] = [...state.selection];
  return (first ? ownerOf(state, first) : undefined) ?? activeComponent(state);
};

/** Where a new node goes when the user did not drop it somewhere specific. */
function insertionTarget(state: StudioState): { parentId: NodeId; index: number } {
  const component = activeComponent(state);
  const [first] = [...state.selection];
  if (!first) return { parentId: component.root.id, index: Number.MAX_SAFE_INTEGER };
  const located = locate(component.root, first);
  if (!located) return { parentId: component.root.id, index: Number.MAX_SAFE_INTEGER };
  if (isFrame(located.node)) return { parentId: located.node.id, index: located.node.children.length };
  return { parentId: located.parent?.id ?? component.root.id, index: located.index + 1 };
}

/** The real height if the canvas has reported one, a guess otherwise. */
const heightOf = (state: StudioState, component: ComponentDef): number =>
  state.measured[component.id] ?? estimatedHeight(component);

/**
 * Artboards run down the board. Laying them out side by side looked tidy and
 * behaved badly: widening one to check a large breakpoint pushed it into its
 * neighbour, so testing a wide layout meant tidying up first.
 */
function nextPosition(components: ComponentDef[]): { x: number; y: number } {
  if (!components.length) return { x: 0, y: 0 };
  const last = components.reduce((low, component) => (component.y > low.y ? component : low));
  return { x: last.x, y: last.y + estimatedHeight(last) + GUTTER };
}

/** Packs the column downward, in the order the artboards already sit in. */
function tidy(state: StudioState): StudioState {
  const ordered = [...state.components].sort((a, b) => a.y - b.y);
  const x = ordered[0]?.x ?? 0;
  let y = ordered[0]?.y ?? 0;
  const moved = new Map<ComponentId, { x: number; y: number }>();
  for (const component of ordered) {
    moved.set(component.id, { x, y });
    y += heightOf(state, component) + GUTTER;
  }
  return {
    ...state,
    components: state.components.map((component) => ({ ...component, ...(moved.get(component.id) ?? {}) })),
  };
}

function uniqueName(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base;
  let index = 2;
  while (taken.includes(`${base}${index}`)) index += 1;
  return `${base}${index}`;
}

/** Renaming a parameter has to reach every expression that reads it. */
function renameInComponent(component: ComponentDef, from: string, to: string): ComponentDef {
  if (!from || from === to) return component;
  const pattern = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
  const rewrite = (source: string): string => source.replace(pattern, to);

  const visit = (node: DocNode): DocNode => {
    const next: DocNode = { ...node };
    if (next.visibleWhen) next.visibleWhen = { kind: 'expr', expr: rewrite(next.visibleWhen.expr) };
    if (next.validate) next.validate = { kind: 'expr', expr: rewrite(next.validate.expr) };
    if (next.repeat) next.repeat = { ...next.repeat, each: { kind: 'expr', expr: rewrite(next.repeat.each.expr) } };
    if (next.events) {
      next.events = Object.fromEntries(
        Object.entries(next.events).map(([event, param]) => [event, rewrite(param)]),
      );
    }
    const rewriteBag = (bag: Record<string, unknown>): Record<string, unknown> =>
      Object.fromEntries(
        Object.entries(bag).map(([key, value]) =>
          value !== null && typeof value === 'object' && 'kind' in value && (value as { kind: string }).kind === 'expr'
            ? [key, { kind: 'expr' as const, expr: rewrite((value as unknown as { expr: string }).expr) }]
            : [key, value],
        ),
      );
    if (next.kind === 'component') return { ...next, props: rewriteBag(next.props) as typeof next.props };
    if (next.kind === 'instance') return { ...next, args: rewriteBag(next.args) as typeof next.args };
    if (next.kind === 'slot') return { ...next, name: rewrite(next.name), children: next.children.map(visit) };
    return { ...next, children: next.children.map(visit) };
  };

  return { ...component, root: visit(component.root) as FrameNode };
}

/* ─────────────────────────────  reducer  ───────────────────────────── */

function apply(state: StudioState, action: Action): StudioState {
  switch (action.type) {
    case 'select': {
      const owner = action.ids[0] ? ownerOf(state, action.ids[0]) : undefined;
      const activeId = owner ? owner.id : state.activeId;
      if (!action.additive) return { ...state, activeId, selection: new Set(action.ids) };
      const next = new Set(state.selection);
      for (const id of action.ids) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return { ...state, activeId, selection: next.size ? next : new Set(action.ids) };
    }
    case 'selectAll':
      return { ...state, selection: new Set(selectable(state, collect(activeComponent(state).root).map((n) => n.id))) };
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
      const next = patchOwnerOf(state, action.parentId, (root) =>
        insert(root, action.parentId, action.index, action.nodes),
      );
      const inserted = action.nodes
        .map((node) => (node.kind === 'component' ? node.component : '__frame'))
        .reverse();
      return {
        ...next,
        recent: [...new Set([...inserted, ...state.recent])].slice(0, 6),
        selection: new Set(action.nodes.map((n) => n.id)),
        expanded: new Set([...state.expanded, action.parentId]),
      };
    }
    case 'move':
      return patchOwnerOf(state, action.id, (root) => move(root, action.id, action.parentId, action.index));

    case 'insertBeside':
    case 'moveBeside': {
      const owner = ownerOf(state, action.targetId) ?? activeComponent(state);
      const root = owner.root;
      const target = locate(root, action.targetId);
      if (!target?.parent) return state;

      const incoming = action.type === 'insertBeside'
        ? action.nodes
        : [locate(root, action.id)?.node].filter((n): n is DocNode => Boolean(n));
      if (!incoming.length) return state;
      if (action.type === 'moveBeside' && action.id === action.targetId) return state;

      const offset = action.side === 'end' ? 1 : 0;
      const stripped = action.type === 'moveBeside' ? remove(root, new Set([action.id])) : root;
      const at = locate(stripped, action.targetId);
      if (!at?.parent) return state;

      if (target.parent.layout.direction === 'horizontal') {
        return {
          ...patchById(state, owner.id, (current) => ({
            ...current,
            root: insert(stripped, at.parent!.id, at.index + offset, incoming),
          })),
          selection: new Set(incoming.map((n) => n.id)),
        };
      }

      /* The parent runs vertically, so putting something beside the target
         means the target becomes a row of two. This is the whole reason a
         side-drop exists. */
      const ordered = offset ? [at.node, ...incoming] : [...incoming, at.node];
      const row = createFrame({ direction: 'horizontal', gap: 8, align: 'center' }, ordered);
      const withoutTarget = remove(stripped, new Set([action.targetId]));
      if (!locate(withoutTarget, at.parent.id)) return state;

      return {
        ...patchById(state, owner.id, (current) => ({
          ...current,
          root: insert(withoutTarget, at.parent!.id, at.index, [row]),
        })),
        selection: new Set(incoming.map((n) => n.id)),
        expanded: new Set([...state.expanded, row.id]),
      };
    }

    case 'setSize':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => ({ ...node, size: { ...node.size, [action.axis]: action.value } })),
      );
    case 'reorder':
      return patchOwnerOf(state, action.id, (root) => reorder(root, action.id, action.delta));
    case 'delete': {
      const ids = selectable(state, state.selection);
      if (!ids.length) return state;
      const owner = ownerOfSelection(state);
      return {
        ...patchById(state, owner.id, (current) => ({ ...current, root: remove(current.root, new Set(ids)) })),
        selection: new Set(),
      };
    }
    case 'duplicate': {
      const ids = selectable(state, state.selection);
      if (!ids.length) return state;
      const owner = ownerOfSelection(state);
      let root = owner.root;
      const created: NodeId[] = [];
      for (const id of ids) {
        const located = locate(root, id);
        if (!located?.parent) continue;
        const copy = cloneSubtree(located.node);
        created.push(copy.id);
        root = insert(root, located.parent.id, located.index + 1, [copy]);
      }
      return { ...patchById(state, owner.id, (c) => ({ ...c, root })), selection: new Set(created) };
    }
    case 'copy': {
      const owner = ownerOfSelection(state);
      const nodes = selectable(state, state.selection)
        .map((id) => locate(owner.root, id)?.node)
        .filter((n): n is DocNode => Boolean(n));
      return nodes.length ? { ...state, clipboard: nodes.map(cloneSubtree) } : state;
    }
    case 'paste': {
      if (!state.clipboard.length) return state;
      const { parentId, index } = insertionTarget(state);
      const copies = state.clipboard.map(cloneSubtree);
      return {
        ...patchOwnerOf(state, parentId, (root) => insert(root, parentId, index, copies)),
        selection: new Set(copies.map((n) => n.id)),
        expanded: new Set([...state.expanded, parentId]),
      };
    }
    case 'wrapInFrame': {
      const ids = selectable(state, state.selection);
      if (!ids.length) return state;
      const owner = ownerOfSelection(state);
      const first = locate(owner.root, ids[0] as string);
      if (!first?.parent) return state;
      const picked = ids.map((id) => locate(owner.root, id)?.node).filter((n): n is DocNode => Boolean(n));
      const frame = createFrame({ gap: 8, direction: action.direction ?? 'vertical' }, picked);
      const stripped = remove(owner.root, new Set(ids));
      return {
        ...patchById(state, owner.id, (current) => ({
          ...current,
          root: insert(stripped, first.parent!.id, first.index, [frame]),
        })),
        selection: new Set([frame.id]),
        expanded: new Set([...state.expanded, frame.id]),
      };
    }

    case 'setProp':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) =>
          node.kind === 'component' ? { ...node, props: { ...node.props, [action.key]: action.value } } : node,
        ),
      );
    case 'setArg':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) =>
          node.kind === 'instance' ? { ...node, args: { ...node.args, [action.key]: action.value } } : node,
        ),
      );
    case 'renameNode':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => {
          const label = action.label.trim();
          const next = { ...node };
          if (label) next.label = label;
          else delete next.label;
          return next;
        }),
      );
    case 'setClassName':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => ({ ...node, className: action.value })),
      );
    case 'setLayout':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) =>
          isFrame(node) ? { ...node, layout: { ...node.layout, ...action.patch } } : node,
        ),
      );
    case 'setResponsive':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => {
          const responsive = { ...(node.responsive ?? {}) };
          if (action.patch) responsive[action.breakpoint] = action.patch;
          else delete responsive[action.breakpoint];
          const next = { ...node };
          if (Object.keys(responsive).length) next.responsive = responsive;
          else delete next.responsive;
          return next;
        }),
      );

    /* ───────────────────────────  components  ─────────────────────────── */

    case 'addComponent': {
      const position = nextPosition(state.components);
      const name = action.name ?? `Component ${state.components.length + 1}`;
      const component = createComponentDef(name, { ...position, width: DEFAULT_WIDTH });
      return {
        ...state,
        components: [...state.components, component],
        activeId: component.id,
        selection: new Set([component.root.id]),
        expanded: new Set([...state.expanded, component.root.id]),
      };
    }

    /**
     * Select what you already drew, and it becomes a component with an
     * instance left in its place. Building the component first and then
     * rebuilding the design inside it is the reason people do not bother.
     */
    case 'extractComponent': {
      const ids = selectable(state, state.selection);
      if (!ids.length) return state;
      const source = ownerOfSelection(state);
      const first = locate(source.root, ids[0] as string);
      if (!first?.parent) return state;

      const picked = ids.map((id) => locate(source.root, id)?.node).filter((n): n is DocNode => Boolean(n));
      if (!picked.length) return state;

      const name = action.name ?? picked[0]?.label ?? 'Component';
      const base = createComponentDef(name, { ...nextPosition(state.components), width: 320 });
      const component: ComponentDef = {
        ...base,
        root: { ...base.root, layout: { ...base.root.layout, padding: 16 }, children: picked.map(cloneSubtree) },
      };

      const instance: DocNode = {
        id: nextId(),
        kind: 'instance',
        className: '',
        size: { width: 'fill', height: 'hug' },
        componentId: component.id,
        args: {},
      };

      const root = insert(remove(source.root, new Set(ids)), first.parent.id, first.index, [instance]);
      return {
        ...state,
        components: [
          ...state.components.map((c) => (c.id === source.id ? { ...c, root } : c)),
          component,
        ],
        selection: new Set([instance.id]),
      };
    }

    case 'duplicateComponent': {
      const source = state.components.find((component) => component.id === action.id);
      if (!source) return state;
      const id = nextId();
      const copy: ComponentDef = {
        ...source,
        id,
        name: `${source.name} copy`,
        component: `${source.component}Copy`,
        root: { ...(cloneSubtree(source.root) as FrameNode), id: rootIdFor(id) },
        params: source.params.map((param) => ({ ...param, id: nextId() })),
        ...nextPosition(state.components),
      };
      return { ...state, components: [...state.components, copy], activeId: id, selection: new Set() };
    }
    case 'removeComponent': {
      if (state.components.length <= 1) return state;
      /* An instance of a component that is going away would render as nothing
         at all, so the instances go with it. */
      const strip = (root: FrameNode): FrameNode => {
        const visit = (node: DocNode): DocNode | null => {
          if (node.kind === 'instance' && node.componentId === action.id) return null;
          if (node.kind !== 'frame') return node;
          return { ...node, children: node.children.map(visit).filter((n): n is DocNode => n !== null) };
        };
        return visit(root) as FrameNode;
      };
      const components = state.components
        .filter((component) => component.id !== action.id)
        .map((component) => ({ ...component, root: strip(component.root) }));
      const activeId = state.activeId === action.id ? (components[0] as ComponentDef).id : state.activeId;
      return { ...state, components, activeId, selection: new Set() };
    }
    case 'patchComponent': {
      const next = patchById(state, action.id, (component) => {
        const renamed = action.patch.name !== undefined && action.patch.name !== component.name;
        return {
          ...component,
          ...action.patch,
          component:
            action.patch.component ??
            (renamed && component.component === toComponentName(component.name)
              ? toComponentName(action.patch.name as string)
              : component.component),
        };
      });
      // Widening makes a component taller, and a taller one runs into whatever
      // is beneath it.
      return action.patch.width !== undefined ? tidy(next) : next;
    }
    case 'moveComponent':
      return patchById(state, action.id, (component) => ({ ...component, x: action.x, y: action.y }));
    case 'setActiveComponent': {
      const component = state.components.find((item) => item.id === action.id);
      if (!component) return state;
      return {
        ...state,
        activeId: action.id,
        selection: new Set([component.root.id]),
        controls: {},
        activeState: null,
        /* The drawer follows the work. Leaving `codeId` behind meant opening
           Code after switching component showed the previous one's file, which
           reads as the generator being stale rather than as a stale tab. The
           drawer's own component tabs are still there to look elsewhere. */
        codeId: action.id,
      };
    }
    case 'measureComponent': {
      if (Math.abs((state.measured[action.id] ?? 0) - action.height) < 2) return state;
      return { ...state, measured: { ...state.measured, [action.id]: action.height } };
    }
    case 'tidy':
      return tidy(state);

    /* ───────────────────────────  parameters  ─────────────────────────── */

    case 'addParam': {
      const component = state.components.find((c) => c.id === action.componentId);
      if (!component) return state;
      const param = action.param ?? createParam(uniqueName('value', component.params.map((p) => p.name)));
      return patchById(state, action.componentId, (c) => ({ ...c, params: [...c.params, param] }));
    }
    case 'patchParam': {
      const component = state.components.find((c) => c.id === action.componentId);
      const target = component?.params.find((param) => param.id === action.id);
      if (!component || !target) return state;
      const renamed = action.patch.name !== undefined && action.patch.name !== target.name;
      const retyped = action.patch.type !== undefined && action.patch.type !== target.type;
      const updated = patchById(state, action.componentId, (c) => ({
        ...c,
        params: c.params.map((param) =>
          param.id === action.id
            ? { ...param, ...action.patch, ...(retyped ? { sample: sampleFor(action.patch.type as ParamType) } : {}) }
            : param,
        ),
      }));
      if (!renamed) return updated;
      return patchById(updated, action.componentId, (c) =>
        renameInComponent(c, target.name, action.patch.name as string),
      );
    }
    case 'removeParam':
      return patchById(state, action.componentId, (component) => ({
        ...component,
        params: component.params.filter((param) => param.id !== action.id),
      }));

    /**
     * The gesture that replaced the data layer.
     *
     * A prop nobody has decided — is this button loading? is this field in
     * error? — stops being a value and becomes part of the component's API.
     * One click, because the alternative is declaring a parameter in one place
     * and remembering to wire it in another.
     */
    case 'exposeProp': {
      const owner = ownerOf(state, action.id) ?? activeComponent(state);
      const name = uniqueName(action.name ?? action.key, owner.params.map((param) => param.name));

      /* What the prop allows is a fact about the registry, so the action reads
         it rather than trusting whoever dispatched. A caller that forgets to
         pass the options would otherwise widen a four-word variant to `string`
         — handing the caller four wrong answers and no way to find out. */
      const target = locate(owner.root, action.id)?.node;
      const declared = target?.kind === 'component' ? getComponent(target.component).meta.props[action.key] : undefined;
      const options = action.options ?? (declared?.control === 'select' ? declared.options : undefined);
      const required = action.required ?? Boolean(declared?.required);
      /* A required prop produces a required property. Anything else would
         generate `name?: string` handed to something that asks for `string`,
         which is the design system's way of saying the component cannot do its
         job without it — and the studio has no business overruling that. */
      const param: ComponentParam = {
        ...createParam(name, action.paramType ?? 'text'),
        required: required || undefined,
        options: options?.length ? [...options] : undefined,
        /* The sample starts at whatever the prop was showing, so the canvas
           does not lurch the moment a value becomes a property. */
        sample: action.fallback ?? currentText(target, action.key) ?? options?.[0] ?? sampleFor(action.paramType ?? 'text'),
      };
      const bound = { kind: 'expr' as const, expr: name };

      return patchById(state, owner.id, (component) => ({
        ...component,
        params: [...component.params, param],
        root: replace(component.root, action.id, (node) => {
          if (node.kind === 'component') return { ...node, props: { ...node.props, [action.key]: bound } };
          if (node.kind === 'instance') return { ...node, args: { ...node.args, [action.key]: bound } };
          return node;
        }),
      }));
    }

    /* ─────────────────────────  named states  ───────────────────────── */

    case 'addState': {
      const component = state.components.find((c) => c.id === action.componentId);
      if (!component) return state;
      const states = component.states ?? [];
      const name = uniqueName(action.name ?? 'State', states.map((item) => item.name));
      /* Named and filled in one action, because they are one decision. A
         state created empty and populated afterwards is four history entries
         for a thing the person described in a single dialog. */
      const created: ComponentState = { id: nextId(), name, values: action.values ?? {} };
      return {
        ...patchById(state, action.componentId, (c) => ({ ...c, states: [...states, created] })),
        activeState: created.id,
        allStates: false,
      };
    }
    /**
     * One named state per value a property can take.
     *
     * "Design every state" is a chore made of the same two clicks repeated:
     * add a state, set the one value that makes it that state. The studio
     * already knows the values — they are in the property — so it can do the
     * repetition and leave the design. Whatever the canvas is already showing
     * is skipped, because that board exists and is called Default.
     */
    case 'generateStates': {
      const component = state.components.find((c) => c.id === action.componentId);
      const param = component?.params.find((item) => item.name === action.param);
      const values = param ? branchValues(param) : null;
      if (!component || !param || !values) return state;

      const existing = component.states ?? [];
      const taken = existing.map((item) => item.name);
      const created: ComponentState[] = [];

      for (const value of values) {
        if (value === param.sample) continue;
        const label = typeof value === 'boolean' ? `${param.name} ${value ? 'on' : 'off'}` : String(value);
        /* A state that already pins this property to this value is the state
           being asked for, so generating twice is a no-op rather than a pile
           of duplicates. */
        if (existing.some((item) => item.values[param.name] === value)) continue;
        const name = uniqueName(label, [...taken, ...created.map((item) => item.name)]);
        created.push({ id: nextId(), name, values: { [param.name]: value } });
      }

      if (!created.length) return state;
      return {
        ...patchById(state, action.componentId, (c) => ({ ...c, states: [...existing, ...created] })),
        allStates: true,
        activeState: null,
      };
    }

    case 'patchState':
      return patchById(state, action.componentId, (component) => ({
        ...component,
        states: (component.states ?? []).map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      }));
    case 'setStateValue':
      return patchById(state, action.componentId, (component) => ({
        ...component,
        states: (component.states ?? []).map((item) => {
          if (item.id !== action.id) return item;
          const values = { ...item.values };
          // Removing an override means "whatever the sample says", which is a
          // different thing from overriding it with the sample's value.
          if (action.value === undefined) delete values[action.param];
          else values[action.param] = action.value;
          return { ...item, values };
        }),
      }));
    case 'removeState': {
      const next = patchById(state, action.componentId, (component) => ({
        ...component,
        states: (component.states ?? []).filter((item) => item.id !== action.id),
      }));
      return state.activeState === action.id ? { ...next, activeState: null } : next;
    }

    /* ───────────────────────────  rendering  ─────────────────────────── */

    case 'setVisibleWhen':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => withOptional(node, 'visibleWhen', action.value)),
      );
    case 'setRepeat':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => withOptional(node, 'repeat', action.value)),
      );
    case 'setValidate':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => withOptional(node, 'validate', action.value)),
      );
    case 'setStateEffect':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => {
          const states = { ...(node.states ?? {}) };
          if (action.effect) states[action.state] = action.effect;
          else delete states[action.state];
          return withOptional(node, 'states', Object.keys(states).length ? states : undefined);
        }),
      );

    case 'addSlot': {
      const owner = ownerOf(state, action.parentId) ?? activeComponent(state);
      const name = uniqueName(action.name ?? 'content', owner.params.map((param) => param.name));
      const slot = createSlot(name);
      return {
        ...patchById(state, owner.id, (component) => ({
          ...component,
          params: [...component.params, createParam(name, 'slot')],
          root: insert(component.root, action.parentId, action.index, [slot]),
        })),
        selection: new Set([slot.id]),
      };
    }
    case 'renameSlot':
      return patchOwnerOf(state, action.id, (root) =>
        replace(root, action.id, (node) => (node.kind === 'slot' ? { ...node, name: action.name } : node)),
      );

    /** An event points at an action parameter, creating one if it is new. */
    case 'setEvent': {
      const owner = ownerOf(state, action.id) ?? activeComponent(state);
      const wanted = action.param ? toEventName(action.param) : undefined;
      const missing = wanted && !owner.params.some((param) => param.name === wanted);

      return patchById(state, owner.id, (component) => ({
        ...component,
        params: missing ? [...component.params, createParam(wanted as string, 'action')] : component.params,
        root: replace(component.root, action.id, (node) => {
          const events = { ...(node.events ?? {}) };
          if (wanted) events[action.event] = wanted;
          else delete events[action.event];
          return withOptional(node, 'events', Object.keys(events).length ? events : undefined);
        }),
      }));
    }

    /* ─────────────────────────────  chrome  ───────────────────────────── */

    case 'setControl':
      return { ...state, controls: { ...state.controls, [action.name]: action.value } };
    case 'resetControls':
      return { ...state, controls: {} };

    case 'addAsset':
      return { ...state, assets: [...state.assets, action.asset] };
    case 'renameAsset':
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.id === action.id ? { ...asset, name: safeFileName(action.name) } : asset,
        ),
      };
    case 'removeAsset':
      return { ...state, assets: state.assets.filter((asset) => asset.id !== action.id) };

    case 'setTheme':
      return { ...state, theme: { ...state.theme, ...action.patch } };
    case 'addLocale': {
      const others = state.locales.filter((l) => l.code !== action.locale.code);
      return { ...state, locales: [...others, action.locale], activeLocale: action.locale.code };
    }
    case 'removeLocale': {
      const locales = state.locales.filter((l) => l.code !== action.code);
      if (!locales.length) return state;
      const active = state.activeLocale === action.code ? (locales[0] as Locale).code : state.activeLocale;
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

    case 'loadDocument':
      // Chrome preferences belong to the person, not the file.
      return {
        ...action.state,
        uiScheme: state.uiScheme,
        canvasScheme: state.canvasScheme,
        leftWidth: state.leftWidth,
        rightWidth: state.rightWidth,
        panel: state.panel,
      };
    case 'saved':
      return { ...state, savedAt: action.at };
    /**
     * One switch, two places it shows.
     *
     * Running the component and turning its controls are the same act, and
     * they used to be two: a Design/Preview toggle in the toolbar, and a
     * panel that quietly became something else underneath it. Keeping the
     * pair in step here means neither control can lie about what the other
     * is doing, and it removed a segmented control from the toolbar.
     */
    case 'ui': {
      const patch = { ...action.patch };
      if (patch.rightTab !== undefined && patch.mode === undefined) {
        patch.mode = patch.rightTab === 'play' ? 'preview' : 'design';
      } else if (patch.mode !== undefined && patch.rightTab === undefined) {
        if (patch.mode === 'preview') patch.rightTab = 'play';
        else if (state.rightTab === 'play') patch.rightTab = 'design';
      }
      return { ...state, ...patch };
    }
    default:
      return state;
  }
}

/** Whatever the prop is showing right now, if it is a plain value. */
function currentText(node: DocNode | undefined, key: string): string | undefined {
  if (!node || node.kind !== 'component') return undefined;
  const value = node.props[key];
  if (typeof value === 'string') return value || undefined;
  if (value !== null && typeof value === 'object' && 'kind' in value && value.kind === 'literal') {
    return (value as { value: string }).value || undefined;
  }
  return undefined;
}

/** Assets become file names on export, so the name has to survive a file system. */
export function safeFileName(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-*\.-*/g, '.')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|-+$/g, '');
  return cleaned || 'image.png';
}

/** `undefined` deletes the key rather than storing it, so documents stay small. */
function withOptional<T extends DocNode, K extends 'visibleWhen' | 'repeat' | 'events' | 'validate' | 'states'>(
  node: T,
  key: K,
  value: T[K] | undefined,
): T {
  const next = { ...node };
  if (value === undefined) delete next[key];
  else next[key] = value;
  return next;
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
export type { ComponentParam };
