// Smoke test for the built studio. Not a unit test suite — it checks the
// three claims that matter: real components render, locale drives text and
// direction, and the linter reads the registry.
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync, readdirSync } from 'node:fs';

const dist = 'dist/assets';
const bundle = readdirSync(dist).find((f) => f.endsWith('.js'));
const errors = [];
const console_ = new VirtualConsole();
console_.on('jsdomError', (e) => errors.push(e.message.split('\n')[0]));

const dom = new JSDOM('<!doctype html><html data-ui="dark"><body><div id="root"></div></body></html>', {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole: console_,
  url: 'http://localhost/',
});

const { document: d, window: w } = dom.window;
w.matchMedia = (query) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {},
  dispatchEvent: () => false,
});
w.eval(readFileSync(`${dist}/${bundle}`, 'utf8'));

const click = (el) => el?.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const tick = (ms = 140) => new Promise((r) => setTimeout(r, ms));
const tab = (label) =>
  click([...d.querySelectorAll('.panel__tabs button')].find((b) => b.textContent.startsWith(label)));

await tick(600);
if (errors.length) {
  console.log('runtime errors:', errors);
  process.exit(1);
}

console.log('components in palette  :', d.querySelectorAll('.asset').length || '(opens with Assets)');
console.log('components rendered     :', d.querySelectorAll('.node--component').length);
console.log('real cva classes        :', /inline-flex shrink-0/.test(d.querySelector('.node--component button')?.className ?? ''));
console.log('en                      :', d.querySelector('.artboard h5')?.textContent);

click([...d.querySelectorAll('.toolbar button')].find((b) => b.textContent.trim() === 'FA'));
await tick();
console.log('fa                      :', d.querySelector('.artboard h5')?.textContent);
console.log('direction follows locale:', d.querySelector('[dir]')?.getAttribute('dir'));

tab('Assets');
await tick();
click([...d.querySelectorAll('.asset')].find((a) => a.querySelector('.asset__name')?.textContent === 'Button'));
await tick();
click([...d.querySelectorAll('.toggle-row')].find((r) => r.textContent.includes('Icon only'))?.querySelector('.toggle'));
await tick();
tab('Checks');
await tick();
console.log('lint finding            :', d.querySelector('.finding__message')?.textContent);
console.log('rule cites the library  :', d.querySelector('.finding__meta')?.textContent);

click(d.querySelector('.toolbar__primary'));
await tick();
const code = d.querySelector('.drawer__code')?.textContent ?? '';
console.log('codegen emits t()       :', code.includes("t('signup.title')"));
console.log('codegen flags errors    :', code.startsWith('//'));
console.log(errors.length ? `errors: ${errors}` : 'no runtime errors');

// Guards against the edit that deleted the canvas rules: every class the JSX
// renders must exist in the stylesheet.
const { readFileSync: read, readdirSync: dir } = await import('node:fs');
const sheet = read(`dist/assets/${dir('dist/assets').find((f) => f.endsWith('.css'))}`, 'utf8');
const rendered = new Set(
  [...d.querySelectorAll('[class]')]
    .flatMap((el) => el.className.split(/\s+/))
    .filter((c) => /^[a-z][a-z0-9_-]*$/.test(c) && !c.startsWith('nili')),
);
const unstyled = [...rendered].filter((c) => !sheet.includes(`.${c}`));
console.log('classes without a rule :', unstyled.length ? unstyled.join(', ') : 'none');
