/** Docs-only: Figma Drawer Header and Drawer Footer sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiHistoryLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Button, LinkButton } from '../button';
import { Checkbox } from '../checkbox';
import { Switch } from '../switch';
import { DrawerFooter, DrawerHeader } from './drawer';

function Board({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[448px] flex-col gap-6 bg-weak-50 p-6">
      {children}
    </div>
  );
}

export function DrawerHeaderSet() {
  const { t } = useTranslation();
  const common = {
    title: t('drawerDocs.title'),
    onClose: () => undefined,
    closeLabel: t('drawerDocs.close'),
  };
  const keyIcon = (
    <span className="flex size-12 items-center justify-center rounded-full border border-soft-200 text-sub-600">
      <Icon icon={RiHistoryLine} size={24} />
    </span>
  );
  return (
    <Board>
      <DrawerHeader {...common} className="border-b-0" />
      <DrawerHeader
        {...common}
        icon={<Icon icon={RiHistoryLine} size={20} className="text-sub-600" />}
        className="border-b-0"
      />
      <DrawerHeader
        {...common}
        description={t('drawerDocs.description')}
        className="border-b-0"
      />
      <DrawerHeader
        {...common}
        description={t('drawerDocs.description')}
        icon={keyIcon}
        className="border-b-0"
      />
    </Board>
  );
}

export function DrawerFooterSet() {
  const { t } = useTranslation();
  const actions = (
    <>
      <Button size="xs" appearance="stroke" color="neutral">
        {t('drawerDocs.cancel')}
      </Button>
      <Button size="xs">{t('drawerDocs.continue')}</Button>
    </>
  );
  return (
    <Board>
      <DrawerFooter className="justify-end border-t-0">{actions}</DrawerFooter>
      <DrawerFooter
        className="border-t-0"
        start={<Checkbox label={t('drawerDocs.dontShow')} />}
      >
        {actions}
      </DrawerFooter>
      <DrawerFooter
        className="border-t-0"
        start={<Switch label={t('drawerDocs.remember')} />}
      >
        {actions}
      </DrawerFooter>
      <DrawerFooter
        className="border-t-0"
        start={
          <span className="flex items-center gap-2.5" aria-hidden>
            <span className="size-2 rounded-full bg-primary-base" />
            <span className="size-2 rounded-full bg-soft-200" />
            <span className="size-2 rounded-full bg-soft-200" />
          </span>
        }
      >
        {actions}
      </DrawerFooter>
      <DrawerFooter
        className="border-t-0"
        start={
          <LinkButton color="gray" underline href="#">
            {t('drawerDocs.link')}
          </LinkButton>
        }
      >
        {actions}
      </DrawerFooter>
      <DrawerFooter className="border-t-0" stretch>
        <Button size="xs" appearance="stroke" color="neutral">
          {t('drawerDocs.cancel')}
        </Button>
        <Button size="xs">{t('drawerDocs.continue')}</Button>
      </DrawerFooter>
    </Board>
  );
}
