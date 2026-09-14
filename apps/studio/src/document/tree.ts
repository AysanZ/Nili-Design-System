import type { DocNode, FrameNode, NodeId } from './types';
import { isFrame } from './types';

export interface Located {
  node: DocNode;
  parent: FrameNode | null;
  index: number;
}

export function walk(node: DocNode, visit: (node: DocNode, parent: FrameNode | null) => void, parent: FrameNode | null = null): void {
  visit(node, parent);
  if (isFrame(node)) for (const child of node.children) walk(child, visit, node);
}

export function locate(root: FrameNode, id: NodeId): Located | null {
  let found: Located | null = null;
  walk(root, (node, parent) => {
    if (node.id !== id || found) return;
    const index = parent ? parent.children.indexOf(node) : -1;
    found = { node, parent, index };
  });
  return found;
}

export const findNode = (root: FrameNode, id: NodeId): DocNode | null => locate(root, id)?.node ?? null;

export function ancestors(root: FrameNode, id: NodeId): FrameNode[] {
  const chain: FrameNode[] = [];
  let current = locate(root, id)?.parent ?? null;
  while (current) {
    chain.push(current);
    current = locate(root, current.id)?.parent ?? null;
  }
  return chain;
}

/** True when `maybeAncestor` contains `id`, used to refuse self-nesting drops. */
export function contains(root: FrameNode, maybeAncestor: NodeId, id: NodeId): boolean {
  const node = findNode(root, maybeAncestor);
  if (!node || !isFrame(node)) return false;
  let hit = false;
  walk(node, (child) => {
    if (child.id === id) hit = true;
  });
  return hit;
}

type Mapper = (node: DocNode, parent: FrameNode | null) => DocNode | null;

/**
 * Structural edits are a rebuild rather than a mutation: React's reconciler
 * needs new references to know a subtree changed, and undo needs the previous
 * tree to stay intact.
 */
export function rebuild(node: DocNode, map: Mapper, parent: FrameNode | null = null): DocNode | null {
  const mapped = map(node, parent);
  if (mapped === null) return null;
  if (!isFrame(mapped)) return mapped;
  const children = mapped.children
    .map((child) => rebuild(child, map, mapped))
    .filter((child): child is DocNode => child !== null);
  return { ...mapped, children };
}

export function remove(root: FrameNode, ids: ReadonlySet<NodeId>): FrameNode {
  const next = rebuild(root, (node) => (ids.has(node.id) && node.id !== root.id ? null : node));
  return (next as FrameNode) ?? root;
}

export function replace(root: FrameNode, id: NodeId, produce: (node: DocNode) => DocNode): FrameNode {
  const next = rebuild(root, (node) => (node.id === id ? produce(node) : node));
  return (next as FrameNode) ?? root;
}

export function insert(root: FrameNode, parentId: NodeId, index: number, nodes: DocNode[]): FrameNode {
  const next = rebuild(root, (node) => {
    if (node.id !== parentId || !isFrame(node)) return node;
    const children = [...node.children];
    children.splice(Math.max(0, Math.min(index, children.length)), 0, ...nodes);
    return { ...node, children };
  });
  return (next as FrameNode) ?? root;
}

export function move(root: FrameNode, id: NodeId, parentId: NodeId, index: number): FrameNode {
  const located = locate(root, id);
  if (!located || !located.parent) return root;
  const sameParent = located.parent.id === parentId;
  const target = sameParent && located.index < index ? index - 1 : index;
  const detached = remove(root, new Set([id]));
  return insert(detached, parentId, target, [located.node]);
}

export function reorder(root: FrameNode, id: NodeId, delta: number): FrameNode {
  const located = locate(root, id);
  if (!located?.parent) return root;
  const next = located.index + delta;
  if (next < 0 || next >= located.parent.children.length) return root;
  return move(root, id, located.parent.id, next);
}

export function collect(root: FrameNode): DocNode[] {
  const all: DocNode[] = [];
  walk(root, (node) => all.push(node));
  return all;
}
