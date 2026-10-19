// MODULE 8 - Coding Train Challenge #76: 10 PRINT
// A famous program from 1982 that fitted on ONE line of a Commodore 64.
// For every square, flip a coin: heads draws \ and tails draws /. A maze appears!
// Click for a new maze. Press S to save a picture.
float spacing = 20;       // CHANGE ME: size of each square
float chance = 0.5;       // CHANGE ME: 0.5 is a fair coin. Try 0.1 and 0.9

void setup() {
  size(400, 400);
  noLoop();               // draw once, then wait for a click
}

void draw() {
  background(40, 40, 140);
  stroke(170, 170, 255);
  strokeWeight(3);
  for (float y = 0; y < height; y = y + spacing) {        // each row...
    for (float x = 0; x < width; x = x + spacing) {       // ...each square in the row
      if (random(1) < chance) {
        line(x, y, x + spacing, y + spacing);             // backslash \
      } else {
        line(x, y + spacing, x + spacing, y);             // forward slash /
      }
    }
  }
}

void mousePressed() {
  redraw();
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    saveFrame("10print-###.png");
  }
}
