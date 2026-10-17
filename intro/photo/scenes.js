// Intro scenes, 0:10 to 0:52 on the film clock. Each scene's t=0 is the film time in its name.
// Assets are real photos from Wikimedia Commons (see ../assets/CREDITS.md). Nothing is drawn.
const A = '../assets/';
const LOGOS = ['nvidia', 'apple', 'microsoft', 'amazon', 'alphabet', 'meta', 'tesla'];

const SCENES = {

  // 0:10-0:15  N: "Thirty-five cents of every dollar now sits in just seven tech companies."
  s03_35cents: {
    dur: 5,
    fx: { grain: 0.12, shake: [] },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'vignette', w: 1920, h: 1080, pos: '50% 35%',
        keys: [{ at: 0, x: 960, y: 540, s: 1.12 }, { at: 5, x: 940, y: 520, s: 1.2, ease: 'linear' }], o: 0.45 },
      { type: 'text', text: '35¢', anim: 'count', from: 0, to: 35, countDur: 1.6, fmt: v => Math.round(v) + '¢',
        size: 420, weight: 900, color: 'var(--ink)', align: 'left', x: 150, y: 430, t: [0.1, 5], in: 0.2, letter: -12 },
      { type: 'text', text: 'of every dollar', anim: 'rise', size: 64, weight: 600, color: 'var(--ink2)', align: 'left', x: 160, y: 680, t: [0.9, 5] },
      { type: 'under', rect: [160, 735, 440, 8], t: [1.0, 5], grow: 0.6 },
      // Seven paper tags, one per company, dropping in on "seven".
      ...LOGOS.map((n, i) => ({
        type: 'card', cls: 'tag', src: A + `logo_${n}.png`, w: 200, h: 120, t: [2.3 + i * 0.12, 5], in: 0.15,
        keys: [{ at: 2.3 + i * 0.12, x: 1180 + (i % 4) * 215 - (i > 3 ? 108 : 0), y: (i > 3 ? 905 : 760) - 60, s: 0.6, r: -8 + i * 3 },
               { at: 2.65 + i * 0.12, x: 1180 + (i % 4) * 215 - (i > 3 ? 108 : 0), y: i > 3 ? 905 : 760, s: 1, r: -4 + i * 1.5, ease: 'out' }],
      })),
      { type: 'text', text: 'JUST SEVEN COMPANIES', size: 30, weight: 800, color: 'var(--red)', letter: 6, align: 'center', x: 1455, y: 640, t: [2.2, 5], anim: 'rise' },
    ],
  },

  // 0:15-0:24  CNBC clip then Bloomberg clip in the window. Alpha render: the window is a hole.
  s04_news: {
    dur: 9,
    fx: { grain: 0.1, leak: true, shake: [{ at: 5.1, amp: 5, dur: 0.4 }] },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'red', mask: 'right', w: 1100, h: 1080, x: 1370, y: 540, pos: '60% 50%', o: 0.5,
        keys: [{ at: 0, s: 1.05, y: 560 }, { at: 9, s: 1.12, y: 520, ease: 'linear' }] },
      { type: 'hole', rect: [120, 200, 1120, 630], label: 'CLIP · CNBC then BLOOMBERG', t: [0, 9], in: 0.3 },
      { type: 'bar', rect: [120, 140, 12, 44], t: [0.2, 9], grow: 0.2 },
      { type: 'text', text: 'CNBC  ·  16 OCT 2026', size: 28, weight: 800, letter: 4, align: 'left', x: 150, y: 162, t: [0.3, 5.0], anim: 'type', typeDur: 0.5 },
      { type: 'text', text: 'BLOOMBERG  ·  15 OCT 2026', size: 28, weight: 800, letter: 4, align: 'left', x: 150, y: 162, t: [5.0, 9], in: 0.1, anim: 'type', typeDur: 0.5 },
      // Right column: the count of down days ticks up with the CNBC line, then the "bag" question.
      { type: 'text', text: '9', anim: 'count', from: 0, to: 9, countDur: 4.2, fmt: v => String(Math.round(v)),
        size: 300, weight: 900, align: 'left', x: 1330, y: 420, t: [0.3, 5.0], letter: -8 },
      { type: 'text', text: 'SESSIONS DOWN\nIN A ROW', size: 34, weight: 800, color: 'var(--ink2)', letter: 5, align: 'left', x: 1340, y: 640, line: 1.25, t: [0.6, 5.0], anim: 'rise' },
      { type: 'text', text: 'LONGEST SINCE 2006', size: 26, weight: 700, color: 'var(--red)', letter: 5, align: 'left', x: 1340, y: 760, t: [3.4, 5.0], anim: 'rise' },
      { type: 'text', text: 'holding\nthe bag?', size: 120, weight: 900, align: 'left', x: 1330, y: 540, line: 1.0, letter: -3, t: [5.2, 9], in: 0.15, anim: 'type', typeDur: 0.8 },
      { type: 'under', rect: [1335, 650, 430, 10], t: [6.1, 9], grow: 0.5 },
    ],
  },

  // 0:24-0:37  N: "The head of the International Monetary Fund put it plainly." then the clip, then the pull quote.
  s05_georgieva: {
    dur: 13,
    fx: { grain: 0.12, shake: [{ at: 11.0, amp: 9, dur: 0.9 }] },
    layers: [
      { src: A + 'photo_imf_hq.jpg', grade: 'cold', mask: 'vignette', w: 1920, h: 1080, pos: '50% 40%', o: 0.55,
        keys: [{ at: 0, s: 1.0, y: 560 }, { at: 4, s: 1.18, y: 520 }, { at: 13, s: 1.26, y: 500, ease: 'linear' }], t: [0, 13], out: 0.8 },
      { type: 'text', text: 'INTERNATIONAL MONETARY FUND  ·  WASHINGTON', size: 26, weight: 700, letter: 6, color: 'var(--ink2)', align: 'left', x: 120, y: 960, t: [0.4, 4.2], anim: 'type', typeDur: 1.2 },
      // Archive card of Georgieva slides in from the right, tilted, then settles.
      { type: 'card', src: A + 'photo_georgieva.jpg', grade: 'paper', cap: 'KRISTALINA GEORGIEVA  ·  MANAGING DIRECTOR, IMF', w: 760, h: 600, pos: '50% 20%', t: [1.6, 13], in: 0.3,
        keys: [{ at: 1.6, x: 1500, y: 620, s: 0.9, r: 7 }, { at: 2.4, x: 1280, y: 560, s: 1, r: 3, ease: 'out' },
               { at: 4.0, x: 1280, y: 560, s: 1, r: 3 }, { at: 4.6, x: 1620, y: 860, s: 0.42, r: -4 }] },
      // 0:28 the clip takes the frame.
      { type: 'hole', rect: [120, 150, 1180, 664], label: 'CLIP · GEORGIEVA · IMF · 13 OCT 2026', t: [4.3, 13], in: 0.25 },
      { type: 'bar', rect: [120, 92, 12, 42], t: [4.5, 13], grow: 0.2 },
      { type: 'text', text: 'IMF  ·  13 OCT 2026', size: 28, weight: 800, letter: 4, align: 'left', x: 150, y: 113, t: [4.6, 13], anim: 'type', typeDur: 0.5 },
      // Pull quote lands as she says it (about 0:31), underline on "one leg", shake on "wobbles" (about 0:35).
      { type: 'text', text: 'standing on one leg.', size: 78, weight: 900, align: 'left', x: 120, y: 930, letter: -2, t: [7.0, 13], anim: 'type', typeDur: 1.0 },
      { type: 'under', rect: [548, 975, 290, 10], t: [8.2, 13], grow: 0.4 },
      { type: 'text', text: 'what if it wobbles?', size: 78, weight: 900, color: 'var(--red)', align: 'left', x: 120, y: 930, letter: -2, t: [10.9, 13], in: 0.1, anim: 'type', typeDur: 0.6 },
    ],
  },

  // 0:37-0:42  N: "If the bet fails, your savings take the hit. If it works, your job does."
  s06_outcomes: {
    dur: 5,
    fx: { grain: 0.12, flicker: true },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'red', mask: 'left', w: 960, h: 1080, x: 420, y: 540, pos: '40% 50%', o: 0.6, t: [0, 5],
        keys: [{ at: 0, s: 1.1 }, { at: 5, s: 1.18, ease: 'linear' }] },
      { type: 'text', text: 'IF THE BET FAILS', size: 30, weight: 800, letter: 6, color: 'var(--ink2)', align: 'left', x: 130, y: 400, t: [0.1, 5], anim: 'rise' },
      { type: 'text', text: 'your savings', size: 120, weight: 900, align: 'left', x: 120, y: 500, letter: -4, t: [0.3, 5], anim: 'type', typeDur: 0.7 },
      { type: 'under', rect: [125, 585, 690, 10], t: [1.0, 5], grow: 0.5 },
      { type: 'bar', rect: [958, 140, 4, 800], color: '#2a2c33', t: [2.4, 5], grow: 0.3 },
      { type: 'text', text: 'IF IT WORKS', size: 30, weight: 800, letter: 6, color: 'var(--ink2)', align: 'left', x: 1040, y: 400, t: [2.6, 5], anim: 'rise' },
      { type: 'text', text: 'your job', size: 120, weight: 900, color: 'var(--red)', align: 'left', x: 1030, y: 500, letter: -4, t: [2.8, 5], anim: 'type', typeDur: 0.6 },
      { type: 'under', rect: [1035, 585, 480, 10], t: [3.5, 5], grow: 0.5 },
    ],
  },

  // After the Musk clip  N: "Either way, the people who own the machines come out with more money, and more say over your life."
  s08_owners: {
    dur: 6,
    fx: { grain: 0.13 },
    layers: [
      { src: A + 'photo_nyse_floor.jpg', grade: 'cold', mask: 'vignette', w: 1920, h: 1080, pos: '50% 30%', o: 0.35, t: [0, 6],
        keys: [{ at: 0, s: 1.25, blur: 6 }, { at: 6, s: 1.32, blur: 6, ease: 'linear' }] },
      { type: 'card', src: A + 'photo_dimon.jpg', grade: 'paper', cap: 'JAMIE DIMON  ·  JPMORGAN', w: 560, h: 520, pos: '60% 15%', t: [0.2, 6], in: 0.25,
        keys: [{ at: 0.2, x: 420, y: 700, s: 0.9, r: -10 }, { at: 0.8, x: 440, y: 560, s: 1, r: -6, ease: 'out' }, { at: 6, x: 445, y: 550, s: 1.03, r: -6, ease: 'linear' }] },
      { type: 'card', src: A + 'photo_musk.jpg', grade: 'paper', cap: 'ELON MUSK  ·  TESLA, XAI', w: 560, h: 520, pos: '50% 12%', t: [0.7, 6], in: 0.25,
        keys: [{ at: 0.7, x: 960, y: 720, s: 0.9, r: 6 }, { at: 1.3, x: 960, y: 540, s: 1, r: 2, ease: 'out' }, { at: 6, x: 960, y: 530, s: 1.03, r: 2, ease: 'linear' }] },
      { type: 'card', src: A + 'photo_ellison.png', grade: 'paper', cap: 'LARRY ELLISON  ·  ORACLE', w: 560, h: 520, pos: '50% 20%', t: [1.2, 6], in: 0.25,
        keys: [{ at: 1.2, x: 1500, y: 700, s: 0.9, r: 12 }, { at: 1.8, x: 1480, y: 560, s: 1, r: 7, ease: 'out' }, { at: 6, x: 1475, y: 550, s: 1.03, r: 7, ease: 'linear' }] },
      { type: 'text', text: 'more money. more say over your life.', size: 56, weight: 900, align: 'center', x: 960, y: 960, letter: -1, t: [3.2, 6], anim: 'type', typeDur: 1.2 },
      { type: 'under', rect: [1035, 998, 455, 8], t: [4.5, 6], grow: 0.4 },
    ],
  },
};

// Lower third in the same style: red bar, paper tag, name and role. Render with --alpha.
function LOWER_THIRD(name, role, date, dur) {
  return {
    dur,
    fx: { grain: 0 },
    layers: [
      { type: 'bar', rect: [120, 850, 12, 130], t: [0, dur], grow: 0.25, out: 0.3 },
      { type: 'bar', rect: [132, 850, 980, 130], color: 'rgba(239,233,220,0.94)', t: [0.1, dur], grow: 0.45, out: 0.3 },
      { type: 'text', text: name, size: 50, weight: 800, color: '#15130f', align: 'left', x: 160, y: 892, t: [0.35, dur], in: 0.25, out: 0.3, anim: 'rise', css: 'text-shadow:none' },
      { type: 'text', text: role + (date ? '   ·   ' + date : ''), size: 24, weight: 600, color: '#5a564c', letter: 2, align: 'left', x: 160, y: 946, t: [0.5, dur], in: 0.25, out: 0.3, anim: 'rise', css: 'text-shadow:none' },
    ],
  };
}
