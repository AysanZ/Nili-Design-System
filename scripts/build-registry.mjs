#!/usr/bin/env node
/**
 * Nili — registry builder.
 *
 * One pass over src/components produces two things that used to be written
 * by hand and drift apart:
 *
 *   registry/<name>.json   the source files + dependency graph, so the CLI
 *                          can copy a component into a consumer's repo
 *                          (`npx nili add button`)
 *   …the same file's `props`/`variants` blocks power the Studio inspector,
 *   so a new variant appears in the UI the moment it appears in the cva.
 *
 * The source of truth is the code. Nothing here is a hand-kept list.
 *
 * Usage:
 *   node scripts/build-registry.mjs            # write registry/
 *   node scripts/build-registry.mjs --check    # fail if registry/ is stale
 */

import { Project, Node, SyntaxKind } from 'ts-morph';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolve } from 'node:path';
const ROOT = resolve(process.argv.slice(2).find((a) => !a.startsWith('-')) ?? process.cwd());
const SRC = join(ROOT, 'src');
const COMPONENTS = join(SRC, 'components');
const OUT = join(ROOT, 'registry');
const CHECK = process.argv.includes('--check');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const EXTERNAL = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

const project = new Project({
  tsConfigFilePath: existsSync(join(ROOT, 'tsconfig.app.json'))
    ? join(ROOT, 'tsconfig.app.json')
    : undefined,
  skipAddingFilesFromTsConfig: true,
});
project.addSourceFilesAtPaths([
  join(SRC, '**/*.ts'),
  join(SRC, '**/*.tsx'),
  `!${join(SRC, '**/*.test.ts*')}`,
  `!${join(SRC, '**/*.stories.tsx')}`,
]);

/* ══════════════════════════════════════════════════════════════════
   1. cva → variants
   ══════════════════════════════════════════════════════════════════ */

/** Read the keys of an object literal property, e.g. `size: { md, sm }`. */
function objectKeys(prop) {
  const init = prop?.getInitializer?.();
  if (!Node.isObjectLiteralExpression(init)) return null;
  return init.getProperties().flatMap((p) => {
    if (!Node.isPropertyAssignment(p) && !Node.isShorthandPropertyAssignment(p)) return [];
    const name = p.getName().replace(/^['"]|['"]$/g, '');
    return [name];
  });
}

function literalValue(prop) {
  const init = prop?.getInitializer?.();
  if (!init) return undefined;
  if (Node.isStringLiteral(init)) return init.getLiteralValue();
  if (init.getKind() === SyntaxKind.TrueKeyword) return true;
  if (init.getKind() === SyntaxKind.FalseKeyword) return false;
  if (Node.isNumericLiteral(init)) return init.getLiteralValue();
  return undefined;
}

/**
 * Every `cva(...)` in a file, keyed by the variable it is assigned to.
 * A component may declare several (root, label, adornment); the first one
 * is treated as the component's own variant set, the rest are recorded as
 * `slots` so the Studio can expose them later without another parse.
 */
function readCva(sourceFile) {
  const found = [];

  sourceFile.forEachDescendant((node) => {
    if (!Node.isCallExpression(node)) return;
    if (node.getExpression().getText() !== 'cva') return;

    const decl = node.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
    const name = decl?.getName() ?? '(anonymous)';
    const config = node.getArguments()[1];
    if (!Node.isObjectLiteralExpression(config)) {
      found.push({ name, variants: {}, defaults: {} });
      return;
    }

    const variantsProp = config.getProperty('variants');
    const defaultsProp = config.getProperty('defaultVariants');

    const variants = {};
    const vInit = variantsProp?.getInitializer?.();
    if (Node.isObjectLiteralExpression(vInit)) {
      for (const p of vInit.getProperties()) {
        if (!Node.isPropertyAssignment(p)) continue;
        const key = p.getName().replace(/^['"]|['"]$/g, '');
        const options = objectKeys(p) ?? [];
        variants[key] = options;
      }
    }

    const defaults = {};
    const dInit = defaultsProp?.getInitializer?.();
    if (Node.isObjectLiteralExpression(dInit)) {
      for (const p of dInit.getProperties()) {
        if (!Node.isPropertyAssignment(p)) continue;
        defaults[p.getName().replace(/^['"]|['"]$/g, '')] = literalValue(p);
      }
    }

    found.push({ name, variants, defaults });
  });

  return found;
}

/* ══════════════════════════════════════════════════════════════════
   2. *.types.ts → props
   ══════════════════════════════════════════════════════════════════ */

/** First line of the JSDoc, which is what a props panel has room for. */
function docOf(member) {
  const docs = member.getJsDocs?.() ?? [];
  if (!docs.length) return null;
  const text = docs[docs.length - 1].getDescription().trim();
  if (!text) return null;
  return text.split('\n\n')[0].replace(/\s+/g, ' ').trim();
}

function deprecatedOf(member) {
  return (member.getJsDocs?.() ?? []).some((d) =>
    d.getTags().some((t) => t.getTagName() === 'deprecated'),
  );
}

/**
 * Turn a type into something a UI control can be built from.
 * A union of string literals becomes a select; `boolean` a switch;
 * `ReactNode` a slot; everything else is recorded but not editable.
 */
function classifyType(typeText) {
  const t = typeText.trim();

  const literals = t
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  const allStringLiterals =
    literals.length > 1 && literals.every((s) => /^'[^']*'$/.test(s));
  if (allStringLiterals) {
    return { control: 'select', options: literals.map((s) => s.slice(1, -1)) };
  }
  if (/^'[^']*'$/.test(t)) return { control: 'select', options: [t.slice(1, -1)] };
  if (t === 'boolean') return { control: 'boolean' };
  if (t === 'number') return { control: 'number' };
  if (t === 'string') return { control: 'text' };
  if (/^ReactNode$/.test(t)) return { control: 'slot' };
  if (/^boolean \| ReactNode$/.test(t) || /^ReactNode \| boolean$/.test(t))
    return { control: 'boolean-or-slot' };
  if (/^\(.*\) =>/.test(t) || /^\w*EventHandler/.test(t))
    return { control: 'handler' };
  if (/\[\]$/.test(t)) return { control: 'list' };
  return { control: 'none' };
}

/** Fall back to the type checker when the written type is a named alias. */
function classifyResolved(member) {
  try {
    const t = member.getType();
    const parts = t.isUnion()
      ? t.getUnionTypes().filter((u) => !u.isUndefined() && !u.isNull())
      : [t];
    if (parts.length > 1 && parts.every((u) => u.isStringLiteral()))
      return { control: 'select', options: parts.map((u) => String(u.getLiteralValue())) };
    if (parts.length && parts.every((u) => u.isBoolean() || u.isBooleanLiteral()))
      return { control: 'boolean' };
    if (parts.length === 1 && parts[0].isString()) return { control: 'text' };
    if (parts.length === 1 && parts[0].isNumber()) return { control: 'number' };
  } catch {
    /* unresolvable types are recorded, just not editable */
  }
  return null;
}

function readProps(sourceFile, componentName) {
  const out = {};
  const extendsFrom = [];

  for (const iface of sourceFile.getInterfaces()) {
    const name = iface.getName();
    if (name !== componentName + 'Props') continue;

    for (const clause of iface.getHeritageClauses())
      for (const t of clause.getTypeNodes())
        extendsFrom.push(t.getText().replace(/\s+/g, ' '));

    for (const member of iface.getProperties()) {
      const key = member.getName().replace(/^['"]|['"]$/g, '');
      const typeText = member.getTypeNode()?.getText() ?? 'unknown';
      out[key] = {
        type: typeText,
        required: !member.hasQuestionToken(),
        doc: docOf(member),
        ...(deprecatedOf(member) ? { deprecated: true } : {}),
        ...(classifyType(typeText).control === 'none'
          ? (classifyResolved(member) ?? classifyType(typeText))
          : classifyType(typeText)),
      };
    }
  }

  return { props: out, extends: extendsFrom };
}

/* ══════════════════════════════════════════════════════════════════
   3. dependency graph
   ══════════════════════════════════════════════════════════════════ */

function readDeps(files, selfDir) {
  const npm = new Set();
  const internal = new Set();   // other components in the registry
  const shared = new Set();     // src/lib, src/hooks, src/providers, src/icons

  for (const file of files) {
    for (const imp of file.getImportDeclarations()) {
      const spec = imp.getModuleSpecifierValue();

      if (!spec.startsWith('.')) {
        const root = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (root === 'react' || root === 'react-dom') continue; // peer, always present
        if (EXTERNAL.has(root)) npm.add(root);
        continue;
      }

      const resolved = join(dirname(file.getFilePath()), spec);
      const rel = relative(SRC, resolved).split('/').join('/');

      if (rel.startsWith('components/')) {
        const other = rel.split('/')[1];
        if (other && other !== selfDir) internal.add(other);
      } else if (/^(lib|hooks|providers|icons|i18n)\//.test(rel) || /^(lib|hooks|providers|icons|i18n)$/.test(rel)) {
        shared.add(rel.replace(/\/index$/, ''));
      }
    }
  }

  return {
    npm: [...npm].sort(),
    registry: [...internal].sort(),
    shared: [...shared].sort(),
  };
}

/* ══════════════════════════════════════════════════════════════════
   4. build
   ══════════════════════════════════════════════════════════════════ */

const SKIP_FILE = /\.(test|stories|docs)\.(ts|tsx)$/;

function pascal(dir) {
  return dir.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

/** `buttonVariants` → `Button`; `buttonGroupItemVariants` → `ButtonGroupItem`. */
function componentNameOf(cvaVarName) {
  const base = cvaVarName.replace(/Variants$/, '');
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function buildComponent(dir) {
  const abs = join(COMPONENTS, dir);

  const files = project
    .getSourceFiles()
    .filter((f) => f.getFilePath().startsWith(abs + '/') && !SKIP_FILE.test(f.getBaseName()));
  if (!files.length) return null;

  const indexFile = files.find((f) => f.getBaseName() === 'index.ts');
  // `getExportedDeclarations` follows `export *`, which `getNamedExports`
  // does not — and every index.ts in this library is a star re-export.
  const exports = indexFile ? [...indexFile.getExportedDeclarations().keys()] : [];

  /* every cva in the folder, keyed by the component it styles */
  const cvaByComponent = new Map();
  for (const file of files.filter((f) => f.getBaseName().endsWith('.styles.ts'))) {
    for (const c of readCva(file)) {
      const name = componentNameOf(c.name);
      if (!cvaByComponent.has(name)) cvaByComponent.set(name, { ...c, file: file.getBaseName() });
      else cvaByComponent.get(name).slots = [...(cvaByComponent.get(name).slots ?? []), c];
    }
  }

  /* every *Props interface in the folder */
  const propsByComponent = new Map();
  for (const file of files.filter((f) => f.getBaseName().endsWith('.types.ts') || f.getBaseName().endsWith('.tsx'))) {
    for (const iface of file.getInterfaces()) {
      const n = iface.getName();
      if (!n.endsWith('Props')) continue;
      const name = n.slice(0, -'Props'.length);
      if (propsByComponent.has(name)) continue;
      propsByComponent.set(name, readProps(file, name));
    }
  }

  /* a component is anything the folder exports that has a cva or props */
  const names = new Set([
    ...exports.filter((e) => /^[A-Z]/.test(e) && !/Props$|Size$|Color$|Variant/.test(e)),
    ...cvaByComponent.keys(),
    ...propsByComponent.keys(),
  ]);

  const components = [...names].sort().map((name) => {
    const cva = cvaByComponent.get(name);
    const { props = {}, extends: ext = [] } = propsByComponent.get(name) ?? {};
    const variants = cva?.variants ?? {};
    const defaults = cva?.defaults ?? {};

    /* the cva wins for anything it declares — the interface often types a
       variant as a named alias the AST cannot see through */
    for (const [key, options] of Object.entries(variants)) {
      const isBool = options.length === 2 && options.includes('true') && options.includes('false');
      props[key] = {
        type: options.map((o) => `'${o}'`).join(' | '),
        required: false,
        doc: null,
        ...(props[key] ?? {}),
        control: isBool ? 'boolean' : 'select',
        default: defaults[key],
        source: 'cva',
      };
      if (isBool) delete props[key].options;
      else props[key].options = options;
    }

    return {
      name,
      exported: exports.includes(name),
      variants,
      defaultVariants: defaults,
      slots: (cva?.slots ?? []).map((c) => ({ name: c.name, variants: c.variants, defaultVariants: c.defaultVariants ?? c.defaults })),
      extends: ext,
      props,
    };
  }).filter((c) => cvaByComponent.has(c.name) || propsByComponent.has(c.name));

  return {
    dir,
    name: pascal(dir),
    type: 'registry:component',
    files: files.map((f) => relative(ROOT, f.getFilePath())).sort(),
    exports: exports.sort(),
    dependencies: readDeps(files, dir),
    components,
  };
}

const dirs = readdirSync(COMPONENTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const built = dirs.map(buildComponent).filter(Boolean);

/* shared modules the components lean on — copied once, on `nili init` */
function buildShared() {
  const out = [];
  for (const area of ['lib', 'hooks', 'providers']) {
    const base = join(SRC, area);
    if (!existsSync(base)) continue;
    const files = project
      .getSourceFiles()
      .filter((f) => f.getFilePath().startsWith(base + '/') && !SKIP_FILE.test(f.getBaseName()));
    out.push({
      name: area,
      type: 'registry:lib',
      files: files.map((f) => relative(ROOT, f.getFilePath())).sort(),
      dependencies: readDeps(files),
    });
  }
  return out;
}

const index = {
  $schema: 'https://nili.dev/schema/registry.json',
  name: pkg.name,
  version: pkg.version,
  homepage: pkg.homepage ?? null,
  generatedFrom: 'src/components/**/*.styles.ts + *.types.ts',
  styles: ['src/styles/tokens.primitives.css', 'src/styles/tokens.foundation.css',
           'src/styles/tokens.semantic.css', 'src/styles/theme.css', 'src/styles/variants.css'],
  shared: buildShared(),
  components: built.map((c) => ({
    name: c.name,
    dir: c.dir,
    exports: c.exports,
    provides: c.components.map((x) => x.name),
    dependencies: c.dependencies,
  })),
};

if (CHECK) {
  let stale = false;
  const compare = (path, value) => {
    const next = JSON.stringify(value, null, 2) + '\n';
    const prev = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (prev !== next) { stale = true; console.error('stale:', relative(ROOT, path)); }
  };
  compare(join(OUT, 'index.json'), index);
  for (const c of built) compare(join(OUT, `${c.dir}.json`), c);
  if (stale) {
    console.error('\nregistry is out of date — run `npm run registry`');
    process.exit(1);
  }
  console.log('registry up to date');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
for (const c of built) {
  writeFileSync(join(OUT, `${c.dir}.json`), JSON.stringify(c, null, 2) + '\n');
}

const units = built.reduce((n, c) => n + c.components.length, 0);
const variants = built.reduce((n, c) => n + c.components.reduce((m, x) => m + Object.keys(x.variants).length, 0), 0);
const props = built.reduce((n, c) => n + c.components.reduce((m, x) => m + Object.keys(x.props).length, 0), 0);
const editable = built.reduce((n, c) => n + c.components.reduce((m, x) =>
  m + Object.values(x.props).filter((p) => ['select', 'boolean', 'text', 'number'].includes(p.control)).length, 0), 0);
console.log(
  `registry: ${built.length} folders · ${units} components · ${variants} variant axes · ` +
  `${props} props (${editable} editable) → ${relative(ROOT, OUT)}/`,
);
