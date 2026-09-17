'use client';

import { RiFlashlightLine } from '@remixicon/react';
import {
  Dropdown,
  Icon,
  Avatar,
  CountryFlag,
  PlaceholderLogo,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { dropdownText } from './dropdown-demo.text';

/* ── option sets for each Figma "Type" ─────────────────────────────── */

const ICON_OPTIONS = [
  {
    value: 'design',
    label: 'Design',
    startAdornment: <Icon icon={RiFlashlightLine} />,
  },
  {
    value: 'engineering',
    label: 'Engineering',
    startAdornment: <Icon icon={RiFlashlightLine} />,
  },
  {
    value: 'marketing',
    label: 'Marketing',
    startAdornment: <Icon icon={RiFlashlightLine} />,
  },
  {
    value: 'sales',
    label: 'Sales',
    startAdornment: <Icon icon={RiFlashlightLine} />,
    disabled: true,
  },
];

const COUNTRY_OPTIONS = [
  {
    value: 'ir',
    label: 'Iran',
    startAdornment: <CountryFlag code="ir" size="sm" />,
  },
  {
    value: 'de',
    label: 'Germany',
    startAdornment: <CountryFlag code="de" size="sm" />,
  },
  {
    value: 'tr',
    label: 'Turkey',
    startAdornment: <CountryFlag code="tr" size="sm" />,
  },
  {
    value: 'ae',
    label: 'United Arab Emirates',
    startAdornment: <CountryFlag code="ae" size="sm" />,
  },
  {
    value: 'us',
    label: 'United States',
    startAdornment: <CountryFlag code="us" size="sm" />,
  },
];

/** A function, not a constant: one of these options carries a visible badge. */
const userOptionsFor = (t: (key: keyof typeof dropdownText) => string) => [
  {
    value: 'sophia',
    label: 'Sophia Williams',
    description: 'Product design',
    startAdornment: <Avatar size="3xs" name="Sophia Williams" />,
  },
  {
    value: 'james',
    label: 'James Okonkwo',
    description: 'Engineering',
    startAdornment: <Avatar size="3xs" name="James Okonkwo" />,
  },
  {
    value: 'maria',
    label: 'Maria Santos',
    description: 'Marketing',
    badge: (
      <span className="rounded bg-feature-lighter px-1.5 text-[11px] font-medium text-feature-base">
        {t('item.new')}
      </span>
    ),
    startAdornment: <Avatar size="3xs" name="Maria Santos" />,
  },
  {
    value: 'ali',
    label: 'Ali Rezaei',
    description: 'Sales',
    shortcut: '⌘A',
    startAdornment: <Avatar size="3xs" name="Ali Rezaei" />,
  },
];

const COMPANY_OPTIONS = [
  {
    value: 'apex',
    label: 'Apex Financial',
    description: 'Finance & Banking',
    startAdornment: (
      <PlaceholderLogo company="apex-financial" size="xs" label="" />
    ),
  },
  {
    value: 'aurora',
    label: 'Aurora Solutions',
    description: 'Environment',
    startAdornment: (
      <PlaceholderLogo company="aurora-solutions" size="xs" label="" />
    ),
  },
  {
    value: 'nova',
    label: 'Nova Labs',
    description: 'Technology',
    startAdornment: (
      <PlaceholderLogo company="apex-financial" size="xs" label="" />
    ),
  },
];

/**
 * Responsive overview for Dropdown.
 * Mirrors the Storybook / Figma overview: Icon · Country · User · Company
 * types, sizes, appearances, searchable rich items, and validation.
 */
export function DropdownDemo() {
  const t = useDemoText(dropdownText);
  const userOptions = userOptionsFor(t);
  // Types section uses uncontrolled dropdowns with defaultValue so the
  // leading adornment is visible on the trigger (same as Figma overview).

  return (
    <div className="flex flex-col gap-10">
      {/* ── Types (Figma: Icon · Country · User · Company) ─────────── */}
      <DemoSection
        title={t('types.title')}
        description={t('types.body')}
        code={`import {
  Dropdown,
  Icon,
  Avatar,
  CountryFlag,
  PlaceholderLogo,
} from "@nili/ui"
import { RiFlashlightLine } from "@remixicon/react"

// Icon
const iconOptions = [
  {
    value: "design",
    label: "Design",
    startAdornment: <Icon icon={RiFlashlightLine} />,
  },
]

// Country
const countryOptions = [
  {
    value: "ir",
    label: "Iran",
    startAdornment: <CountryFlag code="ir" size="sm" />,
  },
]

// User
const userOptions = [
  {
    value: "sophia",
    label: "Sophia Williams",
    description: "Product design",
    startAdornment: <Avatar size="3xs" name="Sophia Williams" />,
  },
]

// Company
const companyOptions = [
  {
    value: "apex",
    label: "Apex Financial",
    description: "Finance & Banking",
    startAdornment: (
      <PlaceholderLogo company="apex-financial" size="xs" label="" />
    ),
  },
]

export function Example() {
  return (
    <Dropdown
      label="Label"
      sublabel="(Optional)"
      information
      hint="This is a hint text to help user."
      placeholder="Select…"
      options={iconOptions}
    />
  )
}`}
      >
        <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {/* Icon */}
          <div className="flex min-w-0 flex-col gap-2">
            <DemoLabel>{t('item.icon')}</DemoLabel>
            <Dropdown
              label={t('label')}
              sublabel={t('optional')}
              information
              informationLabel="More info"
              hint="This is a hint text to help user."
              placeholder={t('placeholder')}
              options={ICON_OPTIONS}
              defaultValue="design"
            />
          </div>

          {/* Country */}
          <div className="flex min-w-0 flex-col gap-2">
            <DemoLabel>{t('item.country')}</DemoLabel>
            <Dropdown
              label={t('label')}
              sublabel={t('optional')}
              information
              informationLabel="More info"
              hint="This is a hint text to help user."
              placeholder={t('selectCountry')}
              options={COUNTRY_OPTIONS}
              defaultValue="us"
            />
          </div>

          {/* User */}
          <div className="flex min-w-0 flex-col gap-2">
            <DemoLabel>{t('item.user')}</DemoLabel>
            <Dropdown
              label={t('label')}
              sublabel={t('optional')}
              information
              informationLabel="More info"
              hint="This is a hint text to help user."
              placeholder={t('selectUser')}
              itemSize="lg"
              options={userOptions}
              defaultValue="sophia"
            />
          </div>

          {/* Company */}
          <div className="flex min-w-0 flex-col gap-2">
            <DemoLabel>{t('item.company')}</DemoLabel>
            <Dropdown
              label={t('label')}
              sublabel={t('optional')}
              information
              informationLabel="More info"
              hint="This is a hint text to help user."
              placeholder={t('selectCompany')}
              itemSize="lg"
              options={COMPANY_OPTIONS}
              defaultValue="apex"
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Dropdown } from "@nili/ui"

export function Example() {
  return (
    <>
      <Dropdown size="md" label="Medium" options={options} />
      <Dropdown size="sm" label="Small" options={options} />
      <Dropdown size="xs" label="X-Small" options={options} />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {(['md', 'sm', 'xs'] as const).map((size) => (
            <Dropdown
              key={size}
              size={size}
              label={size.toUpperCase()}
              placeholder={t('select')}
              options={ICON_OPTIONS}
              defaultValue="design"
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { Dropdown } from "@nili/ui"

export function Example() {
  return (
    <>
      <Dropdown appearance="default" options={options} />
      <Dropdown appearance="compact" options={options} />
      <Dropdown appearance="inline" options={options} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          {(['default', 'compact', 'inline'] as const).map((appearance) => (
            <div key={appearance} className="flex min-w-0 flex-1 flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <Dropdown
                appearance={appearance}
                placeholder={t('select')}
                options={ICON_OPTIONS}
                defaultValue="engineering"
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Searchable ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('searchable.title')}
        description={t('searchable.body')}
        code={`import { Dropdown, Avatar } from "@nili/ui"

export function Example() {
  return (
    <Dropdown
      label="Assignee"
      placeholder="Search people…"
      options={userOptions}
      itemSize="lg"
      searchable
      searchPlaceholder="Search people…"
    />
  )
}`}
      >
        <div className="w-full max-w-sm">
          <Dropdown
            label={t('assignee')}
            placeholder={t('searchPeople')}
            options={userOptions}
            itemSize="lg"
            searchable
            searchPlaceholder="Search people…"
            defaultValue="sophia"
          />
        </div>
      </DemoSection>

      {/* ── States ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Dropdown } from "@nili/ui"

export function Example() {
  return (
    <>
      <Dropdown disabled label="Disabled" options={options} />
      <Dropdown
        label="Required field"
        options={options}
        error="Please select an option"
      />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Dropdown
            label={t('disabled')}
            placeholder={t('cannotChange')}
            options={ICON_OPTIONS}
            defaultValue="design"
            disabled
          />
          <Dropdown
            label={t('requiredField')}
            sublabel={t('optional')}
            information
            placeholder={t('select')}
            options={ICON_OPTIONS}
            error="Please select an option"
          />
        </div>
      </DemoSection>
    </div>
  );
}
