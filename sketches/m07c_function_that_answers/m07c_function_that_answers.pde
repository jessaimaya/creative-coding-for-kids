// MODULE 7 - A function can ANSWER a question (it returns a value)
boolean overButton(float bx, float by, float bw, float bh) {
  return mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;
}

void setup() {
  size(400, 400);
}

void draw() {
  background(255);

  if (overButton(100, 150, 200, 100)) {       // ask the function
    fill(255, 150, 0);
  } else {
    fill(200);
  }
  rect(100, 150, 200, 100);
  fill(0);
  text("Hover me!", 170, 205);

  // CHALLENGE: add a second button using the SAME function.
}
