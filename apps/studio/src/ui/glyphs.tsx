import type { ReactNode } from 'react';
import type { DocNode } from '../document/types';
import { isFrame } from '../document/types';

/**
 * Two glyph sets, one geometry.
 *
 * The Insert panel used to be a flat list, and the comment defending it was
 * right about the thing it argued against: forty-five *renders* of real
 * components are forty-five different shapes, and the eye has to parse each
 * one before it reaches a name. These are the opposite — every glyph lives in
 * the same 74×30 box at the same stroke weight, so only the arrangement
 * differs. That is what makes a grid scannable where a wall of thumbnails is
 * not, and it is the same trick every toolbar icon set uses.
 */

const BOX = { viewBox: '0 0 74 30', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** A muted bar — the stand-in for text throughout the set. */
const t = (x: number, y: number, w: number, h = 4): ReactNode => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} opacity={0.5} />
);

/** A solid bar, for text that sits on a filled surface. */
const solid = (x: number, y: number, w: number, h = 3.5, opacity = 0.75): ReactNode => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="currentColor" stroke="none" opacity={opacity} />
);

const fill = (x: number, y: number, w: number, h: number, r: number, opacity = 0.16): ReactNode => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill="currentColor" stroke="none" opacity={opacity} />
);

/* Written out one by one rather than generated: a glyph is a drawing, and the
   point of each is to say what the component *is* at a glance. */
const GLYPHS: Record<string, ReactNode> = {
  __slot: <>
    <path d="M22 5h-6v20h6M52 5h6v20h-6" />
    <path d="M37 11v8" opacity={0.45} strokeDasharray="3 3" />
    <path d="M32 15h10" opacity={0.45} strokeDasharray="3 3" />
  </>,

  __frame: <>
    <rect x={9} y={5} width={56} height={20} rx={3} strokeDasharray="3 2.6" />
    <path d="M23 5v20M47 5v20" opacity={0.35} strokeDasharray="3 2.6" />
  </>,

  /* Actions */
  Button: <>{fill(12, 8, 50, 14, 5)}<rect x={12} y={8} width={50} height={14} rx={5} />{solid(27, 13.5, 20)}</>,
  FancyButton: <>{fill(12, 8, 50, 14, 5, 0.26)}<rect x={12} y={8} width={50} height={14} rx={5} /><path d="M18 8v14" opacity={0.4} />{solid(29, 13.5, 18)}</>,
  LinkButton: <>{solid(22, 13, 30, 3.5, 0.8)}<path d="M22 20h30" opacity={0.45} /></>,
  CompactButton: <><rect x={28} y={7} width={18} height={16} rx={5} /><path d="M33.5 15h7M37 11.5v7" /></>,

  /* Forms */
  TextInput: <>{t(8, 4, 24)}<rect x={8} y={11} width={58} height={14} rx={4} />{t(14, 16, 18, 3.5)}</>,
  TextArea: <>{t(8, 3, 22)}<rect x={8} y={9} width={58} height={17} rx={4} />{t(14, 14, 32, 3)}{t(14, 19, 20, 3)}</>,
  DigitInput: <>{[0, 1, 2, 3].map((i) => <rect key={i} x={12 + i * 13} y={8} width={10} height={14} rx={3} />)}<path d="M16 15h2M29 15h2M42 15h2" opacity={0.6} /></>,
  InlineInput: <><path d="M10 22h54" opacity={0.55} />{t(10, 11, 26, 4)}<path d="M40 9v13" /></>,
  TagInput: <><rect x={8} y={8} width={58} height={15} rx={4} /><rect x={12} y={12} width={16} height={7} rx={3.5} opacity={0.6} /><rect x={31} y={12} width={12} height={7} rx={3.5} opacity={0.6} /><path d="M48 15.5h6" opacity={0.5} /></>,
  CounterInput: <><rect x={12} y={8} width={50} height={14} rx={4} /><path d="M18 15h5M51 15h5M53.5 12.5v5" />{solid(33, 13.5, 8)}</>,
  Checkbox: <><rect x={9} y={9} width={12} height={12} rx={3.5} /><path d="M12.4 15l2.4 2.4 4.4-4.8" />{t(27, 13, 34)}</>,
  Radio: <><circle cx={15} cy={15} r={6} /><circle cx={15} cy={15} r={2.4} fill="currentColor" stroke="none" />{t(27, 13, 34)}</>,
  RadioCard: <><rect x={8} y={5} width={58} height={20} rx={4} /><circle cx={17} cy={15} r={4.4} /><circle cx={17} cy={15} r={1.8} fill="currentColor" stroke="none" />{t(27, 10, 28, 3.5)}{t(27, 17, 18, 3)}</>,
  Switch: <><rect x={9} y={9} width={22} height={12} rx={6} /><circle cx={25} cy={15} r={3.6} fill="currentColor" stroke="none" />{t(37, 13, 26)}</>,
  Slider: <><path d="M9 15h56" opacity={0.4} /><path d="M9 15h28" /><circle cx={37} cy={15} r={4.4} fill="currentColor" stroke="none" opacity={0.85} /></>,
  Rating: <>{[0, 1, 2, 3, 4].map((i) => (
    <path key={i} d={`M${16 + i * 11} 10.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z`} opacity={i < 3 ? 1 : 0.35} />
  ))}</>,
  ColorPicker: <><circle cx={37} cy={15} r={9} /><path d="M37 6a9 9 0 000 18 4.5 4.5 0 000-9 4.5 4.5 0 010-9z" /></>,
  DatePicker: <><rect x={19} y={6} width={36} height={19} rx={3} /><path d="M19 12h36M27 4v4M47 4v4" opacity={0.65} /><circle cx={29} cy={18} r={1.6} fill="currentColor" stroke="none" /><circle cx={37} cy={18} r={1.6} fill="currentColor" stroke="none" /></>,
  FileUploadCard: <><rect x={12} y={5} width={50} height={20} rx={4} strokeDasharray="3.4 2.6" /><path d="M37 19v-9M33 13.5l4-4 4 4" /></>,
  ToggleGroup: <><rect x={12} y={8} width={50} height={14} rx={4} />{fill(13.5, 9.5, 16, 11, 3)}<path d="M29.5 8v14M45.5 8v14" opacity={0.5} /></>,

  /* Feedback */
  Alert: <>{fill(8, 5, 58, 20, 4)}<rect x={8} y={5} width={58} height={20} rx={4} /><circle cx={19} cy={15} r={4.2} />{t(28, 10, 30, 3.5)}{t(28, 17, 20, 3)}</>,
  Banner: <>{fill(4, 8, 66, 14, 3)}<rect x={4} y={8} width={66} height={14} rx={3} />{t(12, 13, 34, 4)}<path d="M60 12l5 6M65 12l-5 6" opacity={0.6} /></>,
  ProgressBar: <><path d="M9 15h56" opacity={0.35} strokeWidth={4} strokeLinecap="round" /><path d="M9 15h34" strokeWidth={4} strokeLinecap="round" /></>,
  ProgressCircle: <><circle cx={37} cy={15} r={9} opacity={0.3} /><path d="M37 6a9 9 0 017.8 4.5" strokeWidth={2.2} /></>,
  EmptyState: <><rect x={22} y={4} width={30} height={14} rx={3} strokeDasharray="3 2.6" />{t(26, 21, 22, 3.5)}</>,
  PasswordStrength: <><path d="M14 18h11M29 18h11M44 18h11" strokeWidth={3} strokeLinecap="round" /><path d="M44 18h11" opacity={0.3} strokeWidth={3} />{t(14, 8, 20, 3.5)}</>,
  HintText: <><circle cx={16} cy={15} r={4} />{t(25, 13, 34)}</>,

  /* Data display */
  Badge: <>{fill(24, 10, 26, 11, 5.5, 0.22)}<rect x={24} y={10} width={26} height={11} rx={5.5} />{solid(31, 14, 12, 3)}</>,
  StatusBadge: <>{fill(22, 10, 30, 11, 5.5, 0.22)}<rect x={22} y={10} width={30} height={11} rx={5.5} /><circle cx={29} cy={15.5} r={2.2} fill="currentColor" stroke="none" />{solid(34, 14, 12, 3)}</>,
  Tag: <><path d="M26 8h16l8 7.5-8 7.5H26z" /><circle cx={32} cy={15.5} r={1.8} fill="currentColor" stroke="none" /></>,
  Avatar: <><circle cx={18} cy={15} r={8} /><circle cx={18} cy={12.4} r={2.8} opacity={0.7} /><path d="M12.6 21.4a6 6 0 0110.8 0" opacity={0.7} />{t(32, 10, 28, 3.5)}{t(32, 17, 18, 3)}</>,
  FlatAvatar: <><circle cx={37} cy={15} r={9} />{fill(28, 15, 18, 9, 0)}<circle cx={33.6} cy={13} r={1.2} fill="currentColor" stroke="none" /><circle cx={40.4} cy={13} r={1.2} fill="currentColor" stroke="none" /></>,
  ContentCard: <><rect x={8} y={4} width={58} height={22} rx={4} /><circle cx={19} cy={15} r={5} opacity={0.6} />{t(29, 10, 28, 3.5)}{t(29, 17, 18, 3)}</>,
  ContentLabel: <><circle cx={15} cy={15} r={5} opacity={0.6} />{t(25, 10, 32, 3.5)}{t(25, 17, 20, 3)}</>,
  Label: <>{t(14, 13, 30, 4)}<path d="M48 15h4" opacity={0.55} /></>,
  ChartLegend: <><circle cx={14} cy={11} r={2.6} fill="currentColor" stroke="none" opacity={0.8} />{t(21, 9, 20, 3.5)}<circle cx={14} cy={20} r={2.6} fill="currentColor" stroke="none" opacity={0.4} />{t(21, 18, 26, 3.5)}</>,
  Accordion: <><rect x={8} y={4} width={58} height={10} rx={3} />{t(14, 7.5, 22, 3.5)}<path d="M56 7.6l2.6 2.6 2.6-2.6" opacity={0.7} /><path d="M8 19h58M8 24h40" opacity={0.4} /></>,
  ActivityFeedItem: <><circle cx={15} cy={9} r={3.4} /><path d="M15 13.6V26" opacity={0.4} />{t(24, 6, 30, 3.5)}{t(24, 13, 20, 3)}</>,
  FilterChip: <><rect x={18} y={9} width={38} height={13} rx={6.5} strokeDasharray="0" /><path d="M24 13h8M26 15.8h4" opacity={0.7} />{solid(38, 14, 12, 3)}</>,

  /* Navigation */
  Pagination: <>{[0, 1, 2, 3].map((i) => <rect key={i} x={19 + i * 10} y={10} width={8} height={11} rx={3} opacity={i === 1 ? 1 : 0.45} />)}<path d="M12 15.5h3M59 15.5h3" opacity={0.6} /></>,
  BreadcrumbItem: <>{t(9, 13, 16)}<path d="M29 12l3 3.5-3 3.5" opacity={0.6} />{t(36, 13, 14)}<path d="M53 12l3 3.5-3 3.5" opacity={0.6} /></>,

  /* Primitives */
  Typography: <>{t(9, 6, 48, 4)}{t(9, 14, 56, 3.5)}{t(9, 21, 34, 3.5)}</>,
  ContentDivider: <><path d="M8 15h20M46 15h20" opacity={0.5} />{solid(33, 13.5, 8, 3, 0.7)}</>,
  Icon: <><path d="M37 7.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" /></>,
};

const FALLBACK: ReactNode = <><rect x={16} y={6} width={42} height={18} rx={4} opacity={0.55} />{t(24, 13, 26, 3.5)}</>;

export function ComponentGlyph({ name }: { name: string }): JSX.Element {
  return <svg {...BOX} aria-hidden focusable="false">{GLYPHS[name] ?? FALLBACK}</svg>;
}

/** True when a real drawing exists, so the panel can fall back to initials. */
export const hasGlyph = (name: string): boolean => name in GLYPHS;

/* ─────────────────────────  layers-tree glyphs  ───────────────────────── */

const NODE_BOX = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, width: 13, height: 13 };

/**
 * A node's family, not its exact component. Twelve drawings cover forty-five
 * components because the question the tree answers is "what kind of thing is
 * this", and a finer answer would just be the name again in picture form.
 */
const FAMILY: Record<string, ReactNode> = {
  row: <><rect x={2} y={4} width={4.5} height={8} rx={1} /><rect x={9.5} y={4} width={4.5} height={8} rx={1} /></>,
  column: <><rect x={4} y={2} width={8} height={4.5} rx={1} /><rect x={4} y={9.5} width={8} height={4.5} rx={1} /></>,
  text: <path d="M3 4h10M3 8h7M3 12h9" />,
  input: <><rect x={2} y={5} width={12} height={6} rx={2} /><path d="M5 8h4" opacity={0.6} /></>,
  button: <rect x={2} y={5} width={12} height={6} rx={3} />,
  toggle: <><rect x={2} y={4.5} width={12} height={7} rx={3.5} /><circle cx={10.5} cy={8} r={2} fill="currentColor" stroke="none" /></>,
  media: <><circle cx={8} cy={8} r={5.4} /><circle cx={8} cy={6.4} r={1.8} opacity={0.7} /></>,
  feedback: <><path d="M8 2.6l5.5 9.5h-11z" /><path d="M8 6.6v2.4M8 10.4v.1" /></>,
  progress: <circle cx={8} cy={8} r={5.2} strokeDasharray="20 12" />,
  badge: <rect x={2.5} y={5} width={11} height={6} rx={3} strokeDasharray="0" />,
  empty: <rect x={2.5} y={3} width={11} height={10} rx={2} strokeDasharray="2.4 2" />,
  block: <rect x={2.5} y={3} width={11} height={10} rx={2} />,
  /* A diamond, borrowed from every tool that has ever had symbols. */
  instance: <><path d="M8 2.2l5.8 5.8L8 13.8 2.2 8z" /><path d="M8 5.6L10.4 8 8 10.4 5.6 8z" opacity={0.55} /></>,
  /* A hole with a bracket on each side — what a slot is. */
  slot: <><path d="M5.5 2.5h-3v11h3M10.5 2.5h3v11h-3" /><path d="M8 6v4" opacity={0.5} strokeDasharray="1.6 1.6" /></>,
};

const FAMILY_OF: Record<string, keyof typeof FAMILY> = {
  Typography: 'text', Label: 'text', HintText: 'text', ContentDivider: 'text', BreadcrumbItem: 'text',
  TextInput: 'input', TextArea: 'input', InlineInput: 'input', TagInput: 'input',
  DigitInput: 'input', CounterInput: 'input', DatePicker: 'input', ColorPicker: 'input',
  Button: 'button', FancyButton: 'button', LinkButton: 'button', CompactButton: 'button',
  Pagination: 'button', ToggleGroup: 'button', FilterChip: 'button',
  Checkbox: 'toggle', Radio: 'toggle', Switch: 'toggle', RadioCard: 'toggle', Slider: 'toggle', Rating: 'toggle',
  Avatar: 'media', FlatAvatar: 'media', Icon: 'media',
  Alert: 'feedback', Banner: 'feedback',
  ProgressBar: 'progress', ProgressCircle: 'progress', PasswordStrength: 'progress',
  Badge: 'badge', StatusBadge: 'badge', Tag: 'badge',
  EmptyState: 'empty', FileUploadCard: 'empty',
};

export function NodeGlyph({ node }: { node: DocNode }): JSX.Element {
  const family = node.kind === 'slot'
    ? 'slot'
    : isFrame(node)
      ? node.layout.direction === 'horizontal' ? 'row' : 'column'
      : node.kind === 'instance'
        ? 'instance'
        : FAMILY_OF[node.component] ?? 'block';
  return <svg {...NODE_BOX} aria-hidden focusable="false">{FAMILY[family]}</svg>;
}

/** What the layers list calls a node when it has no name of its own. */
export function defaultLabel(node: DocNode, componentName?: string): string {
  if (node.label) return node.label;
  if (node.kind === 'slot') return node.name;
  if (node.kind === 'instance') return componentName ?? 'Component';
  if (node.kind === 'component') return node.component;
  return node.layout.direction === 'horizontal' ? 'Row' : 'Column';
}
