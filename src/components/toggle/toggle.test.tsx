import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle, ToggleGroup } from '.';

function Bar(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup label="View" {...props}>
      <Toggle value="list">List</Toggle>
      <Toggle value="grid">Grid</Toggle>
      <Toggle value="board">Board</Toggle>
    </ToggleGroup>
  );
}

describe('Toggle', () => {
  it('is a radiogroup of radios, not pressed buttons', () => {
    render(<Bar defaultValue="list" />);
    expect(
      screen.getByRole('radiogroup', { name: 'View' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  });

  it('selects on click and reports the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Bar defaultValue="list" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
  });

  it('is controllable from the parent', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Bar value="list" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: 'Board' }));
    expect(onValueChange).toHaveBeenCalledWith('board');
    // Value is pinned by the parent, so the selection must not move on its own.
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  });

  it('keeps one tab stop and moves with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Bar defaultValue="list" />);

    const list = screen.getByRole('radio', { name: 'List' });
    const grid = screen.getByRole('radio', { name: 'Grid' });
    expect(list).toHaveAttribute('tabindex', '0');
    expect(grid).toHaveAttribute('tabindex', '-1');

    list.focus();
    await user.keyboard('{ArrowRight}');
    expect(grid).toBeChecked();
  });

  it('wraps at the end and jumps with Home/End', async () => {
    const user = userEvent.setup();
    render(<Bar defaultValue="board" />);

    screen.getByRole('radio', { name: 'Board' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();

    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Board' })).toBeChecked();
  });

  it('disables every segment when the group is disabled', () => {
    render(<Bar defaultValue="list" disabled />);
    screen.getAllByRole('radio').forEach((node) => {
      expect(node).toBeDisabled();
    });
  });

  it('skips a disabled segment when arrowing', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup label="View" defaultValue="list">
        <Toggle value="list">List</Toggle>
        <Toggle value="grid" disabled>
          Grid
        </Toggle>
        <Toggle value="board">Board</Toggle>
      </ToggleGroup>,
    );

    screen.getByRole('radio', { name: 'List' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Board' })).toBeChecked();
  });

  it('renders an icon-only segment without its text', () => {
    render(
      <ToggleGroup label="Align" defaultValue="start">
        <Toggle value="start" iconOnly aria-label="Align start">
          Align start
        </Toggle>
        <Toggle value="end" iconOnly aria-label="Align end">
          Align end
        </Toggle>
      </ToggleGroup>,
    );
    const node = screen.getByRole('radio', { name: 'Align start' });
    expect(node).toHaveTextContent('');
  });

  it('refuses to render outside a group', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Toggle value="x">X</Toggle>)).toThrow(
      /must be rendered inside/,
    );
    quiet.mockRestore();
  });

  // Figma's Switch Toggle has a visible Label above it.
  it('renders the visible label and names the group from it', () => {
    render(
      <ToggleGroup label="View mode" defaultValue="a">
        <Toggle value="a">A</Toggle>
        <Toggle value="b">B</Toggle>
      </ToggleGroup>,
    );
    expect(screen.getByText('View mode')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('View mode');
  });

  it('falls back to ariaLabel with no visible label', () => {
    render(
      <ToggleGroup ariaLabel="View mode" defaultValue="a">
        <Toggle value="a">A</Toggle>
      </ToggleGroup>,
    );
    expect(screen.queryByText('View mode')).not.toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('View mode');
  });
});
