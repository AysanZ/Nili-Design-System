import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { TagSet } from './tag.docs';

/** Figma "Tag EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Tag/Overview',
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
          title={t('tagDocsOv.sectionTag')}
          body={t('tagDocsOv.sectionTagBody')}
        >
          <TagSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
