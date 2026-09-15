import type { FrameNode, NodeId } from '../../document/types';
import { isFrame } from '../../document/types';
import { findNode } from '../../document/tree';

export const DRAG_ASSET = 'application/x-nili-asset';
export const DRAG_NODE = 'application/x-nili-node';
/**
 * The props a dragged variant arrives with, as JSON.
 *
 * Carried beside `DRAG_ASSET` rather than instead of it, so every existing
 * drop path keeps working and a drag from the plain library grid is still a
 * drag of a component with its defaults.
 */
export const DRAG_PRESET = 'application/x-nili-preset';

export type DropKind =
  | { mode: 'into'; parentId: NodeId; index: number }
  /** Drop beside a node; the reducer wraps it into a row when needed. */
  | { mode: 'beside'; targetId: NodeId; side: 'start' | 'end' };

export interface DropTarget {
  parentId: NodeId;
  index: number;
}

export interface DropIndicator {
  kind: DropKind;
  /** The node a `beside` drop will pair with, so the canvas can outline it. */
  pair?: { x: number; y: number; width: number; height: number };
  /** Viewport rectangle for the insertion line, so the canvas can draw it. */
  x: number;
  y: number;
  length: number;
  orientation: 'horizontal' | 'vertical';
}

/**
 * The edge band is a share of the node's width, clamped to real pixels. A
 * ratio alone fails at both ends: on a 1000px frame 28% is an absurd 280px
 * target, and on a 48px badge it is 13px nobody can hit. Clamping makes the
 * band usable at every size, which is why a small component can now be paired
 * with — it used to be excluded by a minimum-width check.
 */
const SIDE_ZONE = 0.28;
const FRAME_SIDE_ZONE = 0.18;
const MIN_BAND = 12;
const MAX_BAND = 64;

/**
 * Resolves a pointer position to a frame and an insertion index by measuring
 * the rendered children, so the drop indicator matches what the flex container
 * will actually do — including when the frame is horizontal and the document
 * is right-to-left.
 */
interface SideHit {
  side: 'start' | 'end';
  line: Omit<DropIndicator, 'kind' | 'pair'>;
  pair: NonNullable<DropIndicator['pair']>;
}

function sideOf(element: HTMLElement, x: number, rtl: boolean, zone: number): SideHit | null {
  const box = element.getBoundingClientRect();
  if (box.width <= 0) return null;

  const band = Math.min(MAX_BAND, Math.max(MIN_BAND, box.width * zone));
  const offset = x - box.left;

  // Too narrow to hold a centre as well as two edges: the whole node is edge,
  // and the halfway point decides which one.
  const narrow = box.width < band * 2 + MIN_BAND;
  const atLeftEdge = narrow ? offset < box.width / 2 : offset < band;
  const atRightEdge = narrow ? !atLeftEdge : offset > box.width - band;
  if (!atLeftEdge && !atRightEdge) return null;

  return {
    // The handle is physical; which end of the flex row it means flips in RTL.
    side: rtl ? (atLeftEdge ? 'end' : 'start') : atLeftEdge ? 'start' : 'end',
    line: {
      x: atLeftEdge ? box.left : box.right,
      y: box.top,
      length: box.height,
      orientation: 'vertical',
    },
    pair: { x: box.left, y: box.top, width: box.width, height: box.height },
  };
}

export function dropTargetAt(root: FrameNode, x: number, y: number, rtl: boolean): DropIndicator | null {
  const element = document.elementFromPoint(x, y);
  const frameElement = element?.closest<HTMLElement>('[data-frame="true"]');
  if (!frameElement) return null;

  const parentId = frameElement.dataset.node;
  if (!parentId) return null;

  const frame = findNode(root, parentId);
  if (!frame || !isFrame(frame)) return null;

  const horizontal = frame.layout.direction === 'horizontal';
  const children = [...frameElement.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement && Boolean(child.dataset.node),
  );

  /* Before deciding where in the frame this lands, check whether the pointer
     is over the left or right edge of something. That is a request to sit
     beside it rather than above or below it.
     
     A frame is its own closest `[data-node]` and `[data-frame]`, so it needs a
     narrower edge band than a leaf: the middle has to stay available for
     dropping *into* the container. */
  const overNode = element?.closest<HTMLElement>('[data-node]');
  const beside = overNode?.dataset.node
    ? sideOf(overNode, x, rtl, overNode === frameElement ? FRAME_SIDE_ZONE : SIDE_ZONE)
    : null;

  // The component frame has no siblings, so nothing can sit beside it.
  if (beside && overNode?.dataset.node && overNode.dataset.node !== root.id) {
    return {
      kind: { mode: 'beside', targetId: overNode.dataset.node, side: beside.side },
      pair: beside.pair,
      ...beside.line,
    };
  }

  const frameRect = frameElement.getBoundingClientRect();
  type Line = Omit<DropIndicator, 'kind'>;
  const line = (rect: DOMRect | null, atEnd: boolean): Line => {
    const box = rect ?? frameRect;
    if (horizontal) {
      const edge = rect ? (atEnd !== rtl ? box.right : box.left) : rtl ? box.left + 8 : box.right - 8;
      return { x: edge, y: box.top, length: box.height, orientation: 'vertical' };
    }
    return {
      x: box.left,
      y: rect ? (atEnd ? box.bottom : box.top) : box.bottom - 8,
      length: box.width,
      orientation: 'horizontal',
    };
  };

  for (let index = 0; index < children.length; index += 1) {
    const rect = children[index]!.getBoundingClientRect();
    const middle = horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    const position = horizontal ? x : y;
    const before = horizontal && rtl ? position > middle : position < middle;
    if (before) return { kind: { mode: 'into', parentId, index }, ...line(rect, false) };
  }

  const last = children.at(-1)?.getBoundingClientRect() ?? null;
  return { kind: { mode: 'into', parentId, index: children.length }, ...line(last, true) };
}
