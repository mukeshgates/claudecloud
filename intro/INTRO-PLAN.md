# Intro build plan, 0:00-0:52

Style: fern-style photo composite. Cold near-black base, muted real photographs on archive-print cards, one red accent (#c8102e), heavy grain, slow pushes, kinetic type. Nothing drawn; every picture is a Commons photo, a document or your clip. Credits in `assets/CREDITS.md`.

All renders are 1920x1080, 30 fps, in `intro/out/`. `*_preview.mp4` shows the whole frame with a grey placeholder where the clip goes. `*_ALPHA.mov` is the same scene with a transparent window; put it on the track above the clip.

| Film clock | What plays | File | Status |
| --- | --- | --- | --- |
| 0:00-0:07 | Paycheck, retirement fund, AI bet | - | Needs your pay stub or 401(k) statement photo (see below) |
| 0:07-0:10 | "You never agreed", ticking | - | Needs the DOL auto-enrolment page screenshot |
| 0:10-0:15 | 35 cents, seven companies | `03_35cents_0m10s.mp4` | Done |
| 0:15-0:24 | CNBC then Bloomberg clips | `04_news_0m15s_ALPHA.mov` over the two clips (clip window 1120x630 at x120 y200); tag switches to Bloomberg at 5.0 s | Done |
| 0:24-0:28 | "The head of the IMF put it plainly" | `05_georgieva_0m24s_ALPHA.mov` (first 4 s: IMF building, Georgieva card) | Done |
| 0:28-0:37 | Georgieva clip | same file; clip window 1180x664 at x120 y150 from 4.3 s; "standing on one leg" types at 7.0 s, "what if it wobbles?" at 10.9 s with a shake. Nudge these two text times to her words if your cut differs | Done |
| 0:37-0:42 | "If the bet fails... if it works..." | `06_outcomes_0m37s.mp4` | Done |
| 0:42-0:46 | Dimon clip | your clip + `LT_dimon_ALPHA.mov` | Lower third done |
| 0:46-0:49 | Musk clip | your clip + `LT_musk_ALPHA.mov` | Lower third done |
| 0:49-0:52 | "Either way, the people who own the machines..." | `08_owners.mp4` | Done |
| after | Ellison clip | your clip + `LT_ellison_ALPHA.mov` | Lower third done |

## Fixes to the problems you raised

- **Bloomberg clip used twice.** The muted flash at 5.3 s is dropped. The 0:15-0:24 window shows CNBC first, then the full Bloomberg "holding the bag" clip at 0:20, with the tag and the right-hand type switching on the cut.
- **22 s with no narration.** The right-hand column carries the story while the anchors talk: the "9" counts up to nine with the CNBC line, "LONGEST SINCE 2006" lands, then "holding the bag?" types in on the Bloomberg cut. The eye always has a new reveal every 3-4 s even though the narrator is silent.

## What I still need for 0:00-0:10

1. A photo of a real pay stub or 401(k) statement on a desk, phone camera, near a window, two angles. Cover names and numbers with paper; I add the redaction look.
2. A screenshot of the Department of Labor page on 401(k) automatic enrolment (dol.gov), the paragraph that says employers can enrol you automatically.
3. Optional: the S&P 500 factsheet PDF from spglobal.com, the page with the top-ten weights, to sit under the 35 cents.

## Rendering again

`./render-all.sh` renders everything. To re-render one scene after editing `photo/scenes.js`:

```
node render.mjs photo/scene.html 13 out/05_georgieva_0m24s_ALPHA --query "scene=s05_georgieva" --alpha
```

To check a frame without rendering: `node snap.mjs "photo/scene.html?scene=s05_georgieva" /tmp/check 9.0`
