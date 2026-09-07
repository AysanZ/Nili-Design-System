import { useState, useMemo } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiAddLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiHeartFill,
  RiSettings3Line,
  RiSearchLine,
} from '@remixicon/react';
import { Icon } from '.';
import {
  DynamicIcon,
  iconCategoryNames,
  getIconsInCategory,
  searchIcons,
} from '@icons';

const meta: Meta<typeof Icon> = {
  title: 'Core Elements/Icons',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: `The **Icon** component handles sizing, colour, RTL mirroring and accessibility for any SVG icon.

**The breaking change, and why it was worth it**

The previous version took \`name: string\` and resolved it with \`import * as RemixIcons from '@remixicon/react'\` plus a dynamic key lookup. A namespace import combined with a computed key is opaque to every bundler, so tree-shaking was disabled and **all ~2,830 Remix icons landed in the consumer's bundle** — several megabytes for an app rendering three icons.

\`Icon\` now takes the component, which keeps imports statically analysable:

\`\`\`tsx
import { RiAddLine } from '@remixicon/react';
<Icon icon={RiAddLine} size={20} />
\`\`\`

Runtime string lookup still exists — it is genuinely needed for icon pickers and CMS content — but it lives behind a separate entry point so the cost is opt-in:

\`\`\`tsx
import { DynamicIcon } from '@husan/nili-ui/icons';
<DynamicIcon name="add-line" />
\`\`\`

**Accessibility**

Icons are \`aria-hidden\` by default, because most sit next to a visible label and announcing them just duplicates the output. Pass \`label\` when the icon is the only content — then it becomes \`role="img"\` with an accessible name.

**RTL mirroring**

\`mirrored\` flips the glyph in RTL via CSS, so a "next" chevron still points forward in Persian. It is CSS-only, so it keeps working inside a nested \`dir="rtl"\` subtree. \`DynamicIcon\` infers it from the name — arrows and chevrons mirror, vertical glyphs never do.`,
      },
    },
  },
  argTypes: {
    icon: { control: false, description: 'The icon component itself.' },
    size: {
      control: { type: 'number' },
      description: "Pixel size, or any CSS length. `'1em'` tracks font size.",
      table: { defaultValue: { summary: '24' } },
    },
    label: {
      control: 'text',
      description:
        'Accessible name. Omit for decorative icons — they stay `aria-hidden`.',
    },
    mirrored: {
      control: 'boolean',
      description: 'Flip horizontally in RTL. Set on directional glyphs.',
      table: { defaultValue: { summary: 'false' } },
    },
    color: {
      control: 'text',
      description: 'Overrides `currentColor`. Prefer a `text-*` token class.',
    },
    className: { control: 'text' },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Icon> = ({ label, ...args }) => {
  const { t } = useTranslation();
  return <Icon {...args} label={label ? t(label) : undefined} />;
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { icon: RiAddLine, size: 24 };

export const Labelled = Template.bind({});
Labelled.args = {
  icon: RiHeartFill,
  size: 24,
  label: 'Favourite',
  className: 'text-error-base',
};

// ====================== Sizes & Colour ======================

export const Sizes = () => (
  <div className="flex items-center gap-4">
    {[12, 16, 20, 24, 32, 40].map((size) => (
      <div key={size} className="flex flex-col items-center gap-1">
        <Icon icon={RiSettings3Line} size={size} />
        <span className="text-[11px] text-soft-400">{size}</span>
      </div>
    ))}
  </div>
);

/** Colour comes from the text token, so icons follow the theme automatically. */
export const Colors = () => (
  <div className="flex items-center gap-4">
    {[
      ['text-primary-base', 'primary'],
      ['text-success-base', 'success'],
      ['text-warning-base', 'warning'],
      ['text-error-base', 'error'],
      ['text-feature-base', 'feature'],
      ['text-sub-600', 'sub'],
    ].map(([className, label]) => (
      <div key={label} className="flex flex-col items-center gap-1">
        <Icon icon={RiHeartFill} size={24} className={className} />
        <span className="text-[11px] text-soft-400">{label}</span>
      </div>
    ))}
  </div>
);

/** `size="1em"` makes the icon scale with whatever text it sits in. */
export const InlineWithText = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      {(['12px', '16px', '24px'] as const).map((fontSize) => (
        <span
          key={fontSize}
          className="inline-flex items-center gap-1.5"
          style={{ fontSize }}
        >
          <Icon icon={RiSearchLine} size="1em" />
          {t('icon.searchResults')}
        </span>
      ))}
    </div>
  );
};

// ====================== RTL Mirroring ======================

/**
 * Switch the Locale toolbar to Persian. The top row still points right — wrong,
 * because "forward" in Persian is leftward. The bottom row flips.
 */
export const Mirroring = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-32 text-[11px] uppercase tracking-wider text-soft-400">
          {t('icon.mirroredOff')}
        </span>
        <Icon icon={RiArrowRightLine} size={24} />
        <Icon icon={RiArrowLeftLine} size={24} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-32 text-[11px] uppercase tracking-wider text-soft-400">
          {t('icon.mirroredOn')}
        </span>
        <Icon icon={RiArrowRightLine} size={24} mirrored />
        <Icon icon={RiArrowLeftLine} size={24} mirrored />
      </div>
    </div>
  );
};

// ====================== Dynamic lookup ======================

/** `DynamicIcon` infers `mirrored` from the name — no manual bookkeeping. */
export const DynamicByName = () => (
  <div className="flex items-center gap-4">
    {[
      'add-line',
      'arrow-right-line',
      'user-fill',
      'settings-3-line',
      'heart-fill',
    ].map((name) => (
      <div key={name} className="flex flex-col items-center gap-1">
        <DynamicIcon name={name as never} size={24} />
        <span className="text-[11px] text-soft-400">{name}</span>
      </div>
    ))}
  </div>
);

/**
 * The searchable catalogue. This is the exact surface the theme-builder
 * dashboard will reuse — which is why `searchIcons` returns plain data
 * instead of JSX the way the old `iconCategoryHelpers` did.
 */
export const Gallery = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(iconCategoryNames[0]);

  const results = useMemo(
    () =>
      query
        ? searchIcons(query, 120)
        : getIconsInCategory(category as never).slice(0, 120),
    [query, category],
  );

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('icon.searchPlaceholder')}
        className="h-10 w-full rounded-lg border border-soft-200 bg-white-0 px-3 text-[14px] text-strong-950 outline-none placeholder:text-soft-400 focus-visible:border-primary-base"
      />

      {!query && (
        <div className="flex flex-wrap gap-1.5">
          {iconCategoryNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={
                category === name
                  ? 'rounded-md bg-primary-base px-2 py-1 text-[12px] text-static-white'
                  : 'rounded-md bg-weak-50 px-2 py-1 text-[12px] text-sub-600 hover:bg-soft-200'
              }
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <span className="text-[12px] text-soft-400">
        {t('icon.results', { count: results.length })}
      </span>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
        {results.map((name) => (
          <div
            key={name}
            title={name}
            className="flex flex-col items-center gap-1 rounded-lg border border-soft-200 bg-white-0 p-2"
          >
            <DynamicIcon name={name} size={20} className="text-sub-600" />
            <span className="w-full truncate text-center text-[10px] text-soft-400">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default meta;
