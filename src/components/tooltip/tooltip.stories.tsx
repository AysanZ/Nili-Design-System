import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiFileCopyLine,
  RiInformationLine,
  RiDeleteBinLine,
} from '@remixicon/react';
import { Tooltip } from '.';
import { Icon } from '@components/icon';
import { Button, CompactButton } from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { TooltipPlacementSet, TooltipSizeSet } from './tooltip.docs';

const meta: Meta<typeof Tooltip> = {
  title: 'Base Components/Tooltip/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: `The **Tooltip**, from the Figma "❖ Tooltip" page: four sides, three alignments, two sizes and an optional arrow.

**Key Features:**
- **4 Sides**: \`top\`, \`bottom\`, \`start\`, \`end\`
- **3 Alignments** on the horizontal sides
- **\`delay\`** on hover; focus opens it immediately
- **Controlled** through \`open\` / \`onOpenChange\`

**Hover is only half of it.** A tooltip that opens on \`mouseenter\` alone does not exist for anyone using a keyboard, and that is the most common way this component is built. This one opens on **focus** too, and closes on **Escape** while the trigger keeps focus — WAI-ARIA requires that dismissal, because a bubble covering the next control with no way to close it is a trap.

**It describes, it does not name.** The trigger gets \`aria-describedby\`, never \`aria-labelledby\`. An icon-only button still needs its own \`aria-label\`: a description is announced after a pause and some setups skip it entirely. If the tooltip text is the only name a control has, it is not a tooltip — it is a label, and it belongs in the button.

**Nothing interactive inside.** There is no keyboard path into the bubble, so a link in there is decoration only some users can reach. If the content needs to be clicked, it is a popover.

**Not for touch.** There is no hover on a phone, and tapping a trigger activates it. Anything the user genuinely needs to read must be on the page.

**Figma's Left and Right are \`start\` and \`end\` here.** A tooltip pinned "left" of its trigger in Persian is on the wrong side of it; the whole point of a side is which way it points relative to the reading flow. Switch the Locale toolbar to فارسی and watch **Sides** flip.`,
      },
    },
  },
  argTypes: {
    side: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'start', 'end'],
      table: { defaultValue: { summary: 'top' } },
    },
    align: {
      control: { type: 'inline-radio' },
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'center' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['2xs', 'xs', 'lg'],
      table: { defaultValue: { summary: 'xs' } },
    },
    arrow: { control: 'boolean' },
    delay: { control: 'number' },
    disabled: { control: 'boolean' },
    content: { control: 'text' },
  },
};

const Template: StoryFn<typeof Tooltip> = (args) => {
  const { t } = useTranslation();
  return (
    <div className="grid place-items-center p-16">
      <Tooltip {...args} content={args.content ?? t('tooltip.copyHint')}>
        <Button appearance="stroke">{t('tooltip.copy')}</Button>
      </Tooltip>
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

export const NoArrow = Template.bind({});
NoArrow.args = { arrow: false };

export const Small = Template.bind({});
Small.args = { size: '2xs' };

/** Figma's `Large` — the two-line form, with a description under the text. */
export const WithDescription = Template.bind({});
WithDescription.args = {
  size: 'lg',
  description: 'Applies to this board only',
};

/**
 * Figma's `Dark Mode`. Not the theme: a tooltip is inverted against its
 * surface, so on a dark page the light bubble is the one that reads as an
 * overlay. Per-tooltip, not per-theme.
 */
export const LightBubble = Template.bind({});
LightBubble.args = { darkMode: false };

/** Open on mount, to inspect it without hovering. */
export const AlwaysOpen = Template.bind({});
AlwaysOpen.args = { open: true };

// ====================== Sides ======================

/** `start` and `end` follow the reading direction; top and bottom do not. */
export const Sides = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-8 p-16">
      {(['top', 'bottom', 'start', 'end'] as const).map((side) => (
        <Tooltip
          key={side}
          side={side}
          content={t('tooltip.copyHint')}
          delay={0}
        >
          <Button appearance="stroke">{side}</Button>
        </Tooltip>
      ))}
    </div>
  );
};

export const Alignments = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8 p-16">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Tooltip
          key={align}
          align={align}
          content={t('tooltip.copyHint')}
          delay={0}
        >
          <Button appearance="stroke" className="w-64">
            align = {align}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

// ====================== In context ======================

/**
 * The icon-only case — note the button still carries its own `aria-label`.
 * The tooltip explains; it does not name.
 */
export const IconButtons = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 p-16">
      <Tooltip content={t('tooltip.copyHint')}>
        <CompactButton aria-label={t('tooltip.copy')}>
          <Icon icon={RiFileCopyLine} />
        </CompactButton>
      </Tooltip>
      <Tooltip content={t('tooltip.deleteHint')}>
        <CompactButton appearance="error" aria-label={t('tooltip.delete')}>
          <Icon icon={RiDeleteBinLine} />
        </CompactButton>
      </Tooltip>
    </div>
  );
};

/** A hint beside a label — the classic "what does this field mean" case. */
export const FieldHint = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1 p-16">
      <span className="text-[14px] font-medium leading-5 text-strong-950">
        {t('tooltip.settings')}
      </span>
      <Tooltip side="end" content={t('tooltip.info')}>
        <CompactButton
          appearance="ghost"
          size="md"
          aria-label={t('tooltip.settings')}
        >
          <Icon icon={RiInformationLine} />
        </CompactButton>
      </Tooltip>
    </div>
  );
};

// ====================== Figma component sets ======================

export const TooltipPlacementSetStory = () => (
  <FigmaFrame>
    <TooltipPlacementSet />
  </FigmaFrame>
);
TooltipPlacementSetStory.storyName = 'Tooltip placement';
TooltipPlacementSetStory.parameters = { docs: { source: { code: null } } };

export const TooltipSizeSetStory = () => (
  <FigmaFrame>
    <TooltipSizeSet />
  </FigmaFrame>
);
TooltipSizeSetStory.storyName = 'Tooltip sizes';
TooltipSizeSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
