// Welcome deck: how the club works. Use it at the start of the first session.
CC.deck({
  id: '00', num: 0, title: 'Welcome, coders!', color: 'green', icon: 'star',
  bigIdea: 'Code is a list of instructions. We\'ll use it to make **art**, **animations** and **games**.',
  kidIdea: 'How our club works, and your first number to drag.',
  sessions: '10 minutes',
  plan: 'TEACHER-GUIDE.html',
  slides: [
    { type: 'title' },
    {
      type: 'hook', title: 'This is code!',
      sketch: 'm09c_purple_rain',
      text: 'About 50 lines of code make this rain.',
      sub: 'By the end of the course you\'ll write things like this yourself.',
      notes: 'Let it run for a moment. Ask: "What do you notice? Why are some drops faster?" (They are "closer".)',
    },
    {
      type: 'big', kicker: 'What is code?',
      statement: 'Code is a list of instructions for the computer.',
      text: 'The computer is super fast and super literal. It does **exactly** what you write, in order, top to bottom.',
      analogy: { title: 'Like a recipe', text: 'A recipe only works when every step is clear and in the right order. Code is the same.' },
    },
    {
      type: 'code', title: 'Try it: drag a yellow number!',
      name: 'first_drag',
      code: `
// Drag the yellow numbers left and right. Watch the picture change!
size(400, 400);
background(255, 240, 200);   // CHANGE ME: red, green, blue
fill(255, 100, 150);         // CHANGE ME: the colour of the circle
ellipse(200, 200, 150, 150); // CHANGE ME: x, y, width, height
`,
      spotlight: [
        { find: 'ellipse', note: 'The first two numbers say **where** the circle is. The last two say **how big**.' },
        { find: 'fill', note: 'Three numbers mix a colour: red, green, blue. Each goes from 0 to 255.' },
      ],
      notes: 'Let a few learners come up and drag a number. Celebrate weird results. Press → to spotlight lines.',
    },
    {
      type: 'code', title: 'Ask the code: click any word!',
      name: 'ask_me',
      text: 'Click `ellipse`, a number, or even a `;`. A card explains what it means. This works in **every** code on every slide.',
      code: `
// Click on any word, number or symbol to ask what it means.
size(400, 400);
background(255, 240, 200);
fill(255, 100, 150);
ellipse(200, 200, 150, 150);
`,
      notes: 'Model it: click `size`, then the first 200 in `ellipse` (it says "x: how far the centre is from the left"), then the `;`. The cards link to the code dictionary.',
    },
    {
      type: 'act', title: 'How every lesson works',
      steps: [
        { t: 'Predict', d: 'Guess what the code will do **before** you run it. Being wrong is how you learn!' },
        { t: 'Run', d: 'Press the Run button and check your guess.' },
        { t: 'Change', d: 'Change **one** number at a time and see what happens.' },
        { t: 'Make', d: 'Use the idea to make something that is **yours**.' },
      ],
      reveal: true,
      notes: 'This is Use-Modify-Create (with Predict first). Press → to reveal each card.',
    },
    {
      type: 'list', kicker: 'When something breaks', title: 'Bugs are normal. Here\'s what we do.',
      points: [
        'Change **one** thing at a time.',
        'Read the red message. Look at that line **and the one above it**.',
        'Predict, then run. A surprise means you just found something to learn.',
        '`println(x);` shows you what is inside `x`.',
        'Undo is allowed! **Ctrl+Z**, or turn a line off with `//`.',
        '**Ask three before me:** neighbour, neighbour, then teacher.',
      ],
    },
    {
      type: 'act', title: 'Pair programming', timer: 5,
      steps: [
        { t: 'Driver', d: 'Types the code. Only the driver touches the keyboard.' },
        { t: 'Navigator', d: 'Reads, spots bugs, and suggests what to try next.' },
        { t: 'Swap!', d: 'Every 5 minutes, swap seats. Use the timer.' },
      ],
    },
    {
      type: 'big', kicker: 'Our club rule',
      statement: 'Weird results are welcome.',
      text: 'If your code does something you didn\'t plan, say *"Ooh, look at that!"* Then work out why.',
      analogy: { title: 'Every coder\'s secret', text: 'Professional programmers make mistakes all day. The skill is finding and fixing them.' },
    },
    {
      type: 'share', title: 'What would you like to make?',
      prompts: ['A game?', 'An animation?', 'Art that changes every time?', 'Something no one has made before?'],
      feedback: false,
    },
  ],
});
