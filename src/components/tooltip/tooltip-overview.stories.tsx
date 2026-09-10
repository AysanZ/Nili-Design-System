import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { TooltipPlacementSet, TooltipSizeSet } from './tooltip.docs';

/** Figma "Tooltip EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Tooltip/Overview',
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
          title={t('tooltipDocsOv.sectionTooltip')}
          body={t('tooltipDocsOv.sectionTooltipBody')}
        >
          <TooltipPlacementSet />
          <TooltipSizeSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
