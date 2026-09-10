/** Docs-only: Figma Tab Menu Horizontal/Vertical Items and sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { RiLayoutGridLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { Tabs, TabsList, TabsTrigger } from './tabs';

/** Figma Tab Menu Horizontal Items: Default · Hover · Active (selected). */
export function TabMenuHorizontalItemsSet() {
  const { t } = useTranslation();
  const states = [
    { key: 'docs.stateDefault', props: {} },
    { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
    { key: 'docs.stateFocus', props: { value: 'a' } },
  ] as const;
  return (
    <div className="flex items-center gap-6">
      {states.map((s) => (
        <Tabs
          key={s.key}
          defaultValue={s.key === 'docs.stateFocus' ? 'a' : undefined}
          orientation="horizontal"
        >
          <TabsList>
            <TabsTrigger
              value="a"
              startIcon={<Icon icon={RiLayoutGridLine} />}
              {...s.props}
            >
              {t('tabMenuDocs.overview')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  );
}

/** Figma Tab Menu Horizontal: rows of 2–6 tabs, first one selected. */
export function TabMenuHorizontalSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[700px] max-w-full flex-col gap-6">
      {[2, 3, 4, 5, 6].map((count) => (
        <Tabs key={count} defaultValue="0" orientation="horizontal">
          <TabsList label={t('tabMenuDocs.sectionHorizontal')}>
            {Array.from({ length: count }, (_, i) => (
              <TabsTrigger key={i} value={String(i)}>
                {t('tabMenuDocs.overview')}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ))}
    </div>
  );
}

/** Figma Tab Menu Vertical Items: Default · Hover · Active. */
export function TabMenuVerticalItemsSet() {
  const { t } = useTranslation();
  const states = [
    { key: 'docs.stateDefault', selected: false },
    {
      key: 'docs.stateHover',
      selected: false,
      attrs: { 'data-nili-state': 'hover' },
    },
    { key: 'docs.stateFocus', selected: true },
  ];
  return (
    <div className="flex items-center gap-6">
      {states.map((s) => (
        <Tabs
          key={s.key}
          defaultValue={s.selected ? 'a' : undefined}
          orientation="vertical"
          appearance="card"
        >
          <TabsList className="w-[180px]">
            <TabsTrigger
              value="a"
              startIcon={<Icon icon={RiLayoutGridLine} />}
              {...(s.attrs ?? {})}
            >
              {t('tabMenuDocs.overview')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  );
}

/** Figma Tab Menu Vertical: "Select Menu" caption over a card list, 2–8 items. */
export function TabMenuVerticalSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {[2, 3, 5, 6, 7, 8].map((count) => (
        <div key={count} className="flex flex-col gap-2">
          <Caption>{t('tabMenuDocs.selectMenu')}</Caption>
          <Tabs defaultValue="0" orientation="vertical" appearance="card">
            <TabsList label={t('tabMenuDocs.selectMenu')} className="w-[220px]">
              {Array.from({ length: count }, (_, i) => (
                <TabsTrigger
                  key={i}
                  value={String(i)}
                  startIcon={<Icon icon={RiLayoutGridLine} />}
                >
                  {t('tabMenuDocs.overview')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  );
}
