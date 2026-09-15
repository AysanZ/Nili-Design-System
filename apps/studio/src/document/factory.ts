import { getComponent } from '../registry/catalogue';
import { isColourProp, isIconSlot, isTextSlot } from '../registry/catalogue';
import { literal } from '../i18n/catalog';
import { nextId } from './ids';
import { toComponentName } from '../logic/scope';
import type { ComponentNode, DocNode, FrameLayout, FrameNode, ComponentDef, ComponentId, PropBag } from './types';
import { DEFAULT_WIDTH, rootIdFor } from './types';

/**
 * Content a component needs to be worth looking at the moment it lands on the
 * canvas. Required props alone are not enough: `children` on a Button is
 * optional to the type system and mandatory to a human.
 */
export const STARTER_CONTENT: Record<string, string> = {
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
export const STARTER_OVERRIDES: Record<string, Record<string, string | number | boolean>> = {
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
  Pagination: { count: 8, component: 1 },
  Avatar: { initials: 'NN', name: 'Nili' },
  FlatAvatar: { initials: 'NN', name: 'Nili' },
  Accordion: { title: 'Section title' },
  ContentCard: { title: 'Card title' },
  ContentLabel: { title: 'Label' },
  ActivityFeedItem: { title: 'Activity' },
  FilterChip: { children: 'Filter' },
  BreadcrumbItem: { children: 'ComponentDef' },
  Icon: { icon: 'star-line' },
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

export function createRoot(pageId: ComponentId, children: FrameNode['children'] = []): FrameNode {
  const frame = createFrame({ gap: 24, padding: 32, radius: 16, background: 'surface' }, children);
  return { ...frame, id: rootIdFor(pageId) };
}

/**
 * A component is created around its id rather than given one afterwards,
 * because the root node's id is derived from it and the two must never drift.
 */
/** A hole in the component, named after the property it reads. */
export function createSlot(name: string, children: FrameNode['children'] = []): DocNode {
  return {
    id: nextId(),
    kind: 'slot',
    name,
    className: '',
    size: { width: 'fill', height: 'hug' },
    children,
  };
}

export function createComponentDef(
  name: string,
  options: Partial<Omit<ComponentDef, 'id' | 'root'>> = {},
): ComponentDef {
  const id = nextId();
  return {
    id,
    name,
    component: options.component ?? toComponentName(name),
    root: createRoot(id, []),
    x: options.x ?? 0,
    y: options.y ?? 0,
    width: options.width ?? DEFAULT_WIDTH,
    params: options.params ?? [],
  };
}

/**
 * Defaults come from the registry, so a component picks up a new variant's
 * default the moment the library declares one.
 */
/**
 * Which slot gets the starter text, in order of preference.
 *
 * Filling every text slot was the obvious thing and produced nonsense: a
 * ProgressCircle has both `label` and `children`, so a freshly dropped one
 * said "Label" twice — once beside the ring and once inside it — and both
 * reached the generated file. One component, one piece of starter copy.
 */
const PRIMARY_SLOTS = ['children', 'label', 'title', 'placeholder'];

/** Components where the first slot in that order is not the right one. */
const PRIMARY_OVERRIDE: Record<string, string> = {
  // `children` on a progress ring is the content *inside* the circle, which is
  // the percentage — not somewhere to put a caption.
  ProgressCircle: 'label',
  ProgressBar: 'label',
  Avatar: 'name',
  FlatAvatar: 'label',
};

function primarySlotOf(
  component: string,
  meta: { props: Record<string, unknown> },
  hidden: ReadonlySet<string>,
): string | null {
  const override = PRIMARY_OVERRIDE[component];
  if (override && override in meta.props && !hidden.has(override)) return override;
  return PRIMARY_SLOTS.find((key) => key in meta.props && !hidden.has(key)) ?? null;
}

export function defaultProps(component: string): PropBag {
  const { meta, hidden } = getComponent(component);
  const props: PropBag = {};
  const primary = primarySlotOf(component, meta, hidden);
  for (const [key, prop] of Object.entries(meta.props)) {
    if (hidden.has(key)) continue;
    if (prop.default !== undefined) {
      props[key] = prop.default;
      continue;
    }
    if (isIconSlot(key) || isColourProp(key, prop.control)) props[key] = '';
    /* Nothing is seeded that the registry did not declare a default for.
     *
     * `false` looks like the absence of a flag and is not: a component whose
     * own default is computed — `latin ?? preset.latin ?? false` on TextInput
     * — sees an explicit `false` and stops consulting the preset. That is how
     * an email field lost its left-to-right direction and rendered a Latin
     * address as though it were Persian. The same reasoning retired the
     * zero-seeding of numbers, and it is the same rule: a design tool may
     * report what someone chose, never assert what nobody said. */
    else if (prop.control === 'text' || (prop.control === 'slot' && isTextSlot(key))) {
      const starter = key === primary || prop.required ? STARTER_CONTENT[key] ?? (prop.required ? component : '') : '';
      props[key] = literal(starter);
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
