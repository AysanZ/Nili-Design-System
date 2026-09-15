import { useRef } from 'react';
import { Btn, Diamond, Glyph, ICON, IconBtn, MenuItem, Popover, Segmented } from './controls';
import { useStudio, type View } from '../core/store';
import { useT } from '../i18n';
import { starter } from '../core/starter';
import type { Doc } from '../core/model';

export function Topbar(): JSX.Element {
  const { state, dispatch, component } = useStudio();
  const t = useT();
  const file = useRef<HTMLInputElement>(null);

  const rename = (name: string): void => {
    const clean = name.replace(/[^A-Za-z0-9]/g, '');
    if (clean) dispatch({ type: 'component.patch', patch: { name: clean } });
  };

  const download = (): void => {
    const blob = new Blob([JSON.stringify(state.doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nili-studio.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const read = (input: HTMLInputElement): void => {
    const chosen = input.files?.[0];
    if (!chosen) return;
    void chosen.text().then((text) => {
      try {
        const doc = JSON.parse(text) as Doc;
        if (doc.version === 2 && doc.components?.length) dispatch({ type: 'doc.replace', doc });
      } catch {
        /* an unreadable file is not worth a dialog; the document is untouched */
      }
      input.value = '';
    });
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <span className="mark" aria-hidden="true">
          <Diamond on />
        </span>
        <Popover
          width={240}
          align="start"
          trigger={() => (
            <span className="switcher">
              {component.name}
              <span className="switcher__count">{state.doc.components.length}</span>
            </span>
          )}
        >
          {(close) => (
            <>
              {state.doc.components.map((item) => (
                <MenuItem
                  key={item.id}
                  active={item.id === component.id}
                  onClick={() => {
                    dispatch({ type: 'component.select', id: item.id });
                    close();
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
              <div className="menu__rule" />
              <MenuItem
                onClick={() => {
                  const name = window.prompt(t('New component'), 'NewComponent');
                  if (name) dispatch({ type: 'component.add', name: name.replace(/[^A-Za-z0-9]/g, '') || 'NewComponent' });
                  close();
                }}
              >
                {t('New component')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const name = window.prompt(t('Rename'), component.name);
                  if (name) rename(name);
                  close();
                }}
              >
                {t('Rename')}
              </MenuItem>
              {state.doc.components.length > 1 ? (
                <MenuItem
                  onClick={() => {
                    dispatch({ type: 'component.remove', id: component.id });
                    close();
                  }}
                >
                  {t('Delete component')}
                </MenuItem>
              ) : null}
            </>
          )}
        </Popover>
      </div>

      <Segmented<View>
        value={state.ui.view}
        onChange={(view) => dispatch({ type: 'ui', patch: { view } })}
        options={[
          { value: 'design', label: t('Design') },
          { value: 'variants', label: t('Variants') },
          { value: 'code', label: t('Code') },
        ]}
      />

      <div className="topbar__right">
        <IconBtn label={t('Undo')} disabled={!state.past.length} onClick={() => dispatch({ type: 'undo' })}>
          <Glyph d={ICON.undo} />
        </IconBtn>
        <IconBtn label={t('Redo')} disabled={!state.future.length} onClick={() => dispatch({ type: 'redo' })}>
          <Glyph d={ICON.redo} />
        </IconBtn>
        <span className="topbar__rule" />
        <Segmented
          value={state.ui.lang}
          onChange={(lang) => dispatch({ type: 'ui', patch: { lang } })}
          options={[
            { value: 'fa' as const, label: 'فا' },
            { value: 'en' as const, label: 'EN' },
          ]}
        />
        <Popover
          width={200}
          trigger={() => <Glyph d={ICON.gear} />}
        >
          {(close) => (
            <>
              <MenuItem
                onClick={() => {
                  dispatch({
                    type: 'ui',
                    patch: { chrome: state.ui.chrome === 'dark' ? 'light' : 'dark' },
                  });
                  close();
                }}
              >
                {t('Theme')}: {state.ui.chrome === 'dark' ? t('Dark') : t('Light')}
              </MenuItem>
              <div className="menu__rule" />
              <MenuItem onClick={() => { download(); close(); }}>{t('Export')} JSON</MenuItem>
              <MenuItem onClick={() => { file.current?.click(); close(); }}>{t('Import')} JSON</MenuItem>
              <div className="menu__rule" />
              <MenuItem
                onClick={() => {
                  dispatch({ type: 'doc.replace', doc: starter() });
                  close();
                }}
              >
                {t('Reset')}
              </MenuItem>
            </>
          )}
        </Popover>
        <Btn variant="solid" onClick={() => dispatch({ type: 'ui', patch: { view: 'code' } })}>
          <Glyph d={ICON.code} size={13} />
          {t('Code')}
        </Btn>
        <input
          ref={file}
          type="file"
          accept="application/json"
          hidden
          onChange={(event) => read(event.currentTarget)}
        />
      </div>
    </header>
  );
}
