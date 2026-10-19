// MODULE 9 - Classes: a blueprint, then many things built from it
class Ball {
  float x, y, xSpeed, ySpeed, r;
  color c;

  Ball(float x, float y) {              // the constructor builds a new Ball
    this.x = x;
    this.y = y;
    xSpeed = random(-3, 3);
    ySpeed = random(-3, 3);
    r = random(10, 30);
    c = color(random(255), random(255), random(255));
  }

  void move() {
    x = x + xSpeed;
    y = y + ySpeed;
    if (x > width - r || x < r) xSpeed = -xSpeed;
    if (y > height - r || y < r) ySpeed = -ySpeed;
  }

  void show() {
    fill(c);
    ellipse(x, y, r * 2, r * 2);
  }
}

Ball[] balls = new Ball[20];            // CHANGE ME: how many balls?

void setup() {
  size(500, 400);
  for (int i = 0; i < balls.length; i++) {
    balls[i] = new Ball(random(width), random(height));
  }
}

void draw() {
  background(255);
  for (int i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].show();
  }
}
