import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiAddLine, RiArrowDownSLine } from '@remixicon/react';
import { ContentDivider } from '.';
import { Icon } from '@components/icon';
import {
  Button,
  CompactButton,
  ButtonGroup,
  ButtonGroupItem,
} from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { ContentDividerMatrix } from './content-divider.docs';

const meta: Meta<typeof ContentDivider> = {
  title: 'Base Components/Content Divider/Content Divider',
  component: ContentDivider,
  parameters: {
    docs: {
      description: {
        component: `The **Content Divider**, from the Figma "❖ Content Divider" page.

Figma models nine Types: Line, Line Spacing, Text & Line Divider, Text Divider, Solid Text Divider, Icon Button, Icon Button Group, Text Button, Text Button Group.

Since v1.1 there is also a **\`type\` prop carrying all nine names verbatim**, for when you want to say what Figma says. It is a preset over \`spacing\`, \`align\` and \`appearance\`; anything you pass explicitly still wins.

**Those nine names describe two independent things** — how much vertical room the divider takes, and what sits in the middle of it. As one nine-value enum, "text divider with a button" is unreachable. Split into \`spacing\` + \`children\`, all nine are expressible, plus the combinations Figma has no name for:

| Figma Type | Here |
| --- | --- |
| Line | \`<ContentDivider />\` |
| Line Spacing | \`spacing="md"\` |
| Text Divider / Text & Line | \`<ContentDivider>or</ContentDivider>\` |
| Solid Text Divider | \`appearance="solid"\` |
| Icon Button | \`<ContentDivider><CompactButton …/></ContentDivider>\` |
| Text Button | \`<ContentDivider><Button …/></ContentDivider>\` |
| Button Group | \`<ContentDivider><ButtonGroup …/></ContentDivider>\` |

**Semantics.** A bare rule is \`role="separator"\`. One with content is not — a separator has no children in the ARIA model, so labelling it would hide the button inside from the accessibility tree.`,
      },
    },
  },
  argTypes: {
    spacing: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    align: { control: { type: 'select' }, options: ['start', 'center', 'end'] },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    appearance: { control: { type: 'radio' }, options: ['subtle', 'solid'] },
  },
};

export const Line = () => (
  <div className="w-96">
    <ContentDivider />
  </div>
);

export const AllTypes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-96 flex-col gap-2">
      <ContentDivider spacing="md" />
      <ContentDivider spacing="md">{t('divider.or')}</ContentDivider>
      <ContentDivider spacing="md" appearance="solid">
        {t('divider.section')}
      </ContentDivider>
      <ContentDivider spacing="md" align="start">
        {t('divider.today')}
      </ContentDivider>
      <ContentDivider spacing="md">
        <CompactButton appearance="stroke" aria-label={t('divider.showMore')}>
          <Icon icon={RiAddLine} />
        </CompactButton>
      </ContentDivider>
      <ContentDivider spacing="md">
        <Button
          size="2xs"
          appearance="stroke"
          color="neutral"
          endIcon={<Icon icon={RiArrowDownSLine} />}
        >
          {t('divider.showMore')}
        </Button>
      </ContentDivider>
      <ContentDivider spacing="md">
        <ButtonGroup size="2xs" label={t('divider.section')}>
          <ButtonGroupItem selected>{t('divider.today')}</ButtonGroupItem>
          <ButtonGroupItem>{t('divider.showMore')}</ButtonGroupItem>
        </ButtonGroup>
      </ContentDivider>
    </div>
  );
};

/** `align="start"` is a logical position: it flips to the right in Persian. */
export const Alignment = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-96 flex-col gap-2">
      {(['start', 'center', 'end'] as const).map((align) => (
        <ContentDivider key={align} spacing="md" align={align}>
          {t('divider.or')}
        </ContentDivider>
      ))}
    </div>
  );
};

export const Vertical = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-24 items-center gap-3">
      <span className="text-[14px] text-sub-600">{t('divider.today')}</span>
      <ContentDivider orientation="vertical" />
      <span className="text-[14px] text-sub-600">{t('divider.showMore')}</span>
    </div>
  );
};

/** The nine Figma `🧩 Type` names, via the `type` preset prop. */
export const FigmaTypes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-96 flex-col">
      <ContentDivider type="line" />
      <ContentDivider type="line-spacing" />
      <ContentDivider type="text-and-line">
        {t('divider.section')}
      </ContentDivider>
      <ContentDivider type="text">{t('divider.or')}</ContentDivider>
      <ContentDivider type="solid-text">
        {t('divider.solidText')}
      </ContentDivider>
      <ContentDivider type="icon-button">
        <CompactButton
          appearance="stroke"
          size="lg"
          aria-label={t('divider.showMore')}
        >
          <Icon icon={RiAddLine} />
        </CompactButton>
      </ContentDivider>
      <ContentDivider type="text-button">
        <Button appearance="stroke" size="2xs">
          {t('divider.showMore')}
        </Button>
      </ContentDivider>
      <ContentDivider type="text-button-group">
        <ButtonGroup size="2xs" label={t('divider.section')}>
          <ButtonGroupItem selected>{t('divider.today')}</ButtonGroupItem>
          <ButtonGroupItem>{t('divider.section')}</ButtonGroupItem>
        </ButtonGroup>
      </ContentDivider>
    </div>
  );
};

// ====================== Figma component sets ======================

export const ComponentSet = () => (
  <FigmaFrame>
    <ContentDividerMatrix />
  </FigmaFrame>
);
ComponentSet.storyName = 'Component set';
ComponentSet.parameters = { docs: { source: { code: null } } };

export default meta;
