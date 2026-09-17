'use client';

import { useState } from 'react';
import {
  DatePicker,
  DateRangePicker,
  DatePickerFooter,
  Button,
  type DateRange,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { datePickerText } from './date-picker-demo.text';

const today = new Date();
const addDays = (days: number) => {
  const next = new Date(today);
  next.setDate(next.getDate() + days);
  return next;
};

/**
 * Responsive overview for Date Picker and Date Range Picker.
 */
export function DatePickerDemo() {
  const t = useDemoText(datePickerText);
  const [date, setDate] = useState<Date | null>(today);
  const [range, setRange] = useState<DateRange>({
    from: today,
    to: addDays(6),
  });

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { DatePicker } from "@nili/ui"

export function Example() {
  const [date, setDate] = useState<Date | null>(new Date())

  return <DatePicker value={date} onChange={setDate} />
}`}
      >
        <div className="w-full">
          <DatePicker value={date} onChange={setDate} />
        </div>
      </DemoSection>

      {/* ── Calendar systems ────────────────────────────────────────── */}
      <DemoSection
        title={t('calendars.title')}
        description={t('calendars.body')}
        code={`import { DatePicker } from "@nili/ui"

export function Example() {
  return (
    <>
      <DatePicker calendar="jalali" locale="fa" />
      <DatePicker calendar="gregorian" locale="en" />

      {/* let the user pick */}
      <DatePicker
        allowCalendarSwitch
        labels={{ calendarSwitch: "Change calendar", jalali: "شمسی", gregorian: "میلادی" }}
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:flex-wrap">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('calendars.jalali')}</DemoLabel>
            <DatePicker calendar="jalali" locale="fa" defaultValue={today} />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('calendars.gregorian')}</DemoLabel>
            <DatePicker calendar="gregorian" locale="en" defaultValue={today} />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('calendars.switchable')}</DemoLabel>
            <DatePicker
              allowCalendarSwitch
              defaultValue={today}
              labels={{
                calendarSwitch: t('calendars.switchLabel'),
                jalali: t('calendars.jalaliName'),
                gregorian: t('calendars.gregorianName'),
              }}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Bounds & marked days ────────────────────────────────────── */}
      <DemoSection
        title={t('bounds.title')}
        description={t('bounds.body')}
        code={`import { DatePicker } from "@nili/ui"

export function Example() {
  return (
    <DatePicker
      minDate={new Date()}
      maxDate={addDays(60)}
      markedDates={[addDays(3), addDays(10)]}
      isDateDisabled={(date) => date.getDay() === 5}
    />
  )
}`}
      >
        <div className="w-full">
          <DatePicker
            defaultValue={today}
            minDate={addDays(-7)}
            maxDate={addDays(45)}
            markedDates={[addDays(3), addDays(10), addDays(17)]}
            isDateDisabled={(value) => value.getDay() === 5}
          />
        </div>
      </DemoSection>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('footer.title')}
        description={t('footer.body')}
        code={`import { DatePicker, DatePickerFooter, Button } from "@nili/ui"

export function Example() {
  return (
    <DatePicker
      footer={
        <DatePickerFooter>
          <Button appearance="stroke" size="xs">Cancel</Button>
          <Button size="xs">Apply</Button>
        </DatePickerFooter>
      }
    />
  )
}`}
      >
        <div className="w-full">
          <DatePicker
            defaultValue={today}
            footer={
              <DatePickerFooter>
                <Button appearance="stroke" size="xs">
                  {t('action.cancel')}
                </Button>
                <Button size="xs">{t('action.apply')}</Button>
              </DatePickerFooter>
            }
          />
        </div>
      </DemoSection>

      {/* ── Range ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('range.title')}
        description={t('range.body')}
        code={`import { DateRangePicker } from "@nili/ui"

export function Example() {
  const [range, setRange] = useState({ from: new Date(), to: null })

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      presets={[
        { label: "Last 7 days", range: () => ({ from: addDays(-7), to: new Date() }) },
        { label: "Last 30 days", range: () => ({ from: addDays(-30), to: new Date() }) },
        { label: "This month", range: () => ({ from: startOfMonth(), to: new Date() }) },
      ]}
    />
  )
}`}
      >
        <div className="w-full">
          <DateRangePicker
            value={range}
            onChange={setRange}
            presets={[
              {
                label: t('preset.last7'),
                range: () => ({ from: addDays(-7), to: today }),
              },
              {
                label: t('preset.last30'),
                range: () => ({ from: addDays(-30), to: today }),
              },
              {
                label: t('preset.next14'),
                range: () => ({ from: today, to: addDays(14) }),
              },
            ]}
            footer={
              <DatePickerFooter>
                <Button
                  appearance="stroke"
                  size="xs"
                  onClick={() => setRange({ from: null, to: null })}
                >
                  {t('action.clear')}
                </Button>
                <Button size="xs">{t('action.apply')}</Button>
              </DatePickerFooter>
            }
          />
        </div>
      </DemoSection>
    </div>
  );
}
