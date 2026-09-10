import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { CharacterCounterSet, TextAreaSet } from './text-area.docs';

/** Figma "Text Area EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Text Area/Overview',
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
          title={t('textAreaDocsOv.sectionCounter')}
          body={t('textAreaDocsOv.sectionCounterBody')}
        >
          <CharacterCounterSet />
        </ComponentSection>
        <ComponentSection
          title={t('textAreaDocsOv.sectionTextArea')}
          body={t('textAreaDocsOv.sectionTextAreaBody')}
        >
          <TextAreaSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
