import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  SortingIconsSet,
  TableHeaderCellSet,
  TableRowCellSet,
} from './table.docs';

/** Figma "Table EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Table/Overview',
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
          title={t('tableDocs.sectionRowCell')}
          body={t('tableDocs.sectionRowCellBody')}
        >
          <TableRowCellSet />
        </ComponentSection>
        <ComponentSection
          title={t('tableDocs.sectionSorting')}
          body={t('tableDocs.sectionSortingBody')}
        >
          <SortingIconsSet />
        </ComponentSection>
        <ComponentSection
          title={t('tableDocs.sectionHeaderCell')}
          body={t('tableDocs.sectionHeaderCellBody')}
        >
          <TableHeaderCellSet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
