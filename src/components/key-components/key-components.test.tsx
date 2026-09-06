import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Label,
  HintText,
  PasswordStrength,
  KeyIcon,
  ChartLegend,
  ContentCard,
  ContentLabel,
} from '.';

describe('Label', () => {
  // "Email star" helps nobody; requiredness lives on the input.
  it('keeps the required asterisk out of the accessible name', () => {
    render(
      <>
        <Label htmlFor="email" required>
          Email
        </Label>
        <input id="email" type="text" required />
      </>,
    );
    // Accessible-name computation respects aria-hidden, so the asterisk is
    // excluded even though it is still in the label's textContent.
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName('Email');
    expect(input).toBeRequired();
  });
});

describe('HintText', () => {
  // A validation message that appears after a failed submit is otherwise silent.
  it('announces errors', () => {
    render(<HintText status="error">Enter a valid email</HintText>);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
  });

  it('stays quiet when it is only a hint', () => {
    render(<HintText>We will never share it</HintText>);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('PasswordStrength', () => {
  // Red/amber/green is the worst palette for colour-blind users, and colour
  // alone says nothing to a screen reader either.
  it('carries the meaning in text, not colour', () => {
    render(<PasswordStrength strength="strong" label="Strong password" />);
    expect(screen.getByRole('status')).toHaveTextContent('Strong password');
  });

  it('fills one bar per level', () => {
    const { container } = render(<PasswordStrength strength="moderate" />);
    const filled = container.querySelectorAll('.bg-warning-base');
    expect(filled).toHaveLength(2);
  });
});

describe('KeyIcon', () => {
  it('is decorative unless given a label', () => {
    const { container, rerender } = render(
      <KeyIcon>
        <svg />
      </KeyIcon>,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <KeyIcon label="Feature">
        <svg />
      </KeyIcon>,
    );
    expect(screen.getByRole('img', { name: 'Feature' })).toBeInTheDocument();
  });
});

describe('ChartLegend', () => {
  it('is plain text without onToggle', () => {
    render(<ChartLegend color="blue">Revenue</ChartLegend>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('becomes a pressable control with onToggle', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ChartLegend color="blue" onToggle={onToggle}>
        Revenue
      </ChartLegend>,
    );
    const button = screen.getByRole('button', { name: /Revenue/ });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.click(button);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('announces a hidden series', () => {
    render(
      <ChartLegend color="blue" hidden onToggle={vi.fn()}>
        Revenue
      </ChartLegend>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ContentCard', () => {
  // A clickable div card looks identical and is unreachable by keyboard.
  it('is a real button when selectable', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ContentCard title="Design System" onSelect={onSelect} selected />);
    const button = screen.getByRole('button', { name: /Design System/ });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('is inert without onSelect', () => {
    render(<ContentCard title="Design System" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the ContentLabel slots Figma defines', () => {
    render(
      <ContentLabel
        title="Ada Lovelace"
        required
        sublabel="admin"
        badge={<span>Pro</span>}
        description="last seen today"
        toggle={<span>toggle</span>}
      />,
    );
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('last seen today')).toBeInTheDocument();
    expect(screen.getByText('toggle')).toBeInTheDocument();
  });

  it('renders the Label sublabel and information glyph', () => {
    render(
      <Label
        required
        sublabel="(Optional)"
        information
        informationLabel="More information"
      >
        Email
      </Label>,
    );
    expect(screen.getByText('(Optional)')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      screen.getByRole('img', { name: 'More information' }),
    ).toBeInTheDocument();
  });
});
