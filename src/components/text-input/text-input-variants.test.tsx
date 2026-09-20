import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput, CounterInput, DigitInput, InlineInput } from '.';

describe('TagInput', () => {
  it('commits a tag on Enter and reports it', async () => {
    const onValueChange = vi.fn();
    render(<TagInput label="Cities" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText('Cities'), 'Berlin{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(['Berlin']);
  });

  it('removes the last tag on Backspace in an empty field', async () => {
    render(<TagInput label="Cities" defaultValue={['Berlin', 'Paris']} />);
    await userEvent.type(screen.getByLabelText('Cities'), '{Backspace}');
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('refuses duplicates', async () => {
    render(<TagInput label="Cities" defaultValue={['Berlin']} />);
    await userEvent.type(screen.getByLabelText('Cities'), 'Berlin{Enter}');
    expect(screen.getAllByText('Berlin')).toHaveLength(1);
  });

  it('stops at maxTags', async () => {
    render(<TagInput label="Cities" defaultValue={['Berlin']} maxTags={1} />);
    await userEvent.type(screen.getByLabelText('Cities'), 'Paris{Enter}');
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
  });

  // error is what marks the field invalid, so a red border with no message
  // cannot happen.
  it('ties the error message to the input', () => {
    render(<TagInput label="Cities" error="Pick at least one" />);
    const input = screen.getByLabelText('Cities');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Pick at least one')).toBeInTheDocument();
  });
});

describe('CounterInput', () => {
  const labels = { decrementLabel: 'Decrease', incrementLabel: 'Increase' };

  it('is a spinbutton carrying its range', () => {
    render(<CounterInput defaultValue={2} min={1} max={10} {...labels} />);
    const spin = screen.getByRole('spinbutton');
    expect(spin).toHaveAttribute('aria-valuenow', '2');
    expect(spin).toHaveAttribute('aria-valuemin', '1');
    expect(spin).toHaveAttribute('aria-valuemax', '10');
  });

  it('increments and decrements from the buttons', async () => {
    const onValueChange = vi.fn();
    render(
      <CounterInput
        defaultValue={2}
        onValueChange={onValueChange}
        {...labels}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it('clamps at both ends and disables the button that would overshoot', () => {
    render(<CounterInput defaultValue={1} min={1} max={3} {...labels} />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeEnabled();
  });

  it('moves on arrow keys', async () => {
    render(<CounterInput defaultValue={5} {...labels} />);
    const spin = screen.getByRole('spinbutton');
    await userEvent.click(spin);
    await userEvent.keyboard('{ArrowUp}');
    expect(spin).toHaveAttribute('aria-valuenow', '6');
    await userEvent.keyboard('{ArrowDown}');
    expect(spin).toHaveAttribute('aria-valuenow', '5');
  });

  it('accepts a number typed directly and commits it on blur', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CounterInput
        defaultValue={2}
        min={1}
        max={10}
        onValueChange={onValueChange}
        {...labels}
      />,
    );
    const spin = screen.getByRole('spinbutton');

    await user.click(spin);
    await user.keyboard('7');
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(7);
    expect(spin).toHaveAttribute('aria-valuenow', '7');
    expect(spin).toHaveValue('7');
  });

  it('clamps and snaps a typed value to the configured range and step', async () => {
    const user = userEvent.setup();
    render(
      <CounterInput defaultValue={2} min={2} max={10} step={2} {...labels} />,
    );
    const spin = screen.getByRole('spinbutton');

    await user.clear(spin);
    await user.type(spin, '99');
    await user.tab();
    expect(spin).toHaveValue('10');
  });

  it('localizes the digits it shows', () => {
    render(<CounterInput defaultValue={16} locale="fa" {...labels} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('۱۶');
  });
});

describe('DigitInput', () => {
  const cellLabel = (index: string, total: string) =>
    `Digit ${index} of ${total}`;

  it('renders one cell per digit and advances focus', async () => {
    render(<DigitInput length={4} groupLabel="Code" cellLabel={cellLabel} />);
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(4);
    await userEvent.type(cells[0], '1');
    expect(cells[1]).toHaveFocus();
  });

  it('spreads a pasted code across the cells', async () => {
    const onValueChange = vi.fn();
    render(
      <DigitInput
        length={4}
        groupLabel="Code"
        cellLabel={cellLabel}
        onValueChange={onValueChange}
      />,
    );
    const cells = screen.getAllByRole('textbox');
    cells[0].focus();
    await userEvent.paste('1234');
    expect(onValueChange).toHaveBeenLastCalledWith('1234');
  });

  // A Persian keyboard emits Persian digits, and parseInt on those is NaN.
  it('normalizes Persian digits to Latin', async () => {
    const onValueChange = vi.fn();
    render(
      <DigitInput
        length={4}
        groupLabel="Code"
        cellLabel={cellLabel}
        onValueChange={onValueChange}
      />,
    );
    screen.getAllByRole('textbox')[0].focus();
    await userEvent.paste('۱۲۳۴');
    expect(onValueChange).toHaveBeenLastCalledWith('1234');
  });

  it('fires onComplete once the row is full', async () => {
    const onComplete = vi.fn();
    render(
      <DigitInput
        length={4}
        groupLabel="Code"
        cellLabel={cellLabel}
        defaultValue="123"
        onComplete={onComplete}
      />,
    );
    await userEvent.type(screen.getAllByRole('textbox')[3], '4');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('steps back on Backspace from an empty cell', async () => {
    render(
      <DigitInput
        length={4}
        groupLabel="Code"
        cellLabel={cellLabel}
        defaultValue="12"
      />,
    );
    const cells = screen.getAllByRole('textbox');
    cells[2].focus();
    await userEvent.keyboard('{Backspace}');
    expect(cells[1]).toHaveFocus();
  });

  // A code is a number: reversing it under RTL would show the user their own
  // code backwards.
  it('stays left-to-right', () => {
    render(<DigitInput length={4} groupLabel="Code" cellLabel={cellLabel} />);
    expect(screen.getByRole('group', { name: 'Code' })).toHaveAttribute(
      'dir',
      'ltr',
    );
  });
});

describe('InlineInput', () => {
  it('takes its accessible name from the label prop', () => {
    render(<InlineInput label="Full name" />);
    expect(
      screen.getByRole('textbox', { name: 'Full name' }),
    ).toBeInTheDocument();
  });

  it('marks itself invalid', () => {
    render(<InlineInput label="Full name" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders the trailing button slot', () => {
    render(
      <InlineInput
        label="Full name"
        button={<button type="button">Edit</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});
