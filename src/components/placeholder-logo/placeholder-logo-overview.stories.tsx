import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiBuilding2Line,
  RiPaletteLine,
  RiSparklingLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  PlaceholderDetails,
  PlaceholderLogoSheet,
  PlaceholderSizeMatrix,
} from './placeholder-logo.docs';

/** Figma "Placeholder Logos [Overview]". */
const meta: Meta = {
  title: 'Assets/Placeholder Logos/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    const eyebrow = t('docs.eyebrowAssets');
    return (
      <OverviewPage
        title={t('placeholderLogoDocs.pageTitle')}
        description={[
          t('placeholderLogoDocs.descriptionBody1'),
          t('placeholderLogoDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5, 6].map((n) =>
          t(`placeholderLogoDocs.spotlight${n}`),
        )}
        featuresTitle={t('placeholderLogoDocs.featuresTitle')}
        featuresBody={t('placeholderLogoDocs.featuresBody')}
        features={[
          {
            icon: RiBuilding2Line,
            title: t('placeholderLogoDocs.feature1Title'),
            body: t('placeholderLogoDocs.feature1Body'),
          },
          {
            icon: RiPaletteLine,
            title: t('placeholderLogoDocs.feature2Title'),
            body: t('placeholderLogoDocs.feature2Body'),
          },
          {
            icon: RiSparklingLine,
            title: t('placeholderLogoDocs.feature3Title'),
            body: t('placeholderLogoDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          eyebrow={eyebrow}
          title={t('placeholderLogoDocs.sectionLogos')}
          body={t('placeholderLogoDocs.sectionLogosBody')}
        >
          <PlaceholderLogoSheet />
          <PlaceholderSizeMatrix />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('placeholderLogoDocs.sectionDetails')}
          body={t('placeholderLogoDocs.sectionDetailsBody')}
        >
          <PlaceholderDetails />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
