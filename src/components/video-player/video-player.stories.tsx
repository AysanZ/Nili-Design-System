import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { VideoPlayer } from '.';
import type { VideoPlayerLabels } from '.';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Base Components/Video Player',
  component: VideoPlayer,
  parameters: {
    docs: {
      description: {
        component: `The **Video Player**, from the Figma "❖ Video Player" page: a styled control bar over a real \`<video>\`.

**Key Features:**
- Play/pause, timeline, timestamp, volume, full screen
- **Keyboard shortcuts** on the video: Space/K, ←/→, M, F, Home/End
- **\`tracks\`** for captions and subtitles
- **\`nativeControls\`** hands the UI back to the browser
- Timeline and volume are the system's own \`Slider\`

**The timeline does not mirror.** Everything else here follows the reading direction; this does not. A video's time axis runs from its start to its end, and that is not a sentence. Flipped, the beginning of the film would sit on the right and the playhead would travel backwards as the video advances — every player a Persian user has met, from YouTube to their television, runs it left to right. The control *bar* still mirrors, so play sits on the leading edge; only the track inside is pinned with \`dir="ltr"\`. The same reasoning applies to ← and →: they move along the video's time, not along a line of text, so they do not swap in Persian.

**State comes from the media element.** There is no \`state\` prop. Playing, paused, buffering and ended are things the \`<video>\` already knows and reports through events; a prop for them would be a second source of truth that drifts the moment the user pauses from the keyboard or the system interrupts playback. Figma's four states are frames of one element's lifecycle, not four components.

**Captions are not optional.** \`tracks\` takes real \`<track>\` elements. A video without them is unavailable to deaf and hard-of-hearing users, unusable in a quiet room, and — since caption text is indexable — invisible to search.

**Timestamps are localized** through \`Intl\`, so a Persian player reads ۰۱:۲۳ while the DOM keeps real numbers. Switch the Locale toolbar to فارسی.`,
      },
    },
  },
  argTypes: {
    ratio: {
      control: { type: 'select' },
      options: ['16/9', '4/3', '1/1', 'auto'],
      table: { defaultValue: { summary: '16/9' } },
    },
    autoPlay: { control: 'boolean' },
    loop: { control: 'boolean' },
    muted: { control: 'boolean' },
    nativeControls: { control: 'boolean' },
    seekStep: { control: 'number' },
    labels: {
      control: false,
      table: { type: { summary: 'VideoPlayerLabels' } },
    },
  },
};

const SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const POSTER =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-images/painted-hand-298425.jpg';

/** Strings are props, so the docs surface is what translates — not the library. */
function useLabels(): VideoPlayerLabels {
  const { t } = useTranslation();
  return {
    root: t('videoPlayer.label'),
    play: t('videoPlayer.play'),
    pause: t('videoPlayer.pause'),
    mute: t('videoPlayer.mute'),
    unmute: t('videoPlayer.unmute'),
    seek: t('videoPlayer.seek'),
    volume: t('videoPlayer.volume'),
    fullscreen: t('videoPlayer.fullscreen'),
    exitFullscreen: t('videoPlayer.exitFullscreen'),
    progress: (current, total) => t('videoPlayer.progress', { current, total }),
  };
}

const Template: StoryFn<typeof VideoPlayer> = (args) => {
  const labels = useLabels();
  return (
    <div className="w-[640px]">
      <VideoPlayer {...args} src={args.src ?? SRC} labels={labels} />
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { poster: POSTER };

export const WithoutPoster = Template.bind({});
WithoutPoster.args = {};

export const Muted = Template.bind({});
Muted.args = { poster: POSTER, muted: true };

/** Hand the UI back to the browser — picture-in-picture and AirPlay come free. */
export const NativeControls = Template.bind({});
NativeControls.args = { poster: POSTER, nativeControls: true };

// ====================== Ratios ======================

export const Ratios = () => {
  const labels = useLabels();
  return (
    <div className="flex gap-4">
      {(['16/9', '4/3', '1/1'] as const).map((ratio) => (
        <div key={ratio} className="w-56">
          <span className="mb-1 block text-[11px] uppercase tracking-wider text-soft-400">
            {ratio}
          </span>
          <VideoPlayer
            src={SRC}
            poster={POSTER}
            ratio={ratio}
            labels={labels}
          />
        </div>
      ))}
    </div>
  );
};

// ====================== Captions ======================

/**
 * Pass real `<track>` elements. The browser's caption menu appears under
 * `nativeControls`; with the custom bar, captions render over the video and a
 * caption toggle is the natural next addition to this component.
 */
export const WithCaptions = () => {
  const { t } = useTranslation();
  const labels = useLabels();
  return (
    <div className="w-[640px]">
      <VideoPlayer
        src={SRC}
        poster={POSTER}
        labels={labels}
        nativeControls
        tracks={
          <track
            kind="captions"
            srcLang="en"
            label={t('videoPlayer.captions')}
            src="data:text/vtt,WEBVTT%0A%0A00:00:00.000 --> 00:00:04.000%0AA flower opening in time lapse."
            default
          />
        }
      />
    </div>
  );
};

export default meta;
