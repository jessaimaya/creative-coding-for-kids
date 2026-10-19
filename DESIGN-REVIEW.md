# Design review: Creative Coding for Kids

Reviewed 2026-10-18. Covers `README.md`, `TEACHER-GUIDE.md`, all 11 modules, the resources, and a sample of the 29 Processing sketches and 2 p5.js sketches.

## 1. Verdict

The course is already well designed for kids' first text-based programming course. It uses Use-Modify-Create, predict-before-run, *Debug It!*, a fixed 60-minute routine, starts from working code, uses physical analogies, and has "I can..." checklists. These match the practices with the best evidence for school-age beginners. **Don't restructure it.** The changes below are about order, load and platform, not the overall approach.

## 2. What the research says, and how the course does

| Practice | Evidence | Course today |
|---|---|---|
| **PRIMM** (Predict, Run, Investigate, Modify, Make) | Sentance, Waite & Kallia (2019). Raspberry Pi reports improved outcomes in a study of about 500 learners aged 11-14 (text languages; no evidence yet for blocks) | Has Predict, Run, Modify, Make. **The Investigate step is thin**: there's no structured tracing or annotation of code |
| **Use-Modify-Create** (Lee et al. 2011) | Widely used for K-12. A 2020 SIGCSE panel notes learners don't always move through it smoothly, so the step from Modify to Create needs support | Core rule of the course. Good |
| **Worked examples + subgoal labels** | Reduce cognitive load for novices (Morrison et al.). Mostly undergraduate evidence, so applying it to kids is an inference | `CHANGE ME` comments do part of this. Sketches don't label the *parts* of the program (e.g. `// 1. move`, `// 2. bounce`, `// 3. draw`) |
| **Blocks before text?** | Weintrop & Wilensky (2019, high school): the early advantage of blocks fades after about 10 weeks of Java, and attitudes even out by 15 weeks | Supports starting directly in text for ages 10+. Keep blocks for under-10s only |
| **Pair programming, critique, reflection** | Creative Computing curriculum practice | Already there |

## 3. Processing (desktop) or p5.js?

Both teach the same ideas with nearly the same function names. Platform friction and having an audience affect whether kids stay with it more than any difference between the languages.

| Factor | Processing 4 (current: 4.5.6, July 2026) | p5.js (web editor, **2.x is default since Aug 2026**) |
|---|---|---|
| Getting started | Install once per machine. Works offline | Nothing to install. Runs on Chromebooks and lab PCs; needs internet |
| First lesson | **Static mode**: a 3-line program with no `setup()` | Needs `function setup() { createCanvas(...) }` from line 1 (the editor's starter template hides most of this) |
| Ceremony | `int`/`float`/`void`/`float[] x = new float[5]` | `let` for everything |
| Gotchas kids hit | `5 / 2 == 2`, `Type mismatch float->int`, `int(random(6))` | `=`/`==`/`===`; typos that silently give `NaN` or `undefined` (shape just doesn't appear) |
| Error messages | Caught before running, with the line highlighted, but in Java compiler language | Friendly Error System ("🌸 p5.js says:") gives plain-language hints for wrong arguments; other JS errors are raw |
| Sharing | Hard: no web export | **A link that works on a phone.** Big motivation for kids |
| Practising at home | Needs an install at home | Any browser |
| Stability of materials | Very stable | 2.x changed `preload` -> `async setup`/`await`, mouse buttons, `keyIsDown`. Many older tutorials and videos use 1.x patterns |
| Accounts | None | Saving needs an account. **Check the editor's privacy policy for under-13 rules before learners sign up** (I couldn't confirm the rule; sources conflict) |

**Recommendation.** Decide by the setting:
- **Stay with Processing** if lessons happen in a lab you control, learners don't practise at home, and you value offline reliability. The course is already built and compile-checked, and static mode makes lesson 1 the gentlest of any option.
- **Switch to p5.js from day 1** (not as Module 11) if learners use Chromebooks, should practise at home, or if showing family and friends matters. In Module 11 the sharing payoff arrives in the last session, too late to motivate anyone.

With no other constraint, I'd lean towards **p5.js 2.x**. For 10-14-year-olds the biggest risks of dropping out are friction and having no audience, not language details. Porting is cheap: 34 sketches (29 + 5 Coding Train starters), about 900 lines, mostly mechanical.

## 4. Concrete problems found

1. **Module 4 *Debug It!* is wrong.** The snippet puts `x = x + 3;` outside any function and asks "why doesn't the ball move?". In Processing 4 this **doesn't compile**: statements at the top level next to `setup()`/`draw()` are a mode-mixing error. I built it with `processing cli`: the broken version fails, and the corrected version builds. Either reframe the snippet as "read the red message", or use a version that compiles but fails at run time (e.g. `int x = 0;` declared *inside* `draw()`, so the ball never moves).
2. **The error decoder has no message for mixing static and active modes.** It's the error every learner hits in Module 4 when they add `setup()` to an old static sketch.
3. **p5.js material targets 1.x.** `sketches-p5/*/index.html` load p5 1.9.4 from cdnjs. That still works locally, but Module 11 tells learners to paste code into editor.p5js.org, which now runs 2.x by default. The translation table should add the 2.x keyboard and mouse patterns (`keyIsDown(LEFT_ARROW)`, `mouseButton.left`) because Module 10 games use keys. Either pin 1.x in the editor or update the files to 2.x.
4. **Module 9 (objects) is heavy for one session.** Class, fields, constructor, `this.x = x`, methods, `new`, `ArrayList`, and looping backwards to remove items, all for ages 10-14. Make it a 2-session extension. Module 10 doesn't need it (`m10a` has no classes), so make that explicit.
5. **Module 8 combines two unrelated ideas.** `random()` is one line and very rewarding. Arrays are one of the hardest ideas in the course. They don't belong in one module.

## 5. Recommended changes, by priority

**High: order of topics**
- **Teach `setup()`/`draw()` + `mouseX`/`mouseY` before learners make their own variables.** This is Shiffman's order in *Learning Processing* (interaction in Ch. 3, variables in Ch. 4). Built-in variables that change on their own give variables a reason to exist; "change one number on a static face" has a weaker payoff. It also removes the unexplained `mouseX` in `m02a`/`m02b`.
- **Move `random()` into Module 2 or 3.** Add "random colour every run" or "click for a new creature". Keep arrays in Module 8, on their own.
- **Introduce "make your own command" earlier.** A no-parameter `drawCreature()` fits naturally in Module 4, because learners already write `setup()`, `draw()` and `mousePressed()`. Leave parameters and `return` in Module 7.

**High: add the Investigate step**
- Each Modify sketch gets 3-4 short Investigate questions *before* the changes, such as: "Which line makes it move? Circle it." "What is `x` after 3 frames? Fill in the table." "What happens if you delete line 12? Predict first."
- Add a simple **trace table** (frame | x | speed) in Modules 4-6. Animation and loops are where a learner's mental model of the program breaks.
- Add **Parsons problems** (put scrambled lines in the right order) for loops and functions. They suit kids who type slowly and keep attention on structure rather than syntax.

**Medium: reduce load**
- Use `circle(x, y, d)` and `square(x, y, s)` alongside `ellipse`/`rect`. Both languages have them, and three numbers are easier than four for a circle.
- Label subgoals inside sketches: `// 1. move  // 2. bounce off walls  // 3. draw`. Learners copy this structure into their own work.
- If staying with Processing: use `float` everywhere for positions from Module 3 on, and mention `int` only for counting. This avoids the integer-division and type-mismatch problems in animation.

**Medium: motivation**
- **Earlier audience**: a class gallery is already planned. Add a mid-course "gallery day" (after Module 6) where work goes on a projector loop or to families.
- **Sound** is a strong hook for kids (Processing Sound library; p5.sound is still settling into 2.x, so check before relying on it).
- A **younger track** (8-10): the pacing note already exists. Consider p5.js for them specifically, since FES messages are easier to read than Java compiler errors.

**Low**
- Add a "first 10 minutes" troubleshooting card for the install and the folder-name rule (the sketch folder and `.pde` must have the same name). It's the most common setup failure.
- Only 2 of the modules have p5 versions. If p5.js becomes the main platform, port all 34 sketches and also use the editor's built-in sharing.

## 6. Suggested revised path (16 sessions)

| # | Module | Change |
|---|---|---|
| 1 | First marks | + `circle`/`square` |
| 2 | Coordinates, colour **+ random colour** | random moved here |
| 3 | **Interaction**: `setup`/`draw`, `mouseX`, `background` in `draw` | was the first half of Module 4 |
| 4 | **Variables that change**: own variables, speed, trace table | variables now motivated by motion |
| 5-6 | Conditionals | + Investigate questions |
| 7-8 | Loops | + Parsons problem, trace table |
| 9-10 | Functions | no-parameter version previewed in session 4 |
| 11 | Arrays (on their own) | split from random |
| 12 | Gallery day + mini-project | new |
| 13-15 | Games / final project | objects as an optional extension |
| 16 | Showcase + share online | if Processing, Module 11 slots in here |

## Sources

- Sentance, Waite & Kallia (2019), "Teaching computer programming with PRIMM: a sociocultural perspective", *Computer Science Education* 29(2-3). Summaries: [Raspberry Pi PRIMM quick read](https://static.raspberrypi.org/files/curriculum/quickreads/11-Pedagogy_Summary_PRIMM_V4_2023.pdf), [Barefoot PRIMM overview](https://www.barefootcomputing.org/docs/default-source/research-zone/primm-overview.pdf)
- Use-Modify-Create: [SIGCSE 2020 panel](https://appinventor.mit.edu/assets/files/SIGCSE2020Panel.pdf), [k12cs.org](https://k12cs.org/computational-thinking/)
- Subgoal labels: [Raspberry Pi seminar, cognitive load and subgoal labels](https://www.raspberrypi.org/blog/research-seminar-cognitive-load-subgoal-labels/)
- Blocks to text: [Weintrop & Wilensky 2019, *Computers & Education* 142](https://www.terpconnect.umd.edu/~weintrop/papers/Weintrop&Wilensky_2019_C&E.pdf)
- p5.js 2.x default switch: [processing/p5.js#8870](https://github.com/processing/p5.js/issues/8870), [v2 transition tutorial](https://p5js.org/tutorials/v2_transition/), [p5.js 2.0 "You are here"](https://medium.com/processing-foundation/p5-js-2-0-you-are-here-f827f40519a7)
- Friendly Error System: [Processing Foundation](https://processingfoundation.org/blog/friendly-error-system-for-p5js/)
- Processing releases: [processing.org/releases](https://processing.org/releases)
- p5 editor terms: [p5js.org/terms-of-use](https://p5js.org/terms-of-use), [forum thread on age](https://discourse.processing.org/t/privacy-policy-and-terms-of-service-for-p5js-org-web-editor/29247)
