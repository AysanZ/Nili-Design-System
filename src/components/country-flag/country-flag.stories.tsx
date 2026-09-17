import type { Meta, StoryFn } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { CountryFlag } from '.';
import { COUNTRY_CODES } from './flags.data';
import { COUNTRY_FLAG_SIZES } from './country-flag.styles';
import { FlagFinder } from './country-flag.docs';

const meta: Meta<typeof CountryFlag> = {
  title: 'Assets/Country Flags/Country Flag',
  component: CountryFlag,
  parameters: {
    docs: {
      description: {
        component: `A circular country flag, from a set of ${COUNTRY_CODES.length} — every ISO 3166-1 alpha-2 country, a long tail of subdivisions, and a handful of non-country flags.

**Inlined, not fetched**

The artwork is inline SVG rather than \`<img src="/flags/ir.svg">\`. A country picker with 250 rows would otherwise fire 250 requests the moment it opens, and an \`<img>\` cannot inherit the ring, mask or filter of whatever it sits inside. The trade is about 300 KB of string data in \`flags.data.ts\` — which is marked side-effect-free, so a bundler drops the whole thing for any app that never renders a flag.

**Every id is namespaced**

Each source file defines its mask as \`#a\`. Put two of them on one page and the second silently wins, which shows up as one flag wearing another's shape. Every id is prefixed with its own country code at generation time.

**Decorative by default**

A flag next to the word "Iran" tells a screen reader nothing it is not about to read anyway, so flags are \`aria-hidden\` unless you pass \`label\`. Pass it when the flag is the only thing identifying the country — a compact currency picker, say.

Source: [circle-flags](https://github.com/HatScripts/circle-flags) (MIT).`,
      },
    },
  },
  argTypes: {
    code: {
      control: 'text',
      description:
        'ISO 3166-1 alpha-2, case-insensitive. Unknown codes render a neutral disc.',
      table: { type: { summary: 'CountryCode | string' } },
    },
    size: {
      control: { type: 'select' },
      options: COUNTRY_FLAG_SIZES,
      table: { defaultValue: { summary: 'md' } },
    },
    bordered: {
      control: 'boolean',
      description:
        'Hairline ring. Turn it on for white-edged flags on a tinted surface.',
      table: { defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description: 'Accessible name. Omit to leave the flag `aria-hidden`.',
    },
  },
};
export default meta;

const Template: StoryFn<typeof CountryFlag> = (args) => (
  <CountryFlag {...args} />
);

export const Default = Template.bind({});
Default.args = { code: 'ir', size: 'lg' };

/** The named sizes, smallest to largest. */
export const Sizes = () => (
  <div className="flex items-end gap-4">
    {COUNTRY_FLAG_SIZES.map((size) => (
      <CountryFlag key={size} code="tj" size={size} />
    ))}
  </div>
);

/** `bordered` keeps a white-edged flag from dissolving into a light surface. */
export const Bordered = () => (
  <div className="flex gap-4 rounded-xl bg-weak-50 p-4">
    {(['jp', 'pl', 'fi', 'sg'] as const).map((code) => (
      <CountryFlag key={code} code={code} size="xl" bordered />
    ))}
  </div>
);

/** An unknown code is a neutral disc, not a hole in the layout. */
export const UnknownCode = () => (
  <div className="flex items-center gap-4">
    <CountryFlag code="zz" size="xl" />
    <CountryFlag code="ir" size="xl" />
  </div>
);

/** The flag carries the name, so here it needs one of its own. */
export const Labelled = () => {
  const { t } = useTranslation();
  return <CountryFlag code="ir" size="xl" label={t('countryFlag.iran')} />;
};

/** In a list the name is already there, so the flag stays decorative. */
export const InAList = () => (
  <ul className="flex w-64 flex-col gap-1">
    {(
      [
        ['ir', 'Iran'],
        ['tj', 'Tajikistan'],
        ['af', 'Afghanistan'],
        ['tr', 'Türkiye'],
      ] as const
    ).map(([code, name]) => (
      <li
        key={code}
        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-weak-50"
      >
        <CountryFlag code={code} size="md" />
        <span className="text-[14px] leading-5 text-strong-950">{name}</span>
      </li>
    ))}
  </ul>
);

/** Search the whole set by code or English name. */
export const Finder = () => <FlagFinder />;
