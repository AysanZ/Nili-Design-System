import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiUser3Line,
  RiBankCardLine,
  RiTeamLine,
  RiNotification3Line,
} from '@remixicon/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '.';
import { Icon } from '@components/icon';
import { Badge } from '@components/badge';
import { FigmaFrame } from '../../docs/figma.docs';
import {
  TabMenuHorizontalItemsSet,
  TabMenuHorizontalSet,
  TabMenuVerticalItemsSet,
  TabMenuVerticalSet,
} from './tabs.docs';

const meta: Meta<typeof Tabs> = {
  title: 'Base Components/Tab Menu/Tab Menu',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `The **Tab Menu**, from the Figma "❖ Tab Menu" page: three types, two directions, two sizes, with optional icons and badges.

**Key Features:**
- **3 Appearances**: \`line\`, \`segmented\`, \`pill\`
- **2 Orientations**: horizontal and vertical
- **\`stretch\`** to share the width instead of hugging labels
- **\`activationMode\`**: \`automatic\` (WAI-ARIA default) or \`manual\`
- **\`keepMounted\`** on a panel that is expensive to rebuild

**Quantity is not a prop.** Figma models 02–05 tabs as variants; in code the count is however many children you pass, so a six-tab menu is not a special case.

**Why the whole ARIA pattern.** A row of buttons that swaps a \`<div>\` is a tab menu to a sighted user and nothing at all to anyone else. What makes it real is small but has to be complete: \`role="tablist"\`, \`aria-selected\`, each tab pointing at its panel through \`aria-controls\` and each panel back through \`aria-labelledby\`, and **roving focus** — one Tab stop for the whole set, arrow keys to move within it. Without the last part a keyboard user presses Tab five times to walk past a tab menu to reach the content it describes.

**Activation mode matters when panels fetch.** \`automatic\` selects as focus arrives, which is right when panels are cheap. Arrowing past four tabs that each load data fires four requests — use \`manual\` there, and the user confirms with Enter or Space.

**RTL**

Arrow keys follow the reading direction: \`ArrowRight\` is *next* in English and *previous* in Persian. The active underline is a pseudo-element pinned to the inline box, so it stays under its label when the row reverses, and the vertical marker uses a logical inset so it sits on the trailing edge of the column in both directions. Switch the Locale toolbar to فارسی.`,
      },
    },
  },
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: ['card', 'list'],
      table: { defaultValue: { summary: 'list' } },
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    activationMode: {
      control: { type: 'inline-radio' },
      options: ['automatic', 'manual'],
      table: { defaultValue: { summary: 'automatic' } },
    },
    onValueChange: { action: 'tab changed' },
  },
};

const Template: StoryFn<typeof Tabs> = (args) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(args.value ?? 'account');
  return (
    <div className="w-[520px]">
      <Tabs {...args} value={value} onValueChange={setValue}>
        <TabsList label={t('tabs.label')}>
          <TabsTrigger value="account">{t('tabs.account')}</TabsTrigger>
          <TabsTrigger value="billing">{t('tabs.billing')}</TabsTrigger>
          <TabsTrigger value="team">{t('tabs.team')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('tabs.alerts')}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">{t('tabs.accountPanel')}</TabsContent>
        <TabsContent value="billing">{t('tabs.billingPanel')}</TabsContent>
        <TabsContent value="team">{t('tabs.teamPanel')}</TabsContent>
        <TabsContent value="alerts">{t('tabs.alertsPanel')}</TabsContent>
      </Tabs>
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

/** Figma's vertical `Style`. There is no style axis on a horizontal tab menu. */
export const VerticalList = Template.bind({});
VerticalList.args = { orientation: 'vertical', appearance: 'list' };

export const VerticalCard = Template.bind({});
VerticalCard.args = { orientation: 'vertical', appearance: 'card' };

/** Tabs share the width — the mobile segmented control. */
export const Stretch = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[360px]">
      <Tabs defaultValue="account">
        <TabsList label={t('tabs.label')} stretch>
          <TabsTrigger value="account">{t('tabs.account')}</TabsTrigger>
          <TabsTrigger value="billing">{t('tabs.billing')}</TabsTrigger>
          <TabsTrigger value="team">{t('tabs.team')}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">{t('tabs.accountPanel')}</TabsContent>
        <TabsContent value="billing">{t('tabs.billingPanel')}</TabsContent>
        <TabsContent value="team">{t('tabs.teamPanel')}</TabsContent>
      </Tabs>
    </div>
  );
};

// ====================== Icons & badges ======================

export const WithIconsAndBadges = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[520px]">
      <Tabs defaultValue="account">
        <TabsList label={t('tabs.label')}>
          <TabsTrigger value="account" startIcon={<Icon icon={RiUser3Line} />}>
            {t('tabs.account')}
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            startIcon={<Icon icon={RiBankCardLine} />}
          >
            {t('tabs.billing')}
          </TabsTrigger>
          <TabsTrigger
            value="team"
            startIcon={<Icon icon={RiTeamLine} />}
            badge={
              <Badge appearance="light" color="gray" size="small">
                12
              </Badge>
            }
          >
            {t('tabs.team')}
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            startIcon={<Icon icon={RiNotification3Line} />}
            badge={
              <Badge appearance="light" color="red" size="small">
                3
              </Badge>
            }
          >
            {t('tabs.alerts')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">{t('tabs.accountPanel')}</TabsContent>
        <TabsContent value="billing">{t('tabs.billingPanel')}</TabsContent>
        <TabsContent value="team">{t('tabs.teamPanel')}</TabsContent>
        <TabsContent value="alerts">{t('tabs.alertsPanel')}</TabsContent>
      </Tabs>
    </div>
  );
};

// ====================== Disabled & manual ======================

export const DisabledTab = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[520px]">
      <Tabs defaultValue="account">
        <TabsList label={t('tabs.label')}>
          <TabsTrigger value="account">{t('tabs.account')}</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            {t('tabs.billing')}
          </TabsTrigger>
          <TabsTrigger value="team">{t('tabs.team')}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">{t('tabs.accountPanel')}</TabsContent>
        <TabsContent value="billing">{t('tabs.billingPanel')}</TabsContent>
        <TabsContent value="team">{t('tabs.teamPanel')}</TabsContent>
      </Tabs>
    </div>
  );
};

/** For panels that fetch: arrow to a tab, then confirm with Enter. */
export const ManualActivation = Template.bind({});
ManualActivation.args = { activationMode: 'manual' };

// ====================== Figma component sets ======================

export const TabMenuHorizontalItemsSetStory = () => (
  <FigmaFrame>
    <TabMenuHorizontalItemsSet />
  </FigmaFrame>
);
TabMenuHorizontalItemsSetStory.storyName = 'Tab Menu Horizontal Items';
TabMenuHorizontalItemsSetStory.parameters = {
  docs: { source: { code: null } },
};

export const TabMenuHorizontalSetStory = () => (
  <FigmaFrame>
    <TabMenuHorizontalSet />
  </FigmaFrame>
);
TabMenuHorizontalSetStory.storyName = 'Tab Menu Horizontal';
TabMenuHorizontalSetStory.parameters = { docs: { source: { code: null } } };

export const TabMenuVerticalItemsSetStory = () => (
  <FigmaFrame>
    <TabMenuVerticalItemsSet />
  </FigmaFrame>
);
TabMenuVerticalItemsSetStory.storyName = 'Tab Menu Vertical Items';
TabMenuVerticalItemsSetStory.parameters = { docs: { source: { code: null } } };

export const TabMenuVerticalSetStory = () => (
  <FigmaFrame>
    <TabMenuVerticalSet />
  </FigmaFrame>
);
TabMenuVerticalSetStory.storyName = 'Tab Menu Vertical';
TabMenuVerticalSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
