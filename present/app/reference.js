// The code dictionary: every function, keyword, built-in variable and symbol the course uses,
// explained in kid language. Clicking a token in any code panel opens a card from here.
(function () {
  const { h, md } = CC;

  // sigs: argument names by how many arguments the call has. args: what each name means.
  const REF = {
    // ---------- canvas ----------
    size: { cat: 'Canvas', sigs: { 2: ['width', 'height'] }, say: 'Makes the drawing window, called the **canvas**.',
      args: { width: 'how wide the canvas is, in pixels', height: 'how tall the canvas is, in pixels' },
      tip: 'Put it first in `setup()`. After that, `width` and `height` remember these two numbers.',
      example: 'size(300, 200);\nbackground(255, 220, 100);\nellipse(150, 100, 80, 80);', see: ['width', 'height', 'background'] },
    background: { cat: 'Colour', sigs: { 1: ['grey'], 2: ['grey', 'alpha'], 3: ['red', 'green', 'blue'], 4: ['red', 'green', 'blue', 'alpha'] },
      say: 'Paints the **whole canvas** one colour.',
      tip: 'Inside `draw()` it wipes the last frame. Leave it out and moving shapes leave a smear!',
      example: 'size(300, 200);\nbackground(135, 206, 250);   // sky blue', see: ['fill', 'stroke'] },
    fill: { cat: 'Colour', sigs: { 1: ['grey'], 2: ['grey', 'alpha'], 3: ['red', 'green', 'blue'], 4: ['red', 'green', 'blue', 'alpha'] },
      say: 'Chooses the paint for the **inside** of the next shapes.',
      tip: 'It only changes shapes drawn **after** it. Shapes above it keep their old colour.',
      example: 'size(300, 200);\nfill(255, 100, 150);\nellipse(100, 100, 120, 120);\nfill(80, 160, 255);\nrect(170, 50, 100, 100);', see: ['stroke', 'noFill', 'background'] },
    stroke: { cat: 'Colour', sigs: { 1: ['grey'], 2: ['grey', 'alpha'], 3: ['red', 'green', 'blue'], 4: ['red', 'green', 'blue', 'alpha'] },
      say: 'Chooses the colour of **outlines** and **lines**.',
      example: 'size(300, 200);\nstrokeWeight(8);\nstroke(255, 0, 100);\nline(30, 30, 270, 170);', see: ['strokeWeight', 'noStroke', 'fill'] },
    noStroke: { cat: 'Colour', sigs: { 0: [] }, say: 'Turns **off** outlines for the next shapes.', example: 'size(300, 200);\nnoStroke();\nfill(255, 200, 0);\nellipse(150, 100, 120, 120);', see: ['stroke'] },
    noFill: { cat: 'Colour', sigs: { 0: [] }, say: 'Shapes after this are **see-through** inside: only the outline is drawn.', example: 'size(300, 200);\nnoFill();\nstrokeWeight(4);\nellipse(150, 100, 120, 120);', see: ['fill'] },
    strokeWeight: { cat: 'Colour', sigs: { 1: ['weight'] }, say: 'How **thick** lines and outlines are.', args: { weight: 'the thickness, in pixels' },
      example: 'size(300, 200);\nstrokeWeight(1);\nline(30, 50, 270, 50);\nstrokeWeight(10);\nline(30, 130, 270, 130);', see: ['stroke'] },
    colorMode: { cat: 'Colour', sigs: { 1: ['mode'], 4: ['mode', 'max1', 'max2', 'max3'] }, say: 'Changes how colour numbers are read: `RGB` (red, green, blue) or `HSB` (hue, saturation, brightness).',
      args: { mode: '`RGB` or `HSB`', max1: 'the biggest number for hue (360 = degrees round the colour wheel)', max2: 'the biggest number for saturation', max3: 'the biggest number for brightness' },
      tip: 'With `colorMode(HSB, 360, 100, 100)`, one number (the hue) walks through the whole rainbow.',
      example: 'size(360, 100);\ncolorMode(HSB, 360, 100, 100);\nnoStroke();\nfor (int h = 0; h < 360; h++) {\n  fill(h, 90, 100);\n  rect(h, 0, 1, 100);\n}', see: ['fill', 'HSB'] },
    color: { cat: 'Colour', sigs: { 1: ['grey'], 3: ['red', 'green', 'blue'], 4: ['red', 'green', 'blue', 'alpha'] },
      say: 'Mixes a colour so you can keep it in a box: `color c = color(255, 0, 0);`',
      typeSay: 'A **type** of box that holds a colour.', see: ['fill'] },

    // ---------- shapes ----------
    ellipse: { cat: 'Shapes', sigs: { 4: ['x', 'y', 'width', 'height'] }, say: 'Draws an oval. Same width and height make a **circle**.',
      args: { x: 'how far the **centre** is from the left edge', y: 'how far the **centre** is from the top edge', width: 'how wide it is', height: 'how tall it is' },
      tip: 'An ellipse is placed by its **centre**. (A `rect` is placed by its top-left corner.)',
      example: 'size(300, 200);\nellipse(150, 100, 160, 90);', see: ['circle', 'rect', 'arc'] },
    circle: { cat: 'Shapes', sigs: { 3: ['x', 'y', 'diameter'] }, say: 'Draws a circle. An easier `ellipse` when width and height are the same.',
      args: { x: 'how far the centre is from the left', y: 'how far the centre is from the top', diameter: 'how wide the circle is' }, example: 'size(300, 200);\ncircle(150, 100, 120);', see: ['ellipse'] },
    rect: { cat: 'Shapes', sigs: { 4: ['x', 'y', 'width', 'height'], 5: ['x', 'y', 'width', 'height', 'roundness'] }, say: 'Draws a rectangle.',
      args: { x: 'how far the **top-left corner** is from the left edge', y: 'how far the **top-left corner** is from the top edge', width: 'how wide it is', height: 'how tall it is', roundness: 'how rounded the corners are' },
      tip: 'A rectangle is placed by its **top-left corner**, not its centre.',
      example: 'size(300, 200);\nrect(50, 40, 200, 120);', see: ['square', 'ellipse'] },
    square: { cat: 'Shapes', sigs: { 3: ['x', 'y', 'size'] }, say: 'Draws a square.', args: { x: 'top-left corner, from the left', y: 'top-left corner, from the top', size: 'how long each side is' }, example: 'size(300, 200);\nsquare(100, 50, 100);', see: ['rect'] },
    line: { cat: 'Shapes', sigs: { 4: ['x1', 'y1', 'x2', 'y2'] }, say: 'Draws a straight line from one point to another.',
      args: { x1: 'where it starts, from the left', y1: 'where it starts, from the top', x2: 'where it ends, from the left', y2: 'where it ends, from the top' },
      example: 'size(300, 200);\nstrokeWeight(4);\nline(20, 180, 280, 20);', see: ['stroke', 'strokeWeight'] },
    triangle: { cat: 'Shapes', sigs: { 6: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'] }, say: 'Draws a triangle from its **three corners**.',
      args: { x1: 'corner 1, from the left', y1: 'corner 1, from the top', x2: 'corner 2, from the left', y2: 'corner 2, from the top', x3: 'corner 3, from the left', y3: 'corner 3, from the top' },
      example: 'size(300, 200);\ntriangle(150, 20, 40, 180, 260, 180);', see: ['line'] },
    point: { cat: 'Shapes', sigs: { 2: ['x', 'y'] }, say: 'Draws a single dot.', args: { x: 'from the left', y: 'from the top' }, tip: 'Make it bigger with `strokeWeight()`.', example: 'size(300, 200);\nstrokeWeight(12);\npoint(150, 100);', see: ['strokeWeight'] },
    arc: { cat: 'Shapes', sigs: { 6: ['x', 'y', 'width', 'height', 'start', 'stop'] }, say: 'Draws part of an ellipse, like a slice of pizza or a smile.',
      args: { x: 'the centre, from the left', y: 'the centre, from the top', width: 'how wide the whole ellipse would be', height: 'how tall the whole ellipse would be', start: 'the angle where it starts (`0` is to the right)', stop: 'the angle where it stops (`PI` is half way round)' },
      tip: 'Angles go **clockwise** and are measured in radians: `PI` is half a turn, `TWO_PI` a full turn.',
      example: 'size(300, 200);\nnoFill();\nstrokeWeight(6);\narc(150, 80, 160, 120, 0, PI);', see: ['PI', 'radians'] },

    // ---------- text ----------
    text: { cat: 'Text', sigs: { 3: ['words', 'x', 'y'] }, say: 'Writes words on the canvas.',
      args: { words: 'what to write (text goes in "quotes"; `+` joins text and numbers)', x: 'where the text starts, from the left', y: 'where the **bottom** of the letters sits, from the top' },
      example: 'size(300, 200);\nbackground(255);\nfill(0);\ntextSize(32);\ntext("Hello!", 90, 110);', see: ['textSize', 'textAlign'] },
    textSize: { cat: 'Text', sigs: { 1: ['size'] }, say: 'How **big** the text is.', args: { size: 'the height of the letters, in pixels' }, see: ['text'] },
    textAlign: { cat: 'Text', sigs: { 1: ['horizontal'], 2: ['horizontal', 'vertical'] }, say: 'Lines text up from a point: `LEFT`, `CENTER` or `RIGHT`.',
      args: { horizontal: '`LEFT`, `CENTER` or `RIGHT`', vertical: '`TOP`, `CENTER` or `BOTTOM`' }, see: ['text', 'CENTER'] },

    // ---------- program shape & events ----------
    setup: { cat: 'Program shape', sigs: { 0: [] }, say: 'Runs **once**, right at the start. Put `size()` and other start-up steps here.', see: ['draw'] },
    draw: { cat: 'Program shape', sigs: { 0: [] }, say: 'Runs **again and again**, about 60 times a second, like the pages of a flip-book.', tip: 'Change a variable a little each time and things move!', see: ['setup', 'frameCount'] },
    mousePressed: { cat: 'Mouse & keys', sigs: { 0: [] }, say: 'Write `void mousePressed() { }` and the code inside runs **once every time** you click.',
      varSay: 'Is the mouse button held down right now? `true` or `false`.', see: ['mouseX', 'keyPressed'] },
    keyPressed: { cat: 'Mouse & keys', sigs: { 0: [] }, say: 'Write `void keyPressed() { }` and the code inside runs **once every time** a key is pressed.',
      varSay: 'Is any key held down right now? `true` or `false`.', see: ['key', 'keyCode', 'keyReleased'] },
    keyReleased: { cat: 'Mouse & keys', sigs: { 0: [] }, say: 'Runs once every time a key is **let go**.', see: ['keyPressed'] },

    // ---------- built-in variables ----------
    width: { cat: 'Canvas', say: 'How wide the canvas is. Processing fills this box for you from `size()`.', tip: '`width / 2` is the middle, left to right.', see: ['height', 'size'] },
    height: { cat: 'Canvas', say: 'How tall the canvas is. Processing fills this box for you from `size()`.', tip: '`height / 2` is the middle, top to bottom.', see: ['width', 'size'] },
    mouseX: { cat: 'Mouse & keys', say: 'Where the mouse is **left to right**. Processing updates it for you every frame.', example: 'void setup() {\n  size(300, 200);\n}\nvoid draw() {\n  background(255);\n  ellipse(mouseX, mouseY, 40, 40);\n}', see: ['mouseY', 'pmouseX'] },
    mouseY: { cat: 'Mouse & keys', say: 'Where the mouse is **top to bottom**. 0 is the top edge.', see: ['mouseX'] },
    pmouseX: { cat: 'Mouse & keys', say: 'Where the mouse was left to right **one frame ago**.', see: ['mouseX'] },
    pmouseY: { cat: 'Mouse & keys', say: 'Where the mouse was top to bottom **one frame ago**.', see: ['mouseY'] },
    frameCount: { cat: 'Program shape', say: 'How many frames have been drawn so far. It goes up by 1 every time `draw()` runs.', see: ['draw'] },
    key: { cat: 'Mouse & keys', say: 'The **letter** of the last key pressed, like `\'s\'`.', tip: 'Letters go in single quotes: `key == \'s\'`.', see: ['keyCode', 'keyPressed'] },
    keyCode: { cat: 'Mouse & keys', say: 'The code of special keys, like the arrows: `UP`, `DOWN`, `LEFT`, `RIGHT`.', see: ['key', 'UP'] },

    // ---------- maths & random ----------
    random: { cat: 'Random', sigs: { 1: ['high'], 2: ['low', 'high'] }, say: 'Picks a **surprise number**. You choose the range, the computer picks.',
      args: { high: 'it picks from 0 up to (not including) this number', low: 'the smallest number it can pick' },
      tip: 'It gives decimals, like 3.71. Use `int(random(6))` for whole numbers.',
      example: 'size(300, 200);\nbackground(255);\nfill(random(255), random(255), random(255));\nellipse(random(300), random(200), 60, 60);', see: ['int', 'noLoop'] },
    int: { cat: 'Numbers & maths', sigs: { 1: ['value'] }, say: 'Turns a number into a **whole number** by chopping off the decimals: `int(3.9)` is 3.',
      args: { value: 'the number to chop' }, typeSay: 'A **type** of box for **whole numbers**: 3, 200, -5. No decimals!', see: ['float'] },
    map: { cat: 'Numbers & maths', sigs: { 5: ['value', 'start1', 'stop1', 'start2', 'stop2'] }, say: 'Changes a number from one range to another, like turning 0-400 into 0-255.',
      args: { value: 'the number to change', start1: 'the old range starts here', stop1: 'the old range ends here', start2: 'the new range starts here', stop2: 'the new range ends here' },
      tip: '`map(mouseX, 0, width, 0, 255)` turns the mouse position into a colour number.', see: ['constrain'] },
    dist: { cat: 'Numbers & maths', sigs: { 4: ['x1', 'y1', 'x2', 'y2'] }, say: 'Measures how **far apart** two points are.',
      args: { x1: 'point 1, from the left', y1: 'point 1, from the top', x2: 'point 2, from the left', y2: 'point 2, from the top' },
      tip: 'Great for collisions: if the distance is small, they touch!', see: ['abs'] },
    constrain: { cat: 'Numbers & maths', sigs: { 3: ['value', 'low', 'high'] }, say: 'Keeps a number **between** two limits.', args: { value: 'the number to keep in', low: 'it can\'t go lower than this', high: 'it can\'t go higher than this' }, see: ['map'] },
    abs: { cat: 'Numbers & maths', sigs: { 1: ['number'] }, say: 'Makes a number **positive**: `abs(-5)` is 5. Handy for "how far apart?"', args: { number: 'any number' }, see: ['dist'] },
    sin: { cat: 'Numbers & maths', sigs: { 1: ['angle'] }, say: 'Gives a number that swings smoothly between -1 and 1 as the angle grows. Perfect for **waves** and circles.', args: { angle: 'an angle in radians' }, see: ['cos', 'radians'] },
    cos: { cat: 'Numbers & maths', sigs: { 1: ['angle'] }, say: 'Like `sin`, a smooth swing between -1 and 1. Together, `cos` and `sin` point round a **circle**.', args: { angle: 'an angle in radians' }, see: ['sin'] },
    radians: { cat: 'Numbers & maths', sigs: { 1: ['degrees'] }, say: 'Turns **degrees** (360 in a full turn) into **radians** (what Processing uses for angles).', args: { degrees: 'an angle in degrees' }, see: ['PI'] },
    sqrt: { cat: 'Numbers & maths', sigs: { 1: ['number'] }, say: 'The **square root**: `sqrt(25)` is 5, because 5 × 5 = 25.', args: { number: 'any positive number' } },
    floor: { cat: 'p5.js', sigs: { 1: ['number'] }, say: 'Rounds a number **down** to a whole number. p5.js uses it instead of `int()`.', args: { number: 'the number to round down' }, see: ['int'] },

    // ---------- control of the loop ----------
    println: { cat: 'Program shape', sigs: { 1: ['what'] }, say: 'Prints something in the **console** (the black box under the code). Great for checking what\'s inside a variable.', args: { what: 'what to print' }, see: ['print'] },
    print: { cat: 'Program shape', sigs: { 1: ['what'] }, say: 'Like `println`, but without starting a new line.', args: { what: 'what to print' } },
    noLoop: { cat: 'Program shape', sigs: { 0: [] }, say: 'Stops `draw()` from repeating. It draws **once**, then waits.', see: ['redraw', 'loop'] },
    loop: { cat: 'Program shape', sigs: { 0: [] }, say: 'Starts `draw()` repeating again after `noLoop()`.', see: ['noLoop'] },
    redraw: { cat: 'Program shape', sigs: { 0: [] }, say: 'Runs `draw()` **one more time**. Used with `noLoop()` for "click for a new picture".', see: ['noLoop'] },
    saveFrame: { cat: 'Program shape', sigs: { 1: ['filename'] }, say: 'Saves the canvas as a picture file in your sketch folder. (In real Processing, not the browser preview.)', args: { filename: 'the file name; `###` becomes a number' } },
    frameRate: { cat: 'Program shape', sigs: { 1: ['fps'] }, say: 'How many times a second `draw()` runs.', args: { fps: 'frames per second (60 is normal)' } },

    // ---------- moving & turning ----------
    translate: { cat: 'Moving & turning', sigs: { 2: ['x', 'y'] }, say: 'Moves the whole **grid**, so (0, 0) is somewhere new.', args: { x: 'how far to move right', y: 'how far to move down' }, see: ['rotate', 'pushMatrix'] },
    rotate: { cat: 'Moving & turning', sigs: { 1: ['angle'] }, say: 'Turns the whole grid around (0, 0).', args: { angle: 'how far to turn, in radians' }, see: ['translate', 'radians'] },
    pushMatrix: { cat: 'Moving & turning', sigs: { 0: [] }, say: '**Remembers** where the grid is now, before you move or turn it.', see: ['popMatrix'] },
    popMatrix: { cat: 'Moving & turning', sigs: { 0: [] }, say: 'Puts the grid **back** where `pushMatrix()` remembered it.', see: ['pushMatrix'] },

    // ---------- lists (ArrayList methods) ----------
    '.add': { cat: 'Objects & lists', sigs: { 1: ['thing'] }, say: 'Puts a new thing at the **end** of a list.', args: { thing: 'what to add' } },
    '.get': { cat: 'Objects & lists', sigs: { 1: ['index'] }, say: 'Takes out the thing at a numbered spot in a list (counting from 0).', args: { index: 'which spot' } },
    '.remove': { cat: 'Objects & lists', sigs: { 1: ['index'] }, say: 'Takes a thing **out** of a list.', args: { index: 'which spot' } },
    '.size': { cat: 'Objects & lists', sigs: { 0: [] }, say: 'How many things are in the list right now.' },

    // ---------- keywords & types ----------
    if: { cat: 'Decisions & loops', say: 'Asks a **yes/no question** in the brackets. If the answer is yes, the code in `{ }` runs.', example: 'void setup() {\n  size(300, 200);\n}\nvoid draw() {\n  background(255);\n  if (mouseX > 150) {\n    fill(255, 0, 0);\n  } else {\n    fill(0, 0, 255);\n  }\n  ellipse(150, 100, 100, 100);\n}', see: ['else', '=='] },
    else: { cat: 'Decisions & loops', say: 'What to do when the `if` question\'s answer is **no**.', see: ['if'] },
    for: { cat: 'Decisions & loops', say: 'A **loop**: repeats the code in `{ }`. The brackets hold three parts: start; keep going while; after each round.',
      example: 'size(400, 100);\nfor (int i = 0; i < 10; i++) {\n  ellipse(20 + i * 40, 50, 30, 30);\n}', see: ['while', '++'] },
    while: { cat: 'Decisions & loops', say: 'Repeats the code in `{ }` **while** the question stays true.', see: ['for'] },
    return: { cat: 'Program shape', say: 'Sends an **answer** back from a function, and leaves it.', see: ['void'] },
    new: { cat: 'Objects & lists', say: 'Builds something new from a blueprint (a class) or makes a new array or list.', see: ['class'] },
    class: { cat: 'Objects & lists', say: 'A **blueprint**, like a cookie cutter. Every object made from it has its own data and can do the same things.', see: ['new', 'this'] },
    this: { cat: 'Objects & lists', say: 'Means "**my own**". Inside a class, `this.x` is the object\'s own `x`.', see: ['class'] },
    void: { cat: 'Program shape', say: 'Starts a function that **doesn\'t give an answer back**. It just does its steps.', see: ['return'] },
    float: { cat: 'Variables & types', say: 'A **type** of box for **decimal numbers**: 0.5, 3.14, 200.0.', tip: 'Use `float` for things that move smoothly.', see: ['int'] },
    boolean: { cat: 'Variables & types', say: 'A **type** of box that only holds `true` or `false`, like a light switch.', see: ['true', 'false'] },
    String: { cat: 'Variables & types', say: 'A **type** of box for **text**, written in "double quotes".' },
    char: { cat: 'Variables & types', say: 'A **type** of box for **one letter**, in \'single quotes\'.' },
    true: { cat: 'Variables & types', say: 'Yes! On! One of the two values a `boolean` can hold.', see: ['boolean', 'false'] },
    false: { cat: 'Variables & types', say: 'No! Off! One of the two values a `boolean` can hold.', see: ['boolean', 'true'] },
    null: { cat: 'Objects & lists', say: '**Nothing**: the box is empty. Using an empty box gives a NullPointerException.' },
    ArrayList: { cat: 'Objects & lists', say: 'A **list** that can grow and shrink. Great when the number of things changes, like sparks in a firework.', see: ['.add', '.remove', '.size'] },
    PImage: { cat: 'Variables & types', say: 'A type of box that holds a **picture**.' },

    // ---------- constants ----------
    PI: { cat: 'Numbers & maths', say: 'About 3.14. In Processing angles, `PI` is **half a turn**.', see: ['TWO_PI', 'arc'] },
    TWO_PI: { cat: 'Numbers & maths', say: 'About 6.28: a **full turn**.', see: ['PI'] },
    HALF_PI: { cat: 'Numbers & maths', say: 'A **quarter turn**.', see: ['PI'] },
    CENTER: { cat: 'Text', say: 'Means "the middle". Used with `textAlign()`.' },
    LEFT: { cat: 'Mouse & keys', say: 'Left: the left arrow key (with `keyCode`), or left-aligned text.' },
    RIGHT: { cat: 'Mouse & keys', say: 'Right: the right arrow key (with `keyCode`), or right-aligned text.' },
    UP: { cat: 'Mouse & keys', say: 'The **up arrow** key. Check it with `keyCode == UP`.', see: ['keyCode'] },
    DOWN: { cat: 'Mouse & keys', say: 'The **down arrow** key. Check it with `keyCode == DOWN`.', see: ['keyCode'] },
    HSB: { cat: 'Colour', say: 'Hue, Saturation, Brightness: a way of picking colours with a **colour wheel**.', see: ['colorMode'] },
    RGB: { cat: 'Colour', say: 'Red, Green, Blue: the normal way of mixing screen colours.', see: ['colorMode'] },

    // ---------- p5.js ----------
    let: { cat: 'p5.js', say: 'Makes a new variable in JavaScript. Processing would say the type (`int`, `float`) instead.' },
    const: { cat: 'p5.js', say: 'Makes a variable that **never changes**.' },
    function: { cat: 'p5.js', say: 'Starts a function in JavaScript. Processing says `void` instead.' },
    createCanvas: { cat: 'p5.js', sigs: { 2: ['width', 'height'] }, say: 'p5.js\'s version of `size()`: makes the canvas.', args: { width: 'how wide, in pixels', height: 'how tall, in pixels' }, see: ['size'] },
    'console.log': { cat: 'p5.js', sigs: { 1: ['what'] }, say: 'p5.js\'s version of `println()`. The message shows in the browser console (press F12).', args: { what: 'what to print' } },
    keyIsDown: { cat: 'p5.js', sigs: { 1: ['keyCode'] }, say: 'Is this key held down right now? `keyIsDown(LEFT_ARROW)`.', args: { keyCode: 'which key, like `LEFT_ARROW`' } },
  };

  // Symbols kids meet in the code.
  const SYMBOLS = {
    '=': ['Becomes', '**Puts** a value into a box: `x = 5` means "x becomes 5". It doesn\'t ask anything!'],
    '==': ['Is equal to?', '**Asks** a question: is the left side the same as the right side? (`=` tells, `==` asks.)'],
    '!=': ['Is not equal to?', 'Asks: are the two sides **different**?'],
    '<': ['Less than?', 'Asks: is the left number **smaller**?'],
    '>': ['More than?', 'Asks: is the left number **bigger**?'],
    '<=': ['Less than or equal?', 'Asks: is the left number smaller **or the same**?'],
    '>=': ['More than or equal?', 'Asks: is the left number bigger **or the same**?'],
    '&&': ['And', 'Both questions must be true. `x > 0 && x < 100` means "between 0 and 100".'],
    '||': ['Or', 'At least one question must be true.'],
    '!': ['Not', 'Flips true and false. `!lightOn` means "the opposite of lightOn".'],
    '+': ['Plus', 'Adds numbers. With text, it **joins**: `"score: " + score`.'],
    '-': ['Minus', 'Takes away. In front of a number it means negative: `-3`.'],
    '*': ['Times', 'Multiplies: `3 * 4` is 12.'],
    '/': ['Divided by', 'Divides: `200 / 4` is 50. Careful: with whole numbers, `5 / 2` is 2!'],
    '%': ['Remainder', 'What\'s left over after dividing: `7 % 2` is 1. Useful for "every other one".'],
    '++': ['Add one', '`i++` is short for `i = i + 1`.'],
    '--': ['Take one away', '`i--` is short for `i = i - 1`.'],
    '+=': ['Add to', '`x += 5` is short for `x = x + 5`.'],
    '-=': ['Take from', '`x -= 5` is short for `x = x - 5`.'],
    ';': ['End of instruction', 'Like a full stop at the end of a sentence. Most lines need one!'],
    '{': ['Start of a block', 'Groups lines together. Everything up to the matching `}` belongs to the line above.'],
    '}': ['End of a block', 'Closes the group that `{` opened.'],
    '(': ['Brackets', 'Hold the **inputs** of a function, or the **question** of an `if`.'],
    ')': ['Brackets', 'Close the inputs or the question.'],
    '[': ['Box number', 'Picks a box from an array: `x[3]` is box number 3. Counting starts at 0.'],
    ']': ['Box number', 'Closes the box number.'],
    ',': ['Comma', 'Separates the inputs of a function.'],
    '.': ['Dot', 'Reaches **inside** an object: `ball.move()` asks the ball to move. (In a number, it\'s a decimal point.)'],
  };
  // no inherited keys, so words like toString or constructor in a sketch don't look like entries
  Object.setPrototypeOf(REF, null);
  Object.setPrototypeOf(SYMBOLS, null);
  CC.REF = REF;
  CC.SYMBOLS = SYMBOLS;

  // ---------- understanding a piece of code ----------
  const TYPE_WORDS = new Set(['int', 'float', 'boolean', 'color', 'String', 'char', 'void', 'PImage', 'let', 'const', 'var', 'double', 'long']);

  // Work out, for every token: which call it sits inside and which argument, plus what the sketch declares.
  CC.analyze = function (tokens) {
    const ctx = new Array(tokens.length);
    const stack = [];
    const decls = {};
    const sig = (i, dir) => { let j = i + dir; while (tokens[j] && (tokens[j].t === 'space' || tokens[j].t === 'comment')) j += dir; return j; };
    let line = 1;
    const lineOf = [];
    tokens.forEach((t, i) => { lineOf[i] = line; line += (t.s.match(/\n/g) || []).length; });

    tokens.forEach((t, i) => {
      const top = stack[stack.length - 1];
      ctx[i] = top ? { call: top, arg: top.arg, part: top.part } : {};
      if (t.s === '(') {
        const p = sig(i, -1);
        const prev = tokens[p];
        let name = prev && /^(func|keyword)$/.test(prev.t) ? prev.s : null;
        const before = tokens[sig(p, -1)];
        const isMethod = !!(before && before.s === '.');
        let owner = isMethod ? tokens[sig(sig(p, -1), -1)] : null;
        if (isMethod && owner && owner.s === 'console' && name === 'log') name = 'console.log';
        stack.push({ name, isMethod, owner: owner && owner.s, arg: 0, part: 0, count: 0, nameTok: p, hasContent: false });
      } else if (t.s === ')') {
        const c = stack.pop();
        if (c) c.count = c.hasContent ? c.arg + 1 : 0;
      } else if (top) {
        if (t.s === ',') top.arg++;
        else if (t.s === ';' && top.name === 'for') top.part++;
        else if (t.t !== 'space' && t.t !== 'comment') top.hasContent = true;
      }
    });
    // Declarations: TYPE NAME (= ; , ) or TYPE NAME (  or  class NAME, also TYPE[] NAME and ArrayList<X> NAME.
    tokens.forEach((t, i) => {
      if (!(TYPE_WORDS.has(t.s) || t.t === 'type' || (t.t === 'ident' && /^[A-Z]/.test(t.s)) || t.s === 'class' || t.s === 'function')) return;
      let j = sig(i, 1);
      if (t.s === 'class') { if (tokens[j]) decls[tokens[j].s] = { kind: 'class', line: lineOf[j] }; return; }
      if (tokens[j] && tokens[j].s === '<') { while (tokens[j] && tokens[j].s !== '>') j++; j = sig(j, 1); }
      if (tokens[j] && tokens[j].s === '[') { j = sig(sig(j, 1), 1); }
      const nameTok = tokens[j];
      if (!nameTok || !/^(ident|func)$/.test(nameTok.t)) return;
      const after = tokens[sig(j, 1)];
      if (!after) return;
      if (after.s === '(') {
        // a function definition: collect its parameter names
        if (decls[nameTok.s] && decls[nameTok.s].kind === 'function') return;
        const params = [];
        let k = sig(j, 1) + 1;
        while (tokens[k] && tokens[k].s !== ')') {
          if (tokens[k].t === 'ident' && tokens[sig(k, 1)] && /^[,)]$/.test(tokens[sig(k, 1)].s)) params.push(tokens[k].s);
          k++;
        }
        const isCtor = t.s === nameTok.s;
        decls[nameTok.s] = { kind: isCtor ? 'constructor' : 'function', returns: t.s, params, line: lineOf[j] };
        params.forEach((pn) => { if (!decls[pn]) decls[pn] = { kind: 'param', of: nameTok.s, line: lineOf[j] }; });
      } else if (/^[=;,)\]]$/.test(after.s)) {
        const array = tokens[sig(i, 1)] && tokens[sig(i, 1)].s === '[';
        if (!decls[nameTok.s]) decls[nameTok.s] = { kind: 'var', type: t.s, line: lineOf[j], array };
        // more names in the same line: float x, y, xSpeed;
        let k = sig(j, 1), depth = 0;
        while (tokens[k] && !(depth === 0 && (tokens[k].s === ';' || tokens[k].s === ')'))) {
          if (tokens[k].s === '(') depth++;
          else if (tokens[k].s === ')') depth--;
          else if (depth === 0 && tokens[k].s === ',') {
            const n = tokens[sig(k, 1)];
            if (!n || n.t !== 'ident') break;
            if (!decls[n.s]) decls[n.s] = { kind: 'var', type: t.s, line: lineOf[sig(k, 1)], array };
          }
          k++;
        }
      }
    });
    return { ctx, decls, lineOf, sig };
  };

  function sigFor(name, count) {
    const r = REF[name];
    if (!r || !r.sigs) return null;
    if (r.sigs[count]) return r.sigs[count];
    const keys = Object.keys(r.sigs).map(Number).sort((a, b) => b - a);
    return r.sigs[keys.find((k) => k <= count) ?? keys[keys.length - 1]];
  }
  const argColor = (k) => ['pink', 'yellow', 'green', 'blue', 'purple', 'orange'][k % 6];

  // A function signature drawn as coloured chips: ellipse( x , y , width , height )
  CC.sigChips = function (name, names, active) {
    return h('div.sig', h('span.sig-name', name), h('span.sig-p', '('),
      names.map((n, k) => [k ? h('span.sig-p', ', ') : null, h('span.sig-arg.' + argColor(k) + (k === active ? '.on' : ''), n)]),
      h('span.sig-p', ')'));
  };

  function colourSwatch(call, tokens, ctx) {
    if (!call || !['fill', 'background', 'stroke', 'color'].includes(call.name)) return null;
    // collect plain numbers of this call
    const nums = [];
    let ok = true;
    for (let i = call.nameTok + 2; i < tokens.length; i++) {
      if (ctx[i].call !== call) continue;          // inside a nested call, like random(255)
      const t = tokens[i];
      if (t.s === ')') break;
      if (t.t === 'number') nums[ctx[i].arg] = parseFloat(t.s);
      else if (t.t !== 'space' && t.s !== ',' && t.s !== '(' && t.t !== 'comment') ok = false;
    }
    if (!ok) return null;
    let r, g, b, a = 255;
    if (nums.length === 1 || nums.length === 2) { r = g = b = nums[0]; if (nums.length === 2) a = nums[1]; }
    else if (nums.length >= 3) { [r, g, b] = nums; if (nums.length === 4) a = nums[3]; } else return null;
    const hex = '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
    return h('div.pop-swatch', h('span.sw', { style: { background: 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')' } }),
      h('span', h('strong', 'This colour'), ' · red ' + r + ', green ' + g + ', blue ' + b + ' · hex ', h('code', hex)));
  }

  // Build the explanation card for token i. Returns {title, kicker, body[], actions[]}.
  CC.explain = function (tokens, i, analysis, opts = {}) {
    const t = tokens[i];
    const { ctx, decls, lineOf, sig } = analysis;
    const c = ctx[i] || {};
    const out = { kicker: '', title: '', body: [], actions: [], entry: null };
    const say = (text) => out.body.push(h('p', { html: md(text) }));
    const showLine = (line, note) => opts.onShowLine && out.actions.push(h('button.chip', { type: 'button', onclick: () => opts.onShowLine(line, note) }, CC.icon('eye'), 'Show line ' + line));

    if (t.t === 'comment') {
      out.kicker = 'Comment'; out.title = 'A note for humans';
      say('Everything after `//` is a **comment**. The computer skips it. Programmers use comments to explain their code.');
      if (/CHANGE ME/.test(t.s)) say('**CHANGE ME** means: try changing the numbers on this line!');
      if (/TODO/.test(t.s)) say('**TODO** means: a job for you to do.');
      return out;
    }
    if (t.t === 'string') {
      out.kicker = 'Text'; out.title = 'Words in quotes';
      say('Text in "double quotes" is a **String**: the computer treats it as words, not code. `\\n` inside it starts a new line.');
      return out;
    }
    if (t.t === 'number') {
      const v = t.s;
      out.kicker = 'Number'; out.title = v;
      const call = c.call;
      if (call && call.name === 'for') {
        say(['This number is part of the loop\'s **start**: where the counter begins.', 'This number is the loop\'s **limit**: keep going while the question is true.', 'This number is how much the counter changes **after each round**.'][c.part] || 'A number inside the loop brackets.');
      } else if (call && call.name && REF[call.name] && sigFor(call.name, call.count)) {
        const names = sigFor(call.name, call.count);
        const argName = names[c.arg];
        const meaning = argName && REF[call.name].args && REF[call.name].args[argName];
        out.body.push(CC.sigChips(call.name, names, c.arg));
        if (argName) say('This **' + v + '** is the **' + argName + '**' + (meaning ? ': ' + meaning + '.' : '.'));
        if (/^(red|green|blue)$/.test(argName)) say('Colour numbers go from **0** (none) to **255** (as much as possible).');
        if (argName === 'grey') say('One number means a grey: **0** is black, **255** is white.');
        if (argName === 'alpha') say('**alpha** is how see-through it is: 0 is invisible, 255 is solid.');
        const sw = colourSwatch(call, tokens, ctx);
        if (sw) out.body.push(sw);
      } else if (call && call.name && decls[call.name] && decls[call.name].params) {
        const d = decls[call.name];
        const p = d.params[c.arg];
        say('This **' + v + '** goes into `' + call.name + '()`' + (p ? ' as its parameter `' + p + '`.' : '.') + ' Each call can send different numbers: that\'s what parameters are for!');
        showLine(d.line, 'The recipe `' + call.name + '` is made here.');
      } else {
        const p1 = tokens[sig(i, -1)], p2 = tokens[sig(sig(i, -1), -1)];
        const p3 = tokens[sig(sig(sig(i, -1), -1), -1)];
        if (p1 && p1.s === '=' && p2 && p2.t === 'ident' && p3 && (TYPE_WORDS.has(p3.s) || p3.t === 'type')) say('The **starting value** that goes into the box `' + p2.s + '`.');
        else if (p1 && p1.s === '[') say('A **box number** (index) in an array. Counting starts at 0.');
        else if (p1 && p1.s === '=') say('The new value for `' + (p2 ? p2.s : 'the box') + '`.');
        else say('A number used in a calculation.');
      }
      if (/\./.test(v)) say('It has a decimal point, so it\'s a decimal (a `float`).');
      if (opts.scrub) say('*Drag me left or right to change me!*');
      return out;
    }
    if (t.t === 'punct') {
      const s = SYMBOLS[t.s];
      if (!s) return null;
      out.kicker = 'Symbol ' + t.s; out.title = s[0];
      say(s[1]);
      if (t.s === '(' && c.call === undefined) { /* nothing */ }
      return out;
    }

    // words
    const word = t.s;
    let key = word;
    const prev = tokens[sig(i, -1)];
    const isMethod = prev && prev.s === '.';
    const decl = decls[word];
    if (isMethod) {
      const ownerTok = tokens[sig(sig(i, -1), -1)];
      if (ownerTok && ownerTok.s === 'console' && word === 'log') key = 'console.log';
      else if (REF['.' + word] && !(decls[word] && decls[word].kind === 'function')) key = '.' + word;
      else {
        out.kicker = 'Method'; out.title = word + '()';
        say('`' + (ownerTok ? ownerTok.s : 'something') + '.' + word + '()` asks an **object** to do something. The steps are written in its **class**.');
        if (decl) showLine(decl.line, 'The method `' + word + '()` is written here.');
        return out;
      }
    }
    const entry = REF[key];
    const followedByParen = tokens[sig(i, 1)] && tokens[sig(i, 1)].s === '(';
    const isDefinition = prev && (TYPE_WORDS.has(prev.s) || prev.t === 'type');

    if (isDefinition && followedByParen && entry && ['setup', 'draw', 'mousePressed', 'keyPressed', 'keyReleased'].includes(word)) {
      out.entry = key; out.kicker = 'Special function'; out.title = word + '()';
      say(entry.say);
      if (entry.tip) say('**Tip:** ' + entry.tip);
      return out;
    }
    if (decl && (!entry || decl.kind !== 'var' || !['width', 'height'].includes(word))) {
      if (decl.kind === 'function' || decl.kind === 'constructor') {
        out.kicker = decl.kind === 'constructor' ? 'Constructor' : 'Your own function';
        out.title = word + '()';
        if (isDefinition || decl.kind === 'constructor' && prev && prev.s !== 'new') say(decl.kind === 'constructor' ? 'The **constructor**: the steps that build a new `' + word + '`.' : 'Here the recipe `' + word + '` is **defined**: its steps are inside the `{ }` below.' + (decl.returns !== 'void' ? ' It gives back a `' + decl.returns + '` answer with `return`.' : ''));
        else say('A function **made in this sketch** (not built into Processing). This line **calls** it: run the recipe!');
        if (decl.params.length) out.body.push(CC.sigChips(word, decl.params, -1));
        if (!isDefinition) showLine(decl.line, 'The recipe `' + word + '` is made here.');
        return out;
      }
      if (decl.kind === 'class') {
        out.kicker = 'Your own class'; out.title = word;
        say('A **class** made in this sketch: a blueprint for `' + word + '` objects.' + (prev && prev.s === 'new' ? ' `new ' + word + '(...)` builds one.' : ''));
        showLine(decl.line, 'The blueprint `' + word + '` starts here.');
        return out;
      }
      if (decl.kind === 'param') {
        out.kicker = 'Parameter'; out.title = word;
        say('`' + word + '` is a **parameter** of `' + decl.of + '()`: an ingredient name. It catches the value sent in each call.');
        return out;
      }
      if (decl.kind === 'var') {
        out.kicker = 'Your variable'; out.title = word;
        const typeTxt = { int: 'whole numbers', float: 'decimal numbers', boolean: '`true` or `false`', color: 'a colour', String: 'text', let: 'a value' }[decl.type] || 'a `' + decl.type + '`';
        say('`' + word + '` is a **variable** made in this sketch: a labelled box' + (decl.array ? 'es (an **array**)' : '') + ' holding ' + typeTxt + '.');
        if (isDefinition) say('This line **declares** it: makes the box.');
        else if (tokens[sig(i, 1)] && tokens[sig(i, 1)].s === '=') say('Here it **gets a new value**.');
        else say('Here the computer **reads** what\'s in the box.');
        showLine(decl.line, 'The box `' + word + '` is made here.');
        return out;
      }
    }
    if (entry) {
      out.entry = key;
      const asType = (word === 'int' || word === 'color') && !followedByParen;
      const asVar = (word === 'mousePressed' || word === 'keyPressed') && !followedByParen;
      out.kicker = entry.cat;
      out.title = followedByParen && entry.sigs ? key.replace(/^\./, '') + '()' : key.replace(/^\./, '');
      say(asType && entry.typeSay ? entry.typeSay : asVar && entry.varSay ? entry.varSay : entry.say);
      if (followedByParen && entry.sigs) {
        const call = (ctx[sig(i, 1) + 1] || {}).call;
        const names = sigFor(key, call ? call.count : 0);
        if (names && names.length) {
          out.body.push(CC.sigChips(key.replace(/^\./, ''), names, -1));
          if (entry.args) out.body.push(h('ul.arg-list', names.map((n, k) => entry.args[n] ? h('li', h('span.sig-arg.' + argColor(k), n), h('span', { html: md(entry.args[n]) })) : null)));
          const sw = call ? colourSwatch(call, tokens, ctx) : null;
          if (sw) out.body.push(sw);
        }
      }
      if (entry.tip) say('**Tip:** ' + entry.tip);
      return out;
    }
    if (t.t === 'ident' || t.t === 'func') {
      out.kicker = 'A name'; out.title = word;
      say('A name the programmer made up. Look for where it\'s made, like `int ' + word + '` or `void ' + word + '()`.');
      return out;
    }
    return null;
  };

  // ---------- the pop-up card ----------
  let pop = null;
  CC.closeExplain = function () { if (pop) { pop.remove(); pop = null; } };
  document.addEventListener('pointerdown', (e) => { if (pop && !pop.contains(e.target) && !e.target.closest('.code')) CC.closeExplain(); }, true);
  document.addEventListener('keydown', (e) => { if (pop && e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); CC.closeExplain(); } }, true);

  CC.showExplain = function (anchor, info) {
    CC.closeExplain();
    if (!info) return;
    pop = h('div.explain-pop', { role: 'dialog', 'aria-label': 'What this means' },
      h('div.pop-head', h('span.pop-kicker', info.kicker), h('button.pop-close', { type: 'button', 'aria-label': 'Close', onclick: CC.closeExplain }, CC.icon('close'))),
      h('div.pop-title', info.title),
      h('div.pop-body', info.body),
      h('div.pop-actions', info.actions,
        info.entry ? h('a.chip', { href: '#/learn/dictionary/' + encodeURIComponent(info.entry), onclick: CC.closeExplain }, CC.icon('book'), 'Dictionary') : null,
        info.entry && CC.REFDOC && CC.REFDOC.anchorFor(info.entry) ? h('a.chip', { href: '#/reference/' + CC.REFDOC.anchorFor(info.entry), onclick: CC.closeExplain }, CC.icon('external'), 'Processing reference') : null));
    document.body.append(pop);
    const r = anchor.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = Math.min(Math.max(12, r.left + r.width / 2 - pw / 2), innerWidth - pw - 12);
    let top = r.bottom + 10;
    if (top + ph > innerHeight - 12) top = Math.max(12, r.top - ph - 10);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    CC.sound.blip();
  };

  // ---------- dictionary page ----------
  CC.dictionaryPage = function (selected) {
    const keys = Object.keys(REF);
    const cats = [...new Set(keys.map((k) => REF[k].cat))];
    const search = h('input.dict-search', { type: 'search', placeholder: 'Search: fill, mouseX, for...', 'aria-label': 'Search the dictionary' });
    const list = h('nav.dict-list');
    const detail = h('article.dict-detail');
    let player = null;

    function renderList(q) {
      q = (q || '').toLowerCase();
      list.replaceChildren(...cats.map((cat) => {
        const items = keys.filter((k) => REF[k].cat === cat && (!q || k.toLowerCase().includes(q) || REF[k].say.toLowerCase().includes(q)));
        if (!items.length) return null;
        return h('div.dict-group', h('h3', cat), items.map((k) => h('a.dict-item' + (k === selected ? '.on' : ''), { href: '#/learn/dictionary/' + encodeURIComponent(k) }, k.replace(/^\./, '.') + (REF[k].sigs && !/^[A-Z]/.test(k) ? '()' : ''))));
      }).filter(Boolean));
    }
    function renderDetail(k) {
      if (player) { player.destroy(); player = null; }
      const e = k ? REF[k] : null;   // REF[null] would find the entry for the word "null"
      if (!e) {
        detail.replaceChildren(h('div.dict-welcome', CC.cloud('yellow', 'Code dictionary', 'small'),
          h('p.lead', 'Every word in our code, explained. Pick one from the list, or search.'),
          h('p.muted', 'Tip: in any code on the slides, **click a word** to see its card.'.replace(/\*\*/g, '')),
          h('div.dict-symbols', h('h3', 'Symbols'), h('div.sym-grid', Object.entries(SYMBOLS).map(([s, [name, text]]) => h('div.sym-card', h('code.sym', s), h('strong', name), h('span', { html: md(text) })))))));
        return;
      }
      const names = e.sigs ? sigFor(k, Math.max(...Object.keys(e.sigs).map(Number))) : null;
      const all = e.sigs ? Object.keys(e.sigs).map(Number).sort((a, b) => a - b) : [];
      detail.replaceChildren(...[
        h('p.kicker.green', e.cat),
        h('h2.dict-title', k.replace(/^\./, '.') + (e.sigs && !/^[A-Z]/.test(k) ? '()' : '')),
        h('p.lead', { html: md(e.say) }),
        e.typeSay ? h('p', { html: md('**As a type:** ' + e.typeSay) }) : null,
        e.varSay ? h('p', { html: md('**As a variable:** ' + e.varSay) }) : null,
        all.length ? h('div.dict-sigs', all.map((n) => CC.sigChips(k.replace(/^\./, ''), e.sigs[n], -1))) : null,
        e.args && names ? h('ul.arg-list', Object.entries(e.args).map(([n, txt]) => {
          const idx = Math.max(0, ...all.map((cnt) => e.sigs[cnt].indexOf(n)));
          return h('li', h('span.sig-arg.' + argColor(idx), n), h('span', { html: md(txt) }));
        })) : null,
        e.tip ? h('div.analogy', CC.icon('bulb'), h('div', h('strong', 'Tip'), h('p', { html: md(e.tip) }))) : null,
        e.example ? h('div.dict-example', h('h3', 'Try it'), h('div.dict-player')) : null,
        CC.REFDOC && CC.REFDOC.anchorFor(k) ? h('p', h('a.chip', { href: '#/reference/' + CC.REFDOC.anchorFor(k) }, CC.icon('book'), 'Full Processing reference for ' + k)) : null,
        e.see ? h('p.dict-see', h('strong', 'See also: '), e.see.filter((s) => REF[s] || SYMBOLS[s]).map((s) => REF[s] ? h('a.chip', { href: '#/learn/dictionary/' + encodeURIComponent(s) }, s) : h('span.chip', s))) : null].filter(Boolean));
      if (e.example) {
        player = CC.Player({ source: e.example, name: 'example_' + k.replace(/\W/g, '') });
        detail.querySelector('.dict-player').append(player.el);
        player.enter();
      }
    }
    search.addEventListener('input', () => renderList(search.value));
    renderList('');
    renderDetail(selected);
    return h('div.dictionary', h('aside.dict-side', search, list), detail);
  };
})();
