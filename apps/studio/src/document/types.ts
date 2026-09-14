import type { TextValue } from '../i18n/types';

export type NodeId = string;

export type PropValue = TextValue | string | number | boolean | undefined;

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

interface BaseNode {
  id: NodeId;
  /** Free-form Tailwind, merged by the component's own `cn()`. */
  className: string;
  size: NodeSize;
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

export type DocNode = FrameNode | ComponentNode;

export interface Document {
  root: FrameNode;
}

export const isFrame = (node: DocNode): node is FrameNode => node.kind === 'frame';
export const isComponent = (node: DocNode): node is ComponentNode => node.kind === 'component';

export const ROOT_ID = 'root';
