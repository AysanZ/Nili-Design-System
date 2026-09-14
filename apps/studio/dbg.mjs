import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync, readdirSync } from 'node:fs';
const dist='dist/assets';
const bundle=readdirSync(dist).find(f=>f.endsWith('.js'));
const css=readdirSync(dist).find(f=>f.endsWith('.css'));
const errs=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>errs.push(e.message.split('\n')[0]));
const dom=new JSDOM(`<!doctype html><html><head><style>${readFileSync(`${dist}/${css}`)}</style></head><body><div id="root"></div></body></html>`,
 {runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc,url:'http://localhost/'});
const {document:d,window:w}=dom.window;
w.matchMedia=q=>({matches:false,media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
w.eval(readFileSync(`${dist}/${bundle}`,'utf8'));
const tick=(ms=200)=>new Promise(r=>setTimeout(r,ms));
const click=el=>el?.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
await tick(700);
if(errs.length){console.log('BOOT ERRORS',errs);process.exit(1);}

console.log('html data-ui      :', d.documentElement.dataset.ui, '| data-theme:', d.documentElement.dataset.theme);
console.log('resize handles    :', d.querySelectorAll('.resize-handle').length);
console.log('grid columns      :', d.querySelector('.studio').style.getPropertyValue('--left-width'));

click(d.querySelector('.bottom-bar__insert')); await tick(300);
const tiles=[...d.querySelectorAll('.asset')];
console.log('asset tiles       :', tiles.length);
console.log('tiles with preview:', tiles.filter(t=>t.querySelector('.asset__preview')?.children[0]?.children.length).length);
console.log('tiles draggable   :', tiles.filter(t=>t.getAttribute('draggable')==='true').length);
console.log('tile is div       :', tiles[1]?.tagName);

// canvas node must now be draggable too
const node=d.querySelector('.node--component');
console.log('canvas node drag  :', node.getAttribute('draggable'));

// context menu must inherit chrome variables now
node.dispatchEvent(new w.MouseEvent('contextmenu',{bubbles:true,clientX:200,clientY:200}));
await tick();
const menu=d.querySelector('.context-menu');
console.log('menu in .studio   :', !!menu?.closest('.studio'));
console.log('menu colour       :', w.getComputedStyle(menu).color, '| bg', w.getComputedStyle(menu).backgroundColor);
console.log(errs.length?`ERRORS ${errs}`:'no runtime errors');
