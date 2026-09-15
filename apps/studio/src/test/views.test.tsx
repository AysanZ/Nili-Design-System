import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';
import { starter } from '../core/starter';

/** Seeds the autosave so the app opens on the view under test. */
function open(view: 'design' | 'variants' | 'code'): void {
  localStorage.setItem(
    'nili.studio.v2',
    JSON.stringify({ doc: starter(), ui: { view, lang: 'en', axes: ['invalid', null] } }),
  );
}

describe('every view mounts', () => {
  beforeEach(() => localStorage.clear());

  it('draws the canvas', () => {
    open('design');
    render(<App />);
    expect(screen.getAllByText('Email address').length).toBeGreaterThan(0);
  });

  it('crosses the props in the variants grid', () => {
    open('variants');
    render(<App />);
    expect(screen.getAllByText('true').length).toBeGreaterThan(0);
    expect(screen.getAllByText('false').length).toBeGreaterThan(0);
  });

  it('shows the generated files', () => {
    open('code');
    render(<App />);
    expect(screen.getByText('AccountField.tsx')).toBeTruthy();
    expect(screen.getByText('AccountField.stories.tsx')).toBeTruthy();
  });
});
