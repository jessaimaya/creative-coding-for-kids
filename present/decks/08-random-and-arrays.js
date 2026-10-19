// Module 8: Randomness and arrays. Lesson plan: modules/08-random-and-arrays.md
CC.deck({
  id: '08', num: 8, title: 'Random and arrays', color: 'blue', icon: 'dice',
  bigIdea: '`random()` is **controlled surprise**. An array is a **numbered row of boxes**: one name, many values.',
  kidIdea: 'A new picture every click. Thirty bubbles, one name.',
  sessions: '1-2 sessions',
  plan: 'modules/08-random-and-arrays.html',
  sketches: ['m08a_random_confetti', 'm08b_arrays_bubbles', 'm08c_generative_poster', 'm08d_10print'],
  slides: [
    { type: 'title' },
    {
      type: 'hook', title: 'Same code, different picture',
      sketch: 'm08a_random_confetti',
      text: 'Click the canvas. **Same code**, a different picture every time!',
      sub: 'You choose the range. The computer picks the number.',
    },
    {
      type: 'code', title: 'Ask for a random number',
      name: 'random_numbers',
      code: `
// Press Run again (or drag a number) to roll new ones. Look at the console!
size(400, 120);
background(255);
println(random(10));          // from 0 up to just below 10
println(random(5, 10));       // from 5 up to just below 10
println(int(random(1, 7)));   // like rolling a dice: 1 to 6
fill(random(255), random(255), random(255));
ellipse(200, 60, 80, 80);     // a random colour every time
`,
      spotlight: [
        { find: 'random(10)', note: '`random(10)` picks any number from 0 up to (but not including) 10.' },
        { find: 'int(random(1, 7))', note: '`int()` chops off the decimals, so you get 1, 2, 3, 4, 5 or 6.' },
        { find: 'fill(random', note: 'Three random dials make a random colour.' },
      ],
    },
    {
      type: 'tasks', title: 'Make the confetti yours',
      sketch: 'm08a_random_confetti', timer: 20,
      items: [
        'More pieces. Fewer pieces.',
        'Narrow the colour ranges: `random(150, 255)` gives pastel, `random(100)` gives dark.',
        'Change the shapes to circles. Then to lines. Then both.',
        'Use `if (random(1) < 0.2)` to make 20% of the pieces special.',
      ],
    },
    {
      type: 'codingtrain', title: '10 PRINT',
      num: 76, url: 'https://thecodingtrain.com/challenges/76-10print', clip: '"What is 10Print?" (about 2 min)',
      text: 'A famous program from **1982** that fitted on one line of a Commodore 64. Flip a coin for each square: `\\` or `/`.',
      steps: ['Click the canvas for a new maze.', 'Drag `chance`: 0.1 and 0.9. Why does the maze tilt?', 'Invent two tiles of your own and let `random()` choose.', 'Stretch: draw one square per frame so the maze types itself out.'],
      sketch: 'm08d_10print',
    },
    {
      type: 'challenge', title: 'Rules + chance',
      text: 'Decide some **rules**, and let randomness fill in the rest.',
      rules: ['Always blue near the bottom', 'Circles only on the left', 'Lines only in the middle', '...your own rules!'],
      minutes: 20,
    },
    {
      type: 'big', kicker: 'Session B: arrays',
      statement: 'An array is a numbered row of boxes.',
      text: 'I want 30 bubbles. Do I make `x1`, `x2`, `x3` ... `x30`? No! One name, `x`, with numbered boxes: `x[0]`, `x[1]`, `x[2]`... Counting starts at **0**.',
      art: 'mailboxes', values: ['100', '150', '0', '0', '0'],
      analogy: { title: 'Like mailboxes in a hallway', text: '`x[3]` means mailbox number 3. Five mailboxes are numbered 0 to 4.' },
    },
    {
      type: 'code', title: 'Make an array',
      name: 'mailboxes',
      code: `
size(400, 100);
float[] x = new float[5];   // 5 boxes, numbered 0 to 4
x[0] = 100;
x[1] = 150;
println(x[1]);              // what's in box 1?
println(x.length);          // how many boxes?
`,
      spotlight: [
        { find: 'new float[5]', note: '`new float[5]` makes 5 boxes. They all start at 0.' },
        { find: 'x[1] = 150', note: 'Put 150 in box number **1** (the second box!).' },
        { find: 'x.length', note: '`x.length` tells you how many boxes there are.' },
      ],
      notes: 'In real Processing, `x[5]` crashes with ArrayIndexOutOfBoundsException ("there is no mailbox 5"). The browser preview doesn\'t crash, so show that in Processing.',
    },
    {
      type: 'code', title: '30 bubbles, not 30 variables',
      sketch: 'm08b_arrays_bubbles',
      spotlight: [
        { find: 'new float[n]', note: 'Four arrays: one for each thing a bubble needs. These are **parallel arrays**.' },
        { find: 'x[i] = random(width)', note: 'A loop fills every box with a random start.' },
        { find: 'y[i] = y[i] - speed[i]', note: 'Each bubble floats up at its **own** speed.' },
      ],
    },
    {
      type: 'tasks', title: 'Bubble time',
      sketch: 'm08b_arrays_bubbles', timer: 20,
      items: [
        'More bubbles. Faster bubbles. Different colours.',
        'Make them float **down** instead.',
        'Make them sway sideways: `x[i] += random(-1, 1);`',
        'Why are there **four** arrays? (Module 9 joins them into one!)',
      ],
    },
    {
      type: 'challenge', title: 'Generative poster',
      text: 'Start with `m08c_generative_poster`. Click for a new poster.',
      rules: ['Change `cell` and add a new shape type', 'Pick a palette of 4-5 colours and use only those', 'Save your 3 favourites (press **S** in Processing)'],
      stretch: 'A poster that depends on the mouse, or one with mirror symmetry.',
      sketch: 'm08c_generative_poster', minutes: 30,
    },
    {
      type: 'debug', name: 'off_by_one',
      code: `
float[] y = new float[10];
for (int i = 0; i <= 10; i++) {      // what's off by one?
  y[i] = random(height);
}
`,
      bugs: [
        { line: 2, fix: '`i <= 10` goes up to 10, but the boxes are numbered **0 to 9**. Use `i < 10` (or `i < y.length`).', message: 'ArrayIndexOutOfBoundsException' },
      ],
      notes: 'Another classic: reading `x[i]` before filling it (all zeros).',
    },
    {
      type: 'vocab',
      words: [['random', 'A surprise number in a range you choose'], ['range', 'The lowest and highest numbers allowed'], ['array', 'A numbered row of boxes'],
        ['index', 'A box number: `x[3]`'], ['length', 'How many boxes'], ['generative art', 'Art made by rules + chance'], ['noLoop()', 'Draw once, then wait']],
    },
    {
      type: 'ican',
      items: ['use `random()` with a range.', 'make a click-for-a-new-picture sketch.', 'explain an array and its index.', 'use a loop to fill and use an array.'],
    },
  ],
});
