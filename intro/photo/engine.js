// Photo-composite engine, v2: depth and atmosphere.
// A scene is a stack of real-image layers. Each layer sits at a depth (0 = far, 1 = near);
// the camera drifts and pushes, and every layer moves by its depth, so photos separate
// into planes. Nothing is drawn except atmosphere (dust, light) and type.
//
// Layer fields
//   type   'image' (default) | 'card' | 'text' | 'hole' | 'bar' | 'under' | 'dust' | 'shaft'
//   src    image path
//   t      [start, end] seconds (default: whole scene);  in / out fade seconds (default 0.5)
//   w, h   layer box in px;  fit 'cover' | 'contain';  pos object-position
//   depth  0..1 parallax amount (default 0.5);  shadow: true adds a soft drop shadow (cutouts)
//   keys   [{at, x, y, s, r, o, blur, ease}] keyframes, eased between
//   grade  'cold' | 'mono' | 'subject' | 'paper' | 'none';  mask 'vignette' | 'left' | 'right' | 'bottom' | 'band'
//   text   string; size, weight, color, align, letter, width, line, css; anim 'type' | 'rise' | 'count' (from, to, fmt)
//   rect   [x, y, w, h] for hole / bar / under
// Scene fx: { grain, drift, push: [from, to], shake: [{at, amp, dur}], flicker }
window.ENGINE = (() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    out: p => 1 - Math.pow(1 - p, 3),
    expo: p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    linear: p => p,
  };

  const stage = document.getElementById('stage');
  const grainC = document.querySelector('.grain');
  const layers = [];
  let scene;

  const GRADES = {
    none: '',
    cold: 'url(#cold)',
    mono: 'grayscale(1) contrast(1.1) brightness(.9)',
    subject: 'saturate(.72) contrast(1.08) brightness(.96)',
    paper: 'sepia(.3) saturate(.6) contrast(1.05) brightness(.95)',
  };
  const MASKS = {
    vignette: 'radial-gradient(ellipse at center, #000 35%, transparent 78%)',
    left: 'linear-gradient(90deg, #000 45%, transparent 100%)',
    right: 'linear-gradient(270deg, #000 45%, transparent 100%)',
    bottom: 'linear-gradient(0deg, #000 45%, transparent 100%)',
    band: 'linear-gradient(180deg, transparent 0%, #000 20%, #000 80%, transparent 100%)',
  };

  function keyAt(keys, t, f, def) {
    const ks = keys.filter(k => k[f] !== undefined);
    if (!ks.length) return def;
    if (t <= ks[0].at) return ks[0][f];
    const last = ks[ks.length - 1];
    if (t >= last.at) return last[f];
    for (let i = 1; i < ks.length; i++) if (t <= ks[i].at) {
      const e = E[ks[i].ease || 'inOut'];
      return lerp(ks[i - 1][f], ks[i][f], e(seg(t, ks[i - 1].at, ks[i].at)));
    }
  }

  function build(def) {
    scene = def;
    for (const L of def.layers) {
      const el = document.createElement('div');
      el.className = 'layer';
      const w = L.w ?? 1920, h = L.h ?? 1080;
      if (L.type === 'text') {
        el.classList.add('txt');
        el.style.cssText += `font-size:${L.size || 60}px;font-weight:${L.weight || 700};color:${L.color || 'var(--ink)'};text-align:${L.align || 'left'};letter-spacing:${L.letter || 0}px;width:${L.width || 1400}px;line-height:${L.line || 1.1};${L.css || ''}`;
      } else if (L.type === 'hole') {
        el.classList.add('hole');
        el.style.cssText += `left:${L.rect[0]}px;top:${L.rect[1]}px;width:${L.rect[2]}px;height:${L.rect[3]}px`;
        el.textContent = L.label || 'CLIP';
      } else if (L.type === 'bar' || L.type === 'under') {
        el.classList.add(L.type);
        el.style.cssText += `left:${L.rect[0]}px;top:${L.rect[1]}px;width:${L.rect[2]}px;height:${L.rect[3]}px;background:${L.color || 'var(--red)'}`;
      } else if (L.type === 'dust') {
        el.classList.add('dust');
        const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; el.appendChild(c);
        L._pts = Array.from({ length: L.count || 90 }, (_, i) => ({ x: (i * 977) % 1920, y: (i * 613) % 1080, r: 0.5 + (i % 5) * 0.35, sp: 5 + (i % 7) * 2.5, ph: i * 1.7 }));
      } else if (L.type === 'shaft') {
        el.classList.add('shaft');
        el.style.background = `linear-gradient(${L.angle ?? 115}deg, rgba(255,246,230,${L.strength ?? 0.16}) 0%, transparent ${L.spread ?? 48}%)`;
      } else {
        if (L.type === 'card') el.classList.add('card');
        el.style.width = w + 'px'; el.style.height = h + 'px';
        const img = document.createElement('img');
        img.src = L.src;
        img.style.objectFit = L.fit || 'cover';
        if (L.pos) img.style.objectPosition = L.pos;
        el.appendChild(img);
        if (L.type === 'card' && L.cap) { const c = document.createElement('div'); c.className = 'cap'; c.textContent = L.cap; el.appendChild(c); }
        if (L.mask) el.style.webkitMaskImage = el.style.maskImage = MASKS[L.mask];
      }
      if (L.blend) el.style.mixBlendMode = L.blend;
      if (L.cls) el.classList.add(L.cls);
      el.style.zIndex = L.z ?? Math.round((L.depth ?? 0.5) * 100);
      stage.appendChild(el);
      layers.push({ L, el, w, h });
    }
  }

  function render(t) {
    const F = scene.fx || {};
    // Camera: slow push plus a handheld drift. Each layer moves by its depth.
    const push = F.push ? lerp(F.push[0], F.push[1], E.linear(seg(t, 0, scene.dur))) : 1;
    const drift = F.drift ?? 8;
    const cx = Math.sin(t * 0.37) * drift + Math.sin(t * 0.91) * drift * 0.3;
    const cy = Math.cos(t * 0.29) * drift * 0.7 + Math.sin(t * 0.77) * drift * 0.25;
    let sx = 0, sy = 0;
    for (const sh of F.shake || []) if (t >= sh.at && t < sh.at + sh.dur) { const k = 1 - seg(t, sh.at, sh.at + sh.dur); sx += Math.sin(t * 97) * sh.amp * k; sy += Math.cos(t * 83) * sh.amp * k; }

    for (const { L, el, w, h } of layers) {
      const [a, b] = L.t || [0, scene.dur];
      if (t < a || t > b) { el.style.display = 'none'; continue; }
      el.style.display = '';
      const keys = L.keys || [];
      const d = L.depth ?? 0.5;
      const px = (cx + sx) * (0.4 + d * 1.2), py = (cy + sy) * (0.4 + d * 1.2);
      const ps = 1 + (push - 1) * (0.5 + d);
      const x = keyAt(keys, t, 'x', L.x ?? 960) + px, y = keyAt(keys, t, 'y', L.y ?? 540) + py;
      const s = keyAt(keys, t, 's', L.s ?? 1) * ps, r = keyAt(keys, t, 'r', L.r ?? 0);
      const blur = keyAt(keys, t, 'blur', L.blur ?? 0);
      const o = keyAt(keys, t, 'o', L.o ?? 1) * seg(t, a, a + (L.in ?? 0.5)) * (1 - seg(t, b - (L.out ?? 0.5), b));
      el.style.opacity = o;
      const local = t - a;
      if (L.type === 'text') {
        let txt = L.text;
        if (L.anim === 'type') txt = L.text.slice(0, Math.round(seg(local, 0, L.typeDur || 1) * L.text.length));
        if (L.anim === 'count') { const v = lerp(L.from ?? 0, L.to, E.expo(seg(local, 0, L.countDur || 1.4))); txt = (L.fmt || (v => Math.round(v)))(v); }
        el.textContent = txt;
        const rise = L.anim === 'rise' ? lerp(22, 0, E.out(seg(local, 0, 0.8))) : 0;
        const ax = L.align === 'left' ? 0 : L.align === 'right' ? 100 : 50;
        el.style.transform = `translate(${x}px, ${y + rise}px) translate(-${ax}%, -50%) scale(${keyAt(keys, t, 's', L.s ?? 1)})`;
      } else if (L.type === 'hole') {
        el.style.transform = '';
      } else if (L.type === 'bar' || L.type === 'under') {
        el.style.transformOrigin = 'left center';
        el.style.transform = `scaleX(${E.expo(seg(local, 0, L.grow ?? 0.5))})`;
      } else if (L.type === 'dust') {
        dust(el.firstChild, L, t);
        el.style.transform = `translate(${px * 0.5}px, ${py * 0.5}px)`;
      } else if (L.type === 'shaft') {
        el.style.transform = `translate(${Math.sin(t * 0.21) * 40}px, 0)`;
      } else {
        el.style.transformOrigin = '50% 50%';
        el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) scale(${s}) rotate(${r}deg)`;
        const g = L.grade && GRADES[L.grade] ? GRADES[L.grade] : '';
        const sh = L.shadow ? ' drop-shadow(0 30px 40px rgba(0,0,0,.55))' : '';
        el.firstChild.style.filter = g + (blur ? ` blur(${blur}px)` : '') + sh;
      }
    }
    stage.style.filter = F.flicker ? `brightness(${1 - 0.03 * Math.abs(Math.sin(t * 37) * Math.sin(t * 11))})` : '';
    grain(t, F.grain ?? 0.1);
  }

  // Dust: soft motes drifting up and sideways, deterministic in t so frames are repeatable.
  function dust(c, L, t) {
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 1920, 1080);
    for (const p of L._pts) {
      const y = ((p.y - t * p.sp) % 1180 + 1180) % 1180 - 50;
      const x = p.x + Math.sin(t * 0.5 + p.ph) * 30;
      const a = (0.07 + 0.09 * Math.sin(t * 1.3 + p.ph)) * (L.strength ?? 1);
      const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 3);
      g.addColorStop(0, `rgba(255,244,225,${a})`); g.addColorStop(1, 'rgba(255,244,225,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.r * 3, 0, 7); ctx.fill();
    }
  }

  const tiles = [];
  function makeTiles() {
    for (let k = 0; k < 10; k++) {
      const c = document.createElement('canvas'); c.width = 480; c.height = 270;
      const ctx = c.getContext('2d'); const img = ctx.createImageData(480, 270);
      let s = k * 7919 + 13;
      for (let i = 0; i < img.data.length; i += 4) { s = (s * 9301 + 49297) % 233280; const v = (s / 233280) * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      ctx.putImageData(img, 0, 0); tiles.push(c);
    }
  }
  function grain(t, strength) {
    if (!tiles.length) makeTiles();
    const ctx = grainC.getContext('2d');
    ctx.clearRect(0, 0, grainC.width, grainC.height);
    ctx.globalAlpha = strength;
    const f = Math.floor(t * 30), tile = tiles[f % 10];
    const ox = (f * 37) % 480 - 480, oy = (f * 53) % 270 - 270;
    for (let x = ox; x < grainC.width; x += 1440) for (let y = oy; y < grainC.height; y += 810) ctx.drawImage(tile, x, y, 1440, 810);
    ctx.globalAlpha = 1;
  }

  return { build, render };
})();
