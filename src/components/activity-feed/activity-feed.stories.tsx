import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from '.';
import { FigmaFrame } from '../../docs/figma.docs';
import {
  FeedFooter,
  FeedItem,
  FilterButton,
  FooterSet,
  MarkAllRead,
  TabList,
  HeaderSet,
  ItemsSet,
  TabsSet,
} from './activity-feed.docs';
import { useTranslation } from 'react-i18next';

const meta: Meta<typeof ActivityFeed> = {
  title: 'Base Components/Activity Feed',
  component: ActivityFeed,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Activity Feed [1.0]** — four component sets that compose into one card.

| Figma component | Code |
| --- | --- |
| Activity Feed Header | \`title\` + \`headerAction\` (or \`<ActivityFeedHeader>\`) |
| Activity Feed Tab Menu (Quantity 02–04) | \`tabs\` + \`tabsAction\` with \`<ActivityFeedTab count>\` and \`<ActivityFeedTabSeparator>\` |
| Activity Feed Items (Type × State) | \`<ActivityFeedItem type="basic" \\| "button" \\| "file" \\| "message">\` |
| Activity Feed Footer | \`footer\` with \`<ActivityFeedFooter hint action>\` and \`<ActivityFeedKey>\` |

**Measurements from the Figma export**

- **Header:** 56px, 20px side padding, a 16/24 medium title, and a primary Link Button.
- **Tab Menu:** 48px. Tabs are 20px apart and use Label/Small. The selected tab has a 2px primary underline exactly as wide as its label, and the count is a 16px red circle.
- **Items:** rounded 12 with 12px padding. They turn from white to weak-50 on hover, which also reveals the "more" button.
  - A 40px avatar sits 16px from a title and a 12px meta line (time · logo subject).
  - The body starts 16px below the avatar and lines up with the title.
- **Footer:** 48px, with a 12px hint using key caps and a small gray Link Button.

**Quantity** is how many tabs you pass, not a prop. **State** (hover) is CSS.

\`onSelect\` makes the title a real button stretched over the card, so actions and the menu stay separate, valid buttons.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

/** The four sets composed into one card, as they are used in a product. */
export const Composed: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <div className="w-[540px] max-w-full">
        <ActivityFeed
          label={t('activityFeedDocs.headerTitle')}
          title={t('activityFeedDocs.headerTitle')}
          headerAction={<MarkAllRead />}
          tabs={<TabList quantity={4} />}
          tabsAction={<FilterButton />}
          footer={<FeedFooter />}
        >
          <FeedItem type="basic" name="Sophia Williams" />
          <FeedItem type="button" name="Arthur Taylor" tone="purple" />
          <FeedItem type="file" name="Emma Wright" tone="green" />
          <FeedItem type="message" name="Matthew Johnson" tone="yellow" />
        </ActivityFeed>
      </div>
    );
  },
};

const setParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

export const Header: Story = {
  name: 'Activity Feed Header',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <HeaderSet />
    </FigmaFrame>
  ),
};

export const TabMenu: Story = {
  name: 'Activity Feed Tab Menu',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <TabsSet />
    </FigmaFrame>
  ),
};

export const Items: Story = {
  name: 'Activity Feed Items',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <ItemsSet />
    </FigmaFrame>
  ),
};

export const Footer: Story = {
  name: 'Activity Feed Footer',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <FooterSet />
    </FigmaFrame>
  ),
};
