// Smoke test for the built studio. Not a unit test suite — it checks the
// claims that matter: real components render, locale drives text and
// direction, the linter reads the registry, the generated file carries the
// contract, and no class the JSX renders is missing a rule.
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
const rail = (label) => click([...d.querySelectorAll('.rail button')].find((b) => b.getAttribute('aria-label') === label));
const tab = (label) => click([...d.querySelectorAll('.tabs button')].find((b) => b.textContent.startsWith(label)));

const checks = [];
const check = (name, actual, expected = true) => {
  const ok = typeof expected === 'function' ? expected(actual) : actual === expected;
  checks.push({ name, ok, actual });
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(30)} ${String(actual).slice(0, 70)}`);
};

await tick(600);
if (errors.length) {
  console.log('runtime errors:', errors);
  process.exit(1);
}

check('components rendered', d.querySelectorAll('.node--component').length, (n) => n > 0);
/* The canvas imports the library rather than copying its CSS, so a previewed
   component carries the classes `cva` produced. If this ever goes false the
   preview has quietly become a lookalike. */
check(
  'real cva classes',
  [...d.querySelectorAll('.node__inner *')].some((el) =>
    /inline-flex|shrink-0|rounded-/.test(String(el.className)),
  ),
);
const en = d.querySelector('.artboard h5')?.textContent;
check('english text', en, (t) => Boolean(t));

// The language switch lives on the canvas bar now: it changes what is drawn,
// not the editor around it.
click([...d.querySelectorAll('.bottom-bar .locale-switch button')].find((b) => b.textContent.trim() === 'fa'));
await tick();
check('persian text differs', d.querySelector('.artboard h5')?.textContent !== en);
check('direction follows locale', d.querySelector('.artboard [dir]')?.getAttribute('dir') ?? d.querySelector('[dir="rtl"]') ? 'rtl' : 'ltr', 'rtl');

// A11y rules come from the registry, so turning on `iconOnly` has to produce
// one without anybody writing the finding by hand.
rail('Insert');
await tick();
rail('Layers');
await tick();
click(d.querySelector('.node--component'));
await tick();
const iconOnly = [...d.querySelectorAll('.field')].find((f) => f.textContent.includes('Icon only'));
click(iconOnly?.querySelector('.toggle'));
await tick();
rail('Checks');
await tick();
check('lint finding', d.querySelector('.finding__message')?.textContent, (t) => Boolean(t));
check('rule cites the library', d.querySelector('.finding__meta')?.textContent, (t) => Boolean(t));

/* A state is a set of property values, and the set changes as you fill it in:
   pinning `emailInvalid` is what makes `emailError` exist at all. If this
   stops holding, conditions have quietly become decoration. */
rail('Layers'); // the Checks panel is open from the step above
await tick();
click([...d.querySelectorAll('.prow__main')].find((r) => r.textContent.includes('Sign up')));
await tick();
check('sign up form selected', d.querySelector('.cbar')?.textContent, (t) => Boolean(t));
click(d.querySelector('.stchip--add'));
await tick();
const paramNames = () => [...d.querySelectorAll('.dialog__params li code')].map((c) => c.textContent);
check('state dialog opens', Boolean(d.querySelector('.dialog__box')));
check('dependent prop hidden', paramNames().includes('emailError'), false);
const controller = [...d.querySelectorAll('.dialog__params li')].find((li) => li.querySelector('code')?.textContent === 'emailInvalid');
click(controller?.querySelector('.row__pin'));
await tick();
const flipped = [...d.querySelectorAll('.dialog__params li')].find((li) => li.querySelector('code')?.textContent === 'emailInvalid');
click([...(flipped?.querySelectorAll('.segments button') ?? [])].find((b) => b.textContent === 'true'));
await tick();
check('dependent prop appears', paramNames().includes('emailError'));
check('name follows the values', d.querySelector('.dialog__body .input')?.value, 'Email invalid');
click(d.querySelector('.dialog__save'));
await tick();
check('state chip added', [...d.querySelectorAll('.stchip')].some((c) => c.textContent.includes('Email invalid')));

// The contract is the product, so it has to be on screen and in the file.
tab('Props');
await tick();
check('contract on screen', d.querySelector('.contract__code')?.textContent, (t) => /interface .*Props/.test(t ?? ''));

click(d.querySelector('.toolbar__primary'));
await tick();
const code = d.querySelector('.drawer__code')?.textContent ?? '';
check('codegen emits t()', code.includes("t('"));
check('codegen emits a props type', /(?:interface|type) \w+Props/.test(code));

/*
 * The overview sheet is the library's own Storybook page, rendered as it is.
 *
 * Not a reconstruction of it: the module under
 * `src/components/**\/*-overview.stories.tsx` is imported and run, with the
 * i18next instance `.storybook/i18n.ts` gives it. Every attempt to rebuild
 * this drifted — the registry knows `CompactButton` takes `children`, and
 * only the docs file knows an icon goes in there rather than a word.
 */
rail('Insert');
await tick();
const row = [...d.querySelectorAll('.irow')].find((r) => r.querySelector('.irow__name')?.textContent === 'Button');
click(row?.querySelector('.irow__more'));
await tick(900);

check('overview sheet opens', Boolean(d.querySelector('.sheet__box')));
check('the real story loaded', d.querySelector('.sheet__loading'), null);
/* One Buttons page covers Button, LinkButton, FancyButton and CompactButton,
   exactly as Storybook groups them — which a per-component matrix could not. */
check('every button set is there', d.querySelectorAll('.sheet__surface section').length, (n) => n > 10);
check('the dashed Figma frames', d.querySelectorAll('.sheet__surface [class*=9747FF]').length, (n) => n >= 4);
check('live components', d.querySelectorAll('.sheet__surface button').length, (n) => n > 400);
/* Hover and focus cells are drawn with the attribute the library's own
   `hovered:` and `focused:` variants read, so the picture is the component's
   own styling rather than a colour copied into this app. */
check('states drawn by the library', d.querySelectorAll('.sheet__surface [data-nili-state]').length, (n) => n > 100);

/* Dark first: a component's dark appearance is half of what it looks like. */
const sheetTheme = () => d.querySelector('.sheet__surface')?.closest('[data-theme]')?.getAttribute('data-theme');
check('sheet starts dark', sheetTheme(), 'dark');
click([...d.querySelectorAll('.sheet__switch button')].find((b) => b.textContent === 'light'));
await tick();
check('sheet switches theme', sheetTheme(), 'light');

/*
 * The page carries no click handlers of its own — it is the library's markup.
 * Picking asks React what was clicked, which is what lets the page stay
 * untouched and still be a picker.
 *
 * What lands has to be what was clicked, icons and all. A live prop bag holds
 * React elements and a document holds JSON, so the icons have to be recovered
 * by name; when they were merely dropped, `defaultProps` put the starter word
 * back and an icon-only button arrived reading "Button".
 */
const shape = (b) => `${b.textContent.trim()}|${b.querySelectorAll('svg').length}`;
const inSheet = [...d.querySelectorAll('.sheet__surface button')];
const withIcons = inSheet.find((b) => b.querySelectorAll('svg').length === 2 && b.textContent.trim());
const onCanvas = () => [...d.querySelectorAll('.artboard button')];
const before = onCanvas().length;
click(withIcons);
await tick(450);
check('picking closes the sheet', Boolean(d.querySelector('.sheet__box')), false);
check('picking inserts the component', onCanvas().length > before);
check(
  'icons survive the pick',
  onCanvas().some((b) => shape(b) === shape(withIcons)),
);

/* The other half of the same bug: a slot that cannot be carried is cleared,
   not dropped, so an icon-only button does not arrive with a word in it. */
rail('Insert');
await tick();
click([...d.querySelectorAll('.irow')].find((r) => r.querySelector('.irow__name')?.textContent === 'Button')?.querySelector('.irow__more'));
await tick(900);
const bareIcon = [...d.querySelectorAll('.sheet__surface button')]
  .find((b) => b.querySelectorAll('svg').length === 1 && !b.textContent.trim());
click(bareIcon);
await tick(450);
check('icon-only arrives without text', onCanvas().some((b) => shape(b) === shape(bareIcon)));

/* Six components have no overview story in the library; those fall back to a
   matrix read off the registry, and the sheet says which it is showing. */
rail('Insert');
await tick();
const withoutPage = [...d.querySelectorAll('.irow:not(.irow--own)')]
  .filter((r) => !r.querySelector('.irow__more'))
  .map((r) => r.querySelector('.irow__name')?.textContent)
  .filter((n) => !['Frame', 'Slot'].includes(n ?? ''));
check('every library component has a page', withoutPage.length ? withoutPage.join(', ') : 'none', 'none');

// Guards against the edit that deleted the canvas rules: every class the JSX
// renders must exist in the stylesheet.
const sheet = readFileSync(`${dist}/${readdirSync(dist).find((f) => f.endsWith('.css'))}`, 'utf8');
const rendered = new Set(
  [...d.querySelectorAll('[class]')]
    .flatMap((el) => String(el.className).split(/\s+/))
    .filter((c) => /^[a-z][a-z0-9_-]*$/.test(c) && !c.startsWith('nili')),
);
const unstyled = [...rendered].filter((c) => !sheet.includes(`.${c}`));
check('classes without a rule', unstyled.length ? unstyled.join(', ') : 'none', 'none');
check('no runtime errors', errors.length ? errors.join(' | ') : 'none', 'none');

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
process.exit(failed.length ? 1 : 0);
