import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiFileList3Line, RiPaletteLine, RiTimerLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { ProgressBar } from '.';
import {
  ProgressBarSet,
  ProgressCircleSet,
  ProgressLabelSet,
  ProgressLineSet,
} from './progress-bar.docs';

/** Figma "Progress Bar EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Progress Bar/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('progressDocs.pageTitle')}
        description={[
          t('progressDocs.descriptionBody1'),
          t('progressDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[320px]">
            <ProgressBar value={60} label={t('progressDocs.title')} showValue />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`progressDocs.spotlight${n}`))}
        featuresTitle={t('progressDocs.featuresTitle')}
        featuresBody={t('progressDocs.featuresBody')}
        features={[
          {
            icon: RiPaletteLine,
            title: t('progressDocs.feature1Title'),
            body: t('progressDocs.feature1Body'),
          },
          {
            icon: RiTimerLine,
            title: t('progressDocs.feature2Title'),
            body: t('progressDocs.feature2Body'),
          },
          {
            icon: RiFileList3Line,
            title: t('progressDocs.feature3Title'),
            body: t('progressDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('progressDocs.sectionLine')}
          body={t('progressDocs.sectionLineBody')}
        >
          <ProgressLineSet />
        </ComponentSection>
        <ComponentSection
          title={t('progressDocs.sectionBar')}
          body={t('progressDocs.sectionBarBody')}
        >
          <ProgressBarSet />
        </ComponentSection>
        <ComponentSection
          title={t('progressDocs.sectionLabel')}
          body={t('progressDocs.sectionLabelBody')}
        >
          <ProgressLabelSet />
        </ComponentSection>
        <ComponentSection
          title={t('progressDocs.sectionCircle')}
          body={t('progressDocs.sectionCircleBody')}
        >
          <ProgressCircleSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
