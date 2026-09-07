import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { CalendarSystem } from '../../lib/calendar';

export type { CalendarSystem };

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DatePreset {
  label: string;
  range: DateRange | (() => DateRange);
}

interface CalendarBaseProps {
  /**
   * `'jalali'` (Solar Hijri — Shamsi, also called Jalali) or `'gregorian'`.
   * Defaults to Jalali under a Persian locale and Gregorian otherwise.
   */
  calendar?: CalendarSystem;
  /** BCP-47 tag for month names, weekday names and numerals. */
  locale?: string;
  /** Let the user switch calendars from a toggle in the header. */
  allowCalendarSwitch?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Days that get a marker dot — Figma's "Marked" state. */
  markedDates?: Date[];
  isDateDisabled?: (date: Date) => boolean;
  labels?: {
    previousMonth?: string;
    nextMonth?: string;
    calendarSwitch?: string;
    jalali?: string;
    gregorian?: string;
  };
}

export interface DatePickerProps
  extends
    CalendarBaseProps,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

export interface DateRangePickerProps
  extends
    CalendarBaseProps,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Shortcut column — Figma's "Period Range". */
  presets?: DatePreset[];
  footer?: ReactNode;
}
