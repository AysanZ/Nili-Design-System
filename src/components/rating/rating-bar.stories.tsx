import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RatingBar, RatingBarArea } from '.';
import { FigmaFrame } from '../../docs/figma.docs';
import { RatingBarItemsSet, RatingBarSet } from './rating.docs';

const meta: Meta<typeof RatingBar> = {
  title: 'Base Components/Ratings/Rating Bar',
  component: RatingBar,
  parameters: {
    docs: {
      description: {
        component: `Figma's \`Rating Bar\`, \`Rating Bar Items\` and \`Rating Bar Area\` — the survey scale on the "❖ Rating" page.

| Figma set | Component | Axes |
| --- | --- | --- |
| \`Rating Bar [1.0]\` | \`RatingBar\` | 🧩 Type (🙂 Emoji · ⏺️ Number · ⭐️ Star · 💜 Heart) |
| \`Rating Bar Items [1.0]\` | — | Type × 📌 State (Default · Hover · Selected) — a cell, rendered by \`RatingBar\` |
| \`Rating Bar Area [1.0]\` | \`RatingBarArea\` | Type, with the comment box beneath |

**This is not \`Rating\`.** \`Rating\` answers "how good, out of five" and renders fractions because it also shows averages. A Rating Bar is a survey question: one of N discrete choices, never fractional, never read-only. Emoji and Number have no meaning for "3.7 filled", which is why they are a separate component rather than two more values on \`RatingType\`.

**Hover fills cumulatively for Star and Heart only.** Emoji and Number are nominal choices, not a magnitude — lighting up 1–4 when the user means "4" would state something the scale does not mean.

Selection uses real radios, so arrow keys, roving focus and "2 of 5, radio, not selected" come from the browser.`,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'inline-radio' },
      options: ['emoji', 'number', 'star', 'heart'],
    },
    count: { control: { type: 'number', min: 2, max: 10 } },
    disabled: { control: 'boolean' },
  },
};

const TYPES = ['emoji', 'number', 'star', 'heart'] as const;

export const Types = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-6">
      {TYPES.map((type) => (
        <div key={type} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-soft-400">
            {type}
          </span>
          <RatingBar
            type={type}
            labels={{
              root: t('rating.barLabel'),
              item: (score, total) => t('rating.barItem', { score, total }),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export const Controlled = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState<number | null>(4);
  return (
    <div className="flex w-80 flex-col gap-3">
      <RatingBar
        type="emoji"
        value={score}
        onValueChange={setScore}
        labels={{
          root: t('rating.barLabel'),
          item: (s, total) => t('rating.barItem', { score: s, total }),
        }}
      />
      <p className="text-[14px] leading-5 text-sub-600">
        {t('rating.barItem', { score: score ?? '—', total: 5 })}
      </p>
    </div>
  );
};

export const Disabled = () => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <RatingBar
        type="number"
        defaultValue={3}
        disabled
        labels={{
          root: t('rating.barLabel'),
          item: (score, total) => t('rating.barItem', { score, total }),
        }}
      />
    </div>
  );
};

/** Figma's `Rating Bar Area` — the scale with the "Tell us why!" box beneath. */
export const Area = () => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <RatingBarArea
        type="emoji"
        commentLabel={t('rating.barCommentLabel')}
        commentPlaceholder={t('rating.barComment')}
        labels={{
          root: t('rating.barLabel'),
          item: (score, total) => t('rating.barItem', { score, total }),
        }}
      />
    </div>
  );
};

// ====================== Figma component sets ======================

export const RatingBarItemsSetStory = () => (
  <FigmaFrame>
    <RatingBarItemsSet />
  </FigmaFrame>
);
RatingBarItemsSetStory.storyName = 'Rating Bar Items';
RatingBarItemsSetStory.parameters = { docs: { source: { code: null } } };

export const RatingBarSetStory = () => (
  <FigmaFrame>
    <RatingBarSet />
  </FigmaFrame>
);
RatingBarSetStory.storyName = 'Rating Bar set';
RatingBarSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
