import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  RiPlayFill,
  RiPauseFill,
  RiVolumeUpFill,
  RiVolumeMuteFill,
  RiFullscreenLine,
  RiFullscreenExitLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useDirection } from '../../providers/direction';
import { formatNumber } from '../../lib/numerals';
import { Icon } from '../icon';
import { Slider } from '../slider';
import {
  videoPlayerVariants,
  videoElementVariants,
  videoControlsVariants,
  videoButtonVariants,
  videoOverlayButtonVariants,
  videoTimeVariants,
} from './video-player.styles';
import type { VideoPlayerProps, VideoPlayerLabels } from './video-player.types';

const DEFAULT_LABELS: Required<VideoPlayerLabels> = {
  root: 'Video player',
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
  seek: 'Seek',
  volume: 'Volume',
  fullscreen: 'Full screen',
  exitFullscreen: 'Exit full screen',
  progress: (current, total) => `${current} of ${total}`,
};

/**
 * Video with a styled control bar.
 *
 * ## The timeline does not mirror
 *
 * Everything else in this system follows the reading direction. The timeline
 * does not: a video's time axis runs from its start to its end, and that is
 * not a sentence. Flipping it would put the beginning of the film on the right
 * and make the playhead travel backwards as the video advances — every player
 * a Persian user has ever used, from YouTube to their television, runs it
 * left-to-right. The control *bar* still mirrors, so play sits on the leading
 * edge; only the track inside it is pinned with `dir="ltr"`.
 *
 * ## State comes from the media element
 *
 * There is no `state` prop. Playing, paused, buffering and ended are things
 * the `<video>` already knows and reports through events, and a prop for them
 * would be a second source of truth that drifts the moment the user pauses
 * from the keyboard or the system interrupts playback.
 *
 * ## Captions are not optional
 *
 * `tracks` takes real `<track>` elements. A video without captions is
 * unavailable to deaf and hard-of-hearing users, unusable in a quiet room, and
 * — since caption text is indexable — invisible to search.
 */
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  function VideoPlayer(
    {
      src,
      poster,
      tracks,
      size = 'md',
      ratio = '16/9',
      autoPlay = false,
      loop = false,
      muted = false,
      nativeControls = false,
      seekStep = 5,
      onPlayChange,
      onTimeChange,
      locale: localeProp,
      labels,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const { locale: ambientLocale } = useDirection();
    const locale = localeProp ?? ambientLocale;
    const text = { ...DEFAULT_LABELS, ...labels };

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const setRefs = (node: HTMLVideoElement | null) => {
      (videoRef as { current: HTMLVideoElement | null }).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as { current: HTMLVideoElement | null }).current = node;
    };

    const [playing, setPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(muted);
    const [volume, setVolume] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    /** Seconds → `mm:ss`, with localized digits and no thousands separator. */
    const formatTime = useCallback(
      (seconds: number) => {
        const safe = Number.isFinite(seconds) ? Math.max(seconds, 0) : 0;
        const pad = (input: number) =>
          formatNumber(Math.floor(input), {
            locale,
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
        const hours = Math.floor(safe / 3600);
        const minutes = Math.floor((safe % 3600) / 60);
        const rest = safe % 60;
        return hours > 0
          ? `${pad(hours)}:${pad(minutes)}:${pad(rest)}`
          : `${pad(minutes)}:${pad(rest)}`;
      },
      [locale],
    );

    useEffect(() => {
      const onChange = () =>
        setFullscreen(document.fullscreenElement === containerRef.current);
      document.addEventListener('fullscreenchange', onChange);
      return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) void video.play();
      else video.pause();
    };

    const seekTo = (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.min(Math.max(seconds, 0), duration || 0);
      setCurrentTime(video.currentTime);
    };

    const toggleMute = () => {
      const video = videoRef.current;
      if (!video) return;
      video.muted = !video.muted;
      setIsMuted(video.muted);
    };

    const toggleFullscreen = () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void containerRef.current?.requestFullscreen?.();
    };

    /**
     * Keyboard shortcuts on the player region. Left and right seek back and
     * forward in both directions, for the same reason the timeline does not
     * mirror: they move along the video's time, not along a line of text.
     */
    const onKeyDown = (event: ReactKeyboardEvent<HTMLVideoElement>) => {
      const actions: Record<string, (() => void) | undefined> = {
        ' ': togglePlay,
        k: togglePlay,
        ArrowRight: () => seekTo(currentTime + seekStep),
        ArrowLeft: () => seekTo(currentTime - seekStep),
        m: toggleMute,
        f: toggleFullscreen,
        Home: () => seekTo(0),
        End: () => seekTo(duration),
      };

      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };

    const video = (
      // `tracks` is a prop, so the rule cannot see the <track> elements the
      // caller passes. Captions are required by this component's contract —
      // see the note above — not optional because the linter is quiet.
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        ref={setRefs}
        src={src}
        // Focusable and key-handled here rather than on the container: the
        // video is the interactive element, so shortcuts apply when it has
        // focus and never swallow keys aimed at a button in the control bar.
        tabIndex={0}
        onKeyDown={onKeyDown}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        controls={nativeControls}
        className={videoElementVariants()}
        aria-label={text.root}
        onPlay={() => {
          setPlaying(true);
          onPlayChange?.(true);
        }}
        onPause={() => {
          setPlaying(false);
          onPlayChange?.(false);
        }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          onTimeChange?.(event.currentTarget.currentTime);
        }}
        onVolumeChange={(event) => {
          setIsMuted(event.currentTarget.muted);
          setVolume(event.currentTarget.volume);
        }}
        {...rest}
      >
        {tracks}
      </video>
    );

    if (nativeControls) {
      return (
        <div
          ref={containerRef}
          className={cn(videoPlayerVariants({ size, ratio }), className)}
        >
          {video}
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        role="group"
        aria-label={text.root}
        className={cn(videoPlayerVariants({ size, ratio }), className)}
      >
        {video}

        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={text.play}
            className={videoOverlayButtonVariants()}
          >
            <Icon icon={RiPlayFill} />
          </button>
        )}

        <div className={videoControlsVariants({ visible: !playing })}>
          {/*
            Pinned LTR: a video's time axis runs from its start to its end,
            which is not a sentence. Mirrored, the playhead would travel
            backwards as the video advances.

            The `dir` prop on Slider is load-bearing, not decoration. The
            wrapper's dir="ltr" flips the CSS, but Slider reads direction from
            React context, which still reports rtl under a Persian provider —
            so the pointer maths mirrored while the track did not, and clicking
            the start of the bar seeked to the end of the video.
          */}
          <div dir="ltr" className="px-1">
            <Slider
              value={Math.min(currentTime, duration || 0)}
              min={0}
              max={duration || 0}
              step={0.1}
              dir="ltr"
              onValueChange={(next) => seekTo(next as number)}
              thumbLabels={[text.seek]}
              formatValue={(seconds) =>
                text.progress(formatTime(seconds), formatTime(duration))
              }
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? text.pause : text.play}
              className={videoButtonVariants()}
            >
              <Icon icon={playing ? RiPauseFill : RiPlayFill} />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? text.unmute : text.mute}
              className={videoButtonVariants()}
            >
              <Icon icon={isMuted ? RiVolumeMuteFill : RiVolumeUpFill} />
            </button>

            <div
              dir="ltr"
              data-slot="video-volume"
              className="me-2 hidden w-20 sm:block"
            >
              <Slider
                value={isMuted ? 0 : volume}
                min={0}
                max={1}
                step={0.05}
                dir="ltr"
                onValueChange={(next) => {
                  const level = next as number;
                  if (videoRef.current) {
                    videoRef.current.volume = level;
                    videoRef.current.muted = level === 0;
                  }
                  setVolume(level);
                }}
                thumbLabels={[text.volume]}
                formatValue={(level) =>
                  formatNumber(level, {
                    locale,
                    style: 'percent',
                    maximumFractionDigits: 0,
                  })
                }
              />
            </div>

            <span className={videoTimeVariants()} dir="ltr">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? text.exitFullscreen : text.fullscreen}
              className={cn(videoButtonVariants(), 'ms-auto')}
            >
              <Icon
                icon={fullscreen ? RiFullscreenExitLine : RiFullscreenLine}
              />
            </button>
          </div>
        </div>
      </div>
    );
  },
);
