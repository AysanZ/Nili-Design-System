import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ActivityFeed, ActivityFeedItem, ActivityFeedTab } from '.';
import { Avatar } from '@components/avatar';
import { Badge } from '@components/badge';
import { Button, LinkButton } from '@components/button';

const meta: Meta<typeof ActivityFeed> = {
  title: 'Base Components/Activity Feed',
  component: ActivityFeed,
  parameters: {
    docs: {
      description: {
        component: `The **Activity Feed** component, from the Figma "Activity Feed" page.

**Key Features:**
- **Header** with a title and a trailing action
- **Tab menu** — Figma models Quantity 02–04; here the count is however many tabs you pass
- **4 item types**: Basic, Button, File, Message
- **\`unread\`** marker on the leading edge
- **\`onSelect\`** turns a row into a real \`<button>\`

**Why the four types are one component.** Figma's Type axis describes content shape, not four separate components: \`basic\` is text, \`button\` adds actions, \`file\` adds an attachment card, \`message\` adds a quoted body. Splitting them would duplicate the avatar, timestamp and unread handling four times over.

**Semantics.** A labelled \`<section>\` wrapping a \`<ul>\`, so a screen reader announces "list, 4 items" instead of an undifferentiated wall of text. A clickable \`<li>\` is not keyboard reachable, so \`onSelect\` renders a \`<button>\` inside the item rather than putting a handler on the row.

**RTL.** The unread marker uses \`before:start-0\` and the quoted message uses \`border-s-2\`, so both sit on the leading edge in Persian without a second rule.`,
      },
    },
  },
};

// ====================== All item types ======================

export const Default = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-xl">
      <ActivityFeed
        title={t('activityFeed.title')}
        label={t('activityFeed.label')}
        headerAction={
          <LinkButton size="sm" color="primary" href="#">
            {t('activityFeed.viewAll')}
          </LinkButton>
        }
      >
        <ActivityFeedItem
          type="message"
          unread
          avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
          title={t('activityFeed.commented')}
          timestamp={t('activityFeed.minutes')}
          message={t('activityFeed.commentBody')}
        />
        <ActivityFeedItem
          type="file"
          avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
          title={t('activityFeed.uploaded')}
          timestamp={t('activityFeed.hours')}
          file={{
            name: t('activityFeed.fileName'),
            size: t('activityFeed.fileSize'),
          }}
        />
        <ActivityFeedItem
          type="button"
          avatar={<Avatar size="sm" name="Alan Turing" tone="green" />}
          title={t('activityFeed.invited')}
          description={t('activityFeed.invitedDescription')}
          timestamp={t('activityFeed.yesterday')}
          actions={
            <>
              <Button size="2xs" color="primary">
                {t('activityFeed.accept')}
              </Button>
              <Button size="2xs" color="neutral" appearance="stroke">
                {t('activityFeed.decline')}
              </Button>
            </>
          }
        />
        <ActivityFeedItem
          type="basic"
          avatar={<Avatar size="sm" name="Katherine Johnson" tone="yellow" />}
          title={t('activityFeed.shipped')}
          description={t('activityFeed.shippedDescription')}
          timestamp={t('activityFeed.yesterday')}
        />
      </ActivityFeed>
    </div>
  );
};

// ====================== Tabs ======================

export const WithTabs = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('all');
  return (
    <div className="w-full max-w-xl">
      <ActivityFeed
        title={t('activityFeed.title')}
        label={t('activityFeed.label')}
        tabs={
          <>
            <ActivityFeedTab
              selected={tab === 'all'}
              onClick={() => setTab('all')}
              badge={
                <Badge size="small" appearance="lighter" color="gray">
                  4
                </Badge>
              }
            >
              {t('activityFeed.all')}
            </ActivityFeedTab>
            <ActivityFeedTab
              selected={tab === 'mentions'}
              onClick={() => setTab('mentions')}
            >
              {t('activityFeed.mentions')}
            </ActivityFeedTab>
            <ActivityFeedTab
              selected={tab === 'files'}
              onClick={() => setTab('files')}
            >
              {t('activityFeed.files')}
            </ActivityFeedTab>
          </>
        }
      >
        <ActivityFeedItem
          unread
          avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
          title={t('activityFeed.commented')}
          timestamp={t('activityFeed.minutes')}
        />
        <ActivityFeedItem
          avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
          title={t('activityFeed.uploaded')}
          timestamp={t('activityFeed.hours')}
        />
      </ActivityFeed>
    </div>
  );
};

// ====================== Selectable rows ======================

/** `onSelect` makes each row a real button, so the list is keyboard navigable. */
export const SelectableRows = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-xl">
      <ActivityFeed label={t('activityFeed.label')}>
        <ActivityFeedItem
          unread
          onSelect={() => {}}
          avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
          title={t('activityFeed.commented')}
          timestamp={t('activityFeed.minutes')}
        />
        <ActivityFeedItem
          onSelect={() => {}}
          avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
          title={t('activityFeed.uploaded')}
          timestamp={t('activityFeed.hours')}
        />
      </ActivityFeed>
    </div>
  );
};

export default meta;
