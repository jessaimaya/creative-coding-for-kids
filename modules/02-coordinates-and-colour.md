# Module 2: Coordinates and colour

**Big idea:** The screen is a grid of pixels. Position is two numbers. Colour is three dials (red, green, blue).
**Time:** 1 session. **Sketches:** `m02a_coordinate_finder`, `m02b_color_mixer`, `m02c_pixel_scene`.

## By the end, learners can
- [ ] Read and predict an (x, y) position on the 400x400 canvas.
- [ ] Use the coordinate finder to pick positions for their shapes.
- [ ] Mix a colour with `fill(r, g, b)` and understand 0-255.
- [ ] Use `noStroke()`, `stroke()`, and a transparency value.
- [ ] Add `//` comments to explain their own code.

## Vocabulary
**pixel**, **coordinate**, **RGB**, **stroke** (outline), **fill** (inside), **alpha** (transparency), **comment**.

## 0. Warm-up (5 min): treasure map
Use a printed 8x8 grid. Hide a "treasure" and give the position as `(x, y)`. Learners find it. Then flip the grid so (0, 0) is the **top-left**: "Computers count from the top corner, and y goes *down*."

## 1. Tool time (10 min): the coordinate finder
Run `m02a_coordinate_finder`. Tell learners: "This is a tool, so just run it. In a few weeks you'll understand every line." Move the mouse around.
Task: write down 3 positions you want to use for a face (eyes, mouth).

## 2. Colour is three dials (10 min)
Run `m02b_color_mixer`. Predict: what colour is the top-left corner? Bottom-right? Then:
- `fill(255, 0, 0)` = all red, no green, no blue.
- `fill(255, 255, 0)` = red + green = **yellow** (surprise!).
- `fill(0)` / `fill(255)` = a single number means grey.
- `fill(255, 0, 0, 100)`: the 4th number is transparency.
Task: write down the RGB for 3 favourite colours using the mixer.

## 3. Modify (15 min): `m02c_pixel_scene`
1. Change the sky to sunset orange.
2. Move the sun lower.
3. Add a third hill in a new colour.
4. Remove `noStroke()`. What changes?

## 4. Create (15 min): My landscape
Make a scene with a sky, one big object in the background, and two in front. Use the coordinate finder to place things. Add one comment per section (`// sky`, `// sun`, ...).
Stretch: night-time version with stars (small ellipses) and a moon with a "bite" (a second circle in the sky colour).

## 5. Debug It!
```java
size(400, 400);
background(135, 206, 250);
fill(255, 220, 0);
ellipse(300, 60, 80, 80);
fill(60, 160, 80);
rect(0, 300, 400, 100);
ellipse(100, 500, 80, 80);     // where did my cloud go?
```
The last circle is off-screen (y = 500 on a 400-tall canvas). Let learners debug with the coordinate finder.

## Common mistakes
- Forgetting that `rect` uses the top-left but `ellipse` uses the centre.
- Colour numbers over 255 or negative.
- Drawing the sky *after* the sun, which covers the sun.
- Using `fill` but expecting it to change the outline (that's `stroke`).

## Teacher notes
- The mixer sketch uses `map()` and `mouseX`. Say "you'll see these later" and keep going.
- Introduce `println(mouseX, mouseY)` if you have a faster group.

## In the books
- **Noble**: Lessons 1.1 (pixel grid), 1.5 (grayscale), 1.8 (colouring pixels), 1.9 (transparency), 1.10 (Reference), 2.4 (finding exact coordinates).
- **Meyer**: Ch. 1 (positions and angles, colours).
- **Cermak-Sassenrath**: Ch. 19 *Colour and Transparency*; Ch. 17 *Drawing Modes and Drawing Lines*.
- **Nyhoff**: Ch. 1.
