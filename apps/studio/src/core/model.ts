/**
 * The whole model of a Nili Studio document.
 *
 * A document holds components. A component is three things and nothing more:
 *   1. an API      — the props it takes, including which ones depend on which
 *   2. a tree      — library components and layout boxes, with props bound to the API
 *   3. states      — named sets of prop values worth drawing
 *
 * Everything the editor shows and everything the exporter writes is derived
 * from those three. The model is plain JSON so a document is one file.
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/* ─────────────────────────────  the API  ───────────────────────────── */

export type PropKind = 'text' | 'number' | 'boolean' | 'enum' | 'node' | 'action' | 'list';

export const PROP_KINDS: PropKind[] = ['text', 'number', 'boolean', 'enum', 'node', 'action', 'list'];

/**
 * A condition over other props.
 *
 * This is the piece that makes props able to depend on each other: an
 * `errorLabel` that only exists when `error` is true is a prop whose `when` is
 * `{ op: 'truthy', prop: 'error' }`. One shape covers three jobs — the
 * inspector hides the control, the canvas skips the node, and the exported
 * type becomes a union where the pair is impossible to get wrong.
 */
export type Cond =
  | { op: 'is'; prop: string; value: Json }
  | { op: 'isNot'; prop: string; value: Json }
  | { op: 'truthy'; prop: string }
  | { op: 'falsy'; prop: string }
  | { op: 'in'; prop: string; values: Json[] }
  | { op: 'all'; conds: Cond[] }
  | { op: 'any'; conds: Cond[] };

export interface PropDef {
  id: string;
  /** The prop name as it appears in the generated interface. */
  name: string;
  kind: PropKind;
  /** For `enum`: the accepted values. */
  options?: string[];
  /** Required props have no `?`. A prop with `when` is required only while its condition holds. */
  required: boolean;
  /** Emitted as a default parameter, and used as the preview value when no sample is set. */
  default?: Json;
  /** Stand-in value on the canvas. A prop has no value until someone uses the component. */
  sample?: Json;
  /** Becomes the TSDoc comment above the prop. */
  description?: string;
  /** The prop only exists when this holds. */
  when?: Cond;
}

/* ─────────────────────────────  values  ───────────────────────────── */

/**
 * What sits in a slot on the tree: a fixed value, a prop, or an expression
 * over props. Bindings are what turn a drawing into a component.
 */
export type Value =
  | { v: 'const'; value: Json }
  | { v: 'prop'; name: string }
  | { v: 'expr'; src: string };

export const constant = (value: Json): Value => ({ v: 'const', value });
export const boundTo = (name: string): Value => ({ v: 'prop', name });
export const isBound = (value: Value | undefined): boolean =>
  value?.v === 'prop' || value?.v === 'expr';

/* ──────────────────────────────  tree  ────────────────────────────── */

export type NodeId = string;

export type Axis = 'hug' | 'fill' | number;

export interface Layout {
  dir: 'row' | 'col';
  gap: number;
  padding: [number, number, number, number]; // top right bottom left
  align: 'start' | 'center' | 'end' | 'stretch';
  justify: 'start' | 'center' | 'end' | 'between';
  wrap: boolean;
}

export type SurfaceToken =
  | 'none'
  | 'white'
  | 'weak'
  | 'soft'
  | 'strong'
  | 'primary'
  | 'primary-lighter'
  | 'error-lighter'
  | 'success-lighter'
  | 'warning-lighter';

export type RadiusToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface BoxStyle {
  background: SurfaceToken;
  radius: RadiusToken;
  border: 'none' | 'soft' | 'strong';
  shadow: 'none' | 'sm' | 'md' | 'lg';
  width: Axis;
  height: Axis;
}

interface NodeBase {
  id: NodeId;
  /** What the layers list calls it. Defaults to the component name. */
  name?: string;
  /** Rendered only while this holds. */
  when?: Cond;
  /** Free Tailwind, merged by the component's own `cn()`. */
  className?: string;
}

export interface BoxNode extends NodeBase {
  kind: 'box';
  layout: Layout;
  style: BoxStyle;
  children: AnyNode[];
}

export interface ElNode extends NodeBase {
  kind: 'el';
  /** Export name in `@nili/ui`, e.g. `Button`. */
  component: string;
  props: Record<string, Value | undefined>;
  /** Only for components that take `children`. */
  children?: AnyNode[];
  width?: Axis;
}

export interface TextNode extends NodeBase {
  kind: 'text';
  value: Value;
  /** A Typography variant name, or `plain` for an unstyled span. */
  variant: string;
}

/**
 * A hole in the component, with what to draw when nobody fills it.
 *
 * It names a prop of kind `node`; its children are the fallback, which
 * survives into the output as `{prop ?? (…)}` rather than being a canvas-only
 * placeholder.
 */
export interface SlotNode extends NodeBase {
  kind: 'slot';
  prop: string;
  children: AnyNode[];
}

export type AnyNode = BoxNode | ElNode | TextNode | SlotNode;

export const isBox = (n: AnyNode): n is BoxNode => n.kind === 'box';
export const isEl = (n: AnyNode): n is ElNode => n.kind === 'el';
export const isText = (n: AnyNode): n is TextNode => n.kind === 'text';
export const isSlot = (n: AnyNode): n is SlotNode => n.kind === 'slot';
export const container = (n: AnyNode): AnyNode[] | undefined =>
  n.kind === 'box' || n.kind === 'slot' ? n.children : n.kind === 'el' ? n.children : undefined;

/* ───────────────────────────  components  ──────────────────────────── */

/** A named set of prop values worth drawing — "loading", "with error", "empty". */
export interface NamedState {
  id: string;
  name: string;
  values: Record<string, Json>;
}

export interface ComponentDoc {
  id: string;
  /** The exported component name. Also the file name. */
  name: string;
  description?: string;
  props: PropDef[];
  states: NamedState[];
  root: BoxNode;
  /** The width the component is designed at. */
  width: number;
}

export interface Doc {
  version: 2;
  components: ComponentDoc[];
  activeId: string;
}

/* ───────────────────────────  conditions  ──────────────────────────── */

const truthy = (value: Json | undefined): boolean =>
  value !== undefined && value !== null && value !== false && value !== '' && value !== 0;

/** Evaluates a condition against a set of prop values. */
export function test(cond: Cond | undefined, values: Record<string, Json | undefined>): boolean {
  if (!cond) return true;
  switch (cond.op) {
    case 'is':
      return values[cond.prop] === cond.value;
    case 'isNot':
      return values[cond.prop] !== cond.value;
    case 'truthy':
      return truthy(values[cond.prop]);
    case 'falsy':
      return !truthy(values[cond.prop]);
    case 'in':
      return cond.values.includes(values[cond.prop] as Json);
    case 'all':
      return cond.conds.every((c) => test(c, values));
    case 'any':
      return cond.conds.some((c) => test(c, values));
  }
}

/** Every prop named anywhere inside a condition. */
export function condProps(cond: Cond | undefined): string[] {
  if (!cond) return [];
  if (cond.op === 'all' || cond.op === 'any') return cond.conds.flatMap(condProps);
  return [cond.prop];
}

/** Human wording for a condition, in the order the words are read. */
export function describeCond(cond: Cond): string {
  switch (cond.op) {
    case 'is':
      return `${cond.prop} = ${JSON.stringify(cond.value)}`;
    case 'isNot':
      return `${cond.prop} ≠ ${JSON.stringify(cond.value)}`;
    case 'truthy':
      return `${cond.prop} is on`;
    case 'falsy':
      return `${cond.prop} is off`;
    case 'in':
      return `${cond.prop} ∈ ${cond.values.map((v) => String(v)).join(', ')}`;
    case 'all':
      return cond.conds.map(describeCond).join(' and ');
    case 'any':
      return cond.conds.map(describeCond).join(' or ');
  }
}

/* ────────────────────────────  defaults  ───────────────────────────── */

export const DEFAULT_LAYOUT: Layout = {
  dir: 'col',
  gap: 12,
  padding: [0, 0, 0, 0],
  align: 'stretch',
  justify: 'start',
  wrap: false,
};

export const DEFAULT_STYLE: BoxStyle = {
  background: 'none',
  radius: 'none',
  border: 'none',
  shadow: 'none',
  width: 'fill',
  height: 'hug',
};

/** The value a prop stands in for while the component is being drawn. */
export function sampleOf(prop: PropDef): Json | undefined {
  if (prop.sample !== undefined) return prop.sample;
  if (prop.default !== undefined) return prop.default;
  switch (prop.kind) {
    case 'text':
      return prop.name;
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'enum':
      return prop.options?.[0] ?? '';
    case 'list':
      return [];
    default:
      return undefined;
  }
}

/** Prop name → sample value, for every prop whose condition currently holds. */
export function sampleValues(
  props: PropDef[],
  overrides: Record<string, Json> = {},
): Record<string, Json | undefined> {
  const base: Record<string, Json | undefined> = {};
  for (const prop of props) base[prop.name] = sampleOf(prop);
  const merged = { ...base, ...overrides };
  for (const prop of props) {
    if (!test(prop.when, merged)) merged[prop.name] = undefined;
  }
  return merged;
}
