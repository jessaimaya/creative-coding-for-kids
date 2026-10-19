// Module 5: Conditionals. Lesson plan: modules/05-conditionals.md
CC.deck({
  id: '05', num: 5, title: 'Conditionals', color: 'pink', icon: 'question',
  bigIdea: '`if` asks a **yes/no question**. The answer picks what happens.',
  kidIdea: 'Bounce off walls, react to the mouse, flip switches.',
  sessions: '2 sessions',
  plan: 'modules/05-conditionals.html',
  sketches: ['m05a_bounce', 'm05b_hover_color', 'm05c_light_switch', 'm05d_dvd_logo'],
  slides: [
    { type: 'title' },
    {
      type: 'act', title: 'If it\'s raining...',
      text: 'Shout what I do for each kind of weather!',
      steps: [
        { t: 'If it\'s raining', d: 'I take an **umbrella**.' },
        { t: 'Otherwise (else)', d: 'I wear **sunglasses**.' },
        { t: 'In code', d: '`if (raining) { umbrella(); } else { sunglasses(); }`' },
      ],
      reveal: true,
    },
    {
      type: 'predict', title: 'A ball with no rules',
      name: 'no_rules',
      code: `
float x = 200;
float y = 100;
float xSpeed = 3;
float ySpeed = 2;

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  x = x + xSpeed;
  y = y + ySpeed;
  fill(80, 160, 255);
  ellipse(x, y, 50, 50);
}
`,
      question: 'What happens to the ball?',
      answer: 'It flies off the screen and never comes back. We need a **rule**: *if* it touches a wall, turn around.',
      notes: 'Session A starts here.',
    },
    {
      type: 'code', title: 'Bounce!',
      sketch: 'm05a_bounce',
      spotlight: [
        { find: 'if (x > width - r', note: 'The **question**: is the ball touching the left or right wall? `||` means **or**.' },
        { find: 'xSpeed = -xSpeed', note: 'The **action** if the answer is yes: flip the direction.' },
        { find: 'width - r', note: 'Why `width - r`? The ball\'s **centre** is at x. Without `- r`, half the ball goes through the wall first.' },
      ],
      notes: 'Live demo (10 min). Give "== asks, = tells" a minute.',
    },
    {
      type: 'big', kicker: 'Don\'t mix them up',
      statement: '`==` asks. `=` tells.',
      text: '`x = 200` **tells** x to become 200. `x == 200` **asks** "is x equal to 200?"',
      analogy: { title: 'More questions', text: '`<` less than, `>` greater than, `<=`, `>=`, `!=` not equal. Join two with `&&` (and) or `||` (or).' },
    },
    {
      type: 'tasks', title: 'Make it bounce your way',
      sketch: 'm05a_bounce', timer: 20,
      items: [
        'Change `xSpeed` and `ySpeed`.',
        'Change the radius `r`. Does the bounce still look right? Why?',
        'Make the ball **change colour** when it bounces. (Hint: a colour variable that changes inside the `if`.)',
      ],
    },
    {
      type: 'codingtrain', title: 'The bouncing DVD logo',
      num: 131, url: 'https://thecodingtrain.com/challenges/131-bouncing-dvd-logo', clip: 'describe + whiteboard (0:52 to 3:03)',
      text: 'Who remembers the DVD screensaver? Did it ever hit the corner exactly?',
      steps: ['Whiteboard first: where is the right edge of a `rect`? (`x + w`)', 'Change the speeds, the size and the three colours.', 'Why does `hits` go back to 0?', 'Stretch: show "CORNER!" when both walls are hit at once (`&&`).'],
      sketch: 'm05d_dvd_logo',
    },
    {
      type: 'code', title: 'if / else: hover colours',
      sketch: 'm05b_hover_color',
      text: 'Session B. Move the mouse over the circle.',
      spotlight: [
        { find: 'float d = dist', note: '`dist()` measures how far the mouse is from the centre.' },
        { find: 'if (d < 80)', note: 'The question: is the mouse **inside** the circle?' },
        { find: '} else {', note: '`else` runs when the answer is **no**.' },
      ],
      notes: 'Task: add a third colour with `else if (d < 30)`. Put it FIRST, or it never runs. Good discussion!',
    },
    {
      type: 'code', title: 'A light switch',
      sketch: 'm05c_light_switch',
      text: 'Click the canvas to switch the light on and off.',
      spotlight: [
        { find: 'boolean lightOn', note: 'A `boolean` holds only `true` or `false`. Like a switch.' },
        { find: 'void mousePressed', note: '`mousePressed()` runs **once** each time you click.' },
        { find: '!lightOn', note: '`!` means "the opposite". On becomes off, off becomes on.' },
      ],
    },
    {
      type: 'challenge', title: 'An interactive scene',
      text: 'Make a scene with **three different reactions**.',
      rules: ['One when the mouse **hovers** over something', 'One when you **click**', 'One when the mouse is at the **edge** of the screen'],
      stretch: 'Add a second lamp that works on its own, with its own boolean.',
      minutes: 25,
    },
    {
      type: 'debug', name: 'question_bugs',
      code: `
if (x > 200);                  // look at the end of this line!
{
  fill(255, 0, 0);
}
if (x = 200) {                 // = or == ?
  fill(0, 255, 0);
}
if (mouseX > 100 and mouseY < 100) {   // is "and" a Java word?
  ellipse(50, 50, 20, 20);
}
`,
      bugs: [
        { line: 1, fix: 'A `;` after `if (...)` ends the `if` right there. The `{ }` below then **always** runs. Delete the `;`.' },
        { line: 5, fix: '`=` tells, `==` asks. A question needs `x == 200`.' },
        { line: 8, fix: 'Java doesn\'t know `and`. Use `&&`. (And `||` for "or".)' },
      ],
      notes: 'Nyhoff has a "no semicolon at the end of the first line of an if statement" caution for the first bug. The first bug gives no error at all, which is what makes it sneaky.',
    },
    {
      type: 'vocab',
      words: [['condition', 'A yes/no question, like `x > width`'], ['boolean', 'A box for `true` or `false`'], ['comparison', '`<` `>` `==` `!=` `<=` `>=`'],
        ['&&', 'and: both must be true'], ['||', 'or: at least one is true'], ['event', 'Something that happens, like a click']],
    },
    {
      type: 'ican',
      items: ['write an `if` / `else`.', 'explain `==` and `=`.', 'use a boolean as a switch.', 'join two questions with `&&`.'],
    },
  ],
});
