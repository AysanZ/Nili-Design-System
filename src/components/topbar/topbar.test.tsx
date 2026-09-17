import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Topbar, TopbarItem, TopbarUser } from '.';

describe('Topbar', () => {
  it('keeps the actions outside the navigation landmark', () => {
    render(
      <Topbar label="Main" actions={<TopbarUser name="Olivia" />}>
        <TopbarItem active>Dashboard</TopbarItem>
        <TopbarItem href="/calendar">Calendar</TopbarItem>
      </Topbar>,
    );

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toContainElement(screen.getByRole('button', { name: 'Dashboard' }));
    // The account menu is not navigation; a screen reader should not read it
    // out as part of the site menu.
    expect(nav).not.toContainElement(
      screen.getByRole('button', { name: /Olivia/ }),
    );
  });

  it('marks the current page', () => {
    render(
      <Topbar label="Main">
        <TopbarItem active>Dashboard</TopbarItem>
      </Topbar>,
    );
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('announces a menu item as one', () => {
    render(
      <Topbar label="Main">
        <TopbarItem menu>Others</TopbarItem>
      </Topbar>,
    );
    expect(screen.getByRole('button', { name: 'Others' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });
});
