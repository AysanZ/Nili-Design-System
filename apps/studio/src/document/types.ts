import type { TextValue } from '../i18n/types';
import type { Binding, ComponentParam, EventMap, Json } from '../logic/types';

/* Re-exported because a node's shape is what the rest of the app imports, and
   splitting "what a prop can be" across two modules would make every consumer
   import both. */
export type { Binding, ComponentParam, EventMap, ParamType } from '../logic/types';

export type NodeId = string;
export type ComponentId = string;

/**
 * `Binding` sits alongside `TextValue` rather than replacing it. A prop can be
 * typed in, pointed at a translation key, or computed — three kinds, one
 * union, and every control in the inspector already branches on the first two.
 */
export type PropValue = TextValue | Binding | string | number | boolean | undefined;

export type PropBag = Record<string, PropValue>;

export type FrameDirection = 'vertical' | 'horizontal';
export type FrameAlign = 'stretch' | 'start' | 'center' | 'end';
export type FrameJustify = 'start' | 'center' | 'end' | 'between';
export type FrameBackground = 'none' | 'surface' | 'weak' | 'card';

export interface FrameLayout {
  direction: FrameDirection;
  gap: number;
  padding: number;
  radius: number;
  align: FrameAlign;
  justify: FrameJustify;
  background: FrameBackground;
  wrap: boolean;
}

/**
 * Turns one authored node into a row per item.
 *
 * `as` names the row inside the subtree, which is what makes the expression
 * editor able to offer `item.name` — the alias is in scope for descendants and
 * nowhere else, exactly like the parameter of the `map` callback it becomes.
 */
export interface RepeatSpec {
  each: Binding;
  as: string;
  /** Expression for React's `key`. Empty falls back to the index. */
  keyExpr: string;
}

interface BaseNode {
  id: NodeId;
  /**
   * What the layers list calls this node. Absent means "use the component
   * name", which is the right default until a component has ten `Typography`
   * nodes and no way to tell them apart.
   */
  label?: string;
  /** Free-form Tailwind, merged by the component's own `cn()`. */
  className: string;
  size: NodeSize;
  /** Rendered only when this evaluates truthy. Absent means always. */
  visibleWhen?: Binding;
  repeat?: RepeatSpec;
  /** Event prop name to the steps it runs, in order. */
  events?: EventMap;
  /**
   * An expression returning a message, or nothing when the value is fine.
   *
   * Validation is a message rather than a boolean because a boolean has to be
   * turned back into words somewhere, and the only place that knows the words
   * is here. It lands on the component's own `error` prop, so the design
   * system draws the invalid state rather than the studio inventing one.
   */
  validate?: Binding;
  /**
   * What the node looks like while pointed at, focused, or pressed.
   *
   * A curated set rather than free text, for one practical reason: Tailwind
   * generates the classes it can see in the source, so a hover effect typed as
   * a string would work in the export and do nothing on the canvas. Choosing
   * from a list means every class already exists.
   */
  states?: Partial<Record<InteractionState, StateEffect>>;
  /**
   * Layout and size, per breakpoint, overriding the base.
   *
   * Tailwind's prefixes are mobile-first, and so is this: the base values are
   * the narrow case and each entry applies from that width up. Which means the
   * artboard width finally does something other than crop — it decides which
   * variant you are editing.
   */
  responsive?: Partial<Record<Breakpoint, ResponsiveOverride>>;
}

export type InteractionState = 'hover' | 'focus' | 'active' | 'disabled';

export const INTERACTION_STATES: { id: InteractionState; label: string; hint: string }[] = [
  { id: 'hover', label: 'Hover', hint: 'Pointer is over it' },
  { id: 'focus', label: 'Focus', hint: 'Reached by keyboard' },
  { id: 'active', label: 'Pressed', hint: 'Held down' },
  { id: 'disabled', label: 'Disabled', hint: 'Not interactive' },
];

export interface StateEffect {
  background?: 'weak' | 'soft' | 'primary' | 'none';
  opacity?: 100 | 90 | 80 | 70 | 60;
  border?: 'none' | 'soft' | 'primary';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  translate?: 'none' | 'up' | 'down';
}

/** Tailwind's own stops, because the output is Tailwind. */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

export const BREAKPOINTS: { id: Breakpoint; min: number; label: string }[] = [
  { id: 'sm', min: 640, label: 'sm' },
  { id: 'md', min: 768, label: 'md' },
  { id: 'lg', min: 1024, label: 'lg' },
  { id: 'xl', min: 1280, label: 'xl' },
];

export interface ResponsiveOverride {
  layout?: Partial<FrameLayout>;
  size?: Partial<NodeSize>;
}

/** The widest breakpoint a given artboard width has reached. */
export function breakpointFor(width: number): Breakpoint | null {
  let active: Breakpoint | null = null;
  for (const stop of BREAKPOINTS) if (width >= stop.min) active = stop.id;
  return active;
}

/**
 * Per axis, independently. `hug` is the natural size, `fill` takes the free
 * space in the parent, a number is a fixed pixel size. Dragging a handle sets
 * the number; the inspector can put it back to hug or fill.
 */
export type AxisSize = 'hug' | 'fill' | number;

export interface NodeSize {
  width: AxisSize;
  height: AxisSize;
}

export type Axis = 'width' | 'height';

export interface FrameNode extends BaseNode {
  kind: 'frame';
  layout: FrameLayout;
  children: DocNode[];
}

export interface ComponentNode extends BaseNode {
  kind: 'component';
  component: string;
  props: PropBag;
}

/**
 * One use of a component the person built themselves.
 *
 * This is the piece that turns a set of screens into a design system of your
 * own: a card you drew once, placed three times, edited in one place. It is a
 * separate node kind rather than a flag on `ComponentNode` because the two
 * resolve completely differently — a `ComponentNode` looks its props up in the
 * registry, an instance looks them up in another component of this document.
 */
export interface InstanceNode extends BaseNode {
  kind: 'instance';
  /** The component, of kind `component`, that this renders. */
  componentId: ComponentId;
  /** One entry per declared parameter. Values may be bindings. */
  args: PropBag;
}

/**
 * A hole in the component, with what to draw when nobody fills it.
 *
 * This is the piece that makes what the studio builds composable. Without it
 * every component's contents are fixed at design time, which is fine for a
 * badge and useless for a card — and composability is the entire reason a
 * component library exists rather than a folder of screenshots.
 *
 * The children are the default, not a placeholder: they generate as
 * `{content ?? (…)}`, so the drawing survives into the output and a caller who
 * supplies nothing still gets something sensible.
 */
export interface SlotNode extends BaseNode {
  kind: 'slot';
  /** The parameter this fills — always of type `slot`. */
  name: string;
  children: DocNode[];
}

export type DocNode = FrameNode | ComponentNode | InstanceNode | SlotNode;



/**
 * One artboard, one generated component.
 *
 * Variables and resources belong to the component rather than to the document
 * because the component is the unit that becomes a file. State shared between two
 * screens is state the host application owns and passes down, and pretending
 * otherwise would mean generating a context provider nobody asked for.
 */
/**
 * One artboard, one exported component.
 *
 * There is no second kind. A screen is a component that happens to take no
 * parameters, and treating it as a different species was the assumption that
 * pulled the whole tool towards building applications.
 */
/**
 * A named appearance of the component.
 *
 * It is a name and a set of property values, and deliberately nothing more —
 * no new concept enters the model, only a label for something that already
 * existed. Before this, "the error state" was an expression on one node, and
 * finding it meant flipping properties one at a time until it appeared.
 *
 * It earns its place three times over: the canvas can draw it, the export
 * writes a real story for it instead of guessing one per boolean, and the
 * linter can finally ask whether a component that accepts a list ever says
 * what none of it looks like.
 */
export interface ComponentState {
  id: string;
  name: string;
  /** Property name → value, overriding the sample while this state is shown. */
  values: Record<string, Json>;
}

export interface ComponentDef {
  id: ComponentId;
  /** Declared parameters — the component's entire API. */
  params: ComponentParam[];
  /** Named appearances. Empty means the one the samples describe. */
  states?: ComponentState[];
  /** Shown on the canvas and in the components list. */
  name: string;
  /** The exported component's name, derived from `name` but editable. */
  component: string;
  root: FrameNode;
  /** Position on the infinite canvas, in canvas pixels. */
  x: number;
  y: number;
  /** The width it is being designed at. Height is whatever the content needs. */
  width: number;
}

export interface DocumentModel {
  components: ComponentDef[];
  activeId: ComponentId;
}

/**
 * An image the document carries with it.
 *
 * Stored as a data URL so a document is one file that opens anywhere — no
 * asset server, no broken links after an export. On the way out they are
 * written to `public/assets/` and the generated code references the path,
 * because a 200KB data URL inlined into a component is not something anybody
 * wants to read or diff.
 */
export interface Asset {
  id: string;
  name: string;
  /** `data:image/...;base64,…` */
  dataUrl: string;
  /** Bytes, for the panel to show what a document is carrying. */
  size: number;
  width: number;
  height: number;
}

/** The public path an exported asset lives at. */
export const assetPath = (asset: Asset): string => `/assets/${asset.name}`;

export const isFrame = (node: DocNode): node is FrameNode => node.kind === 'frame';
export const isComponent = (node: DocNode): node is ComponentNode => node.kind === 'component';
export const isInstance = (node: DocNode): node is InstanceNode => node.kind === 'instance';
export const isSlot = (node: DocNode): node is SlotNode => node.kind === 'slot';
/** Both kinds that hold children, which is what the tree walks care about. */
export const hasChildren = (node: DocNode): node is FrameNode | SlotNode =>
  node.kind === 'frame' || node.kind === 'slot';


/** A root is named after its component, so ids stay unique across artboards. */
export const rootIdFor = (id: ComponentId): NodeId => `${id}:root`;

export const DEFAULT_WIDTH = 440;

/** Gap between artboards when a new component is laid out beside the last one. */
export const GUTTER = 96;

/**
 * How tall an artboard is assumed to be when nobody has measured it.
 *
 * Height is content-driven and the reducer cannot see the DOM, so laying out a
 * new component and framing the whole board both need a guess. One guess, in one
 * place: if it is wrong it is wrong consistently, which is the difference
 * between a board that drifts and a board that is merely approximate.
 */
export const estimatedHeight = (component: Pick<ComponentDef, 'width'>): number =>
  Math.round(component.width * 1.6);
