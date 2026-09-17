'use client';

import { useState } from 'react';
import {
  Rating,
  RatingBar,
  RatingBarArea,
  LinkButton,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { ratingText } from './rating-demo.text';

/**
 * Responsive overview for Rating, Rating Bar and the Rating & Review block.
 */
export function RatingDemo() {
  const t = useDemoText(ratingText);
  const [score, setScore] = useState(4);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Interactive ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('interactive.title')}
        description={t('interactive.body')}
        code={`import { Rating } from "@nili/ui"

export function Example() {
  const [score, setScore] = useState(4)

  return (
    <Rating
      value={score}
      onValueChange={setScore}
      name="score"
      labels={{
        root: "Rate this article",
        item: (score) => \`\${score} stars\`,
      }}
    />
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <Rating
            value={score}
            onValueChange={setScore}
            showValue
            labels={{
              root: t('rateArticle'),
              item: (value) => t('itemLabel').replace('{score}', value),
            }}
          />
          <Rating
            defaultValue={3}
            disabled
            labels={{ root: t('disabledRating') }}
          />
        </div>
      </DemoSection>

      {/* ── Read-only ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('readOnly.title')}
        description={t('readOnly.body')}
        code={`import { Rating } from "@nili/ui"

export function Example() {
  return (
    <>
      <Rating readOnly value={4.5} showValue />
      <Rating
        readOnly
        value={4.5}
        valueLabel={t('reviews')}
        labels={{ summary: (value, max) => \`\${value} out of \${max}\` }}
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {[5, 4.5, 3.2, 1].map((value) => (
            <div key={value} className="flex items-center gap-4">
              <Rating
                readOnly
                value={value}
                showValue
                labels={{
                  summary: (current, max) =>
                t('summary')
                  .replace('{value}', current)
                  .replace('{max}', max),
                }}
              />
            </div>
          ))}
          <Rating
            readOnly
            value={4.5}
            valueLabel="4.5 (128 reviews)"
            labels={{ summary: (current, max) => `${current} out of ${max}` }}
          />
        </div>
      </DemoSection>

      {/* ── Type & empty glyph ──────────────────────────────────────── */}
      <DemoSection
        title={t('glyph.title')}
        description={t('glyph.body')}
        code={`import { Rating } from "@nili/ui"

export function Example() {
  return (
    <>
      <Rating type="star" defaultValue={3} />
      <Rating type="heart" defaultValue={3} />
      <Rating type="star" empty="filled" defaultValue={3} />
      <Rating max={10} defaultValue={7} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('glyph.types')}</DemoLabel>
            <div className="flex flex-wrap items-center gap-6">
              <Rating type="star" defaultValue={3} labels={{ root: t('glyph.stars') }} />
              <Rating
                type="heart"
                defaultValue={3}
                labels={{ root: t('glyph.hearts') }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('glyph.emptyKinds')}</DemoLabel>
            <div className="flex flex-wrap items-center gap-6">
              <Rating
                empty="line"
                defaultValue={3}
                labels={{ root: t('glyph.emptyLine') }}
              />
              <Rating
                empty="filled"
                defaultValue={3}
                labels={{ root: t('glyph.emptyFilled') }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>max=10</DemoLabel>
            <Rating max={10} defaultValue={7} labels={{ root: t('glyph.outOfTen') }} />
          </div>
        </div>
      </DemoSection>

      {/* ── Rating & Review ─────────────────────────────────────────── */}
      <DemoSection
        title={t('review.title')}
        description={t('review.body')}
        code={`import { Rating, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <>
      <Rating
        readOnly
        value={4.5}
        alignment="vertical"
        showValue
        description="Based on 128 reviews from verified buyers."
        linkButton={<LinkButton href="#" size="sm">Read reviews</LinkButton>}
      />

      <Rating
        readOnly
        value={4.5}
        alignment="horizontal"
        description="128 reviews"
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('review.vertical')}</DemoLabel>
            <Rating
              readOnly
              value={4.5}
              alignment="vertical"
              showValue
              description={t('review.basedOn')}
              linkButton={
                <LinkButton href="#" size="sm">
                  {t('review.read')}
                </LinkButton>
              }
              labels={{ summary: (current, max) => `${current} out of ${max}` }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('review.horizontal')}</DemoLabel>
            <Rating
              readOnly
              value={4.5}
              alignment="horizontal"
              description={t('review.count')}
              labels={{ summary: (current, max) => `${current} out of ${max}` }}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Rating Bar ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('bar.title')}
        description={t('bar.body')}
        code={`import { RatingBar } from "@nili/ui"

export function Example() {
  return (
    <>
      <RatingBar type="emoji" labels={{ root: "How was it?" }} />
      <RatingBar type="number" labels={{ root: "How was it?" }} />
      <RatingBar type="star" labels={{ root: "How was it?" }} />
      <RatingBar type="heart" labels={{ root: "How was it?" }} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          {(['emoji', 'number', 'star', 'heart'] as const).map((type) => (
            <div key={type} className="flex flex-col gap-2">
              <DemoLabel>{type}</DemoLabel>
              <RatingBar
                type={type}
                defaultValue={4}
                labels={{ root: t('bar.howWas').replace('{type}', type) }}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Rating Bar Area ─────────────────────────────────────────── */}
      <DemoSection
        title={t('area.title')}
        description={t('area.body')}
        code={`import { RatingBarArea } from "@nili/ui"

export function Example() {
  return (
    <RatingBarArea
      type="emoji"
      labels={{ root: "How was your experience?" }}
      commentLabel="Tell us more"
      commentPlaceholder="Tell us why!"
    />
  )
}`}
      >
        <div className="w-full max-w-md">
          <RatingBarArea
            type="emoji"
            labels={{ root: t('area.root') }}
            commentLabel={t('area.commentLabel')}
            commentPlaceholder={t('area.commentPlaceholder')}
          />
        </div>
      </DemoSection>
    </div>
  );
}
