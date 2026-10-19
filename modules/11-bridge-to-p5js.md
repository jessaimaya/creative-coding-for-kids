# Module 11: Bridge to p5.js

**Big idea:** Everything you learned works in the browser with almost the same names. p5.js is Processing's cousin for JavaScript, so your sketches can live on a web page you can share with anyone.
**Time:** 1 session. **Files:** `sketches-p5/` (open `index.html` in a browser).

> p5.js is loaded from the internet (a CDN) in these examples, so the machines need a network connection.
> Processing itself keeps working offline, so only do this module with internet access.

## By the end, learners can
- [ ] Recognise the same structure (`setup`, `draw`) in p5.js.
- [ ] Convert a simple Processing sketch to p5.js using the translation table.
- [ ] Open a p5.js sketch in the browser and modify it.
- [ ] Share a sketch via a link (the p5.js online editor, <https://editor.p5js.org>).

## The translation table

| Processing (Java) | p5.js (JavaScript) |
|---|---|
| `int x = 0;` / `float y = 1.5;` | `let x = 0;` / `let y = 1.5;` |
| `void setup() { size(400, 400); }` | `function setup() { createCanvas(400, 400); }` |
| `void draw() { ... }` | `function draw() { ... }` |
| `void mousePressed() { ... }` | `function mousePressed() { ... }` |
| `float[] a = new float[10];` | `let a = [];` |
| `class Ball { ... }` (same idea) | `class Ball { constructor() { ... } ... }` |
| `println(x);` | `console.log(x);` |
| `int(random(6))` | `floor(random(6))` |
| `color c = color(255, 0, 0);` | `let c = color(255, 0, 0);` |

Everything else (`ellipse`, `rect`, `fill`, `background`, `random`, `mouseX`, `dist`, `map`, ...) is spelled the same.

## Lesson plan

### 0. Hook (5 min)
Open the bouncing ball in the browser. "This is the Module 5 bounce. Same ideas, new language."

### 1. Side by side (15 min)
Project `m05a_bounce.pde` next to `sketches-p5/m05a_bounce/sketch.js`. Learners circle every difference using the translation table.

### 2. Modify (15 min)
Change the speed and colours, refresh the browser.

### 3. Convert one (20 min)
Each learner picks a sketch from earlier modules (`m04c`, `m06b`, `m08c`...) and converts it using the table. Typical gotchas:
- `size()` -> `createCanvas()`.
- `int x` -> `let x`.
- No `color` or `float` types.
- Static (no `setup`) sketches need to be wrapped in `setup()`.

### 4. Share (5 min)
Show how to paste the code into the p5.js web editor and get a shareable link.

## Why teach it
- Learners can show friends and family their work on a phone.
- It's a stepping stone to web development.
- Text code transfers: the second language is *much* easier than the first.

## Debug It!
```js
function setup() {
  size(400, 400);          // not a p5.js function!
}
function draw() {
  ellipse(mouseX, mouseY, 50, 50)
}
```
Open the browser console (F12) and read the red error. Decode it together.

## I can...
- [ ] ...find the same ideas in two languages.
- [ ] ...convert a simple sketch.
- [ ] ...share my work online.

## Coding Train connection
Every Coding Train challenge page links a p5.js web editor version. Opening one next to our Processing starter (`m05d_dvd_logo`, `m08d_10print`, `m09c_purple_rain`, `m10c_pong_starter`) is a ready-made "spot the differences" exercise. Most videos use p5.js 1.x: if a sketch uses `preload()` or the old keyboard checks, switch the editor's version picker to 1.x. For learners who want to keep going at home, the next step is Shiffman's [Code! Programming with p5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js) track.

## In the books
- **McCarthy, *Getting Started with p5.js*** (written for Processing users, by one of p5's creators).
- **Arslan, *Coding for Visual Learners***: JavaScript through p5.js.
- **Generative Design** (p5.js edition): a gallery of ideas with code.
- **Creating 3D Algorithmic Art with p5.js**: for a later 3D unit.
- **Processing 2 Creative Programming Cookbook**: Ch. 9 *Exploring JavaScript Mode*.
