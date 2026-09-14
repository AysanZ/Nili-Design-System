import type { FrameLayout } from '../document/types';

const SPACING: Record<number, string> = {
  0: '0', 2: '0.5', 4: '1', 6: '1.5', 8: '2', 10: '2.5', 12: '3', 14: '3.5',
  16: '4', 20: '5', 24: '6', 28: '7', 32: '8', 40: '10', 48: '12', 64: '16',
};
const RADIUS: Record<number, string> = {
  4: 'rounded', 6: 'rounded-md', 8: 'rounded-lg', 12: 'rounded-xl',
  16: 'rounded-2xl', 24: 'rounded-3xl',
};

const spacing = (px: number): string => SPACING[px] ?? `[${px}px]`;
const radius = (px: number): string => RADIUS[px] ?? `rounded-[${px}px]`;

const ALIGN: Record<FrameLayout['align'], string> = {
  stretch: '', start: 'items-start', center: 'items-center', end: 'items-end',
};
const JUSTIFY: Record<FrameLayout['justify'], string> = {
  start: '', center: 'justify-center', end: 'justify-end', between: 'justify-between',
};
const BACKGROUND: Record<FrameLayout['background'], string[]> = {
  none: [], surface: ['bg-white-0'], weak: ['bg-weak-50'],
  card: ['bg-white-0', 'border', 'border-soft-200'],
};

/** Auto layout maps onto flexbox one-to-one, which is the whole reason the
 *  canvas uses Figma's model rather than absolute positioning. */
import type { AxisSize, NodeSize } from '../document/types';

/**
 * `fill` is `flex-1` on the main axis and `self-stretch` on the cross axis,
 * but a node does not know its parent's direction here — so `fill` emits both
 * and lets flexbox pick. A fixed size emits an arbitrary-value utility.
 */
export function sizeClasses(size: NodeSize, parentDirection: 'vertical' | 'horizontal'): string {
  const classes: string[] = [];
  const main: AxisSize = parentDirection === 'horizontal' ? size.width : size.height;
  const cross: AxisSize = parentDirection === 'horizontal' ? size.height : size.width;
  const crossAxis = parentDirection === 'horizontal' ? 'h' : 'w';

  if (main === 'fill') classes.push('flex-1', parentDirection === 'horizontal' ? 'min-w-0' : 'min-h-0');
  else if (typeof main === 'number') classes.push(parentDirection === 'horizontal' ? `w-[${main}px]` : `h-[${main}px]`);

  if (cross === 'fill') classes.push(parentDirection === 'horizontal' ? 'self-stretch' : 'w-full');
  else if (typeof cross === 'number') classes.push(`${crossAxis}-[${cross}px]`);

  return classes.join(' ');
}

export function layoutClasses(layout: FrameLayout, isRoot: boolean): string {
  const classes = ['flex', layout.direction === 'vertical' ? 'flex-col' : 'flex-row'];
  if (layout.gap) classes.push(`gap-${spacing(layout.gap)}`);
  if (layout.padding) classes.push(`p-${spacing(layout.padding)}`);
  if (ALIGN[layout.align]) classes.push(ALIGN[layout.align]);
  if (JUSTIFY[layout.justify]) classes.push(JUSTIFY[layout.justify]);
  if (layout.wrap) classes.push('flex-wrap');
  classes.push(...BACKGROUND[layout.background]);
  if (layout.radius) classes.push(radius(layout.radius));
  if (isRoot) classes.push('w-full', 'max-w-md');
  return classes.join(' ');
}
