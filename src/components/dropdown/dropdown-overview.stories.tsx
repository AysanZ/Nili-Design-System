import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownDoubleLine,
  RiLink,
  RiSettings6Line,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  DropdownCompactSet,
  DropdownInlineSet,
  DropdownItemSet,
  DropdownMiscSet,
  DropdownTriggerSet,
} from './dropdown.docs';
import { Default } from './dropdown.stories';

/** Figma "Dropdown EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Dropdown/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('dropdownDocs.pageTitle')}
        description={[
          t('dropdownDocs.descriptionBody1'),
          t('dropdownDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[300px]">
            <Default />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`dropdownDocs.spotlight${n}`))}
        featuresTitle={t('dropdownDocs.featuresTitle')}
        featuresBody={t('dropdownDocs.featuresBody')}
        features={[
          {
            icon: RiArrowDownDoubleLine,
            title: t('dropdownDocs.feature1Title'),
            body: t('dropdownDocs.feature1Body'),
          },
          {
            icon: RiLink,
            title: t('dropdownDocs.feature2Title'),
            body: t('dropdownDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('dropdownDocs.feature3Title'),
            body: t('dropdownDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('dropdownDocs.sectionDropdown')}
          body={t('dropdownDocs.sectionDropdownBody')}
        >
          <DropdownTriggerSet />
        </ComponentSection>
        <ComponentSection
          title={t('dropdownDocs.sectionItem')}
          body={t('dropdownDocs.sectionItemBody')}
        >
          <DropdownItemSet />
        </ComponentSection>
        <ComponentSection
          title={t('dropdownDocs.sectionMisc')}
          body={t('dropdownDocs.sectionMiscBody')}
        >
          <DropdownMiscSet />
        </ComponentSection>
        <ComponentSection
          title={t('dropdownDocs.sectionCompact')}
          body={t('dropdownDocs.sectionCompactBody')}
        >
          <DropdownCompactSet />
        </ComponentSection>
        <ComponentSection
          title={t('dropdownDocs.sectionInline')}
          body={t('dropdownDocs.sectionInlineBody')}
        >
          <DropdownInlineSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
