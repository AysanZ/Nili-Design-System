import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiLayoutBottomLine,
  RiLayoutTopLine,
  RiPencilLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { DrawerHeader } from '.';
import { DrawerFooterSet, DrawerHeaderSet } from './drawer.docs';

/** Figma "Drawer EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Drawer/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('drawerDocs.pageTitle')}
        description={[
          t('drawerDocs.descriptionBody1'),
          t('drawerDocs.descriptionBody2'),
        ]}
        hero={
          <div className="w-[400px] overflow-hidden rounded-xl">
            <DrawerHeader
              title={t('drawerDocs.title')}
              description={t('drawerDocs.description')}
              onClose={() => undefined}
            />
          </div>
        }
        spotlight={[1, 2, 3].map((n) => t(`drawerDocs.spotlight${n}`))}
        featuresTitle={t('drawerDocs.featuresTitle')}
        featuresBody={t('drawerDocs.featuresBody')}
        features={[
          {
            icon: RiLayoutTopLine,
            title: t('drawerDocs.feature1Title'),
            body: t('drawerDocs.feature1Body'),
          },
          {
            icon: RiLayoutBottomLine,
            title: t('drawerDocs.feature2Title'),
            body: t('drawerDocs.feature2Body'),
          },
          {
            icon: RiPencilLine,
            title: t('drawerDocs.feature3Title'),
            body: t('drawerDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('drawerDocs.sectionHeader')}
          body={t('drawerDocs.sectionHeaderBody')}
        >
          <DrawerHeaderSet />
        </ComponentSection>
        <ComponentSection
          title={t('drawerDocs.sectionFooter')}
          body={t('drawerDocs.sectionFooterBody')}
        >
          <DrawerFooterSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
