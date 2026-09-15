import { useMemo, useState } from 'react';
import { generate } from '../codegen';
import { useStudio } from '../core/store';
import { useT } from '../i18n';
import { Btn, Glyph, ICON } from './controls';

/** Enough highlighting to read by, and no dependency to keep current. */
function highlight(source: string): JSX.Element[] {
  const pattern =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|\b(import|export|from|type|interface|function|return|const|let|never|string|number|boolean|undefined|null|true|false)\b|(<\/?[A-Za-z][\w.]*)/g;
  const out: JSX.Element[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(source))) {
    if (match.index > last) out.push(<span key={key++}>{source.slice(last, match.index)}</span>);
    const cls = match[1] ? 'c' : match[2] ? 's' : match[3] ? 'k' : 't';
    out.push(
      <span key={key++} className={`hl-${cls}`}>
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < source.length) out.push(<span key={key++}>{source.slice(last)}</span>);
  return out;
}

export function CodeView(): JSX.Element {
  const { component, state, dispatch } = useStudio();
  const t = useT();
  const [copied, setCopied] = useState(false);

  const files = useMemo(() => generate(component), [component]);
  const current = files.find((file) => file.name === state.ui.codeFile) ?? files[0];

  const copy = (): void => {
    void navigator.clipboard.writeText(current.source).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };

  const download = (all: boolean): void => {
    for (const file of all ? files : [current]) {
      const blob = new Blob([file.source], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="code">
      <div className="code__bar">
        <div className="code__tabs">
          {files.map((file) => (
            <button
              key={file.name}
              type="button"
              aria-pressed={file.name === current.name}
              onClick={() => dispatch({ type: 'ui', patch: { codeFile: file.name } })}
            >
              {file.name}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <Btn onClick={copy}>{copied ? t('Copied') : t('Copy')}</Btn>
        <Btn onClick={() => download(false)}>
          <Glyph d={ICON.download} size={13} />
          {t('Download')}
        </Btn>
        <Btn variant="solid" onClick={() => download(true)}>
          {t('Download all')}
        </Btn>
      </div>

      <pre className="code__source">
        <code>{highlight(current.source)}</code>
      </pre>
    </div>
  );
}
