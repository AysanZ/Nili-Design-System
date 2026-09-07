import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { VideoPlayerVariantProps } from './video-player.styles';

export type VideoRatio = NonNullable<VideoPlayerVariantProps['ratio']>;
/** Figma's Size: Medium | Small. */
export type VideoSize = NonNullable<VideoPlayerVariantProps['size']>;

export interface VideoPlayerLabels {
  /** Accessible name for the whole player region. */
  root?: string;
  play?: string;
  pause?: string;
  mute?: string;
  unmute?: string;
  /** Name for the timeline slider. */
  seek?: string;
  volume?: string;
  fullscreen?: string;
  exitFullscreen?: string;
  /** Announced position, e.g. `` (cur, total) => `${cur} of ${total}` ``. */
  progress?: (current: string, total: string) => string;
}

/**
 * Extends the `<video>` props, not a `<div>`'s: everything unrecognised is
 * spread onto the media element, so `preload`, `crossOrigin` and the media
 * events all work without this component having to re-declare them.
 * `className` is the exception — it styles the container.
 */
export interface VideoPlayerProps extends Omit<
  ComponentPropsWithoutRef<'video'>,
  'src' | 'poster' | 'controls' | 'children' | 'autoPlay' | 'loop' | 'muted'
> {
  src: string;
  poster?: string;
  /**
   * Caption and subtitle tracks. Pass real `<track>` elements — captions are
   * the accessibility story of this component, not an optional extra.
   */
  tracks?: ReactNode;

  size?: VideoSize;
  ratio?: VideoRatio;
  autoPlay?: boolean;
  loop?: boolean;
  /** Starts muted. Required by browsers for autoplay to be allowed at all. */
  muted?: boolean;
  /**
   * Hand control back to the browser's own UI. Worth doing when the platform
   * player is better than anything you would ship — picture-in-picture,
   * AirPlay, and caption styling all come free with it.
   */
  nativeControls?: boolean;

  /** Seconds jumped by the arrow keys. */
  seekStep?: number;

  onPlayChange?: (playing: boolean) => void;
  onTimeChange?: (currentTime: number) => void;

  /**
   * BCP-47 tag driving the timestamps (`'fa'` → Persian). Defaults to the
   * ambient locale from `NiliProvider`.
   */
  locale?: string;
  labels?: VideoPlayerLabels;
}
