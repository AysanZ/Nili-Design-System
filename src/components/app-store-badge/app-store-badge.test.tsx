import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppStoreBadge } from '.';
import { APP_STORES, APP_STORE_IDS } from './app-store-badge.data';

describe('app store catalogue', () => {
  it('links every storefront to its own brand guidelines', () => {
    for (const id of APP_STORE_IDS) {
      expect(APP_STORES[id].guidelines).toMatch(/^https:\/\//);
    }
  });
});

describe('AppStoreBadge', () => {
  it('reads as one sentence, not as two fragments', () => {
    render(<AppStoreBadge store="apple" />);
    expect(
      screen.getByRole('img', { name: 'Download on the App Store' }),
    ).toBeInTheDocument();
  });

  it('is a link only when given an href', () => {
    const { rerender } = render(<AppStoreBadge store="google" />);
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<AppStoreBadge store="google" href="https://example.com" />);
    expect(
      screen.getByRole('link', { name: 'Get it on Google Play' }),
    ).toBeInTheDocument();
  });

  it('lets the official artwork replace the stand-in drawing entirely', () => {
    const { container } = render(
      <AppStoreBadge
        store="apple"
        artwork={<svg data-testid="official" />}
      />,
    );
    expect(container.querySelector('[data-testid="official"]')).not.toBeNull();
    expect(container.querySelector('text')).toBeNull();
  });
});
