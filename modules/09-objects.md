# Module 9: Objects

**Big idea:** A class is a blueprint. Each thing built from it (`new Ball(...)`) carries its own data (position, speed, colour) and its own behaviour (`move()`, `show()`).
**Time:** 1 session (2 for younger or slower groups). **Sketches:** `m09a_ball_class`, `m09b_fireworks`, `m09c_purple_rain` (Coding Train).

> Optional for ages 8-10. Strongly recommended before Module 10 if learners want to make games with many enemies, bullets, or particles.

## By the end, learners can
- [ ] Explain class vs. object using the cookie-cutter analogy.
- [ ] Read a class with fields, a constructor, and methods.
- [ ] Create many objects with `new` and keep them in an array or `ArrayList`.
- [ ] Add a new property or behaviour to a class.

## Vocabulary
**class**, **object**, **field / property**, **method**, **constructor**, **`new`**, **ArrayList**.

## 0. Hook: the problem with parallel arrays (10 min)
Look back at `m08b_arrays_bubbles`: four arrays. "Now each bubble needs a colour, a wobble, a name... that's 7 arrays. There must be a better way: a **bubble** that *carries its own data*."

## 1. Cookie cutter (5 min)
The cutter (class) defines the shape. Each cookie (object) can have different icing (data). Use a real cookie cutter if you can.

## 2. Anatomy walk-through (15 min): `m09a_ball_class`
Read the class together, top to bottom, and colour-code it:

| Part | Role | In `Ball` |
|---|---|---|
| **fields** | the data each object owns | `x, y, xSpeed, ySpeed, r, c` |
| **constructor** | how a new object gets built | `Ball(float x, float y) { ... }` |
| **methods** | what an object can do | `move()`, `show()` |

Then in the main code: `balls[i] = new Ball(...)`, `balls[i].move()`, `balls[i].show()`.

## 3. Modify (20 min)
`m09a_ball_class`:
1. More/fewer balls.
2. Make each ball a random size (hint: it already is, so change the range).
3. Add a field, `boolean big`, and draw big balls with an outline.
4. Add a method `void grow()` that makes a ball larger when you click on it.

## 4. Fireworks (15 min): `m09b_fireworks`
- Click to launch. Why did we use an `ArrayList` instead of an array? (Because the number changes over time.)
- Change `life`, gravity (`0.08`), and speed range.
- Explain why we loop *backwards* when removing.

## 5. Create (20 min)
Pick one:
- **Rain / snow / fireflies**: a particle class.
- **Creatures**: a `Fish` class with `swim()` and `show()`.
- **Growing flowers** that appear where you click.
Stretch: objects that react to each other (bounce off one another).

## Debug It!
```java
Ball b;                    // declared...
void setup() {
  size(400, 400);
}
void draw() {
  b.move();                // ...but never created with new!
}
```
Error: **NullPointerException**. "The cookie cutter exists, but you never made a cookie." Fix: `b = new Ball(100, 100);` in `setup()`.

## Common mistakes
- Forgetting `new`.
- Calling `move` without parentheses.
- Fields vs. local variables with the same name (that's why `this.x = x` exists).
- Removing from an `ArrayList` while counting forwards.

## I can...
- [ ] ...explain class vs. object.
- [ ] ...create many objects from one class.
- [ ] ...add a new property or method.

## Coding Train challenge: `m09c_purple_rain`
**[#4 Purple Rain](https://thecodingtrain.com/challenges/4-purple-rain)**: the classic first class. 400 `Drop` objects, each with its own `x`, `y`, `z` and speed.
- Compare with `m09a_ball_class`: same three parts (fields, constructor, methods).
- **Investigate**: what does `z` control? Find every line that uses it. (Length, thickness, speed: closer drops look bigger and faster, which fakes depth.)
- **Remix**: snow (white, slow, sways with `x = x + random(-1, 1)`), falling stars, leaves. Stretch: drops that splash at the bottom.
- Show the [#27 Fireworks](https://thecodingtrain.com/challenges/27-fireworks) result as the hook for `m09b_fireworks`.

## In the books
- **Meyer**: Ch. 4 *Classes*.
- **Nyhoff**: Ch. 10 *Introduction to Objects*.
- **Cermak-Sassenrath**: Ch. 25 *Classes and Objects*, Ch. 34 *ArrayLists*, Ch. 33 *Vectors* (later).
- **Creating Procedural Artworks with Processing**: further reading on procedural art (not yet reviewed in detail).
