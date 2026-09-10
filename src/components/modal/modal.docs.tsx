/** Docs-only: Figma Modal Header, Footer, Status Modals and Overlay (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseLine,
  RiErrorWarningFill,
  RiInformationFill,
  RiSettings2Line,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Button, CompactButton, LinkButton } from '../button';
import { Checkbox } from '../checkbox';
import { Switch } from '../switch';
import { cn } from '../../lib/cn';
import { modalFooterVariants, modalHeaderVariants } from './modal.styles';

const STATUS = [
  { icon: RiErrorWarningFill, tone: 'bg-error-lighter text-error-base' },
  { icon: RiAlertFill, tone: 'bg-warning-lighter text-warning-base' },
  { icon: RiCheckboxCircleFill, tone: 'bg-success-lighter text-success-base' },
  {
    icon: RiInformationFill,
    tone: 'bg-information-lighter text-information-base',
  },
];

function StatusIcon({ index }: { index: number }) {
  const s = STATUS[index];
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full',
        s.tone,
      )}
    >
      <Icon icon={s.icon} size={20} />
    </span>
  );
}

function Header({
  lead,
  description,
  vertical,
}: {
  lead?: ReactNode;
  description?: boolean;
  vertical?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <header
      className={cn(
        modalHeaderVariants({
          alignment: vertical ? 'vertical' : 'horizontal',
        }),
        'relative bg-white-0',
      )}
    >
      {lead}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-1',
          vertical && 'items-center',
        )}
      >
        <h3 className="text-[14px] leading-5 font-medium text-strong-950">
          {t('modalDocs.title')}
        </h3>
        {description && (
          <p className="text-[12px] leading-4 text-sub-600">
            {t('modalDocs.description')}
          </p>
        )}
      </div>
      <CompactButton
        appearance="ghost"
        aria-label={t('modalDocs.close')}
        className={cn(vertical && 'absolute end-3 top-3')}
      >
        <Icon icon={RiCloseLine} />
      </CompactButton>
    </header>
  );
}

function Board({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[488px] flex-col gap-6 bg-weak-50 p-6">
      {children}
    </div>
  );
}

export function ModalHeaderSet() {
  const neutral = (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-soft-200 bg-white-0 text-sub-600">
      <Icon icon={RiSettings2Line} size={20} />
    </span>
  );
  const leads: (ReactNode | undefined)[] = [
    undefined,
    neutral,
    ...STATUS.map((_, i) => <StatusIcon key={i} index={i} />),
  ];
  return (
    <Board>
      {[true, false].map((description) =>
        leads.map((lead, i) => (
          <Header
            key={`${description}${i}`}
            lead={lead}
            description={description}
          />
        )),
      )}
    </Board>
  );
}

export function ModalFooterSet() {
  const { t } = useTranslation();
  const actions = (
    <div className="ms-auto flex gap-3">
      <Button size="sm" appearance="stroke" color="neutral">
        {t('modalDocs.cancel')}
      </Button>
      <Button size="sm">{t('modalDocs.continue')}</Button>
    </div>
  );
  const starts: ReactNode[] = [
    null,
    <Checkbox key="c" label={t('modalDocs.dontShow')} />,
    <span
      key="r"
      className="flex items-center gap-1.5 text-[14px] text-sub-600"
    >
      <Icon icon={RiInformationFill} size={16} className="text-soft-400" />
      {t('modalDocs.read')}
    </span>,
    <Switch key="s" label={t('modalDocs.anonymous')} />,
    <span key="d" className="flex gap-2.5" aria-hidden>
      <span className="size-2 rounded-full bg-primary-base" />
      <span className="size-2 rounded-full bg-soft-200" />
      <span className="size-2 rounded-full bg-soft-200" />
    </span>,
    <LinkButton key="l" color="gray" underline href="#">
      {t('modalDocs.link')}
    </LinkButton>,
  ];
  return (
    <Board>
      {starts.map((start, i) => (
        <footer
          key={i}
          className={cn(
            modalFooterVariants({ stretch: false }),
            'border-t-0 bg-white-0',
          )}
        >
          {start}
          {actions}
        </footer>
      ))}
      <footer
        className={cn(
          modalFooterVariants({ stretch: true }),
          'border-t-0 bg-white-0',
        )}
      >
        <Button size="sm" appearance="stroke" color="neutral">
          {t('modalDocs.cancel')}
        </Button>
        <Button size="sm">{t('modalDocs.continue')}</Button>
      </footer>
    </Board>
  );
}

/** Figma Status Modals: four statuses, left-aligned and centred. */
export function StatusModalSet() {
  const { t } = useTranslation();
  return (
    <div className="grid w-[900px] max-w-full grid-cols-2 gap-6 bg-weak-50 p-6">
      {[false, true].map((vertical) =>
        STATUS.map((_, i) => (
          <div
            key={`${vertical}${i}`}
            className="overflow-hidden rounded-2xl bg-white-0 shadow-lg"
          >
            <div
              className={cn(
                'flex gap-3.5 p-5',
                vertical && 'flex-col items-center text-center',
              )}
            >
              <StatusIcon index={i} />
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] leading-5 font-medium text-strong-950">
                  {t('modalDocs.statusTitle')}
                </h3>
                <p className="text-[14px] leading-5 text-sub-600">
                  {t('modalDocs.statusDescription')}
                </p>
              </div>
            </div>
            <footer className={modalFooterVariants({ stretch: false })}>
              <Button size="sm" appearance="stroke" color="neutral">
                {t('modalDocs.cancel')}
              </Button>
              <Button size="sm">{t('modalDocs.continue')}</Button>
            </footer>
          </div>
        )),
      )}
    </div>
  );
}

/** Figma Modal Overlay: the scrim behind every modal. */
export function ModalOverlaySet() {
  return (
    <div className="h-[320px] w-[640px] max-w-full rounded-lg bg-[rgba(14,18,27,0.24)]" />
  );
}
