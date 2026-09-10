import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiLayoutBottomLine,
  RiListCheck3,
  RiSearch2Line,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  QuickActionsFooterSet,
  QuickActionsItemsSet,
  QuickActionsSearchSet,
} from './quick-actions.docs';

/** Figma "Quick Actions EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Quick Actions/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('quickActionsDocs.pageTitle')}
        description={[
          t('quickActionsDocs.descriptionBody1'),
          t('quickActionsDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[300px]">
            <QuickActionsSearchSet />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`quickActionsDocs.spotlight${n}`))}
        featuresTitle={t('quickActionsDocs.featuresTitle')}
        featuresBody={t('quickActionsDocs.featuresBody')}
        features={[
          {
            icon: RiSearch2Line,
            title: t('quickActionsDocs.feature1Title'),
            body: t('quickActionsDocs.feature1Body'),
          },
          {
            icon: RiListCheck3,
            title: t('quickActionsDocs.feature2Title'),
            body: t('quickActionsDocs.feature2Body'),
          },
          {
            icon: RiLayoutBottomLine,
            title: t('quickActionsDocs.feature3Title'),
            body: t('quickActionsDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('quickActionsDocs.sectionSearch')}
          body={t('quickActionsDocs.sectionSearchBody')}
        >
          <QuickActionsSearchSet />
        </ComponentSection>
        <ComponentSection
          title={t('quickActionsDocs.sectionItems')}
          body={t('quickActionsDocs.sectionItemsBody')}
        >
          <QuickActionsItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('quickActionsDocs.sectionFooter')}
          body={t('quickActionsDocs.sectionFooterBody')}
        >
          <QuickActionsFooterSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
