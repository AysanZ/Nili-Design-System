import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { AvatarGroup, CompactAvatarGroup } from '.';
import type { AvatarGroupItem } from '../avatar.types';
import { FigmaFrame } from '../../../docs/figma.docs';
import { AvatarGroupMatrix, CompactGroupMatrix } from '../avatar.docs';

const PEOPLE: AvatarGroupItem[] = [
  { id: '1', name: 'Ada Lovelace', tone: 'blue' },
  { id: '2', name: 'Grace Hopper', tone: 'purple' },
  { id: '3', name: 'Alan Turing', tone: 'green' },
  { id: '4', name: 'Katherine Johnson', tone: 'yellow' },
  { id: '5', name: 'Margaret Hamilton', tone: 'red' },
  { id: '6', name: 'Barbara Liskov', tone: 'soft' },
];

const meta: Meta<typeof AvatarGroup> = {
  title: 'Base Components/Avatar/Avatar Group',
  component: AvatarGroup,
  parameters: {
    docs: {
      description: {
        component: `The **AvatarGroup** component arranges multiple avatars in an overlapping stack, with an optional “+N” chip for the overflow.

**Key Features:**
- **\`max\`** caps the visible avatars and derives the overflow count
- **\`overflowCount\`** overrides that count when the total is known but the items are not
- **\`label\`** names the whole stack for assistive tech (\`role="group"\`)
- Every \`Avatar\` size works

**Why the overlap is now pure CSS**

The previous version computed \`translateX(±n%)\` per item in JavaScript and read the page direction from \`document.dir\`. That had three problems:

1. It touched \`document\` during render, which breaks server-side rendering outright.
2. It read the **global** direction, so a group inside a \`dir="rtl"\` subtree on an otherwise-LTR page overlapped the wrong way.
3. It produced N inline styles instead of one class.

A negative logical margin (\`-ms-2\`) does the entire job: it flips itself with the reading direction, costs nothing at runtime, and works in any nested direction context. Switch the Locale toolbar to فارسی — the stack reverses on its own.`,
      },
    },
  },
  argTypes: {
    items: { control: false, description: 'Avatars to render.' },
    size: {
      control: { type: 'select' },
      options: ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'],
      table: { defaultValue: { summary: 'md' } },
    },
    max: {
      control: 'number',
      description: 'Maximum visible avatars before the “+N” chip.',
    },
    overflowCount: {
      control: 'number',
      description: 'Override the computed overflow count.',
    },
    label: { control: 'text', description: 'Accessible name for the group.' },
  },
};

const Template: StoryFn<typeof AvatarGroup> = (args) => (
  <AvatarGroup {...args} />
);

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  items: PEOPLE.slice(0, 4),
  size: 'md',
  label: 'avatar.groupLabel',
};

export const WithOverflow = Template.bind({});
WithOverflow.args = {
  items: PEOPLE,
  size: 'md',
  max: 4,
  label: 'avatar.groupLabel',
};

export const ExplicitOverflowCount = Template.bind({});
ExplicitOverflowCount.args = {
  items: PEOPLE.slice(0, 3),
  size: 'md',
  overflowCount: 27,
  label: 'avatar.groupLabel',
};

// ====================== Sizes ======================

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-8 text-[11px] text-soft-400">{size}</span>
          <AvatarGroup
            items={PEOPLE}
            size={size}
            max={4}
            label={t('avatar.groupLabel')}
          />
        </div>
      ))}
    </div>
  );
};

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <AvatarGroup
      size="lg"
      max={4}
      label={t('avatar.groupLabel')}
      items={[
        { id: '1', name: 'علی رضایی', tone: 'blue' },
        { id: '2', name: 'مریم حسینی', tone: 'purple' },
        { id: '3', name: 'سارا کریمی', tone: 'green' },
        { id: '4', name: 'رضا محمدی', tone: 'yellow' },
        { id: '5', name: 'نازنین احمدی', tone: 'red' },
        { id: '6', name: 'امیر قاسمی', tone: 'soft' },
      ]}
    />
  );
};

// ====================== Compact Avatar Group ======================

/**
 * Denser than `AvatarGroup`, with a bordered container in the Stroke style.
 * For table rows and list items, where the standard spacing is too generous.
 * From Figma's Compact Avatar Group [1.0] set.
 */
export const Compact = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {(['default', 'stroke'] as const).map((appearance) => (
        <div key={appearance} className="flex items-center gap-4">
          <span className="w-16 text-[11px] uppercase tracking-wider text-soft-400">
            {appearance}
          </span>
          {(['sm', 'xs', '2xs'] as const).map((size) => (
            <CompactAvatarGroup
              key={size}
              items={PEOPLE}
              size={size}
              appearance={appearance}
              max={3}
              label={t('avatar.compactLabel')}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ====================== Figma component sets ======================

/** Figma Avatar Group: four avatars + counter at all nine sizes. */
export const ComponentSet = () => (
  <FigmaFrame>
    <AvatarGroupMatrix />
  </FigmaFrame>
);
ComponentSet.storyName = 'Component set';
ComponentSet.parameters = { docs: { source: { code: null } } };

/** Figma Compact Avatar Group: 40 · 32 · 24 in both appearances. */
export const CompactComponentSet = () => (
  <FigmaFrame>
    <CompactGroupMatrix />
  </FigmaFrame>
);
CompactComponentSet.storyName = 'Compact Avatar Group';
CompactComponentSet.parameters = { docs: { source: { code: null } } };

export default meta;
