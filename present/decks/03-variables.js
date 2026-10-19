// Module 3: Variables. Lesson plan: modules/03-variables.md
CC.deck({
  id: '03', num: 3, title: 'Variables', color: 'green', icon: 'box',
  bigIdea: 'A variable is a **labelled box**. Change the number inside once, and everything that uses it follows.',
  kidIdea: 'One number to rule them all: the shrink ray.',
  sessions: '1 session',
  plan: 'modules/03-variables.html',
  sketches: ['m03a_face_variable', 'm03b_creature_variables', 'm03c_variables_can_calculate'],
  slides: [
    { type: 'title' },
    {
      type: 'code', title: 'The shrink ray',
      sketch: 'm03a_face_variable',
      text: 'Drag the number next to `faceSize`. Watch the **whole face** change. Eyes, mouth, everything. How?',
      spotlight: [
        { find: 'int faceSize', note: 'One number in a box called `faceSize`. Drag it!' },
        { find: ['ellipse(cx', 'arc('], note: 'Every shape uses `faceSize` instead of a fixed number. So they all follow.' },
      ],
      notes: 'Hook (5 min): try 80, then 380.',
    },
    {
      type: 'big', kicker: 'A labelled box',
      statement: 'A variable is a box with a label on it.',
      text: 'Every time the code says `faceSize`, the computer looks inside the box. Swap the card, and the drawing changes. The **label** never changes. Only the **value** inside does.',
      art: 'box', label: 'faceSize', values: ['200', '80', '380', '120'],
      notes: 'If you can, bring a real box with a label and number cards.',
    },
    {
      type: 'act', title: 'Three steps',
      steps: [
        { t: 'Declare it', d: '`int faceSize = 200;` makes the box and puts 200 inside.' },
        { t: 'Use it', d: '`ellipse(200, 200, faceSize, faceSize);` reads the box.' },
        { t: 'Change it', d: 'Edit the number. Next time (Module 4) it will change **while the sketch runs**!' },
      ],
      reveal: true,
      notes: 'Borrowed from Noble, Lesson 3.1.',
    },
    {
      type: 'predict', title: 'What\'s annoying here?',
      name: 'three_circles',
      code: `
size(400, 400);
ellipse(100, 100, 50, 50);
ellipse(100, 160, 50, 50);
ellipse(100, 220, 50, 50);
`,
      question: 'I want all three circles to be bigger. How many numbers must I change?',
      answer: '**Six!** With a variable you change only one: `int d = 50;` then `ellipse(100, 100, d, d);`. Try it in Edit mode.',
    },
    {
      type: 'tasks', title: 'Play with the dials',
      sketch: 'm03b_creature_variables', timer: 20,
      items: [
        'In `m03a_face_variable`, try `faceSize` = 100, 300, 380.',
        'Move the face by changing `cx` and `cy`.',
        'Predict: which parts change if `faceSize` = 100? Test it.',
        'In `m03b_creature_variables`, make **three very different creatures** only by changing the dials. Screenshot each!',
      ],
    },
    {
      type: 'code', title: 'Variables can do maths',
      sketch: 'm03c_variables_can_calculate',
      text: 'Drag **only** the first number. Watch the console too.',
      spotlight: [
        { find: 'int base', note: 'The only number you change.' },
        { find: ['double1 =', 'triple =', 'sum ='], note: 'These are **calculated** from `base`. Change base, and they follow.' },
        { find: 'println', note: '`println()` shows a value in the console. Great for checking what\'s in a box.' },
      ],
    },
    {
      type: 'list', kicker: 'Two kinds of boxes', title: '`int` and `float`',
      points: [
        '`int` holds **whole numbers**: 3, 200, -5.',
        '`float` holds **decimals**: 0.5, 3.14.',
        'Use `float` for smooth movement and in-between values.',
        'Surprise: with `int`s, `5 / 2` is `2`, not 2.5! Check it with `println`. (The browser preview says 2.5, so try it in real Processing.)',
      ],
    },
    {
      type: 'challenge', title: 'Creature factory',
      text: 'Pick your favourite creature and make it yours.',
      rules: ['Add **two new variables** of your own (like `legLength`, `mouthWidth`)', 'Use them in your drawing', 'Give them good names: `legLength` beats `a`'],
      stretch: 'Add `int legs = 2;` and think: how would you draw 6 legs? (That\'s Module 6\'s job!)',
      sketch: 'm03b_creature_variables', minutes: 15,
    },
    {
      type: 'debug', name: 'box_bugs',
      code: `
size(400, 400);
int d = 100;
ellipse(200, 200, D, d);     // which letter is wrong?
d = 100.5;                   // can an int hold a decimal?
fill(255, 0, 0);
ellipse(300, 100, d);        // how many arguments?
`,
      bugs: [
        { line: 3, fix: '`D` and `d` are different! Capital letters matter.', message: 'D cannot be resolved to a variable' },
        { line: 4, fix: 'An `int` box only holds whole numbers. Use `float d` or a whole number.', message: 'Type mismatch: cannot convert from float to int' },
        { line: 6, fix: '`ellipse` needs 4 numbers: `ellipse(300, 100, d, d)`.', message: 'The method ellipse(float, float, float, float) in the type PApplet is not applicable for the arguments (int, int, int)' },
      ],
    },
    {
      type: 'vocab',
      words: [['variable', 'A labelled box that holds a value'], ['declare', 'Make the box: `int d = 50;`'], ['assign', 'Put a value in: `d = 80;`'],
        ['int', 'A whole number'], ['float', 'A decimal number'], ['value', 'What\'s inside the box'], ['console', 'Where `println()` shows things']],
    },
    {
      type: 'share',
      prompts: ['Explain a variable using the **box** idea.', 'Change one variable. Can your partner predict what will move?'],
    },
    {
      type: 'ican',
      items: ['explain a variable using the box idea.', 'change one variable and predict what moves.', 'make a variable with a good name and use it twice.', 'tell `int` and `float` apart.'],
    },
  ],
});
