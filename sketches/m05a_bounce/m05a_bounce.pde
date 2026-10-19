// MODULE 5 - Conditionals: if the ball touches a wall, turn around
float x = 200;
float y = 100;
float xSpeed = 3;      // CHANGE ME
float ySpeed = 2;      // CHANGE ME
float r = 25;          // radius

void setup() {
  size(400, 400);
}

void draw() {
  background(255);

  x = x + xSpeed;
  y = y + ySpeed;

  if (x > width - r || x < r) {      // touching left or right wall?
    xSpeed = -xSpeed;                // flip direction
  }
  if (y > height - r || y < r) {     // touching top or bottom wall?
    ySpeed = -ySpeed;
  }

  fill(80, 160, 255);
  ellipse(x, y, r * 2, r * 2);
}
