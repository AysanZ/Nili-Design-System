import { parse } from './parse';
import { dependencies, evaluate, print } from './evaluate';
import type { ExprNode, ParseResult } from './ast';
import type { Scope } from './evaluate';

export type { ExprNode, ParseResult } from './ast';
export type { Scope, EvaluationResult } from './evaluate';
export { parse } from './parse';
export { dependencies, evaluate, print } from './evaluate';

/**
 * The canvas re-evaluates every binding on every render, and a repeated node
 * evaluates the same source once per row. Parsing is the expensive half and
 * the source rarely changes, so results are kept.
 *
 * The cache is unbounded on purpose: its keys are expression sources typed by
 * a person into an editor, so the ceiling is a few hundred entries.
 */
const cache = new Map<string, ParseResult>();

export function compile(source: string): ParseResult {
  const hit = cache.get(source);
  if (hit) return hit;
  const result = parse(source);
  cache.set(source, result);
  return result;
}

export interface Evaluated {
  value: unknown;
  /** A parse or lookup failure, in a sentence the inspector can show as-is. */
  error?: string;
}

export function evaluateSource(source: string, scope: Scope): Evaluated {
  const parsed = compile(source);
  if (!parsed.ok) return { value: undefined, error: parsed.error.message };
  const result = evaluate(parsed.node, scope);
  return result.error ? { value: result.value, error: result.error } : { value: result.value };
}

/** Free identifiers, or an empty list when the source does not parse. */
export function dependenciesOf(source: string): string[] {
  const parsed = compile(source);
  return parsed.ok ? dependencies(parsed.node) : [];
}

/** Normalised JavaScript for the generated file, or the raw source if unparsable. */
export function toSource(source: string): string {
  const parsed = compile(source);
  return parsed.ok ? print(parsed.node) : source.trim();
}

/** True when the expression is a bare identifier or member path. */
export function isPath(node: ExprNode): boolean {
  if (node.type === 'Identifier') return true;
  return node.type === 'Member' && !node.computed && isPath(node.object);
}
