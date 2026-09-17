import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiFontSize,
  RiLayoutTop2Line,
  RiSearchEyeLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { TypeScaleFrame, TypeScaleTable } from './typography.docs';

/** Figma "Typography EN/FA [Overview]". */
const meta: Meta = {
  title: 'Core Elements/Typography/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('typographyDocs.pageTitle')}
        description={[
          t('typographyDocs.descriptionBody1'),
          t('typographyDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5, 6].map((n) =>
          t(`typographyDocs.spotlight${n}`),
        )}
        featuresTitle={t('typographyDocs.featuresTitle')}
        featuresBody={t('typographyDocs.featuresBody')}
        features={[
          {
            icon: RiFontSize,
            title: t('typographyDocs.feature1Title'),
            body: t('typographyDocs.feature1Body'),
          },
          {
            icon: RiSearchEyeLine,
            title: t('typographyDocs.feature2Title'),
            body: t('typographyDocs.feature2Body'),
          },
          {
            icon: RiLayoutTop2Line,
            title: t('typographyDocs.feature3Title'),
            body: t('typographyDocs.feature3Body'),
          },
        ]}
      >
        {/* The specimen is full-bleed in Figma — grey band edge to edge, rows
            padded to the same gutter as the rest of the page. It is not a
            component set, so it does not sit in a dashed ComponentSection. */}
        <TypeScaleFrame />

        <ComponentSection
          title={t('typographyDocs.sectionTable')}
          body={t('typographyDocs.sectionTableBody')}
        >
          <TypeScaleTable />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
