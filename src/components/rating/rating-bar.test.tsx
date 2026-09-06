import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingBar, RatingBarArea } from '.';

describe('RatingBar', () => {
  it('is a radiogroup of real radios', () => {
    render(<RatingBar labels={{ root: 'Satisfaction' }} />);
    expect(
      screen.getByRole('radiogroup', { name: 'Satisfaction' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('reports the score the user picked', async () => {
    const onValueChange = vi.fn();
    render(<RatingBar type="number" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '4 of 5' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it('works uncontrolled', async () => {
    render(<RatingBar type="emoji" />);
    await userEvent.click(screen.getByRole('radio', { name: '2 of 5' }));
    expect(screen.getByRole('radio', { name: '2 of 5' })).toBeChecked();
  });

  it('honours count', () => {
    render(<RatingBar type="number" count={10} />);
    expect(screen.getAllByRole('radio')).toHaveLength(10);
    expect(screen.getByRole('radio', { name: '10 of 10' })).toBeInTheDocument();
  });

  it('localizes the digits in both the glyph and the name', () => {
    render(<RatingBar type="number" locale="fa" />);
    expect(screen.getByRole('radio', { name: '۳ of ۵' })).toBeInTheDocument();
  });

  it('disables every option at once', () => {
    render(<RatingBar disabled />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
  });
});

describe('RatingBarArea', () => {
  it('renders the scale above a named comment box', () => {
    render(
      <RatingBarArea
        type="emoji"
        commentLabel="Your comment"
        commentPlaceholder="Tell us why!"
      />,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Your comment' }),
    ).toBeInTheDocument();
  });

  it('reports what was typed', async () => {
    const onCommentChange = vi.fn();
    render(
      <RatingBarArea
        commentLabel="Your comment"
        onCommentChange={onCommentChange}
      />,
    );
    await userEvent.type(screen.getByRole('textbox'), 'ok');
    expect(onCommentChange).toHaveBeenLastCalledWith('ok');
  });

  it('can drop the comment box', () => {
    render(<RatingBarArea showComment={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
