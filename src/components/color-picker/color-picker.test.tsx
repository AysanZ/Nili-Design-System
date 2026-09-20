import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker, ColorDot } from '.';
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, isLight } from '@/lib/color';

describe('colour maths', () => {
  it('round-trips hex through hsv', () => {
    const rgb = hexToRgb('#335CFF')!;
    expect(rgbToHex(hsvToRgb(rgbToHsv(rgb)))).toBe('#335cff');
  });

  it('expands short hex and reads alpha', () => {
    expect(hexToRgb('#f00')).toMatchObject({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgb('#335CFF80')?.a).toBeCloseTo(0.5, 1);
  });

  it('rejects invalid hex instead of guessing', () => {
    expect(hexToRgb('nope')).toBeNull();
    expect(hexToRgb('#12345')).toBeNull();
  });

  // A white cursor on pale yellow is invisible; the marker flips on luminance.
  it('detects light colours for marker contrast', () => {
    expect(isLight(hexToRgb('#FFF9C4')!)).toBe(true);
    expect(isLight(hexToRgb('#0E121B')!)).toBe(false);
  });
});

describe('ColorPicker', () => {
  it('exposes the spectrum and sliders to assistive tech', () => {
    render(<ColorPicker defaultValue="#335CFF" labels={{ hue: 'Hue' }} />);
    expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute(
      'aria-valuemax',
      '360',
    );
  });

  // A pointer-only colour area is unusable without a mouse.
  it('moves the hue with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#FF0000"
        onChange={onChange}
        labels={{ hue: 'Hue' }}
      />,
    );
    const hue = screen.getByRole('slider', { name: 'Hue' });
    hue.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalled();
  });

  it('keeps the hex field in LTR even under a Persian UI', () => {
    render(<ColorPicker defaultValue="#335CFF" labels={{ hex: 'Hex' }} />);
    expect(screen.getByLabelText('Hex')).toHaveAttribute('dir', 'ltr');
  });

  it('selects a swatch', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#335CFF"
        onChange={onChange}
        swatches={['#1FC16B']}
      />,
    );
    await user.click(screen.getByRole('button', { name: '#1FC16B' }));
    expect(onChange).toHaveBeenCalledWith('#1FC16B');
  });

  it('insets footer actions to align with the picker content', () => {
    const { container } = render(
      <ColorPicker footer={<button type="button">Apply</button>} />,
    );

    const footer = container.querySelector('[data-slot="color-picker-footer"]');
    expect(footer).toHaveClass('px-[15px]', 'pb-[15px]');
    expect(footer).toContainElement(
      screen.getByRole('button', { name: 'Apply' }),
    );
  });
});

describe('ColorDot', () => {
  it('announces its selected state', () => {
    render(<ColorDot color="blue" aria-label="Blue" selected />);
    expect(screen.getByRole('button', { name: 'Blue' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
