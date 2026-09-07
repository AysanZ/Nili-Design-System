import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiMailLine,
  RiSearchLine,
  RiEyeOffLine,
  RiBankCardLine,
  RiCalendarLine,
} from '@remixicon/react';
import { TextInput, InputSelect } from '.';
import { Icon } from '@components/icon';
import { CompactButton, Button } from '@components/button';

const meta: Meta<typeof TextInput> = {
  title: 'Base Components/Text Input/Text Input',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component: `The **Text Input**, from the Figma "❖ Text Input" page: three sizes, leading and trailing slots, and the full field — label, box and message.

**Key Features:**
- **3 Sizes** (md 40 · sm 36 · xs 32), matching Dropdown
- **4 slots**: \`startIcon\` / \`endIcon\` inside the box, \`startAffix\` / \`endAffix\` attached to it
- **\`error\`** drives both the styling and the message
- **\`latin\`** pins the field LTR for emails, URLs, IBANs

**State is not a prop.** Figma models Default · Hover · Focus · Filled · Disabled · Error. Hover, focus and disabled are CSS states; "Filled" is whether the field has a value, which the input already knows. Only \`invalid\` cannot be worked out from the DOM — and even that is not a prop here, because \`error\` implies it.

**Why the whole field.** The parts each app skips when it assembles its own are the ones that matter: \`htmlFor\`, \`aria-describedby\`, \`aria-invalid\`, and \`role="alert"\` on the message so a validation error that appears after submit is announced. That last one is the most common accessibility bug in forms, and it belongs to the *field*, not the input.

**Adornments are slots, not an enum.** Figma's Leading/Trailing = Icon | Text | None cannot express "an icon on one side and a unit on the other". Four slots can.

**\`latin\` is a Persian problem, not a nicety.** Email addresses, URLs, IBANs and card numbers are Latin even in a Persian UI. Rendered RTL, a URL's slashes and dots migrate to the wrong end: the value stays correct in the DOM and becomes unreadable on screen. Switch the Locale toolbar to فارسی and compare the two fields in **Latin Values**.`,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'basic',
        'email',
        'phone',
        'card',
        'website',
        'amount',
        'date',
        'search',
        'password',
        'button',
        'dropdown',
        'emoji',
      ],
      table: { defaultValue: { summary: 'basic' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['md', 'sm', 'xs'],
      table: { defaultValue: { summary: 'md' } },
    },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    latin: { control: 'boolean' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
};

const Template: StoryFn<typeof TextInput> = (args) => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <TextInput
        {...args}
        label={args.label ?? t('textInput.email')}
        placeholder={args.placeholder ?? t('textInput.emailPlaceholder')}
      />
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

export const WithHint = Template.bind({});
WithHint.args = { hint: 'We will never share it' };

export const WithError = Template.bind({});
WithError.args = { error: 'Enter a valid email address' };

export const Required = Template.bind({});
Required.args = { required: true };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, hint: 'Contact support to change this' };

// ====================== Sizes ======================

export const AllSizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-4">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <TextInput
          key={size}
          size={size}
          label={`${t('textInput.email')} — ${size}`}
          placeholder={t('textInput.emailPlaceholder')}
        />
      ))}
    </div>
  );
};

// ====================== Slots ======================

/** Two inside the box, two attached to it — and they combine freely. */
export const Adornments = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-4">
      <TextInput
        label={t('textInput.email')}
        placeholder={t('textInput.emailPlaceholder')}
        startIcon={<Icon icon={RiMailLine} />}
      />
      <TextInput
        label={t('textInput.search')}
        placeholder={t('textInput.searchPlaceholder')}
        startIcon={<Icon icon={RiSearchLine} />}
      />
      <TextInput
        label={t('textInput.password')}
        type="password"
        defaultValue="hunter2"
        endIcon={
          <CompactButton
            appearance="ghost"
            size="md"
            aria-label="Show password"
          >
            <Icon icon={RiEyeOffLine} />
          </CompactButton>
        }
      />
      <TextInput
        label={t('textInput.website')}
        startAffix="https://"
        endAffix=".com"
        latin
      />
      <TextInput
        label={t('textInput.amount')}
        endAffix={t('textInput.currency')}
        inputMode="numeric"
      />
    </div>
  );
};

// ====================== RTL ======================

/**
 * The point of `latin`. In Persian the top field reverses and becomes
 * unreadable; the bottom one stays as written.
 */
export const LatinValues = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-4">
      <TextInput
        label={`${t('textInput.website')} — latin={false}`}
        defaultValue="https://nili.design/docs?v=1"
      />
      <TextInput
        label={`${t('textInput.website')} — latin`}
        defaultValue="https://nili.design/docs?v=1"
        latin
      />
      <TextInput
        label={t('textInput.iban')}
        defaultValue="IR12 0170 0000 0012 3456 7890 01"
        latin
      />
    </div>
  );
};

// ====================== Type ======================

/**
 * Figma's `🧩 Type`, all twelve values.
 *
 * The variant is a **preset**, not a paint job. Each one carries the keyboard a
 * phone will show, the autofill bucket the browser will use, and whether the
 * value is Latin regardless of the surrounding script — the details that are
 * tedious to remember on every field and therefore usually wrong.
 *
 * Switch the Locale toolbar to Persian: the email, phone, card, website, amount
 * and date fields stay left-to-right, because those values are Latin even in a
 * Persian UI. Rendered RTL their slashes and dots migrate to the wrong end and
 * the value becomes unreadable while staying correct in the DOM.
 */
export const AllTypes = () => {
  const { t } = useTranslation();

  // Every field on the Figma page carries the same four label parts and the
  // same hint, so they are pulled out rather than repeated twelve times.
  const label = {
    sublabel: t('textInput.optional'),
    information: true as const,
    informationLabel: t('textInput.info'),
    required: true,
    hint: t('textInput.hintFigma'),
  };

  return (
    <div className="grid w-[760px] grid-cols-2 gap-5">
      {/* 📂 Basic */}
      <TextInput
        {...label}
        type="basic"
        label={t('textInput.basicLabel')}
        placeholder={t('textInput.basicPlaceholder')}
      />

      {/* 💌 Email */}
      <TextInput
        {...label}
        type="email"
        label={t('textInput.emailLabel')}
        placeholder="hello@husan.ir"
        startIcon={<Icon icon={RiMailLine} />}
      />

      {/* 📞 Phone — the country code sits *before* the number, inside the field. */}
      <TextInput
        {...label}
        type="phone"
        label={t('textInput.phoneLabel')}
        placeholder={t('textInput.phonePlaceholder')}
        select={
          <InputSelect
            icon={<span>🇺🇸</span>}
            aria-label={t('textInput.phoneCodeLabel')}
          >
            {t('textInput.phoneCode')}
          </InputSelect>
        }
      />

      {/* 💳 Card */}
      <TextInput
        {...label}
        type="card"
        label={t('textInput.cardLabel')}
        placeholder={t('textInput.cardPlaceholder')}
        cardProvider={<Icon icon={RiBankCardLine} />}
      />

      {/* 🌐 Website — `https://` is a bordered block beside the value. */}
      <TextInput
        {...label}
        type="website"
        label={t('textInput.websiteLabel')}
        startAffix="https://"
        placeholder={t('textInput.websitePlaceholder')}
      />

      {/* 💰 Amount — currency mark inside, currency picker attached after. */}
      <TextInput
        {...label}
        type="amount"
        label={t('textInput.amountLabel')}
        prefix={t('textInput.amountSymbol')}
        placeholder={t('textInput.amountPlaceholder')}
        select={
          <InputSelect
            icon={<span>🇪🇺</span>}
            aria-label={t('textInput.amountCurrencyLabel')}
          >
            {t('textInput.amountCurrency')}
          </InputSelect>
        }
      />

      {/* 📅 Date */}
      <TextInput
        {...label}
        type="date"
        label={t('textInput.dateLabel')}
        placeholder={t('textInput.datePlaceholder')}
        endIcon={<Icon icon={RiCalendarLine} />}
      />

      {/* 🔍 Search */}
      <TextInput
        {...label}
        type="search"
        label={t('textInput.searchLabel')}
        placeholder={t('textInput.searchFigmaPlaceholder')}
        startIcon={<Icon icon={RiSearchLine} />}
        shortcut="⌘1"
      />

      {/* 🔒 Password */}
      <TextInput
        {...label}
        type="password"
        label={t('textInput.passwordLabel')}
        defaultValue="hunter2hunter2"
        endIcon={
          <CompactButton
            appearance="ghost"
            size="md"
            aria-label={t('textInput.passwordLabel')}
          >
            <Icon icon={RiEyeOffLine} />
          </CompactButton>
        }
      />

      {/* 🔘 Button — Figma's "Share Link". */}
      <TextInput
        {...label}
        type="button"
        label={t('textInput.shareLabel')}
        defaultValue={t('textInput.websitePlaceholder')}
        button={
          <Button size="2xs" appearance="ghost">
            {t('textInput.copy')}
          </Button>
        }
      />

      {/* 🔽 Dropdown — Figma's "Invite Members"; the picker sits after the value. */}
      <TextInput
        {...label}
        type="dropdown"
        label={t('textInput.inviteLabel')}
        placeholder={t('textInput.basicPlaceholder')}
        select={
          <InputSelect aria-label={t('textInput.inviteRoleLabel')}>
            {t('textInput.inviteRole')}
          </InputSelect>
        }
      />

      {/* 🙂 Emoji */}
      <TextInput
        {...label}
        type="emoji"
        label={t('textInput.emojiLabel')}
        placeholder={t('textInput.emojiPlaceholder')}
        emojiPicker={<span aria-hidden>🙂</span>}
      />
    </div>
  );
};

/**
 * Figma's `Label [1.0]` has four optional parts, and the Text Input page draws
 * all of them on every field: the required asterisk, the muted `(Optional)`
 * sublabel, the information glyph, and a trailing Link Button.
 *
 * The asterisk and the sublabel are both `aria-hidden`. Requiredness is carried
 * by the input's own `required` attribute; announcing "Email Address star
 * optional" says the same thing three times, twice contradictorily.
 */
export const LabelParts = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-5">
      <TextInput
        label={t('textInput.basicLabel')}
        placeholder={t('textInput.basicPlaceholder')}
      />
      <TextInput
        label={t('textInput.basicLabel')}
        required
        placeholder={t('textInput.basicPlaceholder')}
      />
      <TextInput
        label={t('textInput.basicLabel')}
        required
        sublabel={t('textInput.optional')}
        placeholder={t('textInput.basicPlaceholder')}
      />
      <TextInput
        label={t('textInput.basicLabel')}
        required
        sublabel={t('textInput.optional')}
        information
        informationLabel={t('textInput.info')}
        placeholder={t('textInput.basicPlaceholder')}
        hint={t('textInput.hintFigma')}
      />
    </div>
  );
};

// ====================== State ======================

/**
 * Figma's `📌 State`: Placeholder · Hover · Focus · Filled · Disabled · Error.
 *
 * Only two of the six are props. Hover and focus are CSS states — a
 * `state="focus"` prop makes a field that looks focused and is not — and
 * "Filled" is whether the input has a value, which it already knows. `Error`
 * is not a prop either: passing `error` is what marks the field invalid, so a
 * red border with no message cannot happen.
 *
 * Hover and focus are shown here so the page still covers all six; use the
 * pointer and the Tab key.
 */
export const AllStates = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-5">
      <TextInput
        label="Placeholder"
        placeholder={t('textInput.emailPlaceholder')}
      />
      <TextInput label="Filled" defaultValue="hello@husan.ir" type="email" />
      <TextInput label="Disabled" defaultValue="hello@husan.ir" disabled />
      <TextInput
        label="Error"
        defaultValue="hello@"
        error="Enter a valid email address"
      />
    </div>
  );
};

// ====================== Type × Size ======================

/** The two axes that are genuinely independent, crossed. */
export const TypeSizeMatrix = () => (
  <div className="grid w-[720px] grid-cols-3 gap-5">
    {(['md', 'sm', 'xs'] as const).map((size) =>
      (['email', 'search', 'amount'] as const).map((type) => (
        <TextInput
          key={`${type}-${size}`}
          type={type}
          size={size}
          label={`${type} · ${size}`}
          placeholder="…"
        />
      )),
    )}
  </div>
);

export default meta;
