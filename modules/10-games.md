# Module 10: Games and the final project

**Big idea:** A game is the ideas you already know working together: input (mouse/keys), movement (variables), rules (conditionals), repetition (loops), organisation (functions, objects), and a **state** (title, playing, game over).
**Time:** 2-3 sessions. **Sketches:** `m10a_catch_game` (play and modify), `m10b_game_template` (build your own), `m10c_pong_starter` (Coding Train).

## By the end, learners can
- [ ] Read a small complete game and explain each function.
- [ ] Use a `state` variable for title / playing / game over screens.
- [ ] Detect collisions with `dist()` or a bounding-box test.
- [ ] Track a score and lives, and increase difficulty.
- [ ] Plan, build, test, and show their own small game.

## Vocabulary
**game loop**, **state**, **collision**, **score**, **lives**, **difficulty**, **playtest**.

## Session A: Play it, then read it

### 0. Hook (5 min)
Playtest `m10a_catch_game` for 5 minutes in pairs. Compete for a high score.

### 1. Dissecting (15 min)
Draw a map of the game on the board:

```
state 0 (title) -> click -> state 1 (playing) -> lives == 0 -> state 2 (game over) -> click -> state 1
```
Then read the code with the class: which function does each box? Which variable tracks the score? Where is the collision?

### 2. Modify (30 min)
Pick **three** changes and test them:
1. Paddle width / star speed / lives.
2. A second falling object that's *bad* (lose a life if caught).
3. Speed increases with score.
4. Different art: stars become fruit; paddle becomes a basket.
5. Add a high score variable.
After each change, **playtest**: "Is it more fun? Why?"

### 3. Debug It!
```java
if (starY > height - 40 && starX - mouseX < paddleW/2) {   // what's missing?
  score++;
}
```
(Collision needs an absolute distance: `abs(starX - mouseX)`.) Show what happens when the paddle is on the *left* and the star on the *right*.

## Session B-C: Your game

### Game design in 10 minutes
Each learner fills in:
- **Goal**: what does the player try to do?
- **Controls**: mouse? arrow keys?
- **Danger**: what makes it hard?
- **Win/lose**: how does it end?
- **Art**: shapes only is fine!

### Build in small steps (the "playable early" rule)
1. Player moves (30 min)
2. One thing the player interacts with (30 min)
3. Score + game-over state (30 min)
4. Polish: colours, extra enemies, sound/text, difficulty

Use `m10b_game_template`. It has `TODO` markers.
Game ideas that fit our skills: dodge the falling rocks; catch/avoid; maze with a goal (shape-based); clicker/whack-a-mole; simple Pong; "don't touch the walls"; Flappy-style; snake (stretch: arrays/lists).

### Showcase (last 20 min)
Playtest each other's games for 2 minutes each. Feedback format: *I liked ... / I wonder ...*.

## Teacher notes
- **Scope is the enemy.** "Make it work with a rectangle first."
- Insist on **one small playable version** by the end of the first build session.
- Keyboard input needs `keyPressed()` or `keyCode`: a good short mini-lesson: LEFT/RIGHT/UP/DOWN.
- Expect lots of "it doesn't work" bugs. Use the debug habits: print the variable, check the condition, comment out recent changes.

## I can...
- [ ] ...use a state variable for screens.
- [ ] ...detect when two things touch.
- [ ] ...keep score and end the game.
- [ ] ...playtest and improve my game.

## Coding Train challenges
- **[#169 Pi in the Sky](https://thecodingtrain.com/challenges/169-pi-in-the-sky)** is the same idea as `m10a_catch_game`. After the class has played and modified it, show a clip: "Here's how someone else built the game you just played."
- **`m10c_pong_starter`, from [#67 Pong](https://thecodingtrain.com/challenges/67-pong)**: two players on one keyboard. The left paddle (W/S) works. Learners do the TODOs in order: arrow-key booleans, move the right paddle, its collision, first to 5 wins. This is a good alternative to a fully free game for learners who'd rather finish a known game.
- More stretch ideas, with videos: [#3 Snake](https://thecodingtrain.com/challenges/3-snake-game), [#31 Flappy Bird](https://thecodingtrain.com/challenges/31-flappy-bird) (needs Module 9), [#149 Tic Tac Toe](https://thecodingtrain.com/challenges/149-tic-tac-toe).

## In the books
- **Cermak-Sassenrath, *Intro to Game Programming using Processing***: Ch. 15 *Movement*, 16 *Basic Collision Detection*, 26 *Event-Driven Programming and Game Controls*, 28 *Sprites, Frame-Based Animation and Timed Events*, 36 *Basic Game AI and Enemy Behaviour*, 23 *Debugging and Common Errors*, 24 *Programming Rules of Thumb*.
- **Noble**: Ch. 6 *Events and Interactions for Simple Games, Part 1* (booleans, keyboard, walking character, boundaries), Ch. 7 *Part 2* (timers, key controls, collision with `dist()`, two players, jumping), Ch. 8 (levels, states, choice-based projects, final project).
- **Meyer**: Ch. 5 *More Interactions*, Ch. 9 *Hangman*.
- For game *design* ideas, look through Scratch project books and the [Creative Computing curriculum](https://creativecomputing.gse.harvard.edu/guide/). Their game ideas translate directly to Processing.
