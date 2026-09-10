import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepIndicator, Step, StepperDot } from '.';
import { DirectionProvider } from '../../providers/direction';

const flow = (props = {}) => (
  <StepIndicator value={1} {...props}>
    <Step label="Account" />
    <Step label="Payment" />
    <Step label="Review" />
  </StepIndicator>
);

describe('StepIndicator', () => {
  it('is a named navigation landmark wrapping an ordered list', () => {
    const { container } = render(flow());
    expect(
      screen.getByRole('navigation', { name: 'Progress' }),
    ).toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeNull();
  });

  it('marks the current step', () => {
    render(flow());
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  // A tick and two shades of one colour are nothing to a screen reader and
  // very little to a colour-blind user, so the state is also a word.
  it("announces each step's position and state", () => {
    render(flow());
    expect(screen.getByText('Step 1 of 3, completed')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 3, current')).toBeInTheDocument();
    expect(screen.getByText('Step 3 of 3, upcoming')).toBeInTheDocument();
  });

  it('lets a step override its derived state', () => {
    render(
      <StepIndicator value={1}>
        <Step label="Account" />
        <Step label="Payment" status="completed" />
        <Step label="Review" />
      </StepIndicator>,
    );
    expect(screen.getByText('Step 2 of 3, completed')).toBeInTheDocument();
  });

  it('hides the connectors from assistive technology', () => {
    const { container } = render(flow());
    container
      .querySelectorAll('span[aria-hidden="true"]')
      .forEach((node) => expect(node).toHaveAttribute('aria-hidden', 'true'));
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThan(0);
  });

  // A step that looks clickable and does nothing is worse than inert text.
  it('is inert until onSelect is passed', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(flow());
    expect(screen.queryAllByRole('button')).toHaveLength(0);

    rerender(
      <StepIndicator value={1}>
        <Step label="Account" onSelect={onSelect} />
        <Step label="Payment" />
        <Step label="Review" />
      </StepIndicator>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('numbers the steps in the ambient locale', () => {
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        <StepIndicator value={0}>
          <Step label="حساب" />
          <Step label="پرداخت" />
        </StepIndicator>
      </DirectionProvider>,
    );
    expect(screen.getByText('۲')).toBeInTheDocument();
  });

  it('refuses to render a step outside the indicator', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Step label="Account" />)).toThrow();
    error.mockRestore();
  });

  it('spreads extra props onto a non-interactive step', () => {
    // These used to be dropped: `...rest` was spread only on the button branch.
    render(
      <StepIndicator value={0}>
        <Step label="Account" data-testid="first" id="step-account" />
        <Step label="Payment" />
      </StepIndicator>,
    );
    const node = screen.getByTestId('first');
    expect(node).toHaveAttribute('id', 'step-account');
  });

  it('renders a stepper dot row with its position announced', () => {
    render(<StepperDot count={3} value={1} />);
    expect(
      screen.getByRole('img', { name: 'Step 2 of 3' }),
    ).toBeInTheDocument();
  });
});
