import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiFileTextLine, RiImageLine, RiLayoutTopLine } from '@remixicon/react';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { FileFormatIconSet } from './file-upload.docs';
import { CardStates, ImageUploads, UploadArea } from './file-upload.stories';

/** Figma "File Upload EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/File Upload/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('fileUploadDocs.pageTitle')}
        description={[
          t('fileUploadDocs.descriptionBody1'),
          t('fileUploadDocs.descriptionBody2'),
        ]}
        hero={
          <div className="mx-auto w-[360px]">
            <UploadArea />
          </div>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`fileUploadDocs.spotlight${n}`),
        )}
        featuresTitle={t('fileUploadDocs.featuresTitle')}
        featuresBody={t('fileUploadDocs.featuresBody')}
        features={[
          {
            icon: RiImageLine,
            title: t('fileUploadDocs.feature1Title'),
            body: t('fileUploadDocs.feature1Body'),
          },
          {
            icon: RiLayoutTopLine,
            title: t('fileUploadDocs.feature2Title'),
            body: t('fileUploadDocs.feature2Body'),
          },
          {
            icon: RiFileTextLine,
            title: t('fileUploadDocs.feature3Title'),
            body: t('fileUploadDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('fileUploadDocs.sectionArea')}
          body={t('fileUploadDocs.sectionAreaBody')}
        >
          <UploadArea />
        </ComponentSection>
        <ComponentSection
          title={t('fileUploadDocs.sectionIcons')}
          body={t('fileUploadDocs.sectionIconsBody')}
        >
          <FileFormatIconSet />
        </ComponentSection>
        <ComponentSection
          title={t('fileUploadDocs.sectionCards')}
          body={t('fileUploadDocs.sectionCardsBody')}
        >
          <CardStates />
        </ComponentSection>
        <ComponentSection
          title={t('fileUploadDocs.sectionImage')}
          body={t('fileUploadDocs.sectionImageBody')}
        >
          <ImageUploads />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
