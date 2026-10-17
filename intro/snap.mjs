// node snap.mjs <scene.html?query> <out-prefix> t1 t2 ... : stills for checking layout.
import { chromium } from 'playwright';
import path from 'node:path';
const [, , scene, prefix, ...ts] = process.argv;
const [file, q] = scene.split('?');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve(file) + (q ? '?' + q : ''));
await p.evaluate(() => document.fonts.ready);
for (const t of ts) { await p.evaluate(x => window.render(x), Number(t)); await p.screenshot({ path: `${prefix}-${t}.png` }); }
await b.close();
