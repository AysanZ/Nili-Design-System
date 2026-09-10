import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiHeart3Fill, RiHeart3Line } from '@remixicon/react';
import { Rating } from '.';
import type { RatingLabels } from '.';
import { Icon } from '@components/icon';
import { FigmaFrame } from '../../docs/figma.docs';
import { RatingCellSet, RatingItemsSet, RatingReviewSet } from './rating.docs';

const meta: Meta<typeof Rating> = {
  title: 'Base Components/Ratings/Rating',
  component: Rating,
  parameters: {
    docs: {
      description: {
        component: `The **Rating** component shows a score, or asks for one. Generated from the Figma "❖ Rating" page.

**Key Features:**
- **3 Sizes** (sm · md · lg) and **5 Colours**
- **\`readOnly\`** for averages — accepts fractional values and renders partial fills
- **\`max\`** for any number of items
- **\`icon\` / \`emptyIcon\`** to swap the star for anything
- **\`showValue\` / \`valueLabel\`** for the readout beside it

**Two components in one, on purpose.** \`readOnly\` is not a styling flag. A review average is *content*: one \`role="img"\` named "۴٫۵ از ۵", which a screen reader reads once. An input is a *question*: a \`radiogroup\` of real radios, which brings form participation, roving focus and arrow-key movement from the browser rather than from three hundred lines of key handling. Announcing five "4 stars, radio, not selected" items for something the user is only meant to read is noise; a static image the user cannot answer is a dead end.

**Fractions are read-only.** Halving an interactive item makes each target about 10px wide and gives a pointer user two hit areas they cannot tell apart — the score they meant and the one they got. Averages are fractional; opinions are not.

**Hover is a preview, not a value.** The highlight while the mouse crosses the row is local state that never fires \`onValueChange\`, so passing over the control does not rate anything.

**RTL**

The filled glyph is clipped with \`inline-size\`, so a partial star fills from the right in Persian — no second icon, no direction read in JavaScript. Item order follows the flex direction, so the first star sits on the right. Digits come from \`Intl\`, so the readout is ۴٫۵ and so is \`aria-label\`.`,
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    max: { control: 'number', table: { defaultValue: { summary: '5' } } },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
    icon: { control: false, table: { type: { summary: 'ReactNode' } } },
    labels: { control: false, table: { type: { summary: 'RatingLabels' } } },
    onValueChange: { action: 'rated' },
  },
};

/** Strings are props, so the docs surface is what translates — not the library. */
function useLabels(): RatingLabels {
  const { t } = useTranslation();
  return {
    root: t('rating.label'),
    item: (score) => t('rating.star', { score }),
    summary: (value, max) => t('rating.summary', { value, max }),
  };
}

const Template: StoryFn<typeof Rating> = (args) => {
  const labels = useLabels();
  const [value, setValue] = useState(args.value ?? 3);
  return (
    <Rating {...args} value={value} onValueChange={setValue} labels={labels} />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { value: 3 };

export const WithValue = Template.bind({});
WithValue.args = { value: 4, showValue: true };

/** An average: fractional, and a single labelled image. */
export const ReadOnly = () => {
  const { t } = useTranslation();
  const labels = useLabels();
  return (
    <div className="flex flex-col gap-2">
      <Rating
        value={4.5}
        readOnly
        labels={labels}
        valueLabel={t('rating.reviews', { value: '4.5', total: 128 })}
      />
      <Rating value={3.2} readOnly showValue labels={labels} />
      <Rating value={0} readOnly showValue labels={labels} />
    </div>
  );
};

export const Disabled = Template.bind({});
Disabled.args = { value: 3, disabled: true };

// ====================== Sizes & Colors ======================

/** Figma's Type: Star or Heart. The colour follows the glyph. */
export const Types = () => (
  <div className="flex flex-col gap-4">
    <Rating defaultValue={4} type="star" showValue />
    <Rating defaultValue={4} type="heart" showValue />
  </div>
);

/**
 * Figma draws two empty states. `Empty Line` is the outline — "not rated yet".
 * `Empty Filled` is the solid shape in grey — "rated, but not this far".
 */
export const EmptyStates = () => (
  <div className="flex flex-col gap-4">
    <Rating defaultValue={3} empty="line" />
    <Rating defaultValue={3} empty="filled" />
  </div>
);

// ====================== Variations ======================

/** `max` is a number, not a variant — ten items is not a special case. */
export const TenItems = () => {
  const labels = useLabels();
  const [value, setValue] = useState(7);
  return (
    <Rating
      max={10}
      value={value}
      onValueChange={setValue}
      showValue
      labels={labels}
    />
  );
};

/** Any glyph. The empty state can be a different icon entirely. */
export const CustomIcon = () => {
  const labels = useLabels();
  const [value, setValue] = useState(3);
  return (
    <Rating
      value={value}
      onValueChange={setValue}
      icon={<Icon icon={RiHeart3Fill} />}
      emptyIcon={<Icon icon={RiHeart3Line} />}
      labels={labels}
    />
  );
};

/** The pair a product page usually needs: the average, and the ask. */
export const InContext = () => {
  const { t } = useTranslation();
  const labels = useLabels();
  const [value, setValue] = useState(0);
  return (
    <div className="flex w-80 flex-col gap-4 rounded-xl border border-soft-200 bg-white-0 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] leading-4 text-sub-600">
          {t('rating.average')}
        </span>
        <Rating
          value={4.5}
          readOnly
          labels={labels}
          valueLabel={t('rating.reviews', { value: '4.5', total: 128 })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[12px] leading-4 text-sub-600">
          {t('rating.yours')}
        </span>
        <Rating value={value} onValueChange={setValue} labels={labels} />
      </div>
    </div>
  );
};

// ====================== Figma component sets ======================

export const RatingItemsSetStory = () => (
  <FigmaFrame>
    <RatingItemsSet />
  </FigmaFrame>
);
RatingItemsSetStory.storyName = 'Rating Items';
RatingItemsSetStory.parameters = { docs: { source: { code: null } } };

export const RatingReviewSetStory = () => (
  <FigmaFrame>
    <RatingReviewSet />
  </FigmaFrame>
);
RatingReviewSetStory.storyName = 'Rating & Review';
RatingReviewSetStory.parameters = { docs: { source: { code: null } } };

export const RatingCellSetStory = () => (
  <FigmaFrame>
    <RatingCellSet />
  </FigmaFrame>
);
RatingCellSetStory.storyName = 'Rating Cell';
RatingCellSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
