import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCalendarLine, RiSettings6Line, RiTimerLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  DateSelectorSet,
  DayCellsSet,
  PeriodRangeSet,
  PickersSet,
} from './date-picker.docs';

/** Figma "Date Picker EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Date Picker/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('datePickerDocs.pageTitle')}
        description={[t('datePickerDocs.descriptionBody1')]}
        hero={
          <div className="flex justify-center">
            <DateSelectorSet />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`datePickerDocs.spotlight${n}`),
        )}
        featuresTitle={t('datePickerDocs.featuresTitle')}
        featuresBody={t('datePickerDocs.featuresBody')}
        features={[
          {
            icon: RiCalendarLine,
            title: t('datePickerDocs.feature1Title'),
            body: t('datePickerDocs.feature1Body'),
          },
          {
            icon: RiTimerLine,
            title: t('datePickerDocs.feature2Title'),
            body: t('datePickerDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('datePickerDocs.feature3Title'),
            body: t('datePickerDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('datePickerDocs.sectionCells')}
          body={t('datePickerDocs.sectionCellsBody')}
        >
          <DayCellsSet />
        </ComponentSection>
        <ComponentSection
          title={t('datePickerDocs.sectionPeriod')}
          body={t('datePickerDocs.sectionPeriodBody')}
        >
          <div className="flex flex-col gap-8">
            <PeriodRangeSet />
            <DateSelectorSet />
          </div>
        </ComponentSection>
        <ComponentSection
          title={t('datePickerDocs.sectionPickers')}
          body={t('datePickerDocs.sectionPickersBody')}
        >
          <PickersSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
