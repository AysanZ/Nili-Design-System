import { describe, it, expect, vi, beforeAll } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoPlayer } from '.';
import { DirectionProvider } from '../../providers/direction';

// happy-dom does not implement media playback, so the element's own methods
// are stubbed. Everything else — events, attributes, the control bar — is real.
beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
});

const player = (props = {}) => (
  <VideoPlayer
    src="/demo.mp4"
    tracks={<track kind="captions" srcLang="en" src="/demo.vtt" default />}
    {...props}
  />
);

describe('VideoPlayer', () => {
  it('is a named region around a real video element', () => {
    const { container } = render(player());
    expect(
      screen.getByRole('group', { name: 'Video player' }),
    ).toBeInTheDocument();
    expect(container.querySelector('video')).not.toBeNull();
  });

  it('renders the caption track it was given', () => {
    const { container } = render(player());
    const track = container.querySelector('track');
    expect(track).toHaveAttribute('kind', 'captions');
  });

  it('names every control', () => {
    const { container } = render(player());
    expect(
      screen.getAllByRole('button', { name: 'Play' }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Full screen' }),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-slot="video-volume"]')).toHaveClass(
      'me-2',
    );
  });

  it('plays and reflects the media element, not a prop', async () => {
    const onPlayChange = vi.fn();
    const { container } = render(player({ onPlayChange }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Play' })[0]);
    const video = container.querySelector('video')!;
    expect(video.play).toHaveBeenCalled();

    // The button label follows the element's own event, not the click.
    act(() => {
      video.dispatchEvent(new Event('play'));
    });
    expect(onPlayChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('mutes', async () => {
    const { container } = render(player());
    await userEvent.click(screen.getByRole('button', { name: 'Mute' }));
    expect(container.querySelector('video')!.muted).toBe(true);
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
  });

  // The video is the interactive element, so shortcuts live on it — and they
  // must not swallow keys aimed at a button in the control bar.
  it('takes keyboard shortcuts on the video itself', async () => {
    const { container } = render(player());
    const video = container.querySelector('video')!;
    video.focus();
    await userEvent.keyboard(' ');
    expect(video.play).toHaveBeenCalled();

    await userEvent.keyboard('m');
    expect(video.muted).toBe(true);
  });

  it('shows a localized timestamp', () => {
    render(
      <DirectionProvider locale="fa" attributeTarget="self">
        {player()}
      </DirectionProvider>,
    );
    expect(screen.getByText('۰۰:۰۰ / ۰۰:۰۰')).toBeInTheDocument();
  });

  // A video's time axis runs from start to end; mirrored, the playhead would
  // travel backwards as the video advances.
  it('pins the timeline to LTR even in a Persian UI', () => {
    const { container } = render(
      <DirectionProvider locale="fa" attributeTarget="self">
        {player()}
      </DirectionProvider>,
    );
    const seek = screen.getByRole('slider', { name: 'Seek' });
    expect(seek.closest('[dir="ltr"]')).not.toBeNull();
    expect(container.querySelector('[dir="ltr"]')).not.toBeNull();
  });

  it('hands control back to the browser when asked', () => {
    const { container } = render(player({ nativeControls: true }));
    expect(container.querySelector('video')).toHaveAttribute('controls');
    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  });
});
