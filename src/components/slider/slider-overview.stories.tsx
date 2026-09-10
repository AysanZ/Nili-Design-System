import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowLeftRightLine,
  RiSettings6Line,
  RiSlideshow3Line,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { RangeSliderSet, SliderSet } from './slider.docs';

/** Figma "Slider EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Slider/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('sliderDocs.pageTitle')}
        description={[
          t('sliderDocs.descriptionBody1'),
          t('sliderDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[320px]">
            <SliderSet />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`sliderDocs.spotlight${n}`))}
        featuresTitle={t('sliderDocs.featuresTitle')}
        featuresBody={t('sliderDocs.featuresBody')}
        features={[
          {
            icon: RiSlideshow3Line,
            title: t('sliderDocs.feature1Title'),
            body: t('sliderDocs.feature1Body'),
          },
          {
            icon: RiArrowLeftRightLine,
            title: t('sliderDocs.feature2Title'),
            body: t('sliderDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('sliderDocs.feature3Title'),
            body: t('sliderDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('sliderDocs.sectionSlider')}
          body={t('sliderDocs.sectionSliderBody')}
        >
          <SliderSet />
        </ComponentSection>
        <ComponentSection
          title={t('sliderDocs.sectionRange')}
          body={t('sliderDocs.sectionRangeBody')}
        >
          <RangeSliderSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
