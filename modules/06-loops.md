# Module 6: Loops

**Big idea:** A loop repeats code so you don't have to copy-paste. The loop counter is a variable you can use.
**Time:** 2 sessions. **Sketches:** `m06a_row_of_circles`, `m06b_grid`, `m06c_rainbow`, `m06d_loop_and_if`, `m06e_sunflower` (Coding Train, stretch).

```java
for (int i = 0; i < 10; i++) {
  ellipse(30 + i * 35, 200, 30, 30);
}
```

Read it as three parts: **start** `int i = 0` · **keep going while** `i < 10` · **after each round** `i++` (add 1).

## By the end, learners can
- [ ] Turn repeated code into a `for` loop.
- [ ] Use the loop counter `i` inside the loop (position, size, colour).
- [ ] Nest one loop inside another to make a grid.
- [ ] Combine a loop with an `if` (alternate colours).
- [ ] Explain what an infinite loop is.

## Vocabulary
**loop**, **iteration**, **counter**, **`i++`**, **nested loop**, **row/column**, **modulo `%`** (the remainder after division).

## Session A: one loop

### 0. The pain (10 min)
Ask learners to draw **20 circles in a row using only copy-paste**. After two minutes, groans. "There's a better way."

### 1. Live demo (10 min)
1. Show the 3-line version, then collapse into a loop.
2. Run. Count the circles. Change `10` to `20`.
3. Put `println(i);` in the loop and watch the console. "`i` goes 0, 1, 2..."
4. Use `i` in more places: size (`10 + i * 3`), colour (`fill(i * 25, 100, 200)`).

### 2. Modify (20 min): `m06a_row_of_circles`
1. 20 circles. 5 circles.
2. Spacing 35 -> 20. Vertical instead of horizontal.
3. Circles that grow bigger as `i` grows.
4. Make a diagonal staircase (both x and y use `i`).

### 3. Create (15 min)
Make a *drawing built from a loop*: rainbow stripes, bricks wall, picket fence, or a row of windows on a building.

## Session B: nesting and combining

### 4. Predict (5 min)
Project `m06b_grid`. "How many squares will it draw?" (8 x 8 = 64.) The outer loop picks the row; the inner loop fills that row. Think of "rows of seats in a cinema".

### 5. Modify (20 min)
- `m06b_grid`: 4x4, 10x10, change cell size, colour patterns.
- `m06c_rainbow`: uses HSB colour so one number (hue) sweeps the whole rainbow.
- `m06d_loop_and_if`: `ring % 2 == 0` alternates. Change to `% 3`. Change the colours.

### 6. Create (25 min): pattern poster
Use at least one loop and one `if`. Examples: chessboard, target, rainbow tunnel, sunburst (lines from the centre), a city skyline with window grids.
Stretch: make the grid react to the mouse (cell colour depends on distance to `mouseX`, `mouseY`).

## Debug It!
```java
for (int i = 0; i < 10; i--) {          // what happens to i?
  ellipse(30 + i * 35, 200, 30, 30);
}
```
This version freezes or crashes: an **infinite loop**. Press Stop. Fix: `i++`.

```java
for (int i = 0; i < 10; i++); {         // semicolon again!
  ellipse(30 + i * 35, 200, 30, 30);
}
```

## Common mistakes
- Off-by-one: `i <= 10` draws 11 shapes.
- Forgetting to use `i`, so all shapes land on top of each other.
- Using `i` for both loops when nested (use `row`/`col` or `i`/`j`).
- Declaring variables inside a loop and expecting them outside.

## I can...
- [ ] ...turn repeated code into a loop.
- [ ] ...predict how many shapes a loop draws.
- [ ] ...use `i` to change position, size, or colour.
- [ ] ...make a grid with nested loops.

## Coding Train challenge (stretch): `m06e_sunflower`
**[#30 Phyllotaxis](https://thecodingtrain.com/challenges/30-phyllotaxis)**: one loop draws a sunflower. Every seed turns 137.5 degrees further round and sits a bit further out.
- **Predict**: what happens if `turn` becomes 90? 180? 137.6? (Spokes, a line, then a spiral that falls apart.)
- `cos()`/`sin()` are given as a helper ("they point round a circle"). Don't explain the trigonometry.
- **Remix**: change the colour rule, the seed size (try `i * 0.02`), or draw squares instead of circles.

## In the books
- **Noble**: Lesson 7.3 *For loops are efficient*, 7.4 colour detection with loops.
- **Nyhoff**: Ch. 5 *Repetition with a Loop: the `while` statement* then Ch. 6 *Counting Loops Using the `for` Statement*. (Nyhoff introduces `while` first. This course starts with `for` because kids see results sooner.)
- **Cermak-Sassenrath**: Ch. 5 *Iteration with the while Loop*, Ch. 12 *Iteration with the for Loop*.
- **Meyer**: Ch. 2, section *Looping*.
- **Processing Creative Coding and Generative Art**: Ch. 2 *Art by Numbers* and Ch. 8 *Drawing with Recursion*, for extensions.
