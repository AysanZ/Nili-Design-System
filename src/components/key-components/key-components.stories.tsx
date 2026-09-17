import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiSparkling2Line, RiFolderLine } from '@remixicon/react';
import {
  Label,
  HintText,
  PasswordStrength,
  KeyIcon,
  ChartLegend,
  ContentLabel,
  ContentCard,
  type PasswordStrengthLevel,
  type KeyIconColor,
} from '.';
import { Icon } from '@components/icon';
import { Avatar } from '@components/avatar';
import { Badge } from '@components/badge';
import { FigmaFrame } from '../../docs/figma.docs';
import { ChartLegendDotSet, PaymentIconSet } from './key-components.docs';

const meta: Meta<typeof Label> = {
  title: 'Base Components/Key Components/Key Components',
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `The shared primitives from the Figma "Key Components" page: Label, Hint Text, Password Strength, Key Icons, Chart Legends, Content Label and Content Card.

They live in one folder because Figma groups them and because each is a handful of lines that exists to be composed *into* other components — a Label alone is not a feature. They are still separate exports with their own types.

**Three accessibility decisions worth naming**

- The required asterisk on \`Label\` is \`aria-hidden\`. Requiredness is carried by the input's own \`required\` attribute; reading "Email star" out loud helps nobody.
- \`HintText\` with \`status="error"\` becomes \`role="alert"\`. A validation message that appears after a failed submit is otherwise silent — the most common accessibility bug in forms.
- \`PasswordStrength\` bars are \`aria-hidden\` and the meaning is carried by a \`role="status"\` label. Red/amber/green is the worst possible palette for colour-blind users, and colour alone says nothing to a screen reader either.

**Payment Icons** from that page are illustrations, not a variant set — export them from Figma as SVG, the same as Empty States and Flat Avatar.`,
      },
    },
  },
};

export const Labels = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-72 flex-col gap-3">
      <Label htmlFor="a">{t('keyComponents.label')}</Label>
      <Label htmlFor="b" required>
        {t('keyComponents.label')}
      </Label>
      <Label htmlFor="c" hint={t('keyComponents.required')}>
        {t('keyComponents.label')}
      </Label>
      <Label htmlFor="d" disabled>
        {t('keyComponents.label')}
      </Label>
    </div>
  );
};

export const HintTexts = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-72 flex-col gap-3">
      <HintText icon>{t('keyComponents.hint')}</HintText>
      <HintText status="error" icon>
        {t('keyComponents.error')}
      </HintText>
      <HintText status="disabled">{t('keyComponents.hint')}</HintText>
    </div>
  );
};

export const PasswordStrengths = () => {
  const { t } = useTranslation();
  const levels: Array<[PasswordStrengthLevel, string]> = [
    ['empty', ''],
    ['weak', t('keyComponents.passwordWeak')],
    ['moderate', t('keyComponents.passwordModerate')],
    ['strong', t('keyComponents.passwordStrong')],
  ];
  return (
    <div className="flex w-72 flex-col gap-4">
      {levels.map(([strength, label]) => (
        <PasswordStrength key={strength} strength={strength} label={label} />
      ))}
    </div>
  );
};

export const KeyIcons = () => {
  const colors: KeyIconColor[] = [
    'primary',
    'gray',
    'blue',
    'orange',
    'red',
    'green',
    'yellow',
    'purple',
    'pink',
    'sky',
  ];
  return (
    <div className="flex flex-col gap-4">
      {(['lighter', 'stroke'] as const).map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-3">
          {colors.map((color) => (
            <KeyIcon key={color} appearance={appearance} color={color}>
              <Icon icon={RiSparkling2Line} />
            </KeyIcon>
          ))}
        </div>
      ))}
      <div className="flex items-end gap-3">
        {(['2xl', 'xl', 'lg', 'md', 'sm'] as const).map((size) => (
          <KeyIcon key={size} size={size} color="purple">
            <Icon icon={RiSparkling2Line} />
          </KeyIcon>
        ))}
      </div>
    </div>
  );
};

/** Toggling a series is a control, so it renders as a button with aria-pressed. */
export const ChartLegends = () => {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState<string[]>([]);
  const series = [
    {
      key: 'revenue',
      label: t('keyComponents.revenue'),
      color: 'blue' as const,
      value: '۱۲٬۴۰۰',
    },
    {
      key: 'costs',
      label: t('keyComponents.costs'),
      color: 'orange' as const,
      value: '۸٬۱۰۰',
    },
    {
      key: 'profit',
      label: t('keyComponents.profit'),
      color: 'green' as const,
      value: '۴٬۳۰۰',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {series.map((item) => (
        <ChartLegend
          key={item.key}
          color={item.color}
          value={item.value}
          hidden={hidden.includes(item.key)}
          onToggle={() =>
            setHidden((current) =>
              current.includes(item.key)
                ? current.filter((k) => k !== item.key)
                : [...current, item.key],
            )
          }
        >
          {item.label}
        </ChartLegend>
      ))}
    </div>
  );
};

/** All Content Label / Content Card Types are the same `startAdornment` slot. */
export const ContentLabelsAndCards = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('a');
  return (
    <div className="flex w-80 flex-col gap-3">
      <ContentLabel
        startAdornment={<Avatar size="sm" name="علی رضایی" tone="blue" />}
        title="علی رضایی"
        description={t('keyComponents.cardDescription')}
      />
      <ContentLabel
        size="lg"
        startAdornment={
          <KeyIcon size="md" color="purple">
            <Icon icon={RiFolderLine} />
          </KeyIcon>
        }
        title={t('keyComponents.cardTitle')}
        description={t('keyComponents.cardDescription')}
        endAdornment={
          <Badge size="small" appearance="lighter" color="green">
            v0.2
          </Badge>
        }
      />
      <ContentCard
        selected={selected === 'a'}
        onSelect={() => setSelected('a')}
        startAdornment={
          <KeyIcon size="md" color="blue">
            <Icon icon={RiFolderLine} />
          </KeyIcon>
        }
        title={t('keyComponents.cardTitle')}
        description={t('keyComponents.cardDescription')}
      />
      <ContentCard
        selected={selected === 'b'}
        onSelect={() => setSelected('b')}
        startAdornment={<Avatar size="sm" name="Grace Hopper" tone="purple" />}
        title="Grace Hopper"
        description={t('keyComponents.cardDescription')}
      />
    </div>
  );
};

// ====================== Figma component sets ======================

/** Figma "Chart Legend Dots": every colour, both sizes. */
export const ChartLegendDots = () => (
  <FigmaFrame>
    <ChartLegendDotSet />
  </FigmaFrame>
);
ChartLegendDots.parameters = { docs: { source: { code: null } } };

export const PaymentIcons = () => (
  <FigmaFrame>
    <PaymentIconSet />
  </FigmaFrame>
);
PaymentIcons.parameters = { docs: { source: { code: null } } };

export default meta;
