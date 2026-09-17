import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiSmartphoneLine,
  RiContrastLine,
  RiShieldKeyholeLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  AppStoreBadgeSheet,
  AppStoreDetails,
  AppStoreFooterRow,
} from './app-store-badge.docs';

/** Figma "App Store Badges [Overview]". */
const meta: Meta = {
  title: 'Assets/App Store Badges/Overview',
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
        title={t('appStoreBadgeDocs.pageTitle')}
        description={[
          t('appStoreBadgeDocs.descriptionBody1'),
          t('appStoreBadgeDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`appStoreBadgeDocs.spotlight${n}`),
        )}
        featuresTitle={t('appStoreBadgeDocs.featuresTitle')}
        featuresBody={t('appStoreBadgeDocs.featuresBody')}
        features={[
          {
            icon: RiSmartphoneLine,
            title: t('appStoreBadgeDocs.feature1Title'),
            body: t('appStoreBadgeDocs.feature1Body'),
          },
          {
            icon: RiContrastLine,
            title: t('appStoreBadgeDocs.feature2Title'),
            body: t('appStoreBadgeDocs.feature2Body'),
          },
          {
            icon: RiShieldKeyholeLine,
            title: t('appStoreBadgeDocs.feature3Title'),
            body: t('appStoreBadgeDocs.feature3Body'),
          },
        ]}
      >
        <section className="px-6 pb-10 lg:px-[100px]">
          <div className="mt-10 rounded-xl border border-warning-base bg-warning-lighter/40 p-5">
            <p className="text-[14px] leading-5 font-medium text-strong-950">
              {t('appStoreBadgeDocs.noticeTitle')}
            </p>
            <p className="mt-2 text-[14px] leading-5 text-sub-600">
              {t('appStoreBadgeDocs.noticeBody')}
            </p>
          </div>
        </section>

        <ComponentSection
          eyebrow={eyebrow}
          title={t('appStoreBadgeDocs.sectionBadges')}
          body={t('appStoreBadgeDocs.sectionBadgesBody')}
        >
          <AppStoreBadgeSheet />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('appStoreBadgeDocs.sectionUsage')}
          body={t('appStoreBadgeDocs.sectionUsageBody')}
        >
          <AppStoreFooterRow />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('appStoreBadgeDocs.sectionDetails')}
          body={t('appStoreBadgeDocs.sectionDetailsBody')}
        >
          <AppStoreDetails />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
