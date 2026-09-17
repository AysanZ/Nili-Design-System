import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiLayoutGridLine,
  RiImage2Line,
  RiSettings6Line,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { DropdownItemSet, DropdownMiscSet } from './dropdown.docs';

/**
 * Figma "Dropdown Item EN/FA [Overview]".
 *
 * Its own page rather than a section of the Dropdown one, because that is how
 * Figma files it: the item is a component in its own right, used by Dropdown
 * but also by the command palette and the context menu.
 */
const meta: Meta = {
  title: 'Base Components/Dropdown/Dropdown Item',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('dropdownItemDocs.pageTitle')}
        description={[
          t('dropdownItemDocs.descriptionBody1'),
          t('dropdownItemDocs.descriptionBody2'),
        ]}
        spotlight={[1, 2, 3, 4].map((n) => t(`dropdownItemDocs.spotlight${n}`))}
        featuresTitle={t('dropdownItemDocs.featuresTitle')}
        featuresBody={t('dropdownItemDocs.featuresBody')}
        features={[
          {
            icon: RiLayoutGridLine,
            title: t('dropdownItemDocs.feature1Title'),
            body: t('dropdownItemDocs.feature1Body'),
          },
          {
            icon: RiImage2Line,
            title: t('dropdownItemDocs.feature2Title'),
            body: t('dropdownItemDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('dropdownItemDocs.feature3Title'),
            body: t('dropdownItemDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('dropdownItemDocs.sectionItem')}
          body={t('dropdownItemDocs.sectionItemBody')}
        >
          <DropdownItemSet />
        </ComponentSection>
        <ComponentSection
          title={t('dropdownItemDocs.sectionMisc')}
          body={t('dropdownItemDocs.sectionMiscBody')}
        >
          <DropdownMiscSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
