import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiBarChartBoxLine,
  RiGlobalLine,
  RiLayoutLeftLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  FlagBorderComparison,
  FlagFinder,
  FlagSizeMatrix,
  IsoFlagSheet,
  OtherFlagSheet,
  SubdivisionFlagSheet,
} from './country-flag.docs';

/** Figma "Country Flags [Overview]". */
const meta: Meta = {
  title: 'Assets/Country Flags/Overview',
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
        title={t('countryFlagDocs.pageTitle')}
        description={[
          t('countryFlagDocs.descriptionBody1'),
          t('countryFlagDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`countryFlagDocs.spotlight${n}`),
        )}
        featuresTitle={t('countryFlagDocs.featuresTitle')}
        featuresBody={t('countryFlagDocs.featuresBody')}
        features={[
          {
            icon: RiBarChartBoxLine,
            title: t('countryFlagDocs.feature1Title'),
            body: t('countryFlagDocs.feature1Body'),
          },
          {
            icon: RiLayoutLeftLine,
            title: t('countryFlagDocs.feature2Title'),
            body: t('countryFlagDocs.feature2Body'),
          },
          {
            icon: RiGlobalLine,
            title: t('countryFlagDocs.feature3Title'),
            body: t('countryFlagDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          eyebrow={eyebrow}
          title={t('countryFlagDocs.sectionCountries')}
          body={t('countryFlagDocs.sectionCountriesBody')}
        >
          <IsoFlagSheet />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('countryFlagDocs.sectionSubdivisions')}
          body={t('countryFlagDocs.sectionSubdivisionsBody')}
        >
          <SubdivisionFlagSheet />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('countryFlagDocs.sectionOther')}
          body={t('countryFlagDocs.sectionOtherBody')}
        >
          <OtherFlagSheet />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('countryFlagDocs.sectionSizes')}
          body={t('countryFlagDocs.sectionSizesBody')}
        >
          <FlagSizeMatrix />
          <FlagBorderComparison />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('countryFlagDocs.sectionFinder')}
          body={t('countryFlagDocs.sectionFinderBody')}
        >
          <FlagFinder />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
