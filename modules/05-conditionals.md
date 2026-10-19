# Module 5: Conditionals (`if`)

**Big idea:** `if` asks a yes/no question. If the answer is yes, the code inside the braces runs. Otherwise it's skipped (or `else` runs).
**Time:** 2 sessions. **Sketches:** `m05a_bounce`, `m05b_hover_color`, `m05c_light_switch`, `m05d_dvd_logo` (Coding Train).

## Session A: Questions and bouncing
## Session B: else, true/false variables, and clicking

```java
if (x > width) {        // the QUESTION
  speed = -speed;       // the ACTION if the answer is yes
}
```

## By the end, learners can
- [ ] Write an `if` and an `if/else`.
- [ ] Use comparison operators: `<`, `>`, `<=`, `>=`, `==`, `!=`.
- [ ] Combine questions with `&&` ("and") and `||` ("or").
- [ ] Use a `boolean` variable as a switch (true/false).
- [ ] React to mouse position and mouse clicks.

## Vocabulary
**condition**, **boolean**, **true/false**, **comparison**, **`&&` and `||`**, **event** (`mousePressed`).

## 0. Hook (5 min)
Act out: "If it's raining, I take an umbrella. Otherwise I wear sunglasses." Have the class shout the outcome for different weather. Convert it to code on the board:

```java
if (raining) {
  umbrella();
} else {
  sunglasses();
}
```

## Session A

### Predict (5 min)
Show `m05a_bounce` without the `if` blocks. What happens? (The ball flies off.) Add one `if`: bounce.

### Live demo (10 min)
Start from `m04a_moving_ball`. Add:

```java
if (x > width) {
  speed = -speed;
}
```
- Why does the ball disappear *before* it flips? (Its centre must pass the edge.) Fix by using `width - 25`.
- Add the left wall with `|| x < 0`.
- Give `==` vs `=` a minute: "== asks, = tells".

### Modify (20 min): `m05a_bounce`
1. Change `xSpeed`, `ySpeed`.
2. Change the radius `r`. Does the bounce still look right? Why?
3. Make the ball change colour when it bounces. (Hint: a colour variable that changes inside the `if`.)

### Create (15 min)
Make a bouncing object and add a *consequence* for each bounce (a counter, a colour change, a sound-like flash).

## Session B

### Hover colours (15 min): `m05b_hover_color`
Predict then test. Task: add a third colour using `else if`.

### Light switch (15 min): `m05c_light_switch`
New idea: `boolean` holds only `true` or `false`. `!lightOn` means the opposite. `mousePressed()` runs once per click.
Task: add a second lamp that works independently with its own boolean.

### Create (25 min): Interactive scene
Make a scene with **three different reactions**: one on hover, one on click, one when the mouse is at the edge of the screen.

## Debug It!
```java
if (x > 200);                  // look at the end of this line!
{
  fill(255, 0, 0);
}
if (x = 200) {                 // = or == ?
  fill(0, 255, 0);
}
if (mouseX > 100 and mouseY < 100) {   // is "and" a Java word?
  ellipse(50, 50, 20, 20);
}
```
(A semicolon after `if (...)` ends the statement early. Nyhoff has a *Caution: no semicolon at the end of the first line of an if statement* note for this.)

## Common mistakes
- `=` instead of `==`.
- A semicolon right after `)`.
- Missing braces when there are two actions.
- `and`/`or` instead of `&&`/`||`.
- Comparing text with `==` (a later problem; mention it in Module 10 if needed).

## I can...
- [ ] ...write an `if/else`.
- [ ] ...explain `==` vs `=`.
- [ ] ...use a boolean as a switch.
- [ ] ...combine two conditions with `&&`.

## Coding Train challenge: `m05d_dvd_logo`
**[#131 Bouncing DVD Logo](https://thecodingtrain.com/challenges/131-bouncing-dvd-logo)**. Ask first: "Who remembers the DVD screensaver? Did it ever hit the corner?"
1. **Whiteboard** (3 min): draw the rectangle with `x`, `y`, `w`, `h` labelled. Where is the right edge? (`x + w`, because `rect` uses the top-left corner.)
2. **Modify**: change the speeds, the size and the three colours. Run after each change.
3. **Investigate**: why does `hits` go back to 0? What happens if you delete that `if`?
4. **Stretch**: detect a corner hit (both walls on the same frame) with a `boolean` and `&&`, and show "CORNER!" for a second.

## In the books
- **Noble**: Ch. 5 (conditionals and relational operators, custom variables, AND vs OR, logical operators defining spaces, mouse/keyboard, rollovers) and Ch. 6 (booleans as switches and toggles).
- **Nyhoff**: Ch. 4 *Conditional Programming with if*: recipe analogy, rolling a die, `if-else`, `if-else-if-else`, rock-paper-scissors, `&&`/`||`.
- **Cermak-Sassenrath**: Ch. 6 *Conditionals*, Ch. 7 *Relational Expressions and Logical Operators*.
- **Meyer**: Ch. 2 *Interactions* (events) and Ch. 5 *More Interactions*.
