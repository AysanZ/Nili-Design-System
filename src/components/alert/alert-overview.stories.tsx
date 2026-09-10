import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCheckLine, RiCropLine, RiSettings6Line } from '@remixicon/react';
import { Alert } from '.';
import { SizeBlock } from '../../docs/figma.docs';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { ALERT_SIZE_KEY, ALERT_SIZES, AlertMatrix } from './alert.docs';

/** Figma "Alert, Notification & Toast EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Alert, Notification & Toast/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};

export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('alertDocs.pageTitle')}
        description={[
          t('alertDocs.descriptionBody1'),
          t('alertDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[390px] max-w-full">
            <Alert
              urgency="off"
              status="info"
              appearance="stroke"
              size="small"
              title={t('alertDocs.title')}
              actions={[{ label: t('alertDocs.upgrade'), href: '#' }]}
              dismissible
              dismissLabel={t('alertDocs.close')}
            />
          </div>
        }
        spotlight={[
          t('alertDocs.spotlight1'),
          t('alertDocs.spotlight2'),
          t('alertDocs.spotlight3'),
          t('alertDocs.spotlight4'),
          t('alertDocs.spotlight5'),
        ]}
        featuresTitle={t('alertDocs.featuresTitle')}
        featuresBody={t('alertDocs.featuresBody')}
        features={[
          {
            icon: RiCheckLine,
            title: t('alertDocs.feature1Title'),
            body: t('alertDocs.feature1Body'),
          },
          {
            icon: RiCropLine,
            title: t('alertDocs.feature2Title'),
            body: t('alertDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('alertDocs.feature3Title'),
            body: t('alertDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('alertDocs.pageTitle')}
          body={t('alertDocs.sectionBody')}
        >
          {ALERT_SIZES.map((size) => (
            <SizeBlock key={size} label={t(ALERT_SIZE_KEY[size])}>
              <AlertMatrix size={size} />
            </SizeBlock>
          ))}
        </ComponentSection>
      </OverviewPage>
    );
  },
};
