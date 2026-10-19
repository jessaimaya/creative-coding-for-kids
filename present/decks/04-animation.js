// Module 4: Animation. Lesson plan: modules/04-animation.md
CC.deck({
  id: '04', num: 4, title: 'Animation', color: 'blue', icon: 'flipbook',
  bigIdea: '`draw()` is a **flip-book** that shows about 60 pages a second. Change a variable a little each page, and things **move**.',
  kidIdea: 'Make things move, and chase the mouse.',
  sessions: '1 session',
  plan: 'modules/04-animation.html',
  sketches: ['m04a_moving_ball', 'm04b_trails', 'm04c_follow_mouse'],
  slides: [
    { type: 'title' },
    {
      type: 'big', kicker: 'A flip-book',
      statement: '`draw()` is a flip-book.',
      text: 'It draws a page, wipes it, then draws the next one. About **60 pages every second**. If something is in a slightly different place on each page, it looks like it moves.',
      art: 'flipbook',
      notes: 'Hook (5 min): show a paper flip-book, or draw 5 stick-figure pages.',
    },
    {
      type: 'predict', title: 'Where is the ball after one second?',
      sketch: 'm04a_moving_ball',
      question: 'The ball moves 3 pixels every frame, 60 frames a second. Where is it after **1 second**? And later?',
      answer: '3 × 60 = **180 pixels** from the left. Then it keeps going and **leaves the screen**. (Module 5 will fix that!)',
    },
    {
      type: 'code', title: 'The three rooms',
      sketch: 'm04a_moving_ball',
      text: 'Every moving sketch has the same shape: **top** (variables) → **setup** (once) → **draw** (forever).',
      spotlight: [
        { from: 'int x', to: 'int speed', note: '**Top room:** variables live here, outside any function, so they remember their value.' },
        { from: 'void setup', note: '**setup()** runs **once** at the start.' },
        { from: 'void draw', note: '**draw()** runs again and again, about 60 times a second.' },
        { find: 'background', note: 'Wipe the page clean, so the old ball disappears.' },
        { find: 'x = x + speed', note: 'Change `x` a little every frame. That\'s the movement!' },
      ],
      notes: 'Live demo (10 min): remove `background()` and run ("Smear!"); set `speed` to -3; add a `y` to move diagonally.',
    },
    {
      type: 'list', kicker: 'Live demo', title: 'Let\'s break it on purpose',
      points: [
        'Delete `background()`. What happens? (A smear! The old pages never get wiped.)',
        'Change `speed` to **-3**. Which way does it go now?',
        'Add `int y = 0;` and `y = y + 2;`. Now it moves **diagonally**.',
        'What if `speed` is **0**?',
      ],
      reveal: true,
    },
    {
      type: 'tasks', title: 'Your turn: three sketches',
      sketch: 'm04a_moving_ball', timer: 20,
      items: [
        '`m04a`: change `speed` (try 1, 10, -3).',
        '`m04a`: make the ball move **down** instead of right.',
        '`m04a`: make it move diagonally.',
        '`m04b_trails`: change `fill(0, 25)` to 255, 100, 5. What happens to the trail?',
        '`m04c_follow_mouse`: change `ease` (0.01, 0.5, 1).',
      ],
    },
    {
      type: 'code', title: 'Trails',
      sketch: 'm04b_trails',
      spotlight: [
        { find: 'fill(0, 25)', note: 'A nearly see-through black: each frame only **fades** the old pages. Drag the 25!' },
        { find: 'rect(0, 0, width, height)', note: 'Instead of `background()`, a see-through rectangle covers everything.' },
      ],
    },
    {
      type: 'code', title: 'Chase the mouse',
      sketch: 'm04c_follow_mouse',
      text: 'Move your mouse over the canvas.',
      spotlight: [
        { find: 'mouseX - x', note: '`mouseX` and `mouseY` are variables the computer updates **for you**.' },
        { find: 'float ease', note: 'How eager is it? 0.01 is lazy, 1 is glued to the mouse. Drag it!' },
      ],
    },
    {
      type: 'codingtrain', title: 'Random Walker',
      num: 52, url: 'https://thecodingtrain.com/challenges/52-random-walker', clip: 'the first minute',
      text: 'A dot takes **one random step** every frame. With no `background()`, it draws its path.',
      steps: ['`random(-3, 3)` picks a different number each frame (more in Module 8).', 'Positions are `float` boxes, because `random()` gives decimals.', 'Remix: a different colour, bigger steps, two walkers!'],
      name: 'random_walker',
      code: `
// Coding Train Challenge #52: Random Walker
float x = 200;
float y = 200;

void setup() {
  size(400, 400);
  background(30, 30, 60);
}

void draw() {
  fill(255, 200, 0);
  noStroke();
  ellipse(x, y, 6, 6);
  x = x + random(-3, 3);     // CHANGE ME: bigger steps?
  y = y + random(-3, 3);
}
`,
    },
    {
      type: 'challenge', title: 'A living scene',
      text: 'Make a scene where **at least two things move differently**.',
      rules: ['A sun crossing the sky', 'A car that drives', 'A fish that follows the mouse', '...or your own idea!'],
      stretch: 'Move in a wave with `sin(frameCount * 0.05)`, like the trails sketch.',
      minutes: 20,
    },
    {
      type: 'debug', name: 'stuck_ball',
      code: `
int x = 0;
void setup() {
  size(400, 400);
}
void draw() {
  background(255);
  ellipse(x, 200, 50, 50);
}
x = x + 3;                 // why won't this run?
`,
      text: 'Processing refuses to run this. Why?',
      bugs: [
        { line: 9, fix: 'Code that **does** something must live **inside** a function. Move `x = x + 3;` inside `draw()`, after the ellipse.', message: 'A red error instead of a running sketch', messageLabel: 'You\'ll see' },
      ],
      notes: 'The lesson plan says "why doesn\'t the ball move?", but Processing 4 refuses to compile this (checked with the Processing CLI). Read the red message together. Bonus: put `background()` AFTER the ellipse and ask why the circle vanishes.',
    },
    {
      type: 'vocab',
      words: [['frame', 'One page of the flip-book'], ['setup()', 'Runs once at the start'], ['draw()', 'Runs again and again, ~60 times a second'],
        ['frame rate', 'How many frames per second'], ['speed', 'How much a variable changes each frame'], ['mouseX', 'Where the mouse is, left to right'], ['easing', 'Moving a fraction of the way each frame']],
    },
    {
      type: 'ican',
      items: ['explain `setup()` and `draw()` in my own words.', 'make something move across the screen.', 'make something follow the mouse.', 'explain why the screen smears without `background()`.'],
    },
  ],
});
