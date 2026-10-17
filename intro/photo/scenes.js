// Intro scenes, v2. Each scene's t=0 is its film-clock start.
// Every image is a Commons photo or a cutout of one (assets/CREDITS.md). Layers sit at depths
// so the camera push and drift separate them; type is small and sparse.
const A = '../assets/';
const LOGOS = ['nvidia', 'apple', 'microsoft', 'amazon', 'alphabet', 'meta', 'tesla'];
const LABEL = { size: 22, weight: 600, letter: 5, color: 'var(--ink2)', align: 'left' };

const SCENES = {

  // 0:10-0:15  N: "Thirty-five cents of every dollar now sits in just seven tech companies."
  s03_35cents: {
    dur: 5,
    fx: { grain: 0.09, push: [1, 1.06], drift: 6 },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'vignette', depth: 0.1, w: 2100, h: 1180, pos: '50% 30%', blur: 7, o: 0.5 },
      { type: 'shaft', angle: 112, strength: 0.14, spread: 55, depth: 0.3 },
      { type: 'dust', count: 70, depth: 0.6, strength: 0.8 },
      { type: 'text', text: '35¢', anim: 'count', from: 0, to: 35, countDur: 1.5, fmt: v => Math.round(v) + '¢', size: 300, weight: 700, letter: -10, align: 'left', x: 150, y: 470, t: [0.1, 5], in: 0.3, depth: 0.7 },
      { type: 'text', ...LABEL, text: 'OF EVERY RETIREMENT DOLLAR', x: 160, y: 650, t: [0.9, 5], anim: 'rise', depth: 0.7 },
      { type: 'under', rect: [160, 680, 120, 3], t: [1.1, 5], grow: 0.6 },
      ...LOGOS.map((n, i) => ({
        type: 'card', cls: 'tag', src: A + `logo_${n}.png`, fit: 'contain', w: 150, h: 92, depth: 0.8, t: [2.4 + i * 0.1, 5], in: 0.2, shadow: true,
        keys: [{ at: 2.4 + i * 0.1, x: 830 + i * 165, y: 905, s: 0.7, r: -6 + i * 2 }, { at: 2.8 + i * 0.1, x: 830 + i * 165, y: 880, s: 1, r: -3 + i, ease: 'out' }],
      })),
      { type: 'text', ...LABEL, text: 'SEVEN COMPANIES', x: 760, y: 790, t: [2.3, 5], anim: 'rise', depth: 0.8 },
    ],
  },

  // 0:15-0:24  CNBC then Bloomberg in the window. Render with --alpha and lay over the clips.
  s04_news: {
    dur: 9,
    fx: { grain: 0.08, push: [1, 1.04], drift: 5, shake: [{ at: 5.1, amp: 4, dur: 0.35 }] },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'right', depth: 0.1, w: 1200, h: 1200, x: 1400, y: 540, pos: '55% 45%', blur: 9, o: 0.45 },
      { type: 'dust', count: 50, depth: 0.5, strength: 0.6 },
      { type: 'hole', rect: [120, 190, 1120, 630], label: 'CLIP: CNBC, then BLOOMBERG at 5.0 s', in: 0.3 },
      { type: 'bar', rect: [120, 140, 3, 28], t: [0.2, 9], grow: 0.2 },
      { type: 'text', ...LABEL, color: 'var(--ink)', text: 'CNBC  ·  16 OCT 2026', x: 140, y: 154, t: [0.3, 5.0], anim: 'type', typeDur: 0.5 },
      { type: 'text', ...LABEL, color: 'var(--ink)', text: 'BLOOMBERG  ·  15 OCT 2026', x: 140, y: 154, t: [5.0, 9], in: 0.1, anim: 'type', typeDur: 0.5 },
      { type: 'text', text: '9', anim: 'count', from: 0, to: 9, countDur: 4.2, fmt: v => String(Math.round(v)), size: 220, weight: 700, align: 'left', x: 1340, y: 420, t: [0.3, 5.0], depth: 0.7 },
      { type: 'text', ...LABEL, text: 'SESSIONS DOWN IN A ROW', x: 1345, y: 560, t: [0.6, 5.0], anim: 'rise', depth: 0.7 },
      { type: 'text', ...LABEL, color: 'var(--red)', text: 'LONGEST SINCE 2006', x: 1345, y: 600, t: [3.4, 5.0], anim: 'rise', depth: 0.7 },
      { type: 'text', text: 'holding\nthe bag?', size: 88, weight: 700, letter: -2, line: 1.0, align: 'left', x: 1340, y: 520, t: [5.2, 9], in: 0.15, anim: 'type', typeDur: 0.8, depth: 0.7 },
      { type: 'under', rect: [1345, 612, 140, 3], t: [6.1, 9], grow: 0.5 },
    ],
  },

  // 0:24-0:37  "The head of the IMF put it plainly", then her clip, then the pull quote.
  s05_georgieva: {
    dur: 13,
    fx: { grain: 0.09, push: [1, 1.09], drift: 7, shake: [{ at: 11.0, amp: 8, dur: 0.9 }] },
    layers: [
      { src: A + 'photo_imf_hq.jpg', grade: 'cold', mask: 'vignette', depth: 0.05, w: 2300, h: 1300, x: 1000, y: 500, pos: '50% 40%', blur: 6, o: 0.55, out: 1.0 },
      { type: 'shaft', angle: 120, strength: 0.18, spread: 50, depth: 0.2 },
      { type: 'dust', count: 90, depth: 0.5 },
      // Subject plane: the cutout, near the camera, lit from the shaft side.
      { src: A + 'cut_georgieva.png', grade: 'subject', fit: 'contain', depth: 0.85, shadow: true, w: 1300, h: 860, pos: '50% 100%', t: [0.3, 4.9], in: 0.6, out: 0.5,
        keys: [{ at: 0.3, x: 1340, y: 700, s: 1.0 }, { at: 4.4, x: 1310, y: 690, s: 1.06, ease: 'linear' }, { at: 4.9, x: 1600, y: 720, s: 1.1, ease: 'inOut' }] },
      { type: 'bar', rect: [120, 820, 3, 60], t: [1.2, 4.6], grow: 0.3, out: 0.3 },
      { type: 'text', text: 'Kristalina Georgieva', size: 44, weight: 700, align: 'left', x: 142, y: 836, t: [1.3, 4.6], anim: 'rise', out: 0.3, depth: 0.6 },
      { type: 'text', ...LABEL, text: 'MANAGING DIRECTOR, IMF', x: 143, y: 876, t: [1.5, 4.6], anim: 'rise', out: 0.3, depth: 0.6 },
      // 0:28 the clip takes the frame.
      { type: 'hole', rect: [120, 150, 1180, 664], label: 'CLIP: GEORGIEVA, IMF, 13 OCT 2026', t: [4.3, 13], in: 0.3 },
      { type: 'bar', rect: [120, 100, 3, 28], t: [4.5, 13], grow: 0.2 },
      { type: 'text', ...LABEL, color: 'var(--ink)', text: 'IMF  ·  13 OCT 2026', x: 140, y: 114, t: [4.6, 13], anim: 'type', typeDur: 0.5 },
      { src: A + 'cut_georgieva.png', grade: 'subject', fit: 'contain', depth: 0.8, shadow: true, w: 640, h: 420, pos: '50% 100%', t: [4.6, 13], in: 0.5,
        keys: [{ at: 4.6, x: 1660, y: 900, s: 0.9 }, { at: 13, x: 1640, y: 890, s: 0.96, ease: 'linear' }] },
      // Pull quote lands as she says it (about 0:31), red stroke under "one leg", shake on "wobbles" (about 0:35).
      { type: 'text', text: 'standing on one leg.', size: 64, weight: 700, letter: -1, align: 'left', x: 120, y: 930, t: [7.0, 13], anim: 'type', typeDur: 1.0, depth: 0.6 },
      { type: 'under', rect: [470, 968, 240, 3], t: [8.2, 13], grow: 0.4 },
      { type: 'text', text: 'what if it wobbles?', size: 64, weight: 700, letter: -1, color: 'var(--red)', align: 'left', x: 120, y: 930, t: [10.9, 13], in: 0.1, anim: 'type', typeDur: 0.6, depth: 0.6 },
    ],
  },

  // 0:37-0:42  "If the bet fails, your savings take the hit. If it works, your job does."
  s06_outcomes: {
    dur: 5,
    fx: { grain: 0.09, push: [1, 1.05], drift: 6, flicker: true },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'vignette', depth: 0.1, w: 2100, h: 1180, pos: '50% 50%', blur: 10, o: 0.35 },
      { type: 'dust', count: 60, depth: 0.5, strength: 0.7 },
      { type: 'text', ...LABEL, text: 'IF THE BET FAILS', x: 160, y: 430, t: [0.1, 5], anim: 'rise', depth: 0.6 },
      { type: 'text', text: 'your savings', size: 96, weight: 700, letter: -3, align: 'left', x: 155, y: 510, t: [0.3, 5], anim: 'type', typeDur: 0.7, depth: 0.6 },
      { type: 'under', rect: [160, 575, 120, 3], t: [1.0, 5], grow: 0.5 },
      { type: 'bar', rect: [959, 300, 1, 480], color: 'rgba(235,232,225,.18)', t: [2.4, 5], grow: 0.3 },
      { type: 'text', ...LABEL, text: 'IF IT WORKS', x: 1040, y: 430, t: [2.6, 5], anim: 'rise', depth: 0.6 },
      { type: 'text', text: 'your job', size: 96, weight: 700, letter: -3, color: 'var(--red)', align: 'left', x: 1035, y: 510, t: [2.8, 5], anim: 'type', typeDur: 0.6, depth: 0.6 },
      { type: 'under', rect: [1040, 575, 120, 3], t: [3.5, 5], grow: 0.5 },
    ],
  },

  // After the Musk clip  "Either way, the people who own the machines come out with more money, and more say over your life."
  s08_owners: {
    dur: 6,
    fx: { grain: 0.1, push: [1, 1.1], drift: 7 },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'vignette', depth: 0.05, w: 2300, h: 1300, pos: '50% 35%', blur: 12, o: 0.4 },
      { type: 'shaft', angle: 100, strength: 0.14, spread: 60, depth: 0.2 },
      { type: 'dust', count: 100, depth: 0.5 },
      // Three people at three depths: Musk far centre, Dimon mid left, Ellison near right.
      { src: A + 'cut_musk.png', grade: 'subject', fit: 'contain', depth: 0.45, shadow: true, w: 700, h: 840, pos: '50% 100%', t: [0.6, 6], in: 0.7,
        keys: [{ at: 0.6, x: 960, y: 700, s: 0.95, blur: 1.5 }, { at: 6, x: 960, y: 690, s: 1.0, blur: 1.5, ease: 'linear' }] },
      { src: A + 'cut_dimon.png', grade: 'subject', fit: 'contain', depth: 0.65, shadow: true, w: 900, h: 720, pos: '50% 100%', t: [0.2, 6], in: 0.7,
        keys: [{ at: 0.2, x: 470, y: 740, s: 1.0 }, { at: 6, x: 450, y: 735, s: 1.05, ease: 'linear' }] },
      { src: A + 'cut_ellison.png', grade: 'subject', fit: 'contain', depth: 0.9, shadow: true, w: 560, h: 745, pos: '50% 100%', t: [1.0, 6], in: 0.7,
        keys: [{ at: 1.0, x: 1530, y: 760, s: 1.0 }, { at: 6, x: 1550, y: 750, s: 1.07, ease: 'linear' }] },
      { type: 'bar', rect: [120, 92, 3, 28], t: [2.8, 6], grow: 0.2 },
      { type: 'text', ...LABEL, color: 'var(--ink)', text: 'MORE MONEY. MORE SAY OVER YOUR LIFE.', x: 140, y: 106, t: [3.0, 6], anim: 'type', typeDur: 1.1 },
    ],
  },
};

// Lower third: thin red rule, name, role in small caps. Render with --alpha over the clip.
function LOWER_THIRD(name, role, date, dur) {
  return {
    dur,
    fx: { grain: 0, drift: 0 },
    layers: [
      { type: 'bar', rect: [120, 870, 3, 76], t: [0, dur], grow: 0.25, out: 0.3 },
      { type: 'text', text: name, size: 44, weight: 700, align: 'left', x: 142, y: 890, t: [0.2, dur], in: 0.3, out: 0.3, anim: 'rise' },
      { type: 'text', ...LABEL, text: (role + (date ? '  ·  ' + date : '')).toUpperCase(), x: 143, y: 932, t: [0.4, dur], in: 0.3, out: 0.3, anim: 'rise' },
    ],
  };
}
