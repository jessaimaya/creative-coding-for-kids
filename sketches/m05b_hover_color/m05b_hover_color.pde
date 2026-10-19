// MODULE 5 - if / else: ask a question, choose a result
void setup() {
  size(400, 400);
}

void draw() {
  background(255);

  float d = dist(mouseX, mouseY, 200, 200);   // distance from mouse to the circle's centre

  if (d < 80) {                // is the mouse inside the circle?
    fill(255, 80, 80);         // YES -> red
  } else {
    fill(80, 80, 255);         // NO  -> blue
  }
  ellipse(200, 200, 160, 160);

  // CHALLENGE: add a third colour when the mouse is VERY close (d < 30).
  // Hint: use  else if
}
