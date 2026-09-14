import { getComponent } from '../registry/catalogue';
import { isColourProp, isIconSlot, isTextSlot } from '../registry/catalogue';
import { literal } from '../i18n/catalog';
import type { ComponentNode, FrameLayout, FrameNode, PropBag } from './types';
import { ROOT_ID } from './types';

/**
 * Content a component needs to be worth looking at the moment it lands on the
 * canvas. Required props alone are not enough: `children` on a Button is
 * optional to the type system and mandatory to a human.
 */
const STARTER_CONTENT: Record<string, string> = {
  children: 'Label',
  label: 'Label',
  title: 'Title',
  description: 'Supporting text',
  placeholder: 'Text',
  initials: 'NN',
  name: 'Nili',
  fileName: 'document.pdf',
  hint: '',
  error: '',
  sublabel: '',
};

/** Components whose starter text should read as themselves rather than 'Label'. */
const STARTER_OVERRIDES: Record<string, Record<string, string | number | boolean>> = {
  Button: { children: 'Button' },
  FancyButton: { children: 'Button' },
  LinkButton: { children: 'Link' },
  CompactButton: { 'aria-label': 'Action' },
  Alert: { title: 'Something happened', description: 'A short explanation of what and why.' },
  Banner: { title: 'Something happened' },
  EmptyState: { title: 'Nothing here yet', description: 'Add your first item to get started.' },
  Badge: { children: 'Badge' },
  Tag: { children: 'Tag' },
  Typography: { children: 'The quick brown fox' },
  ContentDivider: { children: 'or' },
  TextInput: { label: 'Label', placeholder: 'Placeholder' },
  TextArea: { label: 'Label', placeholder: 'Placeholder' },
  Checkbox: { label: 'Option' },
  Radio: { label: 'Option' },
  Switch: { label: 'Option' },
  ProgressBar: { label: 'Progress', value: 60 },
  ProgressCircle: { value: 60 },
  Rating: { value: 3 },
  Slider: { value: 40 },
  Pagination: { count: 8, page: 1 },
  Avatar: { initials: 'NN', name: 'Nili' },
  FlatAvatar: { initials: 'NN', name: 'Nili' },
  Accordion: { title: 'Section title' },
  ContentCard: { title: 'Card title' },
  ContentLabel: { title: 'Label' },
  ActivityFeedItem: { title: 'Activity' },
  FilterChip: { children: 'Filter' },
  BreadcrumbItem: { children: 'Page' },
  Icon: { icon: 'star-line' },
};

let counter = 0;
export const nextId = (): string => `n${++counter}`;
/** Restores the counter after loading a document so ids stay unique. */
export const seedIdCounter = (value: number): void => {
  counter = Math.max(counter, value);
};

export const defaultLayout = (): FrameLayout => ({
  direction: 'vertical',
  gap: 16,
  padding: 0,
  radius: 0,
  align: 'stretch',
  justify: 'start',
  background: 'none',
  wrap: false,
});

export function createFrame(layout: Partial<FrameLayout> = {}, children: FrameNode['children'] = []): FrameNode {
  return { id: nextId(), kind: 'frame', className: '', size: { width: 'fill', height: 'hug' }, layout: { ...defaultLayout(), ...layout }, children };
}

export function createRoot(children: FrameNode['children']): FrameNode {
  const frame = createFrame({ gap: 24, padding: 32, radius: 16, background: 'surface' }, children);
  return { ...frame, id: ROOT_ID };
}

/**
 * Defaults come from the registry, so a component picks up a new variant's
 * default the moment the library declares one.
 */
export function defaultProps(component: string): PropBag {
  const { meta, hidden } = getComponent(component);
  const props: PropBag = {};
  for (const [key, prop] of Object.entries(meta.props)) {
    if (hidden.has(key)) continue;
    if (prop.default !== undefined) {
      props[key] = prop.default;
      continue;
    }
    if (isIconSlot(key) || isColourProp(key, prop.control)) props[key] = '';
    else if (prop.control === 'boolean') props[key] = false;
    else if (prop.control === 'number') props[key] = 0;
    else if (prop.control === 'text' || (prop.control === 'slot' && isTextSlot(key))) {
      props[key] = literal(STARTER_CONTENT[key] ?? (prop.required ? component : ''));
    }
  }

  for (const [key, value] of Object.entries(STARTER_OVERRIDES[component] ?? {})) {
    if (!(key in meta.props) || hidden.has(key)) continue;
    const control = meta.props[key]?.control;
    props[key] =
      control === 'number' || control === 'boolean' || isIconSlot(key) ? value : literal(String(value));
  }
  return props;
}

export function createComponent(component: string, overrides: PropBag = {}): ComponentNode {
  return {
    id: nextId(),
    kind: 'component',
    component,
    className: '',
    size: { width: 'hug', height: 'hug' },
    props: { ...defaultProps(component), ...overrides },
  };
}
