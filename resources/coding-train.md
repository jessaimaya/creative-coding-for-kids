# The Coding Train: how to use it in this course

[The Coding Train](https://thecodingtrain.com) is Daniel Shiffman's video channel and website. It has more than 190 [coding challenges](https://thecodingtrain.com/challenges), each building one idea live in p5.js (or Processing). It's the best-known source of creative-coding teaching. This page covers two things to take from it: **how he explains things**, and **which challenges fit which module**.

> Checked 2026-10-18. Most challenge videos were recorded with p5.js 1.x, and the p5.js web editor has used 2.x by default since August 2026. Sketches using `preload()` or `keyIsPressed`/`key` need the 1.x version picker or the compatibility add-ons (see [Module 11](../modules/11-bridge-to-p5js.md)).

## 1. Teaching moves to borrow

Every challenge page has timestamped chapters, and they show the same pattern each time. The [Bouncing DVD Logo](https://thecodingtrain.com/challenges/131-bouncing-dvd-logo) (#131) is a typical example: *introduce -> describe -> whiteboard the concepts -> let's code -> test movement -> debug -> experiment with values -> add a twist -> conclude*.

| Move | What he does | Use it in our routine |
|---|---|---|
| **Start from something kids know** | Memes, games and songs: DVD logo, Flappy Bird, Snake, Pong, *Purple Rain* | Hook (0-5 min): show the real thing first ("Remember the DVD screensaver?"), *then* the sketch |
| **Whiteboard before code** | Each challenge has a "whiteboard the concepts" chapter: draw the canvas, the object, arrows for speed, the edge | Add 3 minutes of whiteboard to the live demo. Draw the box with `x`, `y`, `w`, `h` *before* typing `if (x + w > width)` |
| **Tiny steps, test after each** | "Track x and y" -> "test movement" -> "bounce off right edge" -> "all edges" | Write Create tasks as numbered steps, each ending in **Run it!** Kids never write more than 3-4 lines without running |
| **Real mistakes, fixed in public** | Bugs stay in the video; #76 has an "Important correction!" chapter | The deliberate mistake in the demo is good. When a *real* bug happens, slow down and narrate: "Hmm. What did I expect? What happened? Let's print it." |
| **Play with the numbers** | "Experiment with different values" is its own step | That's our Modify phase. Name it out loud: "Now we play." |
| **"Make your own version"** | Ends by inviting remixes; the community gallery is the [Passenger Showcase](https://thecodingtrain.com/showcase) | Share phase: our class gallery is the class's Passenger Showcase. Each challenge gets a remix and a screenshot in the gallery |
| **Enthusiasm and weirdness** | Celebrates odd results, jokes, and admits when he doesn't know | Matches "celebrate weird results" in the teacher guide |
| **A time limit as a game** | It's framed as a challenge: can I do this now, live? | Optional: "Coding challenge: 15 minutes, go!" with a visible timer. Some kids love it; drop it for anxious groups |

His beginner track, [Code! Programming with p5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js), teaches in this order: shapes, colour, errors and console, **`mouseX`/`mouseY` before your own variables**, then `random()` and `map()` in the variables chapter, conditionals (the bouncing ball), loops, functions, objects, arrays. This is the reorder recommended in the design review (`DESIGN-REVIEW.md` in the course folder).

## 2. Using the videos with kids

- **Don't play whole challenges.** Many are 15-60 minutes of an adult live-coding in JavaScript, with asides. Use the timestamped chapters to show **one 1-3 minute clip**: usually the "describe" or "whiteboard" part as a hook, or the final result.
- **You** watch the full video beforehand. It's a model of how to live-code and think aloud.
- **Ages 13+** can follow selected beginner-track videos at home as homework or catch-up (*Code!* chapters 1-3 in particular).
- YouTube may be blocked or age-restricted in school. Download clips beforehand if your school allows it, or use the written chapter list on the page as the "story".
- His code is the *answer*. Kids build the kid-sized version from our starter sketch first, then compare with his.

## 3. Challenge map by module

**Kid-sized** = a version that uses only ideas the module has taught. ★ = has a starter sketch in `sketches/`.

| Module | Challenge | Kid-sized version | Why it fits |
|---|---|---|---|
| 4 Animation | [#52 Random Walker](https://thecodingtrain.com/challenges/52-random-walker) | A dot that takes a random step each frame and leaves a trail (no `background()` in `draw()`). Needs one line of `random()` as a preview | Shows "no background = trails", a single variable changing per frame |
| 5 Conditionals | ★ [#131 Bouncing DVD Logo](https://thecodingtrain.com/challenges/131-bouncing-dvd-logo) -> `m05d_dvd_logo` | A rectangle bouncing off 4 walls, changing colour on every hit | Same idea as `m05a_bounce` but with `rect` (top-left corner!) and a meme kids know. Stretch: detect a **corner hit** (both `if`s on the same frame, with `&&`) |
| 6 Loops | [#76 10 PRINT](https://thecodingtrain.com/challenges/76-10print) | See Module 8 | A nested loop version also works here if `random()` has been introduced |
| 6 Loops (stretch) | ★ [#30 Phyllotaxis](https://thecodingtrain.com/challenges/30-phyllotaxis) -> `m06e_sunflower` | One loop draws a sunflower; change the angle 137.5 by 0.1 and watch it break | Biggest "wow" per line in the list. `cos`/`sin` are given as a black-box helper |
| 6 Loops (stretch, 12+) | [#133 Times Tables Cardioid](https://thecodingtrain.com/challenges/133-time-tables-cardioid-visualization) | Points round a circle; connect point `i` to point `i * 2` | Loop + a surprising maths picture. Same `cos`/`sin` helper |
| 8 Random | ★ [#76 10 PRINT](https://thecodingtrain.com/challenges/76-10print) -> `m08d_10print` | Flip a coin for each square: `\` or `/`. Click for a new maze | 1982 history, one `if`, `random()`, nested loop. Stretch: animate it one square per frame like the video; change the `chance`; invent new "tiles" |
| 8 Random (12+) | [#95 Approximating Pi](https://thecodingtrain.com/challenges/95-approximating-the-value-of-pi) | Throw random darts at a square; count how many land in the circle | `random` + `dist` + counters. A "the computer found π!" moment |
| 9 Objects | ★ [#4 Purple Rain](https://thecodingtrain.com/challenges/4-purple-rain) -> `m09c_purple_rain` | 400 `Drop` objects; closer drops are longer, thicker and faster | The classic first class. Same shape as `m09a_ball_class`. Remix: snow, stars, falling leaves |
| 9 Objects | [#27 Fireworks](https://thecodingtrain.com/challenges/27-fireworks) | Already in the course as `m09b_fireworks` | Show his video's final result as the hook |
| 9 Objects | [#78 Simple Particle System](https://thecodingtrain.com/challenges/78-simple-particle-system) | Smoke from the mouse: particles that fade and are removed | Uses `ArrayList` + removing, like `m09b` |
| 10 Games | ★ [#67 Pong](https://thecodingtrain.com/challenges/67-pong) -> `m10c_pong_starter` | Left paddle works; kids add the right paddle, its collision, and a winner | Two-player keyboard input (booleans from Module 5) and collisions |
| 10 Games | [#169 Pi in the Sky](https://thecodingtrain.com/challenges/169-pi-in-the-sky) | Our `m10a_catch_game` is the same game | Show the video as "here's how a pro builds the game you just played" |
| 10 Games (stretch) | [#3 Snake](https://thecodingtrain.com/challenges/3-snake-game) / [#115 Snake Redux](https://thecodingtrain.com/challenges/115-snake-game-redux) | Snake on a grid; the tail is an array | Already listed as a stretch idea in Module 10 |
| 10 Games (stretch) | [#31 Flappy Bird](https://thecodingtrain.com/challenges/31-flappy-bird) | One bird class, one pipe class | Needs Module 9 |
| 10 Games (stretch) | [#149 Tic Tac Toe](https://thecodingtrain.com/challenges/149-tic-tac-toe) | Two humans, click to place; check rows for a winner | Turn-based logic; tagged as beginner-friendly on the site |
| 11 p5.js | Any of the above | Open Shiffman's p5.js web editor version and compare it with our Processing one | Every challenge page links a p5.js editor sketch, and often a Processing version |

Not recommended for kids (too much maths, too many libraries, or too long): Mandelbrot/Julia, Fourier, neural networks and ml5, the physics libraries, Wave Function Collapse, A*, 3D supershapes. These are great for teacher inspiration or 15+ extension projects.

## 4. Before you teach a challenge

1. Watch the video and note the timestamps of the clip you'll show.
2. Run our starter sketch, and try the kid-sized version yourself without looking.
3. Write the Create task as 4-6 numbered steps, each ending in "Run it!".
4. Prepare 2-3 remix ideas for fast finishers (colours, numbers, a new rule, an interaction).
5. Plan the Share: screenshot into the class gallery, plus "one thing I changed from the original".
