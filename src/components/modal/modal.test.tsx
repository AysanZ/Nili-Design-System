import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, StatusModal } from '.';

const setup = (props = {}) =>
  render(
    <Modal
      open
      onOpenChange={vi.fn()}
      title="Delete project"
      closeLabel="Close"
      {...props}
    >
      <button type="button">inside</button>
    </Modal>,
  );

describe('Modal', () => {
  it('is a labelled modal dialog', () => {
    setup({ description: 'Cannot be undone' });
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Delete project');
    expect(dialog).toHaveAccessibleDescription('Cannot be undone');
  });

  it('closes on Escape and from the close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('locks background scroll and traps focus', () => {
    setup();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(
      true,
    );
  });

  it('renders nothing when closed', () => {
    render(<Modal open={false} onOpenChange={vi.fn()} title="Delete" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // A click inside the panel must not read as an outside click.
  it('keeps the panel outside the click-handling overlay', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.click(screen.getByRole('button', { name: 'inside' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('shows the status icon when a status is given', () => {
    const { container } = setup({ status: 'error' });
    expect(
      container.ownerDocument.querySelector('[aria-hidden="true"] svg'),
    ).not.toBeNull();
  });

  it('draws only one divider when the footer follows the header directly', () => {
    render(
      <Modal
        open
        onOpenChange={vi.fn()}
        title="Confirm"
        footer={<button type="button">Apply</button>}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('header')).toHaveClass('border-b-0');
    expect(dialog.querySelector('footer')).toHaveClass('border-t');
  });
});

describe('StatusModal', () => {
  it('defaults to vertical alignment', () => {
    render(
      <StatusModal
        open
        status="success"
        onOpenChange={vi.fn()}
        title="Saved"
        closeLabel="Close"
      />,
    );
    const dialog = screen.getByRole('dialog');
    const header = dialog.querySelector('header');

    expect(dialog).toHaveAccessibleName('Saved');
    expect(header).toHaveClass('flex-col', 'items-center', 'text-center');
    expect(header).not.toHaveClass('items-start');
  });
});
