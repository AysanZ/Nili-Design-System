import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownCircleLine,
  RiQuestionLine,
  RiTBoxLine,
  RiWindow2Line,
} from '@remixicon/react';
import { Icon } from '@components/icon';
import { Accordion } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { AccordionMatrix } from './accordion.docs';

/** Figma "Accordion EN [Overview]" / "Accordion FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Accordion/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};

export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('accordionDocs.pageTitle')}
        description={[
          t('accordionDocs.descriptionBody1'),
          t('accordionDocs.descriptionBody2'),
        ]}
        hero={
          <Accordion
            className="mx-auto max-w-[440px]"
            title={t('accordion.title')}
            content={t('accordion.content')}
            startAdornment={<Icon icon={RiQuestionLine} size={20} />}
          />
        }
        spotlight={[
          t('accordionDocs.spotlight1'),
          t('accordionDocs.spotlight2'),
          t('accordionDocs.spotlight3'),
          t('accordionDocs.spotlight4'),
        ]}
        featuresTitle={t('accordionDocs.featuresTitle')}
        featuresBody={t('accordionDocs.featuresBody')}
        features={[
          {
            icon: RiWindow2Line,
            title: t('accordionDocs.feature1Title'),
            body: t('accordionDocs.feature1Body'),
          },
          {
            icon: RiArrowDownCircleLine,
            title: t('accordionDocs.feature2Title'),
            body: t('accordionDocs.feature2Body'),
          },
          {
            icon: RiTBoxLine,
            title: t('accordionDocs.feature3Title'),
            body: t('accordionDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('accordionDocs.sectionTitle')}
          body={t('accordionDocs.sectionBody')}
        >
          <AccordionMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
