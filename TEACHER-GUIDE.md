# Teacher Guide

## 1. The 60-minute routine (use it every session)

| Min | Phase | What happens |
|---|---|---|
| 0-5 | **Hook** | Show a finished sketch that uses today's idea. "By the end you'll make this." |
| 5-10 | **Predict** | Show 5-10 lines of code. Ask: "What will it draw?" Take guesses *before* pressing Run. Being wrong is the learning moment. |
| 10-15 | **Live demo** | Start with 2-3 minutes at the **whiteboard**: draw the canvas, the object, arrows for movement, and label the numbers. Then type the key idea from scratch on the projector, narrating, and run after every few lines. Make one deliberate mistake and fix it out loud. |
| 15-35 | **Modify** | Learners open the module's sketch, save a copy, and work through the `CHANGE ME` tasks. One change at a time. |
| 35-50 | **Create** | An open challenge using only today's idea, with a stretch for fast finishers. |
| 50-60 | **Share** | Gallery walk or pairs. Each learner explains **one line** of their code to a neighbour. |

Why this order: prediction primes attention, the demo models the thinking, and "Modify" gives everyone a guaranteed success before the open task.
The [Creative Computing curriculum](https://creativecomputing.gse.harvard.edu/guide/) (Harvard ScratchEd, for Scratch) uses the same practices: experimenting and iterating, testing and debugging, reusing and remixing. It also uses *Debug It!* activities and critique groups, which are adopted here.

## 2. How to explain the big ideas

| Concept | One-sentence version | Physical / acting-out trick |
|---|---|---|
| Statement | One instruction; the computer does them in order. | Kids give *you* step-by-step drawing instructions; you follow them literally. |
| Coordinates | Origin is the top-left; y grows **downward**. | Put a grid of tape on the floor. A kid "walks" to (3, 2). |
| Variable | A labelled box that holds a value. | A real box with a label. Swap the card inside; everything that reads the label changes. **Declare it, use it, change it.** (Noble teaches variables in these three steps.) |
| `draw()` | Runs about 60 times a second. | Flip-book: draw, flip, erase, draw again. |
| Conditional | A question with a yes/no answer decides what happens. | "If it's raining, take an umbrella." Act it out, then write it. |
| Loop | Do it again, N times. | Have them type 10 circles by hand first. *Then* show the loop. The pain is the lesson. |
| Function | A named recipe you write once and run many times. | A pizza recipe: same steps, different toppings (parameters). |
| Array | A numbered row of boxes. | Mailboxes in a hallway. `x[3]` = mailbox number 3 (we start counting at 0). |
| Class | A blueprint; each `new` thing built from it has its own data. | Cookie cutter (class) vs. cookies (objects). |

Book authors use the same ideas: Cermak-Sassenrath matches the *container* to the *content* for variables, and Nyhoff uses a recipe analogy for `if`.

## 3. Debugging is the real subject

Teach these habits from lesson 1 and repeat them every week:

1. **Change one thing at a time.**
2. **Read the red message.** It names a line number. Look at that line *and the one above it*.
3. **Predict, then run.** If the result surprises you, you just found something to learn.
4. **Print to see.** `println(x);` shows a value in the console.
5. **Undo is allowed.** Ctrl/Cmd+Z, or comment out the last thing you added with `//`.
6. **Ask three before me.** Neighbour, neighbour, then teacher.

Every module has a **Debug It!** with a deliberately broken snippet. See also [`resources/error-decoder.md`](resources/error-decoder.md) for the common red messages in kid language.

## 4. Classroom practices that help

- **Pair programming** with swapped roles every 5 minutes: *driver* types, *navigator* reads and suggests.
- **Start-from-working.** Never ask a learner to start from a blank file before Module 6. Give them a running sketch and a list of changes.
- **Show the reference.** From Module 2 on, show how to find a function in *Help > Reference*. (Noble has a whole lesson, 1.10, on using it.)
- **Name things well.** `ballSpeed` beats `a`. Model it and correct gently.
- **Celebrate weird results.** "Not what you planned, but look at that!" keeps experimenting alive.
- **Model like The Coding Train.** Whiteboard first, tiny steps with a run after each, real bugs fixed out loud, end with "make your own version". See [resources/coding-train.md](resources/coding-train.md); it also suggests one challenge per module.
- **Keep a class gallery** (screenshots in a shared folder) so work is visible.

## 5. Pacing and age adjustments

- **Ages 8-10:** do Modules 1-5 slowly, skip 8's arrays, stop at Module 7 plus a mini-project. Use paired work and printed cheat sheets.
- **Ages 10-14:** the full track.
- **Ages 14+:** compress Modules 1-4 into two sessions, spend longer on 8-10, add Module 11 and 3D (see Meyer ch. 10 and the Cookbook ch. 3).
- If a module is going badly, **stay another session**. Loops and functions are where the group decides whether programming is "for them".

## 6. Assessment: "I can..." checklists

Every module ends with a short "I can..." list. Use them as a self-assessment (kids tick), then check one item in person per learner. Keep a simple portfolio: one screenshot plus one sentence per module.
Reflection prompts for the share phase:
- "What did you change that surprised you?"
- "What would happen if you changed X? Predict, then test."
- "Which line is the most important in your sketch? Why?"
- "What bug did you fix today, and how did you find it?"

## 7. Final showcase

At the end of Module 10 hold a 20-minute showcase: each learner shows their sketch or game, explains **one thing they're proud of** and **one bug they beat**, and takes one question. Peers give feedback in the form "I liked ... / I wonder ...".

## 8. Where to look in the books

See [`resources/book-map.md`](resources/book-map.md). Short version:

- **Spine for you (the teacher):** Meyer, *Programming 101*; Nyhoff, *Processing: An Introduction to Programming*; Cermak-Sassenrath, *Introduction to Game Programming using Processing*.
- **Lesson-by-lesson with images:** Noble, *Programming Media Art Using Processing* (its lesson structure matches this course closely).
- **Inspiration and later projects:** chapters on generative art in *Processing Creative Coding and Generative Art*, plus *Generative Design* (p5.js).
- **Teaching practice:** the [Creative Computing curriculum](https://creativecomputing.gse.harvard.edu/guide/) and its learner workbook.
