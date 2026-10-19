// Module 6: Loops. Lesson plan: modules/06-loops.md
CC.deck({
  id: '06', num: 6, title: 'Loops', color: 'yellow', icon: 'loop',
  bigIdea: 'A loop **repeats** code so you don\'t have to copy and paste. The counter is a variable you can use.',
  kidIdea: 'Twenty circles in one line. Grids, rainbows, sunflowers.',
  sessions: '2 sessions',
  plan: 'modules/06-loops.html',
  sketches: ['m06a_row_of_circles', 'm06b_grid', 'm06c_rainbow', 'm06d_loop_and_if', 'm06e_sunflower'],
  slides: [
    { type: 'title' },
    {
      type: 'act', title: 'The pain', timer: 2,
      text: 'Draw **20 circles in a row**, using only copy and paste. You have 2 minutes. Go!',
      steps: [
        { t: 'Copy, paste...', d: '`ellipse(30, 200, 30, 30);`' },
        { t: 'Change, change...', d: '`ellipse(65, 200, 30, 30);` `ellipse(100, 200, 30, 30);`' },
        { t: 'Groan!', d: 'There must be a better way...' },
      ],
      notes: 'The pain is the lesson (10 min). After two minutes, show the loop.',
    },
    {
      type: 'code', title: 'Repeat without copy-paste',
      sketch: 'm06a_row_of_circles',
      text: 'Count the circles. Then drag the `10`.',
      spotlight: [
        { find: 'for (', note: 'Start at `i = 0`. Keep going while `i < 10`. After each round, `i++` adds 1.' },
        { find: '30 + i * 35', note: '`i` is 0, then 1, then 2... so each circle lands 35 pixels further right.' },
      ],
      notes: 'Live demo: put `println(i);` inside the loop and watch the console: 0, 1, 2...',
    },
    {
      type: 'big', kicker: 'Read a loop',
      statement: 'Every `for` loop has three parts.',
      text: '`for (int i = 0; i < 10; i++) { ... }` repeats the code inside the `{ }`.',
      art: 'loop',
    },
    {
      type: 'tasks', title: 'Loop it',
      sketch: 'm06a_row_of_circles', timer: 20,
      items: [
        'Draw 20 circles. Then 5.',
        'Change the spacing from 35 to 20.',
        'Make the row go **down** instead of across.',
        'Make the circles **grow** as `i` grows.',
        'Make a diagonal staircase (use `i` in both x and y).',
      ],
    },
    {
      type: 'challenge', title: 'Built from a loop',
      text: 'Make a drawing built from a loop.',
      rules: ['Rainbow stripes', 'A brick wall', 'A picket fence', 'A row of windows on a building'],
      minutes: 15,
    },
    {
      type: 'predict', title: 'A loop inside a loop',
      sketch: 'm06b_grid',
      question: 'How many squares will it draw?',
      answer: '8 × 8 = **64**. The outer loop picks the **row**, the inner loop fills that row, like rows of seats in a cinema.',
      notes: 'Session B starts here.',
    },
    {
      type: 'code', title: 'A rainbow from one number',
      sketch: 'm06c_rainbow',
      spotlight: [
        { find: 'colorMode', note: 'In HSB mode, the first number is the **hue**: 0 to 360 goes all round the rainbow.' },
        { find: 'fill(i * 10', note: 'Each stripe\'s hue is `i * 10`, so the colours sweep the rainbow.' },
      ],
    },
    {
      type: 'code', title: 'Loop + if together',
      sketch: 'm06d_loop_and_if',
      spotlight: [
        { find: 'd -= 40', note: 'This loop counts **down**: 400, 360, 320... each ring is smaller.' },
        { find: 'ring % 2', note: '`%` gives the remainder. `ring % 2` goes 0, 1, 0, 1... so colours alternate. Try `% 3`!' },
      ],
    },
    {
      type: 'codingtrain', title: 'A sunflower from one loop',
      num: 30, url: 'https://thecodingtrain.com/challenges/30-phyllotaxis', clip: 'the final result',
      text: 'Each seed turns **137.5°** further round than the one before. Real sunflowers do this!',
      steps: ['Predict: what happens if `turn` is 90? 180?', 'Drag `turn` by just 0.1. Watch the spiral fall apart!', '`cos()` and `sin()` are helpers that point round a circle.', 'Remix: new colours, seed sizes, or squares.'],
      sketch: 'm06e_sunflower',
    },
    {
      type: 'challenge', title: 'Pattern poster',
      text: 'Make a poster with **at least one loop and one `if`**.',
      examples: 'a chessboard, a target, a rainbow tunnel, a sunburst of lines from the centre, a city skyline with window grids.',
      stretch: 'Make the grid react to the mouse: colour each cell by its distance to `mouseX`, `mouseY`.',
      minutes: 25,
    },
    {
      type: 'debug', name: 'loop_bugs',
      code: `
for (int i = 0; i < 10; i--) {          // what happens to i?
  ellipse(30 + i * 35, 200, 30, 30);
}

for (int i = 0; i < 10; i++); {         // semicolon again!
  ellipse(30 + i * 35, 200, 30, 30);
}
`,
      text: 'Don\'t run these! Find the bugs by reading.',
      bugs: [
        { line: 1, fix: '`i--` makes `i` go **down**: 0, -1, -2... It\'s always less than 10, so the loop never ends: an **infinite loop**. The window freezes. Press Stop, then use `i++`.', message: 'The window freezes', messageLabel: 'What happens' },
        { line: 5, fix: 'A `;` after `for (...)` ends the loop with nothing inside it. Delete the `;`.' },
      ],
      notes: 'Don\'t paste the first loop into the live player: it would freeze the browser tab too.',
    },
    {
      type: 'vocab',
      words: [['loop', 'Code that repeats'], ['iteration', 'One trip round the loop'], ['counter', 'The variable that counts, often `i`'],
        ['i++', 'Add 1 to `i`'], ['nested loop', 'A loop inside a loop'], ['%', 'The remainder after dividing: `7 % 2` is 1']],
    },
    {
      type: 'ican',
      items: ['turn repeated code into a loop.', 'predict how many shapes a loop draws.', 'use `i` to change position, size or colour.', 'make a grid with nested loops.'],
    },
  ],
});
