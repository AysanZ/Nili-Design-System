#!/usr/bin/env node
/**
 * nili — copy Nili components into your own repository.
 *
 *   npx nili init            set up components.json, tokens and shared lib
 *   npx nili add button      copy Button (and whatever it needs) into your repo
 *   npx nili add             pick from a list
 *   npx nili list            what is available
 *   npx nili diff button     what changed upstream since you copied it
 *
 * Files land in YOUR repo. You own them, you edit them, upgrades are opt-in
 * and visible as a diff. Nothing here phones home at runtime.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve, basename } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { execSync } from 'node:child_process';
import { stdin, stdout } from 'node:process';

const CWD = process.cwd();
const CONFIG = join(CWD, 'components.json');
const VERSION = '0.1.0';

/* ── tiny terminal helpers ─────────────────────────────────────── */
const C = process.env.NO_COLOR || !stdout.isTTY
  ? new Proxy({}, { get: () => (s) => s })
  : {
      dim: (s) => `\x1b[2m${s}\x1b[0m`,
      bold: (s) => `\x1b[1m${s}\x1b[0m`,
      green: (s) => `\x1b[32m${s}\x1b[0m`,
      red: (s) => `\x1b[31m${s}\x1b[0m`,
      yellow: (s) => `\x1b[33m${s}\x1b[0m`,
      blue: (s) => `\x1b[34m${s}\x1b[0m`,
    };

const log = (...a) => console.log(...a);
const ok = (s) => log(C.green('✓'), s);
const warn = (s) => log(C.yellow('!'), s);
const die = (s) => { console.error(C.red('✗'), s); process.exit(1); };

/* ── registry access ───────────────────────────────────────────── */

/**
 * The registry is read from a local checkout when one is configured, and
 * from the published URL otherwise. Local wins so the library's own repo
 * can dogfood the CLI without publishing first.
 */
async function loadRegistry(cfg) {
  const src = cfg?.registry ?? 'https://nili.dev/r';

  if (!/^https?:/.test(src)) {
    const base = resolve(CWD, src);
    const read = (f) => JSON.parse(readFileSync(join(base, f), 'utf8'));
    return {
      base,
      local: true,
      index: read('index.json'),
      item: (dir) => read(`${dir}.json`),
      file: (p) => readFileSync(resolve(base, '..', p), 'utf8'),
    };
  }

  const get = async (f) => {
    const res = await fetch(`${src}/${f}`);
    if (!res.ok) die(`registry: ${src}/${f} → ${res.status}`);
    return res.json();
  };
  const index = await get('index.json');
  const cache = new Map();
  return {
    base: src,
    local: false,
    index,
    item: async (dir) => {
      if (!cache.has(dir)) cache.set(dir, await get(`${dir}.json`));
      return cache.get(dir);
    },
    file: async (p) => {
      const res = await fetch(`${src}/files/${p}`);
      if (!res.ok) die(`registry: missing file ${p}`);
      return res.text();
    },
  };
}

const un = async (v) => (v instanceof Promise ? await v : v);

/* ── config ────────────────────────────────────────────────────── */

const DEFAULT_CONFIG = {
  $schema: 'https://nili.dev/schema/components.json',
  registry: 'https://nili.dev/r',
  tsx: true,
  aliases: {
    components: '@/components/ui',
    lib: '@/lib',
    hooks: '@/hooks',
    providers: '@/providers',
    icons: '@/icons',
    styles: '@/styles',
  },
  paths: {
    components: 'src/components/ui',
    lib: 'src/lib',
    hooks: 'src/hooks',
    providers: 'src/providers',
    icons: 'src/icons',
    styles: 'src/styles',
  },
};

function readConfig() {
  if (!existsSync(CONFIG)) return null;
  return JSON.parse(readFileSync(CONFIG, 'utf8'));
}

function requireConfig() {
  const cfg = readConfig();
  if (!cfg) die(`no components.json — run ${C.bold('npx nili init')} first`);
  return cfg;
}

/* ── import rewriting ──────────────────────────────────────────── */

/**
 * Source files import each other by relative path inside the library
 * (`../../lib/cn`, `../icon`). In a consumer's repo those paths do not
 * exist, so every specifier that leaves the component's own folder is
 * rewritten to the alias the consumer configured.
 *
 * Same-folder imports (`./button.styles`) are left alone: those files are
 * copied alongside and the relative path still holds.
 */
function rewriteImports(code, cfg) {
  const a = cfg.aliases;
  return code.replace(
    /(from\s+|import\s*\(\s*)(['"])([^'"]+)\2/g,
    (match, head, q, spec) => {
      if (!spec.startsWith('.')) return match;
      if (/^\.\/[^/]*$/.test(spec)) return match;          // ./button.styles — stays

      const m = spec.match(/^(?:\.\.\/)+(lib|hooks|providers|icons|i18n|styles)(\/.*)?$/);
      if (m) {
        const area = m[1] === 'i18n' ? 'lib' : m[1];
        return `${head}${q}${a[area] ?? `@/${area}`}${m[2] ?? ''}${q}`;
      }

      const c = spec.match(/^\.\.\/([a-z0-9-]+)(\/.*)?$/);
      if (c) return `${head}${q}${a.components}/${c[1]}${c[2] ?? ''}${q}`;

      return match;
    },
  );
}

/* ── dependency resolution ─────────────────────────────────────── */

async function resolveGraph(reg, dirs) {
  const seen = new Set();
  const order = [];
  const npm = new Set();
  const shared = new Set();

  async function visit(dir) {
    if (seen.has(dir)) return;
    seen.add(dir);
    const item = await un(reg.item(dir));
    for (const d of item.dependencies.registry) await visit(d);
    item.dependencies.npm.forEach((n) => npm.add(n));
    item.dependencies.shared.forEach((s) => shared.add(s));
    order.push(item);
  }

  for (const d of dirs) await visit(d);
  return { order, npm: [...npm].sort(), shared: [...shared].sort() };
}

/* ── writing ───────────────────────────────────────────────────── */

/** src/components/button/button.tsx → <paths.components>/button/button.tsx */
function targetPath(cfg, srcPath) {
  const rel = srcPath.replace(/^src\//, '');
  const m = rel.match(/^components\/(.*)$/);
  if (m) return join(CWD, cfg.paths.components, m[1]);
  const area = rel.split('/')[0];
  const base = cfg.paths[area] ?? `src/${area}`;
  return join(CWD, base, rel.slice(area.length + 1));
}

async function writeFiles(reg, cfg, files, { force, dry }) {
  const written = [];
  const skipped = [];

  for (const src of files) {
    const dest = targetPath(cfg, src);
    const exists = existsSync(dest);
    if (exists && !force) { skipped.push(dest); continue; }

    const code = rewriteImports(await un(reg.file(src)), cfg);
    if (!dry) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, code);
    }
    written.push(dest);
  }

  return { written, skipped };
}

function detectPM() {
  if (existsSync(join(CWD, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(CWD, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(CWD, 'bun.lockb'))) return 'bun';
  return 'npm';
}

function installed(name) {
  try {
    const pkg = JSON.parse(readFileSync(join(CWD, 'package.json'), 'utf8'));
    return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
  } catch { return false; }
}

function installDeps(names, { dry }) {
  const missing = names.filter((n) => !installed(n));
  if (!missing.length) return [];
  const pm = detectPM();
  const cmd = pm === 'npm' ? `npm i ${missing.join(' ')}` : `${pm} add ${missing.join(' ')}`;
  if (dry) { log(C.dim(`  would run: ${cmd}`)); return missing; }
  log(C.dim(`  ${cmd}`));
  execSync(cmd, { cwd: CWD, stdio: 'inherit' });
  return missing;
}

/* ── commands ──────────────────────────────────────────────────── */

async function cmdInit(args) {
  const dry = args.includes('--dry-run');
  if (existsSync(CONFIG) && !args.includes('--force'))
    die('components.json already exists — pass --force to overwrite');

  const localRegistry = args.find((a) => a.startsWith('--registry='))?.split('=')[1];
  const cfg = { ...DEFAULT_CONFIG, ...(localRegistry ? { registry: localRegistry } : {}) };

  if (!dry) writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');
  ok(`components.json`);

  const reg = await loadRegistry(cfg);

  // tokens: the components are meaningless without them
  const styles = reg.index.styles ?? [];
  const s = await writeFiles(reg, cfg, styles, { force: true, dry });
  ok(`${s.written.length} token files → ${cfg.paths.styles}/`);

  // shared lib/hooks/providers: every component leans on cn at minimum
  const sharedFiles = (reg.index.shared ?? []).flatMap((x) => x.files);
  const sh = await writeFiles(reg, cfg, sharedFiles, { force: true, dry });
  ok(`${sh.written.length} shared files → ${cfg.paths.lib}/, ${cfg.paths.hooks}/`);

  const npm = [...new Set((reg.index.shared ?? []).flatMap((x) => x.dependencies.npm))];
  const put = installDeps(npm, { dry });
  if (put.length) ok(`installed ${put.join(', ')}`);

  log();
  log(`Import the tokens once, in your root stylesheet:`);
  log(C.dim(`  @import '${cfg.aliases.styles}/tokens.semantic.css';`));
  log();
  log(`Then: ${C.bold('npx nili add button')}`);
}

async function cmdAdd(args) {
  const cfg = requireConfig();
  const reg = await loadRegistry(cfg);

  const force = args.includes('--force') || args.includes('-f');
  const dry = args.includes('--dry-run');
  const yes = args.includes('--yes') || args.includes('-y');
  let names = args.filter((a) => !a.startsWith('-'));

  const known = new Map(reg.index.components.map((c) => [c.dir, c]));

  if (args.includes('--all')) names = [...known.keys()];

  if (!names.length) {
    const rl = createInterface({ input: stdin, output: stdout });
    log(`Available: ${C.dim([...known.keys()].join(', '))}`);
    const answer = await rl.question('Which components? (space separated) ');
    rl.close();
    names = answer.split(/\s+/).filter(Boolean);
  }

  // accept `button`, `Button`, or `button-group`
  const dirs = names.map((n) => {
    const slug = n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    if (known.has(slug)) return slug;
    const byExport = reg.index.components.find((c) => c.provides?.includes(n));
    if (byExport) return byExport.dir;
    die(`unknown component: ${n}`);
  });

  const { order, npm, shared } = await resolveGraph(reg, dirs);
  const extra = order.filter((o) => !dirs.includes(o.dir));

  if (extra.length && !yes) {
    log(`${C.bold(dirs.join(', '))} also needs ${C.bold(extra.map((e) => e.dir).join(', '))}`);
  }

  const files = order.flatMap((o) => o.files);
  const { written, skipped } = await writeFiles(reg, cfg, files, { force, dry });

  // shared modules a component needs that init may predate
  const sharedFiles = (reg.index.shared ?? [])
    .flatMap((x) => x.files)
    .filter((f) => shared.some((s) => f.includes(s.replace(/^(lib|hooks|providers)\//, '$&'))));
  await writeFiles(reg, cfg, sharedFiles, { force: false, dry });

  for (const item of order) {
    const mine = item.files.filter((f) => written.includes(targetPath(cfg, f)));
    if (mine.length) ok(`${item.dir} ${C.dim(`(${mine.length} files)`)}`);
    else log(C.dim(`· ${item.dir} — already present`));
  }

  if (skipped.length && !force)
    warn(`${skipped.length} files left alone — pass --force to overwrite`);

  const put = installDeps(npm, { dry });
  if (put.length) ok(`installed ${put.join(', ')}`);

  log();
  for (const dir of dirs) {
    const item = order.find((o) => o.dir === dir);
    const names = item.components.map((c) => c.name).slice(0, 4);
    log(C.dim(`import { ${names.join(', ')} } from '${cfg.aliases.components}/${dir}'`));
  }
}

async function cmdList(args) {
  const cfg = readConfig() ?? DEFAULT_CONFIG;
  const reg = await loadRegistry(cfg);
  const json = args.includes('--json');
  if (json) return log(JSON.stringify(reg.index.components, null, 2));

  const here = cfg.paths?.components ? join(CWD, cfg.paths.components) : null;
  log(C.bold(`${reg.index.name} ${reg.index.version}`), C.dim(`— ${reg.index.components.length} entries`));
  log();
  for (const c of reg.index.components) {
    const present = here && existsSync(join(here, c.dir));
    const mark = present ? C.green('●') : C.dim('○');
    const deps = c.dependencies.registry.length ? C.dim(` → ${c.dependencies.registry.join(' ')}`) : '';
    log(`${mark} ${c.dir.padEnd(18)} ${C.dim((c.provides ?? []).slice(0, 3).join(', '))}${deps}`);
  }
  log();
  log(C.dim('● installed   ○ available'));
}

async function cmdDiff(args) {
  const cfg = requireConfig();
  const reg = await loadRegistry(cfg);
  const names = args.filter((a) => !a.startsWith('-'));
  const dirs = names.length ? names : reg.index.components.map((c) => c.dir);

  let changed = 0;
  for (const dir of dirs) {
    const item = await un(reg.item(dir)).catch(() => null);
    if (!item) continue;
    for (const src of item.files) {
      const dest = targetPath(cfg, src);
      if (!existsSync(dest)) continue;
      const upstream = rewriteImports(await un(reg.file(src)), cfg);
      const mine = readFileSync(dest, 'utf8');
      if (upstream !== mine) {
        changed++;
        log(C.yellow('M'), relative(CWD, dest));
      }
    }
  }
  if (!changed) ok('everything matches the registry');
  else log(C.dim(`\n${changed} file(s) differ — yours or upstream's, this does not say which`));
}

/* ── entry ─────────────────────────────────────────────────────── */

const [, , cmd, ...args] = process.argv;

const HELP = `
${C.bold('nili')} ${C.dim(VERSION)} — copy Nili components into your repository

  ${C.bold('init')}              create components.json, tokens and shared lib
  ${C.bold('add')} [names…]      copy components (and their dependencies)
  ${C.bold('list')}              what is available, and what you already have
  ${C.bold('diff')} [names…]     show files that drifted from the registry

  --force   overwrite files you already have
  --dry-run print what would happen, change nothing
  --yes     do not explain transitive dependencies
  --all     every component (with add)
  --json    machine-readable (with list)
`;

try {
  if (cmd === 'init') await cmdInit(args);
  else if (cmd === 'add') await cmdAdd(args);
  else if (cmd === 'list') await cmdList(args);
  else if (cmd === 'diff') await cmdDiff(args);
  else if (cmd === '--version' || cmd === '-v') log(VERSION);
  else log(HELP);
} catch (err) {
  die(err?.message ?? String(err));
}
