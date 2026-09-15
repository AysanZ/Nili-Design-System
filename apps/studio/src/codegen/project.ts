import { componentSource } from './jsx';
import { propsTable, storySource } from './stories';
import { documentSource, themeSource, translationSource } from './artifacts';
import type { Asset, ComponentDef } from '../document/types';
import type { Locale } from '../i18n/types';
import type { ThemeTokens } from '../theme/tokens';
import type { Finding } from '../lint/types';

export interface ProjectFile {
  path: string;
  contents: string;
  /** Written as raw bytes rather than text — images, decoded from their data URL. */
  binary?: Uint8Array;
}

export interface ProjectInput {
  components: ComponentDef[];
  theme: ThemeTokens;
  locales: Locale[];
  findings: Finding[];
  assets?: Asset[];
}

/**
 * What leaves the studio is a folder of components, not an application.
 *
 * The previous version emitted a runnable Vite project — a router, an app
 * shell, a fetch hook, a package manifest — and every one of those was the
 * tool answering a question it had no business answering. A component belongs
 * in a codebase that already exists, next to the ones written by hand, and
 * this is shaped to drop straight into `src/components/`.
 */
export function projectFiles({ components, theme, locales, findings, assets = [] }: ProjectInput): ProjectFile[] {
  const files: ProjectFile[] = [];

  for (const component of components) {
    const own = findings.filter((finding) => finding.nodeId.startsWith(component.id));
    files.push({
      path: `components/${component.component}/${component.component}.tsx`,
      contents: componentSource({
        component,
        components,
        findings: own,
        // Each component lives in a directory of its own, so a sibling is one
        // level up and one back down.
        importPath: (name) => `../${name}/${name}`,
      }),
    });
    files.push({
      path: `components/${component.component}/${component.component}.stories.tsx`,
      contents: storySource(component),
    });
  }

  files.push({
    path: 'components/index.ts',
    contents: `${components
      .map((component) => `export * from './${component.component}/${component.component}'`)
      .join('\n')}\n`,
  });

  files.push({ path: 'styles/theme.css', contents: themeSource(theme) });
  if (locales.length) {
    files.push({ path: 'i18n/translations.json', contents: translationSource(components, locales) });
  }

  for (const asset of assets) {
    files.push({ path: `public/assets/${asset.name}`, contents: '', binary: decodeDataUrl(asset.dataUrl) });
  }

  files.push({ path: 'nili.document.json', contents: documentSource(components, theme, locales) });
  files.push({ path: 'README.md', contents: readme(components, locales, findings, assets) });

  return files;
}

function decodeDataUrl(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',');
  const binary = atob(comma === -1 ? dataUrl : dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function readme(components: ComponentDef[], locales: Locale[], findings: Finding[], assets: Asset[]): string {
  const errors = findings.filter((finding) => finding.severity === 'error');
  const needsI18n = locales.length > 0;

  return `# Components from Nili Studio

${components.length} component${components.length === 1 ? '' : 's'}${errors.length ? `, with ${errors.length} unresolved error${errors.length === 1 ? '' : 's'} noted at the top of the affected file${errors.length === 1 ? '' : 's'}` : ''}.

## Dropping them in

Copy \`components/\` into your \`src/\`. They import \`@nili/ui\`${needsI18n ? ' and `react-i18next`' : ''} and nothing else — no runtime from this tool, no router, no data layer.

${assets.length ? `Copy \`public/assets/\` too; the components reference images by path.\n\n` : ''}${needsI18n ? 'Merge `i18n/translations.json` into your catalogues. The keys are flat, which is what `t(\'signup.title\')` expects.\n\n' : ''}\`styles/theme.css\` overrides the semantic tokens only. Primitives and component tokens are untouched, so it layers over an existing Nili setup.

## What they take

${components
  .map((component) => `### \`${component.component}\`\n\n${propsTable(component)}`)
  .join('\n\n')}

## Where the decisions live

These components know what they look like. They do not know *when* — whether a
request is in flight, whether a field is invalid, what happens after a click.
Each of those is a prop, and your application answers it. A story sits beside
every component with the sample values from the canvas already filled in, so
you can see each state before wiring any of it up.
`;
}

/* ─────────────────────────────  zip  ───────────────────────────── */

/**
 * A minimal ZIP writer, stored (uncompressed) entries only.
 *
 * About seventy lines against a dependency that would be the studio's first.
 * Compression is skipped deliberately: these are a handful of small text files,
 * and every unzip tool on earth reads a stored entry.
 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[i] = value >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (CRC_TABLE[(crc ^ byte) & 0xff] as number) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function zip(files: ProjectFile[]): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  const u32 = (view: DataView, at: number, value: number): void => view.setUint32(at, value, true);
  const u16 = (view: DataView, at: number, value: number): void => view.setUint16(at, value, true);

  for (const file of files) {
    const name = encoder.encode(file.path);
    const body = file.binary ?? encoder.encode(file.contents);
    const sum = crc32(body);

    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    u32(localView, 0, 0x04034b50);
    u16(localView, 4, 20);
    u16(localView, 8, 0);
    u32(localView, 14, sum);
    u32(localView, 18, body.length);
    u32(localView, 22, body.length);
    u16(localView, 26, name.length);
    local.set(name, 30);
    chunks.push(local, body);

    const entry = new Uint8Array(46 + name.length);
    const entryView = new DataView(entry.buffer);
    u32(entryView, 0, 0x02014b50);
    u16(entryView, 4, 20);
    u16(entryView, 6, 20);
    u16(entryView, 10, 0);
    u32(entryView, 16, sum);
    u32(entryView, 20, body.length);
    u32(entryView, 24, body.length);
    u16(entryView, 28, name.length);
    u32(entryView, 42, offset);
    entry.set(name, 46);
    central.push(entry);

    offset += local.length + body.length;
  }

  const directorySize = central.reduce((total, entry) => total + entry.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  u32(endView, 0, 0x06054b50);
  u16(endView, 8, files.length);
  u16(endView, 10, files.length);
  u32(endView, 12, directorySize);
  u32(endView, 16, offset);

  return new Blob([...chunks, ...central, end] as BlobPart[], { type: 'application/zip' });
}

export function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
