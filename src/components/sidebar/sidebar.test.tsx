import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiLayoutGridLine } from '@remixicon/react';
import userEvent from '@testing-library/user-event';
import {
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
  SidebarUser,
} from '.';
import { Icon } from '../icon';

const panel = (collapsed: boolean) => (
  <Sidebar collapsed={collapsed} label="Main">
    <SidebarGroup label="Main">
      <SidebarItem icon={<Icon icon={RiLayoutGridLine} />} active>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/calendar">Calendar</SidebarItem>
    </SidebarGroup>
    <SidebarUser name="Olivia Rhye" email="olivia@husan.com" />
  </Sidebar>
);

describe('Sidebar', () => {
  it('names the navigation landmark', () => {
    render(panel(false));
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current, not just a tint', () => {
    render(panel(false));
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders a link when given an href and a button otherwise', () => {
    render(panel(false));
    expect(screen.getByRole('link', { name: 'Calendar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  });

  /*
   * The rail is the layout that needs its accessible names most: without them
   * it is a column of unlabelled icons. The labels are faded to zero width
   * rather than unmounted, so they are still there to be read.
   */
  it('keeps every row named while collapsed', () => {
    render(panel(true));
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Calendar' })).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  /*
   * The panel owns its collapse state. It did not before: `collapsed` was a
   * plain prop with no trigger, so a sidebar dropped into an app could not be
   * folded until somebody wired up a `useState` — which is why it looked like
   * it did not collapse at all.
   */
  it('folds itself when the trigger is pressed', async () => {
    render(
      <Sidebar label="Main">
        <SidebarHeader
          title="Synergy"
          action={<SidebarTrigger collapseLabel="Collapse" expandLabel="Expand" />}
          collapsedAction={
            <SidebarTrigger collapseLabel="Collapse" expandLabel="Expand" />
          }
        />
        <SidebarGroup label="Main">
          <SidebarItem>Dashboard</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );

    const trigger = screen.getByRole('button', { name: 'Collapse' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(trigger);

    const expand = screen.getByRole('button', { name: 'Expand' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    // Still there, still named: the rail is not a different component.
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('lets the app drive it instead, when asked', async () => {
    render(
      <Sidebar collapsed label="Main">
        <SidebarHeader
          title="Synergy"
          collapsedAction={
            <SidebarTrigger collapseLabel="Collapse" expandLabel="Expand" />
          }
        />
      </Sidebar>,
    );
    // A controlled panel does not move on its own; the prop is the source.
    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(
      screen.getByRole('button', { name: 'Expand' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides the account details but keeps the account reachable', () => {
    render(panel(true));
    expect(screen.getByRole('button', { name: 'Olivia Rhye' })).toBeInTheDocument();
    expect(screen.queryByText('olivia@husan.com')).toBeNull();
  });
});
