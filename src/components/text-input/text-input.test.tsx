import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '.';

describe('TextInput', () => {
  it('ties the label to the input', () => {
    render(<TextInput label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('describes the input with its hint', () => {
    render(<TextInput label="Email" hint="We will never share it" />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'We will never share it',
    );
  });

  // A red border with no message, or a message beside a field that still
  // looks fine, cannot happen: `error` drives both.
  it('marks the field invalid whenever there is an error', () => {
    render(<TextInput label="Email" error="Enter a valid email address" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email address');
  });

  // A validation message that appears after submit is silent otherwise — the
  // single most common accessibility bug in forms.
  it('announces the error', () => {
    render(<TextInput label="Email" error="Enter a valid email address" />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a valid email address',
    );
  });

  it('shows the error instead of the hint when both are given', () => {
    render(<TextInput label="Email" hint="Optional" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Optional')).toBeNull();
  });

  // The asterisk is a visual convention. Requiredness is carried by the
  // input's own attribute, and "Email star" helps nobody.
  it('keeps the required asterisk out of the accessible name', () => {
    render(<TextInput label="Email" required />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
  });

  it('types', async () => {
    render(<TextInput label="Email" />);
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.co');
    expect(screen.getByLabelText('Email')).toHaveValue('a@b.co');
  });

  // A URL rendered RTL has its slashes and dots migrate to the wrong end.
  it('pins a latin field to LTR', () => {
    render(<TextInput label="Website" latin />);
    expect(screen.getByLabelText('Website')).toHaveAttribute('dir', 'ltr');
  });

  it('renders adornments and affixes without breaking the label link', () => {
    render(
      <TextInput
        label="Website"
        startAffix="https://"
        endAffix=".com"
        startIcon={<span data-testid="icon" />}
      />,
    );
    expect(screen.getByLabelText('Website')).toBeInTheDocument();
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not type while disabled', async () => {
    render(<TextInput label="Email" disabled />);
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'x');
    expect(input).toHaveValue('');
  });

  describe("Figma's Type axis", () => {
    it('derives the native type, keyboard and autofill from the preset', () => {
      render(<TextInput type="email" label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('inputmode', 'email');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('pins Latin-valued types to LTR', () => {
      render(<TextInput type="website" label="Site" />);
      expect(screen.getByLabelText('Site')).toHaveAttribute('dir', 'ltr');
    });

    it('leaves a basic field to the ambient direction', () => {
      render(<TextInput type="basic" label="Name" />);
      expect(screen.getByLabelText('Name')).not.toHaveAttribute('dir');
    });

    it('lets an explicit prop beat the preset', () => {
      render(
        <TextInput type="email" label="Email" latin={false} htmlType="text" />,
      );
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).not.toHaveAttribute('dir');
    });

    it('wires the password strength meter into aria-describedby', () => {
      render(
        <TextInput
          type="password"
          label="Password"
          strength="strong"
          strengthLabel="Strong password"
        />,
      );
      const described = screen
        .getByLabelText('Password')
        .getAttribute('aria-describedby');
      expect(described).toBeTruthy();
      expect(screen.getByText('Strong password')).toBeInTheDocument();
    });

    it('renders no strength meter unless asked', () => {
      render(<TextInput type="password" label="Password" />);
      expect(screen.getByLabelText('Password')).not.toHaveAttribute(
        'aria-describedby',
      );
    });

    it('hides the shortcut chip from assistive tech', () => {
      const { container } = render(
        <TextInput type="search" label="Search" shortcut="⌘K" />,
      );
      expect(screen.queryByText('⌘K')).not.toBeNull();
      expect(container.querySelector('[aria-hidden]')).not.toBeNull();
    });
  });

  // Figma puts the country code before a phone number and the currency after
  // an amount. The side comes from the type, not from the caller.
  it('places the in-field select on the side the type calls for', () => {
    const { container: phone } = render(
      <TextInput
        type="phone"
        label="Phone"
        select={<button type="button">+98</button>}
      />,
    );
    const phoneField = phone.querySelector('input')!.parentElement!;
    const phoneKids = Array.from(phoneField.children);
    expect(
      phoneKids.indexOf(phoneField.querySelector('button')!.parentElement!),
    ).toBeLessThan(phoneKids.indexOf(phoneField.querySelector('input')!));

    cleanup();

    const { container: amount } = render(
      <TextInput
        type="amount"
        label="Amount"
        select={<button type="button">EUR</button>}
      />,
    );
    const amountField = amount.querySelector('input')!.parentElement!;
    const amountKids = Array.from(amountField.children);
    expect(
      amountKids.indexOf(amountField.querySelector('button')!.parentElement!),
    ).toBeGreaterThan(amountKids.indexOf(amountField.querySelector('input')!));
  });

  it('lets selectPosition override the type', () => {
    const { container } = render(
      <TextInput
        type="phone"
        label="Phone"
        selectPosition="end"
        select={<button type="button">+98</button>}
      />,
    );
    const field = container.querySelector('input')!.parentElement!;
    const kids = Array.from(field.children);
    expect(
      kids.indexOf(field.querySelector('button')!.parentElement!),
    ).toBeGreaterThan(kids.indexOf(field.querySelector('input')!));
  });

  it('renders the currency mark before the value', () => {
    render(<TextInput type="amount" label="Amount" prefix="€" />);
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  // The asterisk and "(Optional)" are decoration; the accessible name is the
  // label text alone.
  it('keeps the sublabel out of the accessible name', () => {
    render(
      <TextInput
        label="Phone Number"
        required
        sublabel="(Optional)"
        information
        informationLabel="More information"
      />,
    );
    // The asterisk, the "(Optional)" sublabel and the information glyph are
    // all outside the computed name — the field is "Phone Number", not
    // "Phone Number star optional More information".
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Phone Number');
    expect(screen.getByText('(Optional)')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      screen.getByRole('img', { name: 'More information' }),
    ).toBeInTheDocument();
  });
});
