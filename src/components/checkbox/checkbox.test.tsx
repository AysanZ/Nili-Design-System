import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '.';

describe('Checkbox', () => {
  // A div with role="checkbox" loses form participation, the indeterminate
  // property and the :checked selector. This must stay a native input.
  it('is a native checkbox input', () => {
    render(<Checkbox label="Agree" />);
    const input = screen.getByRole('checkbox', { name: 'Agree' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'checkbox');
  });

  it('links the label so clicking the text toggles it', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Agree" />);
    await user.click(screen.getByText('Agree'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('describes itself with the description text', () => {
    render(<Checkbox label="Agree" description="You can opt out later" />);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'You can opt out later',
    );
  });

  // indeterminate is a DOM property, not an attribute — it cannot be set in JSX.
  it('sets the indeterminate property, not an attribute', () => {
    render(<Checkbox label="All" indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    // No aria-checked override: the HTML spec already maps the indeterminate
    // IDL attribute to "mixed", and hand-setting it can drift out of sync.
    expect(input).not.toHaveAttribute('aria-checked');
    expect(input).toBePartiallyChecked();
  });

  it('marks itself invalid for validation', () => {
    render(<Checkbox label="Agree" invalid />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('does not fire when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Agree" disabled onChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards its ref while keeping indeterminate working', () => {
    let node: HTMLInputElement | null = null;
    render(<Checkbox label="All" indeterminate ref={(el) => { node = el; }} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
    expect((node as unknown as HTMLInputElement).indeterminate).toBe(true);
  });

  it('flips the label side with a logical layout, not a hardcoded one', () => {
    const { container } = render(
      <Checkbox label="Agree" labelPosition="start" />,
    );
    expect(container.firstElementChild?.className).toContain(
      'flex-row-reverse',
    );
  });
});
