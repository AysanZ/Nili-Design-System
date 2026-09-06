import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiSettings3Line } from '@remixicon/react';
import { Drawer, type DrawerSide } from '.';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Icon } from '@components/icon';

const meta: Meta<typeof Drawer> = {
  title: 'Base Components/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component: `The **Drawer**, from the Figma "Drawer" page (Drawer Header: Basic/Left Icon × Small/Large; Drawer Footer: Basic/Checkbox/Toggle/Stepper/Link Button/Stretch).

**The footer's six "types" are content shapes**, so \`footer\` takes children and \`stretchFooter\` handles the layout — as a six-value enum, "checkbox plus stretched buttons" would be unreachable.

**Accessibility.** \`role="dialog"\` + \`aria-modal\`, labelled by its own title, focus trapped inside and **returned to the trigger on close** — the half everyone forgets, without which closing drops the user at the top of the document. Background scroll is locked; without it the page behind scrolls under the panel on mobile and reads as broken.

**RTL.** \`side\` is logical: \`end\` is the right edge in English and the left edge in Persian, and the enter *and* exit transforms flip with it. A drawer that slides in from the correct side but exits to the wrong one is worse than one that never animates.

**Portalled** to \`document.body\`, so the panel escapes any ancestor with \`overflow: hidden\`. It stays mounted through the exit transition, then unmounts to genuinely release the focus trap and scroll lock.`,
      },
    },
  },
  argTypes: {
    side: {
      control: { type: 'select' },
      options: ['start', 'end', 'top', 'bottom'],
    },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg', 'full'] },
    headerSize: { control: { type: 'radio' }, options: ['sm', 'lg'] },
    stretchFooter: { control: 'boolean' },
  },
};

const Demo = ({ side = 'end' as DrawerSide, ...args }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('drawer.open')}</Button>
      <Drawer
        {...args}
        side={side}
        open={open}
        onOpenChange={setOpen}
        title={t('drawer.title')}
        description={t('drawer.description')}
        closeLabel={t('drawer.close')}
        footer={
          <>
            <Button
              appearance="stroke"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {t('drawer.cancel')}
            </Button>
            <Button onClick={() => setOpen(false)}>{t('drawer.save')}</Button>
          </>
        }
      >
        <p className="text-[14px] leading-5 text-sub-600">{t('drawer.body')}</p>
      </Drawer>
    </>
  );
};

export const Default = () => <Demo />;

/** `start` and `end` are logical — switch to فارسی and they swap sides. */
export const Sides = () => {
  const { t } = useTranslation();
  const [side, setSide] = useState<DrawerSide | null>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(['start', 'end', 'top', 'bottom'] as const).map((value) => (
          <Button
            key={value}
            appearance="stroke"
            color="neutral"
            onClick={() => setSide(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Drawer
        open={side !== null}
        onOpenChange={() => setSide(null)}
        side={side ?? 'end'}
        title={t('drawer.title')}
        description={t('drawer.description')}
        closeLabel={t('drawer.close')}
      >
        <p className="text-[14px] leading-5 text-sub-600">{t('drawer.body')}</p>
      </Drawer>
    </>
  );
};

export const LargeHeader = () => <Demo headerSize="lg" size="lg" />;

/** Figma footer "Stretch" plus "Checkbox", combined. */
export const StretchedFooterWithCheckbox = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('drawer.open')}</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title={t('drawer.title')}
        icon={
          <Icon icon={RiSettings3Line} size={20} className="text-sub-600" />
        }
        closeLabel={t('drawer.close')}
        stretchFooter
        footer={
          <>
            <Button
              appearance="stroke"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {t('drawer.cancel')}
            </Button>
            <Button onClick={() => setOpen(false)}>{t('drawer.save')}</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-5 text-sub-600">
            {t('drawer.body')}
          </p>
          <Checkbox label={t('drawer.notify')} defaultChecked />
        </div>
      </Drawer>
    </>
  );
};

export default meta;
