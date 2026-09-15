import { lazy } from 'react';
import type { ComponentType } from 'react';
import { getComponent } from '../registry/catalogue';

/**
 * A component's real Storybook overview, loaded on demand.
 *
 * Not a copy of the overview and not a reconstruction of it — the page
 * itself, the module under `src/components/**\/*-overview.stories.tsx`,
 * rendered as it is. Anything else drifts: a matrix rebuilt from registry
 * metadata gave `CompactButton` a text label, because the registry knows it
 * takes `children` and only the docs file knows that what goes in there is an
 * icon.
 *
 * Keyed by directory, because that is how the stories are organised: one
 * Buttons page covers Button, LinkButton, FancyButton and CompactButton, and
 * opening any of them should show what Storybook shows.
 *
 * `lazy` rather than a static import, because forty overview pages in the
 * main bundle would be paid for by everyone who never opens one.
 */
type Story = { render?: ComponentType } | undefined;

const load = (module: Promise<unknown>): ComponentType =>
  lazy(async () => {
    const loaded = (await module) as Record<string, Story>;
    /* A story file exports `Overview` (or one named page per set). Its
       `render` is the page component. */
    const page = Object.values(loaded).find(
      (value) => value && typeof value === 'object' && typeof value.render === 'function',
    );
    const render = page?.render;
    if (!render) throw new Error('That overview story has no render function.');
    return { default: render };
  });

/**
 * Directory → its overview page.
 *
 * Written out rather than globbed so that a missing page is a visible gap
 * here rather than a silent `undefined` at the moment someone clicks.
 */
const PAGES: Record<string, () => ComponentType> = {
  accordion: () => load(import('@components/accordion/accordion-overview.stories')),
  alert: () => load(import('@components/alert/alert-overview.stories')),
  avatar: () => load(import('@components/avatar/avatar-overview.stories')),
  badge: () => load(import('@components/badge/badge-overview.stories')),
  banner: () => load(import('@components/banner/banner-overview.stories')),
  breadcrumb: () => load(import('@components/breadcrumb/breadcrumb-overview.stories')),
  button: () => load(import('@components/button/buttons-overview.stories')),
  checkbox: () => load(import('@components/checkbox/checkbox-overview.stories')),
  'color-picker': () => load(import('@components/color-picker/color-picker-overview.stories')),
  'content-divider': () => load(import('@components/content-divider/content-divider-overview.stories')),
  'date-picker': () => load(import('@components/date-picker/date-picker-overview.stories')),
  'file-upload': () => load(import('@components/file-upload/file-upload-overview.stories')),
  'key-components': () => load(import('@components/key-components/key-components-overview.stories')),
  pagination: () => load(import('@components/pagination/pagination-overview.stories')),
  'progress-bar': () => load(import('@components/progress-bar/progress-bar-overview.stories')),
  radio: () => load(import('@components/radio/radio-overview.stories')),
  rating: () => load(import('@components/rating/rating-overview.stories')),
  slider: () => load(import('@components/slider/slider-overview.stories')),
  switch: () => load(import('@components/switch/switch-overview.stories')),
  tag: () => load(import('@components/tag/tag-overview.stories')),
  'text-area': () => load(import('@components/text-area/text-area-overview.stories')),
  'text-input': () => load(import('@components/text-input/text-input-overview.stories')),
};

const cache = new Map<string, ComponentType>();

/** The overview page for a component, or null when the library has none. */
export function overviewPage(component: string): ComponentType | null {
  const { dir } = getComponent(component);
  const make = PAGES[dir];
  if (!make) return null;
  let page = cache.get(dir);
  if (!page) {
    page = make();
    cache.set(dir, page);
  }
  return page;
}

/** True when the library documents this component with an overview page. */
export function hasStoryPage(component: string): boolean {
  try {
    return Boolean(PAGES[getComponent(component).dir]);
  } catch {
    return false;
  }
}
