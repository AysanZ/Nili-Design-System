import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiAwardLine, RiLayoutTopLine, RiZoomInLine } from '@remixicon/react';
import { ContentDivider } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { ContentDividerMatrix } from './content-divider.docs';

/** Figma "Content Divider EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Content Divider/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('dividerDocs.pageTitle')}
        description={[
          t('dividerDocs.descriptionBody1'),
          t('dividerDocs.descriptionBody2'),
        ]}
        hero={
          <ContentDivider type="text-and-line">
            {t('dividerDocs.or')}
          </ContentDivider>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`dividerDocs.spotlight${n}`))}
        featuresTitle={t('dividerDocs.featuresTitle')}
        featuresBody={t('dividerDocs.featuresBody')}
        features={[
          {
            icon: RiLayoutTopLine,
            title: t('dividerDocs.feature1Title'),
            body: t('dividerDocs.feature1Body'),
          },
          {
            icon: RiZoomInLine,
            title: t('dividerDocs.feature2Title'),
            body: t('dividerDocs.feature2Body'),
          },
          {
            icon: RiAwardLine,
            title: t('dividerDocs.feature3Title'),
            body: t('dividerDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('dividerDocs.pageTitle')}
          body={t('dividerDocs.sectionBody')}
        >
          <ContentDividerMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
