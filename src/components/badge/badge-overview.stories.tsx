import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiAwardLine, RiCropLine, RiPaletteLine } from '@remixicon/react';
import { Badge } from '.';
import { SizeBlock } from '../../docs/figma.docs';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { BadgeMatrix, StatusBadgeMatrix } from './badge.docs';

/** Figma "Badge EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Badge/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('badgeDocs.pageTitle')}
        description={[
          t('badgeDocs.descriptionBody1'),
          t('badgeDocs.descriptionBody2'),
        ]}
        hero={
          <div className="flex justify-center gap-2">
            <Badge color="blue">{t('badgeDocs.label')}</Badge>
            <Badge color="green" appearance="light" dot>
              {t('badgeDocs.label')}
            </Badge>
            <Badge color="red">{2}</Badge>
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`badgeDocs.spotlight${n}`))}
        featuresTitle={t('badgeDocs.featuresTitle')}
        featuresBody={t('badgeDocs.featuresBody')}
        features={[
          {
            icon: RiPaletteLine,
            title: t('badgeDocs.feature1Title'),
            body: t('badgeDocs.feature1Body'),
          },
          {
            icon: RiCropLine,
            title: t('badgeDocs.feature2Title'),
            body: t('badgeDocs.feature2Body'),
          },
          {
            icon: RiAwardLine,
            title: t('badgeDocs.feature3Title'),
            body: t('badgeDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('badgeDocs.sectionBadge')}
          body={t('badgeDocs.sectionBadgeBody')}
        >
          <SizeBlock label={t('badgeDocs.sizeSmall')}>
            <BadgeMatrix size="small" />
          </SizeBlock>
          <SizeBlock label={t('badgeDocs.sizeMedium')}>
            <BadgeMatrix size="medium" />
          </SizeBlock>
        </ComponentSection>
        <ComponentSection
          title={t('badgeDocs.sectionStatus')}
          body={t('badgeDocs.sectionStatusBody')}
        >
          <StatusBadgeMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
