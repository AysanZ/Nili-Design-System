/** Docs-only: Figma Rating Items, Rating & Review, Rating Cell, and Rating Bar (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { Rating } from './rating';
import { RatingBar, RATING_BAR_EMOJIS } from './rating-bar';

/** Figma Rating Items: star and heart, each Empty · Half · Filled. */
export function RatingItemsSet() {
  return (
    <div className="flex flex-col gap-2">
      {(['star', 'heart'] as const).map((type) => (
        <div key={type} className="flex items-center gap-4">
          <Rating type={type} value={0} max={1} readOnly aria-label={type} />
          <Rating type={type} value={0.5} max={1} readOnly aria-label={type} />
          <Rating type={type} value={1} max={1} readOnly aria-label={type} />
        </div>
      ))}
    </div>
  );
}

/** Figma Rating & Review: plain, with a value readout, and inline. */
export function RatingReviewSet() {
  const { t } = useTranslation();
  const link = (
    <LinkButton color="primary" size="sm" underline href="#">
      {t('ratingDocs.reviews')}
    </LinkButton>
  );
  return (
    <div className="flex flex-col gap-6">
      {(['star', 'heart'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <Rating type={type} value={4.5} readOnly />
          <Rating
            type={type}
            value={4.5}
            readOnly
            showValue
            valueLabel={t('ratingDocs.ratingsCount')}
            linkButton={link}
          />
          <Rating
            type={type}
            value={4.5}
            readOnly
            alignment="horizontal"
            showValue
            valueLabel={t('ratingDocs.ratingsCount')}
            linkButton={link}
          />
        </div>
      ))}
    </div>
  );
}

const CELL_STATES = [
  { key: 'docs.stateDefault', empty: 'line' as const },
  {
    key: 'docs.stateHover',
    empty: 'line' as const,
    attrs: { 'data-nili-state': 'hover' },
  },
  { key: 'checkboxDocs.checked', empty: 'filled' as const },
];

/** Figma Rating Cell: star and heart, Default · Hover · Filled. */
export function RatingCellSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-8 gap-y-3">
      <span />
      {CELL_STATES.map((s) => (
        <Caption key={s.key}>{t(s.key)}</Caption>
      ))}
      {(['star', 'heart'] as const).map((type) => (
        <Row key={type} label={type}>
          {CELL_STATES.map((s) => (
            <Rating
              key={s.key}
              type={type}
              value={type === 'heart' ? 0.6 : 1}
              max={1}
              readOnly
              empty={s.empty}
              aria-label={type}
              {...s.attrs}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}

const BAR_STATES = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'checkboxDocs.checked', props: { value: 4 } },
] as const;

/** Figma Rating Bar Items: emoji, number, star, heart × Default · Hover · Selected. */
export function RatingBarItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-8 gap-y-3">
      <span />
      {BAR_STATES.map((s) => (
        <Caption key={s.key}>{t(s.key)}</Caption>
      ))}
      {(['emoji', 'number', 'star', 'heart'] as const).map((type) => (
        <Row key={type} label={type}>
          {BAR_STATES.map((s) => (
            <div key={s.key} className="w-[220px]">
              <RatingBar type={type} count={1} {...s.props} />
            </div>
          ))}
        </Row>
      ))}
    </div>
  );
}

/** Figma Rating Bar: emoji, number, star, heart — each a full 5-item bar. */
export function RatingBarSet() {
  return (
    <div className="flex flex-col gap-4">
      {(['emoji', 'number', 'star', 'heart'] as const).map((type) => (
        <div key={type} className="w-[320px]">
          <RatingBar type={type} count={5} emojis={RATING_BAR_EMOJIS} />
        </div>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="justify-self-start pe-2">{label}</Caption>
      {children}
    </>
  );
}
