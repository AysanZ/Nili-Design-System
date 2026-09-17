import type { Meta, StoryFn } from '@storybook/react';
import { AppStoreBadge } from '.';
import { APP_STORE_IDS } from './app-store-badge.data';
import { APP_STORE_BADGE_SIZES } from './app-store-badge.styles';
import { AppStoreDetails, AppStoreFooterRow } from './app-store-badge.docs';

const meta: Meta<typeof AppStoreBadge> = {
  title: 'Assets/App Store Badges/App Store Badge',
  component: AppStoreBadge,
  parameters: {
    docs: {
      description: {
        component: `A "download our app" badge for seven storefronts.

**The drawing here is a stand-in. Read this before shipping one.**

Every one of these badges is trademarked artwork that its owner distributes under its own brand guidelines — and those guidelines specify the exact file, not "any SVG that looks about right". Apple and Google both pin minimum size, clear space, and which locale's wording you may use. Nobody can redistribute those files inside a component library, so what this component draws is the correct pill geometry and the correct two-line wording with a plain glyph drawn for this repo.

Fine for a mock, a Storybook page, or an internal prototype. For production, download the official badge from the store's guidelines link (they are in the Overview page's detail table) and pass it in:

\`\`\`tsx
<AppStoreBadge store="apple" href="…" artwork={<AppleBadgeSvg />} />
\`\`\`

\`artwork\` replaces the whole drawing, so the official file renders exactly as published and none of the layout below is used.

**One accessible thing, not four**

The glyph and both text lines sit inside a single \`aria-hidden\` SVG, and the accessible name is the badge's own sentence — "Download on the App Store". Otherwise a screen reader reads "Download on the" and "App Store" as two unrelated fragments.

Renders an \`<a>\` when \`href\` is set and a \`<span>\` otherwise, so a specimen sheet does not fill up with dead links.`,
      },
    },
  },
  argTypes: {
    store: { control: { type: 'select' }, options: APP_STORE_IDS },
    variant: {
      control: { type: 'inline-radio' },
      options: ['original', 'black', 'white'],
      table: { defaultValue: { summary: 'original' } },
    },
    size: {
      control: { type: 'select' },
      options: APP_STORE_BADGE_SIZES,
      table: { defaultValue: { summary: 'md' } },
    },
    href: { control: 'text', description: 'Makes it a link.' },
    artwork: {
      control: false,
      description: 'The official badge SVG. Replaces the built-in drawing.',
    },
  },
};
export default meta;

const Template: StoryFn<typeof AppStoreBadge> = (args) => (
  <AppStoreBadge {...args} />
);

export const Default = Template.bind({});
Default.args = { store: 'apple', size: 'lg', href: '#' };

export const AllStores = () => (
  <div className="flex flex-wrap gap-3">
    {APP_STORE_IDS.map((store) => (
      <AppStoreBadge key={store} store={store} size="md" />
    ))}
  </div>
);

export const Variants = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-3">
      {APP_STORE_IDS.slice(0, 4).map((store) => (
        <AppStoreBadge key={store} store={store} variant="original" />
      ))}
    </div>
    <div className="flex flex-wrap gap-3">
      {APP_STORE_IDS.slice(0, 4).map((store) => (
        <AppStoreBadge key={store} store={store} variant="black" />
      ))}
    </div>
    <div className="flex flex-wrap gap-3 rounded-xl bg-strong-950 p-4">
      {APP_STORE_IDS.slice(0, 4).map((store) => (
        <AppStoreBadge key={store} store={store} variant="white" />
      ))}
    </div>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-end gap-3">
    {APP_STORE_BADGE_SIZES.map((size) => (
      <AppStoreBadge key={size} store="google" size={size} />
    ))}
  </div>
);

/** A footer row, which is where these actually live. */
export const InAFooter = () => <AppStoreFooterRow />;

export const Details = () => <AppStoreDetails />;
