import { forwardRef, useMemo, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { Icon } from '../icon';
import { CompactButton } from '../button';
import { useControllableState } from '../../hooks/use-controllable-state';
import {
  type CalendarSystem,
  toParts,
  fromParts,
  addMonths,
  getMonthGrid,
  getMonthName,
  getWeekdayNames,
  formatYear,
  formatDay,
  isSameDay,
  startOfDay,
} from '../../lib/calendar';
import {
  datePickerVariants,
  dateSelectorVariants,
  dayLabelVariants,
  dayCellVariants,
  periodRangeVariants,
  periodRangeItemVariants,
  datePickerFooterVariants,
  calendarToggleVariants,
} from './date-picker.styles';
import type {
  DatePickerProps,
  DateRangePickerProps,
  DateRange,
} from './date-picker.types';

/** Persian locales default to the Solar Hijri calendar; everything else to Gregorian. */
function defaultCalendar(locale: string): CalendarSystem {
  return /^(fa|ps|prs)\b/i.test(locale) ? 'jalali' : 'gregorian';
}

interface CalendarGridProps {
  calendar: CalendarSystem;
  locale: string;
  cursor: { year: number; month: number };
  isSelected: (date: Date) => boolean;
  isInRange?: (date: Date) => boolean;
  rangeEdge?: (date: Date) => 'start' | 'end' | 'both' | 'none';
  isDisabled: (date: Date) => boolean;
  isMarked: (date: Date) => boolean;
  onSelect: (date: Date) => void;
  onHover?: (date: Date | null) => void;
}

function CalendarGrid({
  calendar,
  locale,
  cursor,
  isSelected,
  isInRange,
  rangeEdge,
  isDisabled,
  isMarked,
  onSelect,
  onHover,
}: CalendarGridProps) {
  const today = startOfDay(new Date());
  const weekdays = useMemo(
    () => getWeekdayNames(calendar, locale, 'narrow'),
    [calendar, locale],
  );
  const cells = useMemo(
    () => getMonthGrid(cursor.year, cursor.month, calendar, locale),
    [cursor.year, cursor.month, calendar, locale],
  );

  return (
    <div role="grid" className="flex flex-col">
      <div role="row" className="grid grid-cols-7 gap-x-2">
        {weekdays.map((name, index) => (
          <span key={index} role="columnheader" className={dayLabelVariants()}>
            {name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 [&>[data-in-range]:nth-child(7n+1)]:rounded-s-lg [&>[data-in-range]:nth-child(7n+1)]:before:hidden [&>[data-in-range]:nth-child(7n)]:rounded-e-lg">
        {cells.map((cell) => {
          const disabled = isDisabled(cell.date);
          const selected = isSelected(cell.date);
          return (
            <button
              key={cell.date.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={selected}
              data-in-range={
                !selected && isInRange?.(cell.date) ? true : undefined
              }
              // The label is the full localized date, so a screen reader
              // announces "12 Mehr 1403" and not a bare number.
              aria-label={cell.date.toDateString()}
              onClick={() => onSelect(cell.date)}
              onMouseEnter={() => onHover?.(cell.date)}
              onMouseLeave={() => onHover?.(null)}
              className={dayCellVariants({
                outside: !cell.inMonth,
                selected,
                inRange: !selected && Boolean(isInRange?.(cell.date)),
                rangeEdge: rangeEdge?.(cell.date) ?? 'none',
                today: isSameDay(cell.date, today),
                marked: isMarked(cell.date),
              })}
            >
              {formatDay(cell.parts.day, locale)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface HeaderProps {
  calendar: CalendarSystem;
  locale: string;
  cursor: { year: number; month: number };
  onStep: (delta: number) => void;
  allowCalendarSwitch: boolean;
  onCalendarChange: (system: CalendarSystem) => void;
  labels: NonNullable<DatePickerProps['labels']>;
}

function CalendarHeader({
  calendar,
  locale,
  cursor,
  onStep,
  allowCalendarSwitch,
  onCalendarChange,
  labels,
}: HeaderProps) {
  return (
    <div className={dateSelectorVariants()}>
      <CompactButton
        appearance="white"
        aria-label={labels.previousMonth ?? 'Previous month'}
        onClick={() => onStep(-1)}
      >
        <Icon icon={RiArrowLeftSLine} mirrored />
      </CompactButton>

      <div className="flex items-center gap-2">
        <span className="text-[14px] font-medium leading-5 text-strong-950">
          {getMonthName(cursor.year, cursor.month, calendar, locale)}{' '}
          {formatYear(cursor.year, locale)}
        </span>

        {allowCalendarSwitch && (
          <div
            role="group"
            aria-label={labels.calendarSwitch ?? 'Calendar system'}
            className={calendarToggleVariants()}
          >
            {(['jalali', 'gregorian'] as const).map((system) => (
              <button
                key={system}
                type="button"
                aria-pressed={calendar === system}
                onClick={() => onCalendarChange(system)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[11px] font-medium leading-4 transition-colors',
                  calendar === system
                    ? 'bg-weak-50 text-strong-950'
                    : 'text-sub-600 hover:text-strong-950',
                )}
              >
                {system === 'jalali'
                  ? (labels.jalali ?? 'Jalali')
                  : (labels.gregorian ?? 'Gregorian')}
              </button>
            ))}
          </div>
        )}
      </div>

      <CompactButton
        appearance="white"
        aria-label={labels.nextMonth ?? 'Next month'}
        onClick={() => onStep(1)}
      >
        <Icon icon={RiArrowRightSLine} mirrored />
      </CompactButton>
    </div>
  );
}

function useCalendarState(
  props: Pick<
    DatePickerProps,
    | 'calendar'
    | 'locale'
    | 'minDate'
    | 'maxDate'
    | 'isDateDisabled'
    | 'markedDates'
  >,
  anchor: Date | null,
) {
  const locale = props.locale ?? 'en';
  const [calendar, setCalendar] = useState<CalendarSystem>(
    props.calendar ?? defaultCalendar(locale),
  );
  const system = props.calendar ?? calendar;

  const [cursor, setCursor] = useState(() => {
    const parts = toParts(anchor ?? new Date(), system);
    return { year: parts.year, month: parts.month };
  });

  const step = (delta: number) => {
    const next = addMonths({ ...cursor, day: 1 }, delta, system);
    setCursor({ year: next.year, month: next.month });
  };

  const changeCalendar = (next: CalendarSystem) => {
    // Keep the visible month anchored to the same real date, so switching
    // calendars does not teleport the user to a different part of the year.
    // The anchor is the currently displayed month in the OLD system, converted
    // back to a real Date and then read in the NEW one.
    const displayed = fromParts({ ...cursor, day: 1 }, system);
    setCalendar(next);
    const parts = toParts(anchor ?? displayed, next);
    setCursor({ year: parts.year, month: parts.month });
  };

  const isDisabled = (date: Date) => {
    if (props.minDate && startOfDay(date) < startOfDay(props.minDate))
      return true;
    if (props.maxDate && startOfDay(date) > startOfDay(props.maxDate))
      return true;
    return props.isDateDisabled?.(date) ?? false;
  };

  const isMarked = (date: Date) =>
    (props.markedDates ?? []).some((marked) => isSameDay(marked, date));

  return { system, locale, cursor, step, changeCalendar, isDisabled, isMarked };
}

/**
 * Single-date calendar.
 *
 * ## The calendar question
 *
 * Shamsi and Jalali are the same calendar — Solar Hijri. `calendar` has
 * two values, `'jalali'` and `'gregorian'`, and defaults to Jalali under a
 * Persian locale. `allowCalendarSwitch` puts a toggle in the header for users
 * who need to cross-reference, and switching keeps the visible month anchored
 * to the same real date rather than jumping.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue = null,
      onChange,
      calendar,
      locale = 'en',
      allowCalendarSwitch = false,
      minDate,
      maxDate,
      markedDates,
      footer,
      isDateDisabled,
      labels = {},
      className,
      ...rest
    },
    ref,
  ) {
    const [selected, setSelected] = useControllableState<Date | null>({
      value,
      defaultValue,
      onChange,
    });

    const state = useCalendarState(
      { calendar, locale, minDate, maxDate, markedDates, isDateDisabled },
      selected,
    );

    return (
      <div ref={ref} className={cn(datePickerVariants(), className)} {...rest}>
        <CalendarHeader
          calendar={state.system}
          locale={state.locale}
          cursor={state.cursor}
          onStep={state.step}
          allowCalendarSwitch={allowCalendarSwitch}
          onCalendarChange={state.changeCalendar}
          labels={labels}
        />
        <CalendarGrid
          calendar={state.system}
          locale={state.locale}
          cursor={state.cursor}
          isSelected={(date) => Boolean(selected && isSameDay(selected, date))}
          isDisabled={state.isDisabled}
          isMarked={state.isMarked}
          onSelect={(date) => setSelected(startOfDay(date))}
        />
        {footer}
      </div>
    );
  },
);

/** Two-ended range calendar, with an optional preset column. */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      defaultValue = { from: null, to: null },
      onChange,
      presets,
      footer,
      calendar,
      locale = 'en',
      allowCalendarSwitch = false,
      minDate,
      maxDate,
      markedDates,
      isDateDisabled,
      labels = {},
      className,
      ...rest
    },
    ref,
  ) {
    const [range, setRange] = useControllableState<DateRange>({
      value,
      defaultValue,
      onChange,
    });
    const [hovered, setHovered] = useState<Date | null>(null);

    const state = useCalendarState(
      { calendar, locale, minDate, maxDate, markedDates, isDateDisabled },
      range.from,
    );

    // While picking the second end, preview against the hovered day so the
    // highlight tracks the pointer instead of appearing only on click.
    const end = range.to ?? (range.from && hovered ? hovered : null);
    const [lo, hi] =
      range.from && end && end < range.from
        ? [end, range.from]
        : [range.from, end];

    const select = (date: Date) => {
      const day = startOfDay(date);
      if (!range.from || range.to) {
        setRange({ from: day, to: null });
        return;
      }
      setRange(
        day < range.from
          ? { from: day, to: range.from }
          : { from: range.from, to: day },
      );
    };

    const isEdge = (date: Date) => {
      const isStart = Boolean(lo && isSameDay(lo, date));
      const isEnd = Boolean(hi && isSameDay(hi, date));
      if (isStart && isEnd) return 'both' as const;
      if (isStart) return 'start' as const;
      if (isEnd) return 'end' as const;
      return 'none' as const;
    };

    return (
      <div ref={ref} className={cn(datePickerVariants(), className)} {...rest}>
        <div className="flex gap-3">
          {presets && presets.length > 0 && (
            <div className={periodRangeVariants()}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setRange(
                      typeof preset.range === 'function'
                        ? preset.range()
                        : preset.range,
                    )
                  }
                  className={periodRangeItemVariants()}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <CalendarHeader
              calendar={state.system}
              locale={state.locale}
              cursor={state.cursor}
              onStep={state.step}
              allowCalendarSwitch={allowCalendarSwitch}
              onCalendarChange={state.changeCalendar}
              labels={labels}
            />
            <CalendarGrid
              calendar={state.system}
              locale={state.locale}
              cursor={state.cursor}
              isSelected={(date) =>
                Boolean(
                  (lo && isSameDay(lo, date)) || (hi && isSameDay(hi, date)),
                )
              }
              isInRange={(date) => Boolean(lo && hi && date > lo && date < hi)}
              rangeEdge={isEdge}
              isDisabled={state.isDisabled}
              isMarked={state.isMarked}
              onSelect={select}
              onHover={setHovered}
            />
          </div>
        </div>
        {footer}
      </div>
    );
  },
);

/**
 * Figma date-picker footer: a full-bleed bar with a top divider and 16px
 * padding. Put Cancel / Apply buttons (and, for ranges, the "Range: …"
 * summary) inside and pass it as `footer`.
 */
export function DatePickerFooter({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn(datePickerFooterVariants(), className)} {...rest} />
  );
}
