import type { Meta, StoryFn } from '@storybook/react';
import { PlaceholderLogo } from '.';
import {
  PLACEHOLDER_COMPANIES,
  PLACEHOLDER_COMPANY_IDS,
} from './placeholder-logo.data';
import { PLACEHOLDER_LOGO_SIZES } from './placeholder-logo.styles';
import { PlaceholderDetails } from './placeholder-logo.docs';

const meta: Meta<typeof PlaceholderLogo> = {
  title: 'Assets/Placeholder Logos/Placeholder Logo',
  component: PlaceholderLogo,
  parameters: {
    docs: {
      description: {
        component: `Nine fictional company logos, plus an empty tile.

**Why a fictional set exists at all**

A screenshot of a banking dashboard with a real bank's mark in it is two problems: a trademark one, and a "wait, do we work with them?" one. None of these companies exist. The marks are geometry drawn for this file, the names came out of a hat, and the details — city, company size, \`@husan.com\` email — are filler that reads as real without being anyone's.

Use it wherever a mock needs a brand: a company picker, an invoice header, an org list in a marketing screenshot.

**Three variants, one geometry**

The mark is \`currentColor\` inside a disc. \`original\` fills the disc with the brand colour and knocks the mark out in white; \`black\` and \`white\` swap disc and mark to the neutral tokens. Same path, three surfaces — which is exactly how Figma draws the three tiles under each company.

Omit \`company\` for the empty tile: the neutral disc you draw when a record genuinely has no logo, so a grid of companies keeps its shape instead of collapsing where the data is missing.`,
      },
    },
  },
  argTypes: {
    company: {
      control: { type: 'select' },
      options: [undefined, ...PLACEHOLDER_COMPANY_IDS],
      description: 'Omit for the empty tile.',
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['original', 'black', 'white'],
      table: { defaultValue: { summary: 'original' } },
    },
    size: {
      control: { type: 'select' },
      options: PLACEHOLDER_LOGO_SIZES,
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Defaults to the company name. Pass `""` when it is nearby.',
    },
  },
};
export default meta;

const Template: StoryFn<typeof PlaceholderLogo> = (args) => (
  <PlaceholderLogo {...args} />
);

export const Default = Template.bind({});
Default.args = { company: 'apex-financial', size: 'xl' };

/** All nine, plus the empty tile on the end. */
export const AllCompanies = () => (
  <div className="flex flex-wrap items-center gap-4">
    {PLACEHOLDER_COMPANY_IDS.map((id) => (
      <PlaceholderLogo key={id} company={id} size="xl" label="" />
    ))}
    <PlaceholderLogo size="xl" label="" />
  </div>
);

/** One geometry, three surfaces. */
export const Variants = () => (
  <div className="flex flex-wrap gap-3">
    <div className="flex gap-3 rounded-xl border border-soft-200 p-4">
      {PLACEHOLDER_COMPANY_IDS.slice(0, 5).map((id) => (
        <PlaceholderLogo key={id} company={id} size="lg" label="" />
      ))}
    </div>
    <div className="flex gap-3 rounded-xl bg-weak-50 p-4">
      {PLACEHOLDER_COMPANY_IDS.slice(0, 5).map((id) => (
        <PlaceholderLogo
          key={id}
          company={id}
          variant="black"
          size="lg"
          label=""
        />
      ))}
    </div>
    <div className="flex gap-3 rounded-xl bg-strong-950 p-4">
      {PLACEHOLDER_COMPANY_IDS.slice(0, 5).map((id) => (
        <PlaceholderLogo
          key={id}
          company={id}
          variant="white"
          size="lg"
          label=""
        />
      ))}
    </div>
  </div>
);

export const Sizes = () => (
  <div className="flex items-end gap-4">
    {PLACEHOLDER_LOGO_SIZES.map((size) => (
      <PlaceholderLogo key={size} company="solaris-energy" size={size} label="" />
    ))}
  </div>
);

/** A company list — the thing this set is for. */
export const CompanyList = () => (
  <ul className="flex w-80 flex-col gap-1">
    {PLACEHOLDER_COMPANIES.slice(0, 5).map((company) => (
      <li
        key={company.id}
        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-weak-50"
      >
        <PlaceholderLogo company={company.id} size="md" label="" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] leading-5 text-strong-950">
            {company.name}
          </span>
          <span className="truncate text-[12px] leading-4 text-sub-600">
            {company.industry}
          </span>
        </span>
      </li>
    ))}
  </ul>
);

export const Details = () => <PlaceholderDetails />;
