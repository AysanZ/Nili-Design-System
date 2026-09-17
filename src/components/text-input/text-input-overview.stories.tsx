import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiInputField,
  RiKeyboardBoxLine,
  RiPaletteLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { AllTypes, AllStates, TypeSizeMatrix } from './text-input.stories';
import {
  CounterInputs,
  DigitInputs,
  InlineInputs,
  TagInputs,
} from './text-input-variants.stories';

/**
 * Figma "Text Input EN/FA [Overview]".
 *
 * The frame draws five component sets, not one. This page used to render only
 * the first, so Tag Input, Digit Input and Inline Input existed in the library
 * and in their own stories but were invisible from the page that is supposed
 * to be the map of the component.
 */
const meta: Meta = {
  title: 'Base Components/Text Input/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('textInputDocsOv.pageTitle')}
        description={[
          t('textInputDocsOv.descriptionBody1'),
          t('textInputDocsOv.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`textInputDocsOv.spotlight${n}`),
        )}
        featuresTitle={t('textInputDocsOv.featuresTitle')}
        featuresBody={t('textInputDocsOv.featuresBody')}
        features={[
          {
            icon: RiInputField,
            title: t('textInputDocsOv.feature1Title'),
            body: t('textInputDocsOv.feature1Body'),
          },
          {
            icon: RiPaletteLine,
            title: t('textInputDocsOv.feature2Title'),
            body: t('textInputDocsOv.feature2Body'),
          },
          {
            icon: RiKeyboardBoxLine,
            title: t('textInputDocsOv.feature3Title'),
            body: t('textInputDocsOv.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('textInputDocsOv.sectionTextInput')}
          body={t('textInputDocsOv.sectionTextInputBody')}
        >
          <AllTypes />
        </ComponentSection>
        <ComponentSection
          title={t('textInputDocsOv.sectionStates')}
          body={t('textInputDocsOv.sectionStatesBody')}
        >
          <AllStates />
          <TypeSizeMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('textInputDocsOv.sectionTag')}
          body={t('textInputDocsOv.sectionTagBody')}
        >
          <TagInputs />
        </ComponentSection>
        <ComponentSection
          title={t('textInputDocsOv.sectionCounter')}
          body={t('textInputDocsOv.sectionCounterBody')}
        >
          <CounterInputs />
        </ComponentSection>
        <ComponentSection
          title={t('textInputDocsOv.sectionDigit')}
          body={t('textInputDocsOv.sectionDigitBody')}
        >
          <DigitInputs />
        </ComponentSection>
        <ComponentSection
          title={t('textInputDocsOv.sectionInline')}
          body={t('textInputDocsOv.sectionInlineBody')}
        >
          <InlineInputs />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
