import type { ComponentMeta, RegistryEntry, StudioComponent } from './types';

const entries = import.meta.glob<RegistryEntry>('../../../../registry/*.json', {
  eager: true,
  import: 'default',
});

interface Descriptor {
  dir: string;
  component: string;
  category: string;
  /** Tailwind groups this component's variants already control. */
  owns?: readonly string[];
  hidden?: readonly string[];
}

/**
 * Most components paint a surface, a label and a border, so the conflict
 * check starts from that and each descriptor narrows it only where the
 * component genuinely controls less.
 */
const DEFAULT_OWNS = ['bg', 'text', 'border', 'radius', 'padding'] as const;

/**
 * What the canvas can render. The registry knows about 219 components; these
 * are the ones that stand alone without being handed arrays or callbacks,
 * which a visual editor has no way to author yet.
 */
const SUPPORTED: readonly Descriptor[] = [
  // Actions
  { dir: 'button', component: 'Button', category: 'Actions',
    owns: ['bg', 'text', 'border', 'radius', 'height', 'padding', 'width', 'shadow', 'gap', 'font-size'] },
  { dir: 'button', component: 'FancyButton', category: 'Actions',
    owns: ['bg', 'text', 'border', 'radius', 'height', 'padding', 'width', 'shadow'] },
  { dir: 'button', component: 'LinkButton', category: 'Actions', owns: ['text', 'font-size'] },
  { dir: 'button', component: 'CompactButton', category: 'Actions',
    owns: ['bg', 'text', 'border', 'radius', 'width', 'height'] },

  // Forms
  { dir: 'text-input', component: 'TextInput', category: 'Forms',
    owns: ['bg', 'border', 'radius', 'height'], hidden: ['children', 'checked'] },
  { dir: 'text-area', component: 'TextArea', category: 'Forms',
    owns: ['bg', 'border', 'radius'], hidden: ['children', 'checked'] },
  { dir: 'text-input', component: 'DigitInput', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children'] },
  { dir: 'text-input', component: 'InlineInput', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children'] },
  { dir: 'text-input', component: 'TagInput', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children'] },
  { dir: 'text-input', component: 'CounterInput', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children'] },
  { dir: 'checkbox', component: 'Checkbox', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children', 'placeholder'] },
  { dir: 'radio', component: 'Radio', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children', 'placeholder'] },
  { dir: 'radio', component: 'RadioCard', category: 'Forms', hidden: ['children', 'placeholder'] },
  { dir: 'switch', component: 'Switch', category: 'Forms', owns: ['bg', 'radius'], hidden: ['children', 'placeholder'] },
  { dir: 'slider', component: 'Slider', category: 'Forms', owns: ['bg', 'radius'], hidden: ['children'] },
  { dir: 'rating', component: 'Rating', category: 'Forms', owns: ['text'], hidden: ['children'] },
  { dir: 'color-picker', component: 'ColorPicker', category: 'Forms', hidden: ['children'] },
  { dir: 'date-picker', component: 'DatePicker', category: 'Forms', owns: ['bg', 'border', 'radius'], hidden: ['children'] },
  { dir: 'file-upload', component: 'FileUploadCard', category: 'Forms', hidden: ['children'] },

  // Feedback
  { dir: 'alert', component: 'Alert', category: 'Feedback',
    owns: ['bg', 'text', 'border', 'radius', 'padding', 'gap'] },
  { dir: 'banner', component: 'Banner', category: 'Feedback',
    owns: ['bg', 'text', 'border', 'padding'] },
  { dir: 'progress-bar', component: 'ProgressBar', category: 'Feedback',
    owns: ['bg', 'radius', 'height'], hidden: ['children'] },
  { dir: 'progress-bar', component: 'ProgressCircle', category: 'Feedback', owns: ['text'] },
  { dir: 'empty-state', component: 'EmptyState', category: 'Feedback' },
  { dir: 'key-components', component: 'PasswordStrength', category: 'Feedback', owns: ['bg', 'radius'], hidden: ['children'] },
  { dir: 'key-components', component: 'HintText', category: 'Feedback', owns: ['text', 'font-size'] },

  // Data display
  { dir: 'badge', component: 'Badge', category: 'Data display',
    owns: ['bg', 'text', 'border', 'radius', 'padding', 'font-size'] },
  { dir: 'badge', component: 'StatusBadge', category: 'Data display' },
  { dir: 'tag', component: 'Tag', category: 'Data display', owns: ['bg', 'text', 'border', 'radius', 'padding'] },
  { dir: 'avatar', component: 'Avatar', category: 'Data display',
    owns: ['bg', 'text', 'radius', 'width', 'height', 'font-size'], hidden: ['children'] },
  { dir: 'avatar', component: 'FlatAvatar', category: 'Data display', hidden: ['children'] },
  { dir: 'key-components', component: 'ContentCard', category: 'Data display' },
  { dir: 'key-components', component: 'ContentLabel', category: 'Data display' },
  { dir: 'key-components', component: 'Label', category: 'Data display', owns: ['text', 'font-size'] },
  { dir: 'key-components', component: 'ChartLegend', category: 'Data display' },
  { dir: 'accordion', component: 'Accordion', category: 'Data display' },
  { dir: 'activity-feed', component: 'ActivityFeedItem', category: 'Data display' },
  { dir: 'filter', component: 'FilterChip', category: 'Data display', owns: ['bg', 'text', 'border', 'radius'] },
  { dir: 'pagination', component: 'Pagination', category: 'Navigation', hidden: ['children'] },
  { dir: 'toggle', component: 'ToggleGroup', category: 'Forms', owns: ['bg', 'radius'] },
  { dir: 'breadcrumb', component: 'BreadcrumbItem', category: 'Navigation' },

  // Primitives
  { dir: 'typography', component: 'Typography', category: 'Primitives',
    owns: ['font-size', 'type'], hidden: ['as'] },
  { dir: 'content-divider', component: 'ContentDivider', category: 'Primitives', owns: ['bg', 'padding'] },
  { dir: 'icon', component: 'Icon', category: 'Primitives', owns: ['text'], hidden: ['children'] },
];

/** Editable in code but meaningless, unsafe or noisy in a visual editor. */
const GLOBAL_HIDDEN = new Set([
  'className', 'rootClassName', 'fieldClassName', 'style', 'asChild', 'locale', 'name',
  'defaultValue', 'defaultChecked', 'autoComplete', 'maxLength', 'rows', 'readOnly',
  'src', 'onImageError', 'fallback', 'information', 'required',
]);

/**
 * `<button value>` is a real DOM attribute and a real prop, and it is noise in
 * a design tool. These are hidden when they reach a component through the DOM
 * element rather than through its own interface — which is how `value` stays
 * editable on ProgressBar, where it is the whole point.
 */
const NOISY_DOM_PROPS = new Set(['value', 'checked', 'placeholder', 'disabled']);
const EXPOSE_DOM: Record<string, readonly string[]> = {
  /* `value` used to be hidden here as DOM noise, and it was — right up until
     components got variables. On a controlled input it is now the single most
     important prop on the component, so it comes back for the inputs that
     have one and stays hidden on the components where it is still plumbing. */
  TextInput: ['placeholder', 'disabled', 'value'],
  TextArea: ['placeholder', 'disabled', 'value'],
  InlineInput: ['placeholder', 'disabled', 'value'],
  Checkbox: ['checked', 'disabled'],
  Radio: ['checked', 'disabled'],
  Switch: ['checked', 'disabled'],
  Button: ['disabled'],
  Badge: ['disabled'],
  Tag: ['disabled'],
};

/** Props on `GLOBAL_HIDDEN` that a specific component owns outright. */
const EXPOSE_GLOBAL: Record<string, readonly string[]> = {
  // Avatar's `name` is the person, not a form field — it produces the
  // initials and the accessible name, and a list of people needs to bind it.
  // `src` is on the global hidden list as DOM plumbing. On an avatar it is the
  // picture — which only became worth having once the document could carry one.
  Avatar: ['name', 'src'],
  FlatAvatar: ['name'],
};

const difference = (set: Set<string>, remove: readonly string[]): Set<string> => {
  const out = new Set(set);
  for (const key of remove) out.delete(key);
  return out;
};

function byName(entry: RegistryEntry, name: string): ComponentMeta | undefined {
  return entry.components.find((c) => c.name === name);
}

function build(): Map<string, StudioComponent> {
  const byDir = new Map<string, RegistryEntry>();
  for (const entry of Object.values(entries)) {
    if (entry && typeof entry === 'object' && 'dir' in entry) byDir.set(entry.dir, entry);
  }

  const out = new Map<string, StudioComponent>();
  for (const d of SUPPORTED) {
    const entry = byDir.get(d.dir);
    const meta = entry && byName(entry, d.component);
    if (!entry || !meta) continue;
    const exposed = new Set(EXPOSE_DOM[d.component] ?? []);
    const noisy = Object.entries(meta.props)
      .filter(([key, prop]) => prop.source === 'dom' && NOISY_DOM_PROPS.has(key) && !exposed.has(key))
      .map(([key]) => key);

    out.set(d.component, {
      name: d.component,
      dir: d.dir,
      category: d.category,
      meta,
      owns: d.owns ?? DEFAULT_OWNS,
      hidden: difference(
        new Set([...GLOBAL_HIDDEN, ...noisy, ...(d.hidden ?? [])]),
        EXPOSE_GLOBAL[d.component] ?? [],
      ),
    });
  }
  return out;
}

export const CATALOGUE = build();

export const componentNames = (): string[] => [...CATALOGUE.keys()];

export function getComponent(name: string): StudioComponent {
  const found = CATALOGUE.get(name);
  if (!found) throw new Error(`Component "${name}" is not in the studio catalogue.`);
  return found;
}

export function groupedByCategory(): [string, StudioComponent[]][] {
  const groups = new Map<string, StudioComponent[]>();
  for (const c of CATALOGUE.values()) {
    const list = groups.get(c.category) ?? [];
    list.push(c);
    groups.set(c.category, list);
  }
  return [...groups.entries()];
}

/** Props the inspector shows, in a stable order. */
export type PropGroup = 'variant' | 'content' | 'state' | 'data' | 'a11y';

const A11Y_PROPS = new Set(['aria-label', 'dismissLabel', 'loadingLabel', 'informationLabel', 'statusLabel']);

/**
 * `ReactNode` props that in practice hold a single icon. They are stored as an
 * icon name and turned back into an element by the adapter, so a document
 * stays serialisable — a JSX element cannot be written to JSON.
 */
const ICON_SLOTS = new Set([
  'icon', 'startIcon', 'endIcon', 'startAdornment', 'companyIcon', 'emptyIcon',
]);

export const isIconSlot = (key: string): boolean => ICON_SLOTS.has(key);

/**
 * Free-form colour props. `color` is a variant on most components and a CSS
 * colour on a few, so the control is decided by the prop's type rather than
 * its name: only an unconstrained string gets the colour input.
 */
const COLOUR_PROPS = new Set(['color', 'fill', 'stroke', 'background', 'backgroundColor']);
export const isColourProp = (key: string, control: string): boolean =>
  COLOUR_PROPS.has(key) && control === 'text';
const TEXT_SLOTS = new Set([
  'label', 'hint', 'error', 'title', 'description', 'children',
  'sublabel', 'initials', 'placeholder', 'valueLabel',
]);

export function groupOfProp(key: string, meta: { control: string; source?: string }): PropGroup | null {
  if (A11Y_PROPS.has(key)) return 'a11y';
  if (ICON_SLOTS.has(key)) return 'content';
  if (meta.control === 'boolean') return 'state';
  if (meta.control === 'select') return 'variant';
  if (meta.control === 'text' || meta.control === 'number') return 'content';
  if (meta.control === 'slot' && TEXT_SLOTS.has(key)) return 'content';
  /* A list is authorable — it is JSON, and the studio already edits JSON for
     a property's sample. Dropping these meant `ColorPicker` could not be given
     swatches and `Pagination` could not be given page sizes, which made two
     components look broken rather than unfinished. */
  if (meta.control === 'list') return 'data';
  return null;
}

/**
 * The props this component *has* and the inspector cannot offer.
 *
 * Named rather than hidden. A composite slot — `Alert`'s actions, an
 * `Accordion`'s content — takes an element, and the studio has no way to author
 * one inside a library component's prop. Saying so is the difference between
 * a tool with a known edge and a tool that looks like it forgot.
 */
export function unauthorable(name: string): { key: string; kind: string }[] {
  const { meta, hidden } = getComponent(name);
  return Object.entries(meta.props)
    .filter(([key, prop]) =>
      !hidden.has(key) && prop.control !== 'handler' && !groupOfProp(key, prop))
    .map(([key, prop]) => ({ key, kind: prop.control }));
}

/** Handler props the component actually declares, in registry order. */
export function handlerProps(name: string): string[] {
  const { meta, hidden } = getComponent(name);
  return Object.entries(meta.props)
    .filter(([key, prop]) => !hidden.has(key) && prop.control === 'handler')
    .map(([key]) => key);
}

/** A `ReactNode` prop the editor is willing to treat as plain text. */
export const isTextSlot = (key: string): boolean => TEXT_SLOTS.has(key);

/**
 * A cva variant key can be a number; a JSON object key cannot.
 *
 * `size: { 80: '…', 72: '…' }` types the prop as `80 | 72`, but the registry
 * is JSON, so its `options` come back as `['80','72']`. The document stores
 * the string — that is what a `<select>` gives you — and this converts it back
 * at the two boundaries where the real type matters: rendering on the canvas,
 * where a string key misses the variant and silently falls back to the
 * default, and code generation, where `size="40"` does not compile.
 *
 * The signal is `default`, which the registry records with its real type.
 * Failing that, options that are entirely digits are numeric: a string variant
 * whose every value is a bare number would be indistinguishable anyway.
 */
export function coerceOption(
  value: unknown,
  prop: { default?: unknown; options?: readonly string[] },
): unknown {
  if (typeof value !== 'string' || !/^-?\d+(\.\d+)?$/.test(value)) return value;
  const numeric = typeof prop.default === 'number'
    || (prop.default === undefined && Boolean(prop.options?.length) && prop.options!.every((o) => /^-?\d+(\.\d+)?$/.test(o)));
  return numeric ? Number(value) : value;
}
