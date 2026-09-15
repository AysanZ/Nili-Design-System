import type { Scope } from '../expr';
import type { ComponentParam, Json } from './types';

/**
 * What a component's expressions can see: its own parameters, and nothing
 * else.
 *
 * The previous version handed expressions page variables and the results of
 * fetches, which made every binding a small decision about the application
 * the component would end up in. Narrowing the scope is what turns a screen
 * builder into a component builder — the restriction is the feature.
 */
export function designScope(params: ComponentParam[]): Scope {
  const scope: Scope = {};
  for (const param of params) scope[param.name] = param.sample;
  return scope;
}

/**
 * The samples, with a named state's values layered over them.
 *
 * A state overrides only what it names. Anything it says nothing about keeps
 * the sample, which is what makes "the error state" a small, readable thing —
 * one or two values — rather than a second full copy of the component's data.
 */
export function stateScope(params: ComponentParam[], values: Record<string, unknown>): Scope {
  const scope = designScope(params);
  for (const [name, value] of Object.entries(values)) scope[name] = value;
  return scope;
}

/** The same scope with whatever the preview controls are currently set to. */
export function controlScope(params: ComponentParam[], controls: Record<string, unknown>): Scope {
  const scope: Scope = {};
  for (const param of params) {
    scope[param.name] = param.name in controls ? controls[param.name] : param.sample;
  }
  return scope;
}

/** The row a repeat introduces, and its position. */
export function withItem(scope: Scope, alias: string, item: unknown, index: number): Scope {
  return { ...scope, [alias]: item, [`${alias}Index`]: index };
}

export function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'unknown';
  if (Array.isArray(value)) {
    const first = value[0];
    return first === undefined ? 'unknown[]' : `${typeOf(first)}[]`;
  }
  const kind = typeof value;
  return kind === 'object' ? 'object' : kind;
}

/** A single row of the expression editor's suggestion list. */
export interface Completion {
  name: string;
  type: string;
  origin: 'param' | 'item' | 'global';
  doc?: string;
}

const GLOBALS: Completion[] = [
  { name: 't', type: '(key) => string', origin: 'global', doc: 'Translate a catalogue key' },
  { name: 'Math', type: 'namespace', origin: 'global' },
  { name: 'Number', type: 'namespace', origin: 'global' },
  { name: 'String', type: 'namespace', origin: 'global' },
  { name: 'JSON', type: 'namespace', origin: 'global' },
];

export function completionsFor(params: ComponentParam[], extra: Completion[] = []): Completion[] {
  const out: Completion[] = [...extra];

  for (const param of params) {
    if (param.type === 'action') continue; // an event prop is not a value
    out.push({ name: param.name, type: typeOf(param.sample), origin: 'param' });

    // One level into a sample object covers the case the repeat control exists
    // for, without turning the list into a schema browser.
    const row = Array.isArray(param.sample) ? param.sample[0] : param.sample;
    if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
      for (const [key, value] of Object.entries(row)) {
        const path = Array.isArray(param.sample) ? `${param.name}[0].${key}` : `${param.name}.${key}`;
        out.push({ name: path, type: typeOf(value), origin: 'param' });
      }
    }
  }

  return [...out, ...GLOBALS];
}

/** Completions for the alias a repeat introduces, read off one row. */
export function itemCompletions(alias: string, row: unknown): Completion[] {
  const out: Completion[] = [{ name: alias, type: typeOf(row), origin: 'item' }];
  if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
    for (const [key, value] of Object.entries(row)) {
      out.push({ name: `${alias}.${key}`, type: typeOf(value), origin: 'item' });
    }
  }
  out.push({ name: `${alias}Index`, type: 'number', origin: 'item' });
  return out;
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const isIdentifier = (name: string): boolean => IDENTIFIER.test(name);

/** Turns a component's display name into something that can be a function. */
export function toComponentName(label: string): string {
  const cleaned = label.replace(/[^A-Za-z0-9 ]+/g, ' ').trim();
  if (!cleaned) return 'Component';
  const name = cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return IDENTIFIER.test(name) ? name : `Component${name}`;
}

export const parseSample = (text: string): Json | null => {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as Json;
  } catch {
    return null;
  }
};
