/**
 * Docs-only building blocks for the Buttons pages in Storybook.
 *
 * NOT part of the library: nothing in `src/index.ts` imports this file, and
 * `*.docs.tsx` is excluded from the type build in vite.config.ts. It exists
 * so the four Buttons stories and the Overview page draw the exact same
 * Figma component sets without four copies of the same grid.
 *
 * How the Hover and Focus cells are drawn: each cell is a real, working
 * component with `data-nili-state="hover" | "focus"`. The `hovered:` /
 * `focused:` variants (styles/variants.css) treat that attribute like the
 * real pseudo-class, so the picture is produced by the component's own
 * classes — if the component is wrong, the docs are wrong too. Disabled
 * cells use the real `disabled` prop.
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiFileCopyLine,
} from '@remixicon/react';
import { Icon } from '../icon';
import { cn } from '../../lib/cn';
import {
  Caption,
  FigmaFrame,
  SizeBlock,
  STATE_KEY,
  STATES,
  stateProps,
  type DocState,
} from '../../docs/figma.docs';
import { Button } from './button';
import {
  BUTTON_APPEARANCES,
  BUTTON_COLORS,
  type ButtonVariantProps,
} from './button.styles';
import { LinkButton } from './link-button';
import { LINK_BUTTON_COLORS } from './link-button.styles';
import { FancyButton } from './fancy-button';
import { FANCY_BUTTON_COLORS } from './fancy-button.styles';
import { CompactButton } from './compact-button';
import { COMPACT_BUTTON_APPEARANCES } from './compact-button.styles';

type ButtonSize = NonNullable<ButtonVariantProps['size']>;

/* Figma's left/right icon slots. `mirrored` so they keep pointing outward
   in RTL, as they do in the FA frame. */
const Chevrons = {
  start: <Icon icon={RiArrowLeftSLine} mirrored />,
  end: <Icon icon={RiArrowRightSLine} mirrored />,
};

// ─────────────────────────────────────────────────────────────────────────
// Chrome
// ─────────────────────────────────────────────────────────────────────────

/**
 * Dark band behind Figma's "Modifiable" rows — they are white-on-white in
 * Figma and would be invisible here otherwise. The negative margin eats the
 * grid gap so neighbouring cells join into one continuous strip.
 */
function OnDark({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div className={cn('bg-static-black text-static-white', className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────────────────

const TYPE_KEY = {
  primary: 'buttonDocs.typePrimary',
  neutral: 'buttonDocs.typeNeutral',
  error: 'buttonDocs.typeError',
  success: 'buttonDocs.typeSuccess',
  basic: 'buttonDocs.typeBasic',
} as const;

const STYLE_KEY = {
  filled: 'buttonDocs.styleFilled',
  stroke: 'buttonDocs.styleStroke',
  lighter: 'buttonDocs.styleLighter',
  ghost: 'buttonDocs.styleGhost',
} as const;

/**
 * One Figma size of the Buttons component set: four type blocks, each four
 * state rows × four styles, every style drawn with and without text.
 */
export function ButtonMatrix({ size }: { size: ButtonSize }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-14">
      {BUTTON_COLORS.map((color) => (
        <div key={color} className="flex flex-col">
          <Caption className="mb-3">{t(TYPE_KEY[color])}</Caption>
          <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-20">
            <span />
            {BUTTON_APPEARANCES.map((appearance) => (
              <Caption key={appearance}>{t(STYLE_KEY[appearance])}</Caption>
            ))}
            {STATES.map((state) => (
              <Row key={state} label={t(STATE_KEY[state])}>
                {BUTTON_APPEARANCES.map((appearance) => (
                  <div
                    key={appearance}
                    className="flex h-16 items-center gap-8"
                  >
                    <Button
                      color={color}
                      appearance={appearance}
                      size={size}
                      startIcon={Chevrons.start}
                      endIcon={Chevrons.end}
                      {...stateProps(state)}
                    >
                      {t('button.label')}
                    </Button>
                    <Button
                      color={color}
                      appearance={appearance}
                      size={size}
                      iconOnly
                      aria-label={t('buttonDocs.iconOnly')}
                      {...stateProps(state)}
                    >
                      <Icon icon={RiFileCopyLine} />
                    </Button>
                  </div>
                ))}
              </Row>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A state label followed by its cells, flattened into the parent grid. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2">{label}</Caption>
      {children}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Link Buttons
// ─────────────────────────────────────────────────────────────────────────

const LINK_STYLE_KEY = {
  gray: 'buttonDocs.styleGray',
  black: 'buttonDocs.styleBlack',
  primary: 'buttonDocs.typePrimary',
  error: 'buttonDocs.typeError',
  success: 'buttonDocs.typeSuccess',
  inherit: 'buttonDocs.styleModifiable',
} as const;

/**
 * One Figma size of Link Button: Underline Off and Underline On side by side,
 * each six styles × four states.
 */
export function LinkButtonMatrix({ size }: { size: 'md' | 'sm' }) {
  const { t } = useTranslation();
  const rowHeight = size === 'md' ? 'h-11' : 'h-10';
  return (
    <div className="flex flex-wrap gap-x-20 gap-y-10">
      {([false, true] as const).map((underline) => (
        <div key={String(underline)} className="flex flex-col">
          <Caption className="mb-3">
            {t(
              underline ? 'buttonDocs.underlineOn' : 'buttonDocs.underlineOff',
            )}
          </Caption>
          <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-8">
            <span />
            {STATES.map((state) => (
              <Caption key={state}>{t(STATE_KEY[state])}</Caption>
            ))}
            {LINK_BUTTON_COLORS.map((color) => {
              const cells = STATES.map((state) => (
                <div key={state} className={cn('flex items-center', rowHeight)}>
                  <LinkButton
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    color={color}
                    size={size}
                    underline={underline}
                    startIcon={Chevrons.start}
                    endIcon={Chevrons.end}
                    {...stateProps(state)}
                  >
                    {t('buttonDocs.linkLabel')}
                  </LinkButton>
                </div>
              ));
              return (
                <Row key={color} label={t(LINK_STYLE_KEY[color])}>
                  {color === 'inherit'
                    ? cells.map((cell, index) => (
                        <OnDark key={index} className="-mx-4 px-4">
                          {cell}
                        </OnDark>
                      ))
                    : cells}
                </Row>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Fancy Buttons
// ─────────────────────────────────────────────────────────────────────────

/** One Figma size of Fancy Button: four state rows × five types. */
export function FancyButtonMatrix({ size }: { size: 'md' | 'sm' | 'xs' }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-x-14">
      <span />
      {FANCY_BUTTON_COLORS.map((color) => (
        <Caption key={color}>{t(TYPE_KEY[color])}</Caption>
      ))}
      {STATES.map((state) => (
        <Row key={state} label={t(STATE_KEY[state])}>
          {FANCY_BUTTON_COLORS.map((color) => (
            <div key={color} className="flex h-16 items-center">
              <FancyButton
                color={color}
                size={size}
                startIcon={Chevrons.start}
                endIcon={Chevrons.end}
                {...stateProps(state)}
              >
                {t('button.label')}
              </FancyButton>
            </div>
          ))}
        </Row>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Compact Button
// ─────────────────────────────────────────────────────────────────────────

const COMPACT_STYLE_KEY = {
  stroke: 'buttonDocs.styleStroke',
  ghost: 'buttonDocs.styleGhost',
  white: 'buttonDocs.styleWhite',
  error: 'buttonDocs.typeError',
  inherit: 'buttonDocs.styleModifiable',
} as const;

/** Figma calls the focus look "Active" on this component. */
const COMPACT_STATE_KEY: Record<DocState, string> = {
  ...STATE_KEY,
  focus: 'docs.stateActive',
};

/**
 * One Figma size of Compact Button: Full Radius Off and On side by side,
 * each five styles × four states.
 */
export function CompactButtonMatrix({ size }: { size: 'lg' | 'md' }) {
  const { t } = useTranslation();
  const rowHeight = size === 'lg' ? 'h-12' : 'h-11';
  return (
    <div className="flex flex-wrap gap-x-20 gap-y-10">
      {([false, true] as const).map((fullRadius) => (
        <div key={String(fullRadius)} className="flex flex-col">
          <Caption className="mb-3">
            {t(fullRadius ? 'buttonDocs.radiusOn' : 'buttonDocs.radiusOff')}
          </Caption>
          <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-6">
            <span />
            {STATES.map((state) => (
              <Caption key={state}>{t(COMPACT_STATE_KEY[state])}</Caption>
            ))}
            {COMPACT_BUTTON_APPEARANCES.map((appearance) => {
              const cells = STATES.map((state) => (
                <div
                  key={state}
                  className={cn('flex items-center justify-center', rowHeight)}
                >
                  <CompactButton
                    appearance={appearance}
                    size={size}
                    fullRadius={fullRadius}
                    aria-label={t('button.close')}
                    {...stateProps(state)}
                  >
                    <Icon icon={RiCloseLine} />
                  </CompactButton>
                </div>
              ));
              return (
                <Row key={appearance} label={t(COMPACT_STYLE_KEY[appearance])}>
                  {appearance === 'inherit'
                    ? cells.map((cell, index) => (
                        <OnDark key={index} className="-mx-3 px-3">
                          {cell}
                        </OnDark>
                      ))
                    : cells}
                </Row>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Size labels, shared by the stories and the Overview page
// ─────────────────────────────────────────────────────────────────────────

export const BUTTON_SIZE_KEY = {
  md: 'buttonDocs.sizeMedium40',
  sm: 'buttonDocs.sizeSmall36',
  xs: 'buttonDocs.sizeXSmall32',
  '2xs': 'buttonDocs.sizeXXSmall28',
} as const;

export const LINK_SIZE_KEY = {
  md: 'buttonDocs.sizeMedium20',
  sm: 'buttonDocs.sizeSmall16',
} as const;

export const COMPACT_SIZE_KEY = {
  lg: 'buttonDocs.sizeLarge24',
  md: 'buttonDocs.sizeMedium20',
} as const;

// Shared primitives, re-exported so the Buttons stories have one import.
export { Caption, FigmaFrame, SizeBlock, STATES, stateProps, type DocState };
