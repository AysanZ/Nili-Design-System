import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiAddLine, RiGlobalLine } from '@remixicon/react';
import { Dropdown } from '.';
import { Avatar } from '@components/avatar';
import { Button } from '@components/button';
import { Icon } from '@components/icon';

const meta: Meta<typeof Dropdown> = {
  title: 'Base Components/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `The **Dropdown**, from the Figma "❖ Dropdown" page.

**The six Figma "Types"** — Basic, Country, Avatar, Provider, Brand, Company — differ only in what sits in the item's leading slot. That is a slot, not a variant: as an enum, "avatar plus a trailing badge" is unreachable and every new kind of adornment needs a library release. \`startAdornment\` covers all six, plus whatever comes next.

**Keyboard.** The whole reason to build this instead of using a native \`<select>\` is rich item content, so the keyboard contract has to be rebuilt to match: ↑/↓ move, Home/End jump, Enter commits, Escape closes and returns focus, and typing filters when \`searchable\`. \`aria-activedescendant\` carries the cursor so focus can stay in the search field.

**Honest limitation.** Positioning is absolute with a simple flip-above when there is no room below. It does not handle nested scroll containers or cross-iframe collision. Once this system grows a Popover and a Combobox, moving the positioning onto a real engine is the right call — none of the component APIs here would have to change.`,
      },
    },
  },
  argTypes: {
    size: { control: { type: 'select' }, options: ['md', 'sm', 'xs'] },
    itemSize: { control: { type: 'radio' }, options: ['sm', 'lg'] },
    appearance: {
      control: { type: 'select' },
      options: ['default', 'compact', 'inline'],
    },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

const useCountries = () => {
  const { t } = useTranslation();
  return [
    {
      value: 'ir',
      label: t('dropdown.iran'),
      startAdornment: <span aria-hidden>🇮🇷</span>,
    },
    {
      value: 'de',
      label: t('dropdown.germany'),
      startAdornment: <span aria-hidden>🇩🇪</span>,
    },
    {
      value: 'jp',
      label: t('dropdown.japan'),
      startAdornment: <span aria-hidden>🇯🇵</span>,
    },
    {
      value: 'br',
      label: t('dropdown.brazil'),
      startAdornment: <span aria-hidden>🇧🇷</span>,
    },
    {
      value: 'ca',
      label: t('dropdown.canada'),
      startAdornment: <span aria-hidden>🇨🇦</span>,
    },
  ];
};

export const Default = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-64">
      <Dropdown
        options={useCountries()}
        value={value}
        onChange={setValue}
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
      />
    </div>
  );
};

export const Searchable = () => {
  const { t } = useTranslation();
  return (
    <div className="w-64">
      <Dropdown
        searchable
        options={useCountries()}
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
        searchPlaceholder={t('dropdown.search')}
        emptyMessage={t('dropdown.empty')}
      />
    </div>
  );
};

/** Figma's Avatar type — the same `startAdornment` slot, different content. */
export const WithAvatars = () => {
  const { t } = useTranslation();
  const people = [
    { value: '1', name: 'علی رضایی', tone: 'blue' as const },
    { value: '2', name: 'Grace Hopper', tone: 'purple' as const },
    { value: '3', name: 'Alan Turing', tone: 'green' as const },
  ];
  return (
    <div className="w-64">
      <Dropdown
        label={t('dropdown.members')}
        placeholder={t('dropdown.placeholder')}
        options={people.map((person) => ({
          value: person.value,
          label: person.name,
          startAdornment: (
            <Avatar size="2xs" name={person.name} tone={person.tone} />
          ),
        }))}
      />
    </div>
  );
};

/** Figma's Large (56) item: label plus description. */
export const LargeItems = () => {
  const { t } = useTranslation();
  return (
    <div className="w-72">
      <Dropdown
        itemSize="lg"
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
        options={[
          {
            value: 'owner',
            label: t('dropdown.owner'),
            description: t('dropdown.ownerHint'),
          },
          {
            value: 'editor',
            label: t('dropdown.editor'),
            description: t('dropdown.editorHint'),
          },
          {
            value: 'viewer',
            label: t('dropdown.viewer'),
            description: t('dropdown.viewerHint'),
          },
        ]}
      />
    </div>
  );
};

/** Figma "Caption" misc. items become `group` on an option. */
export const Grouped = () => {
  const { t } = useTranslation();
  const countries = useCountries().map((c) => ({
    ...c,
    group: t('dropdown.countries'),
  }));
  return (
    <div className="w-64">
      <Dropdown
        options={[
          { value: 'me', label: 'Ada Lovelace', group: t('dropdown.members') },
          ...countries,
        ]}
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
      />
    </div>
  );
};

/** Figma "Button" misc. item, pinned under the list. */
export const WithFooter = () => {
  const { t } = useTranslation();
  return (
    <div className="w-64">
      <Dropdown
        options={useCountries()}
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
        footer={
          <Button
            size="2xs"
            appearance="ghost"
            color="neutral"
            fullWidth
            startIcon={<Icon icon={RiAddLine} />}
          >
            {t('dropdown.addNew')}
          </Button>
        }
      />
    </div>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  const options = useCountries();
  return (
    <div className="flex w-64 flex-col gap-3">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <Dropdown
          key={size}
          size={size}
          options={options}
          label={t('dropdown.label')}
          placeholder={t('dropdown.placeholder')}
        />
      ))}
    </div>
  );
};

export const States = () => {
  const { t } = useTranslation();
  const options = useCountries();
  return (
    <div className="flex w-64 flex-col gap-3">
      <Dropdown
        options={options}
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
      />
      <Dropdown
        options={options}
        defaultValue="ir"
        label={t('dropdown.label')}
      />
      <Dropdown
        options={options}
        invalid
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
      />
      <Dropdown
        options={options}
        disabled
        label={t('dropdown.label')}
        placeholder={t('dropdown.placeholder')}
      />
    </div>
  );
};

/** Figma "Compact Dropdowns" — borderless, for toolbars and input adornments. */
export const Compact = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-64 items-center gap-2">
      <Dropdown
        appearance="compact"
        size="sm"
        options={useCountries()}
        label={t('dropdown.label')}
        placeholder={<Icon icon={RiGlobalLine} />}
      />
    </div>
  );
};

export default meta;
