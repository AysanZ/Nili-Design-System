import {
  DEFAULT_LAYOUT,
  DEFAULT_STYLE,
  constant,
  container,
  isBox,
  type AnyNode,
  type BoxNode,
  type ComponentDoc,
  type ElNode,
  type NodeId,
  type PropDef,
  type SlotNode,
  type TextNode,
  type Value,
} from './model';
import { lib } from './catalogue';

let counter = 0;
export const uid = (prefix = 'n'): string =>
  `${prefix}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ──────────────────────────────  make  ────────────────────────────── */

export function makeBox(patch: Partial<BoxNode> = {}): BoxNode {
  return {
    id: uid('b'),
    kind: 'box',
    layout: { ...DEFAULT_LAYOUT },
    style: { ...DEFAULT_STYLE },
    children: [],
    ...patch,
  };
}

export function makeText(text = 'Text', variant = 'paragraph-medium'): TextNode {
  return { id: uid('t'), kind: 'text', value: constant(text), variant };
}

export function makeSlot(prop: string): SlotNode {
  return { id: uid('s'), kind: 'slot', prop, children: [] };
}

/** A new instance, seeded with the content a component needs to be visible. */
export function makeEl(component: string): ElNode {
  const meta = lib(component);
  const props: Record<string, Value | undefined> = {};

  if (meta) {
    for (const prop of meta.props) {
      // Required props would otherwise render an empty shell or throw.
      if (!prop.meta.required) continue;
      if (prop.editor === 'text') props[prop.key] = constant(titleCase(prop.key));
      if (prop.editor === 'number') props[prop.key] = constant(1);
      if (prop.editor === 'select' && prop.meta.options?.[0]) {
        props[prop.key] = constant(prop.meta.options[0]);
      }
    }
    const seeds = SEED[component];
    if (seeds) for (const [key, value] of Object.entries(seeds)) props[key] = constant(value);
  }

  const node: ElNode = { id: uid('e'), kind: 'el', component, props };
  if (meta?.takesChildren) {
    node.children = CHILD_TEXT.has(component) ? [] : [makeText(defaultLabel(component))];
    if (CHILD_TEXT.has(component)) node.children = [makeText(defaultLabel(component))];
  }
  return node;
}

const SEED: Record<string, Record<string, string | number | boolean>> = {
  Avatar: { name: 'Nili' },
  FlatAvatar: { name: 'Nili' },
  Pagination: { count: 6 },
  ProgressBar: { value: 60 },
  ProgressCircle: { value: 60 },
  Rating: { value: 3 },
  Slider: { value: 40 },
  FileUploadCard: { fileName: 'report.pdf' },
  PasswordStrength: { level: 'good' },
  Alert: { title: 'Heads up' },
  Banner: { title: 'Heads up' },
  EmptyState: { title: 'Nothing here yet' },
  Accordion: { title: 'Section' },
  ContentCard: { title: 'Title' },
  ContentLabel: { title: 'Title' },
  ActivityFeedItem: { title: 'Activity' },
  TextInput: { label: 'Label', placeholder: 'Type here' },
  TextArea: { label: 'Label', placeholder: 'Type here' },
  Checkbox: { label: 'Option' },
  Radio: { label: 'Option' },
  Switch: { label: 'Option' },
};

const CHILD_TEXT = new Set(['Button', 'LinkButton', 'Badge', 'Tag', 'Typography', 'FilterChip']);

const defaultLabel = (component: string): string =>
  component === 'Typography' ? 'Text' : titleCase(component);

const titleCase = (value: string): string =>
  value.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();

/* ───────────────────────────  traversal  ──────────────────────────── */

export function walk(node: AnyNode, visit: (node: AnyNode, parent: AnyNode | null) => void): void {
  const step = (current: AnyNode, parent: AnyNode | null): void => {
    visit(current, parent);
    for (const child of container(current) ?? []) step(child, current);
  };
  step(node, null);
}

export function find(root: AnyNode, id: NodeId): AnyNode | null {
  let found: AnyNode | null = null;
  walk(root, (node) => {
    if (node.id === id) found = node;
  });
  return found;
}

export function parentOf(root: AnyNode, id: NodeId): AnyNode | null {
  let found: AnyNode | null = null;
  walk(root, (node, parent) => {
    if (node.id === id) found = parent;
  });
  return found;
}

export function pathTo(root: AnyNode, id: NodeId): AnyNode[] {
  const path: AnyNode[] = [];
  const step = (node: AnyNode, trail: AnyNode[]): boolean => {
    const next = [...trail, node];
    if (node.id === id) {
      path.push(...next);
      return true;
    }
    return (container(node) ?? []).some((child) => step(child, next));
  };
  step(root, []);
  return path;
}

/** Every node that can hold children, deepest last. */
export function containers(root: AnyNode): AnyNode[] {
  const out: AnyNode[] = [];
  walk(root, (node) => {
    if (container(node)) out.push(node);
  });
  return out;
}

/* ─────────────────────────────  edits  ────────────────────────────── */

/** Structure-sharing map: only the branch containing `id` is rebuilt. */
export function replace(root: AnyNode, id: NodeId, fn: (node: AnyNode) => AnyNode): AnyNode {
  if (root.id === id) return fn(root);
  const children = container(root);
  if (!children) return root;
  let changed = false;
  const next = children.map((child) => {
    const mapped = replace(child, id, fn);
    if (mapped !== child) changed = true;
    return mapped;
  });
  return changed ? withChildren(root, next) : root;
}

export function withChildren(node: AnyNode, children: AnyNode[]): AnyNode {
  if (node.kind === 'box' || node.kind === 'slot') return { ...node, children };
  if (node.kind === 'el') return { ...node, children };
  return node;
}

export function remove(root: AnyNode, id: NodeId): AnyNode {
  const children = container(root);
  if (!children) return root;
  const kept = children.filter((child) => child.id !== id).map((child) => remove(child, id));
  return withChildren(root, kept);
}

export interface DropTarget {
  parent: NodeId;
  index: number;
}

export function insert(root: AnyNode, node: AnyNode, target: DropTarget): AnyNode {
  return replace(root, target.parent, (parent) => {
    const children = container(parent) ?? [];
    const index = Math.max(0, Math.min(target.index, children.length));
    return withChildren(parent, [...children.slice(0, index), node, ...children.slice(index)]);
  });
}

/** True when `id` is `ancestor` or sits inside it — a move onto itself. */
export function contains(root: AnyNode, ancestor: NodeId, id: NodeId): boolean {
  const node = find(root, ancestor);
  if (!node) return false;
  let hit = false;
  walk(node, (current) => {
    if (current.id === id) hit = true;
  });
  return hit;
}

export function duplicate(node: AnyNode): AnyNode {
  const clone = structuredClone(node) as AnyNode;
  walk(clone, (current) => {
    current.id = uid(current.kind[0]);
  });
  return clone;
}

export function label(node: AnyNode): string {
  if (node.name) return node.name;
  switch (node.kind) {
    case 'box':
      return node.layout.dir === 'row' ? 'Row' : 'Stack';
    case 'el':
      return node.component;
    case 'slot':
      return node.prop;
    case 'text':
      return node.value.v === 'const' ? String(node.value.value).slice(0, 24) || 'Text' : 'Text';
  }
}

/* ────────────────────────────  documents  ──────────────────────────── */

export function makeComponent(name: string): ComponentDoc {
  return {
    id: uid('c'),
    name,
    props: [],
    states: [],
    width: 420,
    root: makeBox({
      name: 'Root',
      layout: { ...DEFAULT_LAYOUT, gap: 12, padding: [16, 16, 16, 16] },
      style: { ...DEFAULT_STYLE, background: 'white', radius: 'xl', border: 'soft', width: 'fill' },
    }),
  };
}

/** Which prop names are already used, so a new one can be named safely. */
export function uniqueName(props: PropDef[], base: string): string {
  const taken = new Set(props.map((prop) => prop.name));
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}${index}`)) index += 1;
  return `${base}${index}`;
}

export const isRoot = (component: ComponentDoc, id: NodeId): boolean => component.root.id === id;

export const rootOf = (component: ComponentDoc): BoxNode => component.root;

export function updateRoot(component: ComponentDoc, next: AnyNode): ComponentDoc {
  return { ...component, root: isBox(next) ? next : component.root };
}
