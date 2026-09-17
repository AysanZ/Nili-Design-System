import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '.';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('spreads unknown props onto the element', () => {
    render(
      <Badge data-testid="badge" aria-label="3 unread">
        3
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveAttribute(
      'aria-label',
      '3 unread',
    );
  });

  it('forwards its ref', () => {
    let node: HTMLSpanElement | null = null;
    render(<Badge ref={(element) => { node = element; }}>Active</Badge>);
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });

  // `style` used to mean "visual variant", which made React's own style prop
  // unusable on a Badge.
  it('accepts a real inline style', () => {
    render(
      <Badge data-testid="badge" style={{ opacity: 0.5 }}>
        Active
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveStyle({ opacity: '0.5' });
  });

  it('emits no dark: classes — theming happens at the token layer', () => {
    render(
      <Badge data-testid="badge" appearance="light" color="blue">
        Active
      </Badge>,
    );
    expect(screen.getByTestId('badge').className).not.toContain('dark:');
  });

  it('keeps decorative adornments out of the text content', () => {
    render(
      <Badge dot data-testid="badge">
        Online
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    // The dot is an empty aria-hidden span, so nothing is added to the text.
    expect(badge).toHaveTextContent(/^Online$/);
    expect(badge.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
