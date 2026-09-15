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
// Stories are parsed for their `argTypes` but never emitted as component
// files, which is why they are added here and filtered out in `SKIP_FILE`.
project.addSourceFilesAtPaths([
  join(SRC, '**/*.ts'),
  join(SRC, '**/*.tsx'),
  `!${join(SRC, '**/*.test.ts*')}`,
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

/**
 * Defaults taken from the component's own parameter destructuring.
 *
 * `cva`'s `defaultVariants` only covers variants. Everything else — a reveal
 * toggle, a size guard, a flag that starts on — writes its default in the
 * function signature, and that is the only place it exists.
 */
function readDestructuredDefaults(abs) {
  const out = new Map();

  const files = project
    .getSourceFiles()
    .filter((f) => f.getFilePath().startsWith(abs + '/') && !f.getBaseName().endsWith('.stories.tsx'));

  for (const file of files) {
    // `forwardRef(function Name({ a = 1 }, ref) {…})` is a function expression;
    // a plain component is a declaration. Both are how Nili writes components.
    const functions = [
      ...file.getDescendantsOfKind(SyntaxKind.FunctionExpression),
      ...file.getFunctions(),
    ];
    for (const fn of functions) {
      const name = fn.getName?.();
      if (!name) continue;
      const [first] = fn.getParameters();
      const pattern = first?.getNameNode?.();
      if (!pattern || !Node.isObjectBindingPattern(pattern)) continue;

      const defaults = {};
      for (const element of pattern.getElements()) {
        const value = literalValue(element);
        if (value !== undefined) defaults[element.getName()] = value;
      }
      if (Object.keys(defaults).length) {
        out.set(name, { ...(out.get(name) ?? {}), ...defaults });
      }
    }
  }

  return out;
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
  // `number | string` is the CSS-length pattern (`16` or `'1em'`); a number
  // control covers the common case and the value stays assignable either way.
  if (/^(number \| string|string \| number)$/.test(t)) return { control: 'number' };
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

/**
 * DOM props worth exposing in a builder. `ComponentPropsWithoutRef<'input'>`
 * contributes about 280 attributes and event handlers; all but these are
 * noise in a props panel, and listing them would bury the twelve that
 * matter. Everything else stays reachable in code — it is simply not
 * surfaced as a control.
 */
const DOM_PROPS = {
  disabled: { type: 'boolean', control: 'boolean' },
  required: { type: 'boolean', control: 'boolean' },
  readOnly: { type: 'boolean', control: 'boolean' },
  checked: { type: 'boolean', control: 'boolean' },
  defaultChecked: { type: 'boolean', control: 'boolean' },
  placeholder: { type: 'string', control: 'text' },
  value: { type: 'string', control: 'text' },
  defaultValue: { type: 'string', control: 'text' },
  name: { type: 'string', control: 'text' },
  maxLength: { type: 'number', control: 'number' },
  rows: { type: 'number', control: 'number' },
  autoComplete: { type: 'string', control: 'text' },
  'aria-label': { type: 'string', control: 'text' },
};

/**
 * `children` is declared on almost no props interface in this library,
 * because React contributes it through `ComponentPropsWithoutRef`. It is
 * still the most important editable thing about a Button or a Tag, so it is
 * added for every element that can hold content — which is every element
 * except the void ones.
 */
const VOID_ELEMENTS = new Set(['input', 'img', 'hr', 'br', 'area', 'col', 'embed', 'source', 'track', 'wbr']);

/** Which DOM element an interface inherits from, if any. */
function domElementOf(heritage) {
  const m = heritage.join(' ').match(/ComponentPropsWithoutRef<'(\w+)'>/);
  return m?.[1] ?? null;
}

function readProps(sourceFile, componentName) {
  const out = {};
  const extendsFrom = [];

  /* Polymorphic components declare `TypographyOwnProps` and export
     `TypographyProps` as a type alias over `PolymorphicProps`, so looking
     only for `<Name>Props` as an interface finds nothing at all. */
  const alias = sourceFile.getTypeAlias(componentName + 'Props');
  const aliasText = alias?.getTypeNode()?.getText() ?? '';
  const polymorphic = /PolymorphicProps</.test(aliasText);

  const target =
    sourceFile.getInterface(componentName + 'Props') ??
    sourceFile.getInterface(componentName + 'OwnProps');
  if (!target) return { props: out, extends: extendsFrom };

  if (polymorphic)
    out.children = { type: 'ReactNode', control: 'slot', required: false, doc: null, source: 'dom' };

  /* Walk local base interfaces too. `ProgressBarProps extends
     ProgressCommonProps` put every meaningful prop one level up, where the
     first version of this function could not see it — ProgressBar came out
     of the registry with zero editable props, which is how the bug was
     found. Base members are read first so the derived interface can
     override them. */
  const chain = [];
  const collect = (iface, depth = 0) => {
    if (depth > 4) return;
    for (const clause of iface.getHeritageClauses())
      for (const t of clause.getTypeNodes()) {
        const text = t.getText().replace(/\s+/g, ' ');
        if (depth === 0) extendsFrom.push(text);
        const baseName = text.match(/^([A-Za-z_$][\w$]*)/)?.[1];
        const base = baseName && sourceFile.getInterface(baseName);
        if (base) collect(base, depth + 1);
      }
    chain.unshift(iface);
  };
  collect(target);

  const omitted = new Set(
    (extendsFrom.join(' ').match(/Omit<[^>]*>/g) ?? [])
      .flatMap((o) => [...o.matchAll(/'([^']+)'/g)].map((m) => m[1])),
  );

  const element = domElementOf(extendsFrom);
  if (element && !VOID_ELEMENTS.has(element) && !omitted.has('children'))
    out.children = { type: 'ReactNode', control: 'slot', required: false, doc: null, source: 'dom' };
  if (element) {
    for (const [key, meta] of Object.entries(DOM_PROPS)) {
      if (omitted.has(key)) continue;
      // `disabled` on a <span> is not a prop, it is a typo that compiles.
      // Only surface an attribute where the element actually takes it.
      const FORM = new Set(['input', 'textarea', 'select', 'button']);
      const TEXTUAL = new Set(['input', 'textarea']);
      if (key === 'rows' && element !== 'textarea') continue;
      if (!FORM.has(element)
          && ['disabled', 'required', 'readOnly', 'value', 'defaultValue', 'name'].includes(key))
        continue;
      if (!TEXTUAL.has(element)
          && ['checked', 'defaultChecked', 'placeholder', 'maxLength', 'autoComplete'].includes(key))
        continue;
      out[key] = { ...meta, required: false, doc: null, source: 'dom' };
    }
  }

  for (const iface of chain) {
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
   2b. *.stories.tsx → argTypes
   ══════════════════════════════════════════════════════════════════ */

/**
 * Storybook's `argTypes` is the third place a prop's options are written down,
 * and sometimes the only one: a prop typed `string` can still have a fixed set
 * of values the stories enumerate. Reading them here means a control that
 * works in Storybook works in the studio, without a second list to maintain.
 */
function readArgTypes(dir) {
  const out = new Map();
  const files = project
    .getSourceFiles()
    .filter((f) => f.getFilePath().startsWith(dir + '/') && f.getBaseName().endsWith('.stories.tsx'));

  for (const file of files) {
    file.forEachDescendant((node) => {
      if (!Node.isPropertyAssignment(node) || node.getName() !== 'argTypes') return;
      const init = node.getInitializer();
      if (!Node.isObjectLiteralExpression(init)) return;

      for (const prop of init.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;
        const key = prop.getName().replace(/^['"]|['"]$/g, '');
        const value = prop.getInitializer();
        if (!Node.isObjectLiteralExpression(value)) continue;

        const optionsProp = value.getProperty('options');
        const optionsInit = optionsProp?.getInitializer?.();
        if (!Node.isArrayLiteralExpression(optionsInit)) continue;

        const options = optionsInit
          .getElements()
          .filter((e) => Node.isStringLiteral(e))
          .map((e) => e.getLiteralValue());
        if (!options.length || out.has(key)) continue;

        const controlProp = value.getProperty('control');
        const controlInit = controlProp?.getInitializer?.();
        let control = null;
        if (Node.isStringLiteral(controlInit)) control = controlInit.getLiteralValue();
        else if (Node.isObjectLiteralExpression(controlInit)) {
          const typeProp = controlInit.getProperty('type');
          const typeInit = typeProp?.getInitializer?.();
          if (Node.isStringLiteral(typeInit)) control = typeInit.getLiteralValue();
        }

        out.set(key, { options, control });
      }
    });
  }

  return out;
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
      // `TypographyOwnProps` belongs to `Typography`, not to a component
      // called `TypographyOwn`.
      const name = n.replace(/(Own)?Props$/, '');
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

  /**
   * Every variant axis declared anywhere in the folder. A prop often shares
   * its name with a variant on a *sibling* cva — Avatar's `tone` is declared
   * on `avatarSurfaceVariants`, not on `avatarVariants` — and without this
   * it comes out of the registry as an uneditable opaque alias.
   */
  const folderVariants = new Map();
  for (const c of cvaByComponent.values()) {
    for (const [k, opts] of Object.entries(c.variants))
      if (!folderVariants.has(k)) folderVariants.set(k, opts);
    for (const slot of c.slots ?? [])
      for (const [k, opts] of Object.entries(slot.variants ?? {}))
        if (!folderVariants.has(k)) folderVariants.set(k, opts);
  }

  const argTypes = readArgTypes(abs);
  const destructured = readDestructuredDefaults(abs);

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

    /* A default written where the component is implemented — `reveal = true`
       in the parameter list — is as real as one written in `defaultVariants`,
       and the Studio needs it for the same reason: without it, a prop whose
       default is `true` cannot be turned off, because "false" and "not set"
       look identical once the value leaves the editor. */
    const own = destructured.get(name);
    if (own) {
      for (const [key, value] of Object.entries(own)) {
        if (props[key] && props[key].default === undefined) props[key].default = value;
      }
    }

    for (const [key, meta] of Object.entries(props)) {
      const fromStories = argTypes.get(key);
      if (!fromStories) continue;
      if (meta.control === 'select' && meta.options?.length) continue;
      props[key] = {
        ...meta,
        control: 'select',
        options: fromStories.options,
        source: meta.source ?? 'stories',
      };
    }

    for (const [key, meta] of Object.entries(props)) {
      if (meta.control !== 'none' || !folderVariants.has(key)) continue;
      const opts = folderVariants.get(key);
      const isBool = opts.length === 2 && opts.includes('true') && opts.includes('false');
      props[key] = {
        ...meta,
        control: isBool ? 'boolean' : 'select',
        ...(isBool ? {} : { options: opts }),
        source: 'cva:sibling',
      };
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
