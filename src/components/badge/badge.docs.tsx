/** Docs-only: Figma Badge / Status Badge component sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiFlashlightFill } from '@remixicon/react';
import { Caption } from '../../docs/figma.docs';
import { Badge } from './badge';
import { StatusBadge } from './status-badge';
import type { BadgeAppearance, BadgeColor, BadgeSize } from './badge.types';

const COLORS: BadgeColor[] = [
  'gray',
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'purple',
  'sky',
  'pink',
  'teal',
];
const STYLES: BadgeAppearance[] = ['filled', 'light', 'lighter', 'stroke'];
const STYLE_KEY: Record<BadgeAppearance, string> = {
  filled: 'badgeDocs.styleFilled',
  light: 'badgeDocs.styleLight',
  lighter: 'badgeDocs.styleLighter',
  stroke: 'badgeDocs.styleStroke',
};

/** Figma: text · dot · left icon · right icon · number, per style. */
function Five({
  size,
  appearance,
  color,
  disabled,
}: {
  size: BadgeSize;
  appearance: BadgeAppearance;
  color: BadgeColor;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const common = { size, appearance, color, disabled };
  const iconSize = size === 'small' ? 12 : 16;
  const flash = <RiFlashlightFill size={iconSize} />;
  return (
    <div className="flex items-center gap-2">
      <Badge {...common}>{t('badgeDocs.label')}</Badge>
      <Badge {...common} dot>
        {t('badgeDocs.label')}
      </Badge>
      <Badge {...common} startIcon={flash}>
        {t('badgeDocs.label')}
      </Badge>
      <Badge {...common} endIcon={flash}>
        {t('badgeDocs.label')}
      </Badge>
      <Badge {...common}>{2}</Badge>
    </div>
  );
}

export function BadgeMatrix({ size }: { size: BadgeSize }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-10 gap-y-2.5">
      <span />
      {STYLES.map((style) => (
        <Caption key={style}>{t(STYLE_KEY[style])}</Caption>
      ))}
      {COLORS.map((color) => (
        <Row key={color} label={color}>
          {STYLES.map((appearance) => (
            <Five
              key={appearance}
              size={size}
              appearance={appearance}
              color={color}
            />
          ))}
        </Row>
      ))}
      <Row label={t('badgeDocs.disabled')}>
        {STYLES.map((appearance) => (
          <Five
            key={appearance}
            size={size}
            appearance={appearance}
            color="gray"
            disabled
          />
        ))}
      </Row>
    </div>
  );
}

const STATUSES = ['completed', 'pending', 'failed', 'disabled'] as const;
const STATUS_KEY = {
  completed: 'badgeDocs.statusCompleted',
  pending: 'badgeDocs.statusPending',
  failed: 'badgeDocs.statusFailed',
  disabled: 'badgeDocs.statusDisabled',
} as const;

/** Figma Status Badge: four statuses × (stroke, light) × (icon, dot). */
export function StatusBadgeMatrix() {
  const { t } = useTranslation();
  const cols = [
    { appearance: 'stroke', dot: false, key: 'badgeDocs.styleStroke' },
    { appearance: 'stroke', dot: true, key: 'badgeDocs.styleStroke' },
    { appearance: 'light', dot: false, key: 'badgeDocs.styleLight' },
    { appearance: 'light', dot: true, key: 'badgeDocs.styleLight' },
  ] as const;
  return (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-8 gap-y-3">
      <span />
      {cols.map((col, index) => (
        <Caption key={index}>
          {t(col.key)} ·{' '}
          {t(col.dot ? 'badgeDocs.withDot' : 'badgeDocs.withIcon')}
        </Caption>
      ))}
      {STATUSES.map((status) => (
        <Row key={status} label={t(STATUS_KEY[status])}>
          {cols.map((col, index) => (
            <span key={index}>
              <StatusBadge
                status={status}
                appearance={col.appearance}
                dot={col.dot}
              >
                {t('badgeDocs.label')}
              </StatusBadge>
            </span>
          ))}
        </Row>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2">{label}</Caption>
      {children}
    </>
  );
}
