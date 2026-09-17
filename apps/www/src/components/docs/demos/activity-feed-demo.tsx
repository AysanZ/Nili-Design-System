'use client';

import { useState } from 'react';
import { RiMore2Fill, RiAttachment2 } from '@remixicon/react';
import {
  ActivityFeed,
  ActivityFeedItem,
  ActivityFeedTab,
  ActivityFeedTabSeparator,
  ActivityFeedFooter,
  ActivityFeedKey,
  Avatar,
  Badge,
  Button,
  CompactButton,
  LinkButton,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { activityFeedText } from './activity-feed-demo.text';

/**
 * Responsive overview for Activity Feed — the notification panel.
 */
export function ActivityFeedDemo() {
  const t = useDemoText(activityFeedText);
  const [tab, setTab] = useState('all');

  const menu = (
    <CompactButton appearance="ghost" aria-label={t('more')}>
      <Icon icon={RiMore2Fill} />
    </CompactButton>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* ── Item types ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('types.title')}
        description={t('types.body')}
        code={`import { ActivityFeedItem, Avatar, Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <ActivityFeedItem
        type="basic"
        avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
        title="Ada Lovelace commented"
        timestamp="8 min ago"
        subject="Design system"
        description="This looks good to me — shipping it."
      />

      <ActivityFeedItem
        type="button"
        avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
        title="Grace Hopper wants to join"
        timestamp="1 h ago"
        actions={
          <>
            <Button size="xs">Accept</Button>
            <Button size="xs" appearance="stroke">Decline</Button>
          </>
        }
      />

      <ActivityFeedItem
        type="file"
        title="Katherine shared a file"
        file={{ name: "annual-report.pdf", size: "4mb", href: "#" }}
      />

      <ActivityFeedItem
        type="message"
        title="Radia replied"
        message="Can we move the review to Thursday?"
      />
    </>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <ActivityFeed label={t('types.label')}>
            <ActivityFeedItem
              type="basic"
              avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
              title={t('item.commented')}
              timestamp={t('time.8min')}
              subject={t('item.designSystem')}
              description={t('item.commentBody')}
              menu={menu}
            />
            <ActivityFeedItem
              type="button"
              avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
              title={t('item.wantsToJoin')}
              timestamp={t('time.1h')}
              actions={
                <>
                  <Button size="xs">{t('item.accept')}</Button>
                  <Button size="xs" appearance="stroke">
                    {t('item.decline')}
                  </Button>
                </>
              }
              menu={menu}
            />
            <ActivityFeedItem
              type="file"
              avatar={
                <Avatar size="sm" name="Katherine Johnson" tone="green" />
              }
              title={t('item.sharedFile')}
              timestamp={t('time.3h')}
              file={{
                name: 'annual-report.pdf',
                size: '4mb',
                href: '#',
                icon: <Icon icon={RiAttachment2} />,
              }}
              menu={menu}
            />
            <ActivityFeedItem
              type="message"
              avatar={<Avatar size="sm" name="Radia Perlman" tone="pink" />}
              title={t('item.replied')}
              timestamp={t('time.yesterday')}
              message={t('item.replyBody')}
              menu={menu}
            />
          </ActivityFeed>
        </div>
      </DemoSection>

      {/* ── Unread & selectable ─────────────────────────────────────── */}
      <DemoSection
        title={t('unread.title')}
        description={t('unread.body')}
        code={`import { ActivityFeedItem } from "@nili/ui"

export function Example() {
  return (
    <>
      <ActivityFeedItem
        unread
        onSelect={() => open(notification)}
        title="Ada Lovelace mentioned you"
        timestamp="8 min ago"
        badge={<Badge size="small" color="blue" appearance="lighter">New</Badge>}
      />
      <ActivityFeedItem
        onSelect={() => open(notification)}
        title="Already read"
        timestamp="2 days ago"
      />
    </>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <ActivityFeed label={t('unread.label')}>
            <ActivityFeedItem
              unread
              onSelect={() => undefined}
              avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
              title={t('unread.mentioned')}
              timestamp={t('time.8min')}
              subject={t('item.designSystem')}
              badge={
                <Badge size="small" color="blue" appearance="lighter">
                  {t('unread.new')}
                </Badge>
              }
              menu={menu}
            />
            <ActivityFeedItem
              onSelect={() => undefined}
              avatar={<Avatar size="sm" name="Barbara Liskov" tone="yellow" />}
              title={t('unread.approved')}
              timestamp={t('time.2days')}
              menu={menu}
            />
          </ActivityFeed>
        </div>
      </DemoSection>

      {/* ── Full panel ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('panel.title')}
        description={t('panel.body')}
        code={`import {
  ActivityFeed, ActivityFeedItem, ActivityFeedTab,
  ActivityFeedTabSeparator, ActivityFeedFooter, LinkButton,
} from "@nili/ui"

export function Example() {
  const [tab, setTab] = useState("all")

  return (
    <ActivityFeed
      label="Notifications"
      title="Notifications"
      headerAction={<LinkButton color="primary" size="sm">Mark all as read</LinkButton>}
      tabs={
        <>
          <ActivityFeedTab selected={tab === "all"} onClick={() => setTab("all")}>
            All
          </ActivityFeedTab>
          <ActivityFeedTab
            selected={tab === "unread"}
            onClick={() => setTab("unread")}
            count={3}
          >
            Unread
          </ActivityFeedTab>
          <ActivityFeedTabSeparator />
          <ActivityFeedTab selected={tab === "mentions"} onClick={() => setTab("mentions")}>
            Mentions
          </ActivityFeedTab>
        </>
      }
      footer={
        <ActivityFeedFooter
          hint={<><ActivityFeedKey>↑</ActivityFeedKey><ActivityFeedKey>↓</ActivityFeedKey> to navigate</>}
          action={<LinkButton href="#" size="sm">See all activity</LinkButton>}
        />
      }
    >
      …
    </ActivityFeed>
  )
}`}
      >
        <div className="flex w-full flex-col gap-2">
          <DemoLabel>{t('panel.currentTab').replace('{tab}', tab)}</DemoLabel>
          <div className="w-full max-w-lg">
            <ActivityFeed
              label={t('panel.notifications')}
              title={t('panel.notifications')}
              headerAction={
                <LinkButton color="primary" size="sm">
                  {t('panel.markAll')}
                </LinkButton>
              }
              tabs={
                <>
                  <ActivityFeedTab
                    selected={tab === 'all'}
                    onClick={() => setTab('all')}
                  >
                    {t('panel.tabAll')}
                  </ActivityFeedTab>
                  <ActivityFeedTab
                    selected={tab === 'unread'}
                    onClick={() => setTab('unread')}
                    count={3}
                  >
                    {t('panel.tabUnread')}
                  </ActivityFeedTab>
                  <ActivityFeedTabSeparator />
                  <ActivityFeedTab
                    selected={tab === 'mentions'}
                    onClick={() => setTab('mentions')}
                  >
                    {t('panel.tabMentions')}
                  </ActivityFeedTab>
                </>
              }
              tabsAction={
                <CompactButton appearance="ghost" aria-label={t('panel.filter')}>
                  <Icon icon={RiMore2Fill} />
                </CompactButton>
              }
              footer={
                <ActivityFeedFooter
                  hint={
                    <>
                      <ActivityFeedKey>↑</ActivityFeedKey>
                      <ActivityFeedKey>↓</ActivityFeedKey>
                      <span className="text-[12px] text-sub-600">
                        {t('panel.navigate')}
                      </span>
                    </>
                  }
                  action={
                    <LinkButton href="#" size="sm">
                      {t('panel.seeAll')}
                    </LinkButton>
                  }
                />
              }
            >
              <ActivityFeedItem
                unread
                onSelect={() => undefined}
                avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
                title={t('unread.mentioned')}
                timestamp={t('time.8min')}
                subject={t('item.designSystem')}
                description={t('panel.badgeQuestion')}
                menu={menu}
              />
              <ActivityFeedItem
                unread
                onSelect={() => undefined}
                avatar={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
                title={t('item.wantsToJoinShort')}
                timestamp={t('time.1h')}
                actions={
                  <>
                    <Button size="xs">{t('item.accept')}</Button>
                    <Button size="xs" appearance="stroke">
                      {t('item.decline')}
                    </Button>
                  </>
                }
                menu={menu}
              />
              <ActivityFeedItem
                onSelect={() => undefined}
                avatar={
                  <Avatar size="sm" name="Katherine Johnson" tone="green" />
                }
                title={t('item.sharedFile')}
                timestamp={t('time.3h')}
                file={{ name: 'annual-report.pdf', size: '4mb', href: '#' }}
                menu={menu}
              />
            </ActivityFeed>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
