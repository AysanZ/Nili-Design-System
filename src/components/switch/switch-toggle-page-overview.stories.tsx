import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { SwitchToggleItemsSet, ToggleLabelSet } from './switch.docs';

/** Figma "Toggle EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Toggle/Overview',
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
          title={t('toggleDocsOv.sectionToggle')}
          body={t('toggleDocsOv.sectionToggleBody')}
        >
          <SwitchToggleItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('toggleDocsOv.sectionLabel')}
          body={t('toggleDocsOv.sectionLabelBody')}
        >
          <ToggleLabelSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
