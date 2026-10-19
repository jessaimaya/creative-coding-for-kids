// MODULE 8 - random(): controlled surprise. Click for new confetti.
void setup() {
  size(500, 400);
  noLoop();                      // draw once, then wait
}

void draw() {
  background(20);
  noStroke();
  for (int i = 0; i < 200; i++) {                    // CHANGE ME: how many pieces
    fill(random(255), random(255), random(255));
    float s = random(5, 30);
    rect(random(width), random(height), s, s);
  }
}

void mousePressed() {
  redraw();                      // run draw() one more time
}
