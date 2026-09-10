/** Docs-only: Figma Day Label & Cells, Period Range & Date Selector, Pickers (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Button, CompactButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { cn } from '../../lib/cn';
import { DatePicker, DatePickerFooter, DateRangePicker } from './date-picker';
import {
  dateSelectorVariants,
  dayCellVariants,
  dayLabelVariants,
  periodRangeItemVariants,
} from './date-picker.styles';

const STATES = [
  { key: 'docs.stateDefault', cell: {}, attrs: {} },
  { key: 'docs.stateHover', cell: {}, attrs: { 'data-nili-state': 'hover' } },
  { key: 'datePickerDocs.stateActive', cell: { selected: true }, attrs: {} },
  { key: 'docs.stateDisabled', cell: {}, attrs: { disabled: true } },
] as const;

export function DayCellsSet() {
  const { t } = useTranslation();
  const rows = [
    { key: 'datePickerDocs.cellBasic', cell: {} },
    { key: 'datePickerDocs.cellMarked', cell: { marked: true } },
    { key: 'datePickerDocs.cellToday', cell: { today: true } },
  ];
  return (
    <div className="flex flex-col gap-8">
      <span
        className={cn(
          dayLabelVariants(),
          'rounded-md border border-dashed border-soft-200',
        )}
      >
        {t('datePickerDocs.dayLabel')}
      </span>
      <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-6 gap-y-4">
        <span />
        {STATES.map((s) => (
          <Caption key={s.key}>{t(s.key)}</Caption>
        ))}
        {rows.map((row) => (
          <Row key={row.key} label={t(row.key)}>
            {STATES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={dayCellVariants({ ...row.cell, ...s.cell })}
                {...s.attrs}
              >
                1
              </button>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
}

export function PeriodRangeSet() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-8">
      {(
        [
          ['docs.stateDefault', {}, {}],
          ['docs.stateHover', {}, { 'data-nili-state': 'hover' }],
          ['datePickerDocs.stateActive', { selected: true }, {}],
        ] as const
      ).map(([key, v, attrs]) => (
        <div key={key} className="flex flex-col gap-2">
          <Caption>{t(key)}</Caption>
          <button
            type="button"
            className={cn(periodRangeItemVariants(v), 'w-[168px]')}
            {...attrs}
          >
            {t('datePickerDocs.today')}
          </button>
        </div>
      ))}
    </div>
  );
}

export function DateSelectorSet() {
  const arrow = (icon: typeof RiArrowLeftSLine, label: string) => (
    <CompactButton appearance="white" aria-label={label}>
      <Icon icon={icon} mirrored />
    </CompactButton>
  );
  return (
    <div className="flex flex-wrap gap-4">
      {(
        [
          [false, false],
          [true, false],
          [false, true],
          [true, true],
        ] as const
      ).map(([left, right], i) => (
        <div key={i} className={cn(dateSelectorVariants(), 'w-[288px]')}>
          {left ? arrow(RiArrowLeftSLine, '‹') : <span className="size-6" />}
          <span className="text-[14px] leading-5 font-medium text-strong-950">
            January 2024
          </span>
          {right ? arrow(RiArrowRightSLine, '›') : <span className="size-6" />}
        </div>
      ))}
    </div>
  );
}

export function PickersSet() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fa' ? 'fa' : 'en';
  const presets = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => {
    const to = new Date();
    const from = new Date();
    from.setDate(
      to.getDate() - [0, 7, 30, 90, 365, to.getDate() - 1, 0, 3650][i],
    );
    return { label: t(`datePickerDocs.p${n}`), range: { from, to } };
  });
  return (
    <div className="flex flex-wrap items-start gap-10">
      <DatePicker
        locale={locale}
        defaultValue={new Date()}
        footer={
          <DatePickerFooter>
            <Button
              size="sm"
              appearance="stroke"
              color="neutral"
              className="flex-1"
            >
              {t('datePickerDocs.cancel')}
            </Button>
            <Button size="sm" className="flex-1">
              {t('datePickerDocs.apply')}
            </Button>
          </DatePickerFooter>
        }
      />
      <DateRangePicker
        locale={locale}
        presets={presets}
        footer={
          <DatePickerFooter>
            <span className="me-auto text-[14px] leading-5 text-sub-600">
              {t('datePickerDocs.range')}
            </span>
            <Button size="sm" appearance="stroke" color="neutral">
              {t('datePickerDocs.cancel')}
            </Button>
            <Button size="sm">{t('datePickerDocs.apply')}</Button>
          </DatePickerFooter>
        }
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2">{label}</Caption>
      {children}
    </>
  );
}
