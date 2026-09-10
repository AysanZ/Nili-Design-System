import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiSettings6Line, RiToggleLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { SwitchToggleItemsSet, ToggleGroupSet } from './switch.docs';

/** Figma "Switch Toggle EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Switch Toggle/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('switchDocs.pageTitle')}
        description={[
          t('switchDocs.descriptionBody1'),
          t('switchDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto">
            <ToggleGroupSet />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`switchDocs.spotlight${n}`))}
        featuresTitle={t('switchDocs.featuresTitle')}
        featuresBody={t('switchDocs.featuresBody')}
        features={[
          {
            icon: RiToggleLine,
            title: t('switchDocs.feature1Title'),
            body: t('switchDocs.feature1Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('switchDocs.feature2Title'),
            body: t('switchDocs.feature2Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('switchDocs.sectionItems')}
          body={t('switchDocs.sectionItemsBody')}
        >
          <SwitchToggleItemsSet />
        </ComponentSection>
        <ComponentSection
          title={t('switchDocs.sectionSwitch')}
          body={t('switchDocs.sectionSwitchBody')}
        >
          <ToggleGroupSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
