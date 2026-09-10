import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Switch } from '.';
import { Badge } from '@components/badge';
import { LinkButton } from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { SwitchToggleItemsSet } from './switch.docs';

const meta: Meta<typeof Switch> = {
  title: 'Base Components/Switch Toggle/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `The on/off control, from the Figma **"❖ Toggle"** page (\`Toggle [1.0]\` + \`Toggle Label [1.0]\`): two sizes, with or without a label, a description and a flip.

> **Naming.** Figma calls this *Toggle*; the code export is \`<Switch>\` and always has been, so the export name is unchanged. Figma's *Switch Toggle* — the segmented control — is a different component, filed under **Base Components → Switch Toggle**.

| Figma property | Prop |
| --- | --- |
| 🟢 Active | \`checked\` / \`defaultChecked\` |
| 📌 State (Default · Hover · Pressed · Disabled) | CSS state + native \`disabled\` |
| 🔄 Flip | \`labelPosition\` (\`start\` · \`end\`) |
| ✏️ Edit Label / Sublabel / Description | \`label\` · \`sublabel\` · \`description\` |
| 💬 Sublabel · 🎖️ Badge · 🔗 Link Button · 📝 Description | \`sublabel\` · \`badge\` · \`linkButton\` · \`description\` (omit to hide) |

**Key Features:**
- A real \`<input type="checkbox">\` carrying \`role="switch"\`
- **2 Sizes** (sm · md)
- **\`onCheckedChange\`** gives you the boolean; \`onInputChange\` still gives you the event
- **\`labelPosition\`** is Figma's "Flip", expressed logically

**Why a checkbox and not a button.** \`role="switch"\` on a checkbox keeps form participation, \`:checked\` in CSS, Space to toggle and the label association, and changes only the announcement — "on" instead of "checked". A \`<button aria-pressed>\` gives up the form and has to rebuild the rest by hand.

**Switch or checkbox?** A switch takes effect *immediately*; a checkbox states an intention that a submit button later applies. A switch inside a form with a Save button is the most common misuse of this control — the user flips it, walks away, and nothing happened. If there is a Save button, it is a checkbox.

**No internal state.** The native input already handles uncontrolled use through \`defaultChecked\`, so there is nothing to mirror into React state — which is exactly the bug \`useControllableState\` exists to prevent elsewhere in this system.

**RTL**

\`translate-x\` is physical, so the knob's travel is mirrored under \`rtl:\` — an unmirrored knob slides *out of* its track in Persian. Switch the Locale toolbar to فارسی and toggle it.`,
      },
    },
  },
  argTypes: {
    labelPosition: {
      control: { type: 'inline-radio' },
      options: ['start', 'end'],
      table: { defaultValue: { summary: 'end' } },
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    onCheckedChange: { action: 'toggled' },
  },
};

const Template: StoryFn<typeof Switch> = (args) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(Boolean(args.checked));
  return (
    <Switch
      {...args}
      checked={checked}
      onCheckedChange={setChecked}
      label={args.label ?? t('switch.notifications')}
    />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { checked: true };

export const WithDescription = Template.bind({});
WithDescription.args = {
  checked: true,
  description: 'Sent once a day at most',
};

export const Disabled = Template.bind({});
Disabled.args = { checked: true, disabled: true };

/** No label at all — name it yourself, an unlabelled switch is unusable. */
export const ControlOnly = () => {
  const { t } = useTranslation();
  return <Switch aria-label={t('switch.autoSave')} defaultChecked />;
};

// ====================== Label anatomy ======================

/**
 * Figma's `Toggle Label` carries six things, not two: Label, Sublabel,
 * Description, Badge, Link Button and Flip. They all come from the shared
 * `ControlLabel` primitive, which Checkbox and Radio use as well.
 */
export const LabelAnatomy = () => {
  const { t } = useTranslation();
  return (
    <div className="flex max-w-sm flex-col gap-5">
      <Switch defaultChecked label={t('switch.darkMode')} />
      <Switch
        defaultChecked
        label={t('switch.darkMode')}
        sublabel="(beta)"
        description={t('switch.autoSave')}
      />
      <Switch
        defaultChecked
        label={t('switch.darkMode')}
        badge={
          <Badge appearance="light" color="green" size="small">
            New
          </Badge>
        }
        description={t('switch.autoSave')}
        linkButton={
          <LinkButton href="#" color="primary" size="sm" underline>
            Learn more
          </LinkButton>
        }
      />
    </div>
  );
};

// ====================== Flip ======================

/** Figma's "Flip". Logical, so `start` is the right in Persian. */
export const LabelPosition = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-4">
      {(['end', 'start'] as const).map((labelPosition) => (
        <Switch
          key={labelPosition}
          labelPosition={labelPosition}
          defaultChecked
          label={t('switch.publicProfile')}
          rootClassName="w-full"
        />
      ))}
    </div>
  );
};

// ====================== In context ======================

/** A settings list — where a switch belongs, because each row applies at once. */
export const SettingsList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-96 flex-col divide-y divide-soft-200 rounded-xl border border-soft-200 bg-white-0">
      {[
        ['notifications', 'notificationsDescription', true],
        ['twoFactor', 'twoFactorDescription', false],
      ].map(([label, description, checked]) => (
        <div key={label as string} className="p-4">
          <Switch
            defaultChecked={checked as boolean}
            labelPosition="start"
            label={t(`switch.${label as string}`)}
            description={t(`switch.${description as string}`)}
            rootClassName="w-full"
          />
        </div>
      ))}
    </div>
  );
};

// ====================== Figma component sets ======================

export const SwitchToggleItemsSetStory = () => (
  <FigmaFrame>
    <SwitchToggleItemsSet />
  </FigmaFrame>
);
SwitchToggleItemsSetStory.storyName = 'Switch Toggle Items';
SwitchToggleItemsSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
