import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCursorLine,
  RiEyeLine,
  RiLayoutBottomLine,
  RiHomeSmileLine,
} from '@remixicon/react';
import { Icon } from '@components/icon';
import { Breadcrumb, BreadcrumbItem } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { BreadcrumbItemsMatrix, BreadcrumbsMatrix } from './breadcrumb.docs';

/** Figma "Breadcrumbs EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Breadcrumbs/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('breadcrumbDocs.pageTitle')}
        description={[
          t('breadcrumbDocs.descriptionBody1'),
          t('breadcrumbDocs.descriptionBody2'),
        ]}
        hero={
          <Breadcrumb
            label={t('breadcrumbDocs.nav')}
            className="flex justify-center"
          >
            <BreadcrumbItem
              href="#"
              icon={<Icon icon={RiHomeSmileLine} size={20} />}
            >
              {t('breadcrumbDocs.home')}
            </BreadcrumbItem>
            <BreadcrumbItem href="#">
              {t('breadcrumbDocs.label')}
            </BreadcrumbItem>
            <BreadcrumbItem current>{t('breadcrumbDocs.label')}</BreadcrumbItem>
          </Breadcrumb>
        }
        spotlight={[1, 2, 3, 4].map((n) => t(`breadcrumbDocs.spotlight${n}`))}
        featuresTitle={t('breadcrumbDocs.featuresTitle')}
        featuresBody={t('breadcrumbDocs.featuresBody')}
        features={[
          {
            icon: RiCursorLine,
            title: t('breadcrumbDocs.feature1Title'),
            body: t('breadcrumbDocs.feature1Body'),
          },
          {
            icon: RiEyeLine,
            title: t('breadcrumbDocs.feature2Title'),
            body: t('breadcrumbDocs.feature2Body'),
          },
          {
            icon: RiLayoutBottomLine,
            title: t('breadcrumbDocs.feature3Title'),
            body: t('breadcrumbDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('breadcrumbDocs.sectionItems')}
          body={t('breadcrumbDocs.sectionItemsBody')}
        >
          <BreadcrumbItemsMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('breadcrumbDocs.sectionTrail')}
          body={t('breadcrumbDocs.sectionTrailBody')}
        >
          <BreadcrumbsMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
