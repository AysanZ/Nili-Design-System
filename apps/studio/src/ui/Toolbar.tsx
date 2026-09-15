import { useRef, useState } from 'react';
import { useStudio } from '../document/StudioContext';
import { clear, fromJson, save, toJson } from '../document/persist';
import { download, projectFiles, zip } from '../codegen/project';
import { CodeIcon, MoonIcon, RedoIcon, SearchIcon, SunIcon, UndoIcon } from './icons';
import { Menu } from './Menu';
import { format } from './shortcuts';

/**
 * What the toolbar is for: the document, and undoing what you did to it.
 *
 * Everything that was about the *canvas* has moved to the canvas (zoom, the
 * language, the canvas theme) and everything about the *component* has moved
 * to the right panel (Design/Preview is now the Play tab). What is left is
 * genuinely application-level, and it fits.
 */
export function Toolbar(): JSX.Element {
  const { state, dispatch, canUndo, canRedo, findings, component } = useStudio();
  const errors = findings.filter((finding) => finding.severity === 'error').length;
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  /* The Code drawer is for reading one file. This is for taking all of them —
     copying five components, a runtime and a stylesheet tab by tab is the
     chore that makes people stop trusting the output. */
  const exportProject = (): void => {
    setBusy(true);
    const files = projectFiles({
      components: state.components,
      theme: state.theme,
      locales: state.locales,
      findings,
      assets: state.assets,
    });
    download('nili-project.zip', zip(files));
    window.setTimeout(() => setBusy(false), 600);
  };

  const importDocument = async (file: File): Promise<void> => {
    const loaded = fromJson(await file.text());
    if (!loaded) {
      window.alert('That file is not a Nili document.');
      return;
    }
    dispatch({ type: 'loadDocument', state: loaded.state });
  };

  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__mark" aria-hidden>N</span>
        <span className="toolbar__file">
          <strong>{component.name}</strong>
          <em>
            {state.components.length} component{state.components.length === 1 ? '' : 's'}
            {/* Autosave is invisible by nature, so it has to say so — otherwise
                the only way to find out whether work survives is to reload. */}
            <span className={`toolbar__saved${state.savedAt ? '' : ' is-pending'}`}>
              {state.savedAt ? 'saved' : 'not saved yet'}
            </span>
          </em>
        </span>
      </div>

      <div className="toolbar__cluster">
        <button
          type="button"
          aria-label="Undo"
          title={`Undo · ${format('mod+z')}`}
          disabled={!canUndo}
          onClick={() => dispatch({ type: 'undo' })}
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title={`Redo · ${format('mod+shift+z')}`}
          disabled={!canRedo}
          onClick={() => dispatch({ type: 'redo' })}
        >
          <RedoIcon />
        </button>
      </div>

      <div className="toolbar__spacer" />

      <button
        type="button"
        className="toolbar__search"
        title="Insert a component, or run a command"
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
      >
        <SearchIcon />
        <span>Search</span>
        <kbd>{format('mod+k')}</kbd>
      </button>

      <button
        type="button"
        className="toolbar__ghost"
        title={`Interface: ${state.uiScheme}. Click for ${state.uiScheme === 'dark' ? 'light' : 'dark'}.`}
        aria-label="Toggle interface theme"
        onClick={() => dispatch({ type: 'ui', patch: { uiScheme: state.uiScheme === 'dark' ? 'light' : 'dark' } })}
      >
        {state.uiScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <Menu
        label="File"
        items={[
          {
            id: 'open',
            label: 'Open…',
            hint: 'a nili.document.json',
            onSelect: () => fileInput.current?.click(),
          },
          {
            id: 'save',
            label: 'Save a copy',
            hint: 'one file you can keep or share',
            onSelect: () =>
              download('nili.document.json', new Blob([toJson(state)], { type: 'application/json' })),
          },
          'separator',
          {
            id: 'export',
            label: busy ? 'Exporting…' : 'Export code',
            hint: 'every generated file, as a folder',
            disabled: busy,
            onSelect: exportProject,
          },
          {
            id: 'run',
            label: 'Run in a tab',
            hint: 'the components, as a running app',
            onSelect: () => {
              // The app tab reads the autosaved document, so it has to be
              // saved first — otherwise Run shows the last version, not this.
              save(state);
              window.open(`${window.location.pathname}?app=1`, '_blank', 'noopener');
            },
          },
          'separator',
          {
            id: 'reset',
            label: 'Start a new document',
            danger: true,
            onSelect: () => {
              if (!window.confirm('Replace this document with the starting one? This cannot be undone.')) return;
              clear();
              window.location.reload();
            },
          },
        ]}
      />

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void importDocument(file);
          event.target.value = '';
        }}
      />

      <button
        type="button"
        className="toolbar__primary"
        aria-pressed={state.codeOpen}
        title="The generated file for this component"
        onClick={() => dispatch({ type: 'ui', patch: { codeOpen: !state.codeOpen } })}
      >
        <CodeIcon />
        Code
        {errors ? <span className="toolbar__dot" title={`${errors} unresolved errors`} /> : null}
      </button>
    </header>
  );
}
