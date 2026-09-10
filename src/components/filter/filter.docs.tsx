/** Docs-only: Figma Horizontal Filter and Vertical Filter Items (see src/docs). */
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownSLine,
  RiCalendarLine,
  RiFilter3Line,
  RiSearch2Line,
  RiSettings2Line,
  RiSortDesc,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Button, ButtonGroup, ButtonGroupItem } from '../button';
import { TextInput } from '../text-input';
import { Caption } from '../../docs/figma.docs';
import { FilterListItem } from './filter';

function Tail() {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-[260px]">
        <TextInput
          size="sm"
          aria-label={t('filterDocs.search')}
          placeholder={t('filterDocs.search')}
          startIcon={<Icon icon={RiSearch2Line} />}
          shortcut="⌘1"
        />
      </div>
      <Button
        size="sm"
        appearance="stroke"
        color="neutral"
        startIcon={<Icon icon={RiFilter3Line} />}
      >
        {t('filterDocs.filter')}
      </Button>
      <Button
        size="sm"
        appearance="stroke"
        color="neutral"
        iconOnly
        aria-label={t('filterDocs.settings')}
      >
        <Icon icon={RiSettings2Line} />
      </Button>
    </>
  );
}

/** Figma Horizontal Filter: Type · Calendar and Type · Table. */
export function HorizontalFilterSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[1080px] max-w-full flex-col gap-8">
      <Caption>{t('filterDocs.calendar')}</Caption>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" appearance="stroke" color="neutral">
          {t('filterDocs.today')}
        </Button>
        <ButtonGroup size="sm" label={t('filterDocs.date')}>
          <ButtonGroupItem endIcon={<Icon icon={RiArrowDownSLine} />}>
            {t('filterDocs.last7')}
          </ButtonGroupItem>
          <ButtonGroupItem startIcon={<Icon icon={RiCalendarLine} />}>
            {t('filterDocs.range')}
          </ButtonGroupItem>
        </ButtonGroup>
        <span className="flex-1" />
        <Tail />
      </div>
      <Caption>{t('filterDocs.table')}</Caption>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup size="sm" label={t('filterDocs.table')}>
          <ButtonGroupItem selected>{t('filterDocs.all')}</ButtonGroupItem>
          <ButtonGroupItem>{t('filterDocs.income')}</ButtonGroupItem>
          <ButtonGroupItem>{t('filterDocs.expenses')}</ButtonGroupItem>
        </ButtonGroup>
        <span className="flex-1" />
        <Button
          size="sm"
          appearance="stroke"
          color="neutral"
          startIcon={<Icon icon={RiSortDesc} />}
          endIcon={<Icon icon={RiArrowDownSLine} />}
        >
          {t('filterDocs.sortBy')}
        </Button>
        <Tail />
      </div>
    </div>
  );
}

/** Figma Vertical Filter Items: Default · Hover · Active. */
export function VerticalFilterItemsSet() {
  const { t } = useTranslation();
  const icon = <Icon icon={RiCalendarLine} />;
  return (
    <div className="grid w-[240px] grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4">
      <Caption>{t('docs.stateDefault')}</Caption>
      <FilterListItem startIcon={icon}>{t('filterDocs.date')}</FilterListItem>
      <Caption>{t('docs.stateHover')}</Caption>
      <FilterListItem startIcon={icon} data-nili-state="hover">
        {t('filterDocs.date')}
      </FilterListItem>
      <Caption>{t('filterDocs.stateActive')}</Caption>
      <FilterListItem startIcon={icon} active>
        {t('filterDocs.date')}
      </FilterListItem>
    </div>
  );
}
