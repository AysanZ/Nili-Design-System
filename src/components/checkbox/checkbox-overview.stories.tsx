import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCheckboxLine,
  RiLightbulbLine,
  RiPictureInPictureLine,
} from '@remixicon/react';
import { Checkbox } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { CheckboxLabelMatrix, CheckboxMatrix } from './checkbox.docs';

/** Figma "Checkbox EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Checkbox/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('checkboxDocs.pageTitle')}
        description={[
          t('checkboxDocs.descriptionBody1'),
          t('checkboxDocs.descriptionBody2'),
        ]}
        hero={
          <div className="flex justify-center">
            <Checkbox
              defaultChecked
              label={t('checkboxDocs.label')}
              sublabel={t('checkboxDocs.sublabel')}
            />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`checkboxDocs.spotlight${n}`))}
        featuresTitle={t('checkboxDocs.featuresTitle')}
        featuresBody={t('checkboxDocs.featuresBody')}
        features={[
          {
            icon: RiLightbulbLine,
            title: t('checkboxDocs.feature1Title'),
            body: t('checkboxDocs.feature1Body'),
          },
          {
            icon: RiPictureInPictureLine,
            title: t('checkboxDocs.feature2Title'),
            body: t('checkboxDocs.feature2Body'),
          },
          {
            icon: RiCheckboxLine,
            title: t('checkboxDocs.feature3Title'),
            body: t('checkboxDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('checkboxDocs.sectionCheckbox')}
          body={t('checkboxDocs.sectionCheckboxBody')}
        >
          <CheckboxMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('checkboxDocs.sectionLabel')}
          body={t('checkboxDocs.sectionLabelBody')}
        >
          <CheckboxLabelMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
