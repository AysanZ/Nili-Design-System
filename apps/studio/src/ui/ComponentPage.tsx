import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { NiliProvider } from '@nili/ui';
import { useStudio } from '../document/StudioContext';
import { createComponent } from '../document/factory';
import { locate } from '../document/tree';
import { isFrame } from '../document/types';
import type { PropBag } from '../document/types';
import { getComponent } from '../registry/catalogue';
import { docsI18n } from '../docs/i18n';
import { overviewPage } from '../docs/stories';
import { pickAt } from '../docs/pick';
import type { Picked } from '../docs/pick';
import { GeneratedOverview } from './GeneratedOverview';

/**
 * The component's Storybook overview, opened over the studio.
 *
 * Not a rebuild of the overview — the page itself. The module under
 * `src/components/**\/*-overview.stories.tsx` is imported and rendered as it
 * is, with the i18next instance `.storybook/i18n.ts` gives it, so the
 * divisions, the captions, the dashed Figma frames and the spacing are not
 * copied from Storybook: they *are* Storybook.
 *
 * Every attempt to reconstruct this drifted, and each time in a way the
 * registry could not have prevented. It knows `CompactButton` takes
 * `children`; only `button.docs.tsx` knows that what goes in there is an icon
 * and not the word "Label".
 *
 * Picking works by asking React what was clicked (see `docs/pick.ts`), which
 * is what lets the page stay untouched and still be a picker.
 */
export function ComponentPage(): JSX.Element | null {
  const { state, dispatch, component: active } = useStudio();
  const [hover, setHover] = useState<string | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const name = state.catalogue;

  const close = (): void => dispatch({ type: 'ui', patch: { catalogue: null } });

  useEffect(() => {
    if (!name) return;
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') dispatch({ type: 'ui', patch: { catalogue: null } });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [name, dispatch]);

  useEffect(() => {
    void docsI18n.changeLanguage(state.catalogueLocale);
  }, [state.catalogueLocale]);

  const Page = useMemo(() => (name ? overviewPage(name) : null), [name]);
  if (!name) return null;

  const entry = getComponent(name);

  const insert = (picked: Picked): void => {
    const [first] = [...state.selection];
    const located = first ? locate(active.root, first) : null;
    const parentId = located && isFrame(located.node)
      ? located.node.id
      : located?.parent?.id ?? active.root.id;
    const index = located && !isFrame(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER;
    dispatch({
      type: 'insert',
      parentId,
      index,
      nodes: [createComponent(picked.component, picked.props as PropBag)],
    });
    close();
  };

  /* One handler for the whole page rather than one per cell, because the page
     has no cells to attach to — it is the library's own markup. */
  const onClick = (event: MouseEvent): void => {
    const picked = pickAt(event.target as Element);
    if (!picked) return;
    event.preventDefault();
    event.stopPropagation();
    insert(picked);
  };

  const onMove = (event: MouseEvent): void => {
    const picked = pickAt(event.target as Element);
    setHover(picked ? describe(picked) : null);
  };

  return (
    <div className="sheet" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <div className="sheet__box" role="dialog" aria-modal="true" aria-label={`${name} overview`}>
        <header className="sheet__head">
          <div className="sheet__title">
            <strong>{name}</strong>
            <em>{entry.category} · {Object.keys(entry.meta.props).length} props</em>
          </div>

          {/* Dark first: a component's dark appearance is half of what it
              looks like, and the light one is a click away. */}
          <div className="sheet__switch" role="radiogroup" aria-label="Theme">
            {(['dark', 'light'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                role="radio"
                aria-checked={state.catalogueTheme === theme}
                onClick={() => dispatch({ type: 'ui', patch: { catalogueTheme: theme } })}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* The FA frame is the same page under `dir="rtl"`, exactly as the
              Storybook toolbar does it. */}
          <div className="sheet__switch" role="radiogroup" aria-label="Language">
            {(['en', 'fa'] as const).map((code) => (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={state.catalogueLocale === code}
                onClick={() => dispatch({ type: 'ui', patch: { catalogueLocale: code } })}
              >
                {code}
              </button>
            ))}
          </div>

          <button type="button" className="sheet__x" aria-label="Close" onClick={close}>×</button>
        </header>

        <div
          className="sheet__body"
          ref={surface}
          role="presentation"
          onClickCapture={onClick}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <I18nextProvider i18n={docsI18n}>
            <NiliProvider
              attributeTarget="self"
              theme={state.catalogueTheme}
              locale={state.catalogueLocale}
              dir={state.catalogueLocale === 'fa' ? 'rtl' : 'ltr'}
            >
              <div className="sheet__surface">
                {Page ? (
                  <Suspense fallback={<p className="sheet__loading">Loading the overview…</p>}>
                    <Page />
                  </Suspense>
                ) : (
                  /* Six components have no overview story in the library.
                     Rather than an empty sheet, the studio draws the matrix it
                     can read off the registry and says which it is. */
                  <GeneratedOverview component={name} />
                )}
              </div>
            </NiliProvider>
          </I18nextProvider>
        </div>

        <footer className="sheet__foot">
          <span>
            {hover ? <>Click to insert <code>{hover}</code></> : 'Click any component on this page to put it on the canvas.'}
          </span>
          {Page ? null : <em>The library has no overview story for this one — this is read from its variants.</em>}
        </footer>
      </div>
    </div>
  );
}

/** `Button color="error" appearance="stroke"`, for the footer. */
function describe(picked: Picked): string {
  const parts = Object.entries(picked.props)
    .filter(([, value]) => typeof value === 'string' || typeof value === 'number' || value === true)
    .slice(0, 4)
    .map(([key, value]) => (value === true ? key : `${key}=${String(value)}`));
  return parts.length ? `${picked.component} ${parts.join(' ')}` : picked.component;
}
