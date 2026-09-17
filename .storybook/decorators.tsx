import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/i18n';
import { DirectionProvider } from '../src/providers/direction';
import { updateHtmlLang, updateHtmlTheme } from './langUtils';
import type { Decorator } from '@storybook/react';
import '@styles/globals.css';

interface GlobalSettingsProps {
  locale: string;
  theme: 'light' | 'dark';
  children: React.ReactNode;
}

/**
 * A real component, not work done in the decorator body.
 *
 * Storybook calls a decorator *during* the story's render pass. Calling
 * `i18n.changeLanguage()` there pushes a state update into every subscribed
 * `useTranslation()` component mid-render, which is what produced:
 *
 *   Warning: Cannot update a component (`Unknown`) while rendering a
 *   different component (`unboundStoryFn`).
 *
 * React discards updates scheduled that way, so the story could be left
 * showing the previous globals — the toolbar moves and nothing repaints.
 * Side effects belong in an effect, on a component React actually mounts.
 */
function GlobalSettings({ locale, theme, children }: GlobalSettingsProps) {
  useEffect(() => {
    i18n.changeLanguage(locale);
    updateHtmlLang(locale);
  }, [locale]);

  useEffect(() => {
    updateHtmlTheme(theme);
    document.body.className =
      theme === 'dark' ? 'storybook-dark' : 'storybook-light';
  }, [theme]);

  return (
    <I18nextProvider i18n={i18n}>
      {/*
        DirectionProvider, not just a `dir` attribute. The attribute alone
        flips every CSS logical property but leaves `useDirection()` reporting
        the default 'ltr', so any component doing pointer maths in JS disagreed
        with its own layout — that is what made the Persian slider run
        backwards. `attributeTarget="document"` because the wrapper below
        already carries `lang`/`dir` itself and a second nested div would only
        add a layout box.

        data-theme, lang and dir are set here during render as well as on
        <html> in the effects above. The wrapper is what actually guarantees
        correctness: on a Docs page every story shares one document, so the
        last one to render would otherwise win, and lang drives the font stack
        (Vazirmatn vs Inter) so it has to wrap the content.
      */}
      <DirectionProvider locale={locale} attributeTarget="document">
        <div
          data-theme={theme}
          lang={locale}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          className={theme === 'dark' ? 'storybook-dark' : 'storybook-light'}
        >
          {children}
        </div>
      </DirectionProvider>
    </I18nextProvider>
  );
}

export const withGlobalSettings: Decorator = (Story, context) => (
  <GlobalSettings
    locale={(context.globals.locale as string) || 'en'}
    theme={(context.globals.theme as 'light' | 'dark') || 'light'}
  >
    <Story />
  </GlobalSettings>
);
