import type { Preview } from '@storybook/react';
import { withGlobalSettings } from './decorators';
import { GLOBALS } from './globals';
import '@styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /**
     * The Backgrounds toolbar is off on purpose.
     *
     * It paints the preview canvas from a fixed palette, which fights the
     * token layer: the Theme toolbar already repaints the canvas from
     * `--wal-white-0`, and whichever paints last wins. Two controls claiming
     * the same surface is how you end up thinking neither works.
     *
     * Use the Theme toolbar. To preview an arbitrary page colour, wrap the
     * story instead of tinting the canvas.
     */
    backgrounds: { disable: true },
    /**
     * Figma order inside the Buttons page: the Overview frame first, then its
     * component sets in the order the frame draws them.
     *
     * The `'*'` matters. Naming `'Buttons'` directly would hoist it to the top
     * of Base Components; with the wildcard, siblings compare as unlisted and
     * keep their normal order, and only the children below get re-ordered.
     */
    options: {
      storySort: {
        order: [
          'Base Components',
          [
            '*',
            [
              'Overview',
              'Buttons',
              'Link Buttons',
              'Fancy Buttons',
              'Compact Button',
            ],
          ],
        ],
      },
    },
  },
  /**
   * `initialGlobals`, not `globals`.
   *
   * Storybook 8.3 renamed this key and dropped `globalTypes[].defaultValue`.
   * The preview API reads `projectAnnotations.initialGlobals`, so with the old
   * spelling `context.globals.theme` never received a starting value — the
   * toolbar rendered, the decorator read `undefined`, and dark mode did
   * nothing at all.
   */
  initialGlobals: {
    locale: 'en',
    theme: 'light',
  },
  globalTypes: GLOBALS,
  tags: ['autodocs'],
  decorators: [withGlobalSettings],
};

export default preview;
