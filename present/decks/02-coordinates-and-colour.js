// Module 2: Coordinates and colour. Lesson plan: modules/02-coordinates-and-colour.md
CC.deck({
  id: '02', num: 2, title: 'Coordinates and colour', color: 'yellow', icon: 'grid',
  bigIdea: 'The screen is a **grid** of pixels. Position is two numbers. Colour is **three dials**.',
  kidIdea: 'Find any spot on the screen. Mix any colour.',
  sessions: '1 session',
  plan: 'modules/02-coordinates-and-colour.html',
  sketches: ['m02a_coordinate_finder', 'm02b_color_mixer', 'm02c_pixel_scene'],
  slides: [
    { type: 'title' },
    {
      type: 'whiteboard', title: 'Treasure map', grid: true,
      text: 'The treasure is at **(300, 100)**. Where is it? Remember: (0, 0) is the **top-left**, and y goes **down**.',
      notes: 'Warm-up (5 min). Hide treasure at a few positions; learners point. Then ask: where is (0, 400)? (Bottom-left.)',
    },
    {
      type: 'coords', title: 'Explore the canvas grid',
      text: 'Move your mouse: the numbers show where you are. Then play **Find it!** and try other canvas sizes.',
      notes: 'The "Maths class vs screen" tab helps learners who know graphs from school: on screens y goes down. Changing the canvas size shows what `size()`, `width` and `height` mean.',
    },
    {
      type: 'code', title: 'A tool: the coordinate finder',
      sketch: 'm02a_coordinate_finder',
      text: 'Move your mouse over the canvas. The numbers show **where you are**.',
      spotlight: [
        { find: 'text(', note: 'This line writes `mouseX` and `mouseY` on the screen. You\'ll understand every line in a few weeks!' },
      ],
      notes: 'Tool time (10 min): "This is a tool, so just run it." Task: write down 3 positions for a face (eyes, mouth).',
    },
    {
      type: 'colours', title: 'Colour is three dials',
      text: 'Every colour on a screen is a mix of **red**, **green** and **blue** light. Try each tab: RGB, hex codes, grey, see-through and HSB.',
      notes: 'Ask for predictions before each preset. Red + green = yellow is the big surprise (light mixes differently from paint).',
    },
    {
      type: 'predict', title: 'The colour mixer sketch',
      sketch: 'm02b_color_mixer',
      question: 'Left-right changes red, up-down changes green. What colour is the **top-left** corner? The **bottom-right**?',
      answer: 'Top-left: red 0, green 0, blue 150, so **dark blue**. Bottom-right: red 255, green 255, blue 150, so **pale yellow**. Move your mouse to check!',
    },
    {
      type: 'list', kicker: 'Colour tricks', title: 'Four ways to use colour',
      points: [
        '`fill(255, 0, 0)`: all red, no green, no blue = **red**.',
        '`fill(255, 255, 0)`: red + green = **yellow**. Surprise!',
        '`fill(0)` or `fill(255)`: one number means a **grey** (0 black, 255 white).',
        '`fill(255, 0, 0, 100)`: a 4th number makes it **see-through**.',
        '`fill(#FF6496)`: a **hex code** is the same three dials, written in base 16.',
        '`stroke()` colours the **outline**. `noStroke()` removes it.',
        '`// sky`: a comment explains your code to humans.',
      ],
    },
    {
      type: 'tasks', title: 'Change the scene',
      sketch: 'm02c_pixel_scene', timer: 15,
      items: [
        'Change the sky to sunset orange.',
        'Move the sun lower.',
        'Add a third hill in a new colour.',
        'Remove `noStroke()`. What changes?',
      ],
    },
    {
      type: 'code', title: 'How the scene is built',
      sketch: 'm02c_pixel_scene',
      spotlight: [
        { find: 'background', note: 'The sky is the background, so it\'s painted **first**.' },
        { find: 'noStroke', note: 'From here on, shapes have **no outlines**.' },
        { find: 'hill', note: 'Two big ovals, half off the bottom of the canvas, make hills.' },
        { find: ['cloud', 'ellipse(130', 'ellipse(155'], note: 'Three overlapping ovals make one cloud.' },
      ],
    },
    {
      type: 'challenge', title: 'My landscape',
      rules: ['A sky', 'One big thing in the background', 'Two things in front', 'One comment per part: `// sky`, `// sun` ...'],
      examples: 'Use the coordinate finder to place things.',
      stretch: 'Make a night version with stars and a moon with a "bite" (a second circle in the sky colour).',
      minutes: 15,
    },
    {
      type: 'debug', name: 'missing_cloud',
      code: `
size(400, 400);
background(135, 206, 250);
fill(255, 220, 0);
ellipse(300, 60, 80, 80);
fill(60, 160, 80);
rect(0, 300, 400, 100);
ellipse(100, 500, 80, 80);     // where did my cloud go?
`,
      text: 'No red message, but the cloud is missing! Where did it go?',
      bugs: [
        { line: 7, fix: '`y = 500` is **below** the 400-tall canvas. The computer drew it off the screen! Try `y = 100`.' },
      ],
      notes: 'Let learners debug with the coordinate finder. Also: the fill is still green from the grass.',
    },
    {
      type: 'vocab',
      words: [['pixel', 'One tiny dot on the screen'], ['coordinate', 'A position: (x, y)'], ['RGB', 'Red, green, blue: three dials from 0 to 255'],
        ['stroke', 'The outline of a shape'], ['fill', 'The inside colour of a shape'], ['alpha', 'How see-through a colour is'], ['comment', 'A note for humans: `// sky`']],
    },
    {
      type: 'ican',
      items: ['find an (x, y) position on the canvas.', 'use the coordinate finder to place shapes.', 'mix a colour with `fill(r, g, b)`.', 'use `noStroke()`, `stroke()` and transparency.', 'add `//` comments to my code.'],
    },
  ],
});
