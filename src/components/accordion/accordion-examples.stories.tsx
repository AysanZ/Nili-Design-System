import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiAccountCircleLine,
  RiBankCardLine,
  RiLock2Line,
  RiMapPinTimeLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import { Icon } from '@components/icon';
import { Accordion, AccordionGroup } from '.';
import { ExampleCard, ExamplesPage } from '../../docs/overview.docs';

/** Figma "Accordion EN [Examples]": the FAQ list, on light and on dark. */
const meta: Meta = {
  title: 'Base Components/Accordion/Examples',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};

export default meta;

const FAQ: { id: string; icon: RemixiconComponentType; key: string }[] = [
  { id: 'account', icon: RiAccountCircleLine, key: 'faqAccount' },
  { id: 'payment', icon: RiBankCardLine, key: 'faqPayment' },
  { id: 'track', icon: RiMapPinTimeLine, key: 'faqTrack' },
  { id: 'password', icon: RiLock2Line, key: 'faqPassword' },
];

function Faq({ scope }: { scope: string }) {
  const { t } = useTranslation();
  return (
    <AccordionGroup
      type="single"
      defaultValue={[`${scope}-payment`]}
      className="w-[440px] max-w-full"
    >
      {FAQ.map((item) => (
        <Accordion
          key={item.id}
          id={`${scope}-${item.id}`}
          startAdornment={<Icon icon={item.icon} size={20} />}
          title={t(`accordionDocs.${item.key}`)}
          content={t(`accordionDocs.${item.key}Answer`)}
        />
      ))}
    </AccordionGroup>
  );
}

export const Examples: StoryObj = {
  render: function Render() {
    const { t } = useTranslation();
    return (
      <ExamplesPage
        component={t('accordionDocs.pageTitle')}
        body={t('accordionDocs.examplesBody')}
      >
        <ExampleCard>
          <Faq scope="light" />
        </ExampleCard>
        <ExampleCard theme="dark">
          <Faq scope="dark" />
        </ExampleCard>
      </ExamplesPage>
    );
  },
};
