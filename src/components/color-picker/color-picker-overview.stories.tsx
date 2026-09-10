import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiDropLine, RiPaletteLine, RiSipLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  ColorDotsSet,
  ColorPickerSet,
  ColorSlidersSet,
  ColorSpectrumSet,
} from './color-picker.docs';

/** Figma "Color Picker EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Color Picker/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('colorPickerDocs.pageTitle')}
        description={[
          t('colorPickerDocs.descriptionBody1'),
          t('colorPickerDocs.descriptionBody2'),
        ]}
        hero={
          <div className="flex justify-center">
            <ColorPickerSet />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`colorPickerDocs.spotlight${n}`))}
        featuresTitle={t('colorPickerDocs.featuresTitle')}
        featuresBody={t('colorPickerDocs.featuresBody')}
        features={[
          {
            icon: RiPaletteLine,
            title: t('colorPickerDocs.feature1Title'),
            body: t('colorPickerDocs.feature1Body'),
          },
          {
            icon: RiSipLine,
            title: t('colorPickerDocs.feature2Title'),
            body: t('colorPickerDocs.feature2Body'),
          },
          {
            icon: RiDropLine,
            title: t('colorPickerDocs.feature3Title'),
            body: t('colorPickerDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('colorPickerDocs.sectionSliders')}
          body={t('colorPickerDocs.sectionSlidersBody')}
        >
          <ColorSlidersSet />
        </ComponentSection>
        <ComponentSection
          title={t('colorPickerDocs.sectionDots')}
          body={t('colorPickerDocs.sectionDotsBody')}
        >
          <ColorDotsSet />
        </ComponentSection>
        <ComponentSection
          title={t('colorPickerDocs.sectionSpectrum')}
          body={t('colorPickerDocs.sectionSpectrumBody')}
        >
          <ColorSpectrumSet />
        </ComponentSection>
        <ComponentSection
          title={t('colorPickerDocs.sectionPicker')}
          body={t('colorPickerDocs.sectionPickerBody')}
        >
          <ColorPickerSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
