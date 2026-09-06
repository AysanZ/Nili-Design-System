import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiListUnordered,
  RiLayoutGridLine,
  RiKanbanView,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
} from '@remixicon/react';
import { Toggle, ToggleGroup } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Base Components/Switch Toggle',
  component: ToggleGroup,
  parameters: {
    docs: {
      description: {
        component: `A segmented control — Figma's **"Switch Toggle"** page.

**The two Figma pages are named the other way round to this codebase.** Figma's *Toggle* page is the on/off switch, which lives in \`Switch\`. Figma's *Switch Toggle* page is this segmented control. An earlier version of this component had it backwards and grew five axes the design never had: \`appearance\` (stroke/ghost/filled), \`size\`, a \`multiple\` selection mode, a vertical orientation, and \`attached\`. All five are gone.

**What Figma actually defines:**
- \`Switch Toggle\` → **Left Icon** = On/Off, **Only Icon** = On/Off, **Label**, **Show Triple**
- \`Switch Toggle Items\` → **Type** (Default | Left Icon | Only Icon) × **State** (Default · Hover · Active · Disabled)

**Show Triple is not a prop.** It is two segments or three, which is however many children you pass.

**Selection is single**, so \`role="radiogroup"\` with roving focus and arrow keys — not \`aria-pressed\`. "Grid, 2 of 3" tells the user where they are and how many options exist; "Grid, pressed" tells them neither.

**RTL.** The arrow keys read \`direction\` off the DOM rather than React context, so they stay correct inside a nested \`dir="rtl"\` subtree.`,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

// ====================== Default ======================

export const Default = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('list');
  return (
    <ToggleGroup label={t('toggle.label')} value={view} onValueChange={setView}>
      <Toggle value="list">{t('toggle.list')}</Toggle>
      <Toggle value="grid">{t('toggle.grid')}</Toggle>
    </ToggleGroup>
  );
};

// ====================== Show Triple ======================

/** Figma's "Show Triple" — a third segment, not a prop. */
export const ThreeSegments = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('list');
  return (
    <ToggleGroup label={t('toggle.label')} value={view} onValueChange={setView}>
      <Toggle value="list">{t('toggle.list')}</Toggle>
      <Toggle value="grid">{t('toggle.grid')}</Toggle>
      <Toggle value="board">{t('toggle.board')}</Toggle>
    </ToggleGroup>
  );
};

// ====================== Type ======================

/** Figma's Item "Type": Default, Left Icon, Only Icon. */
export const ItemTypes = () => {
  const { t } = useTranslation();
  const [a, setA] = useState('list');
  const [b, setB] = useState('list');
  const [c, setC] = useState('start');

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup label={t('toggle.label')} value={a} onValueChange={setA}>
        <Toggle value="list">{t('toggle.list')}</Toggle>
        <Toggle value="grid">{t('toggle.grid')}</Toggle>
        <Toggle value="board">{t('toggle.board')}</Toggle>
      </ToggleGroup>

      <ToggleGroup label={t('toggle.label')} value={b} onValueChange={setB}>
        <Toggle value="list" startIcon={<Icon icon={RiListUnordered} />}>
          {t('toggle.list')}
        </Toggle>
        <Toggle value="grid" startIcon={<Icon icon={RiLayoutGridLine} />}>
          {t('toggle.grid')}
        </Toggle>
        <Toggle value="board" startIcon={<Icon icon={RiKanbanView} />}>
          {t('toggle.board')}
        </Toggle>
      </ToggleGroup>

      <ToggleGroup label={t('toggle.format')} value={c} onValueChange={setC}>
        <Toggle
          value="start"
          iconOnly
          aria-label={t('toggle.alignStart')}
          startIcon={<Icon icon={RiAlignLeft} />}
        />
        <Toggle
          value="center"
          iconOnly
          aria-label={t('toggle.alignCenter')}
          startIcon={<Icon icon={RiAlignCenter} />}
        />
        <Toggle
          value="end"
          iconOnly
          aria-label={t('toggle.alignEnd')}
          startIcon={<Icon icon={RiAlignRight} />}
        />
      </ToggleGroup>
    </div>
  );
};

// ====================== Disabled ======================

export const Disabled = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup label={t('toggle.label')} defaultValue="list" disabled>
        <Toggle value="list">{t('toggle.list')}</Toggle>
        <Toggle value="grid">{t('toggle.grid')}</Toggle>
      </ToggleGroup>

      <ToggleGroup label={t('toggle.label')} defaultValue="list">
        <Toggle value="list">{t('toggle.list')}</Toggle>
        <Toggle value="grid" disabled>
          {t('toggle.grid')}
        </Toggle>
        <Toggle value="board">{t('toggle.board')}</Toggle>
      </ToggleGroup>
    </div>
  );
};

export default meta;
