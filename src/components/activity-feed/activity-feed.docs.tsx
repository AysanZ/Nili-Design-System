/**
 * Docs-only: the four Figma Activity Feed component sets, drawn with the
 * real components. Not part of the library (see src/docs/figma.docs.tsx).
 */
import type { ComponentProps, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiFilter3Line,
  RiFlashlightFill,
  RiMore2Line,
  RiSettings2Line,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { Button, CompactButton, LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import {
  ActivityFeedFooter,
  ActivityFeedHeader,
  ActivityFeedItem,
  ActivityFeedKey,
  ActivityFeedTab,
  ActivityFeedTabSeparator,
  ActivityFeedTabs,
} from './activity-feed';
import type { ActivityFeedItemType } from './activity-feed.types';

/** Figma sets are drawn on weak-50, 540 wide. */
function Board({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[540px] flex-col gap-6 bg-weak-50 p-6">
      {children}
    </div>
  );
}

export function MarkAllRead() {
  const { t } = useTranslation();
  return (
    <LinkButton color="primary" onClick={() => undefined}>
      {t('activityFeedDocs.markAllRead')}
    </LinkButton>
  );
}

export function FilterButton() {
  const { t } = useTranslation();
  return (
    <CompactButton appearance="ghost" aria-label={t('activityFeedDocs.filter')}>
      <Icon icon={RiFilter3Line} />
    </CompactButton>
  );
}

export function FeedHeader() {
  const { t } = useTranslation();
  return (
    <ActivityFeedHeader action={<MarkAllRead />}>
      {t('activityFeedDocs.headerTitle')}
    </ActivityFeedHeader>
  );
}

/** Figma Tab Menu tabs; Quantity is just how many are passed. */
export function TabList({ quantity = 4 }: { quantity?: 2 | 3 | 4 }) {
  const { t } = useTranslation();
  return (
    <>
      <ActivityFeedTab selected>{t('activityFeedDocs.tabAll')}</ActivityFeedTab>
      <ActivityFeedTab count={t('activityFeedDocs.count')}>
        {t('activityFeedDocs.tabInbox')}
      </ActivityFeedTab>
      {quantity >= 3 && (
        <ActivityFeedTab>{t('activityFeedDocs.tabFollowing')}</ActivityFeedTab>
      )}
      {quantity >= 4 && (
        <>
          <ActivityFeedTabSeparator />
          <ActivityFeedTab>{t('activityFeedDocs.tabArchived')}</ActivityFeedTab>
        </>
      )}
    </>
  );
}

export function FeedTabs({ quantity = 4 }: { quantity?: 2 | 3 | 4 }) {
  return (
    <ActivityFeedTabs action={<FilterButton />}>
      <TabList quantity={quantity} />
    </ActivityFeedTabs>
  );
}

export function FeedFooter() {
  const { t } = useTranslation();
  return (
    <ActivityFeedFooter
      hint={
        <>
          {t('activityFeedDocs.hintBefore')}
          <ActivityFeedKey aria-label={t('activityFeedDocs.keyUp')}>
            <Icon icon={RiArrowUpLine} size={16} />
          </ActivityFeedKey>
          <ActivityFeedKey aria-label={t('activityFeedDocs.keyDown')}>
            <Icon icon={RiArrowDownLine} size={16} />
          </ActivityFeedKey>
          {t('activityFeedDocs.hintAfter')}
        </>
      }
      action={
        <LinkButton
          size="sm"
          color="gray"
          onClick={() => undefined}
          startIcon={<Icon icon={RiSettings2Line} size={16} />}
        >
          {t('activityFeedDocs.manage')}
        </LinkButton>
      }
    />
  );
}

/** The 16px workspace logo Figma shows before the subject. */
function SubjectLogo() {
  return (
    <span className="flex size-4 items-center justify-center rounded-full bg-primary-base text-static-white">
      <Icon icon={RiFlashlightFill} size={10} />
    </span>
  );
}

export function FeedItem({
  type,
  hover = false,
  name = 'Sophia Williams',
  tone = 'blue',
}: {
  type: ActivityFeedItemType;
  hover?: boolean;
  name?: string;
  tone?: ComponentProps<typeof Avatar>['tone'];
}) {
  const { t } = useTranslation();
  return (
    <ActivityFeedItem
      type={type}
      avatar={<Avatar size="sm" name={name} tone={tone} />}
      title={t('activityFeedDocs.itemTitle')}
      timestamp={t('activityFeedDocs.timeAgo')}
      subject={t('activityFeedDocs.subject')}
      subjectIcon={<SubjectLogo />}
      description={t('activityFeedDocs.body')}
      message={t('activityFeedDocs.body')}
      file={{
        name: t('activityFeedDocs.fileName'),
        size: t('activityFeedDocs.fileSize'),
      }}
      actions={
        <>
          <Button size="xs" appearance="stroke" color="neutral">
            {t('activityFeedDocs.deny')}
          </Button>
          <Button size="xs">{t('activityFeedDocs.approve')}</Button>
        </>
      }
      menu={
        <Button
          appearance="ghost"
          color="neutral"
          iconOnly
          aria-label={t('activityFeedDocs.more')}
        >
          <Icon icon={RiMore2Line} />
        </Button>
      }
      {...(hover ? { 'data-nili-state': 'hover' } : {})}
    />
  );
}

export function HeaderSet() {
  return (
    <Board>
      <FeedHeader />
    </Board>
  );
}

export function TabsSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {([4, 3, 2] as const).map((quantity) => (
        <div key={quantity} className="flex flex-col gap-2">
          <Caption>{t(`activityFeedDocs.quantity${quantity}`)}</Caption>
          <Board>
            <FeedTabs quantity={quantity} />
          </Board>
        </div>
      ))}
    </div>
  );
}

const TYPES: { type: ActivityFeedItemType; key: string }[] = [
  { type: 'basic', key: 'activityFeedDocs.typeBasic' },
  { type: 'button', key: 'activityFeedDocs.typeButton' },
  { type: 'file', key: 'activityFeedDocs.typeFile' },
  { type: 'message', key: 'activityFeedDocs.typeMessage' },
];

/** Figma Items: four types × Default · Hover. */
export function ItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_524px_524px] items-start gap-x-6 gap-y-6">
      <span />
      <Caption>{t('docs.stateDefault')}</Caption>
      <Caption>{t('docs.stateHover')}</Caption>
      {TYPES.map(({ type, key }) => (
        <Row key={type} label={t(key)}>
          <ul className="contents">
            <FeedItem type={type} />
          </ul>
          <ul className="contents">
            <FeedItem type={type} hover />
          </ul>
        </Row>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pt-4 pe-2">{label}</Caption>
      {children}
    </>
  );
}

export function FooterSet() {
  return (
    <Board>
      <FeedFooter />
    </Board>
  );
}
