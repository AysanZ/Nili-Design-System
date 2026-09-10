import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCropLine, RiCursorLine, RiUserLine } from '@remixicon/react';
import { AvatarGroup } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import {
  AvatarGroupMatrix,
  AvatarSizeMatrix,
  CompactGroupMatrix,
  FlatAvatarExamples,
  FlatAvatarParts,
  PERSONAS,
  PersonaGrid,
  StatusSets,
} from './avatar.docs';

/** Figma "Avatar EN/FA [Overview]" plus the Flat Avatar sets. */
const meta: Meta = {
  title: 'Base Components/Avatar/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('avatarDocs.pageTitle')}
        description={[
          t('avatarDocs.descriptionBody1'),
          t('avatarDocs.descriptionBody2'),
        ]}
        hero={
          <AvatarGroup
            size="3xl"
            className="justify-center"
            items={(['blue', 'yellow', 'pink', 'green'] as const).map(
              (tone, i) => ({
                id: PERSONAS[i].name,
                name: PERSONAS[i].name,
                src: PERSONAS[i].cutout,
                tone,
              }),
            )}
            overflowCount={9}
          />
        }
        spotlight={[1, 2, 3, 4, 5].map((n) => t(`avatarDocs.spotlight${n}`))}
        featuresTitle={t('avatarDocs.featuresTitle')}
        featuresBody={t('avatarDocs.featuresBody')}
        features={[
          {
            icon: RiCropLine,
            title: t('avatarDocs.feature1Title'),
            body: t('avatarDocs.feature1Body'),
          },
          {
            icon: RiUserLine,
            title: t('avatarDocs.feature2Title'),
            body: t('avatarDocs.feature2Body'),
          },
          {
            icon: RiCursorLine,
            title: t('avatarDocs.feature3Title'),
            body: t('avatarDocs.feature3Body'),
          },
        ]}
      >
        <section className="px-6 pb-24 lg:px-[100px]">
          <h2 className="pt-20 text-[32px] leading-10 font-medium">
            {t('avatarDocs.sectionImages')}
          </h2>
          <p className="mt-2 mb-14 text-[16px] leading-6 text-sub-600">
            {t('avatarDocs.sectionImagesBody')}
          </p>
          <PersonaGrid />
        </section>
        <ComponentSection
          title={t('avatarDocs.sectionStatuses')}
          body={t('avatarDocs.sectionStatusesBody')}
        >
          <StatusSets />
        </ComponentSection>
        <ComponentSection
          title={t('avatarDocs.sectionAvatar')}
          body={t('avatarDocs.sectionAvatarBody')}
        >
          <AvatarSizeMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('avatarDocs.sectionGroup')}
          body={t('avatarDocs.sectionGroupBody')}
        >
          <AvatarGroupMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('avatarDocs.sectionCompact')}
          body={t('avatarDocs.sectionCompactBody')}
        >
          <CompactGroupMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('avatarDocs.sectionFlat')}
          body={t('avatarDocs.sectionFlatBody')}
        >
          <FlatAvatarExamples />
          <FlatAvatarParts />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
