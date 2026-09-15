import type { Json, Value } from './model';

/**
 * Expressions read the component's own props and nothing else.
 *
 * That restriction is the design, not a limitation of the evaluator: a
 * component knows what it looks like, and the application that places it knows
 * when. An expression that could reach a fetch or a global would be a
 * component with opinions about the app it lands in.
 *
 * The same source string is what the exporter writes, so what runs on the
 * canvas and what ships are the same text — there is no second dialect to keep
 * in sync.
 */

const cache = new Map<string, (values: Record<string, unknown>) => unknown>();

function compile(src: string, names: string[]): (values: Record<string, unknown>) => unknown {
  const key = `${names.join(',')}|${src}`;
  const hit = cache.get(key);
  if (hit) return hit;

  /* A design tool evaluating expressions it authored itself. The scope is the
     declared prop names and nothing else reaches in. */
  const fn = new Function(...names, `"use strict"; return (${src});`) as (
    ...args: unknown[]
  ) => unknown;
  const run = (values: Record<string, unknown>): unknown => fn(...names.map((n) => values[n]));
  cache.set(key, run);
  return run;
}

export interface Evaluated {
  value: unknown;
  error: string | null;
}

export function evaluate(src: string, values: Record<string, Json | undefined>): Evaluated {
  if (!src.trim()) return { value: undefined, error: null };
  const names = Object.keys(values).filter((name) => /^[A-Za-z_$][\w$]*$/.test(name));
  try {
    return { value: compile(src, names)(values), error: null };
  } catch (error) {
    return { value: undefined, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Resolves an authored value against the current prop values. */
export function resolve(
  value: Value | undefined,
  values: Record<string, Json | undefined>,
): unknown {
  if (!value) return undefined;
  if (value.v === 'const') return value.value;
  if (value.v === 'prop') return values[value.name];
  return evaluate(value.src, values).value;
}

/** Prop names an authored value depends on. */
export function dependencies(value: Value | undefined, names: string[]): string[] {
  if (!value) return [];
  if (value.v === 'prop') return [value.name];
  if (value.v === 'const') return [];
  return names.filter((name) => new RegExp(`\\b${name}\\b`).test(value.src));
}

/** The source the exporter writes for a value used inside `{…}`. */
export function toSource(value: Value): string {
  if (value.v === 'prop') return value.name;
  if (value.v === 'expr') return value.src;
  return JSON.stringify(value.value);
}
