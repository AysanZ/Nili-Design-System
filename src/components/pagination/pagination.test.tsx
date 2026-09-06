import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, getPaginationRange } from '.';
import { DirectionProvider } from '../../providers/direction';

describe('getPaginationRange', () => {
  it('lists every page while they all fit', () => {
    expect(getPaginationRange({ count: 5, page: 1 })).toEqual([1, 2, 3, 4, 5]);
  });

  // The window has to stay a constant width, or the buttons shuffle sideways
  // under the cursor and the next click lands on the wrong page.
  it('keeps a constant number of slots as the page walks forward', () => {
    const widths = [1, 2, 5, 9, 20].map(
      (page) => getPaginationRange({ count: 20, page }).length,
    );
    expect(new Set(widths).size).toBe(1);
  });

  it('elides both ends around a middle page', () => {
    expect(getPaginationRange({ count: 20, page: 10 })).toEqual([
      1,
      'start-ellipsis',
      9,
      10,
      11,
      'end-ellipsis',
      20,
    ]);
  });

  // An ellipsis hiding a single number is wider and less useful than the number.
  it('renders a one-page gap as that page', () => {
    expect(getPaginationRange({ count: 7, page: 1 })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it('renders nothing for an empty set', () => {
    expect(getPaginationRange({ count: 0, page: 1 })).toEqual([]);
  });
});

describe('Pagination', () => {
  it('is a named navigation landmark', () => {
    render(<Pagination count={5} defaultPage={1} />);
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination count={5} page={3} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('reports the page the user clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={1} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('works uncontrolled', async () => {
    render(<Pagination count={5} defaultPage={1} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  // Hiding the arrow at the boundary would resize the row and shift every
  // other target sideways.
  it('disables the arrows at the ends rather than removing them', () => {
    const { rerender } = render(<Pagination count={5} page={1} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(<Pagination count={5} page={5} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('never navigates past either end', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination count={5} page={5} showEdges onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // Persian digits are a formatting decision, so the DOM keeps a real number
  // and the accessible name is built from the same localized string.
  it('renders Persian digits under a Persian locale', () => {
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        <Pagination count={5} page={2} />
      </DirectionProvider>,
    );
    expect(screen.getByText('۲')).toBeInTheDocument();
  });

  it('collapses to a summary when type is arrows', () => {
    render(<Pagination count={10} page={3} deviceMode="mobile" />);
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to page 2' })).toBeNull();
  });

  it('renders nothing without pages', () => {
    const { container } = render(<Pagination count={0} />);
    expect(container.firstChild).toBeNull();
  });

  // Figma `🧪 Advanced`: the summary before the trail and the rows-per-page
  // control after it.
  it('renders the summary and the per-page control when advanced', () => {
    render(
      <Pagination
        advanced
        count={16}
        page={2}
        pageSize={7}
        pageSizeOptions={[7, 10]}
      />,
    );
    expect(screen.getByText('Page 2 of 16')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Rows per page' }),
    ).toBeInTheDocument();
  });

  it('omits both when advanced is off', () => {
    render(<Pagination count={16} page={2} pageSize={7} />);
    expect(screen.queryByText('Page 2 of 16')).not.toBeInTheDocument();
  });
});
