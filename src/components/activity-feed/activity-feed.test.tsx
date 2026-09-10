import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ActivityFeed,
  ActivityFeedItem,
  ActivityFeedTab,
  ActivityFeedTabSeparator,
} from '.';

describe('ActivityFeed', () => {
  it('is a labelled region wrapping a list', () => {
    render(
      <ActivityFeed label="Recent activity">
        <ActivityFeedItem title="One" />
        <ActivityFeedItem title="Two" />
      </ActivityFeed>,
    );
    expect(
      screen.getByRole('region', { name: 'Recent activity' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  // A click handler on an <li> is unreachable by keyboard.
  it('renders a real button when the row is selectable', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ActivityFeed label="Feed">
        <ActivityFeedItem title="One" onSelect={onSelect} />
      </ActivityFeed>,
    );
    const button = screen.getByRole('button', { name: /One/ });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders the file attachment for type="file"', () => {
    render(
      <ActivityFeed label="Feed">
        <ActivityFeedItem
          type="file"
          title="Upload"
          file={{ name: 'a.pdf', size: '1 MB' }}
        />
      </ActivityFeed>,
    );
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    expect(screen.getByText('(1 MB)')).toBeInTheDocument();
  });

  it('renders the quoted body for type="message"', () => {
    const { container } = render(
      <ActivityFeed label="Feed">
        <ActivityFeedItem type="message" title="Comment" message="Nice work" />
      </ActivityFeed>,
    );
    const quote = container.querySelector('blockquote');
    expect(quote).toHaveTextContent('Nice work');
    // Figma draws Message as boxed text, not a side-ruled quote.
    expect(quote?.className).toContain('rounded-md');
    expect(quote?.className).toContain('border-soft-200');
  });

  it('marks unread items with a logical inset', () => {
    const { container } = render(
      <ActivityFeed label="Feed">
        <ActivityFeedItem title="One" unread />
      </ActivityFeed>,
    );
    expect(container.querySelector('[data-unread]')).not.toBeNull();
    expect(container.innerHTML).toContain('before:start-0');
  });

  it('announces the selected tab', () => {
    render(
      <ActivityFeed
        label="Feed"
        tabs={
          <>
            <ActivityFeedTab selected>All</ActivityFeedTab>
            <ActivityFeedTab>Files</ActivityFeedTab>
          </>
        }
      >
        <ActivityFeedItem title="One" />
      </ActivityFeed>,
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Files' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  // Actions inside a selectable row must not be nested in its button.
  it('keeps actions outside the stretched select button', () => {
    const { container } = render(
      <ActivityFeed label="Feed">
        <ActivityFeedItem
          type="button"
          title="Request"
          onSelect={() => undefined}
          actions={<button type="button">Approve</button>}
        />
      </ActivityFeed>,
    );
    expect(container.querySelector('button button')).toBeNull();
    expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
  });

  it('renders the tab count and a separator', () => {
    render(
      <ActivityFeed
        label="Feed"
        tabs={
          <>
            <ActivityFeedTab selected>All</ActivityFeedTab>
            <ActivityFeedTab count={2}>Inbox</ActivityFeedTab>
            <ActivityFeedTabSeparator />
          </>
        }
      />,
    );
    expect(screen.getByRole('tab', { name: /Inbox/ })).toHaveTextContent('2');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
