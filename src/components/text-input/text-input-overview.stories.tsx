import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { AllTypes } from './text-input.stories';

/** Figma "Text Input EN/FA [Overview]". */
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
      <OverviewPage>
        <ComponentSection
          title={t('textInputDocsOv.sectionTextInput')}
          body={t('textInputDocsOv.sectionTextInputBody')}
        >
          <AllTypes />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
