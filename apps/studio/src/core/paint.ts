import type { CSSProperties } from 'react';
import type { Axis, BoxStyle, Layout, RadiusToken, SurfaceToken } from './model';

/**
 * One layout model, painted two ways.
 *
 * The canvas gets inline styles and the export gets Tailwind classes. That is
 * not duplication for its own sake: Tailwind generates the classes it can see
 * in source files, so a class name assembled at runtime would exist in the
 * export and do nothing on the canvas. Keeping both here means the two can
 * never drift apart unnoticed.
 */

export const SURFACES: Record<SurfaceToken, { css: string; tw: string; label: string }> = {
  none: { css: 'transparent', tw: '', label: 'None' },
  white: { css: 'var(--nili-white-0)', tw: 'bg-white-0', label: 'White' },
  weak: { css: 'var(--nili-weak-50)', tw: 'bg-weak-50', label: 'Weak' },
  soft: { css: 'var(--nili-soft-200)', tw: 'bg-soft-200', label: 'Soft' },
  strong: { css: 'var(--nili-strong-950)', tw: 'bg-strong-950', label: 'Strong' },
  primary: { css: 'var(--nili-primary-base)', tw: 'bg-primary-base', label: 'Primary' },
  'primary-lighter': {
    css: 'var(--nili-primary-alpha-10)',
    tw: 'bg-primary-alpha-10',
    label: 'Primary tint',
  },
  'error-lighter': { css: 'var(--nili-error-lighter)', tw: 'bg-error-lighter', label: 'Error tint' },
  'success-lighter': {
    css: 'var(--nili-success-lighter)',
    tw: 'bg-success-lighter',
    label: 'Success tint',
  },
  'warning-lighter': {
    css: 'var(--nili-warning-lighter)',
    tw: 'bg-warning-lighter',
    label: 'Warning tint',
  },
};

export const RADII: Record<RadiusToken, { css: string; tw: string }> = {
  none: { css: '0', tw: '' },
  xs: { css: 'var(--nili-radius-xs)', tw: 'rounded-xs' },
  sm: { css: 'var(--nili-radius-sm)', tw: 'rounded-sm' },
  md: { css: 'var(--nili-radius-md)', tw: 'rounded-md' },
  lg: { css: 'var(--nili-radius-lg)', tw: 'rounded-lg' },
  xl: { css: 'var(--nili-radius-xl)', tw: 'rounded-xl' },
  '2xl': { css: 'var(--nili-radius-2xl)', tw: 'rounded-2xl' },
  full: { css: '9999px', tw: 'rounded-full' },
};

const ALIGN: Record<Layout['align'], string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY: Record<Layout['justify'], string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

const ALIGN_TW: Record<Layout['align'], string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const JUSTIFY_TW: Record<Layout['justify'], string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

const SHADOW_TW: Record<BoxStyle['shadow'], string> = {
  none: '',
  sm: 'shadow-xs',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const SHADOW_CSS: Record<BoxStyle['shadow'], string> = {
  none: 'none',
  sm: 'var(--nili-shadow-xs)',
  md: 'var(--nili-shadow-md)',
  lg: 'var(--nili-shadow-lg)',
};

/** Tailwind's spacing scale is 4px; anything off it becomes an arbitrary value. */
const space = (prefix: string, px: number): string =>
  px === 0 ? '' : px % 4 === 0 ? `${prefix}-${px / 4}` : `${prefix}-[${px}px]`;

export function layoutStyle(layout: Layout): CSSProperties {
  const [top, right, bottom, left] = layout.padding;
  return {
    display: 'flex',
    flexDirection: layout.dir === 'row' ? 'row' : 'column',
    gap: layout.gap,
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
    alignItems: ALIGN[layout.align],
    justifyContent: JUSTIFY[layout.justify],
    flexWrap: layout.wrap ? 'wrap' : 'nowrap',
  };
}

export function boxStyle(style: BoxStyle, parent: Layout['dir']): CSSProperties {
  return {
    background: SURFACES[style.background].css,
    borderRadius: RADII[style.radius].css,
    border:
      style.border === 'none'
        ? undefined
        : `1px solid ${style.border === 'soft' ? 'var(--nili-soft-200)' : 'var(--nili-strong-950)'}`,
    boxShadow: SHADOW_CSS[style.shadow],
    ...axisStyle(style.width, 'width', parent),
    ...axisStyle(style.height, 'height', parent),
  };
}

export function axisStyle(
  value: Axis,
  axis: 'width' | 'height',
  parent: Layout['dir'],
): CSSProperties {
  const along = (axis === 'width') === (parent === 'row');
  if (typeof value === 'number') return { [axis]: value, flexShrink: 0 };
  if (value === 'fill') return along ? { flex: '1 1 0%', minWidth: 0 } : { [axis]: '100%' };
  return along ? { flex: '0 0 auto' } : { [axis]: 'auto' };
}

/* ─────────────────────────────  Tailwind  ──────────────────────────── */

export function layoutClasses(layout: Layout): string[] {
  const [top, right, bottom, left] = layout.padding;
  const padding =
    top === right && right === bottom && bottom === left
      ? [space('p', top)]
      : top === bottom && left === right
        ? [space('py', top), space('px', left)]
        : [space('pt', top), space('pr', right), space('pb', bottom), space('pl', left)];

  return [
    'flex',
    layout.dir === 'row' ? 'flex-row' : 'flex-col',
    space('gap', layout.gap),
    ...padding,
    layout.align === 'stretch' ? '' : ALIGN_TW[layout.align],
    layout.justify === 'start' ? '' : JUSTIFY_TW[layout.justify],
    layout.wrap ? 'flex-wrap' : '',
  ].filter(Boolean);
}

export function boxClasses(style: BoxStyle, parent: Layout['dir']): string[] {
  return [
    SURFACES[style.background].tw,
    RADII[style.radius].tw,
    style.border === 'none' ? '' : style.border === 'soft' ? 'border border-soft-200' : 'border border-strong-950',
    SHADOW_TW[style.shadow],
    axisClass(style.width, 'w', parent === 'row'),
    axisClass(style.height, 'h', parent === 'col'),
  ].filter(Boolean);
}

export function axisClass(value: Axis, prefix: 'w' | 'h', along: boolean): string {
  if (typeof value === 'number') return `${prefix}-[${value}px]`;
  if (value === 'fill') return along ? 'flex-1 min-w-0' : `${prefix}-full`;
  return '';
}

export const cx = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');
