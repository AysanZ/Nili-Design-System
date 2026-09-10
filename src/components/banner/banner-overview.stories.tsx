import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCheckLine, RiCropLine, RiSettings6Line } from '@remixicon/react';
import { Banner } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { BannerMatrix } from './banner.docs';

/** Figma "Banner EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Banner/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('bannerDocs.pageTitle')}
        description={[
          t('bannerDocs.descriptionBody1'),
          t('bannerDocs.descriptionBody2'),
        ]}
        hero={
          <Banner
            urgency="off"
            status="info"
            appearance="lighter"
            className="rounded-lg"
            title={t('bannerDocs.title')}
            action={{ label: t('bannerDocs.upgrade'), href: '#' }}
          />
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`bannerDocs.spotlight${n}`))}
        featuresTitle={t('bannerDocs.featuresTitle')}
        featuresBody={t('bannerDocs.featuresBody')}
        features={[
          {
            icon: RiCheckLine,
            title: t('bannerDocs.feature1Title'),
            body: t('bannerDocs.feature1Body'),
          },
          {
            icon: RiCropLine,
            title: t('bannerDocs.feature2Title'),
            body: t('bannerDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('bannerDocs.feature3Title'),
            body: t('bannerDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('bannerDocs.pageTitle')}
          body={t('bannerDocs.sectionBody')}
        >
          <BannerMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
