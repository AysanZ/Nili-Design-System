import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiPriceTag3Line } from '@remixicon/react';
import { Tag, TagGroup } from '.';
import { Icon } from '@components/icon';
import { Avatar } from '@components/avatar';
import { FigmaFrame } from '../../docs/figma.docs';
import { TagSet } from './tag.docs';

const meta: Meta<typeof Tag> = {
  title: 'Base Components/Tag/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component: `The **Tag**, from the Figma "❖ Tag" page: three appearances, two sizes, an optional leading slot and an optional remove button.

**Key Features:**
- **3 Appearances**: \`stroke\`, \`filled\`, \`light\`
- **2 Sizes** (sm · md)
- **\`startAdornment\`** — an icon, an avatar, a coloured dot
- **\`onSelect\`** makes it a toggle; **\`onDismiss\`** adds the remove button

**Tag or Badge?** They look alike and mean opposite things. A **Badge** is a *status the system assigns* — "active", "3 unread" — and the user cannot remove it. A **Tag** is *user content*: a label they attached, a filter they applied, a recipient they picked, and it is usually removable. That is why dismissal lives here and not there, and why Tag's palette is neutral by default while Badge's carries meaning.

**Two buttons, never nested.** A selectable tag with a remove button is two controls side by side. Nesting is invalid HTML and browsers resolve it by dropping the inner element, so the remove target silently stops working — the same trap \`FilterChip\` documents. The wrapper is a plain \`<span>\` and the label and the ✕ are siblings inside it.

**The remove button needs a name.** \`dismissLabel\` is not decoration: an ✕ glyph has no accessible name, so without it a screen-reader user hears "button" and cannot tell which of the eight tags on screen it belongs to. Name it after the tag — "Remove design".`,
      },
    },
  },
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: ['stroke', 'gray'],
      table: { defaultValue: { summary: 'stroke' } },
    },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    startAdornment: { control: false },
    onSelect: { action: 'selected' },
    onDismiss: { action: 'dismissed' },
  },
};

const Template: StoryFn<typeof Tag> = (args) => {
  const { t } = useTranslation();
  return <Tag {...args}>{t('tag.design')}</Tag>;
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

export const Dismissible = Template.bind({});
Dismissible.args = { dismissLabel: 'Remove design', onDismiss: () => {} };

export const Selectable = Template.bind({});
Selectable.args = { onSelect: () => {}, selected: true };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, onDismiss: () => {}, dismissLabel: 'Remove' };

// ====================== Appearances & sizes ======================

export const AllAppearances = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {(['stroke', 'gray'] as const).map((appearance) => (
        <div key={appearance} className="flex items-center gap-2">
          <span className="w-16 text-[11px] uppercase tracking-wider text-soft-400">
            {appearance}
          </span>
          <Tag appearance={appearance}>{t('tag.design')}</Tag>
          <Tag
            appearance={appearance}
            onDismiss={() => {}}
            dismissLabel="Remove"
          >
            {t('tag.research')}
          </Tag>
        </div>
      ))}
    </div>
  );
};

// ====================== Leading slot ======================

/** Anything: an icon, an avatar, a bare dot. */
export const Adornments = () => {
  const { t } = useTranslation();
  return (
    <TagGroup label={t('tag.label')}>
      <Tag startAdornment={<Icon icon={RiPriceTag3Line} />}>
        {t('tag.design')}
      </Tag>
      <Tag startAdornment={<Avatar size="3xs" name="Sara Ahmadi" />}>
        Sara Ahmadi
      </Tag>
      <Tag
        startAdornment={<span className="size-2 rounded-full bg-error-base" />}
      >
        {t('tag.urgent')}
      </Tag>
    </TagGroup>
  );
};

// ====================== In context ======================

/** A real list you can empty — each ✕ is named after its own tag. */
export const RemovableList = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([
    'design',
    'research',
    'engineering',
    'urgent',
  ]);

  return (
    <div className="flex w-96 flex-col gap-3">
      <TagGroup label={t('tag.label')}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            onDismiss={() =>
              setTags((current) => current.filter((t2) => t2 !== tag))
            }
            dismissLabel={t('tag.remove', { name: t(`tag.${tag}`) })}
          >
            {t(`tag.${tag}`)}
          </Tag>
        ))}
      </TagGroup>
      {tags.length === 0 && (
        <span className="text-[12px] leading-4 text-sub-600">
          {t('tag.add')}
        </span>
      )}
    </div>
  );
};

/** Filter chips: `onSelect` toggles, `aria-pressed` announces the state. */
export const SelectableSet = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(['design']);
  const toggle = (tag: string) =>
    setSelected((current) =>
      current.includes(tag)
        ? current.filter((entry) => entry !== tag)
        : [...current, tag],
    );

  return (
    <TagGroup label={t('tag.label')}>
      {['design', 'research', 'engineering'].map((tag) => (
        <Tag
          key={tag}
          appearance="gray"
          selected={selected.includes(tag)}
          onSelect={() => toggle(tag)}
        >
          {t(`tag.${tag}`)}
        </Tag>
      ))}
    </TagGroup>
  );
};

// ====================== Figma component sets ======================

export const TagSetStory = () => (
  <FigmaFrame>
    <TagSet />
  </FigmaFrame>
);
TagSetStory.storyName = 'Tag set';
TagSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
