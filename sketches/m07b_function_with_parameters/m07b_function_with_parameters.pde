// MODULE 7 - Parameters: the ingredients you can change each time
void setup() {
  size(500, 300);
  background(135, 206, 250);
  noStroke();
  fill(80, 170, 80);
  rect(0, 220, 500, 80);

  drawHouse(40, 150, 100);        // x, y, size
  drawHouse(200, 150, 140);
  drawHouse(400, 150, 70);
}

void drawHouse(float x, float y, float s) {
  fill(230, 200, 150);
  rect(x, y + s * 0.5, s, s * 0.8);              // walls (relative to x, y, s)
  fill(180, 60, 60);
  triangle(x - 10, y + s * 0.5, x + s / 2, y, x + s + 10, y + s * 0.5);
}

// CHALLENGE: add a 4th parameter for the roof colour.
