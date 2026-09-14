import { CompactButton } from '@nili/ui';
import { useStudio } from '../document/StudioContext';
import { CodeIcon, MoonIcon, RedoIcon, SunIcon, UndoIcon } from './icons';
import { format } from './shortcuts';

/** Undo and redo are `CompactButton`; the rest is chrome-specific. */
export function Toolbar(): JSX.Element {
  const { state, dispatch, canUndo, canRedo, locale, findings } = useStudio();
  const errors = findings.filter((f) => f.severity === 'error').length;

  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__mark" aria-hidden>N</span>
        <span className="toolbar__file">
          Sign-up form
          <em>{locale?.label ?? 'no locale'}</em>
        </span>
      </div>

      <div className="toolbar__cluster">
        <CompactButton appearance="ghost" aria-label="Undo" title={`Undo · ${format('mod+z')}`} disabled={!canUndo} onClick={() => dispatch({ type: 'undo' })}>
          <UndoIcon />
        </CompactButton>
        <CompactButton appearance="ghost" aria-label="Redo" title={`Redo · ${format('mod+shift+z')}`} disabled={!canRedo} onClick={() => dispatch({ type: 'redo' })}>
          <RedoIcon />
        </CompactButton>
      </div>

      <div className="toolbar__spacer" />

      {/* Locale is a choice between named options, so it stays a segmented
          control. Theme is a binary, so it is one button showing the state it
          will switch to — two icon buttons side by side read as a pair of
          unrelated toggles. */}
      <div className="locale-switch" role="radiogroup" aria-label="Document language">
        {state.locales.map((item) => (
          <button
            key={item.code}
            type="button"
            role="radio"
            aria-checked={item.code === state.activeLocale}
            title={`${item.label} · ${item.dir.toUpperCase()}`}
            onClick={() => dispatch({ type: 'setActiveLocale', code: item.code })}
          >
            {item.code}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="toolbar__ghost"
        title={`Interface: ${state.uiScheme}. Click for ${state.uiScheme === 'dark' ? 'light' : 'dark'}.`}
        aria-label="Toggle interface theme"
        onClick={() => dispatch({ type: 'ui', patch: { uiScheme: state.uiScheme === 'dark' ? 'light' : 'dark' } })}
      >
        {state.uiScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <button
        type="button"
        className="toolbar__primary"
        aria-pressed={state.codeOpen}
        onClick={() => dispatch({ type: 'ui', patch: { codeOpen: !state.codeOpen } })}
      >
        <CodeIcon />
        Code
        {errors ? <span className="toolbar__dot" title={`${errors} unresolved errors`} /> : null}
      </button>
    </header>
  );
}
