# Module 1: First marks

**Big idea:** A program is a list of instructions. The computer does them one at a time, top to bottom, exactly as written.
**Time:** 1 session. **Sketches:** `m01a_hello_shapes`, `m01b_robot_face`, `m01c_layers_order`.

## By the end, learners can
- [ ] Run and stop a sketch in the Processing IDE.
- [ ] Draw with `ellipse`, `rect`, `line`, `triangle`.
- [ ] Read the numbers inside the parentheses (x, y, width, height).
- [ ] Explain why order matters (later shapes cover earlier ones).
- [ ] Use `fill()` and `background()` to change colours.

## Vocabulary
**statement** (one instruction, ends with `;`), **function** (a command with a name and parentheses), **argument** (a number you give a function), **canvas** (the drawing window), **comment** (`//` a note for humans).

## 0. Hook (5 min)
Show `m01b_robot_face` already running. "In 50 minutes you'll build your own."

## 1. Acting it out (5 min): the human computer
One learner is "the computer" and follows instructions *literally*. The class gives drawing instructions: "Draw a circle." (Where? How big?) This shows why we need exact numbers and an exact order.

## 2. Predict, then run (5 min)
Project this and ask what it draws:

```java
size(400, 400);
background(255, 240, 200);
fill(255, 100, 100);
ellipse(200, 200, 120, 120);
```

## 3. Live demo (10 min)
Type from scratch and narrate:

1. `size(400, 400);`: "How big is the canvas?"
2. `ellipse(200, 200, 100, 100);`: "x, y, width, height. Where's the middle of the circle?"
3. Change `200, 200` to `100, 100`. Run. "It moved *up and to the left*."
4. Add `rect(50, 50, 100, 60);`: "Rectangles use the *top-left corner*; ellipses use the *centre*."
5. Make a deliberate mistake: delete a `;`. Read the red message together.

## 4. Modify (20 min): `m01a_hello_shapes`
Tasks, one at a time:
1. Change the background colour.
2. Move the circle to the bottom-right corner.
3. Make the circle into an oval; then into a tiny dot.
4. Change `fill()` before the rectangle, then *after*. What changes?
5. Add a second triangle.

## 5. Order matters (10 min): `m01c_layers_order`
**Predict** which square is on top. Run. Then *swap the blue and red blocks of code* and run again. "The computer is painting, and later paint covers earlier paint."

## 6. Create (15 min): `m01b_robot_face`
Build your own robot (or monster, cat, spaceship). Rules: at least 6 shapes, at least 3 colours. Stretch: ears, antennas, buttons, a body.

## 7. Debug It!
```java
size(400, 400)             // what's missing at the end of this line?
background(255);
ellipse(200, 200, 100);    // how many numbers does ellipse need?
fill(255, 0, 0)
rect(50, 50, 100, 60);
```
Expected errors: a red `Syntax Error` for the missing `;`, and a message saying `ellipse` is "not applicable for the arguments" (it needs 4 numbers, not 3). Let learners find all three problems.

## 8. Share and reflect
"Which line made the biggest change? Which line would you delete to make your robot lose an eye?"

## Common mistakes
- Forgetting `;`; mixing `,` and `.`.
- Thinking `(0, 0)` is the bottom-left. It is the **top-left**; y grows downward.
- Calling `ellipse` with only 2 numbers.
- Changing `fill` after the shape and wondering why nothing changed.

## In the books
- **Meyer, *Programming 101***: Ch. 1 *Basics* (values, functions, positions and angles, colours, "Hello, World", the Daddy logo project, "How to Make This Your Own").
- **Nyhoff, *Processing: An Introduction to Programming***: Ch. 1 *Basic Drawing in Processing*.
- **Noble, *Programming Media Art Using Processing***: Ch. 1, Lessons 1.1-1.10 (pixel grid, shapes, grayscale, syntax/comments/order, stroke, colour, transparency, the Reference) and the *Geometric Design* project.
- **Cermak-Sassenrath, *Intro to Game Programming using Processing***: Ch. 1 *The Process of Programming*, Ch. 2 *Hello Game World!*, Ch. 3 *Console Output and Comments*.
- **Processing Creative Coding and Generative Art**: Ch. 1 *Diving into the Shallow End*.
