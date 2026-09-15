import { nextId } from '../document/ids';

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * A prop value that is computed from the component's own parameters.
 *
 * The expression can read nothing else. That restriction is the whole design:
 * a component knows what it looks like, and the application that places it
 * knows when. A binding that could reach a fetch or a page variable would be
 * a component with opinions about the app it lands in.
 */
export interface Binding {
  kind: 'expr';
  /** Authored source. Parsed on demand, never stored as an AST — a document is JSON. */
  expr: string;
}

export const bind = (expr: string): Binding => ({ kind: 'expr', expr });

export function isBinding(value: unknown): value is Binding {
  return value !== null && typeof value === 'object' && (value as { kind?: unknown }).kind === 'expr';
}

/* ───────────────────────────  parameters  ─────────────────────────── */

/**
 * What a component takes from wherever it is placed — its whole API.
 *
 * `action` is the outward half: it becomes `onSomething?: () => void`, so the
 * component says *that* something happened and never decides what follows.
 */
export type ParamType = 'text' | 'number' | 'boolean' | 'list' | 'object' | 'action' | 'slot';

export const PARAM_TYPES: ParamType[] = ['text', 'number', 'boolean', 'list', 'object', 'action', 'slot'];

/* ─────────────────────────  conditions  ───────────────────────── */

/**
 * When one property only makes sense because of another.
 *
 * `errorLabel` is not an optional property of a field — it is a *required*
 * property of a field that is in error, and meaningless otherwise. Writing
 * both as `?: string` throws that away and leaves the caller to find out at
 * review time. A condition keeps it, and the generated type says it out loud.
 */
export type ConditionOp = 'is' | 'isNot' | 'truthy' | 'falsy';

export interface ParamCondition {
  /** The property this one depends on. Always an unconditional property. */
  param: string;
  op: ConditionOp;
  /** Compared against, for `is` and `isNot`. */
  value?: Json;
}

export const CONDITION_OPS: { id: ConditionOp; label: string; needsValue: boolean }[] = [
  { id: 'truthy', label: 'is on', needsValue: false },
  { id: 'falsy', label: 'is off', needsValue: false },
  { id: 'is', label: 'is', needsValue: true },
  { id: 'isNot', label: 'is not', needsValue: true },
];

export interface ComponentParam {
  id: string;
  name: string;
  type: ParamType;
  /**
   * Required parameters become required props. Most are not: a flag the app
   * has not decided yet should not stop the component from compiling.
   *
   * Under a condition this reads as "required *when the condition holds*",
   * which is the only reading that makes `errorLabel` expressible at all.
   */
  required?: boolean;
  /**
   * What this property is for, in the author's own words.
   *
   * It reaches the generated file as a doc comment and the story as a
   * description, so the sentence is written once by the person who knows it
   * rather than three times by whoever is reading the code later.
   */
  description?: string;
  /**
   * Present only while another property says so.
   *
   * One level deep on purpose: the controlling property must be unconditional.
   * Chained conditions generate a union of unions that nobody can read, and
   * the honest answer to a case that needs one is two components.
   */
  when?: ParamCondition;
  /**
   * The values this property accepts, when it feeds a variant.
   *
   * A property standing in for `StatusBadge`'s `status` is not a string — it
   * is one of four words, and typing it as a string throws away the thing
   * that made the design system worth having. The options come from the
   * registry at the moment the property is created.
   */
  options?: string[];
  /**
   * Stands in for the value on the canvas.
   *
   * A parameter has no value until someone places the component, so without
   * this a card would be laid out against blanks. It never ships — it is the
   * design-time half of the same idea a Storybook arg is.
   */
  sample: Json;
}

const SAMPLE: Record<ParamType, Json> = {
  text: 'Text',
  number: 0,
  boolean: false,
  list: [],
  object: {},
  action: null,
  // A slot's stand-in is whatever was drawn inside it, which lives in the
  // tree rather than here.
  slot: null,
};

export const sampleFor = (type: ParamType): Json => SAMPLE[type];

export function createParam(name: string, type: ParamType = 'text'): ComponentParam {
  return { id: nextId(), name, type, sample: SAMPLE[type] };
}

/* ──────────────────  reading a condition  ────────────────── */

/** Does this condition hold, given what the properties are currently set to? */
export function conditionHolds(
  when: ParamCondition | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!when) return true;
  const value = values[when.param];
  switch (when.op) {
    case 'truthy':
      return Boolean(value);
    case 'falsy':
      return !value;
    case 'is':
      return sameValue(value, when.value);
    case 'isNot':
      return !sameValue(value, when.value);
  }
}

const sameValue = (a: unknown, b: unknown): boolean =>
  a === b || (a !== null && b !== null && typeof a === 'object' && typeof b === 'object'
    ? JSON.stringify(a) === JSON.stringify(b)
    : String(a) === String(b));

/** The properties that exist right now — the rest are switched off by a condition. */
export const activeParams = (
  params: ComponentParam[],
  values: Record<string, unknown>,
): ComponentParam[] => params.filter((param) => conditionHolds(param.when, values));

/**
 * The properties that may control a condition: unconditional, and of a type
 * with a knowable set of values. A list cannot be compared against usefully,
 * and a slot or an action has no value at all.
 */
export const controllerParams = (params: ComponentParam[], exclude?: string): ComponentParam[] =>
  params.filter(
    (param) =>
      param.name !== exclude &&
      !param.when &&
      (param.type === 'boolean' || param.type === 'text' || param.type === 'number'),
  );

/** The values a controlling property can take, when they are enumerable. */
export function branchValues(param: ComponentParam): Json[] | null {
  if (param.options?.length) return [...param.options];
  if (param.type === 'boolean') return [true, false];
  return null;
}

/** `error is on`, for a chip that has to fit in a panel. */
export function describeCondition(when: ParamCondition): string {
  const op = CONDITION_OPS.find((item) => item.id === when.op);
  const label = op?.label ?? when.op;
  return op?.needsValue ? `${when.param} ${label} ${JSON.stringify(when.value)}` : `${when.param} ${label}`;
}

/** The TypeScript each parameter type becomes. */
export const PARAM_SIGNATURE: Record<ParamType, string> = {
  text: 'string',
  number: 'number',
  boolean: 'boolean',
  list: 'unknown[]',
  object: 'Record<string, unknown>',
  action: '() => void',
  slot: 'ReactNode',
};

/* ─────────────────────────────  events  ───────────────────────────── */

/**
 * An event on a node points at an action parameter. That is all it can do.
 *
 * The previous version had a list of steps — set a variable, run a fetch, go
 * to another screen — and every one of those was the component deciding
 * something that belongs to the application. What survived is the only part
 * that was ever the component's to say: this happened.
 */
export type EventMap = Record<string, string>;

/** Event props worth offering, in the order they matter. */
export const EVENT_PROPS = ['onClick', 'onChange', 'onSubmit', 'onDismiss', 'onBlur', 'onFocus'] as const;

/** `onClick` → `onClick`; `click` → `onClick`. */
export function toEventName(event: string): string {
  if (/^on[A-Z]/.test(event)) return event;
  return `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
}
