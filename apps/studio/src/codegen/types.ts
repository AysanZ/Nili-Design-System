import type { ComponentDef } from '../document/types';
import type { ComponentParam, Json } from '../logic/types';
import { PARAM_SIGNATURE } from '../logic/types';

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const quoteKey = (key: string): string => (IDENTIFIER.test(key) ? key : JSON.stringify(key));
const capitalise = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/** A type expression for a value, with objects written inline. */
function typeOf(value: Json | undefined, depth = 0): string {
  if (value === null || value === undefined) return 'unknown';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    const first = value.find((item) => item !== null && item !== undefined);
    if (first === undefined) return 'unknown[]';
    const inner = typeOf(first, depth + 1);
    return inner.includes(' ') && !inner.endsWith(']') ? `Array<${inner}>` : `${inner}[]`;
  }

  const entries = Object.entries(value);
  if (!entries.length) return 'Record<string, unknown>';
  if (depth >= 2) return 'Record<string, unknown>';
  return `{ ${entries.map(([key, item]) => `${quoteKey(key)}: ${typeOf(item, depth + 1)}`).join('; ')} }`;
}

export interface ParamType {
  /** An interface to declare above the component, when one is worth declaring. */
  declaration: string | null;
  /** What goes in the props interface. */
  reference: string;
  /** A default for the destructure, so the component is total without it. */
  fallback: string | null;
}

/**
 * A type for every property, inferred from the sample beside it.
 *
 * Without this a list property is `unknown[]`, and the moment a repeat reads
 * `person.name` the generated file stops compiling. The studio already knows
 * the shape — it is what made the canvas legible while the component was
 * being drawn — and this is the one place that knowledge was not being used.
 *
 * The fallback matters as much as the type. An optional property is
 * `string | undefined`, which the design system will not accept where it asks
 * for a string, so a non-required property is destructured with a default and
 * the component becomes total: `{ people = [], loading = false }`.
 */
export function paramType(param: ComponentParam): ParamType {
  if (param.type === 'action') {
    return { declaration: null, reference: PARAM_SIGNATURE.action, fallback: null };
  }

  const fallback = param.required ? null : FALLBACK[param.type];

  /* A variant property is a union, not a string. Widening it would hand the
     caller four wrong answers and no way to find out. */
  if (param.options?.length) {
    /* The default is whatever the canvas is showing, when that is one of the
       choices. Falling back to the first option instead would mean a component
       looked one way while it was drawn and another the moment it shipped. */
    const chosen =
      typeof param.sample === 'string' && param.options.includes(param.sample)
        ? param.sample
        : (param.options[0] as string);
    return {
      declaration: null,
      reference: param.options.map((option) => `'${option}'`).join(' | '),
      fallback: param.required ? null : `'${chosen}'`,
    };
  }

  if (param.type !== 'list' && param.type !== 'object') {
    return { declaration: null, reference: PARAM_SIGNATURE[param.type], fallback };
  }

  const sample = param.sample;
  const row = Array.isArray(sample) ? sample.find((item) => item !== null) : sample;
  const isObject = row !== null && row !== undefined && typeof row === 'object' && !Array.isArray(row);

  if (!isObject) return { declaration: null, reference: typeOf(sample), fallback };

  // An array of objects earns a named interface: it is the shape the repeat
  // iterates and the one a developer will want to import.
  const base = capitalise(param.name);
  const name = Array.isArray(sample) ? `${base.replace(/s$/, '')}Item` : base;
  const fields = Object.entries(row as Record<string, Json>)
    .map(([key, value]) => `  ${quoteKey(key)}: ${typeOf(value, 1)}`)
    .join('\n');

  return {
    declaration: `export interface ${name} {\n${fields}\n}`,
    reference: Array.isArray(sample) ? `${name}[]` : name,
    fallback,
  };
}

const FALLBACK: Record<string, string> = {
  text: "''",
  number: '0',
  boolean: 'false',
  list: '[]',
  object: '{}',
};

/** The interfaces a component's properties need, declared above it. */
export const paramInterfaces = (component: ComponentDef): string[] =>
  component.params
    .map((param) => paramType(param).declaration)
    .filter((declaration): declaration is string => declaration !== null);
