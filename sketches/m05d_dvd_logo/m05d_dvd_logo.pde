// MODULE 5 - Coding Train Challenge #131: the bouncing DVD logo
// The logo bounces off all four walls and changes colour every time it hits one.
// Question to argue about: will it EVER hit a corner exactly?
float x = 100;
float y = 50;
float xSpeed = 3;      // CHANGE ME
float ySpeed = 2;      // CHANGE ME
float w = 100;         // CHANGE ME: logo width
float h = 50;          // logo height
int hits = 0;          // which colour we're on: 0, 1 or 2

void setup() {
  size(500, 400);
}

void draw() {
  background(0);

  // 1. move
  x = x + xSpeed;
  y = y + ySpeed;

  // 2. bounce. rect() uses the TOP-LEFT corner, so the right edge is x + w
  if (x + w > width || x < 0) {
    xSpeed = -xSpeed;
    hits = hits + 1;
  }
  if (y + h > height || y < 0) {
    ySpeed = -ySpeed;
    hits = hits + 1;
  }
  if (hits > 2) {      // only 3 colours, so go back to the first one
    hits = 0;
  }

  // 3. pick the colour
  if (hits == 0) {
    fill(255, 80, 80);       // CHANGE ME: your three colours
  } else if (hits == 1) {
    fill(80, 255, 120);
  } else {
    fill(90, 150, 255);
  }

  // 4. draw
  noStroke();
  rect(x, y, w, h, 12);      // the 5th number rounds the corners
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("DVD", x + w / 2, y + h / 2);
}
