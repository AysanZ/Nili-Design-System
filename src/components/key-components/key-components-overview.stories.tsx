import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiKey2Line, RiLightbulbLine, RiPriceTag3Line } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { PaymentIconSet } from './key-components.docs';
import {
  ChartLegends,
  ContentLabelsAndCards,
  HintTexts,
  KeyIcons,
  Labels,
  PasswordStrengths,
} from './key-components.stories';

/** Figma "Key Components EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Key Components/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('keyDocs.pageTitle')}
        description={[
          t('keyDocs.descriptionBody1'),
          t('keyDocs.descriptionBody2'),
        ]}
        hero={
          <div className="flex justify-center">
            <PaymentIconSet />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`keyDocs.spotlight${n}`))}
        featuresTitle={t('keyDocs.featuresTitle')}
        featuresBody={t('keyDocs.featuresBody')}
        features={[
          {
            icon: RiPriceTag3Line,
            title: t('keyDocs.feature1Title'),
            body: t('keyDocs.feature1Body'),
          },
          {
            icon: RiKey2Line,
            title: t('keyDocs.feature2Title'),
            body: t('keyDocs.feature2Body'),
          },
          {
            icon: RiLightbulbLine,
            title: t('keyDocs.feature3Title'),
            body: t('keyDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('keyDocs.sectionLabel')}
          body={t('keyDocs.sectionLabelBody')}
        >
          <Labels />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionHint')}
          body={t('keyDocs.sectionHintBody')}
        >
          <HintTexts />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionPassword')}
          body={t('keyDocs.sectionPasswordBody')}
        >
          <PasswordStrengths />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionKeyIcons')}
          body={t('keyDocs.sectionKeyIconsBody')}
        >
          <KeyIcons />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionPayment')}
          body={t('keyDocs.sectionPaymentBody')}
        >
          <PaymentIconSet />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionLegends')}
          body={t('keyDocs.sectionLegendsBody')}
        >
          <ChartLegends />
        </ComponentSection>
        <ComponentSection
          title={t('keyDocs.sectionContent')}
          body={t('keyDocs.sectionContentBody')}
        >
          <ContentLabelsAndCards />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
