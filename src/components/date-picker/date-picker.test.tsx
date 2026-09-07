import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker, DateRangePicker } from '.';

const march2024 = new Date(2024, 2, 20); // Nowruz 1403

describe('DatePicker', () => {
  it('defaults to Jalali under a Persian locale', () => {
    render(<DatePicker locale="fa" defaultValue={march2024} />);
    // 1 Farvardin 1403 — the grid must show a Persian "1" and the year.
    expect(screen.getByText(/۱۴۰۳/)).toBeInTheDocument();
  });

  it('defaults to Gregorian otherwise', () => {
    render(<DatePicker locale="en" defaultValue={march2024} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renders six full weeks so the height never changes', () => {
    render(<DatePicker locale="en" defaultValue={march2024} />);
    expect(screen.getAllByRole('gridcell')).toHaveLength(42);
  });

  it('selects a day and reports it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker locale="en" defaultValue={march2024} onChange={onChange} />,
    );
    const cells = screen.getAllByRole('gridcell');
    await user.click(cells[20]);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('disables days outside min/max', () => {
    render(
      <DatePicker
        locale="en"
        defaultValue={march2024}
        minDate={new Date(2024, 2, 10)}
        maxDate={new Date(2024, 2, 20)}
      />,
    );
    const enabled = screen
      .getAllByRole('gridcell')
      .filter((c) => !c.hasAttribute('disabled'));
    expect(enabled).toHaveLength(11);
  });

  // Switching calendars must not move the user to a different part of the year.
  it('keeps the anchor date when the calendar switches', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker locale="fa" defaultValue={march2024} allowCalendarSwitch />,
    );
    expect(screen.getByText(/۱۴۰۳/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Gregorian' }));
    // Gregorian year, Persian numerals: the calendar system and the numeral
    // system are separate decisions, and a Persian UI keeps Persian digits.
    expect(screen.getByText(/۲۰۲۴/)).toBeInTheDocument();
  });

  it('marks dates that carry an event', () => {
    const { container } = render(
      <DatePicker
        locale="en"
        defaultValue={march2024}
        markedDates={[march2024]}
      />,
    );
    expect(container.innerHTML).toContain('before:bg-feature-base');
  });
});

describe('DateRangePicker', () => {
  it('builds a range from two clicks, in either order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker locale="en" onChange={onChange} />);
    const cells = screen.getAllByRole('gridcell');

    await user.click(cells[20]);
    await user.click(cells[10]);

    const last = onChange.mock.calls.at(-1)![0];
    expect(last.from.getTime()).toBeLessThan(last.to.getTime());
  });

  it('renders preset shortcuts', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const from = new Date(2024, 2, 1);
    const to = new Date(2024, 2, 7);
    render(
      <DateRangePicker
        locale="en"
        onChange={onChange}
        presets={[{ label: 'This week', range: { from, to } }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'This week' }));
    expect(onChange).toHaveBeenCalledWith({ from, to });
  });
});
