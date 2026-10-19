# Module 4: Animation

**Big idea:** `draw()` is a flip-book that runs about 60 pages per second. If a variable changes a tiny bit each page, things move.
**Time:** 1 session. **Sketches:** `m04a_moving_ball`, `m04b_trails`, `m04c_follow_mouse`.

## New structure

```java
int x = 0;               // variables go at the TOP (outside any function)

void setup() {           // runs ONCE at the start
  size(400, 400);
}

void draw() {            // runs again and again, ~60 times a second
  background(255);       // erase the page
  ellipse(x, 200, 50, 50);
  x = x + 3;             // change x a little
}
```

Teach the shape of the program as three rooms: **top (variables) -> setup (once) -> draw (forever)**.

## By the end, learners can
- [ ] Explain `setup()` vs `draw()` in their own words.
- [ ] Make something move by changing a variable each frame.
- [ ] Control speed and direction with a `speed` variable.
- [ ] Use `mouseX` and `mouseY`.
- [ ] Explain what `background()` does inside `draw()` (and what happens without it).

## Vocabulary
**frame**, **setup**, **draw**, **frame rate**, **speed**, `mouseX`/`mouseY` (built-in variables), **easing**.

## 0. Hook (5 min)
Show a paper flip-book (or hand-draw 5 stick-figure pages). "Each page is one frame. The computer flips 60 pages per second."

## 1. Predict (5 min)
Show `m04a_moving_ball` *without running it*. Predict: where is the ball after 1 second? After the end? (It leaves the screen.)

## 2. Live demo (10 min)
1. Type the code above. Run. The ball slides right.
2. Remove `background(255)` and run. "Smear!" It never erased the old pages. Put it back.
3. Add `int speed = 3;` and use `x = x + speed;`. Change `speed` to -3 and watch it go left.
4. Add `y` and move diagonally.

## 3. Modify (20 min)
**`m04a_moving_ball`**
1. Change `speed` (try 1, 10, -3).
2. Make the ball move **down** instead of right.
3. Make it move diagonally.
4. Predict: what if `speed` is 0?

**`m04b_trails`**: change `fill(0, 25)` to 255, 100, 5 to see trails of different lengths. Explain: a nearly see-through rectangle only *fades* the old pages.

**`m04c_follow_mouse`**: change `ease` (0.01, 0.5, 1).

## 4. Create (20 min): living scene
Make a scene where **at least two things move differently** (e.g. a sun that crosses the sky, a car that drives, a fish that follows the mouse). Stretch: move in a wave with `sin(frameCount * 0.05)`.

## 5. Debug It!
```java
int x = 0;
void setup() {
  size(400, 400);
}
void draw() {
  background(255);
  ellipse(x, 200, 50, 50);
}
x = x + 3;                 // why doesn't the ball move?
```
(`x = x + 3` must be *inside* `draw()`.) Also try placing `background()` after the ellipse and ask why the circle disappears.

## Common mistakes
- Declaring the variable *inside* `draw()` so it resets every frame.
- Putting `size()` anywhere other than the first line of `setup()`.
- Forgetting `background()` or putting it after the shapes.
- Confusing `=` ("becomes") with `==` ("is equal to", Module 5).

## I can...
- [ ] ...make something move across the screen.
- [ ] ...make something follow the mouse.
- [ ] ...explain why the screen smears if I remove `background()`.

## Coding Train challenge
**[#52 Random Walker](https://thecodingtrain.com/challenges/52-random-walker)**: a dot takes one random step every frame. Remove `background()` from `draw()` so it leaves a trail. Kid-sized version: start from `m04a_moving_ball`, change `int x` to `float x` (`random()` gives decimals, so an `int` box gives a *Type mismatch* error), add a `float y`, and replace `x = x + speed;` with `x = x + random(-3, 3);` (and the same for `y`). `random()` gets its proper lesson in Module 8; here it's just "a different number each frame".
Hook: show the first minute of the video. See [resources/coding-train.md](../resources/coding-train.md) for how to use the videos.

## In the books
- **Noble**: Ch. 2 (dynamic programs, first animations, animation trails, rotating shapes), Ch. 3 (counting variables, multiple directions, automated rotations).
- **Meyer**: Ch. 3 *Animation Using Arrays and Parallel Structures* (animation basics).
- **Cermak-Sassenrath**: Ch. 15 *Movement*; Ch. 21 *Real Time*; Ch. 27 *Hardware Speed Independence for Movement* (later, for stronger groups).
- **Creating Procedural Artworks with Processing** (de Byl): further reading for strong learners (not yet reviewed in detail).
