import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardProvider, cardProviderUrl, hasCardProvider } from '.';

describe('CardProvider', () => {
  it('names the scheme by default, because an accepted-cards row is content', () => {
    render(<CardProvider provider="visa" />);
    expect(screen.getByRole('img', { name: 'Visa' })).toBeInTheDocument();
  });

  it('falls back to the generic mark rather than leaving a gap', () => {
    const { container } = render(<CardProvider provider="not-a-scheme" />);
    expect(
      container.querySelector('[data-card-provider="generic"]'),
    ).toBeInTheDocument();
    expect(hasCardProvider('not-a-scheme')).toBe(false);
  });

  it('points each variant at its own file', () => {
    expect(cardProviderUrl('visa')).toBe('/card-providers/original/visa.svg');
    expect(cardProviderUrl('visa', 'mono')).toBe(
      '/card-providers/mono/visa.svg',
    );
    expect(cardProviderUrl('VISA', 'outline')).toBe(
      '/card-providers/outline/visa.svg',
    );
  });
});
