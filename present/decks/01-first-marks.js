// Module 1: First marks. Lesson plan: modules/01-first-marks.md
CC.deck({
  id: '01', num: 1, title: 'First marks', color: 'pink', icon: 'shapes',
  bigIdea: 'A program is a list of instructions. The computer does them **one at a time, top to bottom**.',
  kidIdea: 'Draw with shapes. Order matters!',
  sessions: '1 session',
  plan: 'modules/01-first-marks.html',
  sketches: ['m01a_hello_shapes', 'm01b_robot_face', 'm01c_layers_order'],
  slides: [
    { type: 'title' },
    {
      type: 'hook', title: 'By the end, you\'ll build your own',
      sketch: 'm01b_robot_face',
      text: 'This robot is just **12 lines** of shapes.',
      sub: 'In 50 minutes you\'ll make your own robot, monster, cat or spaceship.',
      notes: 'Hook (5 min).',
    },
    {
      type: 'act', title: 'Be the human computer',
      text: 'One person is "the computer". They follow instructions **exactly**, and nothing more.',
      steps: [
        { t: '"Draw a circle."', d: 'Where? How big? The computer can\'t guess!' },
        { t: '"Draw it in the middle, this big."', d: 'Better. But how big is "this big"?' },
        { t: 'Exact numbers', d: 'Computers need **exact numbers** and an **exact order**.' },
      ],
      reveal: true,
      notes: 'Acting it out (5 min). The class gives drawing instructions; the "computer" follows them literally.',
    },
    {
      type: 'predict', title: 'What will it draw?',
      name: 'predict',
      code: `
size(400, 400);
background(255, 240, 200);
fill(255, 100, 100);
ellipse(200, 200, 120, 120);
`,
      question: 'Where will the shape be? What colour?',
      answer: 'A pink-red circle, right in the middle of a cream canvas. `200, 200` is the centre of a 400 × 400 canvas.',
    },
    {
      type: 'anatomy', title: 'How to read a line of code',
      text: 'Every instruction has the same parts. Press → to label them, then **Run it** to feed the function machine!',
      notes: 'Try the other examples too: `fill()` changes nothing you can see until a shape is drawn. `drawHouse()` is a preview of Module 7: a command we make ourselves.',
    },
    {
      type: 'code', title: 'Hello, shapes!',
      sketch: 'm01a_hello_shapes',
      spotlight: [
        { find: 'size(', note: '`size(400, 400)` makes a canvas 400 pixels wide and 400 tall.' },
        { find: 'background', note: 'Three numbers = red, green, blue. Each goes from **0 to 255**.' },
        { find: 'ellipse', note: '`ellipse(x, y, width, height)`. An ellipse is placed by its **centre**.' },
        { find: 'rect(', note: '`rect(x, y, width, height)`. A rectangle is placed by its **top-left corner**.' },
        { find: 'line(', note: '`line(x1, y1, x2, y2)`: from one point to another.' },
        { find: 'fill(', note: '`fill()` picks the paint for the **next** shapes, not the ones before.' },
      ],
      notes: 'Live demo (10 min). Drag numbers live. Then switch to Edit, delete a `;` and show that real Processing gives a red message (the browser preview is more forgiving).',
    },
    {
      type: 'shapes', title: 'Shape builder',
      text: 'Drag the dots and watch the numbers change. Which shape is placed by its **corner**, and which by its **centre**?',
      notes: 'Let learners come up and drag. Ask them to make the rectangle exactly `rect(100, 100, 200, 200)`.',
    },
    {
      type: 'whiteboard', title: 'Where is (0, 0)?', grid: true,
      text: 'Computers count from the **top-left** corner, and y goes **down**. Draw where you think `(100, 300)` is!',
      notes: 'Ask learners to point to (100, 300), (400, 0), (200, 200). Draw dots.',
    },
    {
      type: 'tasks', title: 'Change one thing at a time',
      sketch: 'm01a_hello_shapes', timer: 20,
      items: [
        'Change the background colour.',
        'Move the circle to the bottom-right corner.',
        'Make the circle into an oval. Then into a tiny dot.',
        'Move `fill()` before the rectangle, then **after** it. What changes?',
        'Add a second triangle.',
      ],
    },
    {
      type: 'predict', title: 'Order matters!',
      sketch: 'm01c_layers_order',
      question: 'Three squares. Which one ends up in front?',
      answer: 'Blue is in front, because it\'s drawn **last**. The computer paints like you do: later paint covers earlier paint. Now swap the blue and red code and run it again!',
      notes: 'After the reveal, open Edit and swap the red and blue blocks.',
    },
    {
      type: 'challenge', title: 'Build your robot',
      text: 'Make your own robot, monster, cat or spaceship.',
      rules: ['At least **6 shapes**', 'At least **3 colours**', 'Use `ellipse`, `rect`, `line` or `triangle`'],
      stretch: 'Add ears, antennas, buttons, or a whole body.',
      sketch: 'm01b_robot_face', minutes: 15,
    },
    {
      type: 'debug',
      name: 'robot_bugs',
      code: `
size(400, 400)             // what's missing at the end of this line?
background(255);
ellipse(200, 200, 100);    // how many numbers does ellipse need?
fill(255, 0, 0)
rect(50, 50, 100, 60);
`,
      text: 'Three bugs are hiding here. Find them **before** pressing →!',
      bugs: [
        { line: 1, fix: 'Missing `;` at the end of the line.', message: 'Syntax Error', messageLabel: 'You\'ll see a red' },
        { line: 3, fix: '`ellipse` needs **4** numbers: x, y, width, height.', message: 'The method ellipse(float, float, float, float) in the type PApplet is not applicable for the arguments (int, int, int)' },
        { line: 4, fix: 'Another missing `;`.', message: 'Syntax Error', messageLabel: 'You\'ll see a red' },
      ],
      notes: 'The ellipse message is exactly what Processing 4 prints. For missing semicolons Processing shows a red "Syntax Error" message; the exact wording varies.',
    },
    {
      type: 'vocab',
      words: [
        ['statement', 'One instruction. It ends with `;`'],
        ['function', 'A command with a name and brackets, like `rect()`'],
        ['argument', 'A number you give a function'],
        ['canvas', 'The drawing window'],
        ['comment', '`//` a note for humans. The computer ignores it.'],
      ],
    },
    {
      type: 'share',
      prompts: ['Which line made the **biggest** change?', 'Which line would you delete to make your robot lose an eye?'],
    },
    {
      type: 'ican',
      items: ['run and stop a sketch.', 'draw with `ellipse`, `rect`, `line` and `triangle`.', 'read the numbers: x, y, width, height.', 'explain why order matters.', 'change colours with `fill()` and `background()`.'],
    },
  ],
});
