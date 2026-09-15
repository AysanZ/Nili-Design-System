import { evaluateSource } from '../expr';
import type { Scope } from '../expr';
import { hasChildren } from '../document/types';
import type { ComponentParam, DocNode, FrameNode, NodeId, RepeatSpec } from '../document/types';
import { completionsFor, itemCompletions, withItem } from './scope';
import type { Completion } from './scope';

/** The repeats between the component root and a node, outermost first. */
export function repeatChain(root: FrameNode, nodeId: NodeId): { node: DocNode; repeat: RepeatSpec }[] {
  const path: { node: DocNode; repeat: RepeatSpec }[] = [];

  const walk = (node: DocNode, carried: { node: DocNode; repeat: RepeatSpec }[]): boolean => {
    const next = node.repeat ? [...carried, { node, repeat: node.repeat }] : carried;
    if (node.id === nodeId) {
      path.push(...next);
      return true;
    }
    /* Slots hold children as well as frames. Stopping at frames meant a
       repeat above a slot was invisible to anything drawn inside it, so the
       expression editor offered a scope the generated code did not have. */
    if (!hasChildren(node)) return false;
    return node.children.some((child) => walk(child, next));
  };

  walk(root, []);
  return path;
}

export interface NodeScope {
  /** What `visibleWhen` and `repeat.each` are evaluated against. */
  outer: Scope;
  /** What the node's own props are evaluated against. */
  inner: Scope;
  outerCompletions: Completion[];
  innerCompletions: Completion[];
}

/**
 * The scope at a node is the component's parameters plus one alias for every
 * repeat above it — and one more for its own repeat, which is in scope for its
 * props but not for the list it iterates. That asymmetry is not a subtlety of
 * the studio; it is what `array.map((item) => …)` means, and the inspector has
 * to agree with the code it generates or the suggestions lie.
 */
export function scopeAtNode(
  params: ComponentParam[],
  root: FrameNode,
  nodeId: NodeId,
  base: Scope,
): NodeScope {
  const chain = repeatChain(root, nodeId);
  const own = chain.at(-1)?.node.id === nodeId ? chain.at(-1) : undefined;
  const ancestors = own ? chain.slice(0, -1) : chain;

  const extend = (scope: Scope, entry: { repeat: RepeatSpec }): { scope: Scope; row: unknown } => {
    const alias = entry.repeat.as || 'item';
    const { value } = evaluateSource(entry.repeat.each.expr, scope);
    const row = Array.isArray(value) ? value[0] : undefined;
    return { scope: withItem(scope, alias, row, 0), row };
  };

  let outer = base;
  const extras: Completion[] = [];

  for (const entry of ancestors) {
    const { scope, row } = extend(outer, entry);
    outer = scope;
    extras.push(...itemCompletions(entry.repeat.as || 'item', row));
  }

  let inner = outer;
  const innerExtras = [...extras];
  if (own) {
    const { scope, row } = extend(outer, own);
    inner = scope;
    innerExtras.push(...itemCompletions(own.repeat.as || 'item', row));
  }

  return {
    outer,
    inner,
    outerCompletions: completionsFor(params, extras),
    innerCompletions: completionsFor(params, innerExtras),
  };
}
