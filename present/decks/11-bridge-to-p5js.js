// Module 11: Bridge to p5.js. Lesson plan: modules/11-bridge-to-p5js.md
CC.deck({
  id: '11', num: 11, title: 'Bridge to p5.js', color: 'green', icon: 'browser',
  bigIdea: 'Everything you learned works **in the browser** with almost the same names. Share your sketch with anyone!',
  kidIdea: 'Same ideas, new language. Put your sketch on the web.',
  sessions: '1 session',
  plan: 'modules/11-bridge-to-p5js.html',
  slides: [
    { type: 'title' },
    {
      type: 'big', kicker: 'Same ideas, new language',
      statement: 'p5.js is Processing\'s cousin for the web.',
      text: 'It uses JavaScript instead of Java. Your sketches can live on a web page, so you can show them on a **phone** to anyone.',
      analogy: { title: 'Your second language is easier', text: 'You already know variables, ifs, loops and functions. Only some words change.' },
    },
    {
      type: 'compare', title: 'Spot the differences',
      left: { sketch: 'm05a_bounce', name: 'm05a_bounce', label: 'Processing (Java)' },
      right: { sketch: 'm05a_bounce', name: 'sketch', label: 'p5.js (JavaScript)' },
      spotlight: [
        { left: { find: ['float x', 'float y', 'float xSpeed', 'float ySpeed', 'float r'] }, right: { find: ['let '] }, note: 'Java says the type (`float`). JavaScript just says `let`.' },
        { left: { find: 'void setup' }, right: { find: 'function setup' }, note: '`void setup()` becomes `function setup()`.' },
        { left: { find: 'size(' }, right: { find: 'createCanvas' }, note: '`size()` becomes `createCanvas()`.' },
        { left: { find: 'if (x > width' }, right: { find: 'if (x > width' }, note: 'The `if`s, `fill`, `ellipse`... are **exactly the same**!' },
      ],
      notes: 'Learners circle every difference using the translation table.',
    },
    {
      type: 'table', title: 'The translation table',
      head: ['Processing (Java)', 'p5.js (JavaScript)'],
      rows: [
        ['`int x = 0;` / `float y = 1.5;`', '`let x = 0;` / `let y = 1.5;`'],
        ['`void setup() { size(400, 400); }`', '`function setup() { createCanvas(400, 400); }`'],
        ['`void draw() { ... }`', '`function draw() { ... }`'],
        ['`float[] a = new float[10];`', '`let a = [];`'],
        ['`println(x);`', '`console.log(x);`'],
        ['`int(random(6))`', '`floor(random(6))`'],
        ['`if (keyPressed && keyCode == LEFT)`', '`if (keyIsDown(LEFT_ARROW))` (p5.js 2.x)'],
        ['`if (mouseButton == RIGHT)`', '`if (mouseButton.right)` (p5.js 2.x)'],
      ],
      text: '`ellipse`, `rect`, `fill`, `background`, `random`, `mouseX`, `dist`, `map`... are spelled the same.',
    },
    {
      type: 'tasks', title: 'Convert one!', timer: 20,
      rule: 'Watch for: `size()` → `createCanvas()`, `int x` → `let x`, no `color` or `float` types, and static sketches need wrapping in `setup()`.',
      items: [
        'Pick a sketch from earlier: `m04c`, `m06b` or `m08c`.',
        'Open the p5.js web editor (editor.p5js.org).',
        'Convert it line by line, using the table.',
        'Run it. Read the console if something goes wrong.',
      ],
    },
    {
      type: 'codingtrain', title: 'Every challenge has a p5.js version',
      num: '131 and more', url: 'https://thecodingtrain.com/challenges', clip: 'any challenge page',
      text: 'Each Coding Train challenge page links a p5.js web editor sketch. Open one next to our Processing starter and spot the differences.',
      steps: ['Try the DVD logo, 10 PRINT, Purple Rain or Pong.', 'Most videos use p5.js 1.x. If a sketch uses `preload()`, switch the editor to version 1.x.', 'Keep going at home: the **Code! Programming with p5.js** track.'],
    },
    {
      type: 'debug', name: 'p5_bug', lang: 'js',
      code: `
function setup() {
  size(400, 400);          // not a p5.js function!
}
function draw() {
  ellipse(mouseX, mouseY, 50, 50)
}
`,
      text: 'Open the browser console (**F12**) and read the red error.',
      bugs: [
        { line: 2, fix: 'p5.js uses `createCanvas(400, 400)`, not `size()`.' },
        { line: 5, fix: 'No `;` at the end. JavaScript forgives this one, but it\'s a good habit to add it.' },
      ],
    },
    {
      type: 'list', kicker: 'Why bother?', title: 'Why learn p5.js',
      points: ['Show friends and family your work on a **phone**.', 'Share a link to your sketch.', 'A first step into making websites.', 'Your second language is **much** easier than your first.'],
    },
    {
      type: 'challenge', title: 'Publish one sketch',
      text: 'Pick your favourite sketch from the course and put it on the web.',
      rules: ['Convert it to p5.js', 'Run it in the p5.js web editor', 'Share the link with someone at home'],
      stretch: 'Make it work well on a phone: use `touchStarted()` as well as `mousePressed()`.',
      minutes: 20,
      notes: 'Check the p5.js editor\'s privacy policy for under-13 accounts before learners sign up. Without an account you can run sketches but not save them.',
    },
    {
      type: 'ican',
      items: ['find the same ideas in two languages.', 'convert a simple sketch.', 'share my work online.'],
    },
  ],
});
