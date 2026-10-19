# The presenter (Creative Coding Club)

The playful front page of the course website: a slide deck per module, live sketches, and classroom tools.
`../build-site.sh` copies this folder into `site/` and bundles every sketch in `../sketches/` into `site/app/sketches.js`. Open `site/index.html` straight from the file system; no server or internet is needed.

## What it does

- **Dashboard:** module cards with progress, a live Processing sketch in the header, quick tools.
- **Decks:** one per module (`decks/NN-*.js`). Arrow keys or Space go through slides and reveal steps.
- **Live code:** sketches run in the browser with Processing.js. Drag any yellow number to change it and re-run. **Edit** changes anything (Ctrl+Enter runs), **Reset** goes back, **Copy** puts the code on the clipboard for Processing.
- **Click to explain:** click any word, number or symbol in any code panel and a card explains it in kid language. Numbers say what they do ("the **width** of the ellipse"), colours show a swatch and hex code, and the sketch's own functions and variables point to the line where they're made ("Show line").
- **How code works** (`#/learn`): interactive explainers for coordinates (with a find-the-point game, canvas sizes and a maths-graph comparison), colour codes (RGB, hex, grey, see-through, HSB), a shape builder (drag handles, watch the numbers), the parts of a line of code (a "function machine"), and a searchable **code dictionary** with live examples.
- **Processing reference** (`#/reference`): a local copy of [processing.org/reference](https://processing.org/reference) in the same style. It has all 671 core entries in English, with Spanish wherever the official translation exists (73 pages so far; the rest show English with a note). You can search, browse by category, read class and method pages, and see each example's code (click any word to explain it) next to the official picture. **Run it here** runs the 380 examples the browser preview can handle. Explanation cards and the dictionary link to it.
- **Teacher notes** (`#/notes`): the lesson plans, teacher guide and resources from the Markdown files, in the same style. Code blocks work like the slides (click a word to explain it; full sketches have **Run it here**), checklists can be ticked (saved in this browser), sketch names open in the Sketch Lab, and each lesson plan links to its slides. Search all the notes, jump to a section, or print a page. `../tools/build-notes.py` bundles them into `app/notes-data.js` when the site is built, so edit the `.md` files and run `../build-site.sh`. The plain pages (`site/modules/*.html` and so on) are still built for printing without the app.
- **Sketch Lab:** every sketch in the course with a thumbnail, ready to open and play with.
- **Toolbox:** timer (T), name picker (P), whiteboard over any slide (W), grid paper. Teacher notes per slide (N), all slides (O), full screen (F), sound (M), help (?).

Progress, names for the picker and the sound setting are saved in this browser only (localStorage).

## A caveat to tell learners

Processing.js is a browser version of Processing from 2012. It runs every sketch in the course, but it is **less strict**: it accepts a missing `;`, an `ellipse` with three numbers and a decimal in an `int`, and `5 / 2` gives `2.5` instead of `2`. That's why the *Debug it!* slides show Processing's real messages instead of running the broken code, and every player carries a "Browser preview" note. Always have learners run their work in real Processing.

## Updating the Processing reference

`../tools/update-processing-reference.sh` fetches the current reference from github.com/processing/processing-website (a sparse clone of just the reference folders), then `../tools/import-processing-reference.py` writes `reference/` (data files, a small name index, and the example pictures resized to 400×400 WebP, about 4 MB in all). Run `../build-site.sh` afterwards. The reference text loads only when the Reference page opens.

The reference content is **CC BY-NC-SA 4.0** (see `reference/LICENSE.md`): fine for free classes with the credit shown on every page, but not for a paid product without the Processing Foundation's permission.

## Editing a deck

Each deck is a plain JavaScript file that calls `CC.deck({...})`:

```js
CC.deck({
  id: '05', num: 5, title: 'Conditionals', color: 'pink', icon: 'question',
  bigIdea: 'The sentence on the title slide.',
  kidIdea: 'The one-liner on the dashboard card.',
  sessions: '2 sessions',
  plan: 'modules/05-conditionals.html',          // linked from the teacher notes
  sketches: ['m05a_bounce', 'm05b_hover_color'],  // shown in the Sketch Lab
  slides: [ { type: 'title' }, /* ... */ ],
});
```

Text fields accept `` `code` ``, `**bold**`, `*italic*` and `[links](url)`. Every slide can have `notes` (teacher only, press N) and `timer: minutes` (adds a timer button).

| `type` | Main fields | What it shows |
|---|---|---|
| `title` | (uses the deck fields) | Cloud title on a coloured slide |
| `hook` | `sketch`, `text`, `sub` | A running sketch with a big line of text |
| `big` | `statement`, `text`, `analogy: {title, text}`, `art` (`box`, `flipbook`, `mailboxes`, `cookie`, `loop`, `recipe`) | One big idea |
| `act` | `steps: [{t, d}]`, `text`, `reveal` | Numbered cards (unplugged activities, steps) |
| `predict` | `sketch` or `code`, `question`, `answer` | Code with the canvas covered; → runs it |
| `code` | `sketch` or `code`, `text`, `spotlight: [{find / lines / from+to, note}]` | Live code; → steps through spotlighted lines |
| `tasks` | `sketch`, `items`, `rule` | Tickable task cards and a "Try it here" button |
| `challenge` | `text`, `rules`, `examples`, `stretch`, `minutes`, `sketch` | The Create task with a timer button |
| `debug` | `code`, `text`, `bugs: [{line, fix, message, messageLabel}]`, `lang` | Buggy code; → reveals one bug at a time |
| `vocab` | `words: [[word, meaning]]` | Flip cards |
| `ican` | `items` | "I can..." cards to tick (confetti when all are done) |
| `share` | `prompts`, `feedback` | Speech bubbles and the name picker |
| `whiteboard` | `text`, `grid` | A drawing area, optionally on a labelled coordinate grid |
| `codingtrain` | `num`, `url`, `clip`, `text`, `steps`, `sketch` or `code` | A Coding Train challenge next to our starter |
| `list` | `points`, `text`, `reveal`, `icon` | Bullet points |
| `table` | `head`, `rows`, `text` | A table |
| `compare` | `left: {sketch}`, `right: {sketch}` (p5.js), `spotlight: [{left, right, note}]` | Two codes side by side |
| `mixer` | `text` | RGB sliders and a colour swatch |
| `flow` | `nodes: [{t, d, color} or {arrow}]`, `loop` | A small state diagram |
| `coords` | `text` | The coordinates explainer |
| `colours` | `text` | The colour explainer (`mixer` still works as an alias) |
| `shapes` | `text`, `shape` (`rect`, `ellipse`, `line`, `triangle`) | The shape builder |
| `anatomy` | `text`, `reveal` | The parts of a line of code; → labels each part |

Spotlights find lines by text, so they keep working when a sketch changes: `{ find: 'ellipse(' }` marks every line containing it, `{ find: [...] }` several texts, `{ from: 'void setup', to: '}' }` a block, `{ lines: [3, 4] }` exact lines.

To add a deck, create `decks/NN-name.js` and add a `<script>` line for it in `index.html` (decks appear in that order). Then run `../build-site.sh`.

## Files

- `index.html`: page shell and script order
- `app/core.js` (helpers, sound, confetti, icons), `highlight.js` (tokenizer), `player.js` (code + sketch player), `tools.js` (timer, whiteboard, picker), `slides.js` (slide types), `reference.js` (the code dictionary and click-to-explain cards), `explorers.js` (the How code works explainers), `refdoc.js` (the local Processing reference), `notes.js` (the teacher notes), `art.js` (module card drawings), `app.js` (dashboard, decks, lab, learn pages, toolbox, keys), `app.css`

To explain a new built-in function, add an entry to `REF` in `app/reference.js`: `cat`, `sigs` (argument names by count), `say`, `args` (what each argument means), and optionally `tip`, `example` and `see`.
- `vendor/processing.min.js`: Processing.js 1.6.6 (MIT), from cdnjs
- `vendor/fonts/`: Fredoka, Nunito and JetBrains Mono, Latin subsets (SIL Open Font License), from Google Fonts
