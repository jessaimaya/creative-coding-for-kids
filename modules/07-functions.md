# Module 7: Functions

**Big idea:** A function is a recipe with a name. Write the steps once, then run it as many times as you like, each time with different ingredients (parameters).
**Time:** 2 sessions. **Sketches:** `m07a_my_first_function`, `m07b_function_with_parameters`, `m07c_function_that_answers`.

```java
void drawHouse(float x, float y, float s) {
  // steps that use x, y, s
}

drawHouse(40, 150, 100);   // run the recipe
```

## By the end, learners can
- [ ] Write a function with no parameters and call it.
- [ ] Add parameters and call it with different values.
- [ ] Explain the difference between *defining* a function and *calling* it.
- [ ] Write a function that returns an answer (`boolean`, `float`, `int`).
- [ ] Break a messy sketch into 3-4 well-named functions.

## Vocabulary
**function**, **call**, **define**, **parameter** (the ingredient names in the recipe), **argument** (the actual values you pass), **return**, **`void`** (returns nothing).

## Session A: functions you call

### 0. Hook: the pizza recipe (10 min)
Write "Make a pizza" on the board: dough, sauce, cheese. "If I want 3 pizzas, do I rewrite the recipe 3 times? No. I *name* the recipe and say 'make a pizza' three times." Then: "What if I want different toppings? That's a **parameter**: `makePizza(topping)`."

### 1. Live demo (10 min)
1. Start with a 3-line house drawn directly in `setup()`.
2. Move it into `void drawHouse() { ... }` and call it. Same result, but now it has a *name*.
3. Call it twice. Both houses appear *on top of each other*. "Same coordinates!"
4. Add `(x, y)` parameters. Now they're apart.

### 2. Modify (20 min): `m07a_my_first_function`
1. Call the function twice. Why are they on top of each other?
2. Change the house colours inside the function. What happens to all houses?
3. Add a window to the function.

### 3. Create (15 min)
Make **one recipe** (tree, cloud, car, flower, monster). Call it five times in different places.

## Session B: parameters and answers

### 4. Parameters (20 min): `m07b_function_with_parameters`
- Add size `s` and notice how everything is built *relative to* `x`, `y`, `s`.
- Add a 4th parameter for colour.
- Compare: "How many lines would this have without a function?"

### 5. Functions that answer (10 min): `m07c_function_that_answers`
`overButton(...)` returns `true` or `false`. Use it in `if (overButton(...))`. "A function can ask a question *for you*."

### 6. Create (30 min): village / forest / city
Build a scene from **at least two of your own recipes**, each called 3 or more times, with parameters. Stretch: a recipe that calls another recipe (`drawStreet` calls `drawHouse`).

## Debug It!
```java
void setup() {
  size(400, 400);
  drawTree(100, 100);          // too many / too few arguments?
  drawTree(200);
}

void drawTree(float x, float y) {
  rect(x, y, 20, 60);
  ellipse(x + 10, y, 80, 80);
}
```
Also: define a function but never call it ("Nothing happens!") and call a function with a misspelt name.

## Common mistakes
- Defining a function and forgetting to call it.
- Wrong number or order of arguments.
- Variables made inside a function can't be seen outside it (**scope**), e.g. using `s` in `setup()`.
- Forgetting `return` in a function that promises an answer.
- Putting `void` before the *call* (`void drawHouse(40, 150, 100);`).

## I can...
- [ ] ...write a function and call it.
- [ ] ...use parameters to change position and size.
- [ ] ...explain what `return` does.
- [ ] ...use my own functions to build a scene.

## In the books
- **Nyhoff**: Ch. 7 *Creating void Functions* and Ch. 8 *Creating Functions That Return a Value*.
- **Cermak-Sassenrath**: Ch. 14 *Functions*; Ch. 24 *Programming Rules of Thumb* (code organisation).
- **Meyer**: Ch. 1 introduces functions; the later chapters keep building sketches from them.
- **Noble**: Ch. 8 *Multilevel architectures*, which organise sketches by levels and states.
