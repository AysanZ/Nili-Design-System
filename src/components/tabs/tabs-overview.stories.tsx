import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  TabMenuHorizontalItemsSet,
  TabMenuHorizontalSet,
  TabMenuVerticalItemsSet,
  TabMenuVerticalSet,
} from './tabs.docs';

/** Figma "Tab Menu EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Tab Menu/Overview',
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
          title={t('tabMenuDocs.sectionHorizontalItems')}
          body={t('tabMenuDocs.sectionHorizontalItemsBody')}
        >
          <TabMenuHorizontalItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('tabMenuDocs.sectionHorizontal')}
          body={t('tabMenuDocs.sectionHorizontalBody')}
        >
          <TabMenuHorizontalSet />
        </ComponentSection>
        <ComponentSection
          title={t('tabMenuDocs.sectionVerticalItems')}
          body={t('tabMenuDocs.sectionVerticalItemsBody')}
        >
          <TabMenuVerticalItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('tabMenuDocs.sectionVertical')}
          body={t('tabMenuDocs.sectionVerticalBody')}
        >
          <TabMenuVerticalSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
