import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiBookOpenLine,
  RiErrorWarningLine,
  RiTableLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { Pagination } from '.';
import { PaginationCellSet, PaginationGroupSet } from './pagination.docs';

/** Figma "Pagination EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Pagination/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('paginationDocs.pageTitle')}
        description={[
          t('paginationDocs.descriptionBody1'),
          t('paginationDocs.descriptionBody2'),
        ]}
        hero={
          <div className="flex justify-center">
            <Pagination count={16} defaultPage={2} />
          </div>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`paginationDocs.spotlight${n}`))}
        featuresTitle={t('paginationDocs.featuresTitle')}
        featuresBody={t('paginationDocs.featuresBody')}
        features={[
          {
            icon: RiBookOpenLine,
            title: t('paginationDocs.feature1Title'),
            body: t('paginationDocs.feature1Body'),
          },
          {
            icon: RiTableLine,
            title: t('paginationDocs.feature2Title'),
            body: t('paginationDocs.feature2Body'),
          },
          {
            icon: RiErrorWarningLine,
            title: t('paginationDocs.feature3Title'),
            body: t('paginationDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('paginationDocs.sectionCell')}
          body={t('paginationDocs.sectionCellBody')}
        >
          <PaginationCellSet />
        </ComponentSection>
        <ComponentSection
          title={t('paginationDocs.sectionGroup')}
          body={t('paginationDocs.sectionGroupBody')}
        >
          <PaginationGroupSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
