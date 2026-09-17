import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlaceholderLogo } from '.';
import { PLACEHOLDER_COMPANIES } from './placeholder-logo.data';

describe('placeholder companies', () => {
  it('ships nine, each with its own colour and mark', () => {
    expect(PLACEHOLDER_COMPANIES).toHaveLength(9);
    const colours = new Set(PLACEHOLDER_COMPANIES.map((c) => c.color));
    const marks = new Set(PLACEHOLDER_COMPANIES.map((c) => c.mark));
    expect(colours.size).toBe(9);
    expect(marks.size).toBe(9);
  });

  it('keeps every contact on a domain nobody can receive mail on', () => {
    for (const company of PLACEHOLDER_COMPANIES) {
      expect(company.email.endsWith('@husan.com')).toBe(true);
    }
  });
});

describe('PlaceholderLogo', () => {
  it('names itself after the company', () => {
    render(<PlaceholderLogo company="apex-financial" />);
    expect(
      screen.getByRole('img', { name: 'Apex Financial' }),
    ).toBeInTheDocument();
  });

  it('renders the empty tile with no company', () => {
    const { container } = render(<PlaceholderLogo />);
    expect(
      container.querySelector('[data-placeholder-logo="empty"]'),
    ).toBeInTheDocument();
  });

  it('only paints the brand colour on the original variant', () => {
    const { container: original } = render(
      <PlaceholderLogo company="apex-financial" variant="original" />,
    );
    const { container: black } = render(
      <PlaceholderLogo company="apex-financial" variant="black" />,
    );
    expect(
      original.querySelector<HTMLElement>('[data-placeholder-logo]')?.style
        .backgroundColor,
    ).not.toBe('');
    expect(
      black.querySelector<HTMLElement>('[data-placeholder-logo]')?.style
        .backgroundColor,
    ).toBe('');
  });
});
