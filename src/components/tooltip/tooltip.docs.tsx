/** Docs-only: Figma Tooltip placement, size and light/dark sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { RiGlobalLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Button } from '../button';
import { Caption } from '../../docs/figma.docs';
import { Tooltip } from './tooltip';
import type { TooltipSide } from './tooltip.types';

const SIDES: TooltipSide[] = ['top', 'bottom', 'start', 'end'];

/** Figma's tail placements: every side, small size, light and dark. */
export function TooltipPlacementSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-x-16 gap-y-10 py-10">
      {([true, false] as const).map((darkMode) => (
        <div
          key={String(darkMode)}
          className="flex flex-col items-center gap-8"
        >
          <Caption>{darkMode ? 'Dark' : 'Light'}</Caption>
          {SIDES.map((side) => (
            <Tooltip
              key={side}
              side={side}
              darkMode={darkMode}
              defaultOpen
              content={t('tooltipDocsOv.label')}
            >
              <Button size="sm" appearance="stroke" color="neutral">
                {side}
              </Button>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Figma Tooltip sizes: 2X-Small, X-Small, and the Large two-line form with a description. */
export function TooltipSizeSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-start gap-16 py-10">
      <Tooltip size="2xs" defaultOpen content={t('tableDocs.title')}>
        <Button size="sm" appearance="stroke" color="neutral">
          2X-Small
        </Button>
      </Tooltip>
      <Tooltip size="xs" defaultOpen content={t('tooltipDocsOv.label')}>
        <Button size="sm" appearance="stroke" color="neutral">
          X-Small
        </Button>
      </Tooltip>
      <Tooltip
        size="lg"
        defaultOpen
        startIcon={<Icon icon={RiGlobalLine} />}
        content={t('tooltipDocsOv.label')}
        description={t('tooltipDocsOv.description')}
        dismissible
      >
        <Button size="sm" appearance="stroke" color="neutral">
          Large
        </Button>
      </Tooltip>
    </div>
  );
}
