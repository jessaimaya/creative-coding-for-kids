# Module 8: Randomness and arrays

**Big idea:** `random()` gives controlled surprise: you choose the range, the computer picks the number. An array is a numbered row of boxes: one name, many values.
**Time:** 1-2 sessions. **Sketches:** `m08a_random_confetti`, `m08b_arrays_bubbles`, `m08c_generative_poster`, `m08d_10print` (Coding Train).

## By the end, learners can
- [ ] Use `random(a, b)` for position, size, and colour.
- [ ] Use `noLoop()` and `redraw()` to make a "click for a new one" sketch.
- [ ] Explain what an array is and why indexes start at 0.
- [ ] Use an array and a loop to manage many moving things.
- [ ] Save a favourite output with `saveFrame()`.

## Vocabulary
**random**, **range**, **array**, **index**, **length**, **generative art**, **seed**, **noLoop/redraw**.

## Part 1: Randomness (session A)

### Hook (5 min)
"Same code, different picture every time." Run `m08a_random_confetti`, click a few times.

### Live demo (10 min)
```java
println(random(10));          // run it five times
println(random(5, 10));       // from 5 up to just below 10
println(int(random(1, 7)));   // like a dice roll
```
Then `fill(random(255), random(255), random(255));`: random colours.

### Modify (20 min)
`m08a_random_confetti`:
1. More/fewer pieces.
2. Narrow the colour ranges (`random(150, 255)` gives pastel; `random(100)` gives dark).
3. Change shapes to circles; to lines; to both.
4. Use `if (random(1) < 0.2)` to make 20% of pieces special.

### Create (20 min): "Rules + chance" picture
Decide rules (always blue near the bottom; circles only on the left; lines only in the middle) and let randomness fill in the rest.

## Part 2: Arrays (session B)

### Hook: the problem (10 min)
"I want 30 bubbles. Do I make `x1, x2, x3, ..., x30`? No!" Show the mailbox picture.

### Live demo (10 min)
```java
float[] x = new float[5];       // 5 boxes, numbered 0 to 4
x[0] = 100;
x[1] = 150;
println(x[1]);
```
Show that `x[5]` crashes (**ArrayIndexOutOfBounds**: "there is no mailbox 5").
Then connect to loops: `for (int i = 0; i < x.length; i++) { x[i] = random(width); }`.

### Modify (20 min): `m08b_arrays_bubbles`
- More bubbles; faster; different colours.
- Make them float *down*; make them sway sideways (`x[i] += random(-1, 1)`).
- Why are there four arrays (`x`, `y`, `speed`, `diam`)? This is called **parallel arrays**. (Preview: objects in Module 9 combine them into one.)

### Create (30 min): generative poster
Start with `m08c_generative_poster`. Goals:
1. Change `cell` and add a new shape type.
2. Decide a colour palette (search "palette" with 4-5 colours) and use only those.
3. Press **S** to save your three favourite results.
Stretch: poster that depends on the mouse position, or a poster with symmetry (draw each cell mirrored).

## Debug It!
```java
float[] y = new float[10];
for (int i = 0; i <= 10; i++) {      // what's off-by-one here?
  y[i] = random(height);
}
```
(`i <= 10` goes to index 10, but the valid indexes are 0-9.) Another: reading `x[i]` before filling it (all zeros).

## Common mistakes
- Using `random()` result as an `int` without converting: `int r = int(random(6));`.
- Calling `random()` in `draw()` for a fixed position, so it jitters (it picks a new number every frame; choose in `setup()` and *store* it).
- Mixing up `length` (no parentheses for arrays) with `size()` for lists.
- Index off-by-one.

## I can...
- [ ] ...use `random()` with a range.
- [ ] ...make a click-for-new-picture sketch.
- [ ] ...explain an array and its index.
- [ ] ...use a loop to fill and use an array.

## Coding Train challenge: `m08d_10print`
**[#76 10 PRINT](https://thecodingtrain.com/challenges/76-10print)**: a 1982 program that fitted on one line of a Commodore 64. Flip a coin for each square: `\` or `/`.
1. **Hook**: show the video's opening chapter ("What is 10Print?", about 2 min).
2. **Modify**: change `spacing` and `chance` (0.1, 0.9). Why does the maze tilt?
3. **Create**: invent your own two "tiles" (half circles, a dot and a line, two colours) and let `random()` choose.
4. **Stretch**: like the video, draw *one* square per frame in `draw()` so the maze types itself out (`x = x + spacing`, and when `x > width`, move down a row).
5. **12+ extra**: [#95 Approximating Pi](https://thecodingtrain.com/challenges/95-approximating-the-value-of-pi) with random darts.

## In the books
- **Noble**: Lesson 3.6 (`random()` opportunities), Ch. 8 (arrays, image arrays, player options).
- **Nyhoff**: Ch. 9 *Arrays*.
- **Cermak-Sassenrath**: Ch. 13 *Arrays*, Ch. 34 *ArrayLists*.
- **Meyer**: Ch. 2 (randomness, the coin toss sketch), Ch. 3 (arrays and parallel structures).
- **Processing Creative Coding and Generative Art**: Ch. 2 *Art by Numbers*, Ch. 6 *Organizing Chaos*, Ch. 7 *Creative Abstraction*.
- **Generative Design** (p5.js): a gallery of ideas for advanced learners.
- **Processing 2 Creative Programming Cookbook**: Ch. 2 for 2D drawing recipes, Ch. 5 on exporting your work.
