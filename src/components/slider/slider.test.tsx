import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '.';
import { DirectionProvider } from '../../providers/direction';

describe('Slider', () => {
  it('is a labelled slider with live values', () => {
    render(<Slider defaultValue={40} label="Volume" />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  });

  it('steps with the arrow keys', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        value={40}
        step={5}
        label="Volume"
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(45);
  });

  // WAI-ARIA: in a right-to-left slider ArrowRight lowers the value. Up and
  // Down keep meaning "more" and "less" in both directions.
  it('follows the reading direction with the horizontal arrows', async () => {
    const onValueChange = vi.fn();
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        <Slider value={40} label="Volume" onValueChange={onValueChange} />
      </DirectionProvider>,
    );
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(39);

    onValueChange.mockClear();
    await userEvent.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenCalledWith(41);
  });

  /*
   * The regression this guards: the decorator set `dir="rtl"` on a wrapper
   * without mounting a DirectionProvider, so CSS mirrored the track while the
   * arithmetic stayed LTR and the thumb ran away from the pointer. Direction
   * is now read off the element, so a bare `dir` attribute is enough.
   */
  it('mirrors the arrows from a bare dir attribute, with no provider', async () => {
    const onValueChange = vi.fn();
    render(
      <div dir="rtl">
        <Slider value={40} label="Volume" onValueChange={onValueChange} />
      </div>,
    );
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(39);
  });

  it('lets an explicit dir prop override the surrounding direction', async () => {
    const onValueChange = vi.fn();
    render(
      <div dir="rtl">
        <Slider
          value={40}
          dir="ltr"
          label="Volume"
          onValueChange={onValueChange}
        />
      </div>,
    );
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(41);
  });

  it('jumps to the ends with Home and End', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        value={40}
        min={10}
        max={90}
        label="Volume"
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{Home}');
    expect(onValueChange).toHaveBeenCalledWith(10);
    await userEvent.keyboard('{End}');
    expect(onValueChange).toHaveBeenCalledWith(90);
  });

  it('never leaves the range', async () => {
    const onValueChange = vi.fn();
    render(<Slider value={100} label="Volume" onValueChange={onValueChange} />);
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // A slider wired straight to a request sends one per pixel of drag.
  it('commits once, on release', async () => {
    const onValueCommit = vi.fn();
    render(
      <Slider defaultValue={40} label="Volume" onValueCommit={onValueCommit} />,
    );
    screen.getByRole('slider').focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(onValueCommit).toHaveBeenCalledTimes(2);
    expect(onValueCommit).toHaveBeenLastCalledWith(42);
  });

  it('renders two thumbs for a range value', () => {
    render(<Slider defaultValue={[20, 60]} label="Price" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  // The thumbs bound each other, so a range cannot invert itself.
  it('stops the thumbs crossing', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider value={[40, 41]} label="Price" onValueChange={onValueChange} />,
    );
    screen.getAllByRole('slider')[0].focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith([41, 41]);
  });

  it('keeps a minimum gap between the thumbs when asked', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        value={[40, 50]}
        minStepsBetweenThumbs={10}
        label="Price"
        onValueChange={onValueChange}
      />,
    );
    screen.getAllByRole('slider')[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('localizes the value text', () => {
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        <Slider value={42} label="حجم" showValue />
      </DirectionProvider>,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '۴۲');
    expect(screen.getByText('۴۲')).toBeInTheDocument();
  });

  it('takes it out of the tab order while disabled', () => {
    render(<Slider value={40} label="Volume" disabled />);
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '-1');
  });
});
