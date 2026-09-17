import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Banner } from '.';

describe('Banner', () => {
  // Unlike Alert, a banner is normally on screen at first paint, so
  // interrupting a screen reader on every page load would be hostile.
  it('announces politely by default, even for errors', () => {
    render(<Banner status="error" title="Service degraded" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('can be raised to assertive when it appears mid-session', () => {
    render(
      <Banner status="error" title="Connection lost" urgency="assertive" />,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('keeps the decorative separator out of the accessible text', () => {
    render(<Banner title="Trial ending" description="3 days left" />);
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent('Trial ending');
    expect(banner).toHaveTextContent('3 days left');
    expect(banner.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders the action as a link or a button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(
      <Banner title="Trial ending" action={{ label: 'Upgrade', onClick }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Upgrade' }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Banner title="Trial ending" action={{ label: 'Docs', href: '/docs' }} />,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      '/docs',
    );
  });

  it('gives the close button an accessible name', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Banner
        title="Trial ending"
        dismissible
        dismissLabel="بستن"
        onDismiss={onDismiss}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'بستن' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  // right-3 would strand the close button on the wrong side in Persian.
  it('positions the dismiss button with a logical inset', () => {
    render(<Banner title="Trial ending" dismissible dismissLabel="Dismiss" />);
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close.className).toContain('end-3');
    expect(close.className).not.toContain('right-3');
  });

  it('emits no dark: classes — theming happens at the token layer', () => {
    render(<Banner status="success" appearance="light" title="Saved" />);
    expect(screen.getByRole('status').className).not.toContain('dark:');
  });

  it('forwards its ref', () => {
    let node: HTMLDivElement | null = null;
    render(<Banner ref={(element) => { node = element; }} title="Trial ending" />);
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
