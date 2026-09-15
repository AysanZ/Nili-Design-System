import { useRef, useState } from 'react';
import { useStudio } from '../../document/StudioContext';
import { nextId } from '../../document/ids';
import type { Asset } from '../../document/types';
import { assetPath } from '../../document/types';

const LIMIT = 1_500_000;

const size = (bytes: number): string =>
  bytes > 1_000_000 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

/**
 * Images the document carries.
 *
 * Stored as data URLs, which is a deliberate trade: a document stays one file
 * that opens anywhere, with no asset server and no links that rot after an
 * export. The cost is document size, so there is a ceiling and the panel says
 * what the document weighs — a design tool that silently grows a 40MB JSON
 * file is a design tool people stop trusting with real photographs.
 */
export function AssetsPanel(): JSX.Element {
  const { state, dispatch } = useStudio();
  const input = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const total = state.assets.reduce((sum, asset) => sum + asset.size, 0);

  const accept = async (files: FileList): Promise<void> => {
    setProblem(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setProblem(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > LIMIT) {
        setProblem(`${file.name} is ${size(file.size)}. Keep images under ${size(LIMIT)} — the document carries them.`);
        continue;
      }
      const asset = await read(file);
      dispatch({ type: 'addAsset', asset });
    }
  };

  return (
    <div className="assets">
      {/* A drop target, not a control: the button inside it is how the
          keyboard gets here, which is why the region itself carries no role
          and claims no tab stop. */}
      <div
        className="assets__drop"
        role="presentation"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void accept(event.dataTransfer.files);
        }}
      >
        <p>Drop images here</p>
        <button type="button" className="action action--dashed" onClick={() => input.current?.click()}>
          or choose files
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files) void accept(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {problem ? <p className="note note--warning">{problem}</p> : null}

      {state.assets.length ? (
        <>
          <ul className="assets__list">
            {state.assets.map((asset) => (
              <li key={asset.id} className="assets__item">
                <span className="assets__thumb" style={{ backgroundImage: `url(${asset.dataUrl})` }} />
                <span className="assets__text">
                  <input
                    className="input input--inline"
                    value={asset.name}
                    onChange={(event) => dispatch({ type: 'renameAsset', id: asset.id, name: event.target.value })}
                  />
                  <em>
                    {asset.width}×{asset.height} · {size(asset.size)}
                  </em>
                  <code>{assetPath(asset)}</code>
                </span>
                <button
                  type="button"
                  className="pair__remove"
                  aria-label={`Remove ${asset.name}`}
                  onClick={() => dispatch({ type: 'removeAsset', id: asset.id })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <p className="note note--quiet">
            {state.assets.length} image{state.assets.length === 1 ? '' : 's'}, {size(total)} in the document.
            Exported to <code>public/assets/</code>.
          </p>
        </>
      ) : (
        <p className="note note--quiet">
          Nothing yet. An image here can be picked on any <code>src</code> field, and lands in{' '}
          <code>public/assets/</code> when you export.
        </p>
      )}
    </div>
  );
}

/** Reads the file and measures it, because the panel should say what it holds. */
async function read(file: File): Promise<Asset> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });

  const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    // SVGs and anything the browser cannot measure still import; they just
    // report zero rather than blocking the upload.
    image.onerror = () => resolve({ width: 0, height: 0 });
    image.src = dataUrl;
  });

  return { id: nextId(), name: file.name, dataUrl, size: file.size, width, height };
}

/** The picker that appears on any prop holding a picture. */
export function AssetPicker({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  const { state, dispatch } = useStudio();
  const current = value.startsWith('asset:') ? value.slice(6) : '';
  const asset = state.assets.find((item) => item.name === current);

  return (
    <div className="picker">
      <span
        className="picker__preview"
        style={asset ? { backgroundImage: `url(${asset.dataUrl})` } : undefined}
        aria-hidden
      />
      <select
        className="select"
        value={current}
        onChange={(event) => onChange(event.target.value ? `asset:${event.target.value}` : '')}
      >
        <option value="">none</option>
        {state.assets.map((item) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>
      {state.assets.length === 0 ? (
        <button
          type="button"
          className="picker__add"
          title="Upload one in Styles → Assets"
          onClick={() => dispatch({ type: 'ui', patch: { panel: 'images' } })}
        >
          +
        </button>
      ) : null}
    </div>
  );
}
