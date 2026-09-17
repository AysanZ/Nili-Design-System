import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountryFlag, hasFlag, flagUrl } from '.';
import { COUNTRY_CODES } from './flags.data';
import { setAssetBasePath } from '../../lib/assets';

afterEach(() => setAssetBasePath(''));

describe('flag catalogue', () => {
  it('covers the codes a product actually asks for', () => {
    for (const code of ['ir', 'tj', 'us', 'gb', 'de', 'cn', 'af', 'tr']) {
      expect(hasFlag(code)).toBe(true);
    }
    expect(COUNTRY_CODES.length).toBeGreaterThan(400);
  });

  it('looks codes up case-insensitively', () => {
    expect(hasFlag('IR')).toBe(true);
    expect(hasFlag('Ir')).toBe(true);
  });
});

describe('CountryFlag', () => {
  it('is decorative without a label', () => {
    const { container } = render(<CountryFlag code="ir" />);
    // An empty alt keeps the image out of the accessibility tree entirely,
    // which is the point: the country name is already on screen beside it.
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('is an image with a name when labelled', () => {
    render(<CountryFlag code="ir" label="Iran" />);
    expect(screen.getByRole('img', { name: 'Iran' })).toBeInTheDocument();
  });

  it('renders a neutral disc for an unknown code rather than nothing', () => {
    const { container } = render(<CountryFlag code="zz" />);
    expect(container.querySelector('img')).toBeNull();
    expect(
      container.querySelector('[data-country-flag="unknown"]'),
    ).toBeInTheDocument();
  });

  it('lazy-loads by default so a long picker does not fetch 250 images', () => {
    const { container } = render(<CountryFlag code="de" />);
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy');
  });

  it('honours the asset base path', () => {
    setAssetBasePath('https://cdn.example.com/nili/');
    expect(flagUrl('ir')).toBe('https://cdn.example.com/nili/flags/ir.svg');
    setAssetBasePath('');
    expect(flagUrl('ir')).toBe('/flags/ir.svg');
    expect(flagUrl('IR', '/assets')).toBe('/assets/flags/ir.svg');
  });
});
