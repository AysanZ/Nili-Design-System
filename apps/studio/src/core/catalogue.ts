/**
 * What the studio knows about `@nili/ui`, read from `registry/*.json`.
 *
 * Nothing about a component is described twice: variants, options, defaults
 * and docs all come from the generated registry, so adding a variant to a
 * `cva` makes it appear in the inspector after `npm run registry` with no file
 * in this app being touched. What lives here is only the editorial layer — how
 * to group them, and which props a visual editor has no business showing.
 */

export type ControlKind =
  | 'select'
  | 'boolean'
  | 'text'
  | 'number'
  | 'slot'
  | 'boolean-or-slot'
  | 'handler'
  | 'list'
  | 'none';

export interface PropMeta {
  type: string;
  required: boolean;
  doc: string | null;
  control: ControlKind;
  options?: string[];
  default?: string | number | boolean;
  source?: 'cva' | 'cva:sibling' | 'dom' | 'types';
}

export interface ComponentMeta {
  name: string;
  exported: boolean;
  variants: Record<string, string[]>;
  defaultVariants: Record<string, string | number | boolean | undefined>;
  extends: string[];
  props: Record<string, PropMeta>;
}

interface RegistryEntry {
  dir: string;
  name: string;
  components: ComponentMeta[];
}

/** How a prop is edited in the studio, which is not always how it is typed. */
export type Editor =
  | 'select'
  | 'boolean'
  | 'text'
  | 'number'
  | 'icon'
  | 'color'
  | 'children'
  | 'list'
  | 'action';

export interface StudioProp {
  key: string;
  editor: Editor;
  meta: PropMeta;
  group: PropGroup;
}

export type PropGroup = 'variant' | 'content' | 'state' | 'events' | 'a11y';

export interface LibComponent {
  name: string;
  dir: string;
  category: string;
  meta: ComponentMeta;
  /** Editable props, already ordered and grouped. */
  props: StudioProp[];
  /** True when the component renders whatever is nested inside it. */
  takesChildren: boolean;
  /** Props that must be present for the component to render at all. */
  required: string[];
}

const entries = import.meta.glob<RegistryEntry>('../../../../registry/*.json', {
  eager: true,
  import: 'default',
});

const CATEGORY: Record<string, string> = {
  button: 'Actions',
  'quick-actions': 'Actions',
  'text-input': 'Forms',
  'text-area': 'Forms',
  checkbox: 'Forms',
  radio: 'Forms',
  switch: 'Forms',
  slider: 'Forms',
  rating: 'Forms',
  'color-picker': 'Forms',
  'date-picker': 'Forms',
  'file-upload': 'Forms',
  toggle: 'Forms',
  dropdown: 'Forms',
  filter: 'Forms',
  alert: 'Feedback',
  banner: 'Feedback',
  'progress-bar': 'Feedback',
  'empty-state': 'Feedback',
  tooltip: 'Feedback',
  badge: 'Display',
  tag: 'Display',
  avatar: 'Display',
  accordion: 'Display',
  'activity-feed': 'Display',
  'key-components': 'Display',
  table: 'Display',
  breadcrumb: 'Navigation',
  pagination: 'Navigation',
  'step-indicator': 'Navigation',
  tabs: 'Navigation',
  typography: 'Primitives',
  icon: 'Primitives',
  'content-divider': 'Primitives',
};

/**
 * Components a visual editor cannot author honestly: they own an open/closed
 * state the canvas has no way to hold, or they are internal parts that only
 * make sense inside their parent.
 */
const EXCLUDED = new Set([
  'Modal', 'ModalContent', 'ModalTrigger', 'StatusModal', 'Drawer', 'DrawerContent',
  'DrawerTrigger', 'Tooltip', 'TooltipContent', 'TooltipTrigger', 'Dropdown',
  'ColorSpectrum', 'ColorSlider', 'ColorField', 'VideoPlayer', 'DatePicker',
  'DateRangePicker', 'Calendar', 'Table', 'TableRow', 'TableCell', 'TableHead',
  'TableBody', 'TableHeader', 'Tabs', 'TabsList', 'TabsContent', 'TabsTrigger',
  'Popover', 'PopoverContent', 'PopoverTrigger', 'Portal', 'Slot',
]);

/** Real props, and noise in a design tool. */
const HIDDEN = new Set([
  'className', 'rootClassName', 'fieldClassName', 'rowClassName', 'style', 'asChild',
  'as', 'locale', 'name', 'defaultValue', 'defaultChecked', 'autoComplete', 'htmlType',
  'urgency', 'id', 'key', 'ref', 'tabIndex', 'role', 'onImageError', 'component',
]);

/** `name` is DOM plumbing on a field and the person on an avatar. */
const UNHIDE: Record<string, string[]> = {
  Avatar: ['name'],
  FlatAvatar: ['name'],
  AvatarGroup: ['name'],
};

const ICON_SLOTS = new Set([
  'icon', 'startIcon', 'endIcon', 'startAdornment', 'endAdornment', 'companyIcon',
  'emptyIcon', 'leadingIcon', 'trailingIcon',
]);

const TEXT_SLOTS = new Set([
  'children', 'label', 'sublabel', 'title', 'description', 'hint', 'error',
  'placeholder', 'initials', 'valueLabel', 'badge', 'shortcut', 'caption',
]);

const A11Y = new Set([
  'aria-label', 'dismissLabel', 'loadingLabel', 'informationLabel', 'statusLabel',
  'revealLabel', 'hideLabel', 'incrementLabel', 'decrementLabel', 'strengthLabel',
]);

const COLOUR = new Set(['color', 'fill', 'stroke', 'background', 'backgroundColor']);

export const isIconSlot = (key: string): boolean => ICON_SLOTS.has(key);
export const isTextSlot = (key: string): boolean => TEXT_SLOTS.has(key);

function editorFor(key: string, meta: PropMeta): Editor | null {
  if (key === 'children') return 'children';
  if (ICON_SLOTS.has(key)) return 'icon';
  if (COLOUR.has(key) && meta.control === 'text') return 'color';
  switch (meta.control) {
    case 'select':
      return 'select';
    case 'boolean':
    case 'boolean-or-slot':
      return 'boolean';
    case 'number':
      return 'number';
    case 'text':
      return 'text';
    case 'slot':
      return TEXT_SLOTS.has(key) ? 'text' : null;
    case 'handler':
      return 'action';
    case 'list':
      return 'list';
    default:
      return null;
  }
}

function groupFor(key: string, editor: Editor): PropGroup {
  if (A11Y.has(key)) return 'a11y';
  if (editor === 'action') return 'events';
  if (editor === 'select') return 'variant';
  if (editor === 'boolean') return 'state';
  return 'content';
}

const ORDER: Record<PropGroup, number> = {
  variant: 0,
  content: 1,
  state: 2,
  events: 3,
  a11y: 4,
};

/**
 * Events a component inherits from the element it spreads onto.
 *
 * The registry lists a component's own props, and `onChange` on a `TextInput`
 * is not one of them — it arrives through `ComponentPropsWithoutRef<'input'>`.
 * A visual editor that cannot bind the most important prop on a field is not
 * finished, so the extends clause is read and the standard handlers are put
 * back.
 */
const DOM_EVENTS: Record<string, string[]> = {
  button: ['onClick', 'onFocus', 'onBlur'],
  input: ['onChange', 'onFocus', 'onBlur'],
  textarea: ['onChange', 'onFocus', 'onBlur'],
  select: ['onChange', 'onFocus', 'onBlur'],
  a: ['onClick'],
  div: ['onClick'],
  span: ['onClick'],
  li: ['onClick'],
  form: ['onSubmit'],
};

function inheritedEvents(meta: ComponentMeta): string[] {
  const tags = new Set<string>();
  for (const clause of meta.extends ?? []) {
    for (const match of clause.matchAll(/ComponentProps(?:WithoutRef|WithRef)?<'([a-z]+)'/g)) {
      tags.add(match[1]);
    }
  }
  const events = new Set<string>();
  for (const tag of tags) for (const event of DOM_EVENTS[tag] ?? []) events.add(event);
  return [...events];
}

function build(): Map<string, LibComponent> {
  const out = new Map<string, LibComponent>();

  for (const entry of Object.values(entries)) {
    if (!entry || !('dir' in entry) || !Array.isArray(entry.components)) continue;
    const category = CATEGORY[entry.dir] ?? 'Other';

    for (const meta of entry.components) {
      if (!meta.exported || EXCLUDED.has(meta.name)) continue;
      const unhide = new Set(UNHIDE[meta.name] ?? []);

      const props: StudioProp[] = [];
      for (const [key, prop] of Object.entries(meta.props)) {
        if (HIDDEN.has(key) && !unhide.has(key)) continue;
        const editor = editorFor(key, prop);
        if (!editor || editor === 'children') continue;
        props.push({ key, editor, meta: prop, group: groupFor(key, editor) });
      }
      for (const event of inheritedEvents(meta)) {
        if (props.some((prop) => prop.key === event)) continue;
        props.push({
          key: event,
          editor: 'action',
          group: 'events',
          meta: { type: '() => void', required: false, doc: null, control: 'handler', source: 'dom' },
        });
      }
      props.sort((a, b) => ORDER[a.group] - ORDER[b.group]);

      const childrenProp = meta.props.children;
      out.set(meta.name, {
        name: meta.name,
        dir: entry.dir,
        category,
        meta,
        props,
        takesChildren: Boolean(childrenProp) && childrenProp.control === 'slot',
        required: Object.entries(meta.props)
          .filter(([, p]) => p.required)
          .map(([k]) => k),
      });
    }
  }
  return out;
}

export const CATALOGUE = build();

export function lib(name: string): LibComponent | undefined {
  return CATALOGUE.get(name);
}

export function byCategory(): [string, LibComponent[]][] {
  const order = ['Actions', 'Forms', 'Feedback', 'Display', 'Navigation', 'Primitives', 'Other'];
  const groups = new Map<string, LibComponent[]>();
  for (const component of CATALOGUE.values()) {
    const list = groups.get(component.category) ?? [];
    list.push(component);
    groups.set(component.category, list);
  }
  for (const list of groups.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return [...groups.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}

/**
 * A cva variant key can be a number; a JSON object key cannot.
 *
 * `size: { 80: … }` types the prop as `80 | 72`, but the registry is JSON, so
 * the options come back as strings. The document stores what a `<select>`
 * gives you and this converts it back at the two places the real type matters:
 * rendering, where a string key silently misses the variant, and code
 * generation, where `size="40"` does not compile.
 */
export function coerce(value: unknown, prop: Pick<PropMeta, 'default' | 'options'>): unknown {
  if (typeof value !== 'string' || !/^-?\d+(\.\d+)?$/.test(value)) return value;
  const numeric =
    typeof prop.default === 'number' ||
    (prop.default === undefined &&
      Boolean(prop.options?.length) &&
      prop.options!.every((option) => /^-?\d+(\.\d+)?$/.test(option)));
  return numeric ? Number(value) : value;
}

/** Enough content for a palette thumbnail to look like the component. */
export const PREVIEW: Record<string, Record<string, unknown>> = {
  Avatar: { name: 'Nili', initials: 'NN' },
  FlatAvatar: { name: 'Nili', initials: 'NN' },
  AvatarGroup: { items: [{ name: 'A' }, { name: 'B' }] },
  CompactAvatarGroup: { items: [{ name: 'A' }, { name: 'B' }] },
  ProgressBar: { value: 60 },
  ProgressCircle: { value: 60 },
  Rating: { value: 3 },
  Slider: { value: 40 },
  Pagination: { count: 6, page: 1 },
  PasswordStrength: { level: 'good' },
  FileUploadCard: { fileName: 'report.pdf' },
  FileFormatIcon: { fileName: 'report.pdf' },
  CounterInput: { incrementLabel: 'More', decrementLabel: 'Less' },
  Toggle: { value: 'one' },
  ToggleGroup: { value: 'one' },
  ColorDot: { 'aria-label': 'Colour' },
  Accordion: { title: 'Title' },
  Alert: { title: 'Title' },
  Banner: { title: 'Title' },
  ActivityFeedItem: { title: 'Title' },
  EmptyState: { title: 'Nothing here yet' },
  ContentCard: { title: 'Title' },
  ContentLabel: { title: 'Title' },
  KeyIcon: { children: 'K' },
  Breadcrumb: { children: 'Home' },
  ButtonGroup: { children: 'Group' },
  StepIndicator: { children: 'Step' },
};

/** Generic sample content, by prop name, for anything not listed above. */
export const SAMPLE_CONTENT: Record<string, unknown> = {
  children: 'Label',
  label: 'Label',
  title: 'Title',
  description: 'Description',
  placeholder: 'Placeholder',
  hint: 'Hint text',
  value: undefined,
};
