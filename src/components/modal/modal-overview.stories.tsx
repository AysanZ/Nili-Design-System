import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiInformationLine,
  RiLayoutBottomLine,
  RiLayoutTopLine,
} from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  ModalFooterSet,
  ModalHeaderSet,
  ModalOverlaySet,
  StatusModalSet,
} from './modal.docs';

/** Figma "Modal EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Modal/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('modalDocs.pageTitle')}
        description={[
          t('modalDocs.descriptionBody1'),
          t('modalDocs.descriptionBody2'),
        ]}
        hero={
          <div className="w-[440px] overflow-hidden rounded-2xl">
            <ModalHeaderSet />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`modalDocs.spotlight${n}`))}
        featuresTitle={t('modalDocs.featuresTitle')}
        featuresBody={t('modalDocs.featuresBody')}
        features={[
          {
            icon: RiLayoutTopLine,
            title: t('modalDocs.feature1Title'),
            body: t('modalDocs.feature1Body'),
          },
          {
            icon: RiLayoutBottomLine,
            title: t('modalDocs.feature2Title'),
            body: t('modalDocs.feature2Body'),
          },
          {
            icon: RiInformationLine,
            title: t('modalDocs.feature3Title'),
            body: t('modalDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('modalDocs.sectionHeader')}
          body={t('modalDocs.sectionHeaderBody')}
        >
          <ModalHeaderSet />
        </ComponentSection>
        <ComponentSection
          title={t('modalDocs.sectionFooter')}
          body={t('modalDocs.sectionFooterBody')}
        >
          <ModalFooterSet />
        </ComponentSection>
        <ComponentSection
          title={t('modalDocs.sectionStatus')}
          body={t('modalDocs.sectionStatusBody')}
        >
          <StatusModalSet />
        </ComponentSection>
        <ComponentSection
          title={t('modalDocs.sectionOverlay')}
          body={t('modalDocs.sectionOverlayBody')}
        >
          <ModalOverlaySet />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
