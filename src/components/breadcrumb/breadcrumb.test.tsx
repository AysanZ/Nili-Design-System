import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem } from '.';

const trail = (props = {}) => (
  <Breadcrumb label="Breadcrumb" {...props}>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
    <BreadcrumbItem href="/projects/nili">Nili</BreadcrumbItem>
    <BreadcrumbItem current>Components</BreadcrumbItem>
  </Breadcrumb>
);

describe('Breadcrumb', () => {
  it('is a named navigation landmark wrapping an ordered list', () => {
    const { container } = render(trail());
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
    expect(container.querySelector('ol')).not.toBeNull();
  });

  // Linking to the page you are already on is a dead end.
  it('renders the current crumb as text with aria-current', () => {
    render(trail());
    // The label sits in its own span (Figma underlines only the label).
    const current = screen.getByText('Components').closest('[aria-current]');
    expect(current?.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Components' })).toBeNull();
  });

  it('hides separators from assistive technology', () => {
    const { container } = render(trail());
    const separators = container.querySelectorAll('[data-slot="separator"]');
    expect(separators.length).toBe(3);
    separators.forEach((node) =>
      expect(node).toHaveAttribute('aria-hidden', 'true'),
    );
  });

  it('mirrors the arrow divider in RTL but not slash or dot', () => {
    const { container, rerender } = render(trail({ divider: 'arrow' }));
    expect(container.innerHTML).toContain('rtl:-scale-x-100');

    rerender(trail({ divider: 'slash' }));
    expect(container.innerHTML).not.toContain('rtl:-scale-x-100');
  });

  it('collapses long trails, keeping the first and last crumbs', () => {
    render(trail({ maxItems: 3 }));
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Projects' })).toBeNull();
  });

  /* `asChild` used to hand `Slot` the icon-and-label fragment rather than the
     consumer's element, so the crumb's classes landed on a fragment — React
     warned and the styling vanished. The element the consumer passes has to be
     the one that ends up in the DOM, carrying both. */
  it('gives asChild the consumer element, carrying the crumb classes', () => {
    render(
      <Breadcrumb label="Breadcrumb">
        <BreadcrumbItem asChild>
          <a href="/" data-testid="router-link">
            Home
          </a>
        </BreadcrumbItem>
        <BreadcrumbItem current>Components</BreadcrumbItem>
      </Breadcrumb>,
    );

    const link = screen.getByTestId('router-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
    // The crumb's own classes are on the consumer's element, not a wrapper.
    expect(link.className).not.toBe('');
    // And the label still sits in its own slot, as it does without asChild.
    expect(link.querySelector('[data-slot="label"]')?.textContent).toBe('Home');
    // One element, not a wrapper around it.
    expect(link.parentElement?.tagName).toBe('LI');
  });
});
