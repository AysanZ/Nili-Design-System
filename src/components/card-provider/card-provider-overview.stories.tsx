import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiBankCardLine,
  RiContrastDrop2Line,
  RiShieldCheckLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  AcceptedCardsRow,
  CardProviderSheet,
  CardProviderSizeMatrix,
  CardProviderTable,
  CardProviderVariantMatrix,
} from './card-provider.docs';

/** Figma "Card Providers EN/FA [Overview]". */
const meta: Meta = {
  title: 'Assets/Card Providers/Overview',
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
        title={t('cardProviderDocs.pageTitle')}
        description={[
          t('cardProviderDocs.descriptionBody1'),
          t('cardProviderDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`cardProviderDocs.spotlight${n}`),
        )}
        featuresTitle={t('cardProviderDocs.featuresTitle')}
        featuresBody={t('cardProviderDocs.featuresBody')}
        features={[
          {
            icon: RiBankCardLine,
            title: t('cardProviderDocs.feature1Title'),
            body: t('cardProviderDocs.feature1Body'),
          },
          {
            icon: RiContrastDrop2Line,
            title: t('cardProviderDocs.feature2Title'),
            body: t('cardProviderDocs.feature2Body'),
          },
          {
            icon: RiShieldCheckLine,
            title: t('cardProviderDocs.feature3Title'),
            body: t('cardProviderDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          eyebrow={eyebrow}
          title={t('cardProviderDocs.sectionOriginal')}
          body={t('cardProviderDocs.sectionOriginalBody')}
        >
          <CardProviderSheet variant="original" />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('cardProviderDocs.sectionMono')}
          body={t('cardProviderDocs.sectionMonoBody')}
        >
          <CardProviderSheet variant="mono" />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('cardProviderDocs.sectionOutline')}
          body={t('cardProviderDocs.sectionOutlineBody')}
        >
          <CardProviderSheet variant="outline" />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('cardProviderDocs.sectionVariants')}
          body={t('cardProviderDocs.sectionVariantsBody')}
        >
          <CardProviderVariantMatrix />
          <CardProviderSizeMatrix />
        </ComponentSection>
        <ComponentSection
          eyebrow={eyebrow}
          title={t('cardProviderDocs.sectionUsage')}
          body={t('cardProviderDocs.sectionUsageBody')}
        >
          <AcceptedCardsRow />
          <CardProviderTable />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
