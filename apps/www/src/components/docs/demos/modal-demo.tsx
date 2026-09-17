'use client';

import { useState } from 'react';
import { RiDeleteBinLine } from '@remixicon/react';
import {
  Modal,
  StatusModal,
  Button,
  TextInput,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { modalText } from './modal-demo.text';

/**
 * Responsive overview for Modal and Status Modal.
 */
export function ModalDemo() {
  const t = useDemoText(modalText);
  const [open, setOpen] = useState<string | null>(null);
  const close = () => setOpen(null);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Modal, Button } from "@nili/ui"

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite a teammate"
        description="They will get an email with a link to join."
        closeLabel="Close"
        footer={
          <>
            <Button appearance="stroke" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </>
        }
      >
        <TextInput label={t('invite.email')} placeholder="hello@nili.design" />
      </Modal>
    </>
  )
}`}
      >
        <DemoRow>
          <Button onClick={() => setOpen('basic')}>{t('basic.open')}</Button>
        </DemoRow>
        <Modal
          open={open === 'basic'}
          onOpenChange={close}
          title={t('invite.title')}
          description={t('invite.body')}
          closeLabel={t('close')}
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('cancel')}
              </Button>
              <Button onClick={close}>{t('invite.send')}</Button>
            </>
          }
        >
          <TextInput label="Email address" placeholder="hello@nili.design" />
        </Modal>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Modal } from "@nili/ui"

export function Example() {
  return (
    <>
      <Modal size="sm" … />
      <Modal size="md" … />
      <Modal size="lg" … />
      <Modal size="xl" … />
    </>
  )
}`}
      >
        <DemoRow>
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Button
              key={size}
              appearance="stroke"
              size="sm"
              onClick={() => setOpen(`size-${size}`)}
            >
              {size}
            </Button>
          ))}
        </DemoRow>
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Modal
            key={size}
            open={open === `size-${size}`}
            onOpenChange={close}
            size={size}
            title={t('sizes.panel').replace('{size}', size)}
            description={t('sizes.note')}
            closeLabel={t('close')}
            footer={<Button onClick={close}>{t('sizes.gotIt')}</Button>}
          >
            <p className="text-[13px] leading-5 text-sub-600">
              {t('sizes.scroll')}
            </p>
          </Modal>
        ))}
      </DemoSection>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('header.title')}
        description={t('header.body')}
        code={`import { Modal, Icon } from "@nili/ui"
import { RiDeleteBinLine } from "@remixicon/react"

export function Example() {
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      alignment="vertical"
      status="error"
      icon={<Icon icon={RiDeleteBinLine} />}
      title="Delete this project?"
      description="This cannot be undone. Everything in it will be removed."
      stretchFooter
      footer={
        <>
          <Button appearance="stroke" onClick={close}>Cancel</Button>
          <Button color="error" onClick={close}>Delete</Button>
        </>
      }
    />
  )
}`}
      >
        <DemoRow>
          <Button
            appearance="stroke"
            size="sm"
            onClick={() => setOpen('horizontal')}
          >
            {t('header.horizontal')}
          </Button>
          <Button
            appearance="stroke"
            size="sm"
            onClick={() => setOpen('vertical')}
          >
            {t('header.vertical')}
          </Button>
        </DemoRow>

        <Modal
          open={open === 'horizontal'}
          onOpenChange={close}
          headerSize="md"
          icon={<Icon icon={RiDeleteBinLine} />}
          title={t('delete.title')}
          description={t('delete.short')}
          closeLabel={t('close')}
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('cancel')}
              </Button>
              <Button color="error" onClick={close}>
                {t('delete.confirm')}
              </Button>
            </>
          }
        />

        <Modal
          open={open === 'vertical'}
          onOpenChange={close}
          alignment="vertical"
          status="error"
          title={t('delete.title')}
          description={t('delete.long')}
          closeLabel={t('close')}
          stretchFooter
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('cancel')}
              </Button>
              <Button color="error" onClick={close}>
                {t('delete.confirm')}
              </Button>
            </>
          }
        />
      </DemoSection>

      {/* ── Status Modal ────────────────────────────────────────────── */}
      <DemoSection
        title={t('status.title')}
        description={t('status.body')}
        code={`import { StatusModal, Button } from "@nili/ui"

export function Example() {
  return (
    <StatusModal
      open={open}
      onOpenChange={setOpen}
      status="success"
      alignment="vertical"
      title="Payment received"
      description="We have emailed you a receipt."
      stretchFooter
      footer={<Button onClick={close}>Done</Button>}
    />
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <DemoLabel>{t('status.group')}</DemoLabel>
          <DemoRow>
            {(['error', 'warning', 'success', 'info'] as const).map(
              (status) => (
                <Button
                  key={status}
                  appearance="stroke"
                  size="sm"
                  onClick={() => setOpen(`status-${status}`)}
                >
                  {status}
                </Button>
              ),
            )}
          </DemoRow>
        </div>

        {(['error', 'warning', 'success', 'info'] as const).map((status) => (
          <StatusModal
            key={status}
            open={open === `status-${status}`}
            onOpenChange={close}
            status={status}
            alignment="vertical"
            title={t('status.sample').replace('{status}', status)}
            description={t('status.note')}
            closeLabel={t('close')}
            stretchFooter
            footer={
              <>
                <Button appearance="stroke" onClick={close}>
                  {t('cancel')}
                </Button>
                <Button onClick={close}>{t('status.confirm')}</Button>
              </>
            }
          />
        ))}
      </DemoSection>

      {/* ── Dismissal ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('dismiss.title')}
        description={t('dismiss.body')}
        code={`import { Modal } from "@nili/ui"

export function Example() {
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={false}
      showClose
      closeLabel="Close"
      title="Unsaved changes"
      …
    />
  )
}`}
      >
        <DemoRow>
          <Button
            appearance="stroke"
            size="sm"
            onClick={() => setOpen('sticky')}
          >
            {t('dismiss.trigger')}
          </Button>
        </DemoRow>
        <Modal
          open={open === 'sticky'}
          onOpenChange={close}
          closeOnOutsideClick={false}
          closeOnEscape={false}
          showClose
          closeLabel={t('close')}
          title={t('dismiss.unsaved')}
          description={t('dismiss.note')}
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('dismiss.discard')}
              </Button>
              <Button onClick={close}>{t('dismiss.save')}</Button>
            </>
          }
        />
      </DemoSection>
    </div>
  );
}
