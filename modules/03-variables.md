# Module 3: Variables

**Big idea:** A variable is a labelled box. Put a number in the box once, use the label everywhere, and change the number to change everything at once.
**Time:** 1 session. **Sketches:** `m03a_face_variable`, `m03b_creature_variables`, `m03c_variables_can_calculate`.

## The three steps (borrowed from Noble, Lesson 3.1)
1. **Declare it**: `int faceSize = 200;`
2. **Use it**: `ellipse(200, 200, faceSize, faceSize);`
3. **Change it**: edit the number, or (Module 4) update it while the sketch runs.

## By the end, learners can
- [ ] Declare an `int` (whole number) and a `float` (decimal).
- [ ] Use a variable inside a shape function.
- [ ] Use maths with variables (`faceSize / 4`, `x + 50`).
- [ ] Choose a sensible variable name.
- [ ] Print a value with `println()` to see it.

## Vocabulary
**variable**, **declare**, **assign**, **int**, **float**, **name**, **value**, **expression**, **console**.

## 0. Hook: the shrink ray (5 min)
Run `m03a_face_variable` with `faceSize = 200`, then change it to 80, then 380. "I changed *one number* and the whole face changed. Eyes, mouth, everything. How?"

## 1. The real box (5 min)
Hold up a box labelled `faceSize` with a card `200` inside. Every time the code says `faceSize`, the computer looks in the box. Swap the card and the whole drawing updates. The label never changes; only the value inside does.

## 2. Live demo (10 min)
Start with this and ask "What's annoying about it?":

```java
ellipse(100, 100, 50, 50);
ellipse(100, 160, 50, 50);
ellipse(100, 220, 50, 50);
```
Then replace the repeated 50 with `int d = 50;` and `ellipse(100, 100, d, d);`.
"Change one number, and all three change."
Add `println(d);` and show the console.

## 3. Modify (20 min)
**`m03a_face_variable`**
1. Try `faceSize` = 100, 300, 380.
2. Move the face by changing `cx` and `cy`.
3. Predict: which parts will change if `faceSize` = 100? Test it.

**`m03b_creature_variables`**: six dials at the top. Task: create three very different creatures *only* by changing the dials. Screenshot each.

**`m03c_variables_can_calculate`**: change `base` only, and watch the other variables follow. Explain why `double1` followed.

## 4. Create (15 min): creature factory
Pick the most interesting creature. Add **two new variables** of your own (e.g. `legLength`, `mouthWidth`) and use them in the drawing.
Stretch: add `int legs = 2;` and think about how you'd draw 6 legs (Module 6's job!).

## 5. int vs. float (5 min, light touch)
`int` = whole numbers (3, 200, -5). `float` = decimals (0.5, 3.14). "Use `float` when you need smooth motion or in-between values."

## 6. Debug It!
```java
size(400, 400);
int d = 100;
ellipse(200, 200, D, d);     // which letter is wrong?
d = 100.5;                   // can an int hold a decimal?
fill(255, 0, 0);
ellipse(300, 100, d);        // how many arguments?
```
Messages to decode: `D cannot be resolved to a variable`, `Type mismatch: cannot convert from float to int`.

## Common mistakes
- Misspelling or changing capitalisation (`faceSize` vs `facesize`).
- Declaring the variable twice.
- Using a variable before declaring it (the computer reads top-to-bottom!).
- Integer division surprise: `5 / 2` is `2`. Show it with `println`.

## I can...
- [ ] ...explain a variable using the box analogy.
- [ ] ...change one variable and predict what moves.
- [ ] ...create a variable with a good name and use it twice.

## In the books
- **Noble**: Lesson 3.1 (counting variables; the three-step diagram), 3.4 (`println()` for debugging).
- **Nyhoff**: Ch. 2 *Types, Expressions, and Variables*, which describes a variable as a named storage location in memory.
- **Cermak-Sassenrath**: Ch. 4 *Variables and Data Types*, which stresses matching the container to the content. Also Ch. 8 *Math and Arithmetic*, Ch. 10 *Type Conversions*.
- **Meyer**: Ch. 1, section *Values and Variables*.
