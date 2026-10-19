// Module 9: Objects. Lesson plan: modules/09-objects.md
CC.deck({
  id: '09', num: 9, title: 'Objects', color: 'pink', icon: 'cookie',
  bigIdea: 'A class is a **blueprint**. Every object built from it carries its **own data** and its **own behaviour**.',
  kidIdea: 'Cookie cutters, fireworks and purple rain.',
  sessions: '1-2 sessions',
  plan: 'modules/09-objects.html',
  sketches: ['m09a_ball_class', 'm09b_fireworks', 'm09c_purple_rain'],
  slides: [
    { type: 'title' },
    {
      type: 'hook', title: 'Fireworks!',
      sketch: 'm09b_fireworks',
      text: 'Click the canvas to launch a firework.',
      sub: 'Every spark is an **object**. It knows where it is, how fast it goes and when it fades.',
    },
    {
      type: 'big', kicker: 'The problem',
      statement: 'Too many arrays!',
      text: 'Remember the bubbles: four arrays (`x`, `y`, `speed`, `diam`). Now each bubble needs a colour, a wobble and a name too. **Seven arrays?!** There must be a better way: a bubble that **carries its own data**.',
    },
    {
      type: 'big', kicker: 'Cookie cutter',
      statement: 'Class = cookie cutter. Objects = cookies.',
      text: 'The cutter decides the shape. Every cookie made with it can have **different icing**.',
      art: 'cookie',
      notes: 'Use a real cookie cutter if you can.',
    },
    {
      type: 'code', title: 'Inside a class',
      sketch: 'm09a_ball_class',
      spotlight: [
        { find: 'float x, y, xSpeed', note: '**Fields:** the data every ball owns.' },
        { from: 'Ball(float x', note: '**Constructor:** how a new ball gets built.' },
        { from: 'void move()', note: '**Method:** something a ball can do.' },
        { find: 'new Ball(', note: '`new` uses the blueprint to build a real ball.' },
        { find: ['balls[i].move()', 'balls[i].show()'], note: 'Ask each ball to move and show **itself**.' },
      ],
    },
    {
      type: 'table', title: 'The three parts',
      head: ['Part', 'What it is', 'In `Ball`'],
      rows: [
        ['**fields**', 'The data each object owns', '`x, y, xSpeed, ySpeed, r, c`'],
        ['**constructor**', 'How a new object gets built', '`Ball(float x, float y) { ... }`'],
        ['**methods**', 'What an object can do', '`move()`, `show()`'],
      ],
    },
    {
      type: 'tasks', title: 'Change the blueprint',
      sketch: 'm09a_ball_class', timer: 20,
      items: [
        'More balls. Fewer balls.',
        'Each ball already has a random size. Change the range.',
        'Add a field `boolean big`, and draw big balls with an outline.',
        'Add a method `void grow()` that makes a ball larger when you click on it.',
      ],
    },
    {
      type: 'code', title: 'Fireworks: a growing list',
      sketch: 'm09b_fireworks',
      text: 'Click to launch!',
      spotlight: [
        { find: 'ArrayList<Spark>', note: 'An `ArrayList` can **grow and shrink**. Perfect when the number of sparks keeps changing.' },
        { find: 'vy = vy + 0.08', note: 'Gravity pulls every spark down a little each frame. Drag the 0.08!' },
        { find: 'i >= 0; i--', note: 'Loop **backwards** when removing, so you don\'t skip a spark.' },
      ],
    },
    {
      type: 'codingtrain', title: 'Purple Rain',
      num: 4, url: 'https://thecodingtrain.com/challenges/4-purple-rain', clip: 'the final result',
      text: 'The classic first class: 400 `Drop` objects, each with its own position, speed and closeness.',
      steps: ['Find every line that uses `z`. What does it control?', 'Close drops are longer, thicker and faster. That fakes **depth**!', 'Remix: snow, falling stars, autumn leaves.', 'Stretch: drops that splash at the bottom.'],
      sketch: 'm09c_purple_rain',
    },
    {
      type: 'challenge', title: 'Your own class',
      text: 'Pick one:',
      rules: ['**Rain, snow or fireflies:** a particle class', '**Creatures:** a `Fish` class with `swim()` and `show()`', '**Flowers** that grow where you click'],
      stretch: 'Objects that react to each other, like balls that bounce off one another.',
      minutes: 20,
    },
    {
      type: 'debug', name: 'no_cookie',
      code: `
Ball b;                    // declared...
void setup() {
  size(400, 400);
}
void draw() {
  b.move();                // ...but never created with new!
}
`,
      bugs: [
        { line: 6, fix: '"The cookie cutter exists, but you never made a cookie." Add `b = new Ball(100, 100);` in `setup()`.', message: 'NullPointerException' },
      ],
    },
    {
      type: 'vocab',
      words: [['class', 'A blueprint, like a cookie cutter'], ['object', 'One thing built from a class'], ['field', 'Data an object owns'], ['method', 'Something an object can do'],
        ['constructor', 'Builds a new object'], ['new', 'The word that builds an object'], ['ArrayList', 'A list that can grow and shrink']],
    },
    {
      type: 'ican',
      items: ['explain a class and an object.', 'make many objects from one class.', 'add a new field or method.'],
    },
  ],
});
