/** Docs-only: Figma Quick Actions Search Input, Items and Footer (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
  RiFlashlightFill,
  RiInformationLine,
  RiSearch2Line,
  RiUser6Line,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { QuickActionItem } from './quick-actions';

/** Figma Quick Actions Search Input: Default · Hover/Filled · Focus. */
export function QuickActionsSearchSet() {
  const { t } = useTranslation();
  const rows = [
    {
      key: 'docs.stateDefault',
      trailing: (
        <Icon icon={RiInformationLine} size={16} className="text-soft-400" />
      ),
    },
    {
      key: 'docs.stateHover',
      trailing: (
        <Icon icon={RiInformationLine} size={16} className="text-soft-400" />
      ),
    },
    {
      key: 'docs.stateFocus',
      trailing: <span className="text-soft-400">×</span>,
      focused: true,
    },
  ];
  return (
    <div className="flex w-[460px] max-w-full flex-col gap-3">
      {rows.map((row) => (
        <div key={row.key} className="flex flex-col gap-1.5">
          <Caption>{t(row.key)}</Caption>
          <div
            className={
              'flex h-11 items-center gap-2 rounded-xl border bg-white-0 px-3.5 text-[14px] ' +
              (row.focused
                ? 'border-primary-base text-primary-base'
                : 'border-soft-200 text-sub-600')
            }
          >
            <Icon
              icon={RiSearch2Line}
              size={20}
              className={row.focused ? 'text-primary-base' : 'text-soft-400'}
            />
            <span className="flex-1">
              {t('quickActionsDocs.searchPlaceholder')}
            </span>
            <kbd className="rounded-md border border-soft-200 bg-weak-50 px-1.5 py-0.5 text-[12px] text-sub-600">
              {t('quickActionsDocs.shortcutKey')}
            </kbd>
            {row.trailing}
          </div>
        </div>
      ))}
    </div>
  );
}

const LEADS: [ReactNode, string][] = [
  [null, 'text'],
  [
    <Avatar
      key="a"
      size="2xs"
      name="Sophia Williams"
      src="/avatars/persona.png"
      bottomStatus="online"
    />,
    'avatar',
  ],
  [<Icon key="i" icon={RiUser6Line} />, 'icon'],
  [
    <span
      key="b"
      className="flex size-5 items-center justify-center rounded-full bg-success-base text-static-white"
    >
      <Icon icon={RiFlashlightFill} size={12} />
    </span>,
    'brand',
  ],
];

/** Figma Quick Actions Items: four leads × Default · Hover · Active, with and without description. */
export function QuickActionsItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-2 bg-soft-200 p-6">
      {LEADS.map(([lead, key]) =>
        [false, true].map((withDescription) =>
          (['default', 'hover', 'active'] as const).map((state) => (
            <QuickActionItem
              key={`${key}-${withDescription}-${state}`}
              appearance="list"
              size="sm"
              icon={lead}
              iconWrapper={false}
              active={state === 'active'}
              endAdornment={
                <Icon
                  icon={RiArrowRightSLine}
                  size={20}
                  className="text-sub-600 rtl:-scale-x-100"
                />
              }
              description={
                withDescription ? t('quickActionsDocs.description') : undefined
              }
              className="bg-white-0"
              {...(state === 'hover' ? { 'data-nili-state': 'hover' } : {})}
            >
              {t('quickActionsDocs.label')}
            </QuickActionItem>
          )),
        ),
      )}
    </div>
  );
}

/** Figma Quick Actions Footer: keyboard hints and a Help Center link. */
export function QuickActionsFooterSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[600px] max-w-full items-center justify-between border-t border-soft-200 px-4 py-3 text-[12px] leading-4 text-sub-600">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
            <Icon icon={RiArrowUpLine} size={14} />
          </kbd>
          <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
            <Icon icon={RiArrowDownLine} size={14} />
          </kbd>
          {t('quickActionsDocs.navigate')}
        </span>
        <span className="flex items-center gap-1">
          <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
            <Icon icon={RiCornerDownLeftLine} size={14} />
          </kbd>
          {t('quickActionsDocs.select')}
        </span>
      </div>
      <span>
        {t('quickActionsDocs.notFound')}{' '}
        <LinkButton color="primary" size="sm" underline href="#">
          {t('quickActionsDocs.helpCenter')}
        </LinkButton>
      </span>
    </div>
  );
}
