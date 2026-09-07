import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Figma → "❖ Video Player" page.
 *   Video Player → Status (Ready to Play · Pause & Chill · Silent Play)
 *                  × Size (Medium | Small)
 *
 * The docblock here used to claim `Size (Large | Medium)` and a four-value
 * `State (Idle · Playing · Paused · Loading)`. Both were wrong: the sizes are
 * Medium and Small, and there are three statuses, one of which — Silent Play,
 * i.e. muted autoplay — was not among the four.
 *
 * Status is still not a prop: each of the three is something the `<video>`
 * element already knows and reports through its events. A `status="playing"`
 * prop would be a second source of truth that drifts from the media the moment
 * the user pauses from the keyboard. `muted` is the one input, because muted
 * autoplay is a decision the page makes, not a fact the element reports.
 */
export const videoPlayerVariants = cva(
  [
    'group/player relative w-full overflow-hidden rounded-xl bg-static-black',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
  ],
  {
    variants: {
      /** Figma's Size. Drives the control bar and the overlay affordance. */
      size: {
        md: '[--nili-video-control:2.25rem] [--nili-video-overlay:4rem]',
        sm: '[--nili-video-control:2rem] [--nili-video-overlay:3rem]',
      },
      ratio: {
        '16/9': 'aspect-video',
        '4/3': 'aspect-4/3',
        '1/1': 'aspect-square',
        auto: '',
      },
    },
    defaultVariants: { size: 'md', ratio: '16/9' },
  },
);

export const videoElementVariants = cva(
  'size-full bg-static-black object-contain',
);

/**
 * The control bar. It fades out while the video plays and comes back on hover
 * or on focus — `focus-within` is the part that matters: a bar that only
 * responds to a pointer disappears permanently for a keyboard user mid-Tab.
 */
export const videoControlsVariants = cva(
  [
    'absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3',
    'bg-[linear-gradient(to_top,rgba(0,0,0,0.72),transparent)]',
    'transition-opacity duration-200 motion-reduce:transition-none',
    'group-hover/player:opacity-100 group-focus-within/player:opacity-100',
  ],
  {
    variants: {
      visible: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },
    defaultVariants: { visible: true },
  },
);

export const videoButtonVariants = cva([
  'grid shrink-0 place-items-center rounded-lg text-static-white',
  'size-[var(--nili-video-control)] [&_svg]:size-5',
  'cursor-pointer transition-colors duration-150',
  'hover:bg-white-alpha-16',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-static-white',
  'disabled:pointer-events-none disabled:opacity-50',
]);

/** The big play affordance over the poster. */
export const videoOverlayButtonVariants = cva([
  'absolute inset-0 m-auto grid place-items-center rounded-full',
  'size-[var(--nili-video-overlay)]',
  'bg-black-alpha-24 text-static-white backdrop-blur-sm',
  'cursor-pointer transition-transform duration-150 hover:scale-105',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-static-white',
  '[&_svg]:size-1/2',
]);

export const videoTimeVariants = cva(
  'shrink-0 select-none font-mono text-[12px] leading-4 tabular-nums text-static-white',
);

export type VideoPlayerVariantProps = VariantProps<typeof videoPlayerVariants>;
