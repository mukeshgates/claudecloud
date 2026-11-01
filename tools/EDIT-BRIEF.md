# EDIT BRIEF: Binance hack, v3 rebuild

The v2 render was not good enough. Rebuild everything after 0:00–1:55.9 to this standard.
Output: `out/final/v3/film.mp4`. Never overwrite v1 or v2.

## 0. Your notes (edit this section before running)
- What looked worst in v2: ______________________
- Timestamps that were bad: ______________________
- Anything you liked and want kept: ______________________

## 1. The quality bar
Reference style: a modern investigative YouTube documentary (Fern / "Masked Money" PPE style).
Dark, cinematic, real footage first, graphics only where they explain something.
The first 1:55.9 of v1 is the internal benchmark: every later minute must look at least that good.

## 2. Hard rules (check every one before rendering a chunk)
**Pacing**
- A new visual every 2–4 seconds. No shot holds longer than 5 s unless it is real footage with motion.
- Every still image moves: slow push-in or pan (Ken Burns), never a static frame.
- Each script paragraph changes the visual at least 3 times.

**Footage first**
- Use the real clips in `assets/footage` and `assets/clips_cut` wherever the narration names that person or event (CZ, SBF hearing, FTX ad, Saylor, Eric Trump, news anchors).
- When nothing real exists, use: a document/headline page with a highlighted line, a chart that animates, or the exchange-screen look. Never a plain text slide.

**Text on screen**
- Max 6 words per on-screen line, 2 lines max. Big enough to read on a phone (cap height ≥ 5% of frame).
- Numbers that matter ($6.3B, 20 minutes, $1B SAFU, 4 months) get their own full-screen moment.
- No paragraphs of text, no small captions, no overlapping elements, nothing cut off at the frame edge.

**Document & headline shots**
- Real article/filing pages, slightly tilted, with a highlighter sweep on the key line timed to the narration word.
- Push-in zoom of 5–10% over the shot. Whoosh on entry.

**Chapters**
- Each new section: music drops out for ~1 s, a chapter title types on, then a low hit and the next music cue.

**Sound**
- Narration always on top. Music sits well under it (about 15 dB below the voice) and changes at chapter boundaries only.
- A sound effect on every hard transition (whoosh), every headline slam (hit), every highlighter (soft swipe). Silence before the biggest reveals.
- Final mix around −14 LUFS integrated, no clipping.

**Sync**
- Every on-screen event lands within 2 frames of the word it illustrates. Rerun the sync check until it reports zero problems.

## 3. Mandatory self-review (do not skip)
After rendering each chunk:
1. Extract one frame per second into a contact sheet (with timestamps).
2. Look at every frame against section 2. Write problems to `out/final/v3/QC.md` with timestamps.
3. Fix and re-render the chunk. Repeat until the contact sheet passes.
After assembling the full film, do the same for the whole video, plus listen-checks of audio levels at 5 random points.
Only call it finished when QC.md ends with "PASS" for every chunk and the full film.

## 4. Don't
- Don't change the narration audio or the script wording.
- Don't touch 0:00–1:55.9 (copy it exactly from v1).
- Don't ask questions: decide, and record each decision in `RESUME.md`.
