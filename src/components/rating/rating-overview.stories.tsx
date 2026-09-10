import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiChat3Line, RiEmojiStickerLine, RiStarLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  RatingBarItemsSet,
  RatingBarSet,
  RatingCellSet,
  RatingItemsSet,
  RatingReviewSet,
} from './rating.docs';

/** Figma "Ratings EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Ratings/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('ratingDocs.pageTitle')}
        description={[
          t('ratingDocs.descriptionBody1'),
          t('ratingDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-fit">
            <RatingReviewSet />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`ratingDocs.spotlight${n}`))}
        featuresTitle={t('ratingDocs.featuresTitle')}
        featuresBody={t('ratingDocs.featuresBody')}
        features={[
          {
            icon: RiStarLine,
            title: t('ratingDocs.feature1Title'),
            body: t('ratingDocs.feature1Body'),
          },
          {
            icon: RiChat3Line,
            title: t('ratingDocs.feature2Title'),
            body: t('ratingDocs.feature2Body'),
          },
          {
            icon: RiEmojiStickerLine,
            title: t('ratingDocs.feature3Title'),
            body: t('ratingDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('ratingDocs.sectionItems')}
          body={t('ratingDocs.sectionItemsBody')}
        >
          <RatingItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('ratingDocs.sectionReview')}
          body={t('ratingDocs.sectionReviewBody')}
        >
          <RatingReviewSet />
        </ComponentSection>
        <ComponentSection
          title={t('ratingDocs.sectionCell')}
          body={t('ratingDocs.sectionCellBody')}
        >
          <RatingCellSet />
        </ComponentSection>
        <ComponentSection
          title={t('ratingDocs.sectionBarItems')}
          body={t('ratingDocs.sectionBarItemsBody')}
        >
          <RatingBarItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('ratingDocs.sectionBar')}
          body={t('ratingDocs.sectionBarBody')}
        >
          <RatingBarSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
