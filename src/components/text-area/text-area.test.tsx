import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from '.';
import { DirectionProvider } from '../../providers/direction';

describe('TextArea', () => {
  it('ties the label, hint and field together', () => {
    render(<TextArea label="Bio" hint="A sentence or two" />);
    const field = screen.getByLabelText('Bio');
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).toHaveAccessibleDescription('A sentence or two');
  });

  it('marks the field invalid and announces the error', () => {
    render(<TextArea label="Bio" error="Too short" />);
    expect(screen.getByLabelText('Bio')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('counts what the user typed', async () => {
    render(<TextArea label="Bio" showCount countLimit={20} />);
    await userEvent.type(screen.getByLabelText('Bio'), 'hello');
    expect(screen.getByText('5/20')).toBeInTheDocument();
  });

  // String.length counts UTF-16 code units, so an emoji costs two and the
  // counter runs ahead of the user's fingers.
  it('counts code points, not code units', () => {
    render(<TextArea label="Bio" value="ab😀" onChange={() => {}} showCount />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // A hard maxLength silently eats the end of a paste; the soft limit keeps
  // the text and turns the counter red instead.
  it('goes over a soft limit rather than blocking the keystroke', async () => {
    render(<TextArea label="Bio" showCount countLimit={3} />);
    const field = screen.getByLabelText('Bio');
    await userEvent.type(field, 'abcde');
    expect(field).toHaveValue('abcde');
    expect(screen.getByText('5/3')).toBeInTheDocument();
    expect(field).toHaveAttribute('aria-invalid', 'true');
  });

  it('follows a controlled value', () => {
    const { rerender } = render(
      <TextArea label="Bio" value="one" onChange={() => {}} showCount />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    rerender(
      <TextArea label="Bio" value="one two" onChange={() => {}} showCount />,
    );
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('localizes the counter digits', () => {
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        <TextArea
          label="زندگی‌نامه"
          value="hello"
          onChange={() => {}}
          showCount
          countLimit={20}
        />
      </DirectionProvider>,
    );
    expect(screen.getByText('۵/۲۰')).toBeInTheDocument();
  });

  // An assertive counter makes the field unusable with a screen reader.
  it('keeps the counter a polite live region', () => {
    render(<TextArea label="Bio" showCount value="hi" onChange={() => {}} />);
    expect(screen.getByText('2')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses one native resize handle without flex overriding its height', () => {
    const { container } = render(
      <TextArea label="Bio" showCount countLimit={120} />,
    );
    const field = screen.getByLabelText('Bio');

    expect(field).toHaveClass('resize-y');
    expect(field).not.toHaveClass('flex-1');
    expect(container.querySelector('svg')).toBeNull();
  });
});
