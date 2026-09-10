import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '.';

describe('Button', () => {
  it('defaults to type="button" so it cannot submit a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('blocks clicks while loading and marks itself busy', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading loadingLabel="Saving" onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // asChild must produce ONE element, not <button><a>, which is invalid HTML
  // and a keyboard trap.
  it('renders as a link with asChild without nesting', () => {
    const { container } = render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(container.querySelector('button')).toBeNull();
    expect(link.className).toContain('inline-flex');
  });

  it('forwards its ref', () => {
    let node: HTMLButtonElement | null = null;
    render(<Button ref={(element) => (node = element)}>Save</Button>);
    expect(node).toBeInstanceOf(HTMLButtonElement);
  });

  it('lets className win over internal utilities via tailwind-merge', () => {
    render(<Button className="bg-red-500">Save</Button>);
    // Compare whole tokens: `focused:bg-primary-base` is a different utility
    // (the focus fill) and must survive; only the resting fill is replaced.
    const classes = screen.getByRole('button').className.split(' ');
    expect(classes).toContain('bg-red-500');
    expect(classes).not.toContain('bg-primary-base');
  });
});
