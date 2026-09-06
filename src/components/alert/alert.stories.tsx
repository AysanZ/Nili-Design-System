import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Alert } from '.';
import { Button } from '@components/button';

const meta: Meta<typeof Alert> = {
  title: 'Base Components/Alert, Notification & Toast',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: `The **Alert** component surfaces an inline status message: a result, a warning, a piece of context the user needs before continuing.

**Key Features:**
- **5 Statuses**: Error, Warning, Success, Info, Feature
- **4 Appearances**: Filled, Light, Lighter, Stroke
- **3 Sizes**: X-Small, Small, Large
- **Actions**: up to two inline links or buttons
- **Dismissible**: optional close button with a required accessible name

**Accessibility — the important change**

The previous version rendered a plain \`<div>\`, which meant an alert appearing after a failed form submit was completely silent for screen-reader users. That is the single most consequential thing an alert has to get right.

This version sets \`role="alert"\` / \`role="status"\` with a matching \`aria-live\`, derived from \`status\`:

| status | default urgency | behaviour |
| --- | --- | --- |
| error, warning | \`assertive\` | interrupts immediately |
| success, info, feature | \`polite\` | waits for a pause |

Override with \`urgency\`. Use **\`urgency="off"\`** for alerts that are already on screen at first paint — otherwise every page load shouts at the user.

**Other changes**
- \`style\` → **\`appearance\`** (it shadowed React's \`style\` prop).
- \`linkButton\` / \`doubleLink\` / \`dismissIcon\` were declared but never rendered anything. Replaced by a working \`actions\` array and \`dismissible\`.
- The 5-deep nested ternary that built the class list is now a \`cva\` matrix. It was hiding a real bug: the info + light cell resolved to the \`information-dark\` token instead of \`information-light-dark\`.`,
      },
    },
  },

  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['error', 'warning', 'success', 'info', 'feature'],
      description: 'Semantic status. Also picks the default icon and urgency.',
      table: { defaultValue: { summary: 'info' } },
    },
    appearance: {
      control: { type: 'select' },
      options: ['filled', 'light', 'lighter', 'stroke'],
      description: 'Visual treatment.',
      table: { defaultValue: { summary: 'filled' } },
    },
    size: {
      control: { type: 'select' },
      options: ['x-small', 'small', 'large'],
      table: { defaultValue: { summary: 'small' } },
    },
    urgency: {
      control: { type: 'select' },
      options: ['assertive', 'polite', 'off'],
      description:
        'How assistive tech announces the alert. Defaults from `status`. Use `off` for alerts present on page load.',
    },
    title: { control: 'text', description: 'Alert heading. Required.' },
    description: { control: 'text', description: 'Optional supporting copy.' },
    icon: {
      control: 'boolean',
      description: 'Show the default status glyph. Pass a node to override it.',
      table: { defaultValue: { summary: 'true' } },
    },
    dismissible: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    dismissLabel: {
      control: 'text',
      description: 'Accessible name for the close button.',
    },
    actions: { control: false, table: { type: { summary: 'AlertAction[]' } } },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Alert> = ({ title, description, ...args }) => {
  const { t } = useTranslation();
  return (
    <Alert
      {...args}
      title={typeof title === 'string' ? t(title) : title}
      description={
        typeof description === 'string' ? t(description) : description
      }
    />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  status: 'info',
  appearance: 'filled',
  size: 'small',
  title: 'alert.defaultTitle',
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  status: 'success',
  appearance: 'light',
  size: 'large',
  title: 'alert.successTitle',
  description: 'alert.successDescription',
};

// ====================== Status Variations ======================

const STATUSES = ['error', 'warning', 'success', 'info', 'feature'] as const;

export const AllStatuses = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {STATUSES.map((status) => (
        <Alert
          key={status}
          status={status}
          appearance="light"
          size="large"
          urgency="off"
          title={`${t('common.status')}: ${status}`}
          description={t('alert.defaultDescription')}
        />
      ))}
    </div>
  );
};

export const AllAppearances = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {(['filled', 'light', 'lighter', 'stroke'] as const).map((appearance) => (
        <Alert
          key={appearance}
          status="info"
          appearance={appearance}
          size="large"
          urgency="off"
          title={`${t('common.appearance')}: ${appearance}`}
          description={t('alert.defaultDescription')}
        />
      ))}
    </div>
  );
};

// ====================== Sizes ======================

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {(['x-small', 'small', 'large'] as const).map((size) => (
        <Alert
          key={size}
          status="warning"
          appearance="light"
          size={size}
          urgency="off"
          title={`${t('common.size')}: ${size}`}
        />
      ))}
    </div>
  );
};

// ====================== Actions & Dismiss ======================

export const WithActions = () => {
  const { t } = useTranslation();
  return (
    <Alert
      status="error"
      appearance="light"
      size="large"
      title={t('alert.errorTitle')}
      description={t('alert.errorDescription')}
      actions={[
        { label: t('alert.retry') },
        { label: t('alert.learnMore'), href: '#' },
      ]}
    />
  );
};

/** Dismissing is real state — the alert actually unmounts. */
export const Dismissible = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      {visible ? (
        <Alert
          status="feature"
          appearance="light"
          size="large"
          dismissible
          dismissLabel={t('alert.dismiss')}
          onDismiss={() => setVisible(false)}
          title={t('alert.infoTitle')}
          description={t('alert.infoDescription')}
        />
      ) : (
        <Button
          size="sm"
          appearance="stroke"
          color="neutral"
          onClick={() => setVisible(true)}
        >
          {t('alert.bringBack')}
        </Button>
      )}
    </div>
  );
};

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert
        status="success"
        appearance="light"
        size="large"
        urgency="off"
        title={t('alert.successTitle')}
        description={t('alert.successDescription')}
      />
      <Alert
        status="error"
        appearance="light"
        size="large"
        urgency="off"
        title={t('alert.errorTitle')}
        description={t('alert.errorDescription')}
        actions={[
          { label: t('alert.retry') },
          { label: t('alert.learnMore'), href: '#' },
        ]}
      />
      <Alert
        status="feature"
        appearance="lighter"
        size="large"
        urgency="off"
        dismissible
        dismissLabel={t('alert.dismiss')}
        title={t('alert.infoTitle')}
        description={t('alert.infoDescription')}
      />
    </div>
  );
};

export default meta;
