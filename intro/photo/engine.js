// Photo-composite engine. A scene is a list of real-image layers with keyframed
// camera moves, grades and effects. Everything on screen is a photograph, a
// document, a screenshot or a clip window; the engine only moves and grades.
//
// Layer fields
//   type     'image' (default) | 'card' (archive print) | 'text' | 'hole' | 'box' | 'bar' | 'under'
//   src      image path (relative to photo/)
//   t        [start, end] seconds the layer exists
//   in, out  fade seconds (default 0.4)
//   w, h     layer size in px (image: the box the photo fills, object-fit cover)
//   keys     [{at, x, y, s, r, o, blur}] keyframes; x,y = centre position; s = scale; r = rotate deg; o = opacity
//   grade    'red' | 'cold' | 'mono' | 'paper' | 'none'
//   mask     'vignette' | 'left' | 'right' | 'top' | 'bottom' | 'circle' | 'band'
//   blend    CSS mix-blend-mode
//   text     for 'text': the string; size, weight, color, align, letter, width, line; anim: 'type' | 'rise' | 'count'
//   rect     for hole/box/bar/under: [x, y, w, h]
//   cap      for 'card': caption printed under the photo
//
// Scene-level fx: { grain, vig, scan, leak, flicker, shake: [{at, amp, dur}] }
window.ENGINE = (() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeExpo = p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

  const stage = document.getElementById('stage');
  const grainC = document.querySelector('.grain');
  const leakEl = document.querySelector('.leak');
  const layers = [];
  let scene;

  const GRADES = {
    none: '',
    red: 'url(#duoRed)',
    cold: 'url(#duoCold)',
    mono: 'grayscale(1) contrast(1.12) brightness(.92)',
    paper: 'sepia(.35) saturate(.6) contrast(1.05) brightness(.95)',
  };
  const MASKS = {
    vignette: 'radial-gradient(ellipse at center, #000 40%, transparent 78%)',
    left: 'linear-gradient(90deg, #000 50%, transparent 100%)',
    right: 'linear-gradient(270deg, #000 50%, transparent 100%)',
    top: 'linear-gradient(180deg, #000 50%, transparent 100%)',
    bottom: 'linear-gradient(0deg, #000 50%, transparent 100%)',
    circle: 'radial-gradient(circle at center, #000 36%, transparent 40%)',
    band: 'linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%)',
  };

  function keyAt(keys, t, f, def) {
    const ks = keys.filter(k => k[f] !== undefined);
    if (!ks.length) return def;
    if (t <= ks[0].at) return ks[0][f];
    const last = ks[ks.length - 1];
    if (t >= last.at) return last[f];
    for (let i = 1; i < ks.length; i++) if (t <= ks[i].at) {
      const e = ks[i].ease === 'out' ? easeOut : ks[i].ease === 'expo' ? easeExpo : ks[i].ease === 'linear' ? (p => p) : easeInOut;
      return lerp(ks[i - 1][f], ks[i][f], e(seg(t, ks[i - 1].at, ks[i].at)));
    }
  }

  function build(def) {
    scene = def;
    for (const L of def.layers) {
      let el = document.createElement('div');
      el.className = 'layer';
      const w = L.w ?? 1920, h = L.h ?? 1080;
      if (L.type === 'text') {
        el.classList.add('txt');
        el.style.cssText += `font-size:${L.size || 72}px;font-weight:${L.weight || 800};color:${L.color || 'var(--ink)'};text-align:${L.align || 'left'};letter-spacing:${L.letter || 0}px;width:${L.width || 1400}px;line-height:${L.line || 1.05};${L.css || ''}`;
      } else if (L.type === 'hole') {
        el.classList.add('hole');
        el.style.cssText += `left:${L.rect[0]}px;top:${L.rect[1]}px;width:${L.rect[2]}px;height:${L.rect[3]}px`;
        el.textContent = L.label || 'CLIP';
      } else if (L.type === 'box' || L.type === 'bar' || L.type === 'under') {
        el.classList.add(L.type);
        el.style.cssText += `left:${L.rect[0]}px;top:${L.rect[1]}px;width:${L.rect[2]}px;height:${L.rect[3]}px;${L.type !== 'box' ? 'background:' + (L.color || 'var(--red)') : 'border-color:' + (L.color || 'var(--red)')}`;
      } else {
        if (L.type === 'card') el.classList.add('card');
        el.style.width = w + 'px'; el.style.height = h + 'px';
        const img = document.createElement('img');
        img.src = L.src;
        if (L.fit) img.style.objectFit = L.fit;
        if (L.pos) img.style.objectPosition = L.pos;
        if (L.grade && GRADES[L.grade]) img.style.filter = GRADES[L.grade];
        el.appendChild(img);
        if (L.type === 'card' && L.cap) { const c = document.createElement('div'); c.className = 'cap'; c.textContent = L.cap; el.appendChild(c); }
        if (L.mask) el.style.webkitMaskImage = el.style.maskImage = MASKS[L.mask];
      }
      if (L.blend) el.style.mixBlendMode = L.blend;
      if (L.cls) el.classList.add(L.cls);
      el.style.zIndex = L.z ?? 0;
      stage.appendChild(el);
      layers.push({ L, el, w, h });
    }
  }

  function render(t) {
    for (const { L, el, w, h } of layers) {
      const [a, b] = L.t || [0, scene.dur];
      if (t < a || t > b) { el.style.display = 'none'; continue; }
      el.style.display = '';
      const keys = L.keys || [];
      const x = keyAt(keys, t, 'x', L.x ?? 960), y = keyAt(keys, t, 'y', L.y ?? 540);
      const s = keyAt(keys, t, 's', L.s ?? 1), r = keyAt(keys, t, 'r', L.r ?? 0);
      const blur = keyAt(keys, t, 'blur', 0);
      const o = keyAt(keys, t, 'o', L.o ?? 1) * seg(t, a, a + (L.in ?? 0.4)) * (1 - seg(t, b - (L.out ?? 0.4), b));
      el.style.opacity = o;
      const local = t - a;
      if (L.type === 'text') {
        let txt = L.text;
        if (L.anim === 'type') { const n = Math.round(seg(local, 0, L.typeDur || 1) * L.text.length); txt = L.text.slice(0, n); }
        if (L.anim === 'count') { const v = lerp(L.from ?? 0, L.to, easeExpo(seg(local, 0, L.countDur || 1.4))); txt = (L.fmt || (v => Math.round(v)))(v); }
        el.textContent = txt;
        const rise = L.anim === 'rise' ? lerp(26, 0, easeOut(seg(local, 0, 0.7))) : 0;
        const ax = L.align === 'left' ? 0 : L.align === 'right' ? 100 : 50;
        el.style.transform = `translate(${x}px, ${y + rise}px) translate(-${ax}%, -50%) scale(${s})`;
      } else if (L.type === 'hole' || L.type === 'box') {
        el.style.transform = '';
      } else if (L.type === 'bar' || L.type === 'under') {
        el.style.transformOrigin = 'left center';
        el.style.transform = `scaleX(${easeExpo(seg(local, 0, L.grow ?? 0.5))})`;
      } else {
        el.style.transformOrigin = '50% 50%';
        el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s}) rotate(${r}deg)`;
        el.firstChild.style.filter = (L.grade && GRADES[L.grade] ? GRADES[L.grade] : '') + (blur ? ` blur(${blur}px)` : '');
      }
    }
    const E = scene.fx || {};
    if (E.leak) { const p = (t * 0.05) % 1; leakEl.style.background = `radial-gradient(ellipse 35% 55% at ${p * 150 - 25}% 25%, rgba(200,16,46,.18), transparent 70%)`; }
    let sx = 0, sy = 0;
    for (const sh of E.shake || []) if (t >= sh.at && t < sh.at + sh.dur) { const k = 1 - seg(t, sh.at, sh.at + sh.dur); sx += Math.sin(t * 97) * sh.amp * k; sy += Math.cos(t * 83) * sh.amp * k; }
    const flick = E.flicker ? 1 - 0.035 * Math.abs(Math.sin(t * 37) * Math.sin(t * 11)) : 1;
    stage.style.transform = `translate(${sx}px, ${sy}px)`;
    stage.style.filter = `brightness(${flick})`;
    grain(t, E.grain ?? 0.11);
  }

  function grain(t, strength) {
    const ctx = grainC.getContext('2d');
    const w = grainC.width, h = grainC.height;
    const img = ctx.createImageData(w, h);
    let s = Math.floor(t * 30) * 9301 + 49297;
    for (let i = 0; i < img.data.length; i += 4) {
      s = (s * 9301 + 49297) % 233280;
      const v = (s / 233280) * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255 * strength;
    }
    ctx.putImageData(img, 0, 0);
  }

  return { build, render };
})();
