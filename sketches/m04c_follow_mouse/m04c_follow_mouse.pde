// MODULE 4 - Chase the mouse
// mouseX and mouseY are variables the computer updates for you.
float x = 200;
float y = 200;
float ease = 0.1;        // CHANGE ME: 0.01 = lazy, 0.5 = eager, 1 = glued to the mouse

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  x = x + (mouseX - x) * ease;     // move a fraction of the way to the mouse
  y = y + (mouseY - y) * ease;
  fill(255, 100, 150);
  ellipse(x, y, 50, 50);
}
