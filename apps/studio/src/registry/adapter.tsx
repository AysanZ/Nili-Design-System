import { createElement } from 'react';
import type { ComponentType } from 'react';
import {
  Accordion,
  ActivityFeedItem,
  Alert,
  Avatar,
  Badge,
  Banner,
  BreadcrumbItem,
  Button,
  ChartLegend,
  Checkbox,
  ColorPicker,
  CompactButton,
  ContentCard,
  ContentDivider,
  ContentLabel,
  CounterInput,
  DatePicker,
  DigitInput,
  EmptyState,
  FancyButton,
  FileUploadCard,
  FilterChip,
  FlatAvatar,
  HintText,
  Icon,
  InlineInput,
  Label,
  LinkButton,
  Pagination,
  PasswordStrength,
  ProgressBar,
  ProgressCircle,
  Radio,
  RadioCard,
  Rating,
  Slider,
  StatusBadge,
  Switch,
  Tag,
  TagInput,
  TextArea,
  TextInput,
  Typography,
  ToggleGroup,
} from '@nili/ui';
import { getIconComponent } from '@nili/ui/icons';
import type { IconName } from '@nili/ui/icons';
import type { Locale } from '../i18n/types';
import { isText, resolve } from '../i18n/catalog';
import type { ComponentNode, PropBag } from '../document/types';
import { getComponent, isIconSlot } from './catalogue';

/**
 * The one place the studio gives up static typing. A visual editor builds its
 * prop bag at runtime from registry metadata, so no static signature can
 * describe it; the cast is confined here and every value that reaches it has
 * already been validated against the registry's control kind.
 */
type AnyComponent = ComponentType<Record<string, unknown>>;

const IMPLEMENTATIONS: Record<string, AnyComponent> = {
  Accordion: Accordion as unknown as AnyComponent,
  ActivityFeedItem: ActivityFeedItem as unknown as AnyComponent,
  Alert: Alert as unknown as AnyComponent,
  Avatar: Avatar as unknown as AnyComponent,
  Badge: Badge as unknown as AnyComponent,
  Banner: Banner as unknown as AnyComponent,
  BreadcrumbItem: BreadcrumbItem as unknown as AnyComponent,
  Button: Button as unknown as AnyComponent,
  ChartLegend: ChartLegend as unknown as AnyComponent,
  Checkbox: Checkbox as unknown as AnyComponent,
  ColorPicker: ColorPicker as unknown as AnyComponent,
  CompactButton: CompactButton as unknown as AnyComponent,
  ContentCard: ContentCard as unknown as AnyComponent,
  ContentDivider: ContentDivider as unknown as AnyComponent,
  ContentLabel: ContentLabel as unknown as AnyComponent,
  CounterInput: CounterInput as unknown as AnyComponent,
  DatePicker: DatePicker as unknown as AnyComponent,
  DigitInput: DigitInput as unknown as AnyComponent,
  EmptyState: EmptyState as unknown as AnyComponent,
  FancyButton: FancyButton as unknown as AnyComponent,
  FileUploadCard: FileUploadCard as unknown as AnyComponent,
  FilterChip: FilterChip as unknown as AnyComponent,
  FlatAvatar: FlatAvatar as unknown as AnyComponent,
  HintText: HintText as unknown as AnyComponent,
  Icon: Icon as unknown as AnyComponent,
  InlineInput: InlineInput as unknown as AnyComponent,
  Label: Label as unknown as AnyComponent,
  LinkButton: LinkButton as unknown as AnyComponent,
  Pagination: Pagination as unknown as AnyComponent,
  PasswordStrength: PasswordStrength as unknown as AnyComponent,
  ProgressBar: ProgressBar as unknown as AnyComponent,
  ProgressCircle: ProgressCircle as unknown as AnyComponent,
  Radio: Radio as unknown as AnyComponent,
  RadioCard: RadioCard as unknown as AnyComponent,
  Rating: Rating as unknown as AnyComponent,
  Slider: Slider as unknown as AnyComponent,
  StatusBadge: StatusBadge as unknown as AnyComponent,
  Switch: Switch as unknown as AnyComponent,
  Tag: Tag as unknown as AnyComponent,
  TagInput: TagInput as unknown as AnyComponent,
  TextArea: TextArea as unknown as AnyComponent,
  TextInput: TextInput as unknown as AnyComponent,
  Typography: Typography as unknown as AnyComponent,
  ToggleGroup: ToggleGroup as unknown as AnyComponent,
};

export const implementationFor = (name: string): AnyComponent | undefined => IMPLEMENTATIONS[name];

/** Props a component requires to render at all, supplied when the user left them blank. */
const FALLBACKS: Record<string, PropBag> = {
  Avatar: { name: '' },
  FlatAvatar: { name: '' },
  Icon: { icon: undefined },
  Pagination: { count: 10, page: 1 },
  FileUploadCard: { fileName: 'report.pdf' },
  VideoPlayer: { src: '' },
};

/**
 * Turns an authored prop bag into real component props: text values are
 * resolved in the active locale, empty strings are dropped so the component's
 * own defaults apply, and handlers are supplied where a prop only takes effect
 * with one.
 */
export function materialize(node: ComponentNode, locale: Locale | undefined): Record<string, unknown> {
  const { meta, hidden } = getComponent(node.component);
  const out: Record<string, unknown> = { ...FALLBACKS[node.component] };

  for (const [key, raw] of Object.entries(node.props)) {
    if (hidden.has(key) || raw === undefined) continue;
    const prop = meta.props[key];
    if (!prop) continue;

    if (isText(raw)) {
      const text = resolve(raw, locale);
      if (text) out[key] = text;
      continue;
    }
    if (typeof raw === 'string') {
      if (!raw) continue;
      if (isIconSlot(key)) {
        const component = getIconComponent(raw as IconName);
        // `icon` takes a component; every other slot takes an element.
        if (component) out[key] = key === 'icon' ? component : createElement(component);
        continue;
      }
      out[key] = raw;
      continue;
    }
    out[key] = raw;
  }

  // `dismissible` and `removable` only render their control when the component
  // is also given something to call, which the canvas has no use for.
  if (out.dismissible) out.onDismiss = noop;
  if (node.component === 'Tag' && out.dismissible) {
    delete out.dismissible;
    out.onDismiss = noop;
  }
  if (node.component === 'Avatar' && typeof out.name !== 'string') out.name = '';
  if (node.className) out.className = node.className;

  return out;
}

function noop(): void {
  /* the canvas is a preview; interactions are not wired */
}

/**
 * Sample content for the Assets thumbnails. Default props alone render an
 * empty shell for most components, which is why the palette read as a list of
 * names rather than a list of components.
 */
const PREVIEW_CONTENT: Record<string, unknown> = {
  children: 'Label',
  label: 'Label',
  title: 'Title',
  placeholder: 'Text',
  initials: 'NN',
  name: 'Nili',
  fileName: 'file.pdf',
  value: 60,
  count: 8,
};

const PREVIEW_OVERRIDES: Record<string, Record<string, unknown>> = {
  Avatar: { initials: 'NN', name: 'Nili' },
  FlatAvatar: { initials: 'NN', name: 'Nili' },
  ProgressBar: { value: 60 },
  ProgressCircle: { value: 60 },
  Rating: { value: 3 },
  Slider: { value: 40 },
  Pagination: { count: 4, page: 1 },
  PasswordStrength: { level: 'good' },
  Icon: { name: 'check' },
};

/** Props for a palette thumbnail: defaults, plus just enough content to see. */
export function previewProps(component: string): Record<string, unknown> {
  const { meta, hidden } = getComponent(component);
  const out: Record<string, unknown> = { ...FALLBACKS[component] };

  for (const [key, prop] of Object.entries(meta.props)) {
    if (hidden.has(key)) continue;
    if (prop.default !== undefined) out[key] = prop.default;
    if (PREVIEW_CONTENT[key] !== undefined && (prop.control === 'text' || prop.control === 'slot' || prop.control === 'number')) {
      out[key] = PREVIEW_CONTENT[key];
    }
  }

  return { ...out, ...PREVIEW_OVERRIDES[component] };
}
