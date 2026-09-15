import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import { directionForLocale, findMissing, parseCatalog } from '../../i18n/catalog';
import { keysUsed } from '../../lint/engine';
import { Section } from '../Section';

/**
 * Translation files are imported, not authored here. A studio that owned the
 * catalogue would fork it away from the app's own i18n setup; importing keeps
 * one source of truth and lets the studio verify against it.
 */
export function LocalesPanel(): JSX.Element {
  const { state, dispatch } = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const used = [...new Set(state.components.flatMap((component) => keysUsed(component.root)))].sort();
  const missing = findMissing(used, state.locales);

  const onFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    const code = file.name.replace(/\.json$/i, '').split('.').pop() ?? file.name.replace(/\.json$/i, '');
    try {
      const locale = parseCatalog(code, code.toUpperCase(), await file.text());
      dispatch({ type: 'addLocale', locale });
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read that file.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <>
      <Section id="locales" title="Locales">
        <ul className="locale-list">
          {state.locales.map((locale) => {
            const gaps = missing.filter((m) => m.locales.includes(locale.code)).length;
            return (
              <li key={locale.code} className={locale.code === state.activeLocale ? 'is-active' : undefined}>
                <button type="button" onClick={() => dispatch({ type: 'setActiveLocale', code: locale.code })}>
                  <span className="locale-list__code">{locale.code}</span>
                  <span className="locale-list__label">{locale.label}</span>
                  <span className="locale-list__dir">{directionForLocale(locale.code)}</span>
                  <span className={`locale-list__count${gaps ? ' has-gaps' : ''}`}>
                    {gaps ? `${gaps} missing` : `${Object.keys(locale.messages).length} keys`}
                  </span>
                </button>
                {state.locales.length > 1 ? (
                  <button
                    type="button"
                    className="locale-list__remove"
                    aria-label={`Remove ${locale.label}`}
                    onClick={() => dispatch({ type: 'removeLocale', code: locale.code })}
                  >
                    ×
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
        <button type="button" className="action" onClick={() => fileRef.current?.click()}>
          Import translation.json
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
        {error ? <p className="note note--warning">{error}</p> : null}
        <p className="note">
          The file name decides the locale code: <code>fa.json</code>, <code>messages.fa.json</code>. Nested
          objects are flattened to dotted keys.
        </p>
      </Section>

      <Section id="keys" title={`Keys in this document (${used.length})`}>
        {used.length === 0 ? (
          <p className="note">No text is using a key yet. Switch a field to <strong>Key</strong> in the inspector.</p>
        ) : (
          <table className="key-table">
            <thead>
              <tr>
                <th>Key</th>
                {state.locales.map((locale) => (
                  <th key={locale.code}>{locale.code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {used.map((key) => (
                <tr key={key}>
                  <td><code>{key}</code></td>
                  {state.locales.map((locale) => (
                    <td key={locale.code}>
                      <input
                        className={`input input--flush${locale.messages[key] ? '' : ' input--invalid'}`}
                        dir={locale.dir}
                        value={locale.messages[key] ?? ''}
                        placeholder="—"
                        onChange={(e) =>
                          dispatch({ type: 'setMessage', code: locale.code, key, value: e.target.value })
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </>
  );
}
