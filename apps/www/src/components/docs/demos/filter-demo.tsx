'use client';

import { useState } from 'react';
import {
  RiPriceTag3Line,
  RiCalendarLine,
  RiUserLine,
  RiSortDesc,
  RiArrowDownSLine,
  RiSearch2Line,
} from '@remixicon/react';
import {
  FilterBar,
  FilterChip,
  FilterList,
  FilterListItem,
  Button,
  ButtonGroup,
  ButtonGroupItem,
  TextInput,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { filterText } from './filter-demo.text';

/**
 * Responsive overview for Filters:
 * Horizontal FilterBar, Vertical FilterList, toolbar patterns, item states.
 */
export function FilterDemo() {
  const t = useDemoText(filterText);
  const [status, setStatus] = useState<string | null>('Active');
  const [date, setDate] = useState<string | null>(null);
  const [vertical, setVertical] = useState('all');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Horizontal Filters ──────────────────────────────────────── */}
      <DemoSection
        title={t('horizontal.title')}
        description={t('horizontal.body')}
        code={`import { FilterBar, FilterChip, Icon } from "@nili/ui"
import { RiPriceTag3Line, RiCalendarLine, RiUserLine } from "@remixicon/react"

export function Example() {
  return (
    <FilterBar surface="panel" label="Table filters">
      <FilterChip
        active
        value="Active"
        startIcon={<Icon icon={RiPriceTag3Line} />}
        onClear={() => {}}
        clearLabel="Clear"
      >
        Status
      </FilterChip>
      <FilterChip startIcon={<Icon icon={RiCalendarLine} />}>Date</FilterChip>
      <FilterChip startIcon={<Icon icon={RiUserLine} />}>Owner</FilterChip>
      <FilterChip placeholder>Add filter</FilterChip>
    </FilterBar>
  )
}`}
      >
        <FilterBar surface="panel" label={t('bar.label')}>
          <FilterChip
            active={Boolean(status)}
            value={status}
            startIcon={<Icon icon={RiPriceTag3Line} />}
            onClear={() => setStatus(null)}
            clearLabel={t('chip.clearStatus')}
            onClick={() => setStatus(t('value.active'))}
          >
            {t('chip.status')}
          </FilterChip>

          <FilterChip
            active={Boolean(date)}
            value={date}
            startIcon={<Icon icon={RiCalendarLine} />}
            onClear={() => setDate(null)}
            clearLabel={t('chip.clearDate')}
            onClick={() => setDate(t('value.thisWeek'))}
          >
            {t('chip.date')}
          </FilterChip>

          <FilterChip startIcon={<Icon icon={RiUserLine} />}>{t('chip.owner')}</FilterChip>

          <FilterChip placeholder>{t('chip.addFilter')}</FilterChip>
        </FilterBar>
      </DemoSection>

      {/* ── Vertical Filters ────────────────────────────────────────── */}
      <DemoSection
        title={t('vertical.title')}
        description={t('vertical.body')}
        code={`import { FilterList, FilterListItem } from "@nili/ui"

export function Example() {
  return (
    <div className="w-56 rounded-xl border border-soft-200 p-2">
      <FilterList label="Status">
        <FilterListItem active count={128}>All</FilterListItem>
        <FilterListItem count={42}>Active</FilterListItem>
        <FilterListItem count={12}>Draft</FilterListItem>
        <FilterListItem count={74}>Archived</FilterListItem>
      </FilterList>
    </div>
  )
}`}
      >
        <div className="w-56 rounded-xl border border-soft-200 p-2">
          <FilterList label="Status">
            {(
              [
                { value: 'all', label: 'All', count: 128 },
                { value: 'active', label: 'Active', count: 42 },
                { value: 'draft', label: 'Draft', count: 12 },
                { value: 'archived', label: 'Archived', count: 74 },
              ] as const
            ).map((item) => (
              <FilterListItem
                key={item.value}
                active={vertical === item.value}
                count={item.count}
                onClick={() => setVertical(item.value)}
              >
                {item.label}
              </FilterListItem>
            ))}
          </FilterList>
        </div>
      </DemoSection>

      {/* ── Horizontal Filter toolbar ───────────────────────────────── */}
      <DemoSection
        title={t('toolbar.sectionTitle')}
        description={t('toolbar.body')}
        code={`import {
  Button,
  ButtonGroup,
  ButtonGroupItem,
  TextInput,
  Icon,
} from "@nili/ui"
import {
  RiCalendarLine,
  RiArrowDownSLine,
  RiSortDesc,
  RiSearch2Line,
} from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* Type · Calendar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" appearance="stroke" color="neutral">
          Today
        </Button>
        <ButtonGroup size="sm" label="Date">
          <ButtonGroupItem endIcon={<Icon icon={RiArrowDownSLine} />}>
            Last 7 days
          </ButtonGroupItem>
          <ButtonGroupItem startIcon={<Icon icon={RiCalendarLine} />}>
            Aug 04 - Aug 11 2023
          </ButtonGroupItem>
        </ButtonGroup>
        <TextInput
          size="sm"
          aria-label="Search"
          placeholder="Search..."
          startIcon={<Icon icon={RiSearch2Line} />}
          shortcut="⌘1"
          className="w-[220px]"
        />
      </div>

      {/* Type · Table */}
      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup size="sm" label="Type">
          <ButtonGroupItem selected>All</ButtonGroupItem>
          <ButtonGroupItem>Income</ButtonGroupItem>
          <ButtonGroupItem>Expenses</ButtonGroupItem>
        </ButtonGroup>
        <Button
          size="sm"
          appearance="stroke"
          color="neutral"
          startIcon={<Icon icon={RiSortDesc} />}
          endIcon={<Icon icon={RiArrowDownSLine} />}
        >
          Sort by
        </Button>
      </div>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>Type · Calendar</DemoLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" appearance="stroke" color="neutral">
                {t('toolbar.today')}
              </Button>
              <ButtonGroup size="sm" label="Date">
                <ButtonGroupItem endIcon={<Icon icon={RiArrowDownSLine} />}>
                  {t('toolbar.last7')}
                </ButtonGroupItem>
                <ButtonGroupItem startIcon={<Icon icon={RiCalendarLine} />}>
                  {t('toolbar.dateRange')}
                </ButtonGroupItem>
              </ButtonGroup>
              <div className="min-w-[200px] flex-1 sm:max-w-[260px]">
                <TextInput
                  size="sm"
                  aria-label={t('toolbar.search')}
                  placeholder={t('toolbar.searchPlaceholder')}
                  startIcon={<Icon icon={RiSearch2Line} />}
                  shortcut="⌘1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>Type · Table</DemoLabel>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonGroup size="sm" label="Type">
                <ButtonGroupItem selected>{t('list.all')}</ButtonGroupItem>
                <ButtonGroupItem>{t('list.income')}</ButtonGroupItem>
                <ButtonGroupItem>{t('list.expenses')}</ButtonGroupItem>
              </ButtonGroup>
              <span className="hidden flex-1 sm:block" />
              <Button
                size="sm"
                appearance="stroke"
                color="neutral"
                startIcon={<Icon icon={RiSortDesc} />}
                endIcon={<Icon icon={RiArrowDownSLine} />}
              >
                {t('toolbar.sortBy')}
              </Button>
              <div className="min-w-[200px] flex-1 sm:max-w-[260px]">
                <TextInput
                  size="sm"
                  aria-label={t('toolbar.search')}
                  placeholder={t('toolbar.searchPlaceholder')}
                  startIcon={<Icon icon={RiSearch2Line} />}
                  shortcut="⌘1"
                />
              </div>
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Vertical Filter Items states ────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { FilterListItem, Icon } from "@nili/ui"
import { RiCalendarLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <FilterListItem startIcon={<Icon icon={RiCalendarLine} />}>
        Date
      </FilterListItem>
      <FilterListItem startIcon={<Icon icon={RiCalendarLine} />} active>
        Date
      </FilterListItem>
    </>
  )
}`}
      >
        <div className="grid w-full max-w-xs grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
          <DemoLabel>{t('states.default')}</DemoLabel>
          <FilterListItem startIcon={<Icon icon={RiCalendarLine} />}>
            {t('chip.date')}
          </FilterListItem>

          <DemoLabel>{t('states.hover')}</DemoLabel>
          <FilterListItem
            startIcon={<Icon icon={RiCalendarLine} />}
            data-nili-state="hover"
          >
            {t('chip.date')}
          </FilterListItem>

          <DemoLabel>{t('states.active')}</DemoLabel>
          <FilterListItem startIcon={<Icon icon={RiCalendarLine} />} active>
            {t('chip.date')}
          </FilterListItem>
        </div>
      </DemoSection>
    </div>
  );
}
