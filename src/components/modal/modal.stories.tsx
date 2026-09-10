import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Modal, StatusModal, type ModalStatus } from '.';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { FigmaFrame } from '../../docs/figma.docs';
import {
  ModalFooterSet,
  ModalHeaderSet,
  ModalOverlaySet,
  StatusModalSet,
} from './modal.docs';

const meta: Meta<typeof Modal> = {
  title: 'Base Components/Modal/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: `The **Modal**, from the Figma "❖ Modal" page (Header: Basic/Right Icon/Error/Warning/Success/Information × Medium 80/Small 56; Footer: Basic/Checkbox/Information/Toggle/Stepper/Link Button/Stretch; Status Modal: 4 types × Horizontal/Vertical).

The header's six Types collapse to \`status\` (which picks the KeyIcon) plus a free \`icon\` slot for "Right Icon". The footer's seven are content shapes, so \`footer\` takes children and \`stretchFooter\` handles layout — the same split as Drawer.

**Why the overlay is a sibling of the panel, not its parent.** The panel is centred by the overlay's grid, but outside-click detection asks whether the event landed inside the *panel*. Nesting the panel in a click-handling overlay makes every click on the panel bubble through it, and the usual workaround — \`stopPropagation\` on the panel — breaks any consumer listening for clicks higher up.

**The overlay scrolls, not the panel.** A tall modal on a short viewport should scroll the whole dialog, rather than trapping content in an inner scrollbar with the header and footer clipped off screen.`,
      },
    },
  },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg', 'xl'] },
    headerSize: { control: { type: 'radio' }, options: ['sm', 'md'] },
    alignment: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    status: {
      control: { type: 'select' },
      options: [undefined, 'error', 'warning', 'success', 'info'],
    },
    stretchFooter: { control: 'boolean' },
  },
};

export const Default = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('modal.open')}</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={t('modal.title')}
        description={t('modal.description')}
        closeLabel={t('modal.close')}
        footer={
          <>
            <Button
              appearance="stroke"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {t('modal.cancel')}
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              {t('modal.confirm')}
            </Button>
          </>
        }
      >
        <p className="text-[14px] leading-5 text-sub-600">{t('modal.body')}</p>
      </Modal>
    </>
  );
};

/** Figma's Status Modal: vertical alignment, status icon, stretched footer. */
export const StatusModals = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ModalStatus | null>(null);
  const copy: Record<ModalStatus, [string, string]> = {
    error: [t('modal.title'), t('modal.description')],
    warning: [t('modal.warningTitle'), t('modal.warningDescription')],
    success: [t('modal.successTitle'), t('modal.successDescription')],
    info: [t('modal.infoTitle'), t('modal.infoDescription')],
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(['error', 'warning', 'success', 'info'] as const).map((value) => (
          <Button
            key={value}
            appearance="stroke"
            color="neutral"
            onClick={() => setStatus(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      {status && (
        <StatusModal
          open
          status={status}
          onOpenChange={() => setStatus(null)}
          title={copy[status][0]}
          description={copy[status][1]}
          closeLabel={t('modal.close')}
          stretchFooter
          footer={
            <>
              <Button
                appearance="stroke"
                color="neutral"
                onClick={() => setStatus(null)}
              >
                {t('modal.cancel')}
              </Button>
              <Button onClick={() => setStatus(null)}>
                {t('modal.gotIt')}
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

/** Figma footer "Checkbox" plus "Stretch", combined. */
export const CheckboxFooter = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('modal.open')}</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        status="warning"
        title={t('modal.warningTitle')}
        description={t('modal.warningDescription')}
        closeLabel={t('modal.close')}
        footer={
          <>
            <Checkbox label={t('modal.dontAsk')} rootClassName="me-auto" />
            <Button
              appearance="stroke"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {t('modal.cancel')}
            </Button>
            <Button onClick={() => setOpen(false)}>{t('modal.gotIt')}</Button>
          </>
        }
      />
    </>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(['sm', 'md', 'lg', 'xl'] as const).map((value) => (
          <Button
            key={value}
            appearance="stroke"
            color="neutral"
            onClick={() => setSize(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Modal
        open={size !== null}
        onOpenChange={() => setSize(null)}
        size={size ?? 'md'}
        title={t('modal.title')}
        description={t('modal.description')}
        closeLabel={t('modal.close')}
      >
        <p className="text-[14px] leading-5 text-sub-600">{t('modal.body')}</p>
      </Modal>
    </>
  );
};

// ====================== Figma component sets ======================

export const ModalHeader = () => (
  <FigmaFrame>
    <ModalHeaderSet />
  </FigmaFrame>
);
ModalHeader.parameters = { docs: { source: { code: null } } };

export const ModalFooter = () => (
  <FigmaFrame>
    <ModalFooterSet />
  </FigmaFrame>
);
ModalFooter.parameters = { docs: { source: { code: null } } };

export const StatusModalsSet = () => (
  <FigmaFrame>
    <StatusModalSet />
  </FigmaFrame>
);
StatusModalsSet.storyName = 'Status Modals set';
StatusModalsSet.parameters = { docs: { source: { code: null } } };

export const ModalOverlay = () => (
  <FigmaFrame>
    <ModalOverlaySet />
  </FigmaFrame>
);
ModalOverlay.parameters = { docs: { source: { code: null } } };

export default meta;
