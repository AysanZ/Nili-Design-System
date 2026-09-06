import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { DatePicker, DateRangePicker, type DateRange } from '.';
import { Button } from '@components/button';
import { formatDate } from '@/lib/calendar';

const meta: Meta<typeof DatePicker> = {
  title: 'Base Components/Date Picker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: `The **Date Picker**, from the Figma "❖ Date Picker" page — Day Labels, Day Cells (Basic/Range, Active, Disabled, Marked), Period Range presets and the Date Selector header.

## شمسی، جلالی، میلادی

**شمسی and جلالی are the same calendar.** Solar Hijri: "شمسی" (solar) describes what it tracks, "جلالی" credits Jalaluddin Malik Shah, under whom it was reformed in 1079. So there are two systems here, not three: \`calendar="jalali"\` and \`calendar="gregorian"\`. It defaults to Jalali under a Persian locale and Gregorian otherwise, and \`allowCalendarSwitch\` puts a toggle in the header.

Switching **keeps the visible month anchored to the same real date**, so you do not get teleported to a different part of the year.

## Calendar system ≠ numeral system

They are separate decisions. Gregorian dates in a Persian UI still render Persian digits (۲۰۲۴), because that is what a Persian reader expects. Both come from \`Intl\`, driven by \`locale\`.

## Why the conversion is hand-written

\`Intl.DateTimeFormat\` with \`fa-IR-u-ca-persian\` can *format* a Jalali date, but it cannot answer "how many days are in Esfand 1403" or "which weekday starts Mehr" — and a calendar grid is nothing but those two questions. A npm dependency would solve it, but a design system's runtime deps are inherited by every consumer, so 60 lines of Borkowski's algorithm is the cheaper trade. It is unit-tested against Nowruz anchors and a full-year round trip.

## Details that matter

- Every month renders **six full weeks**, so paging does not resize the layout.
- Esfand is the only variable-length Jalali month (29 or 30) — the leap rule is tested directly.
- \`addMonths\` clamps: 31 Farvardin + 6 months is 30 Mehr, not 1 Aban.
- In RTL the previous/next buttons **swap sides and swap glyphs**; mirroring the icon alone is not enough.`,
      },
    },
  },
  argTypes: {
    calendar: {
      control: { type: 'radio' },
      options: [undefined, 'jalali', 'gregorian'],
      description: 'Defaults from the locale.',
    },
    allowCalendarSwitch: { control: 'boolean' },
    locale: { control: 'text' },
  },
};

const useLabels = () => {
  const { t } = useTranslation();
  return {
    previousMonth: t('datePicker.previousMonth'),
    nextMonth: t('datePicker.nextMonth'),
    calendarSwitch: t('datePicker.calendarSwitch'),
    jalali: t('datePicker.jalali'),
    gregorian: t('datePicker.gregorian'),
  };
};

// ====================== Basic ======================

export const Default = () => {
  const { i18n } = useTranslation();
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

/** Both calendars, side by side, showing the same month. */
export const BothCalendars = () => {
  const { t, i18n } = useTranslation();
  const labels = useLabels();
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-soft-400">
            {t('datePicker.jalali')}
          </span>
          <DatePicker
            calendar="jalali"
            value={date}
            onChange={setDate}
            locale={i18n.language}
            labels={labels}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-soft-400">
            {t('datePicker.gregorian')}
          </span>
          <DatePicker
            calendar="gregorian"
            value={date}
            onChange={setDate}
            locale={i18n.language}
            labels={labels}
          />
        </div>
      </div>
      {date && (
        <span className="text-[14px] text-sub-600">
          {t('datePicker.selected')}:{' '}
          {formatDate(date, 'jalali', i18n.language)} ·{' '}
          {formatDate(date, 'gregorian', i18n.language)}
        </span>
      )}
    </div>
  );
};

/** The header toggle. Switching keeps you on the same real month. */
export const SwitchableCalendar = () => {
  const { i18n } = useTranslation();
  return (
    <DatePicker
      allowCalendarSwitch
      defaultValue={new Date()}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

// ====================== States ======================

export const WithMarkedDates = () => {
  const { i18n } = useTranslation();
  const today = new Date();
  const mark = (offset: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d;
  };
  return (
    <DatePicker
      defaultValue={today}
      markedDates={[mark(2), mark(5), mark(9)]}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

export const WithMinMax = () => {
  const { i18n } = useTranslation();
  const today = new Date();
  const min = new Date(today);
  min.setDate(today.getDate() - 5);
  const max = new Date(today);
  max.setDate(today.getDate() + 10);
  return (
    <DatePicker
      defaultValue={today}
      minDate={min}
      maxDate={max}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

/** Weekends disabled, via `isDateDisabled`. */
export const DisabledWeekends = () => {
  const { i18n } = useTranslation();
  return (
    <DatePicker
      defaultValue={new Date()}
      isDateDisabled={(date) => date.getDay() === 5 || date.getDay() === 6}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

// ====================== Range ======================

export const RangePicker = () => {
  const { i18n } = useTranslation();
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      locale={i18n.language}
      labels={useLabels()}
    />
  );
};

/** Figma's "Period Range" column. */
export const RangeWithPresets = () => {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      locale={i18n.language}
      labels={useLabels()}
      presets={[
        {
          label: t('datePicker.today'),
          range: { from: new Date(), to: new Date() },
        },
        {
          label: t('datePicker.last7'),
          range: { from: daysAgo(7), to: new Date() },
        },
        {
          label: t('datePicker.last30'),
          range: { from: daysAgo(30), to: new Date() },
        },
      ]}
      footer={
        <Button size="sm" fullWidth disabled={!range.from || !range.to}>
          {t('datePicker.apply')}
        </Button>
      }
    />
  );
};

export default meta;
