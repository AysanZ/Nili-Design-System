import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiSparklingFill } from '@remixicon/react';
import { Banner } from '.';
import { Icon } from '@components/icon';
import { Button } from '@components/button';

const meta: Meta<typeof Banner> = {
  title: 'Base Components/Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The **Banner** component delivers crucial alerts and information prominently at the top of the screen. Generated from the Figma "❖ Banner" page.

**Key Features:**
- **5 Statuses**: Error, Warning, Success, Information, Feature
- **4 Appearances**: Filled, Light, Lighter, Stroke
- **Fixed 44px height**, full container width — no size axis, by design
- **Inline action** link and an optional dismiss button
- **\`sticky\`** pins it to the top of the viewport

**Banner vs Alert**

They share a colour matrix on purpose, but they are not interchangeable:

| | Alert | Banner |
| --- | --- | --- |
| Placement | next to the thing it describes | top of the page |
| Height | wraps, 3 sizes | one line, fixed 44px |
| Trigger | something the user just did | the whole session |
| Default urgency | \`assertive\` for errors | \`polite\` for everything |

That last row matters. A banner is usually already on screen when the page loads, so announcing it assertively interrupts a screen-reader user on **every single navigation**. Pass \`urgency="assertive"\` only when the banner appears mid-session in response to an event.

**RTL**

The dismiss button uses \`end-3\`, not \`right-3\`. Switch the Locale toolbar to فارسی — it moves to the left corner on its own, and the status icon leads from the right.`,
      },
    },
  },

  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['error', 'warning', 'success', 'info', 'feature'],
      description: 'Semantic status. Also picks the default icon.',
      table: { defaultValue: { summary: 'info' } },
    },
    appearance: {
      control: { type: 'select' },
      options: ['filled', 'light', 'lighter', 'stroke'],
      description: 'Visual treatment.',
      table: { defaultValue: { summary: 'filled' } },
    },
    title: { control: 'text', description: 'Leading message. Required.' },
    description: {
      control: 'text',
      description: 'Optional detail, shown after the title separated by a `∙`.',
    },
    icon: {
      control: 'boolean',
      description: 'Show the default status glyph. Pass a node to override it.',
      table: { defaultValue: { summary: 'true' } },
    },
    action: { control: false, table: { type: { summary: 'BannerAction' } } },
    dismissible: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    dismissLabel: {
      control: 'text',
      description: 'Accessible name for the close button.',
    },
    sticky: {
      control: 'boolean',
      description: 'Pin to the top of the viewport.',
      table: { defaultValue: { summary: 'false' } },
    },
    urgency: {
      control: { type: 'select' },
      options: ['assertive', 'polite', 'off'],
      description:
        'How assistive tech announces it. `polite` by default — a banner is usually already on screen at load.',
      table: { defaultValue: { summary: 'polite' } },
    },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Banner> = ({
  title,
  description,
  action,
  ...args
}) => {
  const { t } = useTranslation();
  return (
    <Banner
      {...args}
      title={typeof title === 'string' ? t(title) : title}
      description={
        typeof description === 'string' ? t(description) : description
      }
      action={action ? { ...action, label: t(action.label) } : undefined}
      dismissLabel={t('banner.dismiss')}
    />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  status: 'error',
  appearance: 'filled',
  title: 'banner.defaultTitle',
  description: 'banner.defaultDescription',
  action: { label: 'banner.upgradeCta', href: '#' },
  dismissible: true,
};

export const TitleOnly = Template.bind({});
TitleOnly.args = {
  status: 'info',
  appearance: 'light',
  title: 'banner.maintenanceTitle',
  description: 'banner.maintenanceDescription',
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = {
  status: 'feature',
  appearance: 'lighter',
  title: 'banner.featureTitle',
  description: 'banner.featureDescription',
  icon: false,
  action: { label: 'banner.learnMore', href: '#' },
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  status: 'feature',
  appearance: 'filled',
  title: 'banner.featureTitle',
  description: 'banner.featureDescription',
  icon: <Icon icon={RiSparklingFill} />,
  action: { label: 'banner.learnMore', href: '#' },
};

// ====================== Full Matrix ======================

const STATUSES = ['error', 'warning', 'success', 'info', 'feature'] as const;
const APPEARANCES = ['filled', 'light', 'lighter', 'stroke'] as const;

/** The whole 4 × 5 grid. Flip to Dark Mode: every row must stay legible. */
export const AllCombinations = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      {APPEARANCES.map((appearance) => (
        <div key={appearance} className="flex flex-col gap-1">
          <span className="px-12 text-[12px] font-medium uppercase tracking-wider text-sub-600">
            {appearance}
          </span>
          {STATUSES.map((status) => (
            <Banner
              key={status}
              status={status}
              appearance={appearance}
              urgency="off"
              title={`${t('common.status')}: ${status}`}
              description={t('banner.defaultDescription')}
              action={{ label: t('common.action'), href: '#' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const AllStatuses = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      {STATUSES.map((status) => (
        <Banner
          key={status}
          status={status}
          appearance="filled"
          urgency="off"
          title={`${t('common.status')}: ${status}`}
          description={t('banner.defaultDescription')}
          dismissible
          dismissLabel={t('banner.dismiss')}
        />
      ))}
    </div>
  );
};

// ====================== Dismiss ======================

/** Dismissing is real state — the banner actually unmounts. */
export const Dismissible = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex flex-col items-start gap-4">
      {visible ? (
        <Banner
          status="warning"
          appearance="light"
          title={t('banner.trialTitle')}
          description={t('banner.trialDescription')}
          action={{ label: t('banner.upgrade') }}
          dismissible
          dismissLabel={t('banner.dismiss')}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <div className="p-12">
          <Button
            size="sm"
            appearance="stroke"
            color="neutral"
            onClick={() => setVisible(true)}
          >
            {t('banner.bringBack')}
          </Button>
        </div>
      )}
    </div>
  );
};

// ====================== In context ======================

/** `sticky` keeps the banner pinned while the page scrolls beneath it. */
export const StickyInPage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-[420px] overflow-y-auto">
      <Banner
        sticky
        status="info"
        appearance="filled"
        urgency="off"
        title={t('banner.demoTitle')}
        description={t('banner.demoDescription')}
        action={{ label: t('banner.createReal'), href: '#' }}
      />
      <div className="flex flex-col gap-4 p-12">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-[14px] leading-6 text-sub-600">
            {t('banner.scrollHint')} {index + 1}
          </p>
        ))}
      </div>
    </div>
  );
};

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Banner
        status="warning"
        appearance="filled"
        urgency="off"
        title={t('banner.trialTitle')}
        description={t('banner.trialDescription')}
        action={{ label: t('banner.upgrade'), href: '#' }}
        dismissible
        dismissLabel={t('banner.dismiss')}
      />
      <Banner
        status="info"
        appearance="light"
        urgency="off"
        title={t('banner.maintenanceTitle')}
        description={t('banner.maintenanceDescription')}
      />
      <Banner
        status="feature"
        appearance="lighter"
        urgency="off"
        title={t('banner.featureTitle')}
        description={t('banner.featureDescription')}
        action={{ label: t('banner.learnMore'), href: '#' }}
      />
    </div>
  );
};

export default meta;
