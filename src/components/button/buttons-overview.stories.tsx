import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDragMove2Line,
  RiGamepadLine,
  RiSettings6Line,
} from '@remixicon/react';
import { Icon } from '@components/icon';
import { Button } from '.';
import {
  BUTTON_SIZE_KEY,
  ButtonMatrix,
  COMPACT_SIZE_KEY,
  CompactButtonMatrix,
  FancyButtonMatrix,
  LINK_SIZE_KEY,
  LinkButtonMatrix,
  SizeBlock,
} from './button.docs';
import { BUTTON_SIZES } from './button.styles';
import { FANCY_BUTTON_SIZES } from './fancy-button.styles';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';

/**
 * The Figma "Buttons EN [Overview]" / "Buttons FA [Overview]" frame. Switch
 * the Locale toolbar to Farsi for the FA frame.
 */
const meta: Meta = {
  title: 'Base Components/Buttons/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};

export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('buttonDocs.pageTitle')}
        description={[
          t('buttonDocs.descriptionBody1'),
          t('buttonDocs.descriptionBody2'),
        ]}
        hero={
          <Button
            size="md"
            className="mx-auto"
            startIcon={<Icon icon={RiArrowLeftSLine} mirrored />}
            endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
          >
            {t('button.label')}
          </Button>
        }
        spotlight={[
          t('buttonDocs.spotlight1'),
          t('buttonDocs.spotlight2'),
          t('buttonDocs.spotlight3'),
          t('buttonDocs.spotlight4'),
          t('buttonDocs.spotlight5'),
        ]}
        featuresTitle={t('buttonDocs.featuresTitle')}
        featuresBody={t('buttonDocs.featuresBody')}
        features={[
          {
            icon: RiGamepadLine,
            title: t('buttonDocs.feature1Title'),
            body: t('buttonDocs.feature1Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('buttonDocs.feature2Title'),
            body: t('buttonDocs.feature2Body'),
          },
          {
            icon: RiDragMove2Line,
            title: t('buttonDocs.feature3Title'),
            body: t('buttonDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('buttonDocs.sectionButtons')}
          body={t('buttonDocs.sectionButtonsBody')}
        >
          {BUTTON_SIZES.map((size) => (
            <SizeBlock key={size} label={t(BUTTON_SIZE_KEY[size])}>
              <ButtonMatrix size={size} />
            </SizeBlock>
          ))}
        </ComponentSection>

        <ComponentSection
          title={t('buttonDocs.sectionLink')}
          body={t('buttonDocs.sectionLinkBody')}
        >
          {(['md', 'sm'] as const).map((size) => (
            <SizeBlock key={size} label={t(LINK_SIZE_KEY[size])}>
              <LinkButtonMatrix size={size} />
            </SizeBlock>
          ))}
        </ComponentSection>

        <ComponentSection
          title={t('buttonDocs.sectionFancy')}
          body={t('buttonDocs.sectionFancyBody')}
        >
          {FANCY_BUTTON_SIZES.map((size) => (
            <SizeBlock key={size} label={t(BUTTON_SIZE_KEY[size])}>
              <FancyButtonMatrix size={size} />
            </SizeBlock>
          ))}
        </ComponentSection>

        <ComponentSection
          title={t('buttonDocs.sectionCompact')}
          body={t('buttonDocs.sectionCompactBody')}
        >
          {(['lg', 'md'] as const).map((size) => (
            <SizeBlock key={size} label={t(COMPACT_SIZE_KEY[size])}>
              <CompactButtonMatrix size={size} />
            </SizeBlock>
          ))}
        </ComponentSection>
      </OverviewPage>
    );
  },
};
