// Module 7: Functions. Lesson plan: modules/07-functions.md
CC.deck({
  id: '07', num: 7, title: 'Functions', color: 'green', icon: 'recipe',
  bigIdea: 'A function is a **recipe with a name**. Write it once, use it many times, with different ingredients.',
  kidIdea: 'Write your own commands. Build a whole village.',
  sessions: '2 sessions',
  plan: 'modules/07-functions.html',
  sketches: ['m07a_my_first_function', 'm07b_function_with_parameters', 'm07c_function_that_answers'],
  slides: [
    { type: 'title' },
    {
      type: 'big', kicker: 'The pizza recipe',
      statement: 'Name the recipe once. Make it many times.',
      text: 'To make 3 pizzas, you don\'t rewrite the recipe 3 times. You just say *"make a pizza"* three times. Want different toppings? Those are **parameters**: `makePizza(topping)`.',
      art: 'recipe',
    },
    {
      type: 'code', title: 'My first function',
      sketch: 'm07a_my_first_function',
      spotlight: [
        { from: 'void drawHouse', note: '**Define** the recipe: `void drawHouse() { ... }` holds the steps.' },
        { find: 'drawHouse();', note: '**Call** the recipe: this one line runs all the steps.' },
      ],
      notes: 'Live demo (10 min): call it twice. The houses land on top of each other: same coordinates! Then add (x, y) parameters.',
    },
    {
      type: 'tasks', title: 'Use the recipe',
      sketch: 'm07a_my_first_function', timer: 20,
      items: [
        'Call `drawHouse()` twice. Why are the houses on top of each other?',
        'Change the colours inside the function. What happens to **all** houses?',
        'Add a window to the recipe.',
      ],
    },
    {
      type: 'challenge', title: 'One recipe, five times',
      text: 'Make **one recipe** (a tree, cloud, car, flower or monster). Call it **five times**.',
      rules: ['Give it a good name: `drawTree()`', 'Define it once', 'Call it five times'],
      minutes: 15,
    },
    {
      type: 'code', title: 'Parameters: the ingredients',
      sketch: 'm07b_function_with_parameters',
      text: 'Session B. Drag the numbers in the three calls.',
      spotlight: [
        { find: 'drawHouse(40', note: 'Three calls, three different sets of ingredients: x, y and size.' },
        { find: 'void drawHouse(float x', note: '`x`, `y` and `s` are the **parameter** names. They catch the numbers from each call.' },
        { find: ['rect(x, y', 'triangle(x'], note: 'Everything is built **relative to** x, y and s, so each house can move and resize.' },
      ],
    },
    {
      type: 'list', kicker: 'Two words', title: 'Define and call',
      points: [
        '**Define** = write the recipe: `void drawHouse(float x, float y, float s) { ... }`',
        '**Call** = cook it: `drawHouse(40, 150, 100);`',
        '**Parameters** are the ingredient names (`x`, `y`, `s`).',
        '**Arguments** are the real values you pass (`40`, `150`, `100`).',
        '`void` means the recipe gives nothing back.',
      ],
    },
    {
      type: 'code', title: 'A function that answers',
      sketch: 'm07c_function_that_answers',
      text: 'Hover over the button.',
      spotlight: [
        { find: 'boolean overButton', note: 'Instead of `void`, this function promises a `boolean` answer.' },
        { find: 'return', note: '`return` sends the answer back: true or false.' },
        { find: 'if (overButton', note: 'Ask the function a question inside an `if`!' },
      ],
    },
    {
      type: 'challenge', title: 'Village, forest or city',
      text: 'Build a scene from your own recipes.',
      rules: ['At least **two** of your own functions', 'Each one called **3 or more** times', 'With parameters, so each copy is different'],
      stretch: 'A recipe that calls another recipe: `drawStreet()` calls `drawHouse()`.',
      minutes: 30,
    },
    {
      type: 'debug', name: 'recipe_bugs',
      code: `
void setup() {
  size(400, 400);
  drawTree(100, 100);
  drawTree(200);               // too many or too few?
}

void drawTree(float x, float y) {
  rect(x, y, 20, 60);
  ellipse(x + 10, y, 80, 80);
}
`,
      bugs: [
        { line: 4, fix: '`drawTree` needs **two** arguments (x and y), but this call gives only one.', message: 'A red message saying drawTree is not applicable for these arguments', messageLabel: 'You\'ll see' },
      ],
      notes: 'Also try: define a function but never call it ("Nothing happens!"), and call it with a misspelt name. Common mistake: writing `void` before a call.',
    },
    {
      type: 'vocab',
      words: [['function', 'A named recipe of steps'], ['define', 'Write the recipe'], ['call', 'Run the recipe'], ['parameter', 'An ingredient name, like `x`'],
        ['argument', 'The real value you pass, like `40`'], ['return', 'Send an answer back'], ['void', 'Gives nothing back']],
    },
    {
      type: 'ican',
      items: ['write a function and call it.', 'use parameters to change position and size.', 'explain what `return` does.', 'build a scene from my own functions.'],
    },
  ],
});
