'use client';

import { VideoPlayer } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { videoPlayerText } from './video-player-demo.text';

/** CC0 sample media, same as the Storybook stories use. */
const SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const POSTER =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-images/painted-hand-298425.jpg';

/** Built from `t`: every one of these is read aloud, so all of it translates. */
function playerLabels(t: (key: keyof typeof videoPlayerText) => string) {
  return {
    root: t('root'),
    play: t('play'),
    pause: t('pause'),
    mute: t('mute'),
    unmute: t('unmute'),
    seek: t('seek'),
    volume: t('volume'),
    fullscreen: t('fullscreen'),
    exitFullscreen: t('exitFullscreen'),
    progress: (current: string, total: string) =>
      t('progress').replace('{current}', current).replace('{total}', total),
  };
}

/**
 * Responsive overview for Video Player.
 */
export function VideoPlayerDemo() {
  const t = useDemoText(videoPlayerText);
  const labels = playerLabels(t);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { VideoPlayer } from "@nili/ui"

export function Example() {
  return (
    <VideoPlayer
      src="/media/flower.mp4"
      poster="/media/flower.jpg"
      labels={{
        root: "Product tour",
        play: "Play",
        pause: "Pause",
        seek: "Seek",
        fullscreen: "Full screen",
      }}
    />
  )
}`}
      >
        <div className="w-full max-w-xl">
          <VideoPlayer src={SRC} poster={POSTER} labels={labels} />
        </div>
      </DemoSection>

      {/* ── Ratios ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('ratio.title')}
        description={t('ratio.body')}
        code={`import { VideoPlayer } from "@nili/ui"

export function Example() {
  return (
    <>
      <VideoPlayer src={src} ratio="16/9" />
      <VideoPlayer src={src} ratio="4/3" />
      <VideoPlayer src={src} ratio="1/1" />
      <VideoPlayer src={src} ratio="auto" />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          {(['16/9', '4/3', '1/1'] as const).map((ratio) => (
            <div key={ratio} className="flex flex-col gap-2">
              <DemoLabel>{ratio}</DemoLabel>
              <VideoPlayer
                src={SRC}
                poster={POSTER}
                ratio={ratio}
                labels={{
                  ...labels,
                  root: t('ratio.sample').replace('{ratio}', ratio),
                }}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Size ────────────────────────────────────────────────────── */}
      <DemoSection
        title={t('size.title')}
        description={t('size.body')}
        code={`import { VideoPlayer } from "@nili/ui"

export function Example() {
  return (
    <>
      <VideoPlayer src={src} size="md" />
      <VideoPlayer src={src} size="sm" />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          {(['md', 'sm'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <DemoLabel>{size}</DemoLabel>
              <VideoPlayer
                src={SRC}
                poster={POSTER}
                size={size}
                labels={{
                  ...labels,
                  root: t('size.sample').replace('{size}', size),
                }}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Captions & native ───────────────────────────────────────── */}
      <DemoSection
        title={t('captions.title')}
        description={t('captions.body')}
        code={`import { VideoPlayer } from "@nili/ui"

export function Example() {
  return (
    <>
      <VideoPlayer
        src={src}
        tracks={
          <track
            kind="captions"
            srcLang="en"
            label="English"
            src="/media/flower.en.vtt"
            default
          />
        }
      />

      {/* muted autoplay, looping — a background clip */}
      <VideoPlayer src={src} autoPlay loop muted />

      {/* the browser's own controls */}
      <VideoPlayer src={src} nativeControls />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('captions.with')}</DemoLabel>
            <VideoPlayer
              src={SRC}
              poster={POSTER}
              labels={{ ...labels, root: t('captions.label') }}
              tracks={
                <track
                  kind="captions"
                  srcLang="en"
                  label="English"
                  src="data:text/vtt,WEBVTT%0A%0A00:00:00.000 --> 00:00:04.000%0AA flower opening in time lapse."
                  default
                />
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('captions.native')}</DemoLabel>
            <VideoPlayer
              src={SRC}
              poster={POSTER}
              nativeControls
              labels={{ ...labels, root: t('captions.nativeLabel') }}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Events ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('events.title')}
        description={t('events.body')}
        code={`import { VideoPlayer } from "@nili/ui"

export function Example() {
  return (
    <VideoPlayer
      src={src}
      seekStep={10}
      onPlayChange={(playing) => track(playing ? "play" : "pause")}
      onTimeChange={(time) => syncTranscript(time)}
    />
  )
}`}
      >
        <div className="w-full max-w-xl">
          <VideoPlayer
            src={SRC}
            poster={POSTER}
            seekStep={10}
            labels={{ ...labels, root: t('events.label') }}
          />
        </div>
      </DemoSection>
    </div>
  );
}
