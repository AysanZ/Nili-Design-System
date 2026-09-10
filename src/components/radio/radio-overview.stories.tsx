import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCheckboxCircleLine,
  RiIdCardLine,
  RiLayoutBottomLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { RadioCardMatrix, RadioLabelMatrix, RadioMatrix } from './radio.docs';

/** Figma "Radio EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Radio/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('radioDocs.pageTitle')}
        description={[
          t('radioDocs.descriptionBody1'),
          t('radioDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[300px]">
            <RadioLabelMatrix />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`radioDocs.spotlight${n}`))}
        featuresTitle={t('radioDocs.featuresTitle')}
        featuresBody={t('radioDocs.featuresBody')}
        features={[
          {
            icon: RiCheckboxCircleLine,
            title: t('radioDocs.feature1Title'),
            body: t('radioDocs.feature1Body'),
          },
          {
            icon: RiLayoutBottomLine,
            title: t('radioDocs.feature2Title'),
            body: t('radioDocs.feature2Body'),
          },
          {
            icon: RiIdCardLine,
            title: t('radioDocs.feature3Title'),
            body: t('radioDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('radioDocs.sectionRadio')}
          body={t('radioDocs.sectionRadioBody')}
        >
          <RadioMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('radioDocs.sectionLabel')}
          body={t('radioDocs.sectionLabelBody')}
        >
          <RadioLabelMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('radioDocs.sectionCard')}
          body={t('radioDocs.sectionCardBody')}
        >
          <RadioCardMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
