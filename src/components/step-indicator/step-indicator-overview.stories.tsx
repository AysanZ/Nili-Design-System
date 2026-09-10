import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCheckboxCircleLine,
  RiListOrdered2,
  RiSettings6Line,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  StepHorizontalSet,
  StepItemsSet,
  StepVerticalItemsSet,
  StepVerticalSet,
} from './step-indicator.docs';

/** Figma "Step Indicator EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Step Indicator/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('stepDocs.pageTitle')}
        description={[
          t('stepDocs.descriptionBody1'),
          t('stepDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto">
            <StepVerticalSet />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`stepDocs.spotlight${n}`))}
        featuresTitle={t('stepDocs.featuresTitle')}
        featuresBody={t('stepDocs.featuresBody')}
        features={[
          {
            icon: RiListOrdered2,
            title: t('stepDocs.feature1Title'),
            body: t('stepDocs.feature1Body'),
          },
          {
            icon: RiCheckboxCircleLine,
            title: t('stepDocs.feature2Title'),
            body: t('stepDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('stepDocs.feature3Title'),
            body: t('stepDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('stepDocs.sectionHorizontalItems')}
          body={t('stepDocs.sectionHorizontalItemsBody')}
        >
          <StepItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('stepDocs.sectionHorizontal')}
          body={t('stepDocs.sectionHorizontalBody')}
        >
          <StepHorizontalSet />
        </ComponentSection>
        <ComponentSection
          title={t('stepDocs.sectionVerticalItems')}
          body={t('stepDocs.sectionVerticalItemsBody')}
        >
          <StepVerticalItemsSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
