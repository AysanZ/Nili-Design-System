import type { Meta, StoryFn } from '@storybook/react';
import { CardProvider } from '.';
import { CARD_PROVIDER_IDS, CARD_PROVIDER_VARIANTS } from './card-provider.data';
import { CARD_PROVIDER_SIZES } from './card-provider.styles';
import { AcceptedCardsRow, CardProviderTable } from './card-provider.docs';

const meta: Meta<typeof CardProvider> = {
  title: 'Assets/Card Providers/Card Provider',
  component: CardProvider,
  parameters: {
    docs: {
      description: {
        component: `A payment-scheme mark — ${CARD_PROVIDER_IDS.length} schemes in three treatments.

**Served, not inlined**

The artwork lives in \`public/card-providers/<variant>/<id>.svg\` and renders as an \`<img>\`. A checkout page should not carry ~240 KB of inlined logo paths to draw five logos. Call \`setAssetBasePath()\` once at startup if the files are not at the web root.

**This component carries other people's trademarks**

Two consequences are built in rather than written down somewhere nobody reads.

The artwork is fixed: an \`<img>\` cannot inherit \`currentColor\`, so there is no way to tint a scheme mark by accident — which every one of these brand programmes forbids. The three variants are the three treatments the schemes publish themselves, so pick one instead of styling your way to it.

And the mark is labelled by default. A row of accepted cards *is* content: a screen reader that skips it leaves the user not knowing whether their card works. Pass \`label=""\` only when the scheme name is already written next to it.

The SVG files are Apache-2.0 ([svg-credit-card-payment-icons](https://github.com/aaronfagan/svg-credit-card-payment-icons)). That licence covers the files, not the trademarks — follow each scheme's rules on minimum size and clear space.`,
      },
    },
  },
  argTypes: {
    provider: {
      control: { type: 'select' },
      options: CARD_PROVIDER_IDS,
      description: 'Unknown ids fall back to `generic`.',
    },
    variant: {
      control: { type: 'inline-radio' },
      options: CARD_PROVIDER_VARIANTS,
      table: { defaultValue: { summary: 'original' } },
    },
    size: {
      control: { type: 'select' },
      options: CARD_PROVIDER_SIZES,
      table: { defaultValue: { summary: 'md' } },
    },
    framed: {
      control: 'boolean',
      description: 'Draw the mark on its own white chip with a hairline.',
    },
    label: { control: 'text', description: 'Defaults to the scheme name.' },
  },
};
export default meta;

const Template: StoryFn<typeof CardProvider> = (args) => (
  <CardProvider {...args} />
);

export const Default = Template.bind({});
Default.args = { provider: 'visa', size: 'xl' };

/** Every scheme, full colour. */
export const AllProviders = () => (
  <div className="flex flex-wrap gap-3">
    {CARD_PROVIDER_IDS.map((id) => (
      <CardProvider key={id} provider={id} size="xl" />
    ))}
  </div>
);

/** The three published treatments. */
export const Variants = () => (
  <div className="flex flex-col gap-4">
    {CARD_PROVIDER_VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-wrap items-center gap-3">
        {(['visa', 'mastercard', 'amex', 'paypal'] as const).map((id) => (
          <CardProvider
            key={id}
            provider={id}
            variant={variant}
            size="xl"
            label=""
          />
        ))}
      </div>
    ))}
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-end gap-4">
    {CARD_PROVIDER_SIZES.map((size) => (
      <CardProvider key={size} provider="mastercard" size={size} label="" />
    ))}
  </div>
);

/** An unknown scheme is the generic card, not a gap in the row. */
export const UnknownProvider = () => (
  <div className="flex items-center gap-3">
    <CardProvider provider="not-a-real-scheme" size="xl" />
    <CardProvider provider="visa" size="xl" />
  </div>
);

/** What this is actually for. */
export const AcceptedCards = () => <AcceptedCardsRow />;

export const Catalogue = () => <CardProviderTable />;
