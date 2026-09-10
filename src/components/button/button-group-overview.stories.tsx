import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiBold,
  RiEyeLine,
  RiItalic,
  RiSettings6Line,
  RiSparkling2Line,
  RiUnderline,
} from '@remixicon/react';
import { Icon } from '@components/icon';
import { ButtonGroup, ButtonGroupItem } from '.';
import { ComponentSection, OverviewPage } from '../../docs/overview.docs';
import { ButtonGroupItemsMatrix, ButtonGroupMatrix } from './button-group.docs';

/** Figma "Button Group EN/FA [Overview]". */
const meta: Meta = {
  title: 'Base Components/Button Group/Overview',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

export const Overview: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <OverviewPage
        title={t('buttonGroupDocs.pageTitle')}
        description={[
          t('buttonGroupDocs.descriptionBody1'),
          t('buttonGroupDocs.descriptionBody2'),
        ]}
        hero={
          <ButtonGroup label={t('button.toolbarLabel')} className="mx-auto">
            <ButtonGroupItem selected iconOnly aria-label={t('button.bold')}>
              <Icon icon={RiBold} />
            </ButtonGroupItem>
            <ButtonGroupItem iconOnly aria-label={t('button.italic')}>
              <Icon icon={RiItalic} />
            </ButtonGroupItem>
            <ButtonGroupItem iconOnly aria-label={t('button.underline')}>
              <Icon icon={RiUnderline} />
            </ButtonGroupItem>
          </ButtonGroup>
        }
        spotlight={[1, 2, 3, 4, 5].map((n) =>
          t(`buttonGroupDocs.spotlight${n}`),
        )}
        featuresTitle={t('buttonGroupDocs.featuresTitle')}
        featuresBody={t('buttonGroupDocs.featuresBody')}
        features={[
          {
            icon: RiEyeLine,
            title: t('buttonGroupDocs.feature1Title'),
            body: t('buttonGroupDocs.feature1Body'),
          },
          {
            icon: RiSparkling2Line,
            title: t('buttonGroupDocs.feature2Title'),
            body: t('buttonGroupDocs.feature2Body'),
          },
          {
            icon: RiSettings6Line,
            title: t('buttonGroupDocs.feature3Title'),
            body: t('buttonGroupDocs.feature3Body'),
          },
        ]}
      >
        <ComponentSection
          title={t('buttonGroupDocs.sectionItems')}
          body={t('buttonGroupDocs.sectionItemsBody')}
        >
          <ButtonGroupItemsMatrix />
        </ComponentSection>
        <ComponentSection
          title={t('buttonGroupDocs.sectionGroup')}
          body={t('buttonGroupDocs.sectionGroupBody')}
        >
          <ButtonGroupMatrix />
        </ComponentSection>
      </OverviewPage>
    );
  },
};
