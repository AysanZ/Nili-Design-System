/** Docs-only: Figma Character Counter and Text Area sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import { TextArea } from './text-area';

/** Figma Character Counter: Default · Error · Disabled. */
export function CharacterCounterSet() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] leading-4 text-sub-600">0/200</span>
      <span className="text-[12px] leading-4 text-error-base">0/200</span>
      <span className="text-[12px] leading-4 text-sub-300">0/200</span>
    </div>
  );
}

const ROWS = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'docs.stateFocus', props: { 'data-nili-state': 'focus' } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

/** Figma Text Area: Default · Hover · Focus · Disabled · Error, with hint and counter. */
export function TextAreaSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[280px] flex-col gap-6">
      {ROWS.map((row) => (
        <div key={row.key} className="flex flex-col gap-1">
          <Caption>{t(row.key)}</Caption>
          <TextArea
            label={t('textAreaDocsOv.label')}
            placeholder={t('textAreaDocsOv.placeholder')}
            hint={t('textAreaDocsOv.hint')}
            showCount
            countLimit={200}
            {...row.props}
          />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <Caption>{t('docs.stateFocus')} · Error</Caption>
        <TextArea
          label={t('textAreaDocsOv.label')}
          placeholder={t('textAreaDocsOv.placeholder')}
          error={t('textAreaDocsOv.hint')}
          showCount
          countLimit={200}
        />
      </div>
    </div>
  );
}
