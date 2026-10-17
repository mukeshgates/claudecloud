// Frame-accurate renderer: node render.mjs <scene.html> <seconds> <out-basename> [--alpha] [--query "k=v&k2=v2"]
// Writes PNG frames, then encodes <out>.mp4 (H.264, opaque) or <out>.mov (QuickTime Animation, with alpha).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const [, , scene, secondsArg, outBase, ...rest] = process.argv;
const alpha = rest.includes('--alpha');
const qi = rest.indexOf('--query');
const query = qi >= 0 ? rest[qi + 1] : '';
const fps = 30;
const frames = Math.round(Number(secondsArg) * fps);
const framesDir = `${outBase}_frames`;
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const url = 'file://' + path.resolve(scene) + (query || alpha ? '?' + [query, alpha ? 'alpha=1' : ''].filter(Boolean).join('&') : '');
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.render(t), f / fps);
  await page.screenshot(alpha ? { path: `${framesDir}/f${String(f).padStart(5, '0')}.png`, omitBackground: true } : { path: `${framesDir}/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 });
}
await browser.close();

const input = ['-y', '-framerate', String(fps), '-i', `${framesDir}/f%05d.${alpha ? 'png' : 'jpg'}`];
if (alpha) {
  execFileSync('ffmpeg', [...input, '-c:v', 'qtrle', '-pix_fmt', 'argb', `${outBase}.mov`], { stdio: 'ignore' });
} else {
  execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outBase}.mp4`], { stdio: 'ignore' });
}
rmSync(framesDir, { recursive: true, force: true });
console.log(`done ${outBase} (${frames} frames${alpha ? ', alpha' : ''})`);
